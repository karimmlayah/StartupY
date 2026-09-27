# StartupBridge AI Tunisia 🇹🇳
> **Connecting Tunisian Startups with Smart Capital.**

StartupBridge AI is a specialized, responsive two-sided matchmaking platform focused exclusively on **Tunisia**, connecting Tunisian startups, founders, business angels, local venture funds, incubators, and the Tunisian diaspora, augmented by an interactive AI guidance engine.

---

## 🌟 Key Updates & Tunisia Localization

- **Tunisia-First Product Positioning:**
  - Tagline: *“Connecting Tunisian Startups with Smart Capital.”*
  - Dedicated exclusively to the Tunisian entrepreneurial ecosystem.
  - English user interface, engineered to be ready for future French and Arabic localization.
- **Default Currency: Tunisian Dinars (TND):**
  - All financial metrics, ticket sizes, valuations, funding requirements, and burn rates are denominated in **TND**.
- **Tunisian Governorates (No Country Selectors):**
  - Replaced country filters and inputs with **Tunisian Governorates** (Tunis, Ariana, Ben Arous, Manouba, Sfax, Sousse, Monastir, Nabeul, Bizerte, Kairouan, Gabès, Médenine, etc.).
- **Startup Onboarding Enhancements:**
  - Added fields: *Tunisian governorate*, *Legal status (SUARL, SARL, SA, In creation, Idea)*, *Year founded*, *Website / LinkedIn*, *Funding type sought (Grant, Angel Investment, Seed Investment, Venture Capital, Loan, Partnership)*, and *“Is your startup registered in Tunisia?” (Yes / No)*.
- **Investor Onboarding Enhancements:**
  - Added fields: *Investor type (Angel Investor, Venture Capital, Fund, Corporate, Incubator, Bank, Diaspora Investor)*, *Ticket size in TND*, *Preferred startup stage*, *Preferred Tunisian governorates*, *Investment type (Equity, Convertible Note, Grant, Loan, Partnership)*, and optional portfolio link.
- **Realistic Fictional Tunisian Mock Data (Demo Data):**
  - 8+ Tunisian startups across AgriTech (*AgriSmart Tunisia*), FinTech (*DinarPay Solutions*), HealthTech (*SahhaTech Telemedicine*), EdTech (*EduKhatwa*), TourismTech (*DjerbaXperience*), E-commerce (*SoukCraft Tunisia*), CleanTech (*CleanSun Carthage*), and AI / SaaS (*ElKalam AI*).
  - Tunisian investors: *Carthage Angels Network (Demo)*, *Jasmine Capital Partners (Demo)*, *El Ghazala Tech Seed Fund (Demo)*, and *Tunisian Diaspora Venture Syndicate (Demo)*.
- **Tunisia-Focused AI Assistants:**
  - Renamed: **“Startup Tunisia Guide”** and **“Investor Tunisia Guide”**.
  - Suggested questions addressing company creation (SARL/SUARL), documents for investment rounds, pitch decks for Tunisian angels & VCs, funding options, and founder evaluation frameworks.
  - Mandatory disclaimer on all demo responses:
    > *“Demo guidance only — not legal, tax, investment or financial advice. Official Tunisian sources should be consulted.”*
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

## 📱 Navigation & Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | [Landing Page](file:///d:/downloads/gomycode/src/pages/LandingPage.jsx) | Hero, demo platform statistics, Tunisia Ecosystem section (4 cards), 3-step workflow, and featured startups. |
| `/auth` | [Auth Choice Page](file:///d:/downloads/gomycode/src/pages/AuthChoicePage.jsx) | Two large cards: *“I’m a Startup”* and *“I’m an Investor”* with Tunisia-specific benefits. |
| `/onboarding/startup` | [Startup Onboarding](file:///d:/downloads/gomycode/src/pages/StartupOnboardingPage.jsx) | Publish profile with governorate, legal status (SARL/SUARL), funding in TND, and registration status. |
| `/onboarding/investor` | [Investor Onboarding](file:///d:/downloads/gomycode/src/pages/InvestorOnboardingPage.jsx) | Configure mandate with investor type, ticket in TND, preferred governorates, and investment type. |
| `/explore` | [Explore Startups](file:///d:/downloads/gomycode/src/pages/ExplorePage.jsx) | Search & filter by sector, stage, Tunisian governorate, and funding type in TND. |
| `/resources` | [Official Resources](file:///d:/downloads/gomycode/src/pages/OfficialResourcesPage.jsx) | Repository of official Tunisian legal, funding, tax, support, and IP resource categories. |
| `/startup/:id` | [Startup Details](file:///d:/downloads/gomycode/src/pages/StartupDetailsPage.jsx) | Comprehensive profile with prioritized 6-dimension AI Match score breakdown and *“I’m Interested”* action. |
| `/dashboard/startup` | [Startup Dashboard](file:///d:/downloads/gomycode/src/pages/StartupDashboardPage.jsx) | Manage inbound investor requests in TND, suggested investor matches, and access *“Ask Startup Tunisia Guide”*. |
| `/dashboard/investor` | [Investor Dashboard](file:///d:/downloads/gomycode/src/pages/InvestorDashboardPage.jsx) | Saved startups watchlist, recommended matches, and access *“Ask Investor Tunisia Guide”*. |

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with dark navy background (`#0A0F1D`) and crisp white cards
- **Icons:** Lucide React (`lucide-react`)
- **Routing:** React Router DOM v7 (`react-router-dom`)
- **Persistence:** Browser `localStorage` (Profiles, Watchlists, Inbounds, and Custom Startups)

---

## 🚀 Installation & Local Execution

### 1. Install Dependencies
```bash
cd d:/downloads/gomycode
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Build & Production Preview
```bash
npm run build
npm run preview
```

---

## 📄 Disclaimer
*Demo platform data only — not legal, tax, investment or financial advice. Official Tunisian sources should be consulted.*
