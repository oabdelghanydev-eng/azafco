"""
Generate the owner's spec sheet (xlsx) that feeds data/specs.ts.

    python scripts/owner-spec-sheet.py <out.xlsx>

One sheet per topic, headers in English (row 1) and Arabic (row 2), one row
per species pre-listed. Values already published on the site (indicative size
grades, EPS box, whole fresh-chilled) are pre-filled and highlighted yellow so
the owner confirms or corrects them. Everything else is blank on purpose.

Filled sheet -> data/specs.ts:  python scripts/import-specs.py <filled.xlsx>
Needs: pip install openpyxl
"""
import json
import re
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = Path(__file__).resolve().parent.parent

FORM_KINDS = ["fresh_whole", "fresh_gutted", "fresh_fillet", "frozen_whole", "frozen_gutted", "frozen_fillet"]
GRADE_LABELS = ["small", "medium", "large", "extra_large", "jumbo"]
PACK_TYPES = ["eps_box", "carton", "plastic_crate", "vacuum_pack", "other"]
CERT_GROUPS = ["food_safety", "export_approval", "management_system"]
SITE_TYPES = ["farm", "plant", "cold_store", "office", "other"]
YES_NO = ["yes", "no"]

NAVY = "002D72"
PREFILL = PatternFill("solid", fgColor="FFF2B3")
HEAD_EN = PatternFill("solid", fgColor=NAVY)
HEAD_AR = PatternFill("solid", fgColor="E8EDF4")
KEY = PatternFill("solid", fgColor="F5F7FA")
THIN = Side(style="thin", color="8794A8")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def load_products():
    """[(slug, translationKey, pendingConfirmation)] in data/products.ts order."""
    src = (ROOT / "data" / "products.ts").read_text(encoding="utf8")
    out = []
    for block in re.findall(r"\{[^{}]*?slug:\s*'[^']+'[^{}]*?\}", src, re.S):
        slug = re.search(r"slug:\s*'([^']+)'", block).group(1)
        key = re.search(r"translationKey:\s*'([^']+)'", block).group(1)
        pending = bool(re.search(r"pendingConfirmation:\s*true", block))
        out.append((slug, key, pending))
    return out


def load_names(locale):
    return json.loads((ROOT / "locales" / locale / "data" / "products.json").read_text(encoding="utf8"))


SIZE_RE = re.compile(r"^(\w+)\s*\(([\d.]+)\s*(?:-\s*([\d.]+))?\s*(g|kg)\s*(\+)?\)$", re.I)


def parse_size(s):
    """'Small (200-300g)' -> ('small', 200, 300); 'Jumbo (2kg+)' -> ('jumbo', 2000, None)."""
    m = SIZE_RE.match(s.strip())
    if not m:
        return None
    label, a, b, unit, _plus = m.groups()
    f = 1000 if unit.lower() == "kg" else 1
    lo = int(float(a) * f)
    hi = int(float(b) * f) if b else None
    label = label.lower()
    return (label if label in GRADE_LABELS else None, lo, hi)


def load_markets():
    src = (ROOT / "config" / "company.config.ts").read_text(encoding="utf8")
    rows = []
    for m in re.finditer(r"\{\s*key:\s*'([^']+)',\s*name:\s*'([^']+)'[^}]*status:\s*'(\w+)'[^}]*countryCode:\s*'(\w+)'", src):
        rows.append(m.groups())
    return rows


def header(ws, cols, widths=None):
    for i, (en, ar) in enumerate(cols, start=1):
        c1 = ws.cell(row=1, column=i, value=en)
        c1.font = Font(bold=True, color="FFFFFF")
        c1.fill = HEAD_EN
        c2 = ws.cell(row=2, column=i, value=ar)
        c2.font = Font(bold=True, color=NAVY)
        c2.fill = HEAD_AR
        for c in (c1, c2):
            c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
            c.border = BORDER
        ws.column_dimensions[get_column_letter(i)].width = (widths or {}).get(i, 16)
    ws.row_dimensions[1].height = 34
    ws.row_dimensions[2].height = 34
    ws.freeze_panes = "D3"


