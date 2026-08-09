import os
from base_styles import DocumentGenerator

def add_exec_summary(doc):
    doc.add_heading_1("1. Executive Summary")
    doc.add_body_text(
        "The following document outlines the comprehensive Information Architecture (IA) and Functional Specification "
        "for the Phase 01 website build of Knowith Capital. As an AMFI-registered Mutual Fund Distributor (MFD), "
        "Knowith Capital requires a premium, compliant, and highly functional digital presence that instills trust, "
        "educates prospective investors, and clearly delineates the wealth solutions offered."
    )
    doc.add_body_text(
        "This specification details the structural blueprint of the website, including sitemap definitions, user journey mappings, "
        "wireframe-level functional descriptions for each page, and technical requirements. It acts as the definitive source of truth "
        "for both the design and engineering teams to execute a unified vision that aligns with Knowith Capital's strategic business objectives."
    )
    doc.add_heading_3("1.1 Project Context")
    doc.add_body_text(
        "The Indian mutual fund distribution landscape is undergoing a digital transformation. HNIs and informed investors now demand "
        "seamless digital experiences alongside personalized offline relationship management. Knowith Capital's existing digital footprint "
        "does not reflect its premium positioning. The new Phase 01 website aims to bridge this gap, serving as a powerful institutional "
        "brand asset and lead generation engine."
    )
    doc.add_heading_3("1.2 Scope & Approach")
    doc.add_body_text(
        "This phase focuses exclusively on the public-facing corporate website and content marketing infrastructure (Insights Hub). "
        "The approach follows a mobile-first, performance-oriented paradigm, ensuring that the architecture is scalable and ready to "
        "integrate with future transactional portals and AI-driven functionalities (Phase 02+)."
    )
    doc.add_heading_3("1.3 Key Deliverables")
    doc.add_bullet_list([
        "Comprehensive Information Architecture & Sitemap",
        "Detailed User Personas & Journey Maps",
        "Page-by-Page Functional Specifications",
        "SEO, Performance, and Security Blueprints",
        "Future Module Integration Roadmap"
    ])
    doc.add_page_break()

def add_project_overview(doc):
    doc.add_heading_1("2. Project Overview")
    doc.add_heading_2("2.1 Client Background")
    doc.add_body_text(
        "Knowith Capital is an established Mutual Fund Distributor (MFD) offering curated mutual fund distribution services "
        "and comprehensive investment support. Catering primarily to High Net Worth Individuals (HNIs), NRIs, and affluent professionals, "
        "Knowith prioritizes research-driven insights and a highly personalized client engagement model."
    )
    doc.add_heading_2("2.2 Industry Context")
    doc.add_body_text(
        "The Indian mutual fund industry continues to witness exponential growth in AUM and retail participation. However, the market "
        "is bifurcating between discount/DIY execution platforms and premium relationship-led distribution models. Knowith Capital operates "
        "in the latter segment, where trust, deep research, and high-touch support are paramount differentiators."
    )
    doc.add_heading_2("2.3 Regulatory Positioning")
    doc.add_callout_box(
        "Compliance Mandate",
        "As an AMFI-registered MFD, Knowith Capital must strictly adhere to regulatory guidelines regarding marketing nomenclature. "
        "The platform must consistently communicate its role as a distributor, explicitly avoiding terms such as 'Investment Advisor' or 'Advisory Services'.",
        box_type="important"
    )
    doc.add_heading_2("2.4 Phase 01 Scope")
    doc.add_body_text(
        "Phase 01 encompasses the design, development, and deployment of a static/CMS-driven marketing website. "
        "It includes the home page, firm overview, investment philosophy, detailed service pages, a robust insights/research hub, "
        "and compliance-mandated legal sections. Authentication and transactional capabilities are explicitly deferred to Phase 02."
    )
    doc.add_page_break()

