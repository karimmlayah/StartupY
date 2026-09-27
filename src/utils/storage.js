import { INITIAL_STARTUPS } from "../data/mockStartups";
import { DEFAULT_INVESTOR_PROFILE, DEFAULT_STARTUP_PROFILE } from "../data/mockInvestors";

const KEYS = {
  CUSTOM_STARTUPS: "startupbridge_tunisia_custom_startups",
  CURRENT_STARTUP: "startupbridge_tunisia_current_startup",
  CURRENT_INVESTOR: "startupbridge_tunisia_current_investor",
  SAVED_STARTUPS: "startupbridge_tunisia_saved_startups",
  INTERESTED_STARTUPS: "startupbridge_tunisia_interested_startups",
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
      fundingNeeded: startupData.fundingNeeded.includes("TND") ? startupData.fundingNeeded : `${startupData.fundingNeeded} TND`,
      governorate: startupData.governorate || "Tunis",
      city: `${startupData.governorate || "Tunis"} Region`,
      country: "Tunisia",
      legalStatus: startupData.legalStatus || "SARL",
      registeredInTunisia: startupData.registeredInTunisia || "Yes",
      fundingTypeSought: startupData.fundingTypeSought || "Seed Investment",
      website: startupData.website || "",
      teamSize: startupData.teamSize ? (startupData.teamSize.includes("member") ? startupData.teamSize : `${startupData.teamSize} members`) : "5 members",
      foundedYear: startupData.foundedYear ? parseInt(startupData.foundedYear, 10) : new Date().getFullYear(),
      logoBg: "from-blue-600 via-indigo-600 to-violet-600",
      aiMatchScore: Math.floor(Math.random() * 8) + 90, // 90-97%
      aiScores: {
        sectorFit: Math.floor(Math.random() * 6) + 92,
        ticketFit: Math.floor(Math.random() * 6) + 90,
        stageFit: Math.floor(Math.random() * 8) + 88,
        governorateFit: Math.floor(Math.random() * 6) + 91,
        fundingTypeFit: Math.floor(Math.random() * 6) + 90,
        preferencesFit: Math.floor(Math.random() * 6) + 92,
      },
      aiThesis: `High-conviction Tunisian opportunity in ${startupData.sector} located in ${startupData.governorate}. The team demonstrates clear stage-appropriate execution velocity for the ${startupData.stage} phase under ${startupData.fundingTypeSought} criteria.`,
      problem: `Unmet market demand in ${startupData.sector} creating operational friction in the Tunisian market.`,
      solution: startupData.pitch,
      traction: [
        "Product launched and active in Tunisian market",
        `Seeking ${startupData.fundingNeeded} (${startupData.fundingTypeSought}) to accelerate team hiring and expansion`,
        `Registered legal entity: ${startupData.legalStatus} based in ${startupData.governorate}`,
        "Verified profile on StartupBridge AI Tunisia",
      ],
      highlights: [startupData.sector, startupData.stage, startupData.governorate, startupData.fundingTypeSought],
      team: [
        {
          name: "Founder & Team",
          role: "Founding Executive",
          bio: `Experienced builders and innovators based in ${startupData.governorate}, Tunisia.`,
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
        "Commercial Growth in Tunisia": "30%",
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
    return raw ? JSON.parse(raw) : ["agrismart-tunisia", "dinarpay-solutions"];
  } catch (err) {
    return ["agrismart-tunisia", "dinarpay-solutions"];
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
