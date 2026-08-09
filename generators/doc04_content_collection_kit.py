import os
from base_styles import DocumentGenerator, ProjectInfo

def generate_doc04(output_dir):
    """
    Generates Document 04: Client Content Collection Kit.
    """
    doc = DocumentGenerator(output_dir)

    # 1. COVER PAGE & FRONT MATTER
    doc_title = "Client Content Collection Kit"
    doc_subtitle = "Comprehensive Content Intake & Asset Requirements"
    doc.add_cover_page(doc_title, doc_subtitle)
    
    versions = [
        ("1.0", ProjectInfo.get_date(), ProjectInfo.PREPARED_BY, "Initial Content Collection Kit — Baseline"),
        ("1.1", ProjectInfo.get_date(), "Project Management Office", "Added SEO and Compliance Checklists")
    ]
    doc.add_front_matter(versions)
    doc.add_headers_footers(doc_title)
    
    # 2. INTRODUCTION
    doc.add_heading_1("2. Introduction")
    doc.add_body_text(
        "This Client Content Collection Kit serves as the foundational artifact for gathering all necessary "
        "brand assets, copy, media, compliance texts, and technical information required for the seamless "
        "execution of the website development project. As a premium mutual fund distribution firm, Knowith "
        "Capital's digital presence must be impeccable. This document ensures that no detail is overlooked "
        "and that all client-supplied materials meet our stringent quality standards."
    )
    doc.add_note_box(
        "Purpose of this Kit",
        "To systematically collect, track, and validate all required inputs from the client prior to "
        "commencing the design and development phases. A complete content repository minimizes project "
        "delays and ensures brand consistency."
    )
    doc.add_heading_3("How to Use This Document")
    doc.add_bullet_list([
        "Review each section carefully with your internal stakeholders.",
        "Check off the 'Status' column as items are gathered (e.g., 'Pending', 'Provided', 'N/A').",
        "Upload all requested files into the designated secure cloud folder (link provided separately).",
        "Ensure all file names follow the naming conventions outlined in the Appendix.",
        "Return this completed document to the project management team."
    ])
    doc.add_heading_3("Timeline Expectations")
    doc.add_body_text(
        "To adhere to our proposed project timeline, all primary content must be submitted by the end of "
        "Week 2 of the project schedule. Delayed submissions will directly impact the go-live date."
    )
    doc.add_page_break()
    
    # 3. BRANDING ASSETS
    doc.add_heading_1("3. Branding Assets")
    doc.add_body_text(
        "Consistent and high-quality branding is paramount for building trust. Please provide the highest "
        "resolution files available. Vector formats (SVG, AI, EPS) are strictly preferred for logos to "
        "ensure scalability without quality loss."
    )
    brand_headers = ["Item", "Required", "Format", "Status", "Notes"]
    brand_rows = [
        ["Primary Logo", "Yes", "SVG, AI, or high-res PNG (transparent)", "", "Used on header, footer, etc."],
        ["Logo Variations", "Yes", "SVG, AI, or high-res PNG", "", "Horizontal, stacked, monochrome, white"],
        ["Brand Colors", "Yes", "HEX, RGB, CMYK values", "", "Primary, secondary, and accent colors"],
        ["Primary Fonts", "Yes", "TTF, OTF, or web font link", "", "For headings and body text"],
        ["Brand Guidelines", "If available", "PDF", "", "Official brand manual or style guide"],
        ["Favicon / App Icon", "Yes", "PNG (512x512) or SVG", "", "For browser tabs and mobile shortcuts"],
        ["Social Profile Images", "If available", "PNG or JPG", "", "For consistent cross-platform branding"]
    ]
    doc.add_professional_table(brand_headers, brand_rows)
    doc.add_recommendation_box(
        "Logo Quality",
        "If you do not have vector files (SVG/EPS), please provide PNG files that are at least 2000px wide "
        "with a transparent background. Avoid sending logos embedded in Word documents."
    )
    
    # 4. COMPANY INFORMATION
    doc.add_heading_1("4. Company Information")
    doc.add_body_text(
        "Accurate and comprehensive company information establishes credibility and is legally required "
        "for regulatory compliance. This information will populate the 'About Us' page, footer, and contact sections."
    )
    company_headers = ["Item", "Required", "Format", "Status", "Notes"]
    company_rows = [
        ["Legal Company Name", "Yes", "Text", "", "Exact registered name"],
        ["Trading Name / DBA", "Yes", "Text", "", "Name used in marketing (if different)"],
        ["AMFI ARN Number", "Yes", "Text", "", "Mandatory for compliance display"],
        ["Date of Incorporation", "Yes", "Text (Date)", "", ""],
        ["Registered Office", "Yes", "Text (Address)", "", "Full legal address with PIN"],
        ["Operational Office", "Yes", "Text (Address)", "", "If different from registered office"],
        ["Company History", "Yes", "Text (300-500 words)", "", "Founding story and milestones"],
        ["Mission Statement", "Yes", "Text", "", "Core purpose"],
        ["Vision Statement", "Yes", "Text", "", "Future aspiration"],
        ["Core Values", "Yes", "Text (3-7 items)", "", "Include brief descriptions for each"],
        ["Unique Selling Props", "Yes", "Text (3-5 items)", "", "What differentiates Knowith Capital"],
        ["Years of Experience", "Yes", "Number", "", "Cumulative or firm-level"],
        ["Clients Served", "If disclosable", "Number", "", "Approximate active client base"],
        ["AUM / Distribution", "If disclosable", "Number", "", "Assets under distribution"],
        ["Partner Fund Houses", "Yes", "Number / List", "", "AMC partnerships"],
        ["Awards / Recognition", "If available", "Text / Images", "", "Include years and granting bodies"]
    ]
    doc.add_professional_table(company_headers, company_rows)
    doc.add_important_box(
        "Regulatory Accuracy",
        "Ensure the AMFI ARN number provided is currently active. The registered office address must exactly "
        "match the address on file with regulatory authorities."
    )
    doc.add_page_break()
    
    # 5. FOUNDER & LEADERSHIP
    doc.add_heading_1("5. Founder & Leadership")
    doc.add_body_text(
        "Highlighting the experience and expertise of the leadership team builds immense trust with potential "
        "investors. Please provide the following for the founder and up to 4 key leadership figures."
    )
    leader_headers = ["Item", "Required", "Format", "Status", "Notes"]
    leader_rows = [
        ["Full Name", "Yes", "Text", "", "As it should appear on site"],
        ["Designation / Title", "Yes", "Text", "", "e.g., Founder & Principal Distributor"],
        ["Professional Bio", "Yes", "Text (200-400 words)", "", "Focus on expertise and investor outcomes"],
        ["Education", "Yes", "Text", "", "Degrees and institutions"],
        ["Certifications", "Yes", "Text", "", "AMFI, NISM, CFP, CFA, etc."],
        ["Years of Experience", "Yes", "Number", "", "Total industry experience"],
        ["Headshot Photo", "Yes", "High-res JPG/PNG", "", "Professional attire, neutral background"],
        ["LinkedIn URL", "Yes", "URL", "", "Link to professional profile"],
        ["Quote / Philosophy", "Optional", "Text (1-2 sentences)", "", "Personal investment philosophy"]
    ]
    doc.add_professional_table(leader_headers, leader_rows)
    doc.add_recommendation_box(
        "Photography Consistency",
        "For a premium look, ensure all leadership headshots have consistent lighting, backgrounds, and "
        "crop levels. If new headshots are needed, we can provide guidelines for your photographer."
    )
    
    # 6. TEAM INFORMATION
    doc.add_heading_1("6. Team Information")
    doc.add_body_text(
        "Beyond leadership, showcasing the broader team highlights the firm's capacity and operational strength. "
        "Decide which team members (e.g., research analysts, relationship managers) should be featured."
    )
    team_headers = ["Item", "Required", "Format", "Status", "Notes"]
    team_rows = [
        ["Full Name", "Yes", "Text", "", ""],
        ["Designation", "Yes", "Text", "", ""],
        ["Department", "Yes", "Text", "", "e.g., Research, Client Relations"],
        ["Brief Bio", "Yes", "Text (50-100 words)", "", "Short overview of role and background"],
        ["Headshot Photo", "Yes", "High-res JPG/PNG", "", "Consistent with leadership photos"],
        ["Qualifications", "Yes", "Text", "", "Key degrees or certifications"]
    ]
    doc.add_professional_table(team_headers, team_rows)
    
    # 7. OFFICE & FACILITIES
    doc.add_heading_1("7. Office & Facilities")
    doc.add_body_text(
        "Providing details and visuals of your physical office space reassures clients of the firm's established "
        "presence and professionalism."
    )
    office_headers = ["Item", "Required", "Format", "Status", "Notes"]
    office_rows = [
        ["Complete Address", "Yes", "Text", "", "Include building name, floor, street"],
        ["Google Maps Link", "Yes", "URL", "", "Link to exact pin location"],
        ["Office Photos", "Yes", "High-res JPG", "", "Reception, meeting rooms, exterior (Min 5)"],
        ["Virtual Tour Video", "If available", "MP4 or YouTube URL", "", ""],
        ["Business Hours", "Yes", "Text", "", "e.g., Mon-Fri 9 AM - 6 PM"],
        ["Directions / Landmarks", "Yes", "Text", "", "Helpful text for visitors"]
    ]
    doc.add_professional_table(office_headers, office_rows)
    doc.add_page_break()
    
    # 8. SERVICES & OFFERINGS
    doc.add_heading_1("8. Services & Offerings")
    doc.add_body_text(
        "Detailed descriptions of your service offerings are critical for both user understanding and SEO. "
        "Please provide the following details for EVERY service you wish to feature (e.g., Equity MFs, Debt MFs, "
        "SIPs, Goal-Based Planning Support)."
    )
    service_headers = ["Item", "Required", "Format", "Status", "Notes"]
    service_rows = [
        ["Service Name", "Yes", "Text", "", "e.g., SIP Investments"],
        ["Description", "Yes", "Text (150-300 words)", "", "Clear, benefit-driven explanation"],
        ["Target Audience", "Yes", "Text", "", "Who is this best for?"],
        ["Key Benefits", "Yes", "Text (Bullet points)", "", "3-5 primary advantages"],
        ["Min. Investment", "If applicable", "Text / Number", "", "e.g., starting at ₹500/month"],
        ["Related Funds", "Optional", "Text", "", "Categories typically recommended"],
        ["Unique Methodology", "Optional", "Text", "", "How Knowith approaches this differently"]
    ]
    doc.add_professional_table(service_headers, service_rows)
    
    # 9. INVESTMENT PHILOSOPHY
    doc.add_heading_1("9. Investment Philosophy")
    doc.add_body_text(
        "Your investment philosophy is the intellectual core of your firm. It explains how you evaluate funds, "
        "manage risk, and guide client expectations."
    )
    phil_headers = ["Item", "Required", "Format", "Status", "Notes"]
    phil_rows = [
        ["Philosophy Statement", "Yes", "Text (300-500 words)", "", "The overarching approach"],
        ["Core Principles", "Yes", "Text (Bullets)", "", "e.g., Long-term focus, diversification"],
        ["Fund Selection Method", "Yes", "Text", "", "How you choose AMC partners and schemes"],
        ["Risk Management", "Yes", "Text", "", "How downside risk is addressed"],
        ["Research Methodology", "Yes", "Text", "", "Quantitative vs Qualitative balance"],
        ["Differentiator", "Yes", "Text", "", "Why your approach yields better outcomes"]
    ]
    doc.add_professional_table(phil_headers, phil_rows)
    doc.add_page_break()
    
    # 10. RESEARCH & INSIGHTS CONTENT
    doc.add_heading_1("10. Research & Insights Content")
    doc.add_body_text(
        "Thought leadership content drives organic traffic and demonstrates expertise. We need to inventory "
        "existing content and establish a pipeline for the new site."
    )
    research_headers = ["Item", "Required", "Format", "Status", "Notes"]
    research_rows = [
        ["Existing Articles/Blogs", "If applicable", "URLs or Word Docs", "", "List of pieces to migrate"],
        ["Market Commentary", "If applicable", "PDF / Text", "", "Recent macro or market views"],
        ["Research Reports", "If applicable", "PDF", "", "In-depth analysis reports"],
        ["Presentations", "If applicable", "PPTX / PDF", "", "Slide decks for investors"],
        ["Video Content", "If applicable", "YouTube URLs", "", "Market updates, educational vids"],
        ["Newsletter Archives", "If applicable", "HTML / PDF", "", "Past email newsletters"],
        ["Planned Topics", "Yes", "Text (List)", "", "First 10 topics to be written post-launch"],
        ["Publishing Frequency", "Yes", "Text", "", "e.g., Weekly, Bi-weekly"],
        ["Primary Authors", "Yes", "Text (Names)", "", "Who will write the content internally"]
    ]
    doc.add_professional_table(research_headers, research_rows)
    
    # 11. MEDIA & VISUALS
    doc.add_heading_1("11. Media & Visuals")
    doc.add_body_text(
        "High-quality, authentic imagery performs vastly better than stock photos. Please provide raw, "
        "unedited high-resolution files where possible."
    )
    media_headers = ["Item", "Required", "Format", "Status", "Notes"]
    media_rows = [
        ["Office Photos", "Yes", "JPG/PNG (Min 2000px)", "", "Exterior, interior, signage"],
        ["Team Photos", "Yes", "JPG/PNG (Min 2000px)", "", "Individual headshots and group shots"],
        ["Event Photographs", "If available", "JPG/PNG", "", "Seminars, awards, team outings"],
        ["Client Interactions", "If available", "JPG/PNG", "", "Must have client consent"],
        ["Infographics/Charts", "If available", "SVG or High-res PNG", "", "Proprietary process graphics"]
    ]
    doc.add_professional_table(media_headers, media_rows)
    
    # 12. CLIENT TESTIMONIALS & SOCIAL PROOF
    doc.add_heading_1("12. Client Testimonials & Social Proof")
    doc.add_body_text(
        "Social proof is a primary driver of conversion. Testimonials must be authentic and verifiable."
    )
    test_headers = ["Item", "Required", "Format", "Status", "Notes"]
    test_rows = [
        ["Written Testimonials", "Yes", "Text", "", "Min 3-5. Include name, role, company"],
        ["Client Photos", "If available", "JPG/PNG", "", "With explicit written consent"],
        ["Google Reviews", "Yes", "URL", "", "Link to Google My Business profile"],
        ["Industry Recognition", "If available", "Text / Logos", "", "Awards, rankings, features"],
        ["Media Mentions", "If available", "URLs / PDFs", "", "Press coverage"],
        ["AMC Empanelments", "Yes", "List / Logos", "", "Fund houses you are partnered with"]
    ]
    doc.add_professional_table(test_headers, test_rows)
    doc.add_important_box(
        "Testimonial Compliance",
        "Ensure all testimonials comply with AMFI and SEBI guidelines regarding the projection of returns "
        "and promises of performance. Testimonials should focus on service quality and relationship, not "
        "specific percentage returns."
    )
    doc.add_page_break()
    
    # 13. LEGAL & COMPLIANCE
    doc.add_heading_1("13. Legal & Compliance")
    doc.add_body_text(
        "As a registered financial entity, strict adherence to compliance documentation is non-negotiable. "
        "Your legal team must review these items."
    )
    legal_headers = ["Item", "Required", "Format", "Status", "Notes"]
    legal_rows = [
        ["Privacy Policy", "Yes", "Word Doc", "", "Must cover data collection via website"],
        ["Terms of Service", "Yes", "Word Doc", "", "Website usage terms"],
        ["Standard Disclaimers", "Yes", "Word Doc", "", "Market risk, performance disclaimers"],
        ["AMFI Registration", "Yes", "Text / PDF", "", "Registration details and validity"],
        ["SEBI Statements", "If applicable", "Word Doc", "", "Compliance statements if applicable"],
        ["Risk Disclosure", "Yes", "Word Doc", "", "Detailed risk documentation"],
        ["KYC Requirements", "Yes", "Word Doc", "", "Text explaining KYC process to users"],
        ["Investor Charter", "Yes", "PDF / Link", "", "Mandated by regulators"],
        ["Grievance Officer", "Yes", "Text", "", "Name, email, phone, address"],
        ["Compliance Officer", "Yes", "Text", "", "Name, email, phone"]
    ]
    doc.add_professional_table(legal_headers, legal_rows)
    doc.add_warning_box(
        "Mandatory Disclaimers",
        "The standard disclaimer 'Mutual Fund investments are subject to market risks, read all scheme related "
        "documents carefully' must be provided in the exact phrasing required by AMFI."
    )
    
    # 14. CONTACT INFORMATION
    doc.add_heading_1("14. Contact Information")
    doc.add_body_text(
        "Ensure all provided contact channels are actively monitored. This information powers the contact page, "
        "header, and footer."
    )
    contact_headers = ["Item", "Required", "Format", "Status", "Notes"]
    contact_rows = [
        ["Primary Phone", "Yes", "Text", "", "Main business line"],
        ["Secondary Phone", "Optional", "Text", "", "Alternate or toll-free"],
        ["Primary Email", "Yes", "Text", "", "e.g., info@knowith.com"],
        ["Support Email", "Yes", "Text", "", "e.g., support@knowith.com"],
        ["WhatsApp Number", "Yes", "Text", "", "Business WhatsApp number for chat integration"],
        ["Meeting Link", "If applicable", "URL", "", "Calendly or similar booking link"],
        ["Business Hours", "Yes", "Text", "", "Operational days and timings"],
        ["Emergency Contact", "Optional", "Text", "", "After-hours support"],
        ["Response Time SLA", "Yes", "Text", "", "e.g., 'We respond within 24 hours'"]
    ]
    doc.add_professional_table(contact_headers, contact_rows)
    doc.add_page_break()
    
    # 15. SOCIAL MEDIA
    doc.add_heading_1("15. Social Media")
    doc.add_body_text(
        "Links to active social media profiles build ecosystem connectivity."
    )
    social_headers = ["Item", "Required", "Format", "Status", "Notes"]
    social_rows = [
        ["LinkedIn Page", "Yes", "URL", "", "Company profile URL"],
        ["Twitter / X", "If active", "URL", "", "Handle URL"],
        ["YouTube Channel", "If active", "URL", "", "Channel URL"],
        ["Instagram", "If active", "URL", "", "Profile URL"],
        ["Facebook Page", "If active", "URL", "", "Page URL"],
        ["Posting Frequency", "Yes", "Text", "", "Commitment level for new content"]
    ]
    doc.add_professional_table(social_headers, social_rows)
    
    # 16. ANALYTICS & TECHNICAL
    doc.add_heading_1("16. Analytics & Technical")
    doc.add_body_text(
        "Technical prerequisites required for deploying the site and migrating existing data."
    )
    tech_headers = ["Item", "Required", "Format", "Status", "Notes"]
    tech_rows = [
        ["Google Analytics ID", "Yes", "Text (G-XXXX)", "", "Existing property ID or we will create one"],
        ["Search Console", "If existing", "Access Grant", "", "Access to view current SEO status"],
        ["Current URL", "If existing", "URL", "", "e.g., www.knowithcapital.com"],
        ["Current Host", "If existing", "Text / Login", "", "e.g., AWS, HostGator, GoDaddy"],
        ["Current CMS", "If existing", "Text", "", "e.g., WordPress, Wix"],
        ["SEO Reports", "If existing", "PDF/Excel", "", "Historical ranking data"]
    ]
    doc.add_professional_table(tech_headers, tech_rows)
    
    # 17. DOMAIN & EMAIL
    doc.add_heading_1("17. Domain & Email")
    doc.add_body_text("Details regarding your web domain registration and corporate email hosting.")
    domain_headers = ["Item", "Required", "Format", "Status", "Notes"]
    domain_rows = [
        ["Primary Domain", "Yes", "Text", "", "Exact domain to be used"],
        ["Domain Registrar", "Yes", "Text / Login", "", "Where the domain is registered"],
        ["DNS Access", "Yes", "Credentials", "", "Needed to point domain to new servers"],
        ["SSL Status", "Yes", "Text", "", "Do you have an existing custom SSL?"],
        ["Email Host", "Yes", "Text", "", "e.g., Google Workspace, MS365"],
        ["Required Inboxes", "Yes", "List", "", "List of email addresses needed"]
    ]
    doc.add_professional_table(domain_headers, domain_rows)
    doc.add_page_break()
    
    # 18. EXISTING CONTENT AUDIT
    doc.add_heading_1("18. Existing Content Audit")
    doc.add_body_text(
        "If you are migrating from an older website, we must catalog all existing content to plan for 301 "
        "redirects and prevent SEO ranking drops."
    )
    audit_headers = ["Item", "Required", "Format", "Status", "Notes"]
    audit_rows = [
        ["Current Pages", "If applicable", "Excel/CSV", "", "List of all current URLs"],
        ["Content to Migrate", "If applicable", "Word Docs", "", "Text to be moved to new site"],
        ["Hosted PDFs", "If applicable", "ZIP file", "", "Existing downloads/forms"],
        ["Existing Forms", "If applicable", "List", "", "Current form fields and routing"],
        ["Content to Discard", "If applicable", "List", "", "What should NOT be migrated"],
        ["301 Redirects", "If applicable", "Excel/CSV", "", "Old URL to New URL mapping"]
    ]
    doc.add_professional_table(audit_headers, audit_rows)
    
    # 19. CALCULATORS & TOOLS
    doc.add_heading_1("19. Calculators & Tools")
    doc.add_body_text(
        "Financial calculators are high-engagement tools. Please provide the exact mathematical formulas and "
        "default assumptions you wish to use to ensure compliance."
    )
    calc_headers = ["Item", "Required", "Format", "Status", "Notes"]
    calc_rows = [
        ["SIP Calculator", "Yes", "Formula/Excel", "", "Expected ROI default, max tenure"],
        ["Lump Sum Calc", "Yes", "Formula/Excel", "", "Expected ROI default"],
        ["Goal Planner", "Yes", "Excel mockup", "", "Inputs: Goal type, cost, inflation rate"],
        ["Tax Savings Calc", "Optional", "Formula", "", "ELSS vs Traditional metrics"],
        ["Data Sources", "Yes", "Text/URL", "", "Where do assumption rates come from?"]
    ]
    doc.add_professional_table(calc_headers, calc_rows)
    doc.add_note_box(
        "Calculator Algorithms",
        "It is recommended to provide an Excel sheet demonstrating the exact input-to-output calculation "
        "you expect. Our developers will translate this Excel logic into JavaScript for the website."
    )
    
    # 20. FUTURE FEATURES INPUT
    doc.add_heading_1("20. Future Features Input")
    doc.add_body_text(
        "To ensure the Phase 01 architecture supports future scaling, please rank your priority for Phase 02 modules."
    )
    doc.add_bullet_list([
        "Investor Portal / Dashboard",
        "AI Chat Assistant",
        "Portfolio Analyzer",
        "Financial Health Analyzer",
        "Research Assistant",
        "AI Email Assistant",
        "WhatsApp Assistant",
        "CRM System",
        "Admin Dashboard",
        "Analytics Dashboard"
    ])
    doc.add_page_break()
    
    # 21. THIRD-PARTY INTEGRATIONS
    doc.add_heading_1("21. Third-Party Integrations")
    doc.add_body_text(
        "Details for external systems the website needs to communicate with."
    )
    integ_headers = ["Item", "Required", "Format", "Status", "Notes"]
    integ_rows = [
        ["BSE Star / MFU", "Yes", "API Docs/Keys", "", "Transaction execution engine"],
        ["Payment Gateway", "If applicable", "Keys", "", "Razorpay, BillDesk, etc."],
        ["KYC Provider", "Yes", "API Docs", "", "CKYC or similar vendor integration"],
        ["eSign Provider", "If applicable", "API Docs", "", "Digio, Leegality, etc."],
        ["SMS Gateway", "Yes", "API Keys", "", "For OTPs and alerts"],
        ["Email Marketing", "Yes", "API Keys", "", "Mailchimp, Brevo, etc."],
        ["Calendar Tool", "Yes", "Link / JS snippet", "", "Calendly integration"],
        ["Live Chat", "Optional", "JS snippet", "", "Intercom, Tawk.to, etc."]
    ]
    doc.add_professional_table(integ_headers, integ_rows)
    
    # 22. COMPETITOR INFORMATION
    doc.add_heading_1("22. Competitor Information")
    doc.add_body_text(
        "Understanding your competitive landscape helps our design team position Knowith Capital effectively."
    )
    comp_headers = ["Item", "Required", "Format", "Status", "Notes"]
    comp_rows = [
        ["Top 3 Competitors", "Yes", "URLs", "", "Direct business competitors"],
        ["Aspirational Sites", "Optional", "URLs", "", "Sites you like from any industry"],
        ["Liked Elements", "Yes", "Text", "", "What they do well"],
        ["Disliked Elements", "Yes", "Text", "", "What to avoid"],
        ["Key Differentiator", "Yes", "Text", "", "Why a client should choose you over them"]
    ]
    doc.add_professional_table(comp_headers, comp_rows)
    
    # 23. PROJECT PREFERENCES
    doc.add_heading_1("23. Project Preferences")
    doc.add_body_text("Logistical preferences for project execution and communication.")
    pref_headers = ["Item", "Required", "Format", "Status", "Notes"]
    pref_rows = [
        ["Comms Channel", "Yes", "Text", "", "e.g., Slack, Email, MS Teams"],
        ["Meeting Schedule", "Yes", "Text", "", "e.g., Weekly on Tuesdays at 10 AM"],
        ["Decision Makers", "Yes", "Names/Roles", "", "Who has final sign-off authority?"],
        ["Target Go-Live", "Yes", "Date", "", "Expected launch date"],
        ["Must-Have Features", "Yes", "List", "", "Non-negotiable for launch"],
        ["Nice-to-Have", "Optional", "List", "", "Can be deferred if timeline is tight"]
    ]
    doc.add_professional_table(pref_headers, pref_rows)
    doc.add_page_break()
    
    # 24. APPENDIX
    doc.add_heading_1("24. Appendix")
    
    doc.add_heading_2("File Naming Conventions")
    doc.add_body_text("To ensure organized file management, please adhere to the following naming conventions when uploading files:")
    doc.add_bullet_list([
        "Logos: knowith_logo_primary_dark.svg",
        "Headshots: team_firstname_lastname_headshot.jpg",
        "Office Photos: office_reception_01.jpg",
        "Documents: knowith_privacy_policy_v1.docx"
    ])
    
    doc.add_heading_2("Submission Format Guidelines")
    doc.add_body_text("Please upload all files to the provided secure cloud folder organized into the following subdirectories:")
    doc.add_bullet_list([
        "01_Branding",
        "02_Team_Photos",
        "03_Office_Photos",
        "04_Legal_Documents",
        "05_Content_Copy",
        "06_Technical_Keys"
    ])
    
    doc.add_heading_2("Contact for Queries")
    doc.add_body_text("If you have any questions regarding this kit or require assistance gathering materials, please contact:")
    doc.add_bullet_list([
        "Project Manager: Jane Doe (jane.doe@consultingfirm.com)",
        "Content Strategist: John Smith (john.smith@consultingfirm.com)"
    ])
    
    # Save the document
    output_path = doc.save("04_Client_Content_Collection_Kit.docx")
    return output_path

if __name__ == "__main__":
    generate_doc04(os.path.dirname(os.path.abspath(__file__)))
