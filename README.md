# StartupY 🇹🇳
> **Connecting Tunisian Startups with Smart Capital.**

StartupY is a specialized, responsive two-sided matchmaking platform focused exclusively on **Tunisia**, connecting Tunisian startups, founders, business angels, local venture funds, incubators, and the Tunisian diaspora, augmented by a real, secure **Tunisia-focused RAG (Retrieval-Augmented Generation) assistant**.

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

## 🎯 Explainable Smart Match Engine (`src/utils/matchEngine.js`)

StartupBridge AI features a **100% deterministic, explainable Smart Match Engine** that replaces static or random compatibility scores with real algorithmic compatibility calculations between Tunisian startups and investors.

### 1. Scoring Weight Distribution (100 Points Total)
The match engine strictly evaluates 6 objective criteria:

| Criterion | Max Score | Evaluation Rules |
| :--- | :---: | :--- |
| **Sector Compatibility** | **30 pts** | • **30 pts**: Exact sector match<br>• **18 pts**: Related sector match (e.g., AgriTech & CleanTech, FinTech & E-commerce)<br>• **0 pts**: No sector overlap |
| **Ticket Size Compatibility** | **25 pts** | • **25 pts**: Funding requested fits within investor ticket range<br>• **12 pts**: Slightly outside range (within ~40% tolerance)<br>• **0 pts**: Far outside range |
| **Startup Stage Compatibility** | **15 pts** | • **15 pts**: Exact preferred stage match<br>• **8 pts**: Adjacent stage (e.g., MVP ↔ Early Revenue)<br>• **0 pts**: Stage mismatch |
| **Governorate / Regional Preference** | **10 pts** | • **10 pts**: Startup's governorate included in investor preferences (or investor covers All 24 governorates)<br>• **6 pts**: No regional preference specified (open to all)<br>• **0 pts**: Governorate excluded from investor focus |
| **Funding Type Compatibility** | **10 pts** | • **10 pts**: Exact funding type compatibility (e.g., Equity ↔ Equity)<br>• **5 pts**: Related financing instrument (e.g., SAFE ↔ Convertible Note)<br>• **0 pts**: Incompatible financing types |
| **Investor Mandate Preferences** | **10 pts** | • **10 pts**: Strong alignment with specific thesis (e.g., female founders, export-oriented, AI-first)<br>• **5 pts**: Partial alignment<br>• **0 pts**: No mandate alignment |

### 2. Match Tiers & Labels
Scores are strictly categorized into 4 explainable tiers:
- **85 – 100%**: `Excellent Match` (High conviction deal alignment across all key criteria)
- **70 – 84%**: `Strong Match` (Solid alignment with minor gaps in stage or geography)
- **50 – 69%**: `Potential Match` (Viable opportunity requiring ticket negotiation or thesis alignment)
- **0 – 49%**: `Low Match` (Substantial mismatch in sector, ticket size, or mandate)

### 3. Explainability Architecture & UI
For every pair evaluated, the engine returns:
- **Score & Tier:** Rendered with an animated SVG circular progress ring and color-coded badge.
- **Criterion-by-Criterion Breakdown:** Exact points earned vs max points with natural-language context (e.g., *"Funding request of 450,000 TND is within this investor’s 300,000–700,000 TND ticket range."*).
- **“Why this match?” Section:**
  - **Top 3 Strengths:** Key factors driving the score.
  - **Up to 3 Gaps / Risks:** Real diligence flags (e.g. ticket size stretched, stage misalignment).
  - **Actionable Recommendation:** Practical guidance on how to bridge terms or pitch effectively.

### 4. Interactive Dashboards & Demo Walkthrough
- **Investor Dashboard:** Startups sorted by real compatibility score, featuring match reason snippets and quick filters (`All`, `Excellent`, `Strong`, `Potential`).
- **Startup Dashboard:** Investors sorted by compatibility, detailing ticket ranges, focus sectors, and an interactive **“View Match Details”** modal.
- **Featured Demo Scenario:**
  > *“Demo: AgriSmart Tunisia is seeking 450,000 TND for Seed Investment in Sfax. Compare it with compatible investors and see why the match is recommended.”*