def add_objectives(doc):
    doc.add_heading_1("3. Objectives")
    
    doc.add_heading_2("3.1 Business Objectives")
    doc.add_keyed_bullet_list([
        ("Brand Credibility", "Establish Knowith Capital as a premium, institutional-grade mutual fund distributor."),
        ("Lead Generation", "Capture high-intent investor inquiries through strategic placement of conversion funnels."),
        ("Thought Leadership", "Position the firm as a knowledge leader via the 'Insights Hub' featuring market commentary and research notes.")
    ])
    
    doc.add_heading_2("3.2 Technical Objectives")
    doc.add_keyed_bullet_list([
        ("Performance", "Achieve exceptional load times (LCP < 2.5s) to reduce bounce rates and improve user retention."),
        ("Scalability", "Implement an architecture (e.g., Jamstack) that can seamlessly scale with traffic surges without infrastructure bottlenecks."),
        ("SEO Optimization", "Ensure perfect technical SEO out-of-the-box to capture organic search traffic for mutual fund distribution queries."),
        ("Future-Proofing", "Design the underlying data structures and URL routing to support Phase 02 dashboard integrations.")
    ])
    
    doc.add_heading_2("3.3 User Objectives")
    doc.add_keyed_bullet_list([
        ("Trust & Reassurance", "Provide prospective clients with clear, transparent information about processes, leadership, and regulatory standing."),
        ("Education", "Enable users to consume complex market insights in a highly readable, accessible format."),
        ("Ease of Use", "Offer intuitive navigation and frictionless contact mechanisms across all device types.")
    ])
    doc.add_page_break()

def add_website_vision(doc):
    doc.add_heading_1("4. Website Vision")
    doc.add_body_text(
        "The new Knowith Capital digital presence must evoke a sense of heritage, precision, and forward-thinking expertise. "
        "It should depart from the cluttered, transactional aesthetics typical of mass-market financial platforms, leaning instead "
        "towards a bespoke, editorial, and minimalist design language."
    )
    doc.add_heading_2("4.1 Core Attributes")
    doc.add_bullet_list([
        "Premium: High-quality typography, ample whitespace, and subtle interactions.",
        "Minimalist: Content-first approach with zero cognitive overload.",
        "Global: A design aesthetic that appeals to NRIs and global investors.",
        "Trustworthy: Prominent compliance badges, transparent processes, and accessible legal documentation.",
        "Research-Driven: Editorial layout for insights that rivals top-tier financial publications."
    ])
    doc.add_heading_2("4.2 Design Inspirations")
    doc.add_professional_table(
        ["Reference Project", "Attribute to Emulate", "Rationale"],
        [
            ["Ionic Wealth", "Layout & Grid", "Structured, authoritative, and clean layout patterns."],
            ["Pet Financial", "Compliance Integration", "Seamless blending of regulatory text without compromising aesthetics."],
            ["Ocean", "Information Hierarchy", "Clear, step-by-step unrolling of complex service offerings."],
            ["Fineprint", "Typography & Communication", "Editorial, highly legible typography suitable for long-form research."],
            ["FundsBazaar", "Portal Architecture", "Used as a baseline for structuring future login and dashboard entry points."]
        ]
    )
    doc.add_page_break()

