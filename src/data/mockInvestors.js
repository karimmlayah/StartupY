export const INVESTOR_TYPES = [
  "Angel Investor",
  "Venture Capital",
  "Fund",
  "Corporate",
  "Incubator",
  "Bank",
  "Diaspora Investor"
];

export const INVESTMENT_TYPES = [
  "Equity",
  "Convertible Note",
  "Grant",
  "Loan",
  "Partnership"
];

export const INITIAL_INVESTORS = [
  {
    id: "carthage-angels",
    name: "Carthage Angels Network (Demo)",
    type: "Angel Investor",
    partner: "Slimane Ben Youssef, Lead Angel",
    sectors: ["AI / SaaS", "FinTech", "EdTech"],
    ticketSize: "50,000 - 250,000 TND",
    stages: ["Idea", "MVP", "Early Revenue"],
    governorates: ["Tunis", "Ariana", "Sousse", "Sfax"],
    investmentType: "Equity",
    matchScore: 95,
    thesis: "Backing ambitious Tunisian founders building scalable software products for domestic adoption and Mediterranean export.",
    portfolioHighlights: ["Bilingual OCR", "Local EdTech", "SaaS Billing"],
    status: "Active Seed Check (Demo)",
    linkedIn: "https://linkedin.com/company/carthage-angels-demo"
  },
  {
    id: "jasmine-capital",
    name: "Jasmine Capital Partners (Demo)",
    type: "Venture Capital",
    partner: "Nourhene Karray, Managing Partner",
    sectors: ["AgriTech", "FinTech", "CleanTech"],
    ticketSize: "500,000 - 2,000,000 TND",
    stages: ["Early Revenue", "Growth"],
    governorates: ["All"],
    investmentType: "Equity",
    matchScore: 92,
    thesis: "Institutional early-stage fund supporting validated Tunisian ventures expanding into North Africa, Sub-Saharan Africa, and Southern Europe.",
    portfolioHighlights: ["Irrigation IoT", "Payment Rails", "Green Solar"],
    status: "Active Lead VC (Demo)",
    linkedIn: "https://linkedin.com/company/jasmine-capital-demo"
  },
  {
    id: "elghazala-seed",
    name: "El Ghazala Tech Seed Fund (Demo)",
    type: "Incubator",
    partner: "Fethi Hamdi, Head of Incubation",
    sectors: ["AI / SaaS", "HealthTech", "CleanTech"],
    ticketSize: "30,000 - 150,000 TND",
    stages: ["Idea", "MVP"],
    governorates: ["Ariana", "Tunis", "Manouba"],
    investmentType: "Grant",
    matchScore: 90,
    thesis: "Public-private tech pole initiative providing pre-seed financial support, engineering facilities, and mentor connections to university spin-offs.",
    portfolioHighlights: ["MedTech Prototype", "Telemedicine Portal", "Robotics"],
    status: "Grant & Incubation (Demo)",
    linkedIn: "https://linkedin.com/company/elghazala-seed-demo"
  },
  {
    id: "diaspora-syndicate",
    name: "Tunisian Diaspora Venture Syndicate (Demo)",
    type: "Diaspora Investor",
    partner: "Mehdi Cherif, Paris & Tunis Syndicate Lead",
    sectors: ["TourismTech", "E-commerce", "FinTech"],
    ticketSize: "100,000 - 600,000 TND",
    stages: ["MVP", "Early Revenue"],
    governorates: ["Tunis", "Sousse", "Sfax", "Médenine", "Nabeul"],
    investmentType: "Convertible Note",
    matchScore: 89,
    thesis: "Executives and tech leaders in the Tunisian diaspora deploying capital, commercial bridges to Europe, and mentorship for homegrown startups.",
    portfolioHighlights: ["Artisan Export", "Djerba Tourism", "Cross-Border Logistics"],
    status: "Syndicate Co-Investor (Demo)",
    linkedIn: "https://linkedin.com/company/diaspora-syndicate-demo"
  }
];

export const MOCK_INTERESTED_REQUESTS = [
  {
    id: "req-tn-1",
    investorName: "Slimane Ben Youssef",
    firm: "Carthage Angels Network (Demo)",
    date: "2 hours ago",
    checkSize: "150,000 - 250,000 TND",
    note: "Reviewed your pilot customer metrics and water conservation data in Sfax. We would like to schedule an introductory partner session in Tunis this Thursday.",
    stage: "New",
    avatarBg: "from-blue-600 to-indigo-600"
  },
  {
    id: "req-tn-2",
    investorName: "Nourhene Karray",
    firm: "Jasmine Capital Partners (Demo)",
    date: "Yesterday",
    checkSize: "600,000 - 1,200,000 TND",
    note: "Strong alignment with our digital inclusion and agritech investment thesis. Requesting financial model and cap table overview.",
    stage: "In Review",
    avatarBg: "from-purple-600 to-pink-600"
  },
  {
    id: "req-tn-3",
    investorName: "Mehdi Cherif",
    firm: "Tunisian Diaspora Venture Syndicate (Demo)",
    date: "3 days ago",
    checkSize: "200,000 - 400,000 TND",
    note: "Very impressed by the founding team's execution speed. Looking to participate in a syndicated round with European commercial distribution.",
    stage: "Intro Scheduled",
    avatarBg: "from-emerald-600 to-teal-700"
  }
];

export const DEFAULT_INVESTOR_PROFILE = {
  name: "Carthage Ventures Team (Demo)",
  firm: "Carthage Angels Network (Demo)",
  type: "Angel Investor",
  focus: ["AgriTech", "FinTech", "AI / SaaS"],
  budgetRange: "100,000 - 500,000 TND",
  preferredStage: "Early Revenue",
  region: "Tunis, Sfax, Sousse",
  investmentType: "Equity",
  bio: "Tunisian angel syndicate backing high-conviction founders solving national challenges with scalable digital and industrial technology.",
  totalInvested: "2,400,000 TND (Demo)",
  activeInvestments: 7
};

export const DEFAULT_STARTUP_PROFILE = {
  name: "AgriSmart Tunisia (Demo)",
  pitch: "Precision drip irrigation IoT telemetry optimizing water and olive crop yields across Sfax and the Sahel.",
  sector: "AgriTech",
  stage: "Early Revenue",
  fundingNeeded: "450,000 TND",
  governorate: "Sfax",
  country: "Tunisia",
  teamSize: "7 members",
  legalStatus: "SARL",
  registeredInTunisia: "Yes",
  fundingTypeSought: "Seed Investment",
  valuation: "2,200,000 TND",
  runway: "12 months",
  interestedInvestorsCount: 6
};
