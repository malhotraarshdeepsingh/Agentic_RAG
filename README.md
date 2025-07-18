﻿# 💰  RAGOfGold

RAGOfGold is a chatbot that answers questions about gold and silver prices. It uses blog data and a smart AI model to give answers based on real information.

## 🖼️  Screenshots

![App Screenshot](./preview.png)

## 🧰  Tech Stack

**🖥️ Client:** HTML, CSS, JS

**🛠️ Server:** Node, Express, Socket.io

**🧠 AI & NLP:** OpenAI, LangChain

**📄 Text Extraction:** Cheerio, SanitizeHTML

## 📖 How It Works
- 🔎 Collects blog posts from a website  
- 🧹 Cleans the content and breaks it into smaller parts  
- 🧠 Converts those parts into embeddings using OpenAI  
- 📦 Stores the data in memory for fast retrieval  
- 💬 Searches for the most relevant chunks when a question is asked  
- 🤖 Sends those chunks to the AI to generate an answer

This was my first time trying something like this. I followed helpful guides and examples from LangChain’s official docs, just learned and built it step by step.

The front-end uses a simple chat interface made with HTML, CSS, and Socket.IO so users can chat with the bot easily.





##  🌐 Run Locally

Clone the project

```bash
  git clone https://github.com/malhotraarshdeepsingh/RAGOfGold
```

Go to the project directory

```bash
  cd RAGOfGold
```

Install dependencies

```bash
  npm install
```

Add your Environment Variables

```bash
  OPENAI_API_KEY=your_openai_api_key
```

Start the server

```bash
  npm run start
```





## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`OPENAI_API_KEY`


##  🙏 Acknowledgements

 - [📚 LangChain Official Docs](https://langchain-ai.github.io/langgraphjs/tutorials/rag/langgraph_agentic_rag)
 - [📰 Inproved Blogs](https://inproved.com/)
