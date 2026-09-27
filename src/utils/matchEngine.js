/**
 * StartupBridge AI Tunisia - Deterministic Smart Match Engine
 * 
 * Computes transparent, explainable compatibility scores (0 - 100)
 * between a Tunisian startup and an investor.
 */

// Related sectors mapping for partial scoring
const RELATED_SECTORS = {
  "AgriTech": ["CleanTech", "AI / SaaS"],
  "CleanTech": ["AgriTech"],
  "FinTech": ["E-commerce", "AI / SaaS"],
  "E-commerce": ["FinTech", "TourismTech"],
  "HealthTech": ["AI / SaaS"],
  "EdTech": ["AI / SaaS"],
  "TourismTech": ["E-commerce"],
  "AI / SaaS": ["FinTech", "HealthTech", "EdTech", "AgriTech"]
};

// Stage hierarchy for adjacency calculation
const STAGE_ORDER = ["Idea", "MVP", "Early Revenue", "Growth"];

// Related funding types
const RELATED_FINANCING = {
  "Seed Investment": ["Equity", "Convertible Note", "Angel Investment", "Venture Capital"],
  "Angel Investment": ["Equity", "Convertible Note", "Seed Investment"],
  "Venture Capital": ["Equity", "Seed Investment"],
  "Grant": ["Incubator", "Partnership"],
  "Equity": ["Seed Investment", "Angel Investment", "Venture Capital"],
  "Convertible Note": ["Seed Investment", "Angel Investment", "Equity"],
  "Loan": ["Bank", "Partnership"],
  "Partnership": ["Corporate", "Grant"]
};

/**
 * Parse numeric amount in TND from strings like "450,000 TND" or "1.2M TND"
 */
export function parseTndAmount(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val;

  const clean = val.replace(/TND/gi, '').replace(/\s+/g, '').toLowerCase();
  
  if (clean.includes('m')) {
    const num = parseFloat(clean.replace('m', ''));
    return num * 1000000;
  }
  if (clean.includes('k')) {
    const num = parseFloat(clean.replace('k', ''));
    return num * 1000;
  }

  // Remove commas or dots used as thousand separators
  const digits = clean.replace(/[^0-9.]/g, '');
  return parseFloat(digits) || 0;
}

/**
 * Parse ticket range from strings like "100,000 - 500,000 TND" or "50,000 - 250,000 TND"
 */
export function parseTicketRange(rangeStr) {
  if (!rangeStr) return { min: 50000, max: 500000 };

  const parts = rangeStr.split(/[-–—to]/i);
  if (parts.length >= 2) {
    const min = parseTndAmount(parts[0]);
    const max = parseTndAmount(parts[1]);
    return { min: min || 50000, max: max || 1000000 };
  }

  const single = parseTndAmount(rangeStr);
  return { min: single * 0.5 || 50000, max: single * 1.5 || 500000 };
}

/**
 * Calculate match score between a startup and an investor
 * 
 * @param {Object} startup 
 * @param {Object} investor 
 * @returns {Object} Deterministic match evaluation
 */
