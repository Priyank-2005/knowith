import os
from base_styles import DocumentGenerator, ProjectInfo

def generate_doc02(output_dir="documents"):
    doc = DocumentGenerator(output_dir=output_dir)
    
    # 1. COVER PAGE & FRONT MATTER
    doc.add_cover_page("UI/UX Design Reference Guide", "Design System & Interface Specifications")
    
    versions = [
        ("1.0", ProjectInfo.get_date(), ProjectInfo.PREPARED_BY, "Initial design system formulation \u2014 Final Draft"),
    ]
    doc.add_front_matter(versions=versions)
    doc.add_headers_footers("UI/UX Design Reference Guide")

    # 2. EXECUTIVE SUMMARY
    doc.add_heading_1("Executive Summary")
    doc.add_body_text(
        "This UI/UX Design Reference Guide serves as the authoritative blueprint for the visual and interactive "
        "experience of the Knowith Capital digital platform. Our primary objective is to translate Knowith Capital's "
        "core brand values—credibility, sophistication, and steadfast reliability—into a tangible, high-performance "
        "digital interface.",
        bold=False
    )
    doc.add_body_text(
        "Unlike generic retail platforms, this design system is engineered to emulate the refined, bespoke aesthetics "
        "of top-tier global wealth managers and hedge funds. Every typographic choice, color value, component state, "
        "and animation parameter has been meticulously selected to foster investor trust, ensure rigorous regulatory "
        "compliance, and deliver an intuitive user experience. This document provides precise specifications for "
        "developers, designers, and stakeholders to ensure absolute consistency across all touchpoints."
    )
    doc.add_page_break()

    # 3. DESIGN PHILOSOPHY
    doc.add_heading_1("Design Philosophy")
    doc.add_body_text(
        "The Knowith Capital design philosophy is anchored in the concept of 'Quiet Confidence'. We eschew decorative "
        "flourishes and aggressive promotional aesthetics in favor of structural elegance, functional clarity, and "
        "premium minimalism."
    )
    
    philosophy_items = [
        ("Premium Over Decorative", "Every element must serve a functional or structural purpose. We rely on superior typography and purposeful spacing rather than unnecessary borders, backgrounds, or drop-shadows."),
        ("Minimal Over Cluttered", "Information density is carefully managed. We present complex financial concepts through progressive disclosure, ensuring the interface never overwhelms the investor."),
        ("Trust Over Flash", "Interactions should feel solid, predictable, and highly responsive. Animations are used exclusively to guide attention or confirm actions, never merely to entertain."),
        ("Research-Driven & Investor-Focused", "Layouts are optimized for reading comprehension and cognitive ease. The hierarchy is designed to surface critical information (like regulatory disclaimers and risk factors) transparently, reinforcing our commitment to investor protection.")
    ]
    doc.add_keyed_bullet_list(philosophy_items)
    
    doc.add_note_box(
        "Design as a Business Asset",
        "This is not a template site. The UI must feel bespoke and institutional, rivaling the digital presence of leading global asset management firms. The design itself acts as a non-verbal indicator of Knowith Capital's competence and stability."
    )
    doc.add_page_break()

    # 4. PREMIUM DESIGN PRINCIPLES
    doc.add_heading_1("Premium Design Principles")
    doc.add_body_text("All interface decisions must adhere to the following ten foundational principles:")

    principles = [
        ("White Space as a Design Tool", "Generous negative space is not empty space; it is the primary tool for creating a premium feel. It groups related elements, provides cognitive relief, and elevates the perceived value of the content."),
        ("Typographic Hierarchy", "Structure is established primarily through typography—size, weight, and color contrast—rather than through dividing lines or boxes. The scale must be mathematically precise and strictly adhered to."),
        ("Restraint in Color", "Color is a functional tool used to guide attention, indicate state, and reinforce brand identity. The primary palette (Navy and Gold) is used decisively, while neutral grays do the heavy lifting for interface structure."),
        ("Purposeful Animation", "Motion is utilized solely to enhance usability: confirming interactions, softening state changes, and revealing information logically. Elements should never move autonomously without user input."),
        ("Content-First Design", "The interface exists to serve the content, not to compete with it. UI chrome (navigation, footers, sidebars) should recede, allowing insights, data, and service details to take center stage."),
        ("Trust Through Consistency", "Predictability breeds trust. A button must always look and behave like a button. Padding, border-radii, and hover states must remain mathematically consistent across the entire platform."),
        ("Accessibility as a Foundation", "Inclusive design is non-negotiable. Strict adherence to WCAG AA standards ensures legibility, contrast, and navigability for all investors, reflecting institutional maturity."),
        ("Progressive Disclosure", "Complex information (such as deep analytics or extensive regulatory terms) is introduced sequentially. We provide the summary first, allowing interested users to drill down for granular detail."),
        ("Visual Breathing Room", "Dense financial data must be balanced with expansive layout structures. Tables and data visualizations require significant internal padding to remain legible and approachable."),
        ("Quiet Confidence Over Loud Promotion", "We do not use 'shouting' design patterns (e.g., massive CTA banners, intrusive pop-ups, high-saturation alert colors for marketing). Our design speaks with the measured tone of an experienced professional.")
    ]
    
    for title, desc in principles:
        doc.add_heading_3(title)
        doc.add_body_text(desc)
    doc.add_page_break()

    # 5. REFERENCE WEBSITE ANALYSIS
    doc.add_heading_1("Reference Website Analysis")
    doc.add_body_text("Our design strategy is informed by an analysis of leading platforms in the financial and corporate sectors. The following deconstructs specific patterns to emulate and avoid.")

    # Ionic Wealth
    doc.add_heading_2("1. Ionic Wealth (Aspirational Baseline)")
    doc.add_body_text("Ionic Wealth represents the target aesthetic: highly professional, spacious, and sophisticated.")
    
    ionic_rows = [
        ["Attribute", "Observation / Recommendation"],
        ["Layout & Spacing", "Extremely generous padding between sections. Creates a calm, deliberate reading pace. Action: Adopt a 120px minimum vertical section padding for desktop."],
        ["Typography", "High contrast between large, light hero typography and highly legible body copy. Action: Utilize a strict typographic scale with prominent H1/H2 sizes."],
        ["Color Palette", "Dominated by deep, muted tones and stark whites. Action: Keep backgrounds predominantly white or very light gray, reserving Navy for high-impact sections."],
        ["What to Avoid", "Do not copy their specific corporate imagery or proprietary structural layouts verbatim. Adapt the 'feel' rather than the exact wireframe."]
    ]
    doc.add_professional_table(ionic_rows[0], ionic_rows[1:], col_widths=[2.0, 5.0])

    # Pet Financial
    doc.add_heading_2("2. Pet Financial (Regulatory Compliance)")
    doc.add_body_text("Pet Financial provides a benchmark for integrating necessary regulatory content without degrading the user experience.")
    
    pet_rows = [
        ["Attribute", "Observation / Recommendation"],
        ["Disclaimer Integration", "Disclaimers are present but visually subdued (smaller font, lower contrast) so they don't disrupt the primary narrative. Action: Standardize a 'Small/Caption' text style for regulatory notes."],
        ["Terminology", "Precise use of distribution terminology. Action: Ensure all service descriptions align with the AMFI/MFD compliance framework established in Document 01."],
        ["What to Avoid", "Their visual design is slightly dated and utilitarian. Do not emulate their color scheme, button styling, or navigational density."]
    ]
    doc.add_professional_table(pet_rows[0], pet_rows[1:], col_widths=[2.0, 5.0])

    # Ocean
    doc.add_heading_2("3. Ocean (Information Hierarchy)")
    doc.add_body_text("Ocean excels in organizing complex data and presenting credibility indicators effectively.")
    
    ocean_rows = [
        ["Attribute", "Observation / Recommendation"],
        ["Data Presentation", "Clean, borderless tables and well-spaced grid layouts for statistics. Action: Use 'Card' components with ample internal padding (min 32px) for data points."],
        ["Credibility", "Strategic placement of trust markers (logos, performance metrics). Action: Include a dedicated 'Trust/Metrics' band on the homepage using subdued monochrome logos."],
        ["What to Avoid", "Avoid their more experimental or trendy visual motifs that might detract from a conservative financial persona."]
    ]
    doc.add_professional_table(ocean_rows[0], ocean_rows[1:], col_widths=[2.0, 5.0])

    # Fineprint
    doc.add_heading_2("4. Fineprint (Content Readability)")
    doc.add_body_text("Fineprint demonstrates how to make long-form textual content highly readable and engaging.")
    
    fine_rows = [
        ["Attribute", "Observation / Recommendation"],
        ["Article Layout", "Narrow max-width for text blocks (approx 65-75 characters per line) to optimize readability. Action: Restrict article body containers to 800px max-width."],
        ["Inline Elements", "Elegant pull quotes and data callouts. Action: Design a specific 'Insight Callout' component for the Research & Insights section."],
        ["What to Avoid", "Do not carry over email-specific patterns (like aggressive subscription prompts in the middle of text) to the core web experience."]
    ]
    doc.add_professional_table(fine_rows[0], fine_rows[1:], col_widths=[2.0, 5.0])

    # FundsBazaar
    doc.add_heading_2("5. FundsBazaar (Functional Utility)")
    doc.add_body_text("While aesthetically different from our target, FundsBazaar provides patterns for functional investor tools.")
    
    fb_rows = [
        ["Attribute", "Observation / Recommendation"],
        ["Navigation", "Clear separation between 'Public Site' and 'Investor Portal' logic. Action: Make the 'Client Login' CTA highly distinct (e.g., solid Gold button in the top right)."],
        ["Onboarding", "Step-by-step progressive disclosure for complex flows. Action: Apply this logic to contact and inquiry forms (multi-step rather than one massive form)."],
        ["What to Avoid", "High visual clutter, dense dashboards, and overly aggressive color coding. Maintain our minimalist aesthetic even in functional areas."]
    ]
    doc.add_professional_table(fb_rows[0], fb_rows[1:], col_widths=[2.0, 5.0])
    doc.add_page_break()

    # 6. TYPOGRAPHY SYSTEM
    doc.add_heading_1("Typography System")
    doc.add_body_text("The typographic system is built on precision. We utilize a highly legible, premium sans-serif primary typeface to ensure absolute clarity of financial information, supported by a structured scale.")
    
    doc.add_heading_3("Font Recommendations")
    doc.add_bullet_list([
        "Primary Typeface: Inter or Roboto (Clean, neo-grotesque, excellent legibility for numbers and data).",
        "Alternative Premium: 'Geist' or 'SF Pro' (if licensing permits).",
        "Fallback: Helvetica Neue, Arial, sans-serif."
    ])

    doc.add_heading_3("Typographic Scale (Desktop Reference)")
    type_scale_headers = ["Element", "Font Size", "Line Height", "Weight", "Usage"]
    type_scale_rows = [
        ["Display / Hero", "56px (3.5rem)", "1.1 (62px)", "Light (300) / Regular", "Homepage hero statements, major entry points."],
        ["H1 (Page Title)", "48px (3rem)", "1.1 (52px)", "Medium (500)", "Primary page headers (e.g., 'Wealth Solutions')."],
        ["H2 (Section)", "36px (2.25rem)", "1.2 (44px)", "Medium (500)", "Major section dividers within a page."],
        ["H3 (Subsection)", "24px (1.5rem)", "1.3 (32px)", "Semi-Bold (600)", "Card titles, subsection headers."],
        ["H4 (Component)", "20px (1.25rem)", "1.4 (28px)", "Semi-Bold (600)", "Small card titles, modal headers."],
        ["Body Large", "18px (1.125rem)", "1.6 (28px)", "Regular (400)", "Introductory paragraphs, lead text."],
        ["Body Base", "16px (1rem)", "1.6 (26px)", "Regular (400)", "Standard article text, descriptions."],
        ["Body Small", "14px (0.875rem)", "1.5 (22px)", "Regular (400)", "Secondary info, timestamps, metadata."],
        ["Caption / Legal", "12px (0.75rem)", "1.4 (16px)", "Regular (400)", "Regulatory disclaimers, copyright, fine print."],
        ["Overline", "12px (0.75rem)", "1.5 (18px)", "Bold (700) + Caps", "Category tags, section kickers (e.g., 'OUR APPROACH')."]
    ]
    doc.add_professional_table(type_scale_headers, type_scale_rows, col_widths=[1.2, 1.2, 1.2, 1.5, 2.5])
    
    doc.add_recommendation_box(
        "Typography Guidelines",
        [
            "Line Length: Constrain body text containers to 65-75 characters to prevent eye strain.",
            "Letter Spacing: Apply tight tracking (-0.02em) to Display/H1 headers, and slightly loose tracking (0.05em) to uppercase Overlines.",
            "Color: Never use absolute black (#000000). Use the defined Dark Navy or Dark Gray for maximum contrast without harshness."
        ]
    )
    doc.add_page_break()

    # 7. SPACING SYSTEM
    doc.add_heading_1("Spacing & Layout System")
    doc.add_body_text("We employ a strict 8-point grid system. All padding, margins, and component heights must be a multiple of 8 to ensure vertical rhythm and visual harmony.")

    doc.add_heading_3("The 8pt Spacing Scale")
    space_headers = ["Token", "Value (px)", "Value (rem)", "Typical Application"]
    space_rows = [
        ["space-4", "4px", "0.25rem", "Micro adjustments, inside tiny buttons or inputs."],
        ["space-8", "8px", "0.5rem", "Between icon and text, tight list items."],
        ["space-12", "12px", "0.75rem", "Small component padding (tags, badges)."],
        ["space-16", "16px", "1.0rem", "Standard UI element margin, typical paragraph spacing."],
        ["space-24", "24px", "1.5rem", "Standard card padding, between form fields."],
        ["space-32", "32px", "2.0rem", "Large card padding, heading bottom margins."],
        ["space-48", "48px", "3.0rem", "Between major components, small section breaks."],
        ["space-64", "64px", "4.0rem", "Standard section padding (mobile)."],
        ["space-96", "96px", "6.0rem", "Large section padding (tablet/small desktop)."],
        ["space-120", "120px", "7.5rem", "Standard section padding (desktop)."],
        ["space-160", "160px", "10.0rem", "Hero section top padding, major structural breaks."]
    ]
    doc.add_professional_table(space_headers, space_rows, col_widths=[1.0, 1.0, 1.0, 4.0])

    doc.add_heading_3("Grid & Layout Architecture")
    doc.add_bullet_list([
        "Grid System: 12-column responsive grid.",
        "Max Container Width: 1280px (keeps content focused on ultra-wide monitors).",
        "Desktop Gutters: 32px (generous spacing between columns).",
        "Tablet Gutters: 24px.",
        "Mobile Gutters: 16px.",
        "Alignment: Prefer left-alignment for text (highly readable). Center alignment is reserved strictly for short, high-impact hero text or standalone quotes."
    ])
    doc.add_page_break()

    # 8. COLOR STRATEGY
    doc.add_heading_1("Color Strategy")
    doc.add_body_text("The color palette conveys institutional authority, stability, and premium service. The primary Navy instills trust, while the Gold acts as a sophisticated accent.")

    doc.add_heading_3("Primary Brand Colors")
    primary_headers = ["Color Name", "Hex Code", "RGB", "Usage Rule"]
    primary_rows = [
        ["Brand Navy (Primary)", "#1B2A4A", "27, 42, 74", "Primary structural color. Used for headers, hero backgrounds, primary text, footer backgrounds. The anchor of the brand."],
        ["Brand Gold (Accent)", "#C9A96E", "201, 169, 110", "High-value interactions. Primary CTA buttons, subtle active states, structural underlines. Use sparingly for maximum impact."]
    ]
    doc.add_professional_table(primary_headers, primary_rows, col_widths=[1.5, 1.0, 1.0, 4.0])

    doc.add_heading_3("Neutral Scale (Structure & Typography)")
    neutral_headers = ["Token", "Hex Code", "Usage Application"]
    neutral_rows = [
        ["White", "#FFFFFF", "Primary page background, card backgrounds."],
        ["Gray 50", "#F8F9FA", "Secondary background (subtle offset for alternating sections)."],
        ["Gray 100", "#F1F3F5", "Hover states for cards, subtle borders."],
        ["Gray 200", "#E9ECEF", "Standard component borders, dividers."],
        ["Gray 400", "#CED4DA", "Disabled states, placeholder text."],
        ["Gray 600", "#868E96", "Secondary text, metadata, captions."],
        ["Gray 800", "#343A40", "Body text. (Softer than pure black for reading ease)."],
        ["Navy Dark", "#0F172A", "High contrast headers, extremely deep backgrounds."]
    ]
    doc.add_professional_table(neutral_headers, neutral_rows, col_widths=[1.5, 1.5, 4.5])

    doc.add_heading_3("Semantic & Status Colors")
    semantic_rows = [
        ["Token", "Hex Code", "Usage Application"],
        ["Success", "#059669", "Form completion, positive indicators, systemic confirmations."],
        ["Warning", "#D97706", "Important notices, mid-level alerts."],
        ["Error / Danger", "#DC2626", "Form validation errors, destructive actions."],
        ["Info", "#2563EB", "Informational callouts, secondary links."]
    ]
    doc.add_professional_table(semantic_rows[0], semantic_rows[1:], col_widths=[1.5, 1.5, 4.5])
    
    doc.add_warning_box("Color Accessibility", "All text-to-background color combinations must meet WCAG 2.1 AA standards (minimum contrast ratio of 4.5:1 for normal text and 3.0:1 for large text).")
    doc.add_page_break()

    # 9. ANIMATION & MOTION GUIDELINES
    doc.add_heading_1("Animation & Motion Guidelines")
    doc.add_body_text("Motion should be virtually invisible. It exists to provide spatial context, confirm user actions, and ease cognitive load during state changes. It must never be distracting.")

    doc.add_heading_3("Animation Principles")
    doc.add_bullet_list([
        "Subtle & Purposeful: No bouncing, shaking, or aggressive elastic effects.",
        "Swift: UI animations should feel snappy. Slow animations make the platform feel sluggish.",
        "Easing: Always use ease-out for elements entering the screen, and ease-in for elements exiting.",
        "Accessibility: Respect 'prefers-reduced-motion' media queries at the CSS level by disabling all non-essential motion."
    ])

    doc.add_heading_3("Timing & Easing Specifications")
    motion_headers = ["Category", "Duration", "Easing Curve", "Application"]
    motion_rows = [
        ["Micro-interactions", "150ms", "ease-in-out", "Button hovers, link color changes, checkbox toggles."],
        ["Standard Transitions", "300ms", "cubic-bezier(0.4, 0, 0.2, 1)", "Card expansions, modal fades, dropdown reveals."],
        ["Emphasis / Entrance", "500ms", "cubic-bezier(0.0, 0, 0.2, 1)", "Page load reveals, scroll-triggered fade-ups (max 20px translation)."]
    ]
    doc.add_professional_table(motion_headers, motion_rows)
    
    doc.add_important_box(
        "Prohibited Motion",
        [
            "Carousels or sliders that auto-play without user interaction.",
            "Elements that continuously pulse or blink to draw attention.",
            "Parallax effects that cause text to move at different speeds than backgrounds (disorienting for reading)."
        ]
    )
    doc.add_page_break()

    # 10. CARD COMPONENTS
    doc.add_heading_1("Card Component System")
    doc.add_body_text("Cards are the primary container for discrete chunks of information. They must maintain consistent padding, border-radius, and hover behaviors across the platform.")

    doc.add_heading_3("General Card Specifications")
    doc.add_bullet_list([
        "Background: White (#FFFFFF) or Gray 50 (#F8F9FA).",
        "Border Radius: 8px (subtle, professional corner rounding).",
        "Border: 1px solid Gray 200, OR a very subtle shadow (e.g., 0 4px 6px -1px rgba(0,0,0,0.05)).",
        "Internal Padding: Minimum 24px (32px preferred on desktop).",
        "Hover State: Slight elevation (shadow increase) and/or a subtle -2px Y-axis translation. The border may shift to Brand Navy."
    ])

    doc.add_heading_3("Card Types")
    card_headers = ["Card Type", "Structural Elements", "Specific Usage"]
    card_rows = [
        ["Insight Card", "Image (16:9), Overline Tag, H4 Title, 2-line Excerpt, Metadata (Date/Read Time).", "Research & Insights listing page. Clickable entire surface."],
        ["Service Card", "Minimal line Icon (top left), H3 Title, Paragraph Description, 'Learn More \u2192' text link.", "Wealth Solutions page to delineate specific offerings."],
        ["Stat Card", "H2 (large number), Caption/Label text.", "Highlighting AUM, client count, or performance metrics. Often borderless with just background."],
        ["Team Card", "Portrait Image (1:1 or 3:4), H4 Name, Caption Role, LinkedIn Icon.", "About Us page. Clean, professional headshot styling."],
        ["Testimonial Card", "Quote icon, Italic Body text, H4 Name, Caption Designation.", "Homepage or service pages to build social proof."]
    ]
    doc.add_professional_table(card_headers, card_rows, col_widths=[1.5, 3.5, 2.5])
    doc.add_page_break()

    # 11. BUTTON SYSTEM
    doc.add_heading_1("Button System")
    doc.add_body_text("Buttons are the primary method of interaction. Their hierarchy must be instantly recognizable.")

    doc.add_heading_3("Button Styles")
    btn_headers = ["Button Style", "Visual Definition", "Usage Context"]
    btn_rows = [
        ["Primary", "Solid Navy background, White text. Hover: Darker Navy.", "Primary page action (e.g., 'Schedule Consultation', 'Submit Form'). Max 1 per view."],
        ["Primary (Gold)", "Solid Gold background, Navy text. Hover: Lighter Gold.", "High-conversion actions (e.g., 'Client Login')."],
        ["Secondary", "Transparent background, 1px Navy border, Navy text. Hover: Gray 50 bg.", "Alternative actions (e.g., 'Learn More', 'Cancel')."],
        ["Ghost / Text", "No background, no border, Navy text. Hover: Gray 50 bg.", "Low priority actions, inline interactions."],
        ["Icon Link", "Text link with inline right-arrow (\u2192).", "Navigating to deep content within cards or lists."]
    ]
    doc.add_professional_table(btn_headers, btn_rows)

    doc.add_heading_3("Button Specifications")
    doc.add_bullet_list([
        "Typography: Medium/Semi-bold, matching Body Base (16px).",
        "Height / Size: Large (48px height, 24px px padding), Medium (40px height, 16px px padding), Small (32px height, 12px px padding).",
        "Border Radius: 4px (slightly sharper than cards for actionable feel).",
        "Focus State: Absolute requirement. 2px offset outline using Brand Gold or Accent Blue when navigating via keyboard.",
        "Touch Targets: All clickable elements must have a minimum interactive area of 44x44px for mobile accessibility."
    ])
    doc.add_page_break()

    # 12. FORM DESIGN & 13. LAYOUT SYSTEM
    doc.add_heading_1("Form & Input Design")
    doc.add_body_text("Forms must be frictionless and confidence-inspiring. We avoid complex layouts in favor of single-column clarity where possible.")
    
    doc.add_bullet_list([
        "Structure: Vertical layout. Labels placed above inputs (not inline) for faster cognitive processing.",
        "Labels: Static, clearly visible labels (14px, Medium weight, Dark Navy). Avoid floating labels as they cause accessibility issues.",
        "Input Fields: 48px height. 1px Gray 200 border. White background. Focus state: 1px Navy border + subtle box-shadow.",
        "Placeholders: Use for formatting hints (e.g., 'name@company.com'), not as a replacement for labels.",
        "Validation: Inline, real-time validation upon field blur. Use semantic colors (Red for error, Green for success) accompanied by descriptive text below the field.",
        "Required Indicators: Clearly mark optional fields with '(Optional)'. Assume all other fields are required."
    ])

    doc.add_heading_1("Iconography & Imagery")
    doc.add_heading_3("Icon Guidelines")
    doc.add_body_text("Icons should serve as visual wayfinding tools, not decoration.")
    doc.add_bullet_list([
        "Style: Consistent line/outline style. 1.5px or 2px uniform stroke width.",
        "Library Recommendation: Phosphor Icons (Light or Regular weight) or Lucide Icons.",
        "Sizing: Standardized to 16px (inline), 24px (standard UI), 32px (card accents), 48px (major feature graphics).",
        "Color: Typically inherit the text color or utilize Brand Gold for subtle emphasis."
    ])

    doc.add_heading_3("Photography & Illustration")
    doc.add_bullet_list([
        "Tone: Professional, warm, trustworthy, and contextually Indian (representing local corporate environments).",
        "Style: Avoid generic 'handshake' or 'calculator' stock photos. Focus on architectural elements, candid professional interactions, and high-quality abstractions.",
        "Treatment: Apply a subtle desaturation or Navy color overlay to stock imagery to ensure brand consistency and allow overlaid text to remain legible.",
        "Optimization: All imagery must be lazy-loaded and served in next-gen formats (WebP/AVIF) with appropriate `srcset` sizing."
    ])
    doc.add_page_break()

    # 18. BRAND DIRECTION & 19. THINGS TO AVOID
    doc.add_heading_1("Brand Direction & Anti-Patterns")
    
    doc.add_heading_3("Tone of Voice")
    doc.add_body_text("The visual design must be matched by the copy tone. The platform should sound knowledgeable, precise, and approachable—never overly aggressive or 'salesy'.")

    doc.add_heading_3("Do's vs. Don'ts (Anti-Patterns)")
    do_dont_headers = ["Category", "Do (Prescribed)", "Don't (Anti-Pattern)"]
    do_dont_rows = [
        ["Layout", "Use generous white space to separate distinct concepts.", "Create crowded layouts with overlapping elements."],
        ["Color", "Limit views to 1-2 primary colors + neutrals.", "Use more than 3 distinct colors in a single view."],
        ["Motion", "Use subtle fades and slight translations on interaction.", "Use flashy, bouncy, or continuous loop animations."],
        ["Imagery", "Use curated, high-quality, authentic-feeling photography.", "Use cheap, generic stock photos (e.g., puzzles, piggy banks)."],
        ["Navigation", "Maintain a clean, categorized header with clear labeling.", "Use deeply nested mega-menus or cluttered utility bars."],
        ["Media", "Allow users to initiate video/audio playback.", "Implement auto-playing media, especially with sound."],
        ["Conversion", "Place clear, contextually relevant CTAs at section ends.", "Use aggressive pop-ups, modals on entry, or sticky banners."]
    ]
    doc.add_professional_table(do_dont_headers, do_dont_rows, col_widths=[1.5, 3.0, 3.0])
    doc.add_page_break()

    # 20. FUTURE DESIGN SYSTEM
    doc.add_heading_1("Future Design System Roadmap")
    doc.add_body_text("To ensure scalability as Knowith Capital transitions into Phase 02 (Investor Portal & AI Tools), this UI/UX guide should be formalized into a strictly governed design system.")
    
    doc.add_bullet_list([
        "Design Tokens: Map all colors, spacing, and typography to CSS variables/tokens (e.g., `--color-primary-navy`, `--space-24`) to eliminate hardcoded values.",
        "Component Library: Establish a centralized Figma component library utilizing Auto Layout and Variants for all cards, buttons, and form elements.",
        "Developer Handoff: Implement Storybook (or similar) to catalog coded UI components, ensuring the React/Next.js implementation perfectly matches the Figma designs.",
        "Governance: Any new component required for future phases must be designed, reviewed for accessibility, and added to the master library before implementation."
    ])

    # 21. APPENDIX
    doc.add_heading_1("Appendix")
    doc.add_heading_3("Recommended Tooling")
    doc.add_bullet_list([
        "UI/UX Design & Prototyping: Figma",
        "Component Documentation: Storybook",
        "Iconography: Phosphor Icons (phosphoricons.com)",
        "Accessibility Testing: Wave Tool, Lighthouse, Stark (Figma Plugin)"
    ])
    
    doc.add_heading_3("Mood Board Direction")
    doc.add_body_text(
        "Visual Reference Summary: Architectural lines, deep ocean blues, matte gold finishes, crisp white paper, "
        "minimalist typography. The aesthetic should evoke the feeling of entering a high-end corporate office in "
        "BKC (Mumbai) or a private banking suite—quiet, secure, and impeccably maintained."
    )

    return doc.save("02_UIUX_Design_Reference_Guide.docx")

if __name__ == "__main__":
    generate_doc02()
