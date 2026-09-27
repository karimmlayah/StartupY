# StartupBridge AI 🚀
> **Where Startups Meet Smart Capital.**

StartupBridge AI is a modern, responsive two-sided matchmaking platform connecting high-conviction tech startups with angel syndicates and venture capital funds, augmented by an interactive AI guidance engine for fundraising, valuation, and due diligence analysis.

---

## 🌟 Highlights & Key Features

- **Professional Startup & Investment Aesthetic:**
  - Sleek **dark navy background** (`#0A0F1D` / `#0C1220`)
  - Crisp **white cards** with high-contrast typography, shadow depth, and micro-animations
  - **Electric blue** (`#3B82F6` / `#2563EB`) and **electric violet** (`#8B5CF6` / `#7C3AED`) gradients & accents
- **Comprehensive Two-Sided Platform:**
  - **Startups / Founders:** Publish profiles, track incoming investor interest, get AI pitch deck feedback, review valuation benchmarks.
  - **Investors / Angels & VCs:** Search and filter vetted deal flow, view objective AI match scores, maintain private watchlists, and send one-click "I'm Interested" connection requests.
- **Client-Side Persistence:**
  - Built with `localStorage` for profiles, custom startups, saved watchlists, and inbound investor interest requests.
  - 100% demo-ready without requiring login credentials or third-party paid API keys.

---

## 📱 Pages & Navigation Structure

1. **Landing Page (`/`)**
   - Hero: *“Where Startups Meet Smart Capital.”*
   - Platform value summary, quick exploration CTA buttons (*“Explore Startups”* and *“Join as Startup”*).
   - 3-step onboarding overview: **Create Profile**, **Find Matches**, **Start Conversations**.
   - Platform metrics strip ($148M+ Capital Deployed, 1,250+ Startups, 94% Match Precision).
   - Featured startup preview cards and two-sided value proposition.

2. **Auth Choice Page (`/auth`)**
   - Two large interactive cards:
     - **“I’m a Startup”** (Benefits for founders, navigates to startup onboarding)
     - **“I’m an Investor”** (Benefits for capital providers, navigates to investor onboarding)
   - Quick one-click links to preview demo dashboards directly.

3. **Startup Onboarding Page (`/onboarding/startup`)**
   - Full publication form: Startup name, one-line pitch, sector, stage selector (*Idea, MVP, Early Revenue, Growth*), funding needed, country, team size.
   - On submission: saves new startup to `localStorage` and redirects to the **Startup Dashboard**.

4. **Investor Onboarding Page (`/onboarding/investor`)**
   - Mandate setup form: Investor name, firm affiliation, investment focus sectors (multi-select), budget range, preferred startup stage, target geographic region.
   - On submission: saves profile to `localStorage` and redirects to the **Investor Dashboard**.

5. **Explore Startups Page (`/explore`)**
   - Displays 8+ realistic mock startups + any user-created startups.
   - Real-time search by name, sector, country, and pitch keywords.
   - Dynamic filters by **Sector**, **Stage**, and **Country**.
   - Sort by **Highest AI Match**, **Funding Seeking**, and **Alphabetical**.
   - Card details: logo initials with gradient, stage badge, sector, country, seeking amount, AI match score, and bookmark toggle.

6. **Startup Details Page (`/startup/:id`)**
   - In-depth profile with problem statement, proprietary solution, verified traction points, team bios, financials, and capital allocation plan.
   - **Prominent AI Match Score Card:** Displays overall score (e.g. 94%) with 4 sub-scores (*Sector Alignment, Stage Fit, Growth Velocity, Team Defensibility*).
   - **“I’m Interested”** action button: triggers the required success modal (*“Interest request sent to the startup.”*) and updates inbound records.

7. **Startup Dashboard (`/dashboard/startup`)**
   - Profile summary with editable attributes and public view link.
   - Live KPI cards: **Interested Investors** count, investor views, AI readiness score, and intro turnaround time.
   - Inbound investor requests inbox with *Accept & Schedule Intro* and *Decline* actions.
   - Suggested investor matches with match scores and check sizes.
   - **“Ask Startup AI Guide”** button opening the AI modal.

8. **Investor Dashboard (`/dashboard/investor`)**
   - Profile mandate summary.
   - KPI metrics: saved startups, screened deals, and average thesis fit.
   - **Saved Startups (Watchlist):** Manage bookmarked startups, remove, view details, or send interest.
   - **Recommended Startup Matches:** Algorithmic recommendations tailored to investor preferences.
   - **“Ask Investor AI Guide”** button opening the AI modal.

9. **AI Guide Modal (Global & Contextual)**
   - Role switcher tabs: **“Startup Guide”** and **“Investor Guide”**.
   - 3 suggested prompt pills per role with instant, realistic structured demo answers clearly labelled **“Demo AI response”**.
   - Custom query input supporting questions on valuation multiples, pitch deck structure, due diligence checklists, and founder evaluation frameworks.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React (`lucide-react`)
- **Routing:** React Router DOM v7 (`react-router-dom`)
- **State & Storage:** React Hooks + `localStorage` client persistence

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure you have **Node.js 18+** (Node v20+ recommended) and **npm** installed.

### 2. Clone / Enter Workspace
```bash
cd d:/downloads/gomycode
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Local Development Server
```bash
npm run dev
```
The app will run locally (typically at `http://localhost:5173`). Open the URL in your browser to test and navigate the complete app.

### 5. Production Build & Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Testing the Workflow Without Login

1. **Explore Startups:** Navigate to `/explore` to browse, search, and filter companies.
2. **Review a Profile:** Click *“View Details”* on any card to view the AI Match Score breakdown.
3. **Send Interest:** Click *“I’m Interested”* on the detail page to view the confirmation modal.
4. **Publish a Startup:** Click *“Join as Startup”* from the hero or navigate to `/onboarding/startup` to add your company. You will automatically land in the **Startup Dashboard**.
5. **Investor Mode:** Navigate to `/auth`, click *“I’m an Investor”*, fill your check size mandate, and view your personalized **Investor Dashboard**.
6. **Consult AI Guide:** Click the *“AI Guide”* button in the navbar, or click *“Ask Startup AI Guide”* / *“Ask Investor AI Guide”* inside either dashboard.

---

## 📄 License
MIT License. Built for demonstration and rapid investor-startup matchmaking.