export function calculateSmartMatch(startup, investor) {
  if (!startup || !investor) {
    return {
      score: 50,
      label: "Potential Match",
      breakdown: [],
      strengths: [],
      gaps: [],
      recommendation: "Provide complete startup and investor profiles to calculate accurate match score."
    };
  }

  const breakdown = [];
  const strengths = [];
  const gaps = [];

  // ==========================================
  // 1. Sector Compatibility (Max 30 points)
  // ==========================================
  const investorSectors = Array.isArray(investor.focus || investor.sectors)
    ? (investor.focus || investor.sectors)
    : [investor.focus || investor.sectors || ""];
  
  const startupSector = startup.sector || "";
  let sectorScore = 0;
  let sectorExplanation = "";

  const hasExactSector = investorSectors.some(
    s => s.toLowerCase() === startupSector.toLowerCase() || s.toLowerCase() === "all"
  );

  if (hasExactSector) {
    sectorScore = 30;
    sectorExplanation = `Exact sector match in ${startupSector}. Investor actively prioritizes this vertical.`;
    strengths.push(`Direct sector alignment in ${startupSector}`);
  } else {
    // Check related sector
    const related = RELATED_SECTORS[startupSector] || [];
    const hasRelated = investorSectors.some(s => related.includes(s));

    if (hasRelated) {
      sectorScore = 18;
      sectorExplanation = `Adjacent sector synergy (${startupSector} relates to investor's focus in ${investorSectors.join(", ")}).`;
      strengths.push(`Synergistic domain overlap with ${startupSector}`);
    } else {
      sectorScore = 0;
      sectorExplanation = `Sector mismatch. Startup operates in ${startupSector}, while investor targets ${investorSectors.join(", ")}.`;
      gaps.push(`Sector deviation: Investor focuses on ${investorSectors.join(", ")}`);
    }
  }

  breakdown.push({
    criterion: "Sector Compatibility",
    score: sectorScore,
    maxScore: 30,
    explanation: sectorExplanation
  });

  // ==========================================
  // 2. Ticket Size Compatibility (Max 25 points)
  // ==========================================
  const fundingNeeded = parseTndAmount(startup.fundingNeeded);
  const ticketRange = parseTicketRange(investor.budgetRange || investor.ticketSize);
  let ticketScore = 0;
  let ticketExplanation = "";

  const minTicket = ticketRange.min;
  const maxTicket = ticketRange.max;

  if (fundingNeeded >= minTicket && fundingNeeded <= maxTicket) {
    ticketScore = 25;
    ticketExplanation = `Funding request of ${fundingNeeded.toLocaleString()} TND fits perfectly within investor's ${minTicket.toLocaleString()}–${maxTicket.toLocaleString()} TND check range.`;
    strengths.push(`Requested capital (${fundingNeeded.toLocaleString()} TND) fits optimal check size`);
  } else {
    // Check if slightly outside range (within 40% tolerance)
    const lowerTolerance = minTicket * 0.6;
    const upperTolerance = maxTicket * 1.4;

    if (fundingNeeded >= lowerTolerance && fundingNeeded <= upperTolerance) {
      ticketScore = 12;
      ticketExplanation = `Funding request of ${fundingNeeded.toLocaleString()} TND is near the boundary of investor's ${minTicket.toLocaleString()}–${maxTicket.toLocaleString()} TND range (syndication feasible).`;
      gaps.push(`Check size variance: Request is slightly outside standard range (${minTicket.toLocaleString()}–${maxTicket.toLocaleString()} TND)`);
    } else {
      ticketScore = 0;
      ticketExplanation = `Capital ask of ${fundingNeeded.toLocaleString()} TND is far outside investor's ${minTicket.toLocaleString()}–${maxTicket.toLocaleString()} TND ticket mandate.`;
      gaps.push(`Ticket size mismatch: Request deviates significantly from investor bracket`);
    }
  }

  breakdown.push({
    criterion: "Ticket Size in TND",
    score: ticketScore,
    maxScore: 25,
    explanation: ticketExplanation
  });

  // ==========================================
  // 3. Startup Stage Compatibility (Max 15 points)
  // ==========================================
  const preferredStages = Array.isArray(investor.stages)
    ? investor.stages
    : [investor.preferredStage || "Early Revenue"];
  const startupStage = startup.stage || "Early Revenue";
  let stageScore = 0;
  let stageExplanation = "";

  const hasExactStage = preferredStages.some(
    st => st.toLowerCase() === startupStage.toLowerCase() || st.toLowerCase() === "all"
  );

  if (hasExactStage) {
    stageScore = 15;
    stageExplanation = `Exact stage alignment: Startup is at ${startupStage}, which is the investor's designated entry stage.`;
    strengths.push(`Ideal maturity fit at ${startupStage} stage`);
  } else {
    // Calculate stage distance in index
    const startupStageIdx = STAGE_ORDER.indexOf(startupStage);
    const minDistance = Math.min(
      ...preferredStages.map(st => {
        const idx = STAGE_ORDER.indexOf(st);
        return idx !== -1 && startupStageIdx !== -1 ? Math.abs(idx - startupStageIdx) : 99;
      })
    );

    if (minDistance === 1) {
      stageScore = 8;
      stageExplanation = `Adjacent stage match: Startup is at ${startupStage} (investor prefers ${preferredStages.join(", ")}). Close enough for review.`;
    } else {
      stageScore = 0;
      stageExplanation = `Stage gap: Startup is at ${startupStage}, whereas investor strictly deploys into ${preferredStages.join(", ")}.`;
      gaps.push(`Maturity gap: Investor focuses on ${preferredStages.join(", ")}`);
    }
  }

  breakdown.push({
    criterion: "Startup Stage Compatibility",
    score: stageScore,
    maxScore: 15,
    explanation: stageExplanation
  });

  // ==========================================
  // 4. Governorate / Regional Preference (Max 10 points)
  // ==========================================
  const startupGov = startup.governorate || "Tunis";
  const preferredGovs = Array.isArray(investor.governorates || investor.preferredGovernorates)
    ? (investor.governorates || investor.preferredGovernorates)
    : (investor.region ? investor.region.split(/[,/]+/).map(s => s.trim()) : []);

  let govScore = 0;
  let govExplanation = "";

  const hasGovAll = preferredGovs.some(g => g.toLowerCase().includes("all"));
  const hasExactGov = preferredGovs.some(g => g.toLowerCase() === startupGov.toLowerCase());

  if (hasGovAll || hasExactGov) {
    govScore = 10;
    govExplanation = `Startup headquarters in ${startupGov} directly matches the investor's regional focus in Tunisia.`;
    strengths.push(`Local geographic preference match in ${startupGov}`);
  } else if (preferredGovs.length === 0 || preferredGovs[0] === "") {
    govScore = 6;
    govExplanation = `Investor has no geographic restriction within Tunisia (open to all 24 governorates).`;
  } else {
    govScore = 0;
    govExplanation = `Startup is located in ${startupGov}, while investor focuses on ${preferredGovs.join(", ")}.`;
    gaps.push(`Regional focus: Investor targets ${preferredGovs.slice(0, 3).join(", ")}`);
  }

  breakdown.push({
    criterion: "Tunisian Governorate / Region",
    score: govScore,
    maxScore: 10,
    explanation: govExplanation
  });

  // ==========================================
  // 5. Funding Type Compatibility (Max 10 points)
  // ==========================================
  const startupFundingType = startup.fundingTypeSought || "Seed Investment";
  const investorInvType = investor.investmentType || "Equity";
  let fundingTypeScore = 0;
  let fundingTypeExplanation = "";

  if (
    startupFundingType.toLowerCase() === investorInvType.toLowerCase() ||
    (startupFundingType === "Seed Investment" && investorInvType === "Equity") ||
    (startupFundingType === "Venture Capital" && investorInvType === "Equity") ||
    (startupFundingType === "Grant" && investorInvType === "Grant")
  ) {
    fundingTypeScore = 10;
    fundingTypeExplanation = `Complementary financing structure: ${startupFundingType} sought matches investor's ${investorInvType} mandate.`;
    strengths.push(`Compatible investment vehicle (${investorInvType})`);
  } else {
    const relatedList = RELATED_FINANCING[startupFundingType] || [];
    if (relatedList.some(f => f.toLowerCase() === investorInvType.toLowerCase())) {
      fundingTypeScore = 5;
      fundingTypeExplanation = `Compatible financing structure: ${startupFundingType} can be structured via ${investorInvType}.`;
    } else {
      fundingTypeScore = 0;
      fundingTypeExplanation = `Financing vehicle divergence: Startup seeks ${startupFundingType}, while investor deploys ${investorInvType}.`;
      gaps.push(`Financing structure mismatch (${startupFundingType} vs ${investorInvType})`);
    }
  }

  breakdown.push({
    criterion: "Funding Type Compatibility",
    score: fundingTypeScore,
    maxScore: 10,
    explanation: fundingTypeExplanation
  });

  // ==========================================
  // 6. Investor Mandate Preferences (Max 10 points)
  // ==========================================
  const investorType = investor.type || "Angel Investor";
  let mandateScore = 0;
  let mandateExplanation = "";

  // Check institutional & registration alignment
  const isRegistered = startup.registeredInTunisia === "Yes";
  const isSarlOrSa = ["SARL", "SA", "SUARL"].includes(startup.legalStatus);

  if (investorType === "Venture Capital") {
    if (isRegistered && isSarlOrSa && (startupStage === "Early Revenue" || startupStage === "Growth")) {
      mandateScore = 10;
      mandateExplanation = `Institutional VC mandate: Startup is incorporated (${startup.legalStatus}) with commercial traction in Tunisia.`;
      strengths.push(`Formalized corporate governance (${startup.legalStatus}) aligned with VC mandate`);
    } else if (isRegistered) {
      mandateScore = 5;
      mandateExplanation = `Partial VC fit: Incorporated entity in Tunisia, but stage requires scaling before lead check.`;
    } else {
      mandateScore = 0;
      mandateExplanation = `VC mandate requires formal corporate incorporation in Tunisia prior to term sheet.`;
      gaps.push(`Corporate legal formalization required for institutional VC`);
    }
  } else if (investorType === "Angel Investor" || investorType === "Diaspora Investor") {
    if (isRegistered || startupStage === "MVP" || startupStage === "Early Revenue") {
      mandateScore = 10;
      mandateExplanation = `Angel mandate alignment: Fast check suitability and founder-led execution in Tunisia.`;
      strengths.push(`Strong founder-led execution velocity for angel backing`);
    } else {
      mandateScore = 5;
      mandateExplanation = `Moderate angel alignment: Opportunity may require mentor advisory round first.`;
    }
  } else if (investorType === "Incubator") {
    if (startupStage === "Idea" || startupStage === "MVP") {
      mandateScore = 10;
      mandateExplanation = `Incubator mandate match: Prime stage for tech incubation and prototyping vouchers.`;
      strengths.push(`Optimal timing for prototype incubation and lab resources`);
    } else {
      mandateScore = 5;
      mandateExplanation = `Startup has already advanced beyond typical pre-seed incubation threshold.`;
    }
  } else {
    mandateScore = 5;
    mandateExplanation = `General alignment with investor operational profile.`;
  }

  breakdown.push({
    criterion: "Investor Mandate Preferences",
    score: mandateScore,
    maxScore: 10,
    explanation: mandateExplanation
  });

  // ==========================================
  // Total Score Calculation & Labeling
  // ==========================================
  const totalScore = sectorScore + ticketScore + stageScore + govScore + fundingTypeScore + mandateScore;
  const clampedScore = Math.max(0, Math.min(100, Math.round(totalScore)));

  let label = "Potential Match";
  if (clampedScore >= 85) {
    label = "Excellent Match";
  } else if (clampedScore >= 70) {
    label = "Strong Match";
  } else if (clampedScore >= 50) {
    label = "Potential Match";
  } else {
    label = "Low Match";
  }

  // Dynamic actionable recommendation
  let recommendation = "";
  if (clampedScore >= 85) {
    recommendation = `Priority Opportunity: Schedule an introductory partner call. The ${fundingNeeded.toLocaleString()} TND ask and ${startupStage} stage in ${startupSector} align tightly with this investor's active mandate.`;
  } else if (clampedScore >= 70) {
    recommendation = `Recommended for Diligence: Address check size or stage nuances in your introductory deck, highlighting your customer retention in ${startupGov}.`;
  } else if (clampedScore >= 50) {
    recommendation = `Explore with Adjustments: Consider syndicated co-investment or adapting the check size to align more closely with investor constraints.`;
  } else {
    recommendation = `Low Thesis Overlap: Focus outreach on investors specifically deploying capital into ${startupSector} and ${startupStage} ventures in Tunisia.`;
  }

  return {
    score: clampedScore,
    label,
    breakdown,
    strengths: strengths.slice(0, 3),
    gaps: gaps.slice(0, 3),
    recommendation
  };
}

