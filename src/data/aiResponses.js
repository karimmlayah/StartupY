export const AI_SUGGESTED_QUESTIONS = {
  startup: [
    {
      id: "q-s1",
      question: "How can I optimize my pitch deck for early-stage VCs?",
      answer: `**Pitch Deck Optimization Strategy for Seed & Series A**

1. **Tighten the Narrative (10-12 Slides Max):**
   - **Slide 1-2:** Problem & Unfair Insight (Quantify the commercial pain in hard dollars or hours lost).
   - **Slide 3-4:** Solution & Live Product Proof (Show, don't tell. Screen recordings or real telemetry outperform static wireframes).
   - **Slide 5-6:** Market Size & Why Now (Highlight regulatory or technological tipping points).
   - **Slide 7-8:** Traction & Cohort Retention (Show MoM expansion, pilot conversions, or active engagement).
   - **Slide 9-10:** Unit Economics & Business Model (Gross margins, CAC-to-LTV payback period).
   - **Slide 11-12:** Team Pedigree & The Ask (Capital target, 18-month hiring & milestone roadmap).

2. **Common Mistakes to Eliminate:**
   - Avoid leading with technical jargon; lead with the enterprise customer's burning problem.
   - Don't present inflated $100B generic TAMs; calculate bottom-up addressable market.
   - Ensure the "Ask" gives at least 18 to 24 months of runway with clear milestone triggers for the next round.`
    },
    {
      id: "q-s2",
      question: "What valuation multiple applies to my sector and stage today?",
      answer: `**Current Market Valuation Multiples & Benchmarks**

1. **Early-Stage Benchmarks (Post-2024 Market Realities):**
   - **Pre-Seed / MVP:** Priced typically on SAFE notes with post-money caps of **$4M - $8M**, depending on founder pedigree and technical defensibility.
   - **Seed / Early Revenue ($10k - $50k MRR):** Post-money caps range between **$8M - $14M**. Founders typically dilute 15% to 20% in this round.
   - **Series A ($1M - $3M ARR):** Trailing ARR multiples have recalibrated to **10x - 18x ARR** for tier-1 generative AI and cyber, and **8x - 12x ARR** for standard B2B SaaS.

2. **Key Valuation Levers in Your Favor:**
   - **Net Dollar Retention (NDR):** Anything above 120% commands premium multiples.
   - **Gross Margins:** Software gross margins > 75% protect pricing power.
   - **Capital Efficiency (Burn Multiple):** Net Burn / Net New ARR under 1.5x is considered best-in-class today.`
    },
    {
      id: "q-s3",
      question: "What are the essential items for an investor due diligence data room?",
      answer: `**Comprehensive Due Diligence Checklist for Founders**

1. **Corporate Governance & Legal:**
   - Articles of Incorporation, Cap Table (Carta or Pulley export with all options & SAFEs).
   - Board minutes, IP assignment agreements signed by all founders, employees, and contractors.
   - Standard customer Terms of Service (ToS) and Master Service Agreements (MSAs).

2. **Financials & Operating Model:**
   - 3-statement historical financial model (P&L, Balance Sheet, Cash Flow) for the past 12-24 months.
   - Forward 24-month pro-forma operating model with explicit headcount hiring assumptions.
   - Detailed monthly burn rate, revenue pipeline tracker, and bank account reconciliation statements.

3. **Product, Tech & IP:**
   - Architecture diagrams, cloud infrastructure cost breakdown (AWS/GCP/Azure).
   - Security compliance certifications (SOC2 Type II, ISO27001, GDPR, HIPAA if healthtech).
   - Patent applications, trademark filings, and third-party software licensing audits.`
    }
  ],
  investor: [
    {
      id: "q-i1",
      question: "What are common red flags in early-stage traction metrics?",
      answer: `**Early-Stage Traction Red Flags & Quality of Revenue Analysis**

1. **Leaky Bucket Retention:**
   - Rapid top-line user growth masked by steep monthly churn (e.g., > 5% logo churn/month in SMB SaaS or > 1.5% in enterprise).
   - Cohort charts where usage drops sharply after week 2 or trial period expiration.

2. **Unscalable or Non-Standard Revenue:**
   - High proportion of one-off custom engineering or professional services fees disguised as recurring SaaS.
   - Heavy concentration risk (e.g., a single customer contributing > 35% of total ARR).
   - Extended sales cycles (> 9 months) with pilot accounts that lack contractual automatic conversion to paid contracts.

3. **Unit Economics & CAC Pitfalls:**
   - CAC calculated by excluding founder selling time, contractor costs, or paid marketing agency overhead.
   - Payback periods stretching beyond 18 months at seed stage.`
    },
    {
      id: "q-i2",
      question: "How do I calculate cap table dilution across Seed and Series A?",
      answer: `**Dilution & Ownership Modeling Guide for Investors**

1. **Standard Round Dilution Framework:**
   - **Seed Round:** 15% - 20% equity dilution for a $1.5M - $2.5M check on a $10M post-money valuation.
   - **Unallocated Option Pool:** Lead investors typically mandate a 10% - 15% post-money unallocated employee option pool, which dilutes prior shareholders before the new cash enters.
   - **Series A Round:** Typically 20% - 25% dilution for a $7M - $12M check on a $35M - $50M post-money valuation.

2. **Cumulative Founder Ownership Trajectory:**
   - Initial: Founders 100%
   - Post-Pre-Seed & Seed: Founders typically retain **65% - 75%**.
   - Post-Series A: Founders typically retain **45% - 55%**.
   - Target for lead seed investor: Maintain 8% - 15% through pro-rata participation rights into Series A to prevent excessive anti-dilution decay.`
    },
    {
      id: "q-i3",
      question: "What frameworks evaluate technical founders with no commercial experience?",
      answer: `**Technical Founder Evaluation Matrix (The 4 'C's Framework)**

1. **Customer Empathy & Iteration Speed:**
   - Do the founders personally conduct user interviews and shadow customer workflows, or do they retreat into engineering bubbles?
   - What is their release cadence? Elite teams ship daily or weekly fixes directly based on customer feedback.

2. **Commercial Adaptability & First Sales:**
   - Has the technical founder personally closed their first 3 to 5 paid pilots before attempting to hire a VP of Sales? Founder-led selling is mandatory before product-market fit.
   - Can they articulate their product's business value in non-technical terms (ROI, payback period, compliance relief)?

3. **Talent Magnetism:**
   - Ability to convince top-tier engineering talent and veteran commercial advisors to work for below-market cash and equity compensation.
   - Self-awareness regarding their operational blind spots and willingness to hire strong COO/GTM counterparts.`
    }
  ]
};