def add_user_personas(doc):
    doc.add_heading_1("5. User Personas")
    doc.add_body_text("The Information Architecture is designed to serve five distinct primary user archetypes.")
    
    personas = [
        {
            "Name": "Priya", "Profile": "35, Urban Professional HNI", 
            "Goals": "Wealth creation, tax efficiency, time-saving solutions",
            "Pain Points": "Overwhelmed by choices, lacks time for research",
            "Behavior": "Mobile-first, skims content, values quick summaries",
            "Expectations": "Clear, concise service offerings and easy contact options."
        },
        {
            "Name": "Rajesh", "Profile": "58, Pre-Retirement NRI", 
            "Goals": "Capital preservation, repatriation rules understanding",
            "Pain Points": "Distance from India, complex NRI compliance",
            "Behavior": "Desktop user, reads detailed FAQs and research",
            "Expectations": "Trust indicators, global accessibility, clear NRI processes."
        },
        {
            "Name": "Anika", "Profile": "27, Young First-Time Investor", 
            "Goals": "Start SIPs, learn investing basics",
            "Pain Points": "Intimidated by jargon, fear of market volatility",
            "Behavior": "Social media driven, uses calculators, consumes educational content",
            "Expectations": "Glossary, educational articles, transparent onboarding."
        },
        {
            "Name": "Suresh", "Profile": "48, Experienced MF Investor", 
            "Goals": "Portfolio optimization, access to niche funds",
            "Pain Points": "Generic advice, lack of deep market insights",
            "Behavior": "Seeks market commentary, compares firm philosophies",
            "Expectations": "In-depth research notes, sophisticated investment philosophy."
        },
        {
            "Name": "Meera", "Profile": "42, Business Owner", 
            "Goals": "Corporate treasury management, liquid fund deployments",
            "Pain Points": "Liquidity constraints, tax implications for business",
            "Behavior": "Direct communication, relationship-focused",
            "Expectations": "B2B tailored messaging, direct contact with leadership."
        }
    ]
    
    for p in personas:
        doc.add_heading_3(f"Persona: {p['Name']} ({p['Profile']})")
        doc.add_info_table([
            ("Primary Goals", p['Goals']),
            ("Pain Points", p['Pain Points']),
            ("Digital Behavior", p['Behavior']),
            ("Platform Expectations", p['Expectations'])
        ])
    doc.add_page_break()

def add_sitemap(doc):
    doc.add_heading_1("6. Complete Sitemap")
    doc.add_body_text("The following represents the hierarchical structure of the Phase 01 website.")
    
    sitemap_data = [
        ["Level 1", "Level 2", "Level 3", "URL Slug"],
        ["Home", "-", "-", "/"],
        ["About", "Our Story", "-", "/about/our-story"],
        ["About", "Leadership", "-", "/about/leadership"],
        ["About", "Why Knowith", "-", "/about/why-knowith"],
        ["Philosophy", "-", "-", "/investment-philosophy"],
        ["Process", "-", "-", "/our-process"],
        ["Services", "Equity Funds", "-", "/services/equity-funds"],
        ["Services", "Debt Funds", "-", "/services/debt-funds"],
        ["Services", "Hybrid Funds", "-", "/services/hybrid-funds"],
        ["Services", "SIP Strategies", "-", "/services/sip-strategies"],
        ["Insights", "Market Commentary", "-", "/insights/market-commentary"],
        ["Insights", "Research Notes", "-", "/insights/research-notes"],
        ["Resources", "FAQs", "-", "/resources/faqs"],
        ["Resources", "Glossary", "-", "/resources/glossary"],
        ["Resources", "Calculators", "-", "/resources/calculators"],
        ["Contact", "-", "-", "/contact"],
        ["Legal", "Privacy Policy", "-", "/privacy-policy"],
        ["Legal", "Terms of Use", "-", "/terms-of-use"],
        ["Legal", "Disclaimer", "-", "/disclaimer"],
        ["Login (Portal)", "-", "-", "/login (External)"]
    ]
    
    doc.add_professional_table(sitemap_data[0], sitemap_data[1:])
    doc.add_page_break()

def add_navigation_architecture(doc):
    doc.add_heading_1("7. Navigation Architecture")
    
    doc.add_heading_2("7.1 Primary Navigation")
    doc.add_body_text("The main header navigation will be persistent across all pages and will feature a mega-menu dropdown for complex sections.")
    doc.add_bullet_list([
        "About (Dropdown: Story, Leadership, Why Knowith)",
        "Philosophy",
        "Services (Dropdown: Equity, Debt, Hybrid, SIP)",
        "Insights",
        "Resources"
    ])
    
    doc.add_heading_2("7.2 Secondary Navigation / Utility Bar")
    doc.add_body_text("A subtle top bar above the primary navigation containing:")
    doc.add_bullet_list([
        "Contact Us",
        "AMFI Registration Number (ARN-XXXXX)",
        "Client Login (CTA Button)"
    ])
    
    doc.add_heading_2("7.3 Mobile Navigation Strategy")
    doc.add_body_text(
        "On viewports < 1024px, navigation collapses into a full-screen hamburger overlay. "
        "The overlay will prioritize the 'Client Login' and 'Contact Us' actions at the top or bottom of the menu for immediate accessibility."
    )
    doc.add_page_break()

