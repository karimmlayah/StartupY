export const TUNISIAN_GOVERNORATES = [
  "All",
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Sfax",
  "Sousse",
  "Monastir",
  "Nabeul",
  "Bizerte",
  "Kairouan",
  "Gabès",
  "Médenine",
  "Mahdia",
  "Jendouba",
  "Béja",
  "Siliana",
  "Zaghouan",
  "Tozeur",
  "Kebili",
  "Tataouine",
  "Gafsa",
  "Kasserine",
  "Sidi Bouzid",
  "Le Kef"
];

export const ALL_SECTORS = [
  "All",
  "AgriTech",
  "FinTech",
  "HealthTech",
  "EdTech",
  "TourismTech",
  "E-commerce",
  "CleanTech",
  "AI / SaaS"
];

export const ALL_STAGES = [
  "All",
  "Idea",
  "MVP",
  "Early Revenue",
  "Growth"
];

export const LEGAL_STATUS_OPTIONS = [
  "Idea",
  "In creation",
  "SUARL",
  "SARL",
  "SA",
  "Other"
];

export const FUNDING_TYPES = [
  "Grant",
  "Angel Investment",
  "Seed Investment",
  "Venture Capital",
  "Loan",
  "Partnership"
];

export const INITIAL_STARTUPS = [
  {
    id: "agrismart-tunisia",
    name: "AgriSmart Tunisia (Demo)",
    pitch: "Precision drip irrigation IoT telemetry optimizing water and olive crop yields across Sfax and the Sahel.",
    sector: "AgriTech",
    stage: "Early Revenue",
    fundingNeeded: "450,000 TND",
    fundingRaised: "120,000 TND",
    valuation: "2,200,000 TND",
    governorate: "Sfax",
    city: "Sfax Thyna",
    country: "Tunisia",
    teamSize: "7 members",
    legalStatus: "SARL",
    registeredInTunisia: "Yes",
    foundedYear: 2023,
    fundingTypeSought: "Seed Investment",
    website: "https://agrismart-demo.tn",
    logoBg: "from-emerald-600 to-teal-700",
    aiMatchScore: 94,
    aiScores: {
      sectorFit: 96,
      ticketFit: 94,
      stageFit: 92,
      governorateFit: 95,
      fundingTypeFit: 93,
      preferencesFit: 94
    },
    aiThesis: "Addressing severe water scarcity in Tunisian agricultural basins with high farmer ROI and strong regional export potential.",
    problem: "Tunisian olive growers lose over 35% of irrigation water to inefficient schedules and lack affordable soil salinity telemetry.",
    solution: "AgriSmart manufactures local solar sensor nodes paired with mobile SMS and app alerts calibrated for Tunisian soil varieties.",
    traction: [
      "Over 45 olive farms equipped in Sfax and Mahdia",
      "Average 28% water reduction measured over two harvest seasons",
      "32,000 TND MRR with 94% renewal rate",
      "Selected in regional AgriTech incubation cohorts"
    ],
    highlights: ["Water Savings", "Local Hardware", "Sahel Agriculture"],
    team: [
      { name: "Kais Ben Amor", role: "CEO & Agronomist", bio: "Agricultural engineer, graduate of INAT Tunis, 8 years in irrigation system design." },
      { name: "Meriem Fakhfakh", role: "CTO", bio: "Embedded systems specialist, engineering degree from ENIS Sfax." }
    ],
    financials: {
      mrr: "32,000 TND",
      burnRate: "14,000 TND/mo",
      runway: "12 months",
      grossMargin: "68%"
    },
    useOfFunds: {
      "Hardware Production Scaling": "50%",
      "Field Technical Sales in Center-South": "30%",
      "Sensors Firmware R&D": "20%"
    }
  },
  {
    id: "dinarpay-solutions",
    name: "DinarPay Solutions (Demo)",
    pitch: "Unified digital QR payment and merchant cash reconciliation gateway for local retailers and cafes across Greater Tunis.",
    sector: "FinTech",
    stage: "Growth",
    fundingNeeded: "1,200,000 TND",
    fundingRaised: "400,000 TND",
    valuation: "5,800,000 TND",
    governorate: "Tunis",
    city: "Tunis Centre / Lac 2",
    country: "Tunisia",
    teamSize: "14 members",
    legalStatus: "SA",
    registeredInTunisia: "Yes",
    foundedYear: 2022,
    fundingTypeSought: "Venture Capital",
    website: "https://dinarpay-demo.tn",
    logoBg: "from-blue-600 to-indigo-700",
    aiMatchScore: 92,
    aiScores: {
      sectorFit: 95,
      ticketFit: 91,
      stageFit: 93,
      governorateFit: 94,
      fundingTypeFit: 90,
      preferencesFit: 89
    },
    aiThesis: "Capitalizing on the modernization of retail cash flows and national digital financial inclusion initiatives.",
    problem: "Over 70% of day-to-day neighborhood retail transactions remain cash-only due to high POS terminal fees and delayed merchant bank settlements.",
    solution: "DinarPay offers an instant smartphone payment acceptance app with 0.8% flat transaction fees and same-day bank clearing.",
    traction: [
      "1,800+ active small merchants in Tunis, Ariana, and Ben Arous",
      "Over 4.5M TND monthly processed volume",
      "Integration with national bank transfer switches",
      "Approved sandbox participant"
    ],
    highlights: ["Merchant Network", "Digital Inclusion", "Fast Settlement"],
    team: [
      { name: "Tarek Trabelsi", role: "Co-Founder & CEO", bio: "Former digital payments product lead at a regional banking group, IHEC Carthage graduate." },
      { name: "Sonia Ghedira", role: "Chief Risk & Compliance", bio: "Financial regulation and banking law expert, former legal counsel in Tunis." }
    ],
    financials: {
      mrr: "65,000 TND",
      burnRate: "35,000 TND/mo",
      runway: "16 months",
      grossMargin: "74%"
    },
    useOfFunds: {
      "Merchant Acquisition in Sousse & Sfax": "45%",
      "Security Audits & Bank Integrations": "35%",
      "Compliance Operations": "20%"
    }
  },
  {
    id: "sahhatech-telemedicine",
    name: "SahhaTech Telemedicine (Demo)",
    pitch: "Digital patient appointment scheduling and secure remote consultation platform connecting interior regions to specialists.",
    sector: "HealthTech",
    stage: "Early Revenue",
    fundingNeeded: "350,000 TND",
    fundingRaised: "90,000 TND",
    valuation: "1,800,000 TND",
    governorate: "Ariana",
    city: "Ariana Ville",
    country: "Tunisia",
    teamSize: "6 members",
    legalStatus: "SARL",
    registeredInTunisia: "Yes",
    foundedYear: 2023,
    fundingTypeSought: "Angel Investment",
    website: "https://sahhatech-demo.tn",
    logoBg: "from-pink-600 to-rose-700",
    aiMatchScore: 90,
    aiScores: {
      sectorFit: 92,
      ticketFit: 93,
      stageFit: 89,
      governorateFit: 91,
      fundingTypeFit: 94,
      preferencesFit: 91
    },
    aiThesis: "Reduces geographical medical deserts by bridging private medical specialists in coastal cities with patients in inland governorates.",
    problem: "Patients in governorates like Kasserine, Sidi Bouzid, and Gafsa travel up to 6 hours for brief medical consultations with specialized doctors in Tunis.",
    solution: "SahhaTech connects patients through high-compression video and digitized medical records with verified Tunisian doctors.",
    traction: [
      "320+ certified private physicians and clinics on platform",
      "12,000 completed consultations across 14 governorates",
      "Partnership with 4 regional medical syndicates",
      "Data encrypted on sovereign local cloud infrastructure"
    ],
    highlights: ["Interior Regions", "Verified Doctors", "Sovereign Cloud"],
    team: [
      { name: "Dr. Amine Mahjoub", role: "CEO & Medical Director", bio: "Practicing physician and digital health advocate, Faculty of Medicine of Tunis." },
      { name: "Yasmine Belhadj", role: "Head of Product", bio: "Software engineer, graduate of ENSI, specialist in UX for healthcare workflows." }
    ],
    financials: {
      mrr: "24,000 TND",
      burnRate: "11,000 TND/mo",
      runway: "14 months",
      grossMargin: "81%"
    },
    useOfFunds: {
      "Clinic Partnerships in Northwest & South": "45%",
      "E-Prescription & Pharmacy Sync": "35%",
      "Patient Support Team": "20%"
    }
  },
  {
    id: "edukhatwa-academy",
    name: "EduKhatwa (Demo)",
    pitch: "Interactive STEM learning and national Baccalaureate preparation platform with localized interactive video simulations.",
    sector: "EdTech",
    stage: "MVP",
    fundingNeeded: "180,000 TND",
    fundingRaised: "45,000 TND Grant",
    valuation: "900,000 TND",
    governorate: "Sousse",
    city: "Sousse Sahloul",
    country: "Tunisia",
    teamSize: "5 members",
    legalStatus: "SUARL",
    registeredInTunisia: "Yes",
    foundedYear: 2024,
    fundingTypeSought: "Grant",
    website: "https://edukhatwa-demo.tn",
    logoBg: "from-amber-500 to-orange-600",
    aiMatchScore: 88,
    aiScores: {
      sectorFit: 90,
      ticketFit: 92,
      stageFit: 86,
      governorateFit: 88,
      fundingTypeFit: 91,
      preferencesFit: 89
    },
    aiThesis: "High consumer demand for structured digital revision aligned directly with Tunisian Ministry of Education curricula.",
    problem: "High school students spend heavy budgets on private tutoring centers without progress tracking, while rural students lack quality teachers.",
    solution: "EduKhatwa provides bite-sized video modules, past Bac exam corrections, and algorithm-guided practice quizzes in French and Arabic.",
    traction: [
      "18,000 registered high school students during pilot phase",
      "92% positive rating on Bac Math & Physics practice drills",
      "Pilot test approved with 3 regional secondary institutions",
      "Recipient of local youth entrepreneurship grant"
    ],
    highlights: ["Official Curriculum", "Affordable Access", "High Engagement"],
    team: [
      { name: "Walid Chaabane", role: "Founder & Lead Educator", bio: "Mathematics educator with 10 years experience in public secondary lycées." },
      { name: "Ines Riahi", role: "Lead Full-Stack Developer", bio: "Software engineer, graduate of ISITCom Hammam Sousse." }
    ],
    financials: {
      mrr: "8,500 TND (Freemium)",
      burnRate: "4,500 TND/mo",
      runway: "10 months",
      grossMargin: "85%"
    },
    useOfFunds: {
      "Curriculum Content Production (Eco/Info/Tech)": "50%",
      "Mobile App Optimization": "30%",
      "School Outreach Campaigns": "20%"
    }
  },
  {
    id: "djerbaxperience",
    name: "DjerbaXperience (Demo)",
    pitch: "Sustainable cultural tourism marketplace connecting international travelers with local artisans, potters, and culinary masters.",
    sector: "TourismTech",
    stage: "Early Revenue",
    fundingNeeded: "220,000 TND",
    fundingRaised: "60,000 TND",
    valuation: "1,100,000 TND",
    governorate: "Médenine",
    city: "Houmt Souk / Djerba",
    country: "Tunisia",
    teamSize: "4 members",
    legalStatus: "SARL",
    registeredInTunisia: "Yes",
    foundedYear: 2023,
    fundingTypeSought: "Angel Investment",
    website: "https://djerbaxperience-demo.tn",
    logoBg: "from-cyan-600 to-blue-700",
    aiMatchScore: 87,
    aiScores: {
      sectorFit: 89,
      ticketFit: 91,
      stageFit: 88,
      governorateFit: 86,
      fundingTypeFit: 88,
      preferencesFit: 87
    },
    aiThesis: "Matches the shift in European and diaspora tourism toward authentic experiential crafts, heritage stays, and eco-routes.",
    problem: "Traditional all-inclusive resort packages bypass local artisan communities, depriving heritage creators of direct tourism revenue.",
    solution: "A curated booking engine for authentic workshops (Guellala pottery, olive oil tastings, Djerbian weaving) with instant multilingual booking.",
    traction: [
      "140+ verified local artisan workshops in Djerba and Zarzis",
      "Over 3,200 foreign traveler bookings completed in 2024",
      "Average basket size of 165 TND per booking with 18% commission",
      "Endorsed by regional craft associations"
    ],
    highlights: ["Artisan Support", "Heritage Tourism", "Direct Impact"],
    team: [
      { name: "Salma Ben Romdhane", role: "Co-Founder & CEO", bio: "Heritage tourism enthusiast, master in Tourism Management from IHET Sidi Dhrif." },
      { name: "Lotfi Zribi", role: "Head of Operations", bio: "Djerba native with 8 years in hospitality operations and community logistics." }
    ],
    financials: {
      mrr: "18,000 TND",
      burnRate: "8,000 TND/mo",
      runway: "13 months",
      grossMargin: "78%"
    },
    useOfFunds: {
      "Expansion to Tozeur & Zaghouan": "45%",
      "Multi-Currency Payment Rails": "35%",
      "European Travel Agency Partnerships": "20%"
    }
  },
  {
    id: "soukcraft-tunisia",
    name: "SoukCraft Tunisia (Demo)",
    pitch: "Direct-to-consumer export logistics and digital storefront for Tunisian certified ceramics, olive wood, and carpet cooperatives.",
    sector: "E-commerce",
    stage: "Early Revenue",
    fundingNeeded: "280,000 TND",
    fundingRaised: "75,000 TND",
    valuation: "1,400,000 TND",
    governorate: "Nabeul",
    city: "Nabeul Ville",
    country: "Tunisia",
    teamSize: "6 members",
    legalStatus: "SARL",
    registeredInTunisia: "Yes",
    foundedYear: 2023,
    fundingTypeSought: "Seed Investment",
    website: "https://soukcraft-demo.tn",
    logoBg: "from-purple-600 to-indigo-700",
    aiMatchScore: 89,
    aiScores: {
      sectorFit: 91,
      ticketFit: 90,
      stageFit: 90,
      governorateFit: 89,
      fundingTypeFit: 92,
      preferencesFit: 90
    },
    aiThesis: "Unlocks high-margin cross-border export revenue for female artisan cooperatives via integrated international customs clearance.",
    problem: "Master ceramic and wood artisans in Nabeul and Kairouan struggle with customs paperwork, international payment gateways, and DHL logistics.",
    solution: "SoukCraft aggregates artisan inventories, handles international packaging, customs declarations, and ships to US/EU buyers in 4 days.",
    traction: [
      "Partnered with 22 artisan cooperatives in Nabeul, Kairouan, and Mahdia",
      "Over 4,800 orders shipped internationally to France, Germany, and the UK",
      "Featured by Tunisian National Office of Handicrafts (ONA) showcase",
      "Strong repeat purchase rate from diaspora buyers"
    ],
    highlights: ["Cross-Border Export", "Fair Trade Artisan", "Nabeul Hub"],
    team: [
      { name: "Fatma Bouzid", role: "CEO", bio: "Former supply chain manager at a multinational retail export group, Dauphine Tunis alumna." },
      { name: "Hedi Guellaty", role: "CTO & E-commerce Lead", bio: "Expert in Shopify Plus and cross-border payment compliance." }
    ],
    financials: {
      mrr: "26,000 TND",
      burnRate: "12,000 TND/mo",
      runway: "15 months",
      grossMargin: "58%"
    },
    useOfFunds: {
      "Central Packaging Hub in Nabeul": "40%",
      "EU Performance Marketing": "40%",
      "Cooperative Onboarding Team": "20%"
    }
  },
  {
    id: "cleansun-carthage",
    name: "CleanSun Carthage (Demo)",
    pitch: "Automated solar panel dry-cleaning robotics for industrial rooftop photovoltaic installations across North Tunisia.",
    sector: "CleanTech",
    stage: "MVP",
    fundingNeeded: "600,000 TND",
    fundingRaised: "150,000 TND",
    valuation: "2,800,000 TND",
    governorate: "Bizerte",
    city: "Menzel Bourguiba",
    country: "Tunisia",
    teamSize: "6 members",
    legalStatus: "In creation",
    registeredInTunisia: "No",
    foundedYear: 2024,
    fundingTypeSought: "Grant",
    website: "https://cleansun-demo.tn",
    logoBg: "from-teal-600 to-emerald-700",
    aiMatchScore: 86,
    aiScores: {
      sectorFit: 88,
      ticketFit: 87,
      stageFit: 85,
      governorateFit: 87,
      fundingTypeFit: 89,
      preferencesFit: 86
    },
    aiThesis: "Dust and sand accumulation in Tunisia reduces solar panel output by up to 26%; waterless cleaning robots preserve critical fresh water.",
    problem: "Commercial solar plants in industrial zones waste scarce potable water or leave panels uncleaned, losing thousands of dinars in solar generation.",
    solution: "CleanSun builds lightweight waterless crawler robots equipped with specialized microfiber rollers that clean rooftop arrays autonomously at night.",
    traction: [
      "Functional V2 prototype tested on 500kW rooftop in Bizerte industrial zone",
      "Restored panel energy yield by an average of 21.4%",
      "Letters of intent signed with 4 industrial textile and ceramic manufacturing plants",
      "Incubated in regional engineering cluster"
    ],
    highlights: ["Waterless Cleaning", "Solar Efficiency", "Industrial Tech"],
    team: [
      { name: "Bilel Ben Salem", role: "CEO & Robotics Lead", bio: "Robotics and mechatronics engineer, graduate of ENIM Monastir." },
      { name: "Nadia Khemir", role: "COO", bio: "Industrial engineer, specialist in plant maintenance and solar EPC contracts." }
    ],
    financials: {
      mrr: "Pre-commercial pilot",
      burnRate: "9,000 TND/mo",
      runway: "11 months",
      grossMargin: "55% projected"
    },
    useOfFunds: {
      "Pilot Fleet Hardware Manufacturing": "55%",
      "Safety Certification & Testing": "25%",
      "Industrial Pilot Deployments": "20%"
    }
  },
  {
    id: "elkalam-ai",
    name: "ElKalam AI (Demo)",
    pitch: "Sovereign AI language models and document classification API for Tunisian administrative, banking, and legal workflows.",
    sector: "AI / SaaS",
    stage: "Early Revenue",
    fundingNeeded: "500,000 TND",
    fundingRaised: "180,000 TND",
    valuation: "3,500,000 TND",
    governorate: "Tunis",
    city: "Tunis Les Berges du Lac",
    country: "Tunisia",
    teamSize: "8 members",
    legalStatus: "SARL",
    registeredInTunisia: "Yes",
    foundedYear: 2023,
    fundingTypeSought: "Venture Capital",
    website: "https://elkalam-demo.tn",
    logoBg: "from-violet-600 to-indigo-700",
    aiMatchScore: 93,
    aiScores: {
      sectorFit: 96,
      ticketFit: 93,
      stageFit: 92,
      governorateFit: 94,
      fundingTypeFit: 91,
      preferencesFit: 95
    },
    aiThesis: "Tunisian enterprises operate in a unique mix of French, Standard Arabic, and Tunisian Derja that generic Western LLMs fail to parse correctly.",
    problem: "Financial institutions and insurance agencies spend thousands of employee hours manually processing bilingual administrative claims and records.",
    solution: "ElKalam trains proprietary NLP models specialized in Tunisian administrative texts, identity extraction, and multilingual optical character recognition.",
    traction: [
      "40,000 TND MRR with 2 local insurance companies and 1 private bank",
      "Over 1.2 million scanned legal & financial documents indexed with 98.2% OCR accuracy",
      "On-premises deployment option ensuring data never leaves Tunisian borders",
      "Partnership with local higher education AI research laboratory"
    ],
    highlights: ["Tunisian Derja & French", "Sovereign Data", "Banking Grade"],
    team: [
      { name: "Dr. Zied Mezghani", role: "CEO & AI Scientist", bio: "PhD in Computational Linguistics, former researcher at National School of Computer Sciences (ENSI)." },
      { name: "Leila Ben Cheikh", role: "VP of Enterprise Solutions", bio: "Ex-IT consultant at major regional audit firm, specialized in enterprise ERP rollouts." }
    ],
    financials: {
      mrr: "40,000 TND",
      burnRate: "18,000 TND/mo",
      runway: "15 months",
      grossMargin: "84%"
    },
    useOfFunds: {
      "GPU Cluster Expansion & Local Hosting": "45%",
      "Enterprise Banking Sales": "35%",
      "Dialectical Arabic Research": "20%"
    }
  }
];
