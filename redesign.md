# Talos.design - UI/UX Redesign Brief for Google Antigravity Agent

## 1. Primary Objectives
- **Target Audience:** Indian B2B market (MSMEs to Large Scale Enterprises). The design must project stability, transparency, and human reliability while maintaining a professional digital agency aesthetic.
- **Performance:** Eliminate scroll lag, jitter, and rendering issues caused by over-engineered DOM elements.
- **Strict Constraint:** Do not generate raw code blocks in your execution. Process these instructions structurally and apply them to the visual interface directly.

## 2. Elements to Preserve
- **Page Locator (Semi-circle Fill):** Retain the semi-circle fill scroll-indicator/page-locator. 
  - *Optimization Note:* Ensure its animation relies strictly on hardware-accelerated CSS properties (`transform`, `opacity`) to prevent main-thread blocking and ensure it remains buttery smooth.

## 3. Performance & Rendering Fixes (Lag Reduction)
- **Simplify Box Elements:** Identify the `div` box elements that are currently failing to render smoothly. Strip away computationally heavy properties (like stacking multiple `box-shadow` layers, deep `backdrop-filter` blurs, or complex SVG masks on every container). 
- **Layout Refactoring:** Replace deep div nesting with clean, semantic semantic structures. Use modern, lightweight layout techniques that don't trigger constant browser repaints on scroll.
- **Remove "Complex Things":** Strip out unnecessary abstract background animations or particle effects that contribute to browser lag. Replace them with static, high-quality, professional assets or highly optimized, minimal interactions.

## 4. Structural Redesign for B2B Trust (Indian Market)

### A. Hero Section (Clear & Grounded)
- Shift the copy from abstract tech terminology to concrete business value. (e.g., "Automate your workflows and scale your business securely.")
- **Primary CTAs:** Include a primary "Book a Free Consultation" button and a highly visible secondary "Chat on WhatsApp" button.

### B. Social Proof & Trust Signals (Crucial)
- **Integration Ecosystem:** Add a dedicated, highly visible banner showcasing familiar Indian and global enterprise tools Talos integrates with (e.g., WhatsApp Business API, Razorpay, Google Workspace, local CRMs).
- **Testimonials/Case Studies:** Structure a section specifically for client success stories featuring real business names, tangible metrics (hours saved, revenue increased), and clear, professional typography.

### C. The "Human Element" (About Us)
- Introduce a dedicated "Who We Are" or "Founders" block. Indian B2B clients need to know the people behind the agency. 
- Highlight the agency's operational base (Jhansi, India) to establish local presence and accountability.

### D. Service Offerings & Pricing Clarity
- Frame the three core services (Web Design, AI Chatbots, System Automation) around solving daily operational headaches. 
- Ensure the packaging section ("Digital Presence", "Smart Automation", "Custom Build") feels transparent. Avoid hiding the process; lay out exactly what a client gets.

### E. Frictionless Contact & Footer
- **Floating WhatsApp Widget:** Implement a persistent, lightweight WhatsApp floating action button in the bottom right corner across all pages.
- **Footer Updates:** Clearly display direct contact parameters (Phone, Professional Email, Office Location). 

## 5. Aesthetic Guidelines
- **Color Palette:** Transition to a slightly warmer, more inviting corporate palette. Maintain the high-tech feel but ground it with solid, trustworthy colors (deep navy, crisp whites, and subtle accent colors).
- **Typography:** Ensure maximum legibility on mobile devices, as the majority of Indian MSME owners will browse via mobile. Use clean, robust sans-serif fonts.