def add_header_footer(doc):
    doc.add_heading_1("8. Header & Footer Specification")
    
    doc.add_heading_2("8.1 Header Specification")
    doc.add_info_table([
        ("Logo Placement", "Top left, linked to Home '/'"),
        ("Navigation Alignment", "Center-aligned (Desktop), Hamburger right-aligned (Mobile)"),
        ("Sticky Behavior", "Header becomes sticky upon scroll, slightly reducing in height and adding a subtle drop-shadow."),
        ("CTAs", "Primary 'Contact' button and 'Client Login' link on the right edge.")
    ])
    
    doc.add_heading_2("8.2 Footer Specification")
    doc.add_body_text("The footer operates as the ultimate safety net for navigation and compliance.")
    doc.add_info_table([
        ("Column 1 (Brand)", "Logo, Short description, AMFI ARN prominently displayed."),
        ("Column 2 (Links)", "Services & Approach quick links."),
        ("Column 3 (Links)", "Resources, FAQs, Insights."),
        ("Column 4 (Contact)", "Office Address, Phone, Email, Social Media Icons (LinkedIn, Twitter)."),
        ("Bottom Bar", "Copyright text, Privacy Policy, Terms of Use, Disclaimer links."),
        ("Compliance Block", "Mandatory AMFI distributor disclaimer text in a dedicated grey block.")
    ])
    doc.add_page_break()

def add_page_specs(doc):
    doc.add_heading_1("9. Page-by-Page Functional Specification")
    
    # Home
    doc.add_page_spec(
        page_name="Home",
        purpose="Primary entry point establishing brand identity and directing traffic.",
        business_goal="Generate trust, route users to services or contact.",
        user_goal="Understand who Knowith is and what they offer.",
        sections=[
            ("Hero Section", "Value proposition headline, secondary text clarifying MFD status, Primary CTA (Book Consultation), Background imagery/video."),
            ("Statistics Bar", "AUM, Active Clients, Years of Experience (dynamic or hardcoded)."),
            ("Philosophy Teaser", "Brief overview of the investment philosophy with link to full page."),
            ("Services Grid", "4-6 cards outlining core offerings with iconography."),
            ("Insights Preview", "Latest 3 articles dynamically pulled from CMS."),
            ("Testimonials/Logos", "Placeholder for client quotes or partner AMCs.")
        ],
        seo_info={"Title": "Knowith Capital | Premium Mutual Fund Distribution", "H1": "Curated Wealth Solutions for the Discerning Investor"}
    )
    
    # Services
    doc.add_page_spec(
        page_name="Services (Category)",
        purpose="Detail specific mutual fund distribution offerings.",
        business_goal="Educate clients on capabilities and generate leads.",
        user_goal="Determine if Knowith offers the required solutions.",
        sections=[
            ("Hero", "Service title and brief description."),
            ("Overview", "Detailed explanation of the asset class (e.g., Equity)."),
            ("Approach", "How Knowith selects funds in this category."),
            ("Target Audience", "Who this is suitable for (Risk profile)."),
            ("CTA", "Contextual contact form 'Discuss Equity Investments'")
        ],
        seo_info={"Title": "[Service Name] | Knowith Capital", "H1": "[Service Name]"}
    )
    
    # Insights Hub
    doc.add_page_spec(
        page_name="Insights Hub",
        purpose="Content repository for thought leadership.",
        business_goal="SEO traffic generation and brand authority.",
        user_goal="Read market commentary and research.",
        sections=[
            ("Featured Article", "Large hero layout for the latest/most important piece."),
            ("Filter Bar", "Category filters (Market Commentary, Research, Updates) and Search."),
            ("Article Grid", "Pagination or infinite scroll of article cards (Title, Date, Read Time, Excerpt)."),
            ("Newsletter Signup", "Email capture block.")
        ]
    )
    doc.add_page_break()

