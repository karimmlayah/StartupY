"""
Knowledge Ingestion Script for StartupBridge AI Tunisia RAG.
Parses, cleans, chunks, embeds, and ingests comprehensive Tunisian legal, regulatory,
financing, and ecosystem documents into the Qdrant vector database.

Topics covered:
1. Tunisian Startup Act (Law No. 2018-20, Labellisation, Advantages)
2. Legal Structures & Company Creation (SARL, SUARL, RNE, Capital in TND)
3. Grants, Incentives & Bourse de Startup (Founder allowance, employment subsidy)
4. Financing Programs & Funds (AIR, ANAVA, Flywheel, Smart Capital, TBAN Angels)
5. Administrative Procedures (Foreign currency special account, customs exemption)
6. Legal Governance & IP (INNORPI patents, IP assignment, vesting, BSA)
7. Startup Ecosystem (The Dot, Flat6Labs, Novation City, Coworking, Technoparks)
8. Investor Information & Tax Incentives (Tax exemption on reinvested profits, capital gains)
"""
import sys
import os
import re
import logging
from pathlib import Path
from datetime import datetime, timezone

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Import services
from services.qdrant_service import (
    verify_or_create_collection,
    upsert_knowledge_chunks,
    get_qdrant_client,
    DEFAULT_COLLECTION_NAME
)
from services.embedding_service import generate_embeddings

# ==============================================================================
# RAW DOCUMENT CORPUS: TUNISIAN STARTUP ECOSYSTEM & REGULATIONS
# ==============================================================================

