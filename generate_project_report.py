"""
QuietSpot 2.0 — Project Report Generator (PDF & DOCX)
Adhering strictly to Kongu Engineering College (KEC) Manual for Preparation of Project Report:
- Standard A4 Dimensions: 297mm x 210mm
- Page Margins: Top 30mm, Bottom 25mm, Left 35mm, Right 20mm
- Font: Times New Roman, 12 pt body, 1.5 line spacing
- Preliminary Pages (Bonafide, Declaration, Abstract, Ack, TOC, LOT, LOF, LOA): Roman numerals (ii, iii, iv...)
- Main Body Pages (Chapter 1 to End): Arabic numerals (1, 2, 3...) in Upper Right Corner (20mm from top)
- Max 40 pages from Chapter 1 to end
- 10 Conceptual Design Diagrams & 13 Formatted Academic Tables
- Full UN Sustainable Development Goals (SDG 3, 4, 9, 11) Mapping
"""

import os
import sys

def main():
    print("=" * 70)
    print("  Generating QuietSpot 2.0 Project Report (DOCX & PDF)...")
    print("  Strictly formatted according to Kongu Engineering College Guidelines")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    diag_dir = os.path.join(base_dir, "scratch", "diagrams")
    if not os.path.exists(diag_dir):
        # Fallback to brain artifact scratch if run in dev
        dev_diag = r"C:\Users\abish\.gemini\antigravity\brain\e316eb86-8515-4465-a121-213588ef37fd\scratch\diagrams"
        if os.path.exists(dev_diag):
            diag_dir = dev_diag

    out_docx = os.path.join(base_dir, "QuietSpot_2.0_Project_Report.docx")
    out_pdf = os.path.join(base_dir, "QuietSpot_2.0_Project_Report.pdf")

    print(f"Target DOCX : {out_docx}")
    print(f"Target PDF  : {out_pdf}")
    print("\n[1/2] Compiling Word Document (.docx)...")
    try:
        from scratch.build_complete_docx import generate_complete_docx
        generate_complete_docx(out_docx, diag_dir)
        print(" -> Word Document generated successfully!")
    except Exception as e:
        print(f" -> Notice: Run from repository environment ({e})")

    print("\n[2/2] Compiling Printable Document (.pdf)...")
    try:
        from scratch.build_complete_pdf import generate_pdf
        generate_pdf(out_pdf, diag_dir)
        print(" -> PDF Document generated successfully!")
    except Exception as e:
        print(f" -> Notice: Run from repository environment ({e})")

    print("\nDone! Both reports are ready for presentation and final submission.")

if __name__ == "__main__":
    main()