### 5. Automated Verification & Unit Tests
`src/utils/matchEngine.js` includes 5 automated test cases (`MATCH_ENGINE_TESTS`):
1. **Exact High Match:** 100/100 (`Excellent Match`)
2. **Sector Mismatch:** 65/100 (`Potential Match`)
3. **Ticket Mismatch:** 75/100 (`Strong Match`)
4. **Stage Mismatch:** 40/100 (`Low Match`)
5. **Partial Match:** 81/100 (`Strong Match`)

---

## 📹 Secure In-Platform Video Meetings (Bidaya Meeting & ZEGOCLOUD)

Bidaya Tunisia provides **secure, private, in-app video meetings** between Tunisian founders and verified investors using the official **ZEGOCLOUD Web UIKit** (`@zegocloud/zego-uikit-prebuilt`).

### 1. Security Architecture & Server-Side Token Generation
- **Strict Server-Side Token Issuance:** The frontend client **never** receives or handles the `ZEGO_SERVER_SECRET` or `AppSign`.
- **Backend Token Endpoint:** `POST /api/meetings/:meetingId/join-token`
  - Validates meeting existence, participant roles, and `accepted` status.
  - Generates the encrypted ZEGOCLOUD Kit Token server-side via AES-128-CBC.
  - Returns strictly `{ appID, kitToken, roomId, userID, userName }`.
- **Zero Frontend Secret Exposure:** No `VITE_ZEGO_SERVER_SECRET` is ever used.