DOCUMENTS = [
    {
        "title": "Tunisian Startup Act: Law No. 2018-20 Overview and 5 Label Criteria",
        "category": "Tunisian Startup Act",
        "source": "Journal Officiel de la République Tunisienne (JORT) / Startup Tunisia",
        "url": "https://startup.gov.tn/en/startup-act",
        "language": "en",
        "content": """
The Tunisian Startup Act (Law No. 2018-20 dated April 17, 2018) is a pioneering legal framework designed to foster innovation, entrepreneurship, and talent retention in Tunisia. To obtain the official Startup Label, an enterprise must fulfill five statutory criteria evaluated by the Collège des Startups:
1. Age: The company must be legally incorporated for no more than 8 years.
2. Size: The enterprise must employ fewer than 100 people and have an annual turnover or total balance sheet under 15 million Tunisian Dinars (TND).
3. Capital Ownership: More than two-thirds (66.7%) of the share capital must be owned by natural persons (individuals) or qualified Venture Capital (SICAR/FCPR) investment funds.
4. Innovative Model: The product, service, or business model must possess a significant technological or innovative dimension.
5. High Growth Potential: The venture must demonstrate strong scalability in domestic and international markets.
The Startup Label is granted for an initial duration of 30 months, renewable once for up to 30 additional months upon demonstrated performance.
        """
    },
    {
        "title": "Startup Act Incentives: Founder Leave, Startup Grant, and Social Security",
        "category": "Grants and Incentives",
        "source": "Smart Capital / Ministry of Communication Technologies",
        "url": "https://startup.gov.tn/en/incentives/founders",
        "language": "en",
        "content": """
The Startup Act provides direct economic safety nets for Tunisian entrepreneurs:
1. Startup Leave (Congé pour création de Startup): Private and public sector employees are legally entitled to 1 year of leave to launch their startup, renewable once for a second year. Employment rights and seniority are preserved.
2. Founder Allowance (Bourse de Startup): Up to 3 co-founders of a labeled startup can receive a monthly stipend of up to 5,000 TND per month for 12 months. The allowance compensates for lost salary during the crucial zero-revenue validation phase.
3. State Social Security Coverage: The Tunisian State fully covers the employer and employee shares of social security contributions (CNSS) for the founder and eligible core team members during the label validity period.
4. Patent Registration Subsidies: Full reimbursement and procedural support for filing national patents at INNORPI and international patents through the Patent Cooperation Treaty (PCT).
        """
    },
    {
        "title": "Tax Exemptions and Customs Duty Relief for Labeled Startups",
        "category": "Incentives and Regulations",
        "source": "Tunisian Ministry of Finance / General Directorate of Customs",
        "url": "https://startup.gov.tn/en/incentives/tax-customs",
        "language": "en",
        "content": """
Article 12 and 13 of Law 2018-20 grant substantial fiscal advantages:
1. Corporate Income Tax Exemption: Startups holding the official label are totally exempt from corporate income tax (Impôt sur les Sociétés - IS) during the 30-month label period, extendable up to 5 consecutive years.
2. Customs Duty Exemption: Total exoneration from customs duties and import taxes on technological hardware, testing equipment, raw materials, and prototyping machinery essential to the startup's research, development, and production.
3. Fast-Track Customs Clearance: Labeled startups are categorized under customs Authorized Economic Operator status, bypassing standard bureaucratic port delays for rapid hardware imports.
        """
    },
    {
        "title": "Special Foreign Currency Bank Account and Exchange Control Relief",
        "category": "Administrative Procedures",
        "source": "Central Bank of Tunisia (Banque Centrale de Tunisie - BCT)",
        "url": "https://www.bct.gov.tn/bct/siteprod/actualites.jsp",
        "language": "en",
        "content": """
To overcome traditional foreign currency transfer restrictions in Tunisia, the Startup Act and Central Bank circulars establish:
1. Special Foreign Currency Account (Compte Spécial en Devises): Labeled startups can open a dedicated foreign currency account with any commercial bank in Tunisia.
2. Free Capital Utilization: Funds injected by international investors or earned through foreign export revenues can be freely used without prior Central Bank authorization for:
   - Procuring overseas software subscriptions, cloud servers (AWS, Google Cloud, Azure), and SaaS tools.
   - International digital advertising campaigns (Meta, Google, LinkedIn).
   - Foreign business travel, hardware purchases, and overseas contractor payments.
3. International Technologic Card (CTI): Startup founders receive an elevated annual CTI allowance up to 100,000 TND (versus 1,000 TND for standard individuals) for online tech expenditures.
        """
    },
    {
        "title": "Corporate Legal Structures in Tunisia: SARL vs SUARL Incorporation",
        "category": "Legal Requirements",
        "source": "National Business Register (RNE) / Tunisian Commercial Companies Code",
        "url": "https://www.rne.tn/procedure-creation-societe",
        "language": "en",
        "content": """
The most widely used corporate forms for technology startups in Tunisia are:
1. SARL (Société à Responsabilité Limitée): Minimum 2 shareholders, maximum 50. Shareholders liability is strictly limited to their capital contributions. Ideal for founding teams with 2 or more co-founders.
2. SUARL (Société Unipersonnelle à Responsabilité Limitée): Single-founder company. Enables solo entrepreneurs to protect personal assets while retaining 100% control.
3. Capital Requirements: Under the revised Commercial Code, minimum share capital is flexible (typically set at 1,000 TND to 5,000 TND for commercial viability).
4. Incorporation Steps:
   - Drafting Articles of Association (Statuts).
   - Opening an escrow bank account and depositing initial capital.
   - Tax declaration and Fiscal Matricule at the Recipe des Finances.
   - Formal registration with the National Business Register (Registre National des Entreprises - RNE).
   - CNSS affiliation for social coverage.
        """
    },
    {
        "title": "Financing Ecosystem in Tunisia: AIR, ANAVA Fund of Funds, and Seed Grants",
        "category": "Financing Programs",
        "source": "Smart Capital / Caisse des Dépôts et Consignations (CDC)",
        "url": "https://smartcapital.tn/anava",
        "language": "en",
        "content": """
Tunisia features a structured multi-tier financing continuum for innovative ventures:
1. AIR Fund (Avance Rémboursable): Non-dilutive repayable advance provided by Smart Capital and CDC to labeled startups to finance early-stage prototyping and market launch. Repayment only triggers upon reaching revenue milestones.
2. Flywheel Program: Grants funded by the World Bank and implemented by Smart Capital providing AIR grants, seed grants (up to 30,000 TND), and follow-on matching capital.
3. ANAVA Fund of Funds: A flagship 100 million Euro sovereign fund of funds managed by Smart Capital. ANAVA does not invest directly in startups; instead, it anchors private venture capital funds (such as 216 Capital, Badia Impact, Anava Seed Fund, Titan Capital) which deploy institutional equity tickets from 200,000 TND to 3 million TND into Tunisian startups.
        """
    },
    {
        "title": "Angel Investors and Venture Capital Due Diligence in Tunisia",
        "category": "Investor Information",
        "source": "Tunisian Business Angels Network (TBAN) / ATIC",
        "url": "https://tban.tn/guidelines",
        "language": "en",
        "content": """
Angel syndicates and Venture Capital funds in Tunisia evaluate early-stage opportunities based on strict diligence criteria:
1. Team Complementarity: Presence of technical and commercial co-founders with full-time commitment and clear equity split.
2. IP Ownership & Clean Cap Table: Verification that all code, trademarks, and algorithms are fully assigned from individual founders to the corporate legal entity with no encumbrances.
3. Valuation & Ticket Sizing: Pre-seed tickets typically range from 50,000 TND to 250,000 TND from angels. Seed rounds range from 300,000 TND to 1.5 million TND.
4. Currency Considerations: Valuations and capitalization tables are denominated in Tunisian Dinars (TND) under local law, with convertible notes (Obligations Convertibles en Actions - OCA) or SAFE instruments adapting to Central Bank exchange rules.
        """
    },
    {
        "title": "Tax Incentives for Investors and Business Angels under the Startup Act",
        "category": "Investor Information",
        "source": "Tunisian Investment Authority (TIA) / Ministry of Finance",
        "url": "https://startup.gov.tn/en/incentives/investors",
        "language": "en",
        "content": """
Article 15 and 16 of the Startup Act offer unmatched tax incentives for local and international investors:
1. Total Tax Exemption on Reinvested Earnings: Corporate entities and individuals investing capital into labeled startups or dedicated venture capital funds (SICAR, FCPR) can deduct 100% of the invested amount from their taxable income base (Dégrèvement fiscal total).
2. Capital Gains Tax Exemption: When an investor exits a labeled startup by selling their equity shares, the realized capital gain is 100% exempt from income tax and capital gains tax, provided shares were held for a minimum of 3 years.
3. Guarantee Fund for VC: A specialized Guarantee Fund covers up to 30% of VC investments in labeled startups in the event of liquidation, substantially mitigating downside downside portfolio risk.
        """
    },
    {
        "title": "Startup Governance: Shareholder Agreements, Vesting, and ESOP in Tunisia",
        "category": "Legal Requirements",
        "source": "Tunisian Bar Association / Startup Legal Guides",
        "url": "https://startup.tn/legal-toolkit",
        "language": "en",
        "content": """
Sound corporate governance protects founders and investors throughout the startup lifecycle:
1. Shareholders' Agreement (Pacte d'Actionnaires): Essential private contract regulating voting thresholds, board representation, Drag-Along, Tag-Along, and pre-emptive subscription rights.
2. Reverse Vesting Schedule: Standard 4-year vesting with a 1-year cliff ensures co-founders remain committed; if a founder departs early, unvested shares are repurchased by the company at nominal value.
3. Employee Stock Ownership (ESOP / BSA): The Startup Act enables companies to allocate equity warrants (Bons de Souscription de Parts de Créateurs d'Entreprise - BSPCE) to key engineers and executives at preferential tax rates.
        """
    },
    {
        "title": "Tunisia Tech Visa and Talent Mobility for International Expansion",
        "category": "Tunisian Startup Act",
        "source": "Ministry of Interior / Ministry of Foreign Affairs",
        "url": "https://startup.gov.tn/en/tech-visa",
        "language": "en",
        "content": """
The Startup Act simplifies international talent acquisition through the Tunisia Tech Visa:
1. Fast-Track Residence: Foreign technical specialists, designers, and senior executives hired by labeled startups receive a multi-year fast-track residency and work permit within 10 business days.
2. Reciprocal Visas: Facilitated Schengen and regional business visa recommendations for Tunisian startup founders participating in overseas roadshows, accelerator cohorts, and global tech conferences.
3. Diaspora Returning Founders: Tunisian engineers returning from Europe, North America, or the Gulf to launch or scale startups benefit from duty-free personal effects importation (FCR regime) and immediate Startup Act allowance eligibility.
        """
    },
    {
        "title": "Tunisian Innovation Ecosystem: Accelerators, Technoparks, and The Dot",
        "category": "Startup Ecosystem Information",
        "source": "The Dot Tunisia / Smart Capital",
        "url": "https://thedot.tn",
        "language": "en",
        "content": """
Tunisia possesses one of North Africa's most dynamic technology hubs:
1. The Dot: Flagship public-private innovation center located in Les Berges du Lac, Tunis, hosting international delegations, testing labs, and 100+ co-working spaces.
2. Accelerators & Incubators:
   - Flat6Labs Tunis: Leading regional seed accelerator providing 150k TND investment, mentorship, and VC demo days.
   - Wiki Start Up: Pioneer private incubator specializing in angel syndication and pre-seed coaching.
   - Novation City: Sousse mechatronics, IoT, and AI competence cluster.
   - El Ghazala Technopark: Oldest ICT cluster housing multinational telecoms, research labs, and academic engineering institutes.
3. Network of Coworking Spaces: Spanning Tunis, Sfax, Sousse, Bizerte, Gabes, and Gafsa, providing reliable fiber optics and founder communities.
        """
    },
    {
        "title": "Intellectual Property Protection and INNORPI Patent Procedures",
        "category": "Administrative Procedures",
        "source": "National Institute of Standardization and Industrial Property (INNORPI)",
        "url": "https://www.innorpi.tn/fr/brevets-dinvention",
        "language": "en",
        "content": """
Securing proprietary IP in Tunisia:
1. Patent Filing: Inventions with industrial application are registered at INNORPI. Labeled startups have all examination and publication fees fully subsidized by Smart Capital.
2. Trademark Registration: Brands, logos, and product naming must be registered at INNORPI under the Nice Classification to prevent counterfeiting and brand hijacking.
3. Software Copyright (Organisme Tunisien des Droits d'Auteur - OTDA): Source code and software architectures are protected via literary and artistic copyright deposit, establishing immutable date of creation proof for investor due diligence.
        """
    }
]

