/**
 * PostMimic - LinkedIn Style Cloner & Multi-Agent Studio
 * Frontend Application Controller
 */

// Global State
let state = {
  token: localStorage.getItem("postmimic_token") || null,
  user: null,
  currentTab: "studio",
  historicPosts: [],
  filteredHistoricPosts: [],
  styleProfile: null,
  currentPost: null,
  activeAttemptIndex: 0,
  drafts: [],
  isGenerating: false
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Check auth session or auto-login with demo for instant access
  if (state.token) {
    try {
      await fetchCurrentUser();
    } catch (e) {
      console.warn("Session expired, loading demo session...", e);
      await loginDemo(false);
    }
  } else {
    // Automatically login as Mohan demo so user can test immediately
    await loginDemo(false);
  }

  await loadAllData();
});

// --- API Helpers ---
async function apiCall(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) {
    headers["Authorization"] = `Bearer ${state.token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "API request failed");
  }
  return data;
}

// --- Auth Functions ---
async function fetchCurrentUser() {
  const data = await apiCall("/api/auth/me");
  state.user = data.user;
  updateUserUI();
}

async function loginDemo(showToastMsg = true) {
  try {
    const data = await apiCall("/api/auth/demo-login", "POST");
    state.token = data.user.token;
    state.user = data.user;
    localStorage.setItem("postmimic_token", state.token);
    updateUserUI();
    closeAuthModal();
    if (showToastMsg) {
      showToast("Logged in as Mohan Sharma (Tech Creator Demo)", "success");
    }
    await loadAllData();
  } catch (e) {
    showToast(e.message, "error");
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const data = await apiCall("/api/auth/login", "POST", { email, password });
    state.token = data.user.token;
    state.user = data.user;
    localStorage.setItem("postmimic_token", state.token);
    updateUserUI();
    closeAuthModal();
    showToast(`Welcome back, ${state.user.full_name}!`, "success");
    await loadAllData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const full_name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const linkedin_url = document.getElementById("reg-linkedin").value.trim();

  try {
    const data = await apiCall("/api/auth/register", "POST", {
      full_name,
      email,
      password,
      linkedin_url
    });
    state.token = data.user.token;
    state.user = data.user;
    localStorage.setItem("postmimic_token", state.token);
    updateUserUI();
    closeAuthModal();
    showToast("Account created successfully with starter posts!", "success");
    await loadAllData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

function logout() {
  localStorage.removeItem("postmimic_token");
  state.token = null;
  state.user = null;
  showToast("Logged out successfully.", "info");
  openAuthModal();
}

function updateUserUI() {
  if (state.user) {
    document.getElementById("nav-user-avatar").src = state.user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
    document.getElementById("nav-user-name").innerText = state.user.full_name;
    document.getElementById("preview-avatar").src = state.user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
    document.getElementById("preview-author-name").innerText = state.user.full_name;
    document.getElementById("preview-author-headline").innerText = state.user.headline || "LinkedIn Content Creator";

    const handle = state.user.linkedin_url ? state.user.linkedin_url.split("/in/")[1] || state.user.full_name : state.user.full_name;
    document.getElementById("nav-linkedin-handle").innerText = `Connected: ${handle.replace(/\/$/, '')}`;
    
    document.getElementById("user-header-section").classList.remove("hidden");
    document.getElementById("auth-header-btn").classList.add("hidden");
  } else {
    document.getElementById("user-header-section").classList.add("hidden");
    document.getElementById("auth-header-btn").classList.remove("hidden");
  }
}

// --- Data Loading ---
async function loadAllData() {
  if (!state.token) return;
  try {
    await Promise.all([
      loadHistoricPosts(),
      loadStyleProfile(),
      loadDrafts()
    ]);
  } catch (e) {
    console.error("Error loading data:", e);
  }
}

async function loadHistoricPosts() {
  const data = await apiCall("/api/posts/historic");
  state.historicPosts = data.posts || [];
  state.filteredHistoricPosts = [...state.historicPosts];
  
  document.getElementById("nav-historic-count").innerText = state.historicPosts.length;
  document.getElementById("historic-count-badge").innerText = `${state.historicPosts.length} Posts`;

  renderHistoricPosts();
}

async function loadStyleProfile() {
  const data = await apiCall("/api/style");
  state.styleProfile = data.style;
  renderStyleProfile();
}

async function loadDrafts() {
  const data = await apiCall("/api/drafts");
  state.drafts = data.drafts || [];
  renderDrafts();
}

// --- Navigation Tabs ---
function switchTab(tabName) {
  state.currentTab = tabName;
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.getElementById(`tab-${tabName}`).classList.remove("hidden");

  // Tab Button Styling
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("bg-sky-600", "text-white", "shadow-sm");
    btn.classList.add("text-slate-400");
  });
  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add("bg-sky-600", "text-white", "shadow-sm");
    activeBtn.classList.remove("text-slate-400");
  }

  if (window.lucide) lucide.createIcons();
}

// --- Multi-Agent Studio Generation ---
function setTopic(text) {
  document.getElementById("gen-topic").value = text;
}

async function startGeneration() {
  if (state.isGenerating) return;

  const topic = document.getElementById("gen-topic").value.trim();
  if (!topic) {
    showToast("Please enter a topic or click an inspiration pill.", "error");
    return;
  }

  const length = document.getElementById("gen-length").value;
  const language = document.getElementById("gen-language").value;
  const max_attempts = parseInt(document.getElementById("gen-max-attempts").value) || 3;

  state.isGenerating = true;
  const genBtn = document.getElementById("btn-generate");
  genBtn.disabled = true;
  genBtn.classList.add("opacity-50", "cursor-not-allowed");

  const statusBox = document.getElementById("agent-status-box");
  const statusTitle = document.getElementById("agent-status-title");
  const statusDetail = document.getElementById("agent-status-detail");
  statusBox.classList.remove("hidden");

  statusTitle.innerText = "Writer Agent Drafting Post...";
  statusDetail.innerText = "Applying Style DNA & few-shot examples from your 10-15 historic posts...";

  try {
    // Simulating progress step indicator while server runs the loop
    setTimeout(() => {
      if (state.isGenerating) {
        statusTitle.innerText = "Reviewer Agent Auditing Draft...";
        statusDetail.innerText = "Checking hook tension, whitespace spacing, length, and authentic voice...";
      }
    }, 3500);

    const res = await apiCall("/api/generate", "POST", {
      topic,
      length,
      language,
      max_attempts
    });

    state.currentPost = res.data;
    state.activeAttemptIndex = (state.currentPost.trace || []).length - 1;

    renderAgentTrace();
    renderLinkedInPreview(state.currentPost.final_post);
    loadDrafts(); // refresh drafts list

    showToast(
      state.currentPost.is_approved
        ? `Post Approved after ${state.currentPost.total_attempts} attempt(s)!`
        : `Completed ${state.currentPost.total_attempts} attempts. Ready for review.`,
      "success"
    );

    // Show Human-in-the-loop box
    document.getElementById("human-refine-box").classList.remove("hidden");

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    state.isGenerating = false;
    genBtn.disabled = false;
    genBtn.classList.remove("opacity-50", "cursor-not-allowed");
    statusBox.classList.add("hidden");
  }
}

async function submitHumanFeedback() {
  if (!state.currentPost) return;
  const feedbackInput = document.getElementById("human-feedback-input");
  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    showToast("Please enter feedback for the revision.", "error");
    return;
  }

  showToast("Re-running Writer & Reviewer agents with your feedback...", "info");

  try {
    const res = await apiCall(`/api/generate/${state.currentPost.id}/refine`, "POST", {
      feedback
    });

    state.currentPost = res.data;
    state.activeAttemptIndex = (state.currentPost.trace || []).length - 1;

    renderAgentTrace();
    renderLinkedInPreview(state.currentPost.final_post);
    feedbackInput.value = "";
    showToast("Draft updated based on your feedback!", "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function renderAgentTrace() {
  if (!state.currentPost || !state.currentPost.trace) return;
  const trace = state.currentPost.trace;

  // Render Attempt Tabs
  const tabSelector = document.getElementById("attempts-tab-selector");
  tabSelector.innerHTML = "";

  trace.forEach((step, idx) => {
    const isHuman = step.is_human_refinement;
    const isApproved = step.verdict === "APPROVED";
    const btn = document.createElement("button");
    btn.className = `px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
      idx === state.activeAttemptIndex
        ? "bg-dark-700 text-white border border-slate-600 shadow-sm"
        : "text-slate-400 hover:text-slate-200 hover:bg-dark-800"
    }`;
    btn.onclick = () => {
      state.activeAttemptIndex = idx;
      renderAgentTrace();
    };

    const icon = isApproved ? "check-circle" : (isHuman ? "user" : "git-commit");
    const color = isApproved ? "text-emerald-400" : (isHuman ? "text-sky-400" : "text-amber-400");
    const label = isHuman ? `Revision #${step.attempt}` : `Attempt #${step.attempt}`;

    btn.innerHTML = `
      <i data-lucide="${icon}" class="w-3.5 h-3.5 ${color}"></i>
      <span>${label}</span>
      <span class="text-[10px] px-1 rounded ${isApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${step.score}/100</span>
    `;
    tabSelector.appendChild(btn);
  });

  // Render Active Step Details
  const step = trace[state.activeAttemptIndex] || trace[0];
  const container = document.getElementById("iteration-detail-container");

  const isApproved = step.verdict === "APPROVED";
  const checks = step.criteria_breakdown || {};

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Step Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-dark-900 border border-slate-800">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 text-xs font-bold rounded-full ${
            isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }">
            VERDICT: ${step.verdict}
          </span>
          <span class="text-xs text-slate-400">Quality Score: <strong class="text-white">${step.score}/100</strong></span>
          ${step.is_human_refinement ? '<span class="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Human Feedback Applied</span>' : ''}
        </div>

        <button onclick="renderLinkedInPreview(state.currentPost.trace[${state.activeAttemptIndex}].draft)" class="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium">
          <i data-lucide="eye" class="w-3.5 h-3.5"></i>
          <span>Preview in LinkedIn Card</span>
        </button>
      </div>

      ${step.user_feedback ? `
        <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
          <span class="font-semibold text-purple-300">Your Instructions to Writer Agent:</span>
          <p class="text-slate-300 mt-1">"${step.user_feedback}"</p>
        </div>
      ` : ''}

      <!-- Reviewer Critique -->
      <div class="p-3.5 rounded-xl bg-dark-750 border border-slate-800">
        <div class="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5">
          <i data-lucide="shield-alert" class="w-4 h-4"></i>
          <span>Senior Editorial Reviewer Critique:</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed font-sans">${step.feedback}</p>
      </div>

      <!-- Criteria Breakdown Pills -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-dark-900 border border-slate-800">
          <i data-lucide="${checks.hook ? 'check' : 'x'}" class="w-3.5 h-3.5 ${checks.hook ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span class="text-slate-300">Hook Stopping Power</span>
        </div>
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-dark-900 border border-slate-800">
          <i data-lucide="${checks.clear_value ? 'check' : 'x'}" class="w-3.5 h-3.5 ${checks.clear_value ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span class="text-slate-300">Clear Core Takeaway</span>
        </div>
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-dark-900 border border-slate-800">
          <i data-lucide="${checks.skimmability ? 'check' : 'x'}" class="w-3.5 h-3.5 ${checks.skimmability ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span class="text-slate-300">Short Line Spacing</span>
        </div>
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-dark-900 border border-slate-800">
          <i data-lucide="${checks.length_pacing ? 'check' : 'x'}" class="w-3.5 h-3.5 ${checks.length_pacing ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span class="text-slate-300">Length & Pacing</span>
        </div>
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-dark-900 border border-slate-800">
          <i data-lucide="${checks.tone_authenticity ? 'check' : 'x'}" class="w-3.5 h-3.5 ${checks.tone_authenticity ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span class="text-slate-300">Authentic Human Tone</span>
        </div>
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-dark-900 border border-slate-800">
          <i data-lucide="${checks.cta_ending ? 'check' : 'x'}" class="w-3.5 h-3.5 ${checks.cta_ending ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span class="text-slate-300">Ending CTA Question</span>
        </div>
      </div>

      <!-- Writer Agent Draft Output Box -->
      <div class="p-3.5 rounded-xl bg-dark-900 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
        ${step.draft}
      </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function renderLinkedInPreview(text) {
  if (!text) return;
  const bodyEl = document.getElementById("preview-post-body");
  bodyEl.innerText = text;

  // Update stats
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split("\n").filter(l => l.trim()).length;
  const readSec = Math.max(10, Math.round((words / 200) * 60));

  document.getElementById("stat-chars").innerText = chars;
  document.getElementById("stat-words").innerText = words;
  document.getElementById("stat-lines").innerText = lines;
  document.getElementById("stat-time").innerText = `~${readSec}s`;

  // Randomize realistic reactions count
  const baseLikes = Math.floor(Math.random() * 400) + 180;
  document.getElementById("preview-likes-count").innerText = `${baseLikes} reactions`;
}

