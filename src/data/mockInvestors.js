export const INITIAL_INVESTORS = [
  {
    id: "apex-horizon-capital",
    name: "Apex Horizon Capital",
    type: "Venture Capital Firm",
    partner: "Victoria Stirling, Managing General Partner",
    sectors: ["AI & Machine Learning", "B2B SaaS", "CyberSecurity"],
    checkSize: "$1.0M - $3.5M",
    stages: ["Early Revenue", "Growth"],
    location: "San Francisco, CA & London",
    matchScore: 96,
    thesis: "Backing mission-critical applied AI automation software with strong enterprise data lock-in and founder-led technical depth.",
    portfolioHighlights: ["Synthetix", "VectorDB Core", "ShieldData"],
    status: "Active Lead Investor"
  },
  {
    id: "blueshift-ventures",
    name: "BlueShift Ventures",
    type: "Early Stage Tech Fund",
    partner: "David Kim, General Partner",
    sectors: ["FinTech", "AI & Machine Learning", "Supply Chain"],
    checkSize: "$500k - $2.0M",
    stages: ["MVP", "Early Revenue"],
    location: "New York & Singapore",
    matchScore: 92,
    thesis: "Investing in fintech rails, programmable money, and autonomous supply chains modernizing legacy commerce corridors.",
    portfolioHighlights: ["BorderFlow", "PayMesh", "LedgerIQ"],
    status: "Follow-on & Syndicate Lead"
  },
  {
    id: "greentech-syndicate",
    name: "TerraNova Climate Fund",
    type: "Climate & DeepTech VC",
    partner: "Dr. Marianne Weber, Investment Director",
    sectors: ["CleanTech & Sustainability", "AgriTech & AI"],
    checkSize: "$750k - $3.0M",
    stages: ["MVP", "Early Revenue", "Growth"],
    location: "Berlin & Paris",
    matchScore: 89,
    thesis: "Catalyzing industrial decarbonization, hydrogen transport, and regenerative agriculture with measurable carbon impact.",
    portfolioHighlights: ["AuraBio", "VoltCell", "AeroCapture"],
    status: "Lead Investor"
  },
  {
    id: "apex-angel-network",
    name: "Founders Guild Angel Syndicate",
    type: "Operator Syndicate",
    partner: "Arjun Mehta, Syndicate Lead",
    sectors: ["AI & Machine Learning", "EdTech", "B2B SaaS"],
    checkSize: "$100k - $500k",
    stages: ["Idea", "MVP", "Early Revenue"],
    location: "Toronto & Global",
    matchScore: 88,
    thesis: "Ex-founders writing fast first checks and offering hands-on technical hiring, product distribution, and zero-to-one advisory.",
    portfolioHighlights: ["PromptStack", "CloudDevs", "TutorIQ"],
    status: "Fast First Check"
  }
];

export const MOCK_INTERESTED_REQUESTS = [
  {
    id: "req-1",
    investorName: "Victoria Stirling",
    firm: "Apex Horizon Capital",
    date: "2 hours ago",
    checkSize: "$1.5M - $2.5M",
    note: "Reviewed your Q3 pilot metrics and pipeline. The autonomous agent resolution rate is exceptional. We would love to arrange an introductory partner call this Thursday.",
    stage: "New",
    avatarBg: "from-blue-600 to-indigo-600"
  },
  {
    id: "req-2",
    investorName: "David Kim",
    firm: "BlueShift Ventures",
    date: "Yesterday",
    checkSize: "$750k - $1.2M",
    note: "Strong alignment with our enterprise vertical thesis. Requesting access to your data room and cap table overview.",
    stage: "In Review",
    avatarBg: "from-purple-600 to-pink-600"
  },
  {
    id: "req-3",
    investorName: "Sarah Jenkins",
    firm: "Beacon Global Angels",
    date: "3 days ago",
    checkSize: "$250k - $500k",
    note: "Impressive founding team background. Looking to participate in a syndicated note or safe round.",
    stage: "Intro Scheduled",
    avatarBg: "from-emerald-600 to-teal-700"
  }
];

export const DEFAULT_INVESTOR_PROFILE = {
  name: "Marcus Vance & Partners",
  firm: "Vance Global Ventures",
  focus: ["AI & Machine Learning", "FinTech", "CyberSecurity"],
  budgetRange: "$500,000 - $2,500,000",
  preferredStage: "Early Revenue",
  region: "North America & Europe",
  bio: "Seed to Series A venture syndicate investing in high-velocity software and AI infrastructure.",
  totalInvested: "$18.4M",
  activeInvestments: 14
};

export const DEFAULT_STARTUP_PROFILE = {
  name: "OmniPulse AI",
  pitch: "Autonomous AI agent workforce for multi-channel enterprise customer operations and revenue recovery.",
  sector: "AI & Machine Learning",
  stage: "Early Revenue",
  fundingNeeded: "$1,800,000",
  country: "United States",
  teamSize: "8 members",
  valuation: "$9.5M",
  runway: "14 months",
  interestedInvestorsCount: 7
};
