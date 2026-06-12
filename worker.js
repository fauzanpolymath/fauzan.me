export default {
  async fetch(request, env) {
    // 1. Handle preflight CORS requests (allows your website to talk to the worker)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // 2. Grab the question the visitor typed
      const { question } = await request.json();

      // 3. This is the background information about you!
      // (You can tell Claude to add more details about your achievements here)
      const fauzanProfile = `# FAUZAN BATTIWALA — THE DATA & AI JOURNEY
## A Complete Career Narrative for Podcast Production

**Format note for the AI producing this podcast:** This is a chronological, evidence-based narrative of Fauzan Battiwala's career in data, analytics, automation, and applied AI. Every metric in this document is verified and real. The intended audience is interviewers and hiring managers evaluating Fauzan for senior AI operations, business analysis, and AI consulting roles. The tone should be factual and confident — no hype, no exaggeration, no corporate filler. Let the numbers and the decisions tell the story.

---

## THE ARC IN ONE PARAGRAPH

Fauzan Battiwala is a Dubai-based operations and AI professional with roughly eight years of experience spanning banking escalations, contact-centre transformation, mobility platforms, and fintech marketplaces. His career follows a clear progression: he started in high-stakes customer operations, learned to find problems in data, learned to fix processes with Six Sigma rigour, learned to automate with Excel, CRM workflows, and OCR — and then, when production-grade AI became viable, he became one of the practitioners who actually shipped it. Not prototyped it. Shipped it — 20 AI agents in production across live fintech platforms serving 700,000 active users per app, with compliance approval, canary rollouts, daily audits, and weekly ROI reporting to leadership. His defining trait is that he treats AI as an operations discipline, not a demo.

---

## CHAPTER 1: THE FOUNDATION — BANKING ESCALATIONS (2016–2017)
### Customer Service Officer, Citibank US (via Tata Consultancy Services, Mumbai)

Every data career starts somewhere, and Fauzan's started at the sharp end: handling complex customer queries for Citibank US customers through TCS. This was high-volume, high-stakes financial services work — real money, real regulatory consequences, real angry customers.

What matters about this period is not the role itself but what he did with it. He documented service processes, contributed to workflow improvements, and performed well enough to be placed in a specialised escalation team — the unit that handles the cases everyone else couldn't resolve. This is where he developed two instincts that run through everything afterward: an obsession with root cause over symptom, and the understanding that every operational failure leaves a data trail if you know where to look.

---

## CHAPTER 2: THE SIX SIGMA CRUCIBLE — HELLO MINERAL WATER (Oct 2016 – Mar 2017)
### Six Sigma DMAIC Change Management Project, Mumbai

In parallel with his early career, Fauzan led a comprehensive Six Sigma transformation for Hello Mineral Water, a corporate and retail water supplier in Mumbai that was bleeding: declining sales, high complaint volumes, extended lead times, and receivables nobody was collecting.

This project is the methodological backbone of everything he later did with AI. He ran the full DMAIC cycle:

- **Data analysis and root cause analysis** to separate signal from noise in the complaint and delivery data
- **Swimlane process mapping** to expose where handoffs were failing
- **Fault Tree Analysis** to quantify, in financial and NPS terms, exactly what each SLA failure was costing the business
- **Kaizen, CAPA-based SOPs, Statistical Process Control, and PDCA cycles** to fix the process — not the people
- **ABC analysis** on receivables to prioritise collections
- **Change management at the human level** — he delivered 'Who Moved My Cheese' training to 80+ staff, because he understood early that process change fails when people aren't brought along

**The verified results over six months: NPS rose from 28% to 93%. SLA compliance rose from 34% to 88%. Payment collections improved from 45% to roughly 70%.**

A 65-point NPS swing in six months is the kind of result that follows someone for a career. More importantly, it established his template: measure, diagnose, redesign, control, and bring the humans with you. He would apply exactly this template to AI deployment eight years later.

---

## CHAPTER 3: DATA AT ENTERPRISE SCALE — HINDUJA GLOBAL SOLUTIONS INTERACTIVE (Dec 2018 – Dec 2020)
### Operations Manager, Mumbai

At Hinduja Global Solutions Interactive, Fauzan stepped into enterprise-scale data and CRM operations, managing digital transformation work for a roster of global brands: **Disney+, Toyota India, Aster DM Healthcare, Walmart, and Sam's Club**, plus European stakeholder coordination for **MindMaze**, a Swiss gamified physiotherapy platform.

The volumes were serious: approximately 10,000 emails per day, 200,000 social mentions monitored, and 2,000 calls per day, with cumulative customer data in the 2–2.5 million range across CRM tools including Salesforce, Freshdesk, Zoho, Sprinklr, Konnect Insight, and LocoBuzz.

The signature projects from this era:

- **The Disney+ CRM migration (Salesforce to Freshdesk).** Fauzan led the migration — re-architecting automated ticket routing, escalation workflows, and SLA rules — and delivered a zero-downtime transition with faster turnaround times, lower operational cost, and better reporting accuracy. Migrating a live, high-volume CRM for a brand like Disney+ without downtime is a systems-thinking achievement, not a clerical one.
- **Sprinklr deployment for Toyota India.** He implemented Sprinklr to centralise marketing and social insights, with adoption across all of Toyota India's marketing verticals — automated social listening at national-brand scale.
- **Omni-channel CRM integration for Aster DM Healthcare.** He oversaw the unification of customer communication across 100+ healthcare facilities in 7 countries — a genuinely complex multi-region, multi-system integration with healthcare-grade sensitivity.
- **Quality analytics.** He built and ran agent quality scorecards (60% process adherence, 40% soft skills), ran calibration sessions and coaching for 70–80 agents, and used CSAT/FCR trend analysis and root cause work to drive first-contact resolution from 46% to 62% in three months.
- **US and European coordination.** He coordinated directly with US teams for Sam's Club and Walmart, and with European and Swiss stakeholders for MindMaze — early, sustained experience working across time zones and cultures with enterprise clients.

This chapter matters because it is where data stopped being spreadsheets and became infrastructure: millions of customer records, multi-country integrations, and dashboards consumed by global brands.

---

## CHAPTER 4: BUILDING THE OPERATING SYSTEM — TOWR PORTAL (Feb 2021 – Apr 2022)
### Operations Manager, Dubai

Moving to Dubai, Fauzan took over operations at Towr Portal, an on-demand vehicle services platform focused on the B2B segment. This was his first end-to-end ownership of a digital platform's operational data layer, and the era where he started building automation rather than just managing systems.

Key work, all verified:

- **Zoho CRM workflow automation.** He deployed automated workflows where web enquiries were auto-converted into sales orders with an immediate email alert to the sales manager; a 1-day SLA was enforced through automated case flagging; and unresolved cases escalated automatically into a weekly review queue. This eliminated manual lead triage entirely — a pre-LLM example of agent-like automation: trigger, action, escalation, audit.
- **Excel VBA macro suite for financial close.** He built a macro suite for monthly financial reconciliation — automated multi-sheet consolidation, error-checking, and output generation — replacing manual processing and significantly reducing close time.
- **IVR segmentation and B2B growth.** He introduced IVR routing to separate individual and corporate customers at first contact and launched a credit facility for corporate clients — growing B2B acquisition from roughly 5 to roughly 12 customers per month (+120%), while monthly order volume scaled from around 50 to 1,500 through process redesign and better matching.
- **KPI discipline.** Response time, SLA compliance, and revenue-per-order were tracked in structured reports that fed pricing strategy and competitive positioning.

The theme: automation as leverage. One person, designing systems that did the work of a coordination team.

---

## CHAPTER 5: THE ANALYST YEARS — LIFTMYCAR (Apr 2022 – Jan 2024)
### Business Analyst, Dubai

At LiftMyCar, an on-demand vehicle recovery platform serving B2B and B2C segments, Fauzan formalised his identity as a business analyst — and shipped his first production conversational AI.

The flagship AI project:

- **360.io chatbot deployment across every digital channel.** He designed and configured conversational AI across WhatsApp, the website, and social channels — building the decision trees, fallback handling, escalation logic, and human-handoff rules that replaced manual first-response handling across all digital touchpoints. This was full lifecycle conversational AI ownership: design, deployment, and the unglamorous edge-case engineering that determines whether a chatbot helps or infuriates.
- **Zoho CRM + Stripe integration.** He configured automated data sync between Stripe payment events and Zoho CRM, so failed payment attempts were automatically logged against the associated invoice with the failure reason captured for reporting — closing the loop between payments data and customer records without human re-keying.

The analytics work alongside it:

- Built executive dashboards for CLV, LTV, CAC, MRR, AOV, and revenue per recovery
- Analysed booking funnels and B2B vs B2C lifecycle performance, driving B2B orders from roughly 100 in the first month to roughly 500 per month by Q2 through segmentation and targeted operational change
- Monitored and reconciled roughly 3,000 monthly online payment transactions across Stripe and Telr, flagging overdue trends for corrective action
- Redesigned the booking journey from 8 steps down to 4–5 after identifying conversion-killing friction in the funnel data
- Built a vendor performance scoring model for fleet partners — efficiency and delivery quality tracked as data, used to optimise vendor selection

By the end of this chapter, the pattern is set: find the leak in the data, redesign the process, automate the fix, measure the result.

---

## CHAPTER 6: THE AI YEARS — KOBET TECHNOLOGIES DMCC (Oct 2024 – Mar 2026)
### Project Manager / AI Business Consultant, Dubai

Kobet is where everything converges. Kobet Technologies operates a fintech marketplace business: **14 gift card trading apps, 150,000+ monthly trades, and 700,000 active users per app.** Fauzan joined as Project Manager and became, in practice, the company's AI deployment lead — owning evaluation, compliance, architecture decisions, rollout, governance, and ROI reporting for AI in production.

### 6.1 The Crisp AI Agent Programme — end-to-end production AI deployment

This is the centrepiece, and the details matter because they demonstrate the full lifecycle:

- **Evaluation and procurement.** The market offered AI CRM platforms costing $5,000–$50,000 per month. Fauzan built a formal feature-price comparison, ran a live proof-of-concept demo, and selected Crisp at $300 per month — an **83% cost reduction** against the realistic alternatives, achieved through rigorous evaluation rather than vendor marketing.
- **Compliance and risk.** Before deployment, he obtained compliance approval backed by test results and a documented risk-and-mitigation strategy. In a fintech handling real-money transactions, this is the step most AI initiatives skip and then die on.
- **Build.** API integration, knowledge base construction, SOPs, an escalation matrix, and governance documentation — the AI agents were grounded in a curated, structured knowledge base from day one.
- **Rollout.** A canary release strategy: pilot on a subset of traffic, monitor accuracy and resolution rates, iterate on prompts and knowledge base content, then scale progressively. Daily post-release audits in the early phase.
- **A scientifically honest experiment.** He ran a self-learning experiment in which agents could update from interactions — and **paused it** after identifying agent response conflicts, reverting to the curated knowledge base as the single source of truth. This decision — recognising when an AI capability is creating risk and rolling it back — is exactly the judgment AI governance roles exist to find.
- **Verified scale and outcomes: 20 AI agents deployed in production.** Results reported weekly to leadership: **30% reduction in human agent workload, 3–7% uplift across CSAT, NPS, CRR, and FRT, reduced average handling time, lower repeat contact rates, and 83% cost reduction** versus the previous platform spend.
- **Change management.** Human agents were retrained toward exception handling and complex cases; internal playbooks were built for ongoing agent management and quality monitoring. The Six Sigma instinct — bring the humans with you — applied to AI adoption.

### 6.2 The OCR duplicate detection pipeline — AI as fraud prevention

Fauzan noticed that a 60% transaction failure rate was masking a duplicate gift card problem. His response:

- Designed the end-to-end logic for a **Google Cloud Vision OCR pipeline** that validates uploaded gift card images against the card database in the background, before a transaction is even generated
- Authored the full PRD and BRD, briefed the developers, and coordinated implementation inside the Google/Firebase ecosystem
- **Verified result: a 15–20% reduction in failed transactions**, automated duplicate and used-card detection, and a significant reduction in manual agent verification work

### 6.3 The fraud detection stack — production-grade AI architecture

Beyond OCR, Fauzan worked on a multi-layer fraud detection architecture for the platform:

- A **Vision Agent** built on Claude and GPT-4o for image understanding
- **CLIP embeddings stored in Pinecone** enabling **semantic duplicate detection across all 14 apps in under 50 milliseconds** — catching visually altered re-submissions of the same card that exact-match systems miss
- A **Behavioural Profiler** analysing transaction patterns
- **LangGraph orchestration** coordinating the agents, with **Apache Kafka** handling event ingestion at transaction scale

This is not chatbot work. This is multi-agent, vector-search, streaming-data fraud architecture in a live financial marketplace.

### 6.4 Analytics and decision support

Throughout, the analyst discipline continued:

- GMV, conversion, and lifecycle analytics (CLV, LTV, CAC, ARR, MRR, AOV) identifying revenue leakage, reported weekly to the CEO, CTO, VP, and Ops Head through Power BI dashboards
- Cohort and funnel analysis on transaction drop-offs feeding pricing and marketing adjustments
- Churn modelling from behavioural transaction data feeding proactive retention campaigns
- Automated reconciliation and reporting via Excel VBA/Macros and Power Query across high-volume daily transaction data
- CX quality work: agent scorecards, RCA on cancelled transactions, and UI/UX recommendations — including a redesign of the declined-transaction experience from flat rejection to a guided review flow, eliminating duplicate resubmissions and reducing escalations

---

## CHAPTER 7: THE INDEPENDENT BUILDER — SELECTED PROJECTS

### 7.1 Maritime Document Automation — Worldwide Chartering / Nautical Global Shipping FZE

Shipping documentation is a notoriously manual domain. Fauzan built a Python pipeline — pdfplumber, pandas, pytesseract, developed with Claude AI assistance — that extracts, validates, and standardises Bills of Lading, invoices, packing lists, and certificates into structured Excel output with automatic error flags.

**Verified result: 18 documents processed in 3 hours versus 18 hours previously — an 83% reduction in processing time.**

### 7.2 HarbourMind — high-performance document intelligence

Building on the maritime work, Fauzan developed HarbourMind, a FastAPI service using Gemini 2.5 Flash for document processing. The headline engineering achievement: re-architecting from sequential to **async batch processing, cutting run time from 547 seconds to 17 seconds — a 32x speedup** — while achieving **3.1% billing accuracy variance against the Marcura reference dataset**. This demonstrates not just AI integration, but performance engineering of AI systems.

### 7.3 Agentic Messaging Application (React Native)

He architected and built a full Android application: end-to-end encrypted messaging using TweetNaCl.js, a Firebase real-time backend, and SQLCipher on-device encrypted storage. Security architecture, mobile deployment, and agentic system design — built hands-on, AI-assisted.

### 7.4 fauzan.me — full-stack infrastructure ownership

His personal site, built with Claude assistance, including custom domain configuration, Cloudflare Email Routing, SPF/DMARC DNS records, and Gmail SMTP relay — small in scope, but evidence of comfort owning infrastructure end to end.

### 7.5 Internal Chrome plugins (Kobet)

Production-deployed browser plugins for knowledge base access, navigation efficiency, and agent workflow automation — extending the AI ecosystem into the human agents' daily workflow, so the AI layer and the human layer reinforced each other.

---

## CHAPTER 8: THE TOOLKIT — WHAT HE ACTUALLY WORKS WITH

**AI platforms and frameworks:** Anthropic Claude (primary platform — Claude API with tool use, Claude Code CLI, MCP server integration, SKILL.md authoring for Claude Cowork), GPT-4o, Gemini, LangGraph for multi-agent orchestration, Pinecone for vector search, Apache Kafka for streaming ingestion, FastAPI for AI service delivery, Crisp AI and 360.io for production conversational agents, Google Cloud Vision and Tesseract for OCR, Firebase for backend infrastructure. Python in an AI-assisted development style — he is a builder who uses AI to build, which is itself a demonstrated competency.

**Agentic design vocabulary he has applied in production:** multi-step orchestration, sub-agent patterns, human-in-the-loop approval gates, error recovery loops, canary rollouts, knowledge-base grounding, escalation logic, prompt injection defence, and KPI design for measuring agent performance.

**Data and BI:** Power BI executive dashboards, SQL, Advanced Excel (VBA/Macros, Power Query, Power Pivot), cohort and funnel analysis, churn modelling, OCR-to-structured-data pipelines.

**CRM and operations systems:** Salesforce, Freshdesk, Zoho, Sprinklr, Konnect Insight, LocoBuzz, Jira, Confluence, Trello; payment gateways including Stripe and Telr.

**Methodology:** Six Sigma Green Belt and Yellow Belt, DMAIC, RCA, FTA, Kaizen, CAPA, SPC, PDCA, swimlane mapping, PMP training (Cambridge Institute UAE), change management.

**Certifications:** Six Sigma Green Belt, Six Sigma Yellow Belt, PMP Training (Cambridge Institute UAE), SQL Proficiency, Claude 101 (Anthropic), AI Generalist certification, 2-Day AI Mastery Boot Camp (Digitilist Institute, Mumbai).

**Education:** MBA in Business Management (Welingkar Institute of Management and Research) and BBA in Computer Applications (Swami Vivekananda University).

**Languages:** English (native), Hindi/Urdu (native), Portuguese (proficient).

---

## CHAPTER 9: THE SYNTHESIS — WHY THIS PROFILE IS RARE

Most AI candidates fall into one of two camps. The first can talk about transformers but has never owned an SLA. The second has run operations for a decade but treats AI as a vendor checkbox. Fauzan sits in the narrow overlap:

1. **He has shipped AI under real constraints.** Compliance approval in a fintech. Canary rollouts. Daily audits. A self-learning experiment he had the discipline to pause. Twenty agents live, 83% cheaper than the alternatives, with the outcome metrics reported weekly to the C-suite.

2. **He measures everything, honestly.** The numbers in his story are specific and conservative: 30% workload reduction, 3–7% CSAT/NPS/CRR/FRT uplift, 15–20% fewer failed transactions, 83% document processing time saved, 32x async speedup, NPS 28-to-93. He actively corrects inflated figures — accuracy is a stated personal principle.

3. **He carries a process discipline most AI practitioners lack.** Six Sigma DMAIC is, in effect, an evaluation-and-iteration framework — and he applies it to AI agents the way he once applied it to delivery routes: define the metric, baseline it, change one thing, control the result.

4. **He bridges the human layer.** From 'Who Moved My Cheese' training for 80 staff in Mumbai to retraining Kobet's support team for AI-augmented workflows, he has repeatedly turned technology change into adopted change.

5. **He has range across the stack.** Vector databases and Kafka on one end; CSAT scorecards and escalation matrices on the other; Power BI to the C-suite in between. He can architect the agent, deploy it, govern it, measure it, and explain its ROI to a CEO — and he has done all five, in production, at a platform serving 700,000 users per app.

The through-line of the entire career: **find the truth in the data, redesign the system around it, automate what should be automated, govern what you automate, and prove the result with numbers.** That was true in 2016 with a Mumbai water supplier, and it is true in 2026 with multi-agent fraud detection in a Dubai fintech. The tools changed completely. The discipline never did.

---

## QUICK-REFERENCE TIMELINE (for the podcast script)

- **2016–2017** — Citibank US escalations via TCS, Mumbai: complex query handling, process documentation, promoted into specialised escalation team
- **Oct 2016 – Mar 2017** — Six Sigma DMAIC project, Hello Mineral Water: NPS 28%→93%, SLA 34%→88%, collections 45%→~70%, change training for 80+ staff
- **Dec 2018 – Dec 2020** — Hinduja Global Solutions Interactive, Mumbai: Disney+ Salesforce→Freshdesk zero-downtime migration; Sprinklr for Toyota India; Aster DM Healthcare CRM across 100+ facilities in 7 countries; FCR 46%→62% in 3 months; 10K emails/day, 200K social mentions, 2K calls/day; Walmart/Sam's Club US coordination; MindMaze European stakeholder work
- **Feb 2021 – Apr 2022** — Towr Portal, Dubai: Zoho CRM enquiry-to-order automation with 1-day SLA flagging; VBA reconciliation suite; B2B acquisition +120%; orders ~50→1,500/month
- **Apr 2022 – Jan 2024** — LiftMyCar, Dubai: 360.io conversational AI across WhatsApp/web/social with Zoho CRM + Stripe integration; B2B orders ~100→~500/month; booking flow 8→4-5 steps; CLV/LTV/CAC/MRR/AOV dashboards
- **Oct 2024 – Mar 2026** — Kobet Technologies DMCC, Dubai (14 apps, 150K+ monthly trades, 700K active users/app): 20 AI agents on Crisp, 83% cost reduction, 30% workload reduction, 3-7% CSAT/NPS/CRR/FRT uplift; OCR duplicate detection pipeline, 15-20% fewer failed transactions; fraud stack — Claude/GPT-4o Vision Agent, CLIP + Pinecone semantic duplicate detection across 14 apps in <50ms, Behavioural Profiler, LangGraph orchestration, Kafka ingestion
- **Independent projects** — Maritime document automation: 83% processing time reduction (18 docs, 3 hrs vs 18 hrs); HarbourMind: FastAPI + Gemini 2.5 Flash, 547s→17s (32x) async speedup, 3.1% billing accuracy vs Marcura reference; agentic E2E-encrypted React Native messaging app; fauzan.me full-stack deployment; production Chrome plugins at Kobet`;

      // 4. Craft the secret instructions for Gemini
      const prompt = `You are two funny, energetic AI podcast hosts named Alex and Sam.
Review this profile data about Fauzan: "${fauzanProfile}".
A website visitor just asked this question: "${question}".
Have a brief, 4-sentence dialogue answering the question directly based on his profile.
Format it strictly like this:
Alex: [response]
Sam: [response]`;

      // 5. Send everything to Google Gemini using your secret key
      if (!env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY secret is not set on this Worker.");
      }
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY.trim()}`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Gemini HTTP ${response.status}: ${rawText.slice(0, 300) || '(empty body)'}`);
      }
      if (!data.candidates || !data.candidates[0]) {
        throw new Error(data.error?.message || "Gemini returned no response: " + JSON.stringify(data));
      }
      const aiScript = data.candidates[0].content.parts[0].text;

      // 6. Send the finished script back to your website!
      return new Response(JSON.stringify({ script: aiScript }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
