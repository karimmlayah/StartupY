"""
Comprehensive End-to-End Test for the 8 user-specified questions:
1. "comment cree unstartup"
2. "Comment créer une startup en Tunisie ?"
3. "je veux lancer une startup mais je sais pas par où commencer"
4. "c'est quoi startup act"
5. "comment obtenir le label startup"
6. "quelle forme juridique choisir"
7. "comment chercher des investisseurs"
8. "chneya startup act"
"""
import sys
import os
import json
import requests
from pathlib import Path

# Force UTF-8 for console output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from services.query_normalizer import normalize_query, rewrite_query_for_search

TEST_QUESTIONS = [
    "comment cree unstartup",
    "Comment créer une startup en Tunisie ?",
    "je veux lancer une startup mais je sais pas par où commencer",
    "c'est quoi startup act",
    "comment obtenir le label startup",
    "quelle forme juridique choisir",
    "comment chercher des investisseurs",
    "chneya startup act"
]

def run_tests():
    print("=" * 80)
    print("TESTING 8 MANDATORY NATURAL LANGUAGE QUERIES AGAINST RAG API")
    print("=" * 80)

    report_items = []

    for idx, raw_query in enumerate(TEST_QUESTIONS, 1):
        print(f"\n[{idx}/8] TESTING QUERY: '{raw_query}'")
        
        normalized_q = normalize_query(raw_query)
        search_queries = rewrite_query_for_search(normalized_q)

        print(f"  -> Normalized Query: '{normalized_q}'")
        print(f"  -> Retrieval Query:  {search_queries}")

        payload = {
            "message": raw_query,
            "role": "startup"
        }
        res = requests.post("http://localhost:8000/api/chat", json=payload, timeout=25)
        if res.status_code != 200:
            print(f"  -> ERROR: API returned status {res.status_code}: {res.text}")
            continue

        data = res.json()
        answer = data.get("answer", "")
        sources = data.get("sources", [])

        print(f"  -> Top Qdrant Results / Sources Selected ({len(sources)}):")
        for s in sources:
            score_str = f" (Score: {s.get('score')})" if s.get('score') is not None else ""
            print(f"     * {s.get('title')} [{s.get('publisher')}]{score_str}")

        print("\n  -> Final Response:")
        print(answer)
        print("-" * 60)
        
        report_items.append({
            "index": idx,
            "original_query": raw_query,
            "normalized_query": normalized_q,
            "retrieval_query": search_queries,
            "top_results_and_scores": sources,
            "final_response": answer
        })

    # Save complete report as JSON artifact
    report_path = backend_dir / "test_8_queries_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_items, f, indent=2, ensure_ascii=False)
    print(f"\nSaved complete test report to {report_path}")

    return report_items

if __name__ == "__main__":
    run_tests()