def add_homepage_deepdive(doc):
    doc.add_heading_1("10. Homepage Deep Dive (Wireframe Spec)")
    doc.add_body_text("Detailed architectural breakdown of the homepage layout from top to bottom.")
    
    components = [
        ("Section 1: Hero Banner", "Full width. Headline: H1 typography. Subtext detailing MFD role. Two buttons: 'Discover Our Process' (Primary), 'Client Portal' (Secondary)."),
        ("Section 2: Trust Indicators", "Horizontal band. Badges for AMFI Registration, BSE/NSE partner logos, Security certifications."),
        ("Section 3: The Knowith Edge", "3-column grid. Icons + Text: 'Research Backed', 'Personalized Support', 'Transparent Execution'."),
        ("Section 4: Our Solutions", "Staggered layout. Alternating image/text blocks for Wealth Creation, Tax Planning, Retirement."),
        ("Section 5: Latest Market Insights", "Cards layout. Dynamically fetched. Includes 'Read More' links."),
        ("Section 6: Final CTA", "Dark background block. 'Ready to begin your investment journey?' Lead capture form or mailto link.")
    ]
    
    for title, desc in components:
        doc.add_heading_3(title)
        doc.add_body_text(desc)
    doc.add_page_break()

def add_user_journeys(doc):
    doc.add_heading_1("11. User Journey Mapping")
    
    doc.add_heading_2("Journey 1: New Visitor Discovery")
    doc.add_bullet_list([
        "Entry: Organic Search -> Lands on Home Page.",
        "Action: Scrolls Home, clicks 'Our Process'.",
        "Action: Reads Process, clicks 'Investment Philosophy'.",
        "Conversion: Clicks 'Contact Us' in header, fills out lead form."
    ])
    
    doc.add_heading_2("Journey 2: Returning Investor (Information Seeking)")
    doc.add_bullet_list([
        "Entry: Email Newsletter link -> Lands on Insights Article.",
        "Action: Reads article, views 'Related Posts' at bottom.",
        "Action: Navigates to 'Debt Funds' service page via inline link.",
        "Conversion: Calls the office number listed in the footer."
    ])
    
    doc.add_page_break()

def add_future_architecture(doc):
    doc.add_heading_1("12. Future Architecture Reservations (Phase 02+)")
    doc.add_body_text("The IA is designed with specific placeholders to ensure seamless integration of future modules without requiring a site redesign.")
    
    future_items = [
        ("Investor Portal", "Reserved URL: /portal or portal.knowith.com. Entry points established in Header and Footer."),
        ("AI Chat Assistant", "Reserved UI space: Bottom right floating action button. Will integrate via a third-party script tag."),
        ("Portfolio Analyzer", "Reserved URL: /resources/analyzer. Will require authenticated sessions."),
        ("CRM Integration", "Forms currently routing to email will be updated to hit CRM Webhooks (e.g., Salesforce/HubSpot) via serverless functions.")
    ]
    
    for title, desc in future_items:
        doc.add_future_scope_box(title, desc)
    doc.add_page_break()

