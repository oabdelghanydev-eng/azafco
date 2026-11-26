"""
Load the owner's filled spec sheet into data/specs.ts.

    python scripts/import-specs.py <OWNER-SPEC-SHEET.xlsx> [--check]

Reads the "Forms & grades" and "Packing & logistics" sheets (header rows 1-2,
data from row 3) and rewrites data/specs.ts. Species in data/products.ts with
no rows get an empty spec (the site then shows "Confirmed with sales").
--check validates and prints a summary without writing.

Rules:
- Unknown slugs or codes stop the import (nothing is written).
- A form is `indicative` (shown with a note) unless every one of its rows has
  "yes" in "Confirmed by owner". Same for the logistics row.
- Form-level fields (shelf life, temperature, pack type, net weight) are taken
  from the first row of that form that has them.
The sheets "Certificates", "Facilities" and "Transit times" are not imported
(yet): copy approved certificates into data/certificates.ts by hand.
Needs: pip install openpyxl
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "specs.ts"

FORM_KINDS = ["fresh_whole", "fresh_gutted", "fresh_fillet", "frozen_whole", "frozen_gutted", "frozen_fillet"]
GRADE_LABELS = ["small", "medium", "large", "extra_large", "jumbo"]
PACK_TYPES = ["eps_box", "carton", "plastic_crate", "vacuum_pack", "other"]
YES = {"yes", "y", "نعم", "true", "1"}

errors = []


def slugs_from_products():
    src = (ROOT / "data" / "products.ts").read_text(encoding="utf8")
    return re.findall(r"slug:\s*'([^']+)'", src)


def text(v):
    return str(v).strip() if v is not None and str(v).strip() != "" else None


def num(v, where, integer=False):
    t = text(v)
    if t is None:
        return None
    try:
        n = float(t.replace(",", "."))
    except ValueError:
        errors.append(f"{where}: not a number: {t!r}")
        return None
    if integer:
        return int(round(n))
    return int(n) if n == int(n) else n


def code(v, allowed, where):
    t = text(v)
    if t is None:
        return None
    t = t.lower()
    if t not in allowed:
        errors.append(f"{where}: unknown code {t!r} (allowed: {', '.join(allowed)})")
        return None
    return t


def yes(v):
    t = text(v)
    return t is not None and t.lower() in YES


def rows(ws):
    for i, row in enumerate(ws.iter_rows(min_row=3, values_only=True), start=3):
        if row and text(row[0]):
            yield i, row


def main(path, check=False):
    known = slugs_from_products()
    wb = load_workbook(path, data_only=True)
    specs = {s: {"forms": [], "logistics": {"shippingModes": []}} for s in known}

    # Forms & grades
    ws = wb["Forms & grades"]
    forms = {}  # (slug, kind) -> form dict
    confirmed = {}
    for i, r in rows(ws):
        r = list(r) + [None] * 14
        where = f"Forms & grades row {i}"
        slug = text(r[0])
        if slug not in specs:
            errors.append(f"{where}: unknown slug {slug!r}")
            continue
        kind = code(r[3], FORM_KINDS, where)
        if not kind:
            if any(text(x) for x in r[4:12]):
                errors.append(f"{where}: values without a product form code")
            continue
        f = forms.get((slug, kind))
        if f is None:
            f = {"kind": kind, "grades": []}
            forms[(slug, kind)] = f
            specs[slug]["forms"].append(f)
            confirmed[(slug, kind)] = True
        label = code(r[4], GRADE_LABELS, where)
        lo, hi = num(r[5], where, True), num(r[6], where, True)
        if label or lo is not None or hi is not None:
            g = {}
            if label:
                g["label"] = label
            if lo is not None:
                g["minG"] = lo
            if hi is not None:
                g["maxG"] = hi
            if lo is not None and hi is not None and hi < lo:
                errors.append(f"{where}: max weight below min weight")
            f["grades"].append(g)
        shelf = num(r[7], where, True)
        if shelf is not None and "shelfLifeDays" not in f:
            f["shelfLifeDays"] = shelf
        tmin, tmax = num(r[8], where), num(r[9], where)
        if (tmin is not None or tmax is not None) and "tempC" not in f:
            if tmin is None or tmax is None:
                errors.append(f"{where}: give both temperature min and max")
            else:
                f["tempC"] = {"min": tmin, "max": tmax}
        pack = code(r[10], PACK_TYPES, where)
        if pack and "packType" not in f:
            f["packType"] = pack
        net = num(r[11], where)
        if net is not None and "netWeightKg" not in f:
            f["netWeightKg"] = net
        confirmed[(slug, kind)] = confirmed[(slug, kind)] and yes(r[12])
    for key, f in forms.items():
        if not confirmed[key]:
            f["indicative"] = True

    # Packing & logistics
    ws = wb["Packing & logistics"]
    for i, r in rows(ws):
        r = list(r) + [None] * 18
        where = f"Packing & logistics row {i}"
        slug = text(r[0])
        if slug not in specs:
            errors.append(f"{where}: unknown slug {slug!r}")
            continue
        lg = {"shippingModes": []}
        box = code(r[3], PACK_TYPES, where)
        if box:
            lg["boxType"] = box
        l, w, h = (num(r[c], where) for c in (4, 5, 6))
        if l is not None and w is not None and h is not None:
            lg["boxOuterCm"] = {"l": l, "w": w, "h": h}
        elif any(x is not None for x in (l, w, h)):
            errors.append(f"{where}: give all three box dimensions")
        bpp = num(r[7], where, True)
        if bpp is not None:
            lg["boxesPerPallet"] = bpp
        for mode, oc, mc in (("air", 8, 9), ("reefer_truck", 10, 11), ("sea", 12, 13)):
            moq = num(r[mc], where)
            if yes(r[oc]) or moq is not None:
                m = {"mode": mode}
                if moq is not None:
                    m["moqKg"] = moq
                lg["shippingModes"].append(m)
        f2p, p2p = num(r[14], where), num(r[15], where)
        if f2p is not None:
            lg["farmToPlantHours"] = f2p
        if p2p is not None:
            lg["plantToPortHours"] = p2p
        if len(lg) > 1 and not yes(r[16]):
            lg["indicative"] = True
        specs[slug]["logistics"] = lg

    if errors:
        print("Import stopped, fix the sheet:\n  " + "\n  ".join(errors))
        sys.exit(1)

    filled = sum(1 for s in specs.values() if s["forms"])
    print(f"{len(specs)} species, {filled} with at least one form, {sum(len(s['forms']) for s in specs.values())} forms")
    if check:
        return

    body = json.dumps(specs, ensure_ascii=False, indent=4)
    OUT.write_text(
        "// GENERATED by scripts/import-specs.py from the owner's spec sheet on "
        f"{date.today().isoformat()}.\n"
        "// Edit the sheet (docs/team/web/site-v2/OWNER-SPEC-SHEET.xlsx) and re-run the script\n"
        "// rather than editing by hand. Empty fields render \"Confirmed with sales\".\n"
        "// `indicative: true` = value copied from the existing product list, not yet confirmed by the owner.\n"
        "import type { SpeciesSpec } from '@/lib/v2/specs';\n\n"
        f"export const specs: Record<string, SpeciesSpec> = {body};\n",
        encoding="utf8",
    )
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        sys.exit("usage: python scripts/import-specs.py <sheet.xlsx> [--check]")
    main(args[0], check="--check" in sys.argv)
