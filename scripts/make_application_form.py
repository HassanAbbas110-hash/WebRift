"""Builds docs/forms/WebRift_Application_Form.pdf (fillable). Run: python scripts/make_application_form.py

Prices are a snapshot of src/data/catalogue.ts (November 2026). Update PACKS/PRODUCTS here when prices change.
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import Paragraph

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "forms", "WebRift_Application_Form.pdf")
LOGO = os.path.join(ROOT, "docs", "forms", "assets", "logo-mark.png")

W, H = A4
M = 42
CW = W - 2 * M
NAVY, INK, MUTED = HexColor("#070b1a"), HexColor("#0f172a"), HexColor("#64748b")
BLUE, CYAN, VIOLET = HexColor("#3b82f6"), HexColor("#22d3ee"), HexColor("#7c3aed")
LINE, FIELD, TINT = HexColor("#cbd5e1"), HexColor("#f8fafc"), HexColor("#eff6ff")

REG_FEE = 200
CONTACT = "WhatsApp 060 965 8641  |  Tel 081 717 9974  |  hassanabbasbukhari51121@gmail.com"

PACKS = [  # name, for, setup, monthly
    ("Vape Starter", "Vape shops", 4000, 500),
    ("Vape Pro", "Vape shops", 7000, 650),
    ("Vape Complete", "Vape shops", 11000, 750),
    ("Retail Starter", "Any shop", 2200, 250),
    ("Retail Online Shop", "Any shop", 4000, 800),
    ("Repeat Combo", "Add-on combo", 2900, 350),
]
PRODUCTS = [  # name, price text
    ("Website Storefront", "R3,500 + R500/mo (vape edition +R700)"),
    ("18+ Age Check & Consent Setup", "R600 + R100/mo"),
    ("Coil & Pod Finder", "R1,600 + R160/mo"),
    ("Flavour Finder", "R1,050 + R110/mo"),
    ("Click & Collect / Local Delivery", "R1,700 + R260/mo"),
    ("Price-List Page (mini site)", "R1,600 + R260/mo"),
    ("Google Maps & Local Listings", "R1,350 + R130/mo"),
    ("Social & WhatsApp Profile Setup", "R1,000 per platform (WhatsApp +R500)"),
    ("Domain, Hosting & Business Email", "R600 + R50/mo"),
    ("Countertop QR Stand", "R850 each"),
    ("Shop & Product Photography", "R2,000"),
    ("Posters, Templates & Brand Design", "from R1,000"),
    ("Digital Loyalty Card", "R1,600 + R250/mo"),
    ("VIP Restock List", "R1,200 + R200/mo"),
    ("Google Review Manager", "R1,150 + R260/mo"),
    ("Social Media Management", "from R2,500/mo"),
    ("Business Health Check", "R2,000"),
    ("Monthly Growth Report", "R700/mo"),
    ("Stock & Warranty Tracker", "R2,100 + R210/mo"),
    ("Cash-Up & Till Theft Alert", "R1,500 + R160/mo"),
]
EXTRAS = ["WhatsApp Booking Engine", "Short-Form Social Videos", "In-Store TV Menu Board", "In-Store Wi-Fi Data Capture"]

TERMS = [
    ("1. Parties and this agreement", [
        "1.1 This agreement is between WebRift (\"WebRift\", \"we\", \"us\") and the business named in Section A (\"the Client\", \"you\").",
        "1.2 It is made up of this form, these terms and the WebRift quote referred to on page 1 (\"the Quote\"). If they differ, the Quote, as accepted by both parties, applies to price and scope and these terms apply to everything else.",
        "1.3 Your application is an offer to buy the services ticked in Section C. The agreement starts when WebRift accepts it in writing (email or WhatsApp is enough) and the registration fee has been received.",
    ]),
    ("2. Registration fee", [
        f"2.1 A once-off registration fee of R{REG_FEE} is payable with this application. It covers opening your client account, onboarding and administration.",
        "2.2 The registration fee is not part of the setup fee and is not refundable once WebRift has accepted the application. If WebRift declines the application, the fee is refunded in full.",
    ]),
    ("3. Services", [
        "3.1 WebRift will supply the packs, products and extras ticked in Section C, as described in the WebRift Product & Service Catalogue current on the date you sign.",
        "3.2 Anything not listed in Section C or the Quote is outside scope and is quoted separately before work starts.",
        "3.3 Timelines are targets, not guarantees. They depend on you sending content and approvals on time.",
    ]),
    ("4. Fees and payment", [
        "4.1 Setup fees are once-off. Unless another option is ticked in Section D, 50% of the setup fee is payable before work starts and the balance is payable on delivery, before the site or tool goes live.",
        "4.2 On packs, the setup fee may be paid in three equal instalments: the first before work starts and the others 30 and 60 days later.",
        "4.3 Monthly fees are payable in advance, starting on the go-live date. If you prepay 12 months, you pay for 10 and receive 2 months free; prepaid fees are not refunded if you cancel early, except where the law requires it.",
        "4.4 All prices are in South African Rand and exclude VAT, which is added if WebRift is or becomes a VAT vendor.",
        "4.5 Third-party costs are not included and are paid by you at cost: domain registration and renewals, mailboxes, WhatsApp message fees, print runs and similar.",
        "4.6 WebRift may change monthly fees after the minimum term by giving 30 days' written notice. You may cancel under clause 6 if you do not accept the change.",
        "4.7 Pay only into the bank account shown on your official WebRift invoice. Quotes are valid for 14 days unless they say otherwise.",
    ]),
    ("5. Late payment", [
        "5.1 If an amount is more than 7 days overdue, WebRift may, after written notice, pause work or suspend the services until the account is up to date.",
        "5.2 Suspension does not stop monthly fees from running during the minimum term.",
    ]),
    ("6. Term and cancellation", [
        "6.1 Monthly plans run for a minimum of 6 months from go-live. After that they continue month to month.",
        "6.2 After the minimum term, either party may cancel by giving 30 days' written notice.",
        "6.3 If you cancel during the minimum term, the monthly fees for the rest of the minimum term remain payable, unless WebRift is in material breach and has not fixed it within 14 days of written notice.",
        "6.4 Deposits and instalments already paid are not refunded once work has started, except where the law requires it.",
        "6.5 WebRift may cancel on 14 days' written notice if you breach this agreement and do not fix the breach in that time, or immediately if the services are used unlawfully.",
        "6.6 Nothing in this agreement limits rights you have under the Consumer Protection Act 68 of 2008 where that Act applies to you.",
    ]),
    ("7. What we need from you", [
        "7.1 You will give WebRift the content it needs (logo, product or price list, photos, opening hours, contact numbers and access to existing profiles) within 5 working days of signing, and will approve or comment on work within 48 hours of receiving a preview.",
        "7.2 You confirm that you own or may use everything you send us, and that it is accurate and lawful.",
        "7.3 You will name one person who can make decisions and approve work on your behalf.",
    ]),
    ("8. Changes and edits", [
        "8.1 The setup fee includes one round of changes before go-live.",
        "8.2 Pack clients receive up to 5 free edits a month. An edit is a small change of about 15 minutes, such as a price, photo, banner, opening hours or a typo. Unused edits do not roll over.",
        "8.3 Extra edits cost R120 each. New pages, new features, new locations or work of more than about an hour are quoted separately.",
    ]),
    ("9. Hosting, domain and ownership", [
        "9.1 Websites and tools on a monthly plan are hosted and maintained by WebRift. When a monthly plan ends, those services stop at the end of the notice period.",
        "9.2 Once paid for in full, once-off deliverables made for you (such as photos, poster and template artwork, QR artwork and written content) belong to you and will be handed over on request.",
        "9.3 Your logo, content, product data and customer lists remain yours. On cancellation WebRift will export your customer lists and product data on request, within 14 days.",
        "9.4 WebRift keeps ownership of its templates, code, design systems, automations and know-how, and may reuse them for other clients.",
        "9.5 Your domain is registered in your name where possible. You pay registration and renewal fees and are responsible for keeping it renewed.",
    ]),
    ("10. Personal information (POPIA)", [
        "10.1 For your customers' personal information, you are the responsible party and WebRift is your operator under the Protection of Personal Information Act 4 of 2013.",
        "10.2 WebRift will process that information only to provide the services, will keep it confidential and reasonably secure, and will tell you without delay if it becomes aware of a security compromise.",
        "10.3 You are responsible for having a lawful basis to collect your customers' information. Marketing messages may be sent only to customers who have opted in, and every list must offer a way to opt out.",
    ]),
    ("11. Regulated products", [
        "11.1 If you sell vape, tobacco or other age-restricted or regulated products, you alone are responsible for complying with the laws, licences and platform rules that apply to your business, including checking identity and age at collection or delivery.",
        "11.2 The 18+ Age Check is a self-declaration by the visitor. It is not proof of age and does not replace an identity check.",
        "11.3 WebRift may change, restrict or remove a feature if the law or a platform's rules require it, and will give you as much notice as is practical. Compliance notes from WebRift are practical guidance, not legal advice.",
    ]),
    ("12. Third-party services", [
        "12.1 The services rely on third parties such as Google, WhatsApp, Meta, hosting and domain providers. WebRift is not responsible for their outages, decisions, fees or policy changes, but will take reasonable steps to restore or adapt the services.",
    ]),
    ("13. Warranties and liability", [
        "13.1 WebRift will provide the services with reasonable skill and care and will fix defects in its own work that you report within 30 days of delivery, at no charge.",
        "13.2 WebRift does not promise any particular level of sales, search ranking, reviews, customer numbers or other business result. Estimates are guides, not guarantees.",
        "13.3 To the extent the law allows, WebRift's total liability under this agreement is limited to the fees you paid in the 3 months before the claim arose, and neither party is liable to the other for loss of profit or for indirect or consequential loss.",
        "13.4 You are responsible for claims arising from content or instructions you gave us, or from the way you run your business.",
    ]),
    ("14. Confidentiality and portfolio", [
        "14.1 Each party will keep the other's confidential information private and use it only for this agreement.",
        "14.2 WebRift may show the work done for you, with your business name, as an example of its work, unless you tell us in writing that you do not agree.",
    ]),
    ("15. Events outside our control", [
        "15.1 Neither party is liable for a delay or failure caused by something outside its reasonable control, such as load-shedding, network or platform outages, strikes or changes in the law. Payment obligations for services already delivered are not affected.",
    ]),
    ("16. Disputes and law", [
        "16.1 The parties will first try to settle a dispute by discussion between the signatories within 14 days of written notice. If that fails, either party may refer it to mediation before going to court.",
        "16.2 This agreement is governed by the law of the Republic of South Africa. The parties consent to the jurisdiction of the Magistrate's Court.",
    ]),
    ("17. General", [
        "17.1 This is the whole agreement between the parties. A change is valid only if both parties agree to it in writing; an exchange of emails or WhatsApp messages between the signatories is enough.",
        "17.2 The agreement may be signed electronically and in separate copies, in line with the Electronic Communications and Transactions Act 25 of 2002.",
        "17.3 Notices are sent to the email addresses and cell numbers in this form. Each party will tell the other if its details change.",
        "17.4 If a clause is found to be invalid, the rest of the agreement still applies. Not enforcing a right straight away does not waive it.",
        "17.5 You may not transfer this agreement to someone else without WebRift's written consent, which will not be unreasonably withheld.",
    ]),
]

H_STYLE = ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=8.6, leading=11, textColor=INK, spaceBefore=5, spaceAfter=2)
B_STYLE = ParagraphStyle("b", fontName="Helvetica", fontSize=7.8, leading=10.3, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=3)


def zar(n):
    return "R" + f"{n:,}"


class Form:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle("WebRift Client Application & Service Agreement")
        self.c.setAuthor("WebRift")
        self.c.setSubject("Client application form, order and service agreement")
        self.f = self.c.acroForm
        self.page = 1
        self.total = 0  # set before drawing

    # ---- primitives
    def text(self, x, y, s, size=9, bold=False, color=INK, font=None):
        self.c.setFont(font or ("Helvetica-Bold" if bold else "Helvetica"), size)
        self.c.setFillColor(color)
        self.c.drawString(x, y, s)

    def rtext(self, x, y, s, size=9, bold=False, color=INK):
        self.c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
        self.c.setFillColor(color)
        self.c.drawRightString(x, y, s)

    def field(self, name, label, x, y, w, h=17, value="", multiline=False):
        """Label above, fillable box below. y is the bottom of the box."""
        self.text(x, y + h + 3, label, 7, color=MUTED)
        self.f.textfield(name=name, tooltip=label, value=value, x=x, y=y, width=w, height=h,
                         fontName="Helvetica", fontSize=9, borderColor=LINE, fillColor=FIELD, textColor=INK,
                         borderWidth=0.6, forceBorder=True, fieldFlags="multiline" if multiline else "")

    def row(self, y, specs, gap=8, h=17):
        """specs: list of (name, label, fraction). Fractions sum to 1."""
        x = M
        usable = CW - gap * (len(specs) - 1)
        for name, label, frac in specs:
            w = usable * frac
            self.field(name, label, x, y, w, h)
            x += w + gap

    def check(self, name, label, x, y, size=10, bold=False, max_w=None):
        """Tick box with a label that wraps at max_w. Returns the number of label lines."""
        self.f.checkbox(name=name, tooltip=label, x=x, y=y, size=size, buttonStyle="check", borderColor=MUTED,
                        fillColor=white, textColor=INK, borderWidth=0.6, forceBorder=True)
        if not label:
            return 1
        font = "Helvetica-Bold" if bold else "Helvetica"
        lines, cur = [], ""
        for word in label.split():
            trial = (cur + " " + word).strip()
            if max_w and cur and stringWidth(trial, font, 8.5) > max_w:
                lines.append(cur)
                cur = word
            else:
                cur = trial
        lines.append(cur)
        for i, ln in enumerate(lines):
            self.text(x + size + 5, y + 2 - i * 10.5, ln, 8.5, bold=bold)
        return len(lines)

    def section(self, y, letter, title, note=""):
        self.c.setFillColor(BLUE)
        self.c.roundRect(M, y - 3, 16, 16, 3, stroke=0, fill=1)
        self.c.setFillColor(white)
        self.c.setFont("Helvetica-Bold", 10)
        self.c.drawCentredString(M + 8, y + 1.5, letter)
        self.text(M + 23, y + 1, title.upper(), 10, bold=True)
        tw = stringWidth(title.upper(), "Helvetica-Bold", 10)
        if note:
            self.text(M + 23 + tw + 8, y + 1.5, note, 7.5, color=MUTED)
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.6)
        self.c.line(M, y - 8, W - M, y - 8)
        return y - 8

    def gradient_bar(self, y, h=3):
        for i, col in enumerate((CYAN, BLUE, VIOLET)):
            self.c.setFillColor(col)
            self.c.rect(i * W / 3, y, W / 3 + 1, h, stroke=0, fill=1)

    # ---- page chrome
    def cover_header(self):
        c = self.c
        c.setFillColor(NAVY)
        c.rect(0, H - 104, W, 104, stroke=0, fill=1)
        self.gradient_bar(H - 107)
        c.drawImage(LOGO, M, H - 86, width=79, height=66, mask="auto")
        self.text(M + 94, H - 52, "Web", 26, bold=True, color=white)
        ww = stringWidth("Web", "Helvetica-Bold", 26)
        self.text(M + 94 + ww, H - 52, "Rift", 26, bold=True, color=CYAN)
        self.text(M + 95, H - 70, "Client Application & Service Agreement", 11.5, color=HexColor("#cbd5e1"))
        self.rtext(W - M, H - 46, "Websites, Google visibility, loyalty tools", 8, color=HexColor("#94a3b8"))
        self.rtext(W - M, H - 57, "and check-ups for local shops", 8, color=HexColor("#94a3b8"))
        self.rtext(W - M, H - 74, "2026/27", 9, bold=True, color=CYAN)

    def small_header(self, title):
        c = self.c
        c.drawImage(LOGO, M, H - 46, width=26.4, height=22, mask="auto")
        self.text(M + 33, H - 39, "WebRift", 11, bold=True)
        self.rtext(W - M, H - 39, title, 8.5, color=MUTED)
        self.gradient_bar(H - 54, 1.5)

    def footer(self, initials=True):
        c = self.c
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.line(M, 44, W - M, 44)
        self.text(M, 32, "WebRift  |  " + CONTACT, 7, color=MUTED)
        self.text(M, 22, "Prices in ZAR, excluding VAT and third-party costs. Prices may change; your quote confirms the price.", 6.5, color=MUTED)
        self.rtext(W - M, 32, f"Page {self.page} of {self.total}", 7.5, bold=True, color=MUTED)
        if initials:
            self.rtext(W - M - 62, 53, "Client initials", 7, color=MUTED)
            self.f.textfield(name=f"initials_p{self.page}", tooltip="Client initials", x=W - M - 56, y=48, width=56, height=15,
                             fontName="Helvetica", fontSize=9, borderColor=LINE, fillColor=FIELD, textColor=INK,
                             borderWidth=0.6, forceBorder=True)

    def next_page(self):
        self.c.showPage()
        self.page += 1

    # ---- pages
    def page_details(self):
        self.cover_header()
        y = H - 128
        self.text(M, y, "Complete this form to register as a WebRift client. Sections A to F are your details and your order,", 8.5, color=MUTED)
        self.text(M, y - 11, "Section G is the service agreement, and both parties sign in Section H. Fields can be typed into or filled in by hand.", 8.5, color=MUTED)
        y -= 50
        self.row(y, [("app_no", "Application no. (office use)", .22), ("app_date", "Date (DD / MM / YYYY)", .22),
                     ("quote_no", "WebRift quote no. (WR-2026-....)", .28), ("consultant", "WebRift consultant", .28)])

        y = self.section(y - 30, "A", "Business details")
        y -= 34
        self.row(y, [("biz_legal", "Registered business name", .5), ("biz_trading", "Trading name (if different)", .5)])
        y -= 30
        self.text(M, y + 3, "Type of entity", 7, color=MUTED)
        x = M
        for key, lab, adv in (("sole", "Sole proprietor", 92), ("pty", "(Pty) Ltd", 68), ("cc", "Close corporation", 100),
                              ("partner", "Partnership", 76), ("other", "Other", 0)):
            self.check(f"entity_{key}", lab, x, y - 12)
            x += adv
        self.field("entity_other_text", "If other, specify", x + 50, y - 16, W - M - (x + 50))
        y -= 52
        self.row(y, [("biz_reg", "CIPC registration no. / owner ID no.", .36), ("biz_vat", "VAT no. (if registered)", .28),
                     ("biz_type", "What the business sells", .36)])
        y -= 28
        self.check("is_vape", "This business sells vape, tobacco or other age-restricted products (complete Section F)", M, y, bold=True)
        y -= 36
        self.row(y, [("addr_street", "Physical address of the shop (street and suburb)", 1)])
        y -= 34
        self.row(y, [("addr_city", "City / town", .34), ("addr_province", "Province", .28), ("addr_code", "Postal code", .16),
                     ("branches", "No. of branches", .22)])
        y -= 34
        self.row(y, [("existing_web", "Existing website (if any)", .5), ("existing_social", "Facebook / Instagram / TikTok pages", .5)])

        y = self.section(y - 30, "B", "Contact person", "the person who signs this form and approves work")
        y -= 34
        self.row(y, [("sig_name", "Full name and surname", .4), ("sig_id", "ID / passport no.", .3), ("sig_capacity", "Position (owner, director, manager)", .3)])
        y -= 34
        self.row(y, [("sig_cell", "Cell number", .25), ("order_whatsapp", "WhatsApp number that will receive orders", .35), ("sig_email", "Email address", .4)])
        y -= 28
        self.text(M, y + 2, "Best way to reach you", 7, color=MUTED)
        x = M + 92
        for key, lab in (("wa", "WhatsApp"), ("call", "Phone call"), ("email", "Email")):
            self.check(f"reach_{key}", lab, x, y - 1)
            x += 86
        y -= 38
        self.row(y, [("acc_name", "Accounts contact (if different)", .4), ("acc_cell", "Accounts cell number", .25), ("acc_email", "Accounts email (for invoices)", .35)])
        self.footer(initials=False)

    def page_order(self):
        self.small_header("Client Application & Service Agreement")
        y = self.section(H - 82, "C", "Your order", "tick what you are applying for")
        # packs table
        y -= 20
        cols = [M + 22, M + 150, M + 268, M + 372, M + 452]
        self.c.setFillColor(NAVY)
        self.c.roundRect(M, y - 5, CW, 17, 3, stroke=0, fill=1)
        for x, lab in zip(cols, ("PACK", "MADE FOR", "SETUP (ONCE-OFF)", "MONTHLY", "YEAR 1")):
            self.text(x, y, lab, 7.5, bold=True, color=white)
        y -= 21
        for i, (name, who, setup, monthly) in enumerate(PACKS):
            if i % 2 == 0:
                self.c.setFillColor(TINT)
                self.c.rect(M, y - 5, CW, 18, stroke=0, fill=1)
            self.check(f"pack_{i}", "", M + 5, y - 1)
            self.text(cols[0], y + 1, name, 9, bold=True)
            if name == "Vape Pro":
                tw = stringWidth(name, "Helvetica-Bold", 9)
                self.text(cols[0] + tw + 6, y + 1.5, "MOST POPULAR", 5.8, bold=True, color=VIOLET)
            self.text(cols[1], y + 1, who, 8.5, color=MUTED)
            self.text(cols[2], y + 1, zar(setup), 9)
            self.text(cols[3], y + 1, zar(monthly) + " / month", 9)
            self.text(cols[4], y + 1, zar(setup + 12 * monthly), 9, bold=True)
            y -= 18
        self.text(M, y + 2, "Year 1 = setup + 12 months. Every pack includes hosting, support and up to 5 free small edits a month. Pricing on packs is negotiable; the Quote confirms it.", 6.8, color=MUTED)

        # individual products
        y -= 20
        self.text(M, y, "Individual products", 9.5, bold=True)
        self.text(M + 98, y, "in addition to, or instead of, a pack (setup + monthly)", 7.5, color=MUTED)
        y -= 17
        half = (len(PRODUCTS) + 1) // 2
        colw = CW / 2
        top = y
        for i, (name, price) in enumerate(PRODUCTS):
            col, r = divmod(i, half)
            x = M + col * colw
            yy = top - r * 22
            self.check(f"prod_{i}", "", x, yy - 1)
            self.text(x + 15, yy + 3.5, f"{i + 1}. {name}", 8.3, bold=True)
            self.text(x + 15, yy - 5.5, price, 7.2, color=MUTED)
        y = top - half * 22 - 2

        self.text(M, y, "Optional extras", 9.5, bold=True)
        self.text(M + 78, y, "quoted on request", 7.5, color=MUTED)
        y -= 16
        for i, name in enumerate(EXTRAS):
            self.check(f"extra_{i}", name, M + (i % 2) * (CW / 2), y - (i // 2) * 16)
        y -= 16 + 64
        self.field("order_notes", "Special requirements, quantities (for example number of QR stands or social platforms) or negotiated terms", M, y, CW, 46, multiline=True)

        # agreed amounts
        y -= 46
        self.c.setFillColor(TINT)
        self.c.setStrokeColor(BLUE)
        self.c.setLineWidth(0.8)
        self.c.roundRect(M, y - 14, CW, 50, 5, stroke=1, fill=1)
        self.text(M + 10, y + 22, "AGREED AMOUNTS", 7.5, bold=True, color=BLUE)
        self.text(M + 96, y + 22, "taken from the Quote; these are the amounts this agreement is for", 7, color=MUTED)
        gap, x = 8, M + 10
        for name, lab, frac in (("agreed_setup", "Total setup (once-off)  R", .34), ("agreed_monthly", "Total monthly  R", .33), ("agreed_golive", "Target go-live date", .33)):
            w = (CW - 20 - 2 * gap) * frac
            self.f.textfield(name=name, tooltip=lab, x=x + 96, y=y - 8, width=w - 96, height=17, fontName="Helvetica", fontSize=9,
                             borderColor=LINE, fillColor=white, textColor=INK, borderWidth=0.6, forceBorder=True)
            self.text(x, y - 3, lab, 7.5)
            x += w + gap
        self.footer()

    def page_payment(self):
        self.small_header("Client Application & Service Agreement")
        y = self.section(H - 82, "D", "Registration fee and payment")
        y -= 44
        c = self.c
        c.setFillColor(NAVY)
        c.roundRect(M, y - 6, CW, 40, 5, stroke=0, fill=1)
        self.text(M + 12, y + 16, "REGISTRATION FEE", 7.5, bold=True, color=CYAN)
        self.text(M + 12, y + 2, f"R{REG_FEE} once-off, payable with this application. It opens your client account and covers onboarding.", 8.5, color=white)
        self.rtext(W - M - 12, y + 6, f"R{REG_FEE}", 20, bold=True, color=white)
        y -= 30
        self.text(M, y, "How will you pay the setup fee and monthly plan? (tick one)", 8.5, bold=True)
        y -= 17
        self.check("pay_standard", "Standard: 50% deposit of the setup fee before work starts, balance on delivery; monthly fee from go-live.", M, y)
        y -= 16
        self.check("pay_instalments", "3 instalments (packs only): setup fee in three equal payments, at start, 30 days and 60 days.", M, y)
        y -= 16
        self.check("pay_prepay", "Prepay 12 months: pay 10 monthly fees up front and get 2 months free, plus the setup fee.", M, y)
        y -= 38
        self.row(y, [("due_reg", "Registration fee  R", .2), ("due_setup", "Setup amount due now  R", .27),
                     ("due_monthly", "Monthly / prepay due now  R", .27), ("due_total", "TOTAL DUE ON SIGNING  R", .26)])
        y -= 34
        self.row(y, [("pay_day", "Monthly payment day (1st to 28th)", .3), ("pay_ref", "Payment reference to use", .35), ("pay_proof", "Proof of payment sent to (cell / email)", .35)])
        y -= 24
        self.text(M, y + 2, "Payment method", 7, color=MUTED)
        x = M + 72
        for key, lab in (("eft", "EFT"), ("cash", "Cash (receipt required)"), ("card", "Card"), ("other", "Other")):
            self.check(f"method_{key}", lab, x, y - 1)
            x += 62 if key != "cash" else 126
        y -= 18
        self.text(M, y, "Pay only into the bank account shown on your official WebRift invoice. WebRift will never ask you to pay into a personal account by WhatsApp message alone.", 7, color=MUTED)

        y = self.section(y - 26, "E", "What we need from you to start")
        y -= 18
        items = ["Logo (or ask us to make a simple one)", "Product or price list (Excel, photos or supplier sheet)",
                 "Opening hours and shop address", "WhatsApp number that will take orders",
                 "Photos of the shop and best sellers", "Access to your Google Business Profile, if one exists",
                 "Logins for existing social pages (if we are setting them up)", "A decision-maker who can approve within 48 hours"]
        for i, it in enumerate(items):
            col, r = i % 2, i // 2
            self.check(f"need_{i}", it, M + col * (CW / 2), y - r * 16)
        y -= 4 * 16 + 20
        self.row(y, [("domain_want", "Domain name you would like (e.g. yourshop.co.za)", .4), ("domain_have", "Domain you already own, and where it is registered", .6)])
        y -= 34
        self.row(y, [("mailboxes", "Email addresses you want (e.g. info@, orders@)", .5), ("hours", "Opening hours", .5)])

        y = self.section(y - 28, "F", "Age-restricted products", "complete only if you sell vape, tobacco or similar products")
        y -= 16
        decl = ["I confirm the business holds every licence or registration the law requires for the products it sells.",
                "I understand the 18+ Age Check on the website is a self-declaration by the visitor and is not proof of age.",
                "The business will check ID at collection or delivery and will not sell to anyone under 18.",
                "I understand WebRift does not run paid adverts or sales promotions for vape products, and may change a feature if the law or a platform's rules change."]
        for i, d in enumerate(decl):
            n = self.check(f"vape_decl_{i}", d, M, y, max_w=CW - 16)
            y -= 15.5 + (n - 1) * 10.5
        self.footer()

    def terms_layout(self):
        colw = (CW - 18) / 2
        top, bottom = H - 96, 70
        flow = []
        for head, clauses in TERMS:
            flow.append(Paragraph(head, H_STYLE))
            flow += [Paragraph(t, B_STYLE) for t in clauses]
        def place(items, bottom):
            pages, col, y = [[[], []]], 0, top
            for i, p in enumerate(items):
                _, ph = p.wrap(colw, 1000)
                need = ph + p.style.spaceBefore + p.style.spaceAfter
                # keep a heading with its first clause
                if p.style is H_STYLE and i + 1 < len(items):
                    need += items[i + 1].wrap(colw, 1000)[1]
                if y - need < bottom and y != top:
                    col += 1
                    y = top
                    if col > 1:
                        pages.append([[], []])
                        col = 0
                if y != top:
                    y -= p.style.spaceBefore
                pages[-1][col].append((p, y - ph))
                y -= ph + p.style.spaceAfter
            return pages

        pages = place(flow, bottom)
        # Balance the last page so the text ends level in both columns instead of leaving one empty.
        last = [p for col in pages[-1] for p, _ in col]
        total = sum(p.wrap(colw, 1000)[1] + p.style.spaceBefore + p.style.spaceAfter for p in last)
        for slack in range(10, 400, 10):
            trial = place(last, top - (total / 2 + slack))
            if len(trial) == 1:
                pages[-1] = trial[0]
                break
        return pages, colw

    def page_terms(self, cols, colw, first):
        self.small_header("Service Agreement: Terms and Conditions")
        if first:
            self.section(H - 82, "G", "Service agreement", "terms and conditions")
        else:
            self.text(M, H - 80, "Service agreement, continued", 8, color=MUTED)
        for ci, col in enumerate(cols):
            x = M + ci * (colw + 18)
            for p, y in col:
                p.drawOn(self.c, x, y)
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.5)
        low = min((y for col in cols for _, y in col), default=72)
        self.c.line(W / 2, max(72, low - 4), W / 2, H - 98)
        self.footer()

    def page_sign(self):
        self.small_header("Client Application & Service Agreement")
        y = self.section(H - 82, "H", "Consent, declaration and signatures")
        y -= 18
        self.text(M, y, "Personal information (POPIA)", 9, bold=True)
        y -= 16
        consents = [
            ("popia_process", "I consent to WebRift collecting and using the information in this form to assess the application, deliver the services and manage the account."),
            ("popia_verify", "I consent to WebRift verifying the business and contact details given in this form."),
            ("popia_marketing", "Optional: WebRift may send me news and offers by WhatsApp or email. I can opt out at any time."),
        ]
        for name, lab in consents:
            n = self.check(name, lab, M, y, max_w=CW - 16)
            y -= 15.5 + (n - 1) * 10.5
        self.text(M, y + 2, "WebRift keeps this information only as long as it is needed and deletes it on request, as set out in its privacy notice.", 7, color=MUTED)

        y -= 20
        self.text(M, y, "Declaration by the Client", 9, bold=True)
        y -= 13
        for line in ("By signing, I confirm that: (a) the information in this form is true and complete; (b) I am authorised to sign for the business named in",
                     f"Section A; (c) I have read and accept the service agreement in Section G; and (d) I agree to pay the R{REG_FEE} registration fee and the",
                     "amounts in the Quote and in Sections C and D."):
            self.text(M, y, line, 8.3)
            y -= 11.5

        def sig_block(y, prefix, heading, name_label, with_capacity):
            self.c.setFillColor(TINT)
            self.c.roundRect(M, y - 104, CW, 122, 5, stroke=0, fill=1)
            self.text(M + 10, y + 4, heading, 8, bold=True, color=BLUE)
            x, w = M + 10, CW - 20
            yy = y - 30
            specs = [(f"{prefix}_name", name_label, .45), (f"{prefix}_capacity", "Capacity / position", .3), (f"{prefix}_date", "Date", .25)] if with_capacity \
                else [(f"{prefix}_name", name_label, .5), (f"{prefix}_reg", "Legal name / registration or ID no. of WebRift's owner", .5)]
            xx = x
            for name, lab, frac in specs:
                fw = (w - 8 * (len(specs) - 1)) * frac
                self.field(name, lab, xx, yy, fw)
                xx += fw + 8
            yy -= 62
            self.text(x, yy + 44, "Signature", 7, color=MUTED)
            self.c.setFillColor(white)
            self.c.setStrokeColor(LINE)
            self.c.setLineWidth(0.6)
            self.c.roundRect(x, yy, w * .55, 40, 3, stroke=1, fill=1)
            fx = x + w * .55 + 8
            fw = w - w * .55 - 8
            if with_capacity:
                self.field(f"{prefix}_place", "Signed at (place)", fx, yy + 22, fw)
                self.field(f"{prefix}_witness", "Witness name (optional)", fx, yy - 6, fw)
            else:
                self.field(f"{prefix}_date", "Date", fx, yy + 22, fw)
                self.field(f"{prefix}_place", "Signed at (place)", fx, yy - 6, fw)

        y -= 22
        sig_block(y, "client", "FOR THE CLIENT", "Full name of signatory", True)
        y -= 142
        sig_block(y, "webrift", "FOR WEBRIFT  (accepted)", "Name of WebRift representative", False)

        y -= 132
        self.c.setStrokeColor(MUTED)
        self.c.setDash(3, 3)
        self.c.setLineWidth(0.6)
        self.c.roundRect(M, y - 62, CW, 78, 5, stroke=1, fill=0)
        self.c.setDash()
        self.text(M + 10, y + 3, "FOR OFFICE USE ONLY", 7.5, bold=True, color=MUTED)
        x = M + 10
        for name, lab, frac in (("off_reg_paid", "Registration fee received (date)", .26), ("off_receipt", "Receipt / invoice no.", .22),
                                ("off_deposit", "Deposit received  R", .22), ("off_client_no", "Client no.", .3)):
            fw = (CW - 20 - 24) * frac
            self.field(name, lab, x, y - 26, fw)
            x += fw + 8
        self.check("off_approved", "Application approved", M + 10, y - 50)
        self.check("off_declined", "Declined (fee refunded)", M + 130, y - 50)
        self.field("off_by", "Processed by", M + 270, y - 56, CW - 280)
        self.footer(initials=False)

    def build(self):
        pages, colw = self.terms_layout()
        self.total = 3 + len(pages) + 1
        self.page_details(); self.next_page()
        self.page_order(); self.next_page()
        self.page_payment(); self.next_page()
        for i, cols in enumerate(pages):
            self.page_terms(cols, colw, i == 0); self.next_page()
        self.page_sign()
        self.c.save()
        return self.total


if __name__ == "__main__":
    n = Form(OUT).build()
    print(f"wrote {OUT} ({n} pages)")