def add_technical_specs(doc):
    doc.add_heading_1("13. Forms & Data Capture")
    doc.add_heading_2("13.1 Contact Form Specification")
    doc.add_info_table([
        ("Full Name", "Text input, Required"),
        ("Email Address", "Email input, Required, Regex Validation"),
        ("Phone Number", "Tel input, Required, Country Code selector"),
        ("Inquiry Type", "Dropdown (New Investment, Existing Portfolio, General)"),
        ("Message", "Textarea, Optional"),
        ("Consent Checkbox", "Required for GDPR/DPDP Act compliance.")
    ])
    
    doc.add_heading_1("14. SEO Architecture")
    doc.add_bullet_list([
        "URL Structure: Clean, descriptive, lowercase slugs (e.g., /services/equity-funds).",
        "Schema Markup: Implementation of 'Organization', 'FinancialService', 'FAQPage', and 'Article' JSON-LD schemas.",
        "Sitemap & Robots: Autogenerated XML sitemap submitted to Google Search Console.",
        "Canonicalization: Self-referencing canonical tags on all core pages to prevent duplicate content issues."
    ])
    
    doc.add_heading_1("15. Performance Requirements")
    doc.add_keyed_bullet_list([
        ("Core Web Vitals", "LCP under 2.5s, FID under 100ms, CLS under 0.1."),
        ("Asset Optimization", "WebP image formats, lazy loading for off-screen images."),
        ("Caching", "Aggressive CDN edge caching for static assets.")
    ])
    
    doc.add_heading_1("16. Security Requirements")
    doc.add_bullet_list([
        "Enforced HTTPS via TLS 1.3.",
        "Strict Content Security Policy (CSP) headers.",
        "Anti-XSS and CSRF protection on all form submissions.",
        "Rate limiting on contact API endpoints to prevent spam."
    ])
    doc.add_page_break()

def add_appendix(doc):
    doc.add_heading_1("17. Accessibility & Responsive Behavior")
    doc.add_body_text("Targeting WCAG 2.1 AA Compliance.")
    doc.add_bullet_list([
        "Color contrast ratios verified against brand palette.",
        "ARIA labels on all interactive elements.",
        "Keyboard navigable menus and focus states.",
        "Fluid responsive design across breakpoints: Mobile (320px+), Tablet (768px+), Desktop (1024px+)."
    ])
    
    doc.add_heading_1("18. Technical Recommendations")
    doc.add_recommendation_box("Tech Stack", "We recommend a Jamstack approach using Next.js for the frontend, hosted on Vercel, paired with a headless CMS (e.g., Sanity or Strapi) for managing Insights and Service content.")
    
    doc.add_heading_1("19. Risk Register")
    doc.add_professional_table(
        ["Risk ID", "Description", "Impact", "Mitigation"],
        [
            ["R01", "Regulatory text misalignment", "High", "Legal review of all final copy before launch."],
            ["R02", "Scope creep into transactional features", "Medium", "Strict adherence to Phase 01 static boundaries."],
            ["R03", "Content bottleneck for Insights", "Medium", "Launch with 3-5 cornerstone articles, build pipeline."]
        ]
    )
    
    doc.add_heading_1("20. Out of Scope (Phase 01)")
    doc.add_bullet_list([
        "User authentication and profile management.",
        "Live portfolio data integration via RTA APIs.",
        "Complex financial planning calculators.",
        "AI-driven chat or research assistants."
    ])

def generate_doc01(output_dir):
    doc = DocumentGenerator(output_dir)
    
    # Front Matter
    doc.add_cover_page("Website Information Architecture & Functional Specification", "Knowith Capital Phase 01")
    doc.add_front_matter([
        ("1.0", "July 2026", "Strategy & Technology Consulting Division", "Initial Document Creation")
    ])
    doc.add_headers_footers("Website Information Architecture & Functional Specification")
    
    # Sections
    add_exec_summary(doc)
    add_project_overview(doc)
    add_objectives(doc)
    add_website_vision(doc)
    add_user_personas(doc)
    add_sitemap(doc)
    add_navigation_architecture(doc)
    add_header_footer(doc)
    add_page_specs(doc)
    add_homepage_deepdive(doc)
    add_user_journeys(doc)
    add_future_architecture(doc)
    add_technical_specs(doc)
    add_appendix(doc)
    
    filepath = doc.save("01_Information_Architecture_Functional_Specification.docx")
    print(f"Document generated at {filepath}")

if __name__ == "__main__":
    generate_doc01(os.path.dirname(os.path.abspath(__file__)))