export function generateCustomAiResponse(role, query) {
  const lower = query.toLowerCase();

  if (lower.includes("valuation") || lower.includes("cap") || lower.includes("worth") || lower.includes("multiple")) {
    return {
      title: "AI Valuation & Cap Table Guidance",
      body: `**Valuation Analysis & Strategic Multiples**
- **Sector Context:** Early-stage multiples depend heavily on growth velocity and recurring revenue quality. Enterprise AI and Cyber command 12x-18x forward ARR, while marketplaces and direct consumer models trade at 3x-6x.
- **Round Sizing Principle:** Aim to sell no more than 15-20% of your company in any single equity financing round.
- **SAFE vs Priced Round:** SAFEs with post-money caps offer standard flexibility at Seed, but ensure you model the compounding dilution of multiple simultaneous SAFEs before pricing your Series A.`
    };
  }

  if (lower.includes("pitch") || lower.includes("deck") || lower.includes("slide") || lower.includes("presentation")) {
    return {
      title: "AI Pitch Deck Review & Polish Recommendations",
      body: `**Key Recommendations for High-Conversion Pitch Decks**
- **1st Minute Hook:** Start with the specific quantified status quo failure before introducing your product.
- **Traction Proof Point:** Investors skim decks in an average of 2 minutes and 42 seconds. Place your traction slide on slide 4 or 5 rather than the appendix.
- **Clear Defensibility (Moat):** Explicitly explain why a well-funded incumbent or open-source competitor cannot replicate your solution in 6 months (data feedback loops, proprietary integrations, regulatory moats).`
    };
  }

  if (lower.includes("diligence") || lower.includes("data room") || lower.includes("legal") || lower.includes("safe")) {
    return {
      title: "AI Due Diligence Protocol",
      body: `**Streamlined Due Diligence Action Plan**
- **Speed Closes Rounds:** Having a pre-indexed data room organized into Legal, Financial, Tech/IP, and Customers cuts deal cycle times from 8 weeks to under 3 weeks.
- **Red Flag Mitigation:** Ensure all founder IP assignments and contractor copyright waivers are fully countersigned prior to partner meetings.
- **Customer Reference Readiness:** Prepare 3 friendly enterprise customer references who have agreed in advance to speak with prospective lead investors.`
    };
  }

  if (lower.includes("investor") || lower.includes("angel") || lower.includes("vc") || lower.includes("fund")) {
    return {
      title: "AI Investor Matching & Outreach Strategy",
      body: `**Targeted Investor Outreach Strategy**
- **Thesis Alignment Over Prestige:** Target partners whose recent blog posts, tweets, or podcast interviews explicitly mention your specific problem statement.
- **Warm Intros vs Cold Email:** Cold outreach can work if personalized with a crisp 3-sentence blurb, verifiable metrics ($MRR and MoM growth), and a 1-minute Loom video demo.
- **Momentum Creation:** Consolidate first partner meetings within a 2-week window to generate competitive term sheet pressure and avoid drawn-out diligence traps.`
    };
  }

  // General fallback
  if (role === "startup") {
    return {
      title: "AI Founder Strategic Advisory",
      body: `**Strategic Recommendations for "${query}"**
- **Actionable Step:** Focus on customer-obsessed validation. Ensure your pilot users are experiencing measurable ROI and high weekly engagement.
- **Fundraising Readiness:** Quantify this metric in your updated StartupBridge profile so prospective investors can evaluate your momentum in their deal stream.
- **Next Milestone:** Target an 18-month operating plan that bridges your current stage to positive unit economics or clear Series A milestones.`
    };
  } else {
    return {
      title: "AI Investment Thesis Analysis",
      body: `**Due Diligence Assessment for "${query}"**
- **Thesis Evaluation:** Evaluate whether the company has proprietary distribution advantages, negative churn, or defensible data flywheels.
- **Risk Mitigation:** Verify founder vesting schedules, customer concentration risk, and runway buffer under conservative revenue projections.
- **Deal Sizing:** Consider structuring with milestone-based tranches or standard pro-rata participation rights to protect future equity allocation.`
    };
  }
}
