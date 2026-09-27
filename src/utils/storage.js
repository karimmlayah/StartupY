import { INITIAL_STARTUPS } from "../data/mockStartups";
import { DEFAULT_INVESTOR_PROFILE, DEFAULT_STARTUP_PROFILE } from "../data/mockInvestors";

const KEYS = {
  CUSTOM_STARTUPS: "startupbridge_custom_startups",
  CURRENT_STARTUP: "startupbridge_current_startup",
  CURRENT_INVESTOR: "startupbridge_current_investor",
  SAVED_STARTUPS: "startupbridge_saved_startups",
  INTERESTED_STARTUPS: "startupbridge_interested_startups",
};

export function getAllStartups() {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOM_STARTUPS);
    const custom = raw ? JSON.parse(raw) : [];
    return [...custom, ...INITIAL_STARTUPS];
  } catch (err) {
    console.error("Error loading startups from localStorage:", err);
    return INITIAL_STARTUPS;
  }
}

export function getStartupById(id) {
  const startups = getAllStartups();
  return startups.find((s) => s.id === id) || null;
}

export function saveNewStartup(startupData) {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOM_STARTUPS);
    const existing = raw ? JSON.parse(raw) : [];

    const id = startupData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4);

    const fullStartup = {
      id,
      name: startupData.name,
      pitch: startupData.pitch,
      sector: startupData.sector,
      stage: startupData.stage,
      fundingNeeded: startupData.fundingNeeded,
      country: startupData.country,
      teamSize: startupData.teamSize ? `${startupData.teamSize} members` : "5 members",
      foundedYear: new Date().getFullYear(),
      logoBg: "from-blue-600 via-indigo-600 to-violet-600",
      aiMatchScore: Math.floor(Math.random() * 8) + 90, // 90-97%
      aiScores: {
        sectorFit: Math.floor(Math.random() * 6) + 92,
        stageFit: Math.floor(Math.random() * 6) + 90,
        growthRate: Math.floor(Math.random() * 8) + 88,
        teamStrength: Math.floor(Math.random() * 6) + 91,
      },
      aiThesis: `High-conviction opportunity in ${startupData.sector}. The team demonstrates clear stage-appropriate execution velocity for the ${startupData.stage} phase.`,
      problem: `Unmet market demand in ${startupData.sector} creating operational friction and inefficiencies.`,
      solution: startupData.pitch,
      traction: [
        "Product launched and active in market",
        "Growing initial user engagement and stakeholder validation",
        `Seeking ${startupData.fundingNeeded} to accelerate expansion and scale team`,
        "Verified profile on StartupBridge AI",
      ],
      highlights: [startupData.sector, startupData.stage, startupData.country],
      team: [
        {
          name: "Founder & Team",
          role: "Founding Executive",
          bio: `Experienced builders and innovators based in ${startupData.country}.`,
        },
      ],
      financials: {
        mrr: "Confidential / In-progress",
        burnRate: "Optimal for runway",
        runway: "12-18 months",
        grossMargin: "75%+",
      },
      useOfFunds: {
        "Product & Engineering": "50%",
        "Go-To-Market & Growth": "30%",
        "Operations & Talent": "20%",
      },
      ...startupData,
    };

    const updated = [fullStartup, ...existing];
    localStorage.setItem(KEYS.CUSTOM_STARTUPS, JSON.stringify(updated));

    // Also update current active startup profile
    saveCurrentStartup(fullStartup);

    return fullStartup;
  } catch (err) {
    console.error("Error saving startup:", err);
    return null;
  }
}

export function getCurrentStartup() {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_STARTUP);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error getting current startup:", err);
  }
  return DEFAULT_STARTUP_PROFILE;
}

export function saveCurrentStartup(profile) {
  try {
    localStorage.setItem(KEYS.CURRENT_STARTUP, JSON.stringify(profile));
  } catch (err) {
    console.error("Error saving current startup:", err);
  }
}

export function getCurrentInvestor() {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_INVESTOR);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error getting current investor:", err);
  }
  return DEFAULT_INVESTOR_PROFILE;
}

export function saveCurrentInvestor(profile) {
  try {
    localStorage.setItem(KEYS.CURRENT_INVESTOR, JSON.stringify(profile));
  } catch (err) {
    console.error("Error saving current investor:", err);
  }
}

export function getSavedStartupIds() {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_STARTUPS);
    return raw ? JSON.parse(raw) : ["omnipulse-ai", "vaultmesh-security"];
  } catch (err) {
    return ["omnipulse-ai", "vaultmesh-security"];
  }
}

export function toggleSaveStartup(id) {
  const current = getSavedStartupIds();
  let updated;
  if (current.includes(id)) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
  }
  try {
    localStorage.setItem(KEYS.SAVED_STARTUPS, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving watchlist:", err);
  }
  return updated;
}

export function getInterestedStartupIds() {
  try {
    const raw = localStorage.getItem(KEYS.INTERESTED_STARTUPS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function addInterestStartup(id) {
  const current = getInterestedStartupIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    try {
      localStorage.setItem(KEYS.INTERESTED_STARTUPS, JSON.stringify(updated));
    } catch (err) {
      console.error("Error recording interest:", err);
    }
    return true;
  }
  return false;
}
