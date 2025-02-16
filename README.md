# Next.js AI Chatbot with LangChain, Prisma, and PostgreSQL

## Overview

This project is a locally hosted AI chatbot built using Next.js, Prisma ORM, PostgreSQL, and LangChain. It leverages Ollama to run locally downloaded Large Language Models (LLMs) and provides an intuitive user interface. The chatbot also stores previous messages for a persistent conversation history.

## Features

- **Locally Hosted LLMs**: Uses Ollama to run LLMs without external API calls.
- **Chat Interface**: A clean and interactive UI built with Next.js.
- **Message Persistence**: Stores past chat messages in a PostgreSQL database using Prisma ORM.
- **LangChain Integration**: Efficiently manages prompts and responses for seamless conversation flow.
- **Fast and Secure**: Runs entirely on your local machine, ensuring privacy and security.

## Tech Stack

- **Frontend**: Next.js (React-based framework)
- **Backend**: Next.js API routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI Processing**: LangChain & Ollama

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 18)
- PostgreSQL
- Ollama (for running local LLMs)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivamrai15/aether.git
   cd aether
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up the database:**
    - Create a PostgreSQL database.
    - Copy the `.env.example` file to `.env.local` and update the database URL:
        ```env
        DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
        ```
    - Run Prisma migrations:
        ```bash
        npx prisma migrate dev --name init
        ```
    - Run Prisma push:
     ```bash
     npx prisma db push
     ```
4. **Start the Ollama server:**
   ```bash
   ollama run model_name
   ```
5. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000`.
- Interact with the chatbot and see your message history persist.

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [LangChain](https://www.langchain.com/)
- [Ollama](https://ollama.ai/)

