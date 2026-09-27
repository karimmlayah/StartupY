"""
Query Normalizer and Search Rewriter for Guide Startup Tunisie RAG Pipeline.
Normalizes natural language, typos, missing spaces, accents, and Franco-Tunisian phrasing.
Generates multi-query search expansions for optimal semantic retrieval in Qdrant.
"""
import re
from typing import List, Tuple

# Common Franco-Tunisian phonetic mappings & slang
TUNISIAN_ARABIC_MAPPINGS = [
    (r"\b(chneya|chnowa|echneya|chnea|chnawa|c quoi|c koi)\b", "qu'est-ce que"),
    (r"\b(kifech|kifeche|kifeesh|kifeh)\b", "comment"),
    (r"\b(chkoun|chkone)\b", "qui"),
    (r"\b(nheb|n7eb|n7ib|nhebb)\b", "je veux"),
    (r"\b(nhel|n7el)\b", "créer"),
    (r"\b(flous|floussi|flousik)\b", "financement"),
    (r"\b(waqtech|waqteh)\b", "quand"),
    (r"\b(fama|thama)\b", "y a-t-il"),
]

# Common French typos & missing space patterns
TYPO_MAPPINGS = [
    (r"\bunstartup\b", "une startup"),
    (r"\bunestartup\b", "une startup"),
    (r"\bdustartup\b", "du startup"),
    (r"\bdune\b", "d'une"),
    (r"\bdun\b", "d'un"),
    (r"\bcree\b", "créer"),
    (r"\bcrée\b", "créer"),
    (r"\bcré\b", "créer"),
    (r"\bcreer\b", "créer"),
    (r"\bcommencer mon projet\b", "commencer et lancer mon projet"),
    (r"\blancer mon projet\b", "lancer mon projet de startup"),
    (r"\bforme juridique\b", "forme juridique (SARL ou SUARL)"),
    (r"\binvestiseur\b", "investisseur"),
    (r"\binvestiseurs\b", "investisseurs"),
    (r"\binvestissurs\b", "investisseurs"),
    (r"\bfinanse\b", "financement"),
    (r"\bsouscription\b", "souscription"),
    (r"\bavantages\b", "avantages et incitations"),
    (r"\bbourse startup\b", "bourse de startup"),
]


def detect_language(text: str) -> str:
    """
    Detects user language:
    - 'ar' for Arabic script
    - 'en' for English
    - 'fr' for French or Franco-Tunisian mix (default)
    """
    if not text:
        return 'fr'

    # 1. Check for Arabic characters
    if re.search(r'[\u0600-\u06FF]', text):
        return 'ar'

    lowered = text.lower().strip()

    # 2. Check for French and Franco-Tunisian markers
    french_triggers = {
        'comment', 'pourquoi', 'quand', 'quel', 'quelle', 'quels', 'quelles',
        'est', "c'est", 'cest', 'quoi', 'ce', 'que', 'qui', 'je', 'veux', 'creer',
        'créer', 'cree', 'crée', 'lancer', 'commencer', 'trouver', 'chercher',
        'une', 'un', 'des', 'du', 'de', 'la', 'le', 'les', 'pour', 'dans', 'en',
        'tunisie', 'tunisien', 'tunisienne', 'avantages', 'obtenir', 'forme',
        'juridique', 'choisir', 'sais', 'pas', 'par', 'où', 'ou', 'mon', 'projet',
        'chneya', 'chnowa', 'kifech', 'kifeh', 'chkoun', 'nheb', 'n7eb', 'flous'
    }
    # Tokenize word-by-word
    tokens = set(re.findall(r"[a-zà-ÿ'’]+", lowered))
    if tokens.intersection(french_triggers) or any(t in lowered for t in ["c'est", "c est", "d'une", "d une"]):
        return 'fr'

    # 3. Check for distinct English indicators
    english_triggers = {
        'what', 'how', 'why', 'when', 'where', 'which', 'who', 'does', 'do',
        'is', 'are', 'can', 'should', 'could', 'would', 'the', 'provide', 'benefit',
        'benefits', 'criteria', 'requirements', 'process', 'available'
    }
    if tokens.intersection(english_triggers):
        return 'en'

    # Default to French for Bidaya Tunisia platform
    return 'fr'