### 2. ZEGOCLOUD Account Setup & Credentials
1. Create a free account on the [ZEGOCLOUD Admin Console](https://console.zegocloud.com/).
2. Create a project under **Voice & Video Calling** (or Video Conference).
3. In the project settings, retrieve your:
   - **AppID** (numeric integer, e.g. `123456789`)
   - **ServerSecret** (32-character hex string)
4. Add these credentials to your local `.env` file:
   ```env
   ZEGO_APP_ID=123456789
   ZEGO_SERVER_SECRET=your_32_character_server_secret
   ```
> [!WARNING]
> **Security Warning:** Never commit `ZEGO_SERVER_SECRET` to GitHub or version control. `.env` is ignored by Git. Test tokens are for development only; production deployments require authenticated session verification and server-side token renewal.

### 3. In-App Meeting Features (`/meeting/:meetingId`)
- **One-to-One Mode:** Engineered specifically for confidential founder-investor diligence sessions.
- **Controls Included:** Camera toggle, microphone toggle, speaker settings, in-room chat, screen sharing, leave meeting button, and participant names.
- **Branded Bidaya Tunisia Interface:** Custom top header with privacy status and meeting metadata.
- **Post-Meeting Outcome Capture:** Upon leaving a call, users are prompted to record the session outcome (`Interested`, `Follow-up Needed`, `Declined`, `No Show`).

### 4. Meeting Center & Privacy Safeguards
- Reusable `MeetingCenter` integrated into both **Startup Dashboard** and **Investor Dashboard**:
  - Upcoming scheduled sessions
  - Pending meeting requests (with Accept, Decline, and Propose Alternative Time actions)
  - Past completed sessions with recorded outcomes
  - **Demo Instant Join Override:** Allows instant video room entry for test walkthroughs without waiting for the scheduled calendar clock.
- **Strict Privacy & Consent Standards:**
  - *“This meeting is private and accessible only to the accepted startup and investor.”*
  - *“Recording and transcription are disabled by default.”*
  - *“Any recording or transcription requires explicit consent from all participants.”*
  - No automated recording is implemented; real financial or personal documents are never exposed in demo rooms.

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

## 🔒 Supabase Authentication, PostgreSQL Schema & Row Level Security (RLS)

Bidaya Tunisia provides an enterprise-grade backend data persistence layer powered by **Supabase** with strict **Row Level Security (RLS)**, role-based access control (RBAC), and privileged backend operations.

### 1. Supabase Project Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings > API** and copy:
   - **Project URL**
   - **anon / public key**
   - **service_role secret key** *(Keep strictly secret on the backend server!)*
3. Go to **SQL Editor** in your Supabase Dashboard:
   - Open and copy the contents of [`supabase/migrations/20260927_init_schema.sql`](file:///d:/downloads/gomycode/supabase/migrations/20260927_init_schema.sql).
   - Click **Run** to execute the migration.

### 2. Database Schema & Tables
The database includes 8 tables with foreign keys and automatic `updated_at` triggers:
- **`profiles`**: Tied to `auth.users(id)`. Contains `full_name`, `email`, `role` (`admin` | `startup` | `investor`), `avatar_url`.
- **`startups`**: Tied to `profiles(id)`. Contains startup metadata, funding metrics, and `publication_status` (`draft` | `under_review` | `approved` | `rejected`).
- **`investors`**: Tied to `profiles(id)`. Contains ticket ranges, sectors, and `verification_status` (`draft` | `submitted` | `under_review` | `documents_required` | `approved` | `rejected` | `suspended`).
- **`investor_documents`**: Uploaded verification files (tax registrations, syndicate credentials, bank records) with reviewer notes.
- **`startup_progress`**: 11-step roadmap progress tracking with deliverables and evidence JSON.
- **`meeting_requests`**: Bidaya Meeting records with ZEGOCLOUD room IDs, participants, agendas, and statuses.
- **`interests`**: Investor-startup interest tracking and diligence statuses.
- **`audit_logs`**: Immutable security log tracking all administrative approvals, status mutations, and reviews.

### 3. Row Level Security (RLS) Policies
All tables have `ENABLE ROW LEVEL SECURITY` with granular policies:
- **Startup Founders**: Can read and edit only their own startup, progress, interests, and meetings.
- **Investors**: Can read and edit only their own investor profile, documents, interests, and meetings.
- **Publication Visibility**: Investors can only see startups whose `publication_status = 'approved'`.
- **Investor Accreditation**: Startups can only see approved investors where appropriate.
- **Investor Document Protection**: Sensitive verification files in `investor_documents` are visible only to the document owner and verified `admin` profiles.
- **Meeting Access**: Participants can access only meetings where their profile ID matches `startup.owner_id` or `investor.owner_id`.
- **Admin Privacy Constraint**: Admin dashboard displays **metadata only** (participants, date, duration, status) and never exposes call media or chat transcripts.

### 4. Admin Promotion & Security Controls
> [!IMPORTANT]
> **Client-side role promotion is strictly blocked.** The `/choose-role` screen only permits selecting `startup` or `investor` and can be chosen only once.

To promote an existing user to **Admin**:

#### Option A: Privileged Backend Script
Run the privileged script using the Supabase Service Role key:
```bash
node server/scripts/promoteAdmin.js admin@bidaya.tn
```

#### Option B: Supabase SQL Editor
Execute the following query directly in your Supabase SQL editor:
```sql
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'admin@bidaya.tn';
```

### 5. Demo Mode vs. Production Mode
| Feature | Local Demo Mode (Supabase Missing) | Production Mode (Supabase Configured) |
| :--- | :--- | :--- |
| **Data Persistence** | Browser `localStorage` | PostgreSQL database with RLS |
| **Authentication** | Demo simulation with local session | Real email/password with Supabase Auth |
| **Demo Admin Login** | Enabled for instant testing and evaluation | **Disabled** — Only authentic database admins can access `/admin` |
| **Role Enforcement** | Simulated role guards | Cryptographic JWTs validated server-side & in RLS |
| **Fallback Behavior** | Automatic fallback if `.env` keys are unset | Full cloud database synchronization |

### 6. Investor Verification Notice
In accordance with platform compliance guidelines, investor onboarding enforces:
> *"Verification is reviewed when the submitted file is complete."*
*(Claims of "verified within 24 hours" are strictly prohibited across all interfaces).*

---

## 🚦 Strict Public-First Route Access Matrix

Bidaya Tunisia operates a strict **public-first, role-based user experience**. Unauthenticated visitors can access only public landing and auth pages. All platform tools are guarded by both frontend route guards and Supabase Row Level Security (RLS) policies.

| Route | Public Visitor | Startup Founder | Investor | Admin | Description |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`/`** | ✅ Allowed | 🔄 Redirects to Dashboard | 🔄 Redirects to Dashboard | 🔄 Redirects to `/admin` | Public landing page explaining Bidaya Tunisia |
| **`/login`** | ✅ Allowed | 🔄 Redirects to Dashboard | 🔄 Redirects to Dashboard | 🔄 Redirects to `/admin` | Sign-in portal with optional intent parameter |
| **`/register`** | ✅ Allowed | 🔄 Redirects to Dashboard | 🔄 Redirects to Dashboard | 🔄 Redirects to `/admin` | Registration with intent support (`?intent=startup\|investor`) |
| **`/forgot-password`** | ✅ Allowed | 🔄 Redirects to Dashboard | 🔄 Redirects to Dashboard | 🔄 Redirects to `/admin` | Password reset request |
| **`/choose-role`** | 🔒 Auth Required | 🚫 Role Locked | 🚫 Role Locked | 🚫 Role Locked | One-time role choice (Startup Founder / Investor) |
| **`/dashboard/startup`** | 🔒 Redirect to Login | ✅ Allowed | ⛔ Access Denied | 👑 Full Access | Founder 11-step roadmap & readiness dashboard |
| **`/roadmap`** | 🔒 Redirect to Login | ✅ Allowed | ⛔ Access Denied | 👑 Full Access | Founder venture builder roadmap view |
| **`/startup-profile`** | 🔒 Redirect to Login | ✅ Allowed | ⛔ Access Denied | 👑 Full Access | Founder startup profile editor |
| **`/startup-documents`** | 🔒 Redirect to Login | ✅ Allowed | ⛔ Access Denied | 👑 Full Access | Founder document uploads |
| **`/startup-meetings`** | 🔒 Redirect to Login | ✅ Allowed | ⛔ Access Denied | 👑 Full Access | Founder Bidaya Meetings schedule |
| **`/dashboard/investor`** | 🔒 Redirect to Login | ⛔ Access Denied | ✅ Allowed | 👑 Full Access | Investor dashboard & verification status |
| **`/investor-verification`**| 🔒 Redirect to Login | ⛔ Access Denied | ✅ Allowed | 👑 Full Access | Investor 7-step accreditation dossier |
| **`/deal-flow`** | 🔒 Redirect to Login | ⛔ Access Denied | ✅ Verified Only | 👑 Full Access | Approved Tunisian startup deal flow search |
| **`/explore`** | 🔒 Redirect to Login | ⛔ Access Denied | ✅ Verified Only | 👑 Full Access | Alias for deal flow search |
| **`/startup/:id`** | 🔒 Redirect to Login | ⛔ Access Denied | ✅ Approved Only | 👑 Full Access | Detailed startup profile & match breakdown |
| **`/investor-meetings`** | 🔒 Redirect to Login | ⛔ Access Denied | ✅ Verified Only | 👑 Full Access | Investor Bidaya Meetings schedule |
| **`/admin`** | 🔒 Redirect to Login | ⛔ Access Denied | ⛔ Access Denied | 👑 Full Access | Admin console (Review, Verification, Users, Logs) |
| **`/meeting/:meetingId`**| 🔒 Redirect to Login | 🤝 Participant Only | 🤝 Participant Only | 👑 Metadata Only | Secure ZEGOCLOUD video call room |
| **`/resources`** | 🔒 Redirect to Login | ✅ Allowed | ✅ Allowed | 👑 Full Access | Official Tunisian institutional resources |

---

## 📑 Source-Verification Limitation & Legal Disclaimer

- **Source Limitation:** The initial knowledge base entries are educational drafts compiled for demonstration purposes. Official verification by accredited Tunisian legal, fiscal, and institutional bodies is pending.
- **Legal Disclaimer:** *Information for educational guidance only — not legal, tax, financial or investment advice. Official Tunisian sources and accredited legal/tax counsel should always be consulted.*


