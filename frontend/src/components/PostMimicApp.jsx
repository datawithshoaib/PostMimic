"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/Toast";
import StudioTab from "@/components/studio/StudioTab";
import HistoricTab from "@/components/historic/HistoricTab";
import StyleTab from "@/components/style/StyleTab";
import DraftsTab from "@/components/drafts/DraftsTab";
import AuthModal from "@/components/modals/AuthModal";
import LinkedInModal from "@/components/modals/LinkedInModal";
import ProfileModal from "@/components/modals/ProfileModal";
import AddPostModal from "@/components/historic/AddPostModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  authApi,
  profileApi,
  linkedinApi,
  postsApi,
  styleApi,
  generateApi,
  getToken,
  setToken,
  removeToken,
} from "@/lib/api/client";

export default function PostMimicApp() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("studio");
  const [historicPosts, setHistoricPosts] = useState([]);
  const [styleProfile, setStyleProfile] = useState(null);
  const [drafts, setDrafts] = useState([]);

  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("Medium");
  const [language, setLanguage] = useState("English");
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [currentPost, setCurrentPost] = useState(null);
  const [activeAttemptIndex, setActiveAttemptIndex] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [linkedinModalOpen, setLinkedinModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addPostModalOpen, setAddPostModalOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadAllData = useCallback(async () => {
    try {
      const [hRes, sRes, dRes] = await Promise.all([
        postsApi.getHistoric(),
        styleApi.getStyle(),
        generateApi.getDrafts(),
      ]);
      setHistoricPosts(hRes.posts || []);
      setStyleProfile(sRes.style || null);
      setDrafts(dRes.drafts || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);

  const handleDemoLogin = useCallback(
    async (showToast = true) => {
      setIsModalSubmitting(true);
      try {
        const data = await authApi.demoLogin();
        setToken(data.user.token);
        setUser(data.user);
        setAuthModalOpen(false);
        if (showToast) {
          addToast("Logged into Mohan Sharma (Tech Mentor Demo)", "success");
        }
        await loadAllData();
      } catch (err) {
        addToast(err.message, "error");
      } finally {
        setIsModalSubmitting(false);
      }
    },
    [addToast, loadAllData],
  );

  useEffect(() => {
    async function init() {
      const token = getToken();
      if (token) {
        try {
          const data = await authApi.getMe();
          setUser(data.user);
          await loadAllData();
        } catch (err) {
          console.warn("Session expired, auto-logging into demo...", err);
          await handleDemoLogin(false);
        }
      } else {
        await handleDemoLogin(false);
      }
    }
    init();
  }, [handleDemoLogin, loadAllData]);

  const handleLogin = async (email, password) => {
    setIsModalSubmitting(true);
    try {
      const data = await authApi.login(email, password);
      setToken(data.user.token);
      setUser(data.user);
      setAuthModalOpen(false);
      addToast(`Welcome back, ${data.user.full_name}!`, "success");
      await loadAllData();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleRegister = async (payload) => {
    setIsModalSubmitting(true);
    try {
      const data = await authApi.register(payload);
      setToken(data.user.token);
      setUser(data.user);
      setAuthModalOpen(false);
      addToast("Account created successfully with starter posts!", "success");
      await loadAllData();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    addToast("Logged out successfully.", "info");
    setAuthModalOpen(true);
  };

  const handleUpdateProfile = async (payload) => {
    setIsModalSubmitting(true);
    try {
      await profileApi.update(payload);
      const data = await authApi.getMe();
      setUser(data.user);
      setProfileModalOpen(false);
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleLinkedInUrlExtract = async (linkedin_url) => {
    setIsModalSubmitting(true);
    try {
      const data = await linkedinApi.connect({ linkedin_url });
      setLinkedinModalOpen(false);
      addToast(data.message, "success");
      await loadAllData();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleSelectPreset = async (preset_key) => {
    setIsModalSubmitting(true);
    try {
      const data = await linkedinApi.connect({ preset_key });
      setLinkedinModalOpen(false);
      addToast(data.message, "success");
      const meData = await authApi.getMe();
      setUser(meData.user);
      await loadAllData();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleImportCustomPosts = async (custom_posts) => {
    setIsModalSubmitting(true);
    try {
      const data = await linkedinApi.connect({ custom_posts });
      setLinkedinModalOpen(false);
      addToast(data.message, "success");
      await loadAllData();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleAddHistoricPost = async (payload) => {
    setIsModalSubmitting(true);
    try {
      await postsApi.addHistoric(payload);
      setAddPostModalOpen(false);
      addToast("Historic post added! Re-analyzing Style DNA...", "success");
      const hRes = await postsApi.getHistoric();
      setHistoricPosts(hRes.posts || []);
      const sRes = await styleApi.reanalyze();
      setStyleProfile(sRes.style);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleDeleteHistoricPost = async (id) => {
    if (!window.confirm("Remove this sample from training set?")) return;
    try {
      await postsApi.deleteHistoric(id);
      addToast("Historic post removed.", "success");
      const hRes = await postsApi.getHistoric();
      setHistoricPosts(hRes.posts || []);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleUseTopicFromHistoric = (postText) => {
    const firstLine = postText.split("\n")[0].substring(0, 100);
    setTopic(firstLine);
    setCurrentTab("studio");
    addToast("Topic loaded into Studio from historic post!", "info");
  };

  const handleReanalyzeStyle = async () => {
    setIsReanalyzing(true);
    try {
      const data = await styleApi.reanalyze();
      setStyleProfile(data.style);
      addToast("Style DNA updated successfully with Groq LLM!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await generateApi.generate({
        topic: topic.trim(),
        length,
        language,
        max_attempts: maxAttempts,
      });

      const generatedData = res.data;
      setCurrentPost(generatedData);
      setActiveAttemptIndex((generatedData.trace || []).length - 1);

      generateApi.getDrafts().then((d) => setDrafts(d.drafts || []));

      if (generatedData.is_approved) {
        addToast(
          `Post Approved after ${generatedData.total_attempts} iteration(s)!`,
          "success",
        );
      } else {
        addToast(
          `Completed ${generatedData.total_attempts} iteration loops. Review ready!`,
          "info",
        );
      }
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (feedback) => {
    if (!currentPost || isRefining) return;

    setIsRefining(true);
    try {
      const res = await generateApi.refine(currentPost.id, feedback);
      const updated = res.data;
      setCurrentPost(updated);
      setActiveAttemptIndex((updated.trace || []).length - 1);
      generateApi.getDrafts().then((d) => setDrafts(d.drafts || []));
      addToast("Writer & Reviewer revised post with your feedback!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsRefining(false);
    }
  };

  const handleLoadDraft = (draft) => {
    setCurrentPost(draft);
    setActiveAttemptIndex((draft.trace || []).length - 1);
    setCurrentTab("studio");
    addToast("Loaded draft into Studio with full iteration trace!", "info");
  };

  const handleDeleteDraft = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await generateApi.deleteDraft(id);
      addToast("Draft deleted.", "success");
      const d = await generateApi.getDrafts();
      setDrafts(d.drafts || []);
      if (currentPost && currentPost.id === id) {
        setCurrentPost(null);
      }
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
        <Navbar
          user={user}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          historicCount={historicPosts.length}
          draftsCount={drafts.length}
          openAuthModal={() => setAuthModalOpen(true)}
          openLinkedInModal={() => setLinkedinModalOpen(true)}
          openProfileModal={() => setProfileModalOpen(true)}
          onLogout={handleLogout}
          onDemoLogin={() => handleDemoLogin(true)}
          onSelectPreset={handleSelectPreset}
          personaTitle={styleProfile?.persona_name}
        />

        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-7 lg:py-9">
          {currentTab === "studio" && (
            <StudioTab
              topic={topic}
              setTopic={setTopic}
              length={length}
              setLength={setLength}
              language={language}
              setLanguage={setLanguage}
              maxAttempts={maxAttempts}
              setMaxAttempts={setMaxAttempts}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              currentPost={currentPost}
              activeAttemptIndex={activeAttemptIndex}
              setActiveAttemptIndex={setActiveAttemptIndex}
              user={user}
              onRefine={handleRefine}
              isRefining={isRefining}
              onSaveDraft={() => {
                addToast("Post safely archived in your Drafts & History tab!", "success");
                setCurrentTab("drafts");
              }}
              personaTitle={styleProfile?.persona_name}
              onSwitchTab={setCurrentTab}
              onCopySuccess={() =>
                addToast("Post copied to clipboard with exact line breaks!", "success")
              }
            />
          )}

          {currentTab === "historic" && (
            <HistoricTab
              historicPosts={historicPosts}
              onUseTopic={handleUseTopicFromHistoric}
              onDeletePost={handleDeleteHistoricPost}
              onOpenAddModal={() => setAddPostModalOpen(true)}
              onOpenLinkedInModal={() => setLinkedinModalOpen(true)}
              onReanalyzeStyle={handleReanalyzeStyle}
              isReanalyzing={isReanalyzing}
            />
          )}

          {currentTab === "style" && (
            <StyleTab
              styleProfile={styleProfile}
              onReanalyzeStyle={handleReanalyzeStyle}
              isReanalyzing={isReanalyzing}
            />
          )}

          {currentTab === "drafts" && (
            <DraftsTab
              drafts={drafts}
              onLoadDraft={handleLoadDraft}
              onDeleteDraft={handleDeleteDraft}
              onCopySuccess={() => addToast("Post copied to clipboard!", "success")}
            />
          )}
        </main>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onDemoLogin={() => handleDemoLogin(true)}
          isLoading={isModalSubmitting}
        />

        <LinkedInModal
          isOpen={linkedinModalOpen}
          onClose={() => setLinkedinModalOpen(false)}
          onExtractUrl={handleLinkedInUrlExtract}
          onSelectPreset={handleSelectPreset}
          onImportCustomPosts={handleImportCustomPosts}
          isLoading={isModalSubmitting}
        />

        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onUpdateProfile={handleUpdateProfile}
          isLoading={isModalSubmitting}
        />

        <AddPostModal
          isOpen={addPostModalOpen}
          onClose={() => setAddPostModalOpen(false)}
          onAddPost={handleAddHistoricPost}
          isSubmitting={isModalSubmitting}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </TooltipProvider>
  );
}
