"""
Knowith Capital — Master Document Generator
=============================================
Runs all four document generators sequentially to produce
the complete set of enterprise documentation deliverables.

Usage:
    python generate_all.py

Output:
    documents/
        01_Information_Architecture_Functional_Specification.docx
        02_UIUX_Design_Reference_Guide.docx
        03_Website_Content_Strategy.docx
        04_Client_Content_Collection_Kit.docx
"""

import sys
import os
import time

# Add project root and generators directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "generators"))


def main():
    """Generate all four Knowith Capital enterprise documents."""
    print("=" * 70)
    print("  KNOWITH CAPITAL — Enterprise Documentation Generator")
    print("  Phase 01: Premium Website Design & Development")
    print("=" * 70)
    print()

    start_time = time.time()
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "documents")

    # --- Document 01 ---
    print("[1/4] Generating: Information Architecture & Functional Specification...")
    from generators.doc01_information_architecture import generate_doc01
    generate_doc01(output_dir)
    print()

    # --- Document 02 ---
    print("[2/4] Generating: UI/UX Design Reference Guide...")
    from generators.doc02_uiux_design_guide import generate_doc02
    generate_doc02(output_dir)
    print()

    # --- Document 03 ---
    print("[3/4] Generating: Website Content Strategy...")
    from generators.doc03_content_strategy import generate_doc03
    generate_doc03(output_dir)
    print()

    # --- Document 04 ---
    print("[4/4] Generating: Client Content Collection Kit...")
    from generators.doc04_content_collection_kit import generate_doc04
    generate_doc04(output_dir)
    print()

    elapsed = time.time() - start_time
    print("=" * 70)
    print(f"  All documents generated successfully in {elapsed:.1f} seconds.")
    print(f"  Output directory: {output_dir}")
    print("=" * 70)


if __name__ == "__main__":
    main()
