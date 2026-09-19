from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="openai/gpt-oss-120b"
)


if __name__ == "__main__":
    response = llm.invoke("Capital of France is...")
    print(response.content)