function copyGeneratedPost() {
  const text = document.getElementById("preview-post-body").innerText;
  if (!text || text.includes("Your generated LinkedIn post will appear here")) {
    showToast("No generated post to copy yet.", "info");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast("Post copied to clipboard with exact line breaks!", "success");
  });
}

function savePostToDrafts() {
  showToast("Post is safely archived in your Drafts & Trace History!", "success");
  switchTab("drafts");
}

// --- Historic Posts Functions ---
function renderHistoricPosts() {
  const grid = document.getElementById("historic-posts-grid");
  grid.innerHTML = "";

  if (state.filteredHistoricPosts.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 glass-panel rounded-2xl border border-slate-800">
        <i data-lucide="inbox" class="w-10 h-10 mx-auto text-slate-500 mb-2"></i>
        <p class="text-xs text-slate-400">No historic posts found matching filter.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  state.filteredHistoricPosts.forEach((post, i) => {
    const card = document.createElement("div");
    card.className = "glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all";

    const tagsHtml = (post.tags || []).map(t => `<span class="px-2 py-0.5 text-[10px] rounded-md bg-dark-700 text-sky-300 font-medium">#${t}</span>`).join(" ");

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800">
          <span class="font-mono text-[11px] font-semibold text-slate-300">#${i+1} Historic Sample</span>
          <div class="flex items-center gap-1.5">
            <span class="px-1.5 py-0.5 rounded text-[10px] ${post.language === 'Hinglish' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'} font-semibold">${post.language || 'English'}</span>
            <span class="text-[10px] font-mono text-slate-400">${post.line_count || 1} lines</span>
          </div>
        </div>

        <p class="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mb-3">
          ${post.text}
        </p>
      </div>

      <div>
        <div class="flex flex-wrap gap-1 mb-3">
          ${tagsHtml}
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <span class="flex items-center gap-1 text-slate-300 font-semibold">
            👍 ${post.engagement || 100} Likes
          </span>
          <div class="flex items-center gap-2">
            <button onclick="useAsInspiration('${escapeQuotes(post.text)}')" class="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>Use Topic</span>
            </button>
            <button onclick="deleteHistoricPost(${post.id})" class="text-slate-500 hover:text-rose-400 transition-colors">
              <i data-lucide="trash" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, " ");
}

function useAsInspiration(text) {
  const firstLine = text.split("\n")[0].substring(0, 80);
  setTopic(firstLine);
  switchTab("studio");
  showToast("Inspiration topic set in Studio!", "info");
}

function filterHistoricPosts() {
  const query = document.getElementById("historic-search").value.toLowerCase();
  const lang = document.getElementById("historic-lang-filter").value;

  state.filteredHistoricPosts = state.historicPosts.filter(p => {
    const textMatch = p.text.toLowerCase().includes(query) || (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));
    const langMatch = lang === "ALL" || p.language === lang;
    return textMatch && langMatch;
  });

  renderHistoricPosts();
}

async function deleteHistoricPost(id) {
  if (!confirm("Are you sure you want to remove this historic post sample?")) return;
  try {
    await apiCall(`/api/posts/historic/${id}`, "DELETE");
    showToast("Post removed from training set.", "success");
    await loadHistoricPosts();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// --- Style DNA Rendering ---
function renderStyleProfile() {
  if (!state.styleProfile) return;
  const p = state.styleProfile;

  document.getElementById("active-persona-title").innerText = p.persona_name || "Creator Persona";
  document.getElementById("style-card-persona").innerText = p.persona_name || "Thought Leader";
  document.getElementById("style-card-tone").innerText = p.tone_summary || "Authentic and conversational.";
  document.getElementById("style-card-hook").innerText = p.hook_style || "First-line scroll-stopping question.";
  document.getElementById("style-card-structure").innerText = p.structure_rules || "1-2 lines per paragraph.";
  document.getElementById("style-card-avg-lines").innerText = `${p.avg_line_count || 6.5} lines`;
  document.getElementById("style-card-emoji").innerText = p.emoji_strategy || "1-2 warm emojis.";
  document.getElementById("style-card-hashtag").innerText = p.hashtag_strategy || "Zero hashtags.";
  document.getElementById("style-card-cta").innerText = p.call_to_action_style || "Engaging question.";

  const themesContainer = document.getElementById("style-card-themes");
  themesContainer.innerHTML = "";
  (p.top_themes || ["Career", "Job Search", "Mindset"]).forEach(theme => {
    const pill = document.createElement("span");
    pill.className = "px-2.5 py-1 rounded-lg bg-blue-500/10 text-sky-300 border border-blue-500/20 text-xs font-semibold";
    pill.innerText = theme;
    themesContainer.appendChild(pill);
  });
}

async function triggerStyleReanalysis() {
  showToast("Re-analyzing your 10-15 historic posts with Groq LLM...", "info");
  try {
    const data = await apiCall("/api/style/reanalyze", "POST");
    state.styleProfile = data.style;
    renderStyleProfile();
    showToast("Writing Style DNA updated successfully!", "success");
  } catch (e) {
    showToast(e.message, "error");
  }
}

// --- LinkedIn Extraction & Presets ---
async function extractFromUrl() {
  const url = document.getElementById("li-input-url").value.trim();
  if (!url) {
    showToast("Please enter a LinkedIn profile URL.", "error");
    return;
  }

  showToast("Connecting to LinkedIn and extracting 10-15 posts...", "info");
  try {
    const data = await apiCall("/api/linkedin/connect", "POST", { linkedin_url: url });
    closeLinkedInModal();
    showToast(data.message, "success");
    await loadAllData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function loadPreset(presetKey) {
  showToast(`Switching persona and loading 10-15 posts...`, "info");
  try {
    const data = await apiCall("/api/linkedin/connect", "POST", { preset_key: presetKey });
    closeLinkedInModal();
    showToast(data.message, "success");
    await fetchCurrentUser();
    await loadAllData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function importCustomPosts() {
  const rawText = document.getElementById("li-custom-posts-text").value.trim();
  if (!rawText) {
    showToast("Please paste some post texts first.", "error");
    return;
  }

  const postsArray = rawText.split("\n---\n").map(s => s.trim()).filter(Boolean);
  if (postsArray.length === 0) {
    postsArray.push(rawText);
  }

  showToast(`Importing ${postsArray.length} posts and analyzing writing style...`, "info");
  try {
    const data = await apiCall("/api/linkedin/connect", "POST", { custom_posts: postsArray });
    closeLinkedInModal();
    showToast(data.message, "success");
    await loadAllData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// --- Drafts & Trace History ---
function renderDrafts() {
  const container = document.getElementById("drafts-container");
  container.innerHTML = "";

  if (state.drafts.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 glass-panel rounded-2xl border border-slate-800">
        <i data-lucide="layers" class="w-10 h-10 mx-auto text-slate-500 mb-2"></i>
        <p class="text-xs text-slate-400">No generated drafts yet. Go to Agent Studio to create your first post!</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  state.drafts.forEach(draft => {
    const card = document.createElement("div");
    card.className = "glass-panel p-5 rounded-2xl border border-slate-800 space-y-3";

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-white">${draft.topic}</span>
          <div class="flex items-center gap-2 mt-1">
            <span class="px-2 py-0.5 rounded text-[10px] ${draft.is_approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} font-semibold">
              ${draft.is_approved ? 'APPROVED' : 'MAX ATTEMPTS'}
            </span>
            <span class="text-[10px] text-slate-400">${draft.attempts} Iteration Loop(s)</span>
            <span class="text-[10px] text-slate-500">${new Date(draft.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="loadDraftIntoStudio(${draft.id})" class="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 text-xs font-semibold flex items-center gap-1 transition-all">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            <span>Load in Studio</span>
          </button>
          <button onclick="deleteDraft(${draft.id})" class="text-slate-500 hover:text-rose-400 p-1.5 transition-colors">
            <i data-lucide="trash" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <div class="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap">
        ${draft.final_post}
      </div>

      <div class="text-[11px] text-slate-400 italic">
        <strong>Reviewer Feedback:</strong> "${draft.review_feedback}"
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function loadDraftIntoStudio(id) {
  const draft = state.drafts.find(d => d.id === id);
  if (!draft) return;
  state.currentPost = draft;
  state.activeAttemptIndex = (draft.trace || []).length - 1;

  renderAgentTrace();
  renderLinkedInPreview(draft.final_post);
  switchTab("studio");
  showToast("Draft loaded into Studio with full trace history!", "info");
}

async function deleteDraft(id) {
  if (!confirm("Are you sure you want to delete this generated post?")) return;
  try {
    await apiCall(`/api/drafts/${id}`, "DELETE");
    showToast("Draft deleted.", "success");
    await loadDrafts();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// --- Modals UI Helpers ---
function openAuthModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function toggleAuthForm(mode) {
  if (mode === "login") {
    document.getElementById("form-login").classList.remove("hidden");
    document.getElementById("form-register").classList.add("hidden");
    document.getElementById("auth-tab-login").classList.add("bg-dark-700", "text-white");
    document.getElementById("auth-tab-login").classList.remove("text-slate-400");
    document.getElementById("auth-tab-register").classList.remove("bg-dark-700", "text-white");
    document.getElementById("auth-tab-register").classList.add("text-slate-400");
  } else {
    document.getElementById("form-login").classList.add("hidden");
    document.getElementById("form-register").classList.remove("hidden");
    document.getElementById("auth-tab-register").classList.add("bg-dark-700", "text-white");
    document.getElementById("auth-tab-register").classList.remove("text-slate-400");
    document.getElementById("auth-tab-login").classList.remove("bg-dark-700", "text-white");
    document.getElementById("auth-tab-login").classList.add("text-slate-400");
  }
}

function openLinkedInModal() {
  document.getElementById("linkedin-modal").classList.remove("hidden");
}

function closeLinkedInModal() {
  document.getElementById("linkedin-modal").classList.add("hidden");
}

function openAddPostModal() {
  document.getElementById("add-post-modal").classList.remove("hidden");
}

function closeAddPostModal() {
  document.getElementById("add-post-modal").classList.add("hidden");
}

async function submitNewHistoricPost() {
  const text = document.getElementById("add-post-text").value.trim();
  const engagement = parseInt(document.getElementById("add-post-likes").value) || 150;
  const language = document.getElementById("add-post-lang").value;

  if (!text) {
    showToast("Please enter post text.", "error");
    return;
  }

  try {
    await apiCall("/api/posts/historic", "POST", { text, engagement, language });
    closeAddPostModal();
    document.getElementById("add-post-text").value = "";
    showToast("Historic post added! Re-analyzing style...", "success");
    await loadHistoricPosts();
    await triggerStyleReanalysis();
  } catch (err) {
    showToast(err.message, "error");
  }
}

function openProfileModal() {
  if (state.user) {
    document.getElementById("prof-name").value = state.user.full_name || "";
    document.getElementById("prof-headline").value = state.user.headline || "";
    document.getElementById("prof-avatar").value = state.user.avatar_url || "";
    document.getElementById("prof-linkedin").value = state.user.linkedin_url || "";
  }
  document.getElementById("profile-modal").classList.remove("hidden");
}

function closeProfileModal() {
  document.getElementById("profile-modal").classList.add("hidden");
}

async function submitProfileUpdate() {
  const full_name = document.getElementById("prof-name").value.trim();
  const headline = document.getElementById("prof-headline").value.trim();
  const avatar_url = document.getElementById("prof-avatar").value.trim();
  const linkedin_url = document.getElementById("prof-linkedin").value.trim();

  try {
    await apiCall("/api/profile", "PUT", { full_name, headline, avatar_url, linkedin_url });
    closeProfileModal();
    showToast("Profile updated!", "success");
    await fetchCurrentUser();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// --- Toast System ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  let bgColor = "bg-dark-800 border-slate-700 text-white";
  let icon = "info";

  if (type === "success") {
    bgColor = "bg-emerald-950 border-emerald-800 text-emerald-200";
    icon = "check-circle";
  } else if (type === "error") {
    bgColor = "bg-rose-950 border-rose-800 text-rose-200";
    icon = "alert-circle";
  }

  toast.className = `toast border ${bgColor}`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