def normalize_query(user_message: str) -> str:
    """
    Normalizes the user query by correcting spelling, expanding Franco-Tunisian phrasing,
    fixing missing spaces, and framing it clearly.
    Preserves the original intent.
    """
    if not user_message or not user_message.strip():
        return ""

    raw = user_message.strip()
    lowered = raw.lower()

    # 1. Direct canonical shortcuts for frequent queries
    if re.search(r'\b(comment\s+cre[ée]r?\s+(une\s+)?startup|je\s+veux\s+cr[ée]er\s+(une\s+)?startup|creer\s+startup)\b', lowered):
        return "Comment créer une startup en Tunisie ?"

    if re.search(r'\b(comment\s+lancer\s+(mon\s+)?projet|par\s+o[ùu]\s+commencer)\b', lowered):
        return "Comment commencer et lancer un projet de startup en Tunisie ?"

    if re.search(r'\b(c[\'\s]?est\s+quoi\s+startup\s+act|chneya\s+startup\s+act|chnowa\s+startup\s+act|startup\s+act\s+chnowa|startup\s+act\s+chneya)\b', lowered):
        return "Qu'est-ce que le Startup Act tunisien et quels sont ses avantages ?"

    if re.search(r'\b(comment\s+obtenir\s+(le\s+)?label|label\s+startup\s+comment)\b', lowered):
        return "Comment obtenir le label Startup Act en Tunisie et quels sont les critères ?"

    if re.search(r'\b(quelle\s+forme\s+juridique|forme\s+juridique\s+choisir|sarl\s+ou\s+suarl)\b', lowered):
        return "Quelle forme juridique choisir pour une startup en Tunisie entre SARL et SUARL ?"

    if re.search(r'\b(comment\s+(chercher|trouver)\s+(des\s+)?investisseurs|trouver\s+financement)\b', lowered):
        return "Comment chercher et trouver des investisseurs ou des financements pour une startup en Tunisie ?"

    if re.search(r'\b(bourse\s+(de\s+)?startup|bourse\s+fondateur)\b', lowered):
        return "Qu'est-ce que la bourse de startup en Tunisie et comment en bénéficier ?"

    # 2. General phonetic and Franco-Arabe normalization
    text = lowered
    for pattern, replacement in TUNISIAN_ARABIC_MAPPINGS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    for pattern, replacement in TYPO_MAPPINGS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    # 3. Clean spacing and punctuation
    text = re.sub(r'\s+', ' ', text).strip()

    # Append Tunisia context if query is very short and lacks country reference
    if len(text.split()) <= 4 and "tunis" not in text:
        text += " en Tunisie"

    # Capitalize first letter
    text = text[0].upper() + text[1:] if text else ""

    # Ensure question mark if it starts with an interrogative
    if any(text.lower().startswith(w) for w in ["comment", "qu'est-ce", "quel", "quelle", "qui", "combien", "où", "pourquoi"]):
        if not text.endswith("?"):
            text += " ?"

    return text


def rewrite_query_for_search(normalized_query: str) -> List[str]:
    """
    Generates multi-query search strings combining French concepts and English document equivalents
    to achieve maximum cosine similarity in Qdrant.
    """
    queries = [normalized_query]
    q_low = normalized_query.lower()

    # Domain topic detection and expansion
    if any(k in q_low for k in ["créer", "lancer", "commencer", "étape", "démarche"]):
        queries.append("création startup Tunisie étapes création entreprise Startup Act immatriculation RNE label startup")
        queries.append("Corporate Legal Structures in Tunisia SARL vs SUARL Incorporation RNE registration")
        queries.append("Tunisian Startup Act Law No. 2018-20 Overview and 5 Label Criteria")

    if any(k in q_low for k in ["startup act", "loi 2018-20", "avantages", "critères"]):
        queries.append("Tunisian Startup Act Law No. 2018-20 Overview and 5 Label Criteria")
        queries.append("Startup Act Incentives Founder Leave Startup Grant and Social Security")
        queries.append("Tax Exemptions and Customs Duty Relief for Labeled Startups")

    if any(k in q_low for k in ["label", "labellisation", "collège"]):
        queries.append("Tunisian Startup Act 5 Label Criteria age size innovation growth potential College des Startups")
        queries.append("Smart Capital startup label application procedure")

    if any(k in q_low for k in ["forme juridique", "sarl", "suarl", "statuts", "capital"]):
        queries.append("Corporate Legal Structures in Tunisia SARL vs SUARL Incorporation minimum capital RNE")
        queries.append("Commercial Companies Code articles of association legal forms")

    if any(k in q_low for k in ["investisseur", "financement", "anava", "air", "business angel", "vc", "capital"]):
        queries.append("Tax Incentives for Investors and Business Angels under the Startup Act reinvested earnings")
        queries.append("Financing Ecosystem in Tunisia AIR ANAVA Fund of Funds and Seed Grants")
        queries.append("Angel Investors and Venture Capital Due Diligence in Tunisia tickets TND")

    if any(k in q_low for k in ["bourse", "subvention", "salaire", "congé"]):
        queries.append("Startup Act Incentives Founder Leave Startup Grant Bourse de Startup 5000 TND Social Security")

    if any(k in q_low for k in ["devise", "banque", "compte", "bct", "change"]):
        queries.append("Special Foreign Currency Bank Account and Exchange Control Relief Central Bank of Tunisia BCT")

    # If no specific trigger matched, provide bilingual translation keywords
    if len(queries) == 1:
        queries.append(f"{normalized_query} Tunisia startup regulations Startup Act")

    return list(dict.fromkeys(queries))[:3]


def detect_query_intent(query: str) -> str:
    """
    Distinguishes:
    - 'specific_legal': Exact tax rates, formal statutory criteria, grant limits, legal penalties.
    - 'general_guidance': How to start, MVP, ideation, finding cofounders, general process.
    """
    q_low = query.lower()
    legal_triggers = [
        "impôt", "taxe", "exonération", "article", "loi", "bourse", "montant", "pourcentage",
        "durée légale", "critère officiel", "exact", "sanction", "devises", "5000", "tnd",
        "statutaire", "jort", "bct", "innorpi"
    ]
    if any(k in q_low for k in legal_triggers):
        return "specific_legal"
    return "general_guidance"