# ==============================================================================
# SEMANTIC TEXT CLEANING AND CHUNKING
# ==============================================================================

def clean_text(text: str) -> str:
    """Removes excessive whitespace and standardizes formatting."""
    if not text:
        return ""
    # Normalize unicode whitespace
    cleaned = re.sub(r'\s+', ' ', text).strip()
    return cleaned


def split_into_semantic_chunks(text: str, chunk_size: int = 550, chunk_overlap: int = 100) -> list:
    """
    Splits document text into overlapping semantic chunks.
    Respects sentence and paragraph boundaries where possible.
    """
    cleaned = clean_text(text)
    if len(cleaned) <= chunk_size:
        return [cleaned]

    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', cleaned)
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        sentence_len = len(sentence)
        if current_length + sentence_len > chunk_size and current_chunk:
            chunk_str = " ".join(current_chunk)
            chunks.append(chunk_str)

            # Keep overlap
            overlap_buffer = []
            overlap_len = 0
            for s in reversed(current_chunk):
                if overlap_len + len(s) <= chunk_overlap:
                    overlap_buffer.insert(0, s)
                    overlap_len += len(s)
                else:
                    break
            current_chunk = overlap_buffer
            current_length = sum(len(s) for s in current_chunk) + len(current_chunk)

        current_chunk.append(sentence)
        current_length += sentence_len + 1

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


