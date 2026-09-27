# StartupBridge AI Tunisia 🇹🇳
> **Connecting Tunisian Startups with Smart Capital.**

StartupBridge AI is a specialized, responsive two-sided matchmaking platform focused exclusively on **Tunisia**, connecting Tunisian startups, founders, business angels, local venture funds, incubators, and the Tunisian diaspora, augmented by a real, secure **Tunisia-focused RAG (Retrieval-Augmented Generation) assistant**.

---

## 🌟 Key Features & Tunisia Focus

- **Tunisia-First Product Positioning:**
  - Tagline: *“Connecting Tunisian Startups with Smart Capital.”*
  - Dedicated exclusively to the Tunisian entrepreneurial ecosystem.
  - English user interface, engineered to be ready for future French and Arabic localization (`EN | FR | AR`).
- **Default Currency: Tunisian Dinars (TND):**
  - All financial metrics, ticket sizes, valuations, funding requirements, and burn rates are denominated in **TND**.
- **Tunisian Governorates (No Country Selectors):**
  - Replaced country filters and inputs with **Tunisian Governorates** (Tunis, Ariana, Ben Arous, Manouba, Sfax, Sousse, Monastir, Nabeul, Bizerte, Kairouan, Gabès, Médenine, etc.).
- **Startup Onboarding:**
  - Includes *Tunisian governorate*, *Legal status (SUARL, SARL, SA, In creation, Idea)*, *Year founded*, *Website / LinkedIn*, *Funding type sought*, and *“Is your startup registered in Tunisia?” (Yes / No)*.
- **Investor Onboarding:**
  - Includes *Investor type (Angel Investor, Venture Capital, Fund, Corporate, Incubator, Bank, Diaspora Investor)*, *Ticket size in TND*, *Preferred startup stage*, *Preferred Tunisian governorates*, and *Investment type*.
- **Realistic Fictional Tunisian Mock Data (Demo Data):**
  - 8+ Tunisian startups across AgriTech, FinTech, HealthTech, EdTech, TourismTech, E-commerce, CleanTech, and AI / SaaS.
  - Tunisian investors: *Carthage Angels Network (Demo)*, *Jasmine Capital Partners (Demo)*, *El Ghazala Tech Seed Fund (Demo)*, and *Tunisian Diaspora Venture Syndicate (Demo)*.
- **Prioritized Matching Logic:**
  - Sector compatibility
  - Ticket size in TND
  - Startup stage
  - Tunisian governorate / region
  - Funding type
  - Investor preferences
- **Tunisia Ecosystem Section (Landing Page):**
  - Dedicated landing page section with 4 cards: *Startup Funding*, *Investor Discovery*, *Startup Guidance*, and *Tunisian Ecosystem*, clearly marked with *Demo platform data*.
- **Official Resources Page (`/resources`):**
  - Dedicated repository page with 5 future verified categories: *Business creation and legal guidance*, *Investment and funding guidance*, *Startup support programs*, *Tax and compliance resources*, and *Intellectual property and trademark resources*.
  - Displays the verified integration banner: *“Verified official Tunisian resources will be added to the AI knowledge base.”*

---

## 🧠 Real, Secure Tunisia RAG Assistant

StartupBridge AI features an intelligent, server-side RAG engine grounded in local Tunisian ecosystem knowledge:

### 1. Architecture & API Security
- **No API keys in frontend code, browser, or Git:** All LLM communications are handled exclusively by the server-side Express backend located in `/server`.
- **Backend API Endpoint:** `POST /api/ai/guide`
  - Input: `{ "role": "startup" | "investor", "question": "user question" }`
  - Output: `{ "answer": "...", "sources": [ { "title": "...", "category": "..." } ], "mode": "live" | "demo" }`
- **Supported LLM Providers via Environment Variables:**
  - `GEMINI_API_KEY` (Google Gemini 1.5 Flash)
  - `GROQ_API_KEY` (Groq Llama 3.1)
  - **Graceful Demo Fallback:** If neither API key is configured or an external API call fails, the system automatically uses the local structured Tunisia RAG knowledge base.

### 2. Local Structured Knowledge Base (`server/data/tunisiaKnowledgeBase.js`)
Contains cautious, general educational content grouped into:
1. *Business creation and registration*
2. *Pitch deck and investment readiness*
3. *Funding options*
4. *Investor due diligence*
5. *Intellectual property*
6. *Tax and compliance awareness*
7. *Responsible investment and risk*

Every chunk is marked with:
- `sourceLabel: "Educational draft — official verification required"`
- `sourceUrl: ""` (left empty until officially verified)
- `verified: false`

### 3. Lightweight RAG Retrieval & Prompt Safeguards
- Evaluates user queries via keyword matching and role relevance.
- Retrieves the top 3 most relevant chunks.
- Instructs the model to answer **only** from this retrieved context.
- If context is insufficient, it responds:
  > *“I do not have enough verified Tunisia-specific information to answer this reliably. Please consult an official adviser or source.”*
- Every response ends with:
  > *“Information for educational guidance only — not legal, tax, financial or investment advice.”*

### 4. UI Transparency Badges & Warning
- **“Live AI guidance”**: Displayed when live LLM generation succeeded.
- **“Demo guidance”**: Displayed when local knowledge fallback is used.
- **Sources Consulted**: Interactive source cards displayed beneath answers.
- **Source Verification Warning**: Warns users that educational drafts are pending official regulatory confirmation.

---

## ⚠️ Security Warning: Never Commit API Keys

> [!CAUTION]
> **NEVER commit `.env` or any file containing live API keys to Git or GitHub.**
> - The `.gitignore` file is pre-configured to ignore all `.env` files.
> - Only `.env.example` with placeholder strings is tracked in version control.
> - Always keep your API keys stored locally in `.env`.

---

## 🚀 Installation & Running the Application

### 1. Install Dependencies
Install all required dependencies for both the React/Vite frontend and the Node/Express backend:

```bash
cd d:/downloads/gomycode
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Edit `.env` to optionally add your API key:
```env
# Option 1: Google Gemini (Recommended)
GEMINI_API_KEY=your_gemini_api_key_here

# Option 2: Groq (Alternative)
GROQ_API_KEY=your_groq_api_key_here

# Server Port
PORT=5000
```
> **Note:** If you leave the keys empty or unchanged, StartupBridge AI will run seamlessly in **Tunisia RAG Demo mode** using the local structured knowledge base.

### 3. Running Frontend and Backend

You can run both services concurrently:

#### Terminal 1 — Start Backend Server (Port 5000)
```bash
npm run server
```

#### Terminal 2 — Start Frontend Dev Server (Port 5173)
```bash
npm run dev
```

Open **`http://localhost:5173/`** in your browser. Vite is pre-configured with a reverse proxy routing all `/api` requests to `http://localhost:5000`.

### 4. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 📑 Source-Verification Limitation & Legal Disclaimer

- **Source Limitation:** The initial knowledge base entries are educational drafts compiled for demonstration purposes. Official verification by accredited Tunisian legal, fiscal, and institutional bodies is pending.
- **Legal Disclaimer:** *Information for educational guidance only — not legal, tax, financial or investment advice. Official Tunisian sources and accredited legal/tax counsel should always be consulted.*