def put(ws, row, col, value, prefilled=False, key=False):
    c = ws.cell(row=row, column=col, value=value)
    c.border = BORDER
    c.alignment = Alignment(vertical="center", wrap_text=True)
    if prefilled:
        c.fill = PREFILL
    elif key:
        c.fill = KEY
    return c


def dropdown(ws, options, col, last_row=400):
    dv = DataValidation(type="list", formula1='"' + ",".join(options) + '"', allow_blank=True)
    dv.error = "Choose a value from the list / اختر من القائمة"
    dv.errorTitle = "AZAFCO"
    ws.add_data_validation(dv)
    letter = get_column_letter(col)
    dv.add(f"{letter}3:{letter}{last_row}")


def main(out):
    products = load_products()
    en, ar = load_names("en"), load_names("ar")
    wb = Workbook()

    # ── Instructions (Arabic) ──────────────────────────────────────────────
    ws = wb.active
    ws.title = "تعليمات"
    ws.sheet_view.rightToLeft = True
    lines = [
        ("ملف مواصفات أزافكو للموقع", True),
        ("", False),
        ("الغرض: هذه البيانات تظهر للمشترين على صفحة كل صنف في الموقع (أشكال المنتج، الفئات، التعبئة، الشحن، الشهادات). أي خانة تُترك فارغة تظهر في الموقع بعبارة «تُؤكَّد مع المبيعات»، فلا تكتب رقمًا غير مؤكد.", False),
        ("", False),
        ("طريقة التعبئة:", True),
        ("١. كل ورقة لموضوع واحد: «Forms & grades» (أشكال المنتج والفئات)، «Packing & logistics» (التعبئة والشحن)، «Certificates» (الشهادات)، «Facilities» (المنشآت)، «Transit times» (مدد النقل).", False),
        ("٢. الصف الأول عناوين بالإنجليزية والصف الثاني نفس العناوين بالعربية. ابدأ الكتابة من الصف الثالث.", False),
        ("٣. لا تغيّر عمود «slug» ولا أسماء الأوراق؛ الموقع يقرأ البيانات بها.", False),
        ("٤. الخانات الصفراء قيم موجودة حاليًا على الموقع (أحجام استرشادية، صندوق فلين EPS، سمك كامل طازج مبرد). راجعها: صحّحها أو امسحها، ثم اكتب yes في عمود «Confirmed by owner» إذا كانت صحيحة.", False),
        ("٥. الأوزان بالجرام، ودرجات الحرارة بالدرجة المئوية، والأبعاد بالسنتيمتر، والحد الأدنى للطلب بالكيلوجرام، والمدد بالساعات أو الأيام كما في العنوان.", False),
        ("٦. لكل شكل منتج (مثلًا كامل طازج، فيليه مجمد) اكتب صفًا لكل فئة وزن. بيانات الشكل (الصلاحية، الحرارة، العبوة، الوزن الصافي) تكفي في أول صف للشكل.", False),
        ("٧. لإضافة شكل أو فئة جديدة لصنف: أضف صفًا جديدًا بنفس الـ slug. الأكواد المسموحة تظهر في القائمة المنسدلة.", False),
        ("٨. الشهادات: اكتب فقط الشهادات السارية، مع جهة الإصدار والرقم والنطاق وتاريخ الانتهاء، وهل نسمح بنشرها. أرسل نسخة PDF من كل شهادة.", False),
        ("", False),
        ("أكواد أشكال المنتج:", True),
        ("fresh_whole = كامل طازج مبرد | fresh_gutted = منزوع الأحشاء طازج | fresh_fillet = فيليه طازج | frozen_whole = كامل مجمد | frozen_gutted = منزوع الأحشاء مجمد | frozen_fillet = فيليه مجمد", False),
        ("أكواد الفئات: small = صغير | medium = متوسط | large = كبير | extra_large = كبير جدًا | jumbo = جامبو", False),
        ("أكواد العبوات: eps_box = صندوق فلين | carton = كرتون | plastic_crate = صندوق بلاستيك | vacuum_pack = تغليف تحت تفريغ | other = أخرى (اذكرها في الملاحظات)", False),
        ("", False),
        ("بعد التعبئة: أرسل الملف لفريق الموقع، وسيُحمَّل تلقائيًا بالأمر: python scripts/import-specs.py OWNER-SPEC-SHEET.xlsx", False),
    ]
    ws.column_dimensions["A"].width = 120
    for i, (text, bold) in enumerate(lines, start=1):
        c = ws.cell(row=i, column=1, value=text)
        c.alignment = Alignment(wrap_text=True, vertical="top", horizontal="right")
        c.font = Font(bold=bold, size=14 if i == 1 else 11, color=NAVY if bold else "1B2433")
    legend = ws.cell(row=len(lines) + 2, column=1, value="خانة صفراء = قيمة منقولة من الموقع الحالي وتحتاج تأكيدك")
    legend.fill = PREFILL
    legend.alignment = Alignment(horizontal="right")

    # ── Forms & grades ─────────────────────────────────────────────────────
    ws = wb.create_sheet("Forms & grades")
    cols = [
        ("slug (do not edit)", "المعرّف (لا تعدّله)"),
        ("Species (EN)", "الصنف (إنجليزي)"),
        ("Species (AR)", "الصنف (عربي)"),
        ("Product form (code)", "شكل المنتج (كود)"),
        ("Grade (code)", "الفئة (كود)"),
        ("Min weight per piece (g)", "أقل وزن للسمكة (جم)"),
        ("Max weight per piece (g, blank = and above)", "أعلى وزن للسمكة (جم، فارغ = فأكثر)"),
        ("Shelf life (days)", "مدة الصلاحية (يوم)"),
        ("Storage/transport temp min (°C)", "أقل درجة حرارة تخزين/نقل (°م)"),
        ("Storage/transport temp max (°C)", "أعلى درجة حرارة تخزين/نقل (°م)"),
        ("Pack type (code)", "نوع العبوة (كود)"),
        ("Net weight per box (kg)", "الوزن الصافي للعبوة (كجم)"),
        ("Confirmed by owner (yes/no)", "مؤكد من الإدارة (yes/no)"),
        ("Notes", "ملاحظات"),
    ]
    header(ws, cols, {1: 18, 2: 18, 3: 16, 4: 18, 5: 14, 7: 22, 9: 20, 10: 20, 14: 30})
    r = 3
    for slug, key, pending in products:
        name_en = en.get(key, {}).get("name", slug) + (" (still sold? confirm)" if pending else "")
        name_ar = ar.get(key, {}).get("name", "") + (" (هل ما زال يُباع؟)" if pending else "")
        sizes = [g for g in (parse_size(s) for s in en.get(key, {}).get("sizes", [])) if g]
        pack = "eps_box" if en.get(key, {}).get("packaging") else None
        for i, g in enumerate(sizes or [None]):
            put(ws, r, 1, slug, key=True)
            put(ws, r, 2, name_en, key=True)
            put(ws, r, 3, name_ar, key=True)
            put(ws, r, 4, "fresh_whole", prefilled=True)
            put(ws, r, 5, g[0] if g else None, prefilled=bool(g and g[0]))
            put(ws, r, 6, g[1] if g else None, prefilled=bool(g))
            put(ws, r, 7, g[2] if g else None, prefilled=bool(g and g[2]))
            for c in (8, 9, 10):
                put(ws, r, c, None)
            put(ws, r, 11, pack if i == 0 else None, prefilled=bool(pack and i == 0))
            put(ws, r, 12, None)
            put(ws, r, 13, None)
            put(ws, r, 14, None)
            r += 1
    dropdown(ws, FORM_KINDS, 4)
    dropdown(ws, GRADE_LABELS, 5)
    dropdown(ws, PACK_TYPES, 11)
    dropdown(ws, YES_NO, 13)

    # ── Packing & logistics ────────────────────────────────────────────────
    ws = wb.create_sheet("Packing & logistics")
    cols = [
        ("slug (do not edit)", "المعرّف (لا تعدّله)"),
        ("Species (EN)", "الصنف (إنجليزي)"),
        ("Species (AR)", "الصنف (عربي)"),
        ("Box type (code)", "نوع الصندوق (كود)"),
        ("Box outer length (cm)", "طول الصندوق من الخارج (سم)"),
        ("Box outer width (cm)", "عرض الصندوق من الخارج (سم)"),
        ("Box outer height (cm)", "ارتفاع الصندوق من الخارج (سم)"),
        ("Boxes per pallet", "عدد الصناديق في البالتة"),
        ("Air freight offered (yes/no)", "شحن جوي متاح (yes/no)"),
        ("Air: minimum order (kg)", "جوي: الحد الأدنى للطلب (كجم)"),
        ("Reefer truck offered (yes/no)", "شاحنة مبردة متاحة (yes/no)"),
        ("Reefer truck: minimum order (kg)", "شاحنة مبردة: الحد الأدنى (كجم)"),
        ("Sea freight offered (yes/no)", "شحن بحري متاح (yes/no)"),
        ("Sea: minimum order (kg)", "بحري: الحد الأدنى (كجم)"),
        ("Farm to plant (hours, typical)", "من المزرعة للمصنع (ساعات، المعتاد)"),
        ("Plant to airport/port/border (hours, typical)", "من المصنع للمطار/الميناء/المنفذ (ساعات)"),
        ("Confirmed by owner (yes/no)", "مؤكد من الإدارة (yes/no)"),
        ("Notes", "ملاحظات"),
    ]
    header(ws, cols, {1: 18, 2: 18, 3: 16, 15: 20, 16: 24, 18: 30})
    r = 3
    for slug, key, pending in products:
        put(ws, r, 1, slug, key=True)
        put(ws, r, 2, en.get(key, {}).get("name", slug), key=True)
        put(ws, r, 3, ar.get(key, {}).get("name", ""), key=True)
        pack = "eps_box" if en.get(key, {}).get("packaging") else None
        put(ws, r, 4, pack, prefilled=bool(pack))
        for c in range(5, len(cols) + 1):
            put(ws, r, c, None)
        r += 1
    dropdown(ws, PACK_TYPES, 4)
    for c in (9, 11, 13, 17):
        dropdown(ws, YES_NO, c)

    # ── Certificates ───────────────────────────────────────────────────────
    ws = wb.create_sheet("Certificates")
    cols = [
        ("Certificate / approval name", "اسم الشهادة / الاعتماد"),
        ("Group (code)", "المجموعة (كود)"),
        ("Issuer (certification body / authority)", "جهة الإصدار"),
        ("Certificate / approval number", "رقم الشهادة / الاعتماد"),
        ("Scope (products / activities covered)", "النطاق (المنتجات / الأنشطة المشمولة)"),
        ("Site covered (address)", "الموقع المشمول (العنوان)"),
        ("Issue date (YYYY-MM-DD)", "تاريخ الإصدار"),
        ("Valid until (YYYY-MM-DD)", "سارية حتى"),
        ("May we publish it? (yes/no)", "هل نسمح بنشرها؟ (yes/no)"),
        ("File name of the PDF copy", "اسم ملف النسخة PDF"),
        ("Notes", "ملاحظات"),
    ]
    header(ws, cols, {1: 30, 3: 26, 4: 22, 5: 34, 6: 30, 11: 30})
    ws.freeze_panes = "B3"
    # Standards named on the earlier site (expired copies); listed so the owner can say which are current.
    pre = [("ISO 22000", "food_safety"), ("HACCP", "food_safety"), ("ISO 9001", "management_system"), ("ISO 14001", "management_system"), ("ISO 45001", "management_system")]
    r = 3
    for name, group in pre:
        put(ws, r, 1, name, prefilled=True)
        put(ws, r, 2, group, prefilled=True)
        for c in range(3, len(cols) + 1):
            put(ws, r, c, None)
        r += 1
    for _ in range(4):
        for c in range(1, len(cols) + 1):
            put(ws, r, c, None)
        r += 1
    dropdown(ws, CERT_GROUPS, 2)
    dropdown(ws, YES_NO, 9)

    # ── Facilities ─────────────────────────────────────────────────────────
    ws = wb.create_sheet("Facilities")
    cols = [
        ("Site name", "اسم الموقع"),
        ("Type (code)", "النوع (كود)"),
        ("Governorate", "المحافظة"),
        ("City / area", "المدينة / المنطقة"),
        ("What happens there", "النشاط في الموقع"),
        ("Capacity (with unit and date)", "الطاقة (مع الوحدة والتاريخ)"),
        ("Owned or partner?", "ملك الشركة أم شريك؟"),
        ("May we publish it? (yes/no)", "هل نسمح بنشره؟ (yes/no)"),
        ("Professional photo available? (yes/no)", "هل توجد صورة احترافية؟ (yes/no)"),
        ("Notes", "ملاحظات"),
    ]
    header(ws, cols, {1: 28, 5: 34, 6: 28, 10: 30})
    ws.freeze_panes = "B3"
    put(ws, 3, 1, "Processing plant", prefilled=True)
    put(ws, 3, 2, "plant", prefilled=True)
    put(ws, 3, 3, "Kafr El Sheikh", prefilled=True)
    put(ws, 3, 4, "Motobas, Industrial Zone", prefilled=True)
    for c in range(5, len(cols) + 1):
        put(ws, 3, c, None)
    for r in range(4, 9):
        for c in range(1, len(cols) + 1):
            put(ws, r, c, None)
    dropdown(ws, SITE_TYPES, 2)
    dropdown(ws, YES_NO, 8)
    dropdown(ws, YES_NO, 9)

    # ── Transit times ──────────────────────────────────────────────────────
    ws = wb.create_sheet("Transit times")
    cols = [
        ("Market", "السوق"),
        ("Country code", "كود الدولة"),
        ("Status on the site", "الحالة على الموقع"),
        ("Shipping mode (air / reefer_truck / sea)", "طريقة الشحن"),
        ("Departure point (airport / port / border)", "نقطة الخروج (مطار / ميناء / منفذ)"),
        ("Plant to departure point (hours)", "من المصنع لنقطة الخروج (ساعات)"),
        ("Departure to arrival (hours)", "من الخروج للوصول (ساعات)"),
        ("Typical order-to-delivery (days)", "من الطلب للتسليم عادةً (أيام)"),
        ("Confirmed by owner (yes/no)", "مؤكد من الإدارة (yes/no)"),
        ("Notes", "ملاحظات"),
    ]
    header(ws, cols, {1: 26, 4: 22, 5: 26, 10: 30})
    ws.freeze_panes = "B3"
    r = 3
    for key, name, status, cc in load_markets():
        put(ws, r, 1, name, key=True)
        put(ws, r, 2, cc, key=True)
        put(ws, r, 3, status, key=True)
        for c in range(4, len(cols) + 1):
            put(ws, r, c, None)
        r += 1
    dropdown(ws, ["air", "reefer_truck", "sea"], 4)
    dropdown(ws, YES_NO, 9)

    Path(out).parent.mkdir(parents=True, exist_ok=True)
    wb.save(out)
    print(f"wrote {out}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python scripts/owner-spec-sheet.py <out.xlsx>")
    main(sys.argv[1])