# ==============================================================================
# MAIN INGESTION PIPELINE
# ==============================================================================

def run_ingestion():
    """
    Executes end-to-end knowledge ingestion:
    1. Connects to Qdrant and verifies/creates collection.
    2. Cleans raw documents.
    3. Splits into semantic chunks with overlap.
    4. Generates dense embeddings using FastEmbed (BAAI/bge-small-en-v1.5).
    5. Upserts points into Qdrant with full metadata and deterministic UUIDs.
    """
    collection_name = os.getenv("QDRANT_COLLECTION", DEFAULT_COLLECTION_NAME)
    logger.info("Starting knowledge ingestion into Qdrant collection: '%s'...", collection_name)

    # 1. Verify / Create collection
    verify_or_create_collection(collection_name)

    # 2. Process all documents
    prepared_chunks = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for doc in DOCUMENTS:
        text_chunks = split_into_semantic_chunks(doc["content"], chunk_size=550, chunk_overlap=90)
        logger.info("Document '%s' split into %d semantic chunks.", doc["title"], len(text_chunks))

        for idx, chunk_text in enumerate(text_chunks):
            prepared_chunks.append({
                "title": doc["title"],
                "source": doc["source"],
                "category": doc["category"],
                "url": doc["url"],
                "text": chunk_text,
                "language": doc.get("language", "en"),
                "updated_at": now_iso
            })

    total_chunks = len(prepared_chunks)
    logger.info("Total semantic chunks ready for embedding and indexing: %d", total_chunks)

    # 3. Upsert to Qdrant (embedding generation handled inside upsert_knowledge_chunks)
    upserted_count = upsert_knowledge_chunks(prepared_chunks, collection_name=collection_name)
    logger.info("Knowledge Ingestion Complete! Indexed %d chunks into '%s'.", upserted_count, collection_name)

    # 4. Verify collection point count in Qdrant
    client = get_qdrant_client()
    collection_info = client.get_collection(collection_name=collection_name)
    logger.info("Verification: Collection '%s' points count: %s", collection_name, getattr(collection_info, "points_count", "N/A"))

    return {
        "collection": collection_name,
        "documents_count": len(DOCUMENTS),
        "chunks_indexed": upserted_count
    }


if __name__ == "__main__":
    result = run_ingestion()
    print("\n=======================================================")
    print("INGESTION SUMMARY:")
    print(f"Collection: {result['collection']}")
    print(f"Source Documents: {result['documents_count']}")
    print(f"Indexed Chunks: {result['chunks_indexed']}")
    print("=======================================================\n")