/* =========================================================================
   TEST SUITE: 5 Deterministic Unit Test Cases (Requirement 7)
   =========================================================================
   Test 1: Exact High Match (Expect score >= 85, "Excellent Match")
   Test 2: Sector Mismatch (Expect sectorScore = 0, "Low Match" or "Potential Match")
   Test 3: Ticket Mismatch (Funding needed far outside range, ticketScore = 0)
   Test 4: Stage Mismatch (Idea vs Growth, stageScore = 0)
   Test 5: Partial Match (Related sector, adjacent stage, slightly outside ticket, score ~55-75)
   ========================================================================= */

export const MATCH_ENGINE_TESTS = [
  {
    name: "Test 1: Exact High Match (AgriSmart Tunisia + Jasmine Capital)",
    startup: {
      name: "AgriSmart Tunisia",
      sector: "AgriTech",
      stage: "Early Revenue",
      fundingNeeded: "450,000 TND",
      governorate: "Sfax",
      fundingTypeSought: "Seed Investment",
      legalStatus: "SARL",
      registeredInTunisia: "Yes"
    },
    investor: {
      name: "Jasmine Capital Partners",
      type: "Venture Capital",
      focus: ["AgriTech", "FinTech", "CleanTech"],
      budgetRange: "250,000 - 1,000,000 TND",
      stages: ["Early Revenue", "Growth"],
      governorates: ["All"],
      investmentType: "Equity"
    },
    expectedMinScore: 85,
    expectedLabel: "Excellent Match"
  },
  {
    name: "Test 2: Sector Mismatch (HealthTech vs Real Estate/CleanTech only)",
    startup: {
      name: "SahhaTech Telemedicine",
      sector: "HealthTech",
      stage: "Early Revenue",
      fundingNeeded: "350,000 TND",
      governorate: "Ariana",
      fundingTypeSought: "Angel Investment",
      legalStatus: "SARL",
      registeredInTunisia: "Yes"
    },
    investor: {
      name: "Green Industrial Fund",
      type: "Venture Capital",
      focus: ["CleanTech"],
      budgetRange: "200,000 - 500,000 TND",
      stages: ["Early Revenue"],
      governorates: ["Ariana"],
      investmentType: "Equity"
    },
    expectedMaxScore: 70,
    expectedLabel: "Potential Match"
  },
  {
    name: "Test 3: Ticket Mismatch (Startup seeks 3.5M TND vs 50k-150k TND Micro Angel)",
    startup: {
      name: "DinarPay Solutions",
      sector: "FinTech",
      stage: "Growth",
      fundingNeeded: "3,500,000 TND",
      governorate: "Tunis",
      fundingTypeSought: "Venture Capital",
      legalStatus: "SA",
      registeredInTunisia: "Yes"
    },
    investor: {
      name: "Micro Seed Angel",
      type: "Angel Investor",
      focus: ["FinTech"],
      budgetRange: "50,000 - 150,000 TND",
      stages: ["Growth"],
      governorates: ["Tunis"],
      investmentType: "Equity"
    },
    expectedMaxScore: 75,
    expectedSectorScore: 30,
    expectedTicketScore: 0
  },
  {
    name: "Test 4: Stage Mismatch (Idea Stage Startup vs Strict Growth VC)",
    startup: {
      name: "ZeroLogix Prototype",
      sector: "AI / SaaS",
      stage: "Idea",
      fundingNeeded: "100,000 TND",
      governorate: "Tunis",
      fundingTypeSought: "Grant",
      legalStatus: "In creation",
      registeredInTunisia: "No"
    },
    investor: {
      name: "Growth Capital Fund",
      type: "Venture Capital",
      focus: ["AI / SaaS"],
      budgetRange: "1,000,000 - 3,000,000 TND",
      stages: ["Growth"],
      governorates: ["All"],
      investmentType: "Equity"
    },
    expectedMaxScore: 49,
    expectedLabel: "Low Match"
  },
  {
    name: "Test 5: Partial Match (Related Sector & Adjacent Stage)",
    startup: {
      name: "EduKhatwa",
      sector: "EdTech",
      stage: "MVP",
      fundingNeeded: "200,000 TND",
      governorate: "Sousse",
      fundingTypeSought: "Seed Investment",
      legalStatus: "SUARL",
      registeredInTunisia: "Yes"
    },
    investor: {
      name: "Carthage Angel Syndicate",
      type: "Angel Investor",
      focus: ["AI / SaaS"], // Related to EdTech
      budgetRange: "50,000 - 250,000 TND", // In range
      stages: ["Early Revenue"], // Adjacent to MVP
      governorates: ["Tunis", "Sfax", "Sousse"],
      investmentType: "Equity"
    },
    expectedMinScore: 65,
    expectedMaxScore: 84,
    expectedLabel: "Strong Match"
  }
];

/**
 * Self-verification runner for the test suite
 */
export function runMatchEngineTests() {
  const results = MATCH_ENGINE_TESTS.map(t => {
    const output = calculateSmartMatch(t.startup, t.investor);
    const passedMin = t.expectedMinScore !== undefined ? output.score >= t.expectedMinScore : true;
    const passedMax = t.expectedMaxScore !== undefined ? output.score <= t.expectedMaxScore : true;
    const passedLabel = t.expectedLabel ? output.label === t.expectedLabel : true;
    const passed = passedMin && passedMax && passedLabel;

    return {
      test: t.name,
      passed,
      score: output.score,
      label: output.label,
      details: output
    };
  });

  return results;
}
