import os
from base_styles import DocumentGenerator

def generate_doc03(output_dir):
    """
    Generates Document 03: Website Content Strategy.
    """
    doc = DocumentGenerator(output_dir)
    
    # 1. COVER PAGE & FRONT MATTER
    doc.add_cover_page(
        "Website Content Strategy",
        "Phase 01 — Content Architecture, Governance, and Page Specifications"
    )
    
    versions = [
        ("1.0", "July 24, 2026", "Strategy & Technology Consulting", "Initial Draft - Comprehensive Content Strategy"),
    ]
    doc.add_front_matter(versions)
    doc.add_headers_footers("Website Content Strategy")

    # 2. EXECUTIVE SUMMARY
    doc.add_heading_1("1. Executive Summary")
    doc.add_body_text(
        "The Website Content Strategy for Knowith Capital establishes the foundation for all digital communication, "
        "ensuring a consistent, authoritative, and regulatory-compliant brand voice across all touchpoints. "
        "As a Mutual Fund Distributor (MFD), Knowith Capital operates in a highly regulated environment where clarity, "
        "transparency, and education must supersede aggressive sales tactics."
    )
    doc.add_body_text(
        "This document outlines the overarching content philosophy, detailed page-by-page specifications, and a robust "
        "governance framework to manage content creation, review, and archival. Our approach prioritizes 'educating to empower', "
        "positioning Knowith Capital as a trusted distribution partner rather than a purely transactional entity."
    )
    
    key_principles = [
        ("Educate First", "Content must aim to enhance investor literacy and understanding of mutual fund mechanisms."),
        ("Absolute Compliance", "Strict adherence to AMFI/SEBI terminology guidelines, avoiding advisory vernacular."),
        ("Clarity and Accessibility", "Simplifying complex financial concepts without diluting their significance."),
        ("Trust through Transparency", "Clear disclosure of risks, past performance caveats, and operational processes.")
    ]
    doc.add_keyed_bullet_list(key_principles)
    doc.add_page_break()

    # 3. CONTENT STRATEGY OVERVIEW
    doc.add_heading_1("2. Content Strategy Overview")
    doc.add_heading_2("2.1 Content Philosophy")
    doc.add_body_text(
        "Our core philosophy is centered on building long-term trust through deep, actionable insights. "
        "Knowith Capital believes that an informed investor is a confident investor. By democratizing access to high-quality "
        "market intelligence and fund analysis, we foster an environment where clients feel supported throughout their investment execution journey."
    )
    
    doc.add_heading_2("2.2 Brand Voice and Tone")
    doc.add_body_text(
        "The voice of Knowith Capital is professional, approachable, and highly knowledgeable. "
        "It strikes a balance between institutional authority and personalized care. Tone variations include:"
    )
    doc.add_bullet_list([
        "Educational Content: Encouraging, clear, jargon-light.",
        "Market Commentary: Analytical, objective, forward-looking but measured.",
        "Service Descriptions: Direct, benefit-oriented, transparent.",
        "Regulatory Disclosures: Formal, precise, unambiguous."
    ])
    doc.add_important_box("Voice Guideline", "Never sound aggressive, overly promotional, or use 'hard-sell' tactics. Confidence is conveyed through quiet competence and data-backed insights.")
    
    doc.add_heading_2("2.3 Writing Style Guidelines")
    doc.add_body_text("To maintain readability and engagement, all content must adhere to the following stylistic rules:")
    style_guidelines = [
        ("Active Voice", "Always use active voice (e.g., 'Our team monitors market trends' instead of 'Market trends are monitored by our team')."),
        ("Concise Sentences", "Keep sentences under 25 words where possible to improve cognitive processing."),
        ("Jargon Management", "When industry terms (e.g., Alpha, Beta, Expense Ratio) are necessary, provide immediate context or link to the glossary."),
        ("Paragraph Length", "Limit paragraphs to 3-4 sentences for optimal web readability, particularly on mobile devices.")
    ]
    doc.add_keyed_bullet_list(style_guidelines)
    
    doc.add_heading_2("2.4 Content Pillars")
    pillars = [
        ["Trust Building", "Foundational pages, leadership bios, transparent process overviews, AMFI credentials."],
        ["Investor Education", "Glossary, beginner guides (e.g., What is SIP?), tax-saving explanations."],
        ["Market Intelligence", "Monthly market summaries, macroeconomic impact analyses, sector deep-dives."],
        ["Thought Leadership", "Original research notes, unique interpretations of regulatory changes, long-term outlooks."]
    ]
    doc.add_professional_table(["Content Pillar", "Focus Areas & Examples"], pillars)
    doc.add_page_break()

    # 4. REGULATORY CONTENT GUIDELINES
    doc.add_heading_1("3. Regulatory Content Guidelines")
    doc.add_body_text(
        "As an AMFI-registered Mutual Fund Distributor, Knowith Capital must strictly adhere to regulatory communication standards. "
        "This section defines the mandatory guardrails for all website content."
    )
    
    doc.add_heading_2("3.1 MFD-Safe Terminology Reference")
    doc.add_body_text("The following mapping must be used consistently across all platforms to ensure compliance:")
    term_mapping = [
        ["Prohibited Term (Advisory)", "Approved Term (Distribution)"],
        ["Financial Advisor", "Mutual Fund Distributor"],
        ["Wealth Manager", "Wealth Solutions Provider / Distribution Partner"],
        ["Investment Advice", "Investment Research / Insights"],
        ["Financial Planning", "Goal-Based Investment Solutions"],
        ["We advise you to...", "We provide research to help you..."],
        ["Client Portfolio Management", "Investment Support & Execution"]
    ]
    doc.add_professional_table(term_mapping[0], term_mapping[1:])
    
    doc.add_heading_2("3.2 Mandatory Disclaimers and Placement")
    doc.add_body_text("Disclaimers are not just legal requirements; they are tools for setting realistic investor expectations.")
    disclaimers = [
        ("Primary Risk Disclaimer", "'Mutual fund investments are subject to market risks, read all scheme related documents carefully.' Placement: Footer of every page, and immediately below any specific fund mention."),
        ("Past Performance Caveat", "'Past performance is not indicative of future returns.' Placement: On all pages displaying historical data, charts, or SIP calculator outputs."),
        ("MFD Status Notice", "'Knowith Capital is an AMFI-registered Mutual Fund Distributor (ARN-XXXXXX) and not a SEBI Registered Investment Advisor.' Placement: Footer, About Us page, and Contact page.")
    ]
    doc.add_keyed_bullet_list(disclaimers)
    doc.add_warning_box("Compliance Alert", "Never guarantee returns or use words like 'safe', 'secure', or 'guaranteed' when discussing market-linked products.")
    doc.add_page_break()

    # 5. CONTENT GOVERNANCE
    doc.add_heading_1("4. Content Governance")
    doc.add_body_text("A structured governance model ensures that content remains accurate, relevant, and compliant over time.")
    
    doc.add_heading_2("4.1 Content Creation Workflow")
    workflow = [
        ["Phase", "Action", "Owner", "SLA"],
        ["1. Ideation", "Keyword research, topic selection, brief creation", "Content Strategist", "Day 1-2"],
        ["2. Drafting", "Writing content following style and regulatory guides", "Subject Matter Expert", "Day 3-7"],
        ["3. Compliance Review", "Verification against MFD terminology and SEBI rules", "Compliance Officer", "Day 8-10"],
        ["4. Editorial Review", "Grammar, brand voice, SEO optimization check", "Managing Editor", "Day 11-12"],
        ["5. Publishing", "Uploading to CMS, formatting, adding metadata", "Web Master", "Day 13-14"]
    ]
    doc.add_professional_table(workflow[0], workflow[1:])
    
    doc.add_heading_2("4.2 Update Frequency and Archival Policy")
    doc.add_body_text("Stale content damages credibility. The following maintenance schedule will be enforced:")
    doc.add_bullet_list([
        "Core Pages (Home, About, Services): Reviewed bi-annually for accuracy and freshness.",
        "Market Insights: Published monthly; never altered post-publication unless factually incorrect.",
        "Regulatory Updates: Updated within 48 hours of any SEBI/AMFI notification.",
        "Archival Policy: Outdated market commentary (older than 3 years) will be moved to an 'Archive' section, tagged with a 'Historical Reference Only' banner."
    ])
    doc.add_page_break()

    # 6. PAGE-BY-PAGE CONTENT SPECIFICATION
    doc.add_heading_1("5. Page-by-Page Content Specification")
    doc.add_body_text("The following sections detail the precise content requirements, messaging hierarchy, and copy direction for every planned page.")
    
    # 6a) HOME PAGE
    doc.add_page_spec(
        page_name="Home Page",
        purpose="To serve as the digital storefront, establishing trust, explaining the MFD value proposition, and directing users to relevant services or insights.",
        business_goal="Generate qualified leads for investment execution; drive newsletter signups.",
        user_goal="Understand who Knowith Capital is, what they do, and whether they are trustworthy.",
        sections=[
            ("Hero Section", "Headline Option 1: 'Navigate Markets with Clarity and Confidence.'\nHeadline Option 2: 'Research-Driven Mutual Fund Distribution for the Discerning Investor.'\nHeadline Option 3: 'Your Partner in Wealth Solutions and Investment Execution.'\nSubheading: 'Leverage our institutional-grade research and seamless execution to build a resilient portfolio.'\nCTA: 'Start Your Journey' (Links to Process/Contact)."),
            ("Trust / Credibility Bar", "Showcase: 'AMFI Registered Distributor | 15+ Years Combined Experience | 500+ Families Served | INR XX Cr AUM Administered'"),
            ("Philosophy Teaser", "'We believe in discipline over emotion. Our research-driven approach ensures you are always informed, never sold to.' -> Link to 'Our Philosophy'"),
            ("Services Overview", "Cards for: Equity Funds (Long-term growth), Debt Funds (Stability), Goal-Based Solutions (Education, Retirement)."),
            ("Insights Preview", "Dynamic feed of the 3 most recent 'Knowith Research Notes'."),
            ("CTA Band", "Headline: 'Ready to elevate your investment strategy?'\nButton: 'Schedule a Consultation'\nSupporting Copy: 'Speak with our execution specialists to align your investments with your life goals.'")
        ],
        seo_info={"title": "Knowith Capital | Premium Mutual Fund Distribution & Research", "meta_description": "Knowith Capital offers research-driven mutual fund distribution and wealth solutions in India. Discover disciplined investment execution.", "h1": "Navigate Markets with Clarity and Confidence", "target_keywords": "Mutual fund distributor India, wealth solutions, investment execution, mutual fund research"}
    )
    doc.add_spacer()
    
    # 6b) ABOUT PAGE
    doc.add_page_spec(
        page_name="About Us",
        purpose="To humanize the brand, build credibility through founder/team backgrounds, and articulate the firm's mission.",
        business_goal="Increase conversion rates by establishing profound trust and professional authority.",
        user_goal="Verify the credentials, experience, and ethical standing of the firm before committing funds.",
        sections=[
            ("Our Story", "Narrative: Founded on the principle that distribution should be driven by rigorous research, not commissions. The journey from recognizing an information gap in the retail market to building a premium execution platform."),
            ("Mission, Vision, Values", "Mission Draft: 'To empower investors through unbiased research and seamless mutual fund distribution.'\nVision Draft: 'To be India's most trusted and intellectually rigorous mutual fund distribution partner.'\nValues: Integrity, Intellectual Honesty, Client-Centricity, Discipline."),
            ("Leadership", "Format: Professional headshot (Indian context, business formal), Name, Title, 150-word bio highlighting decades of market experience, AMFI/NISM certifications, and educational pedigree."),
            ("Why Choose Knowith", "Differentiators: 1. Research-First Approach, 2. Transparent Execution, 3. Long-Term Partnership model (not hit-and-run sales).")
        ],
        seo_info={"title": "About Knowith Capital | Our Story, Mission & Leadership", "meta_description": "Learn about Knowith Capital's mission to provide transparent, research-driven mutual fund distribution. Meet our experienced leadership team."}
    )
    doc.add_spacer()

    # 6c) INVESTMENT PHILOSOPHY
    doc.add_page_spec(
        page_name="Investment Philosophy",
        purpose="To articulate the core beliefs that guide fund selection and market analysis.",
        business_goal="Filter out incompatible clients; attract clients aligned with long-term, disciplined approaches.",
        user_goal="Understand how Knowith Capital thinks about risk, return, and market volatility.",
        sections=[
            ("Philosophy Statement", "'We believe that wealth creation is a marathon, not a sprint. It requires patience, diversification, and a steadfast commitment to quality.'"),
            ("Core Principles", "1. Long-Term Thinking: Compounding is the ultimate wealth creator.\n2. Risk-Adjusted Returns: We focus on how much risk was taken to generate the return.\n3. Diversification: The only free lunch in investing.\n4. Research-Driven: Decisions based on data, macroeconomic indicators, and fund manager pedigree.\n5. Discipline over Emotion: Ignoring market noise and staying the course."),
            ("Application to Fund Selection", "Description of how these principles translate into the rigorous filtering of the 2,500+ mutual fund schemes available in India.")
        ],
        seo_info={"title": "Investment Philosophy | Knowith Capital", "meta_description": "Explore Knowith Capital's core investment principles: long-term thinking, risk-adjusted returns, and discipline over emotion."}
    )
    doc.add_spacer()

    # 6d) OUR PROCESS
    doc.add_page_spec(
        page_name="Our Process",
        purpose="To demystify the client onboarding and ongoing engagement journey.",
        business_goal="Reduce friction in the sales pipeline by setting clear expectations.",
        user_goal="Know exactly what will happen step-by-step if they choose to engage with Knowith Capital.",
        sections=[
            ("Step 1: Discovery", "What happens: A deep-dive conversation to understand financial goals, risk appetite, and timelines.\nInvestor Experience: A structured questionnaire and a 45-minute consultation."),
            ("Step 2: Analysis", "What happens: Our team analyzes current holdings (if any) and maps out required asset allocation.\nInvestor Experience: Receiving a comprehensive portfolio health report."),
            ("Step 3: Recommendation", "What happens: Presentation of shortlisted mutual fund schemes tailored to the investor's profile.\nInvestor Experience: A transparent discussion on why specific funds were chosen."),
            ("Step 4: Execution", "What happens: Seamless, digital onboarding and transaction execution via BSE StAR MF / NSE NMF II.\nInvestor Experience: Paperless KYC and immediate transaction confirmations."),
            ("Step 5: Review", "What happens: Periodic monitoring of fund performance and rebalancing prompts.\nInvestor Experience: Receiving quarterly insights and annual comprehensive reviews.")
        ],
        seo_info={"title": "Our Process | How We Work | Knowith Capital", "meta_description": "Discover our 5-step process for mutual fund distribution: Discovery, Analysis, Recommendation, Execution, and Review."}
    )
    doc.add_spacer()

    # 6e) SERVICES PAGE
    doc.add_page_spec(
        page_name="Services (Wealth Solutions)",
        purpose="To detail the specific mutual fund distribution categories and solutions offered.",
        business_goal="Showcase breadth of capabilities while maintaining MFD compliance.",
        user_goal="Find the specific investment vehicle or solution they are looking for.",
        sections=[
            ("Equity Mutual Funds", "Description: High-growth potential funds investing in company stocks. Who it's for: Investors with a 5+ year horizon seeking capital appreciation. Approach: Focus on consistent compounders and robust management."),
            ("Debt Mutual Funds", "Description: Fixed-income funds offering stability. Who it's for: Conservative investors or short-term horizons. Approach: Focus on high credit quality and interest rate cycle alignment."),
            ("Hybrid Funds", "Description: A mix of equity and debt. Who it's for: Balanced risk-takers. Approach: Dynamic asset allocation based on market valuations."),
            ("SIPs (Systematic Investment Plans)", "Description: Rupee cost averaging through regular monthly investments. Benefits: Enforces discipline, mitigates timing risk."),
            ("Tax-Saving Funds (ELSS)", "Description: Equity Linked Savings Schemes under Section 80C. Benefits: Up to INR 1.5 Lakh tax deduction with a short 3-year lock-in."),
            ("Goal-Based Solutions", "Mapping mutual funds to specific life events: Retirement planning, Child's education, Wealth accumulation."),
            ("NRI Investment Support", "Specialized execution support for Non-Resident Indians, handling FEMA compliance, NRE/NRO account linkages, and specific KYC requirements.")
        ],
        recommendations=["Always frame services as 'Distribution of...' or 'Execution support for...' to maintain strict MFD compliance.", "Include a subtle CTA after each service block."]
    )
    doc.add_page_break()

    # 7. INSIGHTS HUB DEEP DIVE
    doc.add_heading_1("6. Insights Hub (Blog/Articles) Architecture")
    doc.add_body_text("The Insights Hub is the engine for organic growth, SEO dominance, and thought leadership.")
    
    doc.add_heading_2("6.1 Taxonomy & Categories")
    doc.add_bullet_list([
        "Market Commentary: Weekly/Monthly summaries of equity and debt markets.",
        "Fund Analysis: Deep dives into specific fund categories (e.g., 'The Case for Mid-Caps').",
        "Investment Education: 'How-to' guides and foundational concepts.",
        "Economic Insights: Impact of RBI policies, inflation, and global events.",
        "Regulatory Updates: How changes in taxation or SEBI rules affect investors."
    ])
    
    doc.add_heading_2("6.2 Article Template Structure")
    article_structure = [
        ("Metadata", "Title, Author, Date, Read Time, Category, Tags."),
        ("Executive Summary", "2-3 bullet points summarizing the article for skimmers."),
        ("Context / Source", "If commenting on external news, link the source and provide context."),
        ("Knowith Analysis", "The core value-add: Our unique interpretation of the data."),
        ("Investor Implications", "'Why It Matters' - actionable takeaways for the client's portfolio approach."),
        ("Compliance Footer", "Standard risk disclaimer and MFD notice.")
    ]
    doc.add_keyed_bullet_list(article_structure)
    doc.add_future_scope_box("AI Content Integration", [
        "Implementation of an AI-driven auto-summarization tool for long-form articles.",
        "AI-powered recommendation engine ('Articles you may also like' based on reading history).",
        "Automated tagging and categorization."
    ])
    doc.add_page_break()

    # 8. SEO CONTENT STRATEGY
    doc.add_heading_1("7. SEO Content Strategy")
    doc.add_body_text("To drive high-intent organic traffic, we will employ a Hub-and-Spoke (Topic Cluster) content model.")
    
    doc.add_heading_2("7.1 Topic Clusters")
    doc.add_body_text("Core hubs will be created around high-volume, competitive terms, supported by long-tail spoke articles.")
    clusters = [
        ["Hub Page (Core Topic)", "Spoke Articles (Long-tail keywords)"],
        ["Systematic Investment Plan (SIP)", "Best date for SIP, Step-up SIP calculator, SIP vs Lumpsum, Stopping a SIP"],
        ["Tax Saving (ELSS)", "ELSS vs PPF, ELSS lock-in rules, Best time to invest in ELSS, Section 80C guide"],
        ["NRI Investments in India", "NRI Mutual fund KYC, NRE vs NRO accounts, FATCA compliance for NRIs, Repatriation rules"]
    ]
    doc.add_professional_table(clusters[0], clusters[1:])
    
    doc.add_heading_2("7.2 Schema Markup Requirements")
    doc.add_bullet_list([
        "Organization Schema: On the homepage for brand knowledge graph.",
        "BreadcrumbList Schema: On all nested pages for clear SERP navigation.",
        "FAQPage Schema: On the Resources/FAQ page to capture featured snippets.",
        "Article Schema: On all Insights Hub posts to signal news/educational content."
    ])
    doc.add_page_break()

    # 9. CONTENT CALENDAR & MEDIA STRATEGY
    doc.add_heading_1("8. Content Calendar & Media Strategy")
    
    doc.add_heading_2("8.1 Publishing Cadence")
    doc.add_info_table([
        ("Weekly", "1x Short-form market update (300 words)."),
        ("Bi-Weekly", "1x Educational article or Fund category analysis (800+ words)."),
        ("Monthly", "1x Comprehensive Macro/Market Outlook Newsletter sent via email and posted to Hub."),
        ("Quarterly", "1x In-depth whitepaper or downloadable guide (e.g., 'Tax Planning Guide 2026').")
    ])
    
    doc.add_heading_2("8.2 Image & Media Strategy")
    doc.add_body_text("Visuals must align with the premium, trustworthy brand identity.")
    doc.add_bullet_list([
        "Photography: Use high-quality stock imagery featuring Indian professionals and families in modern, well-lit settings. Avoid overly staged or cliché 'shaking hands' photos.",
        "Infographics: Complex concepts (like compounding or asset allocation) must be accompanied by clean, brand-colored infographics.",
        "Data Visualization: Charts should use the corporate color palette (Navy, Gold, Accent Blue) and be clearly labeled with sources and dates.",
        "Alt Text: All images must have descriptive, accessibility-compliant alt text (e.g., 'Line chart showing the power of compounding over 20 years')."
    ])
    
    doc.add_heading_2("8.3 Call-To-Action (CTA) Strategy")
    doc.add_body_text("CTAs must be clear, non-aggressive, and contextually relevant.")
    doc.add_info_table([
        ("Primary CTA", "'Schedule a Consultation' (Top right header, Hero section, Footer)"),
        ("Secondary CTA", "'Explore Our Process' / 'View All Services' (Mid-page bands)"),
        ("Tertiary CTA", "'Subscribe to Insights' / 'Download Guide' (Blog sidebar, Footer)")
    ])

    # 10. APPENDIX & LEGAL PAGES
    doc.add_page_break()
    doc.add_heading_1("9. Legal & Compliance Pages")
    doc.add_body_text("The following utility pages are mandatory for regulatory compliance and user trust.")
    
    doc.add_heading_3("Privacy Policy")
    doc.add_body_text("Must detail data collection practices, cookie usage, data sharing (especially with AMC platforms for execution), and user rights under the DPDP Act 2023.")
    
    doc.add_heading_3("Terms & Conditions")
    doc.add_body_text("Outlines the terms of website usage, intellectual property rights (protecting proprietary research), and limitation of liability.")
    
    doc.add_heading_3("Comprehensive Disclaimer")
    doc.add_body_text("A dedicated page expanding on the footer disclaimers, detailing the nature of the MFD business, conflict of interest disclosures (commission earnings), and strict 'no-advisory' stance.")
    
    doc.add_spacer(24)
    doc.add_section_separator()
    doc.add_body_text("END OF DOCUMENT", alignment=1) # 1 = Center
    
    return doc.save("03_Website_Content_Strategy.docx")

if __name__ == "__main__":
    output_directory = r"c:\Users\priya\OneDrive\Desktop\knowith\generators"
    generate_doc03(output_directory)
