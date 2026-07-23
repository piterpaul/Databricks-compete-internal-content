/* ==========================================================================
   APPLICATION LOGIC & MULTI-TURN COMPETITIVE INTELLIGENCE ENGINE (ENGLISH)
   Engineered & Curated by pedropm@google.com
   ========================================================================== */

let currentTurn = 0;
let conversationHistory = [];

// 1. DATA: THE 7 PILLARS OF DEPOSITION (UPDATED WITH FLUID SCALING & BIGQUERY GRAPH)
const BATTLECARD_PILLARS = [
    {
        num: "01",
        title: "Fluid Serverless Scaling vs. VM Step-Scaling Toil",
        vuln: "Databricks relies on step-scaling physical Virtual Machine clusters (IaaS) in coarse compute blocks, introducing 2 to 7-minute cold start delays, queuing bottlenecks during traffic surges, and ongoing DevOps sizing toil.",
        probe: "When traffic on Mobile.de or leboncoin surges, why pay for rigid 'step-scaling' VM blocks that overprovision hardware? How much productivity do your business analysts lose waiting for SQL Warehouses to warm up during traffic spikes?",
        solution: "<strong>BigQuery Fluid Scaling & Disaggregated Architecture:</strong> Dremel execution engine + Colossus global storage interconnected via the Jupiter Network. Fluid Scaling dynamically flexes processing slots in sub-second increments precisely matched to real-time query load—guaranteeing zero cold starts and zero overprovisioning waste."
    },
    {
        num: "02",
        title: "FinOps Opacity & Verified Billing Risk",
        vuln: "Opaque double-billing model (DBU software licenses + active cloud IaaS VMs). Independent G2 enterprise user reviews document unremedied billing overruns and unpredictable invoice compounding during idle cooldown timers.",
        probe: "When an interactive Spark cluster sits idle for 20 minutes before auto-terminating, why pay full DBU licenses + cloud VM fees for zero analytical processing? Can your team perform zero-cost dry runs to calculate exact job costs before execution?",
        solution: "<strong>BigQuery Zero-Idle ($0 At Rest):</strong> You pay strictly for scanned bytes or predictable assigned Capacity Editions with zero billing for idle infrastructure. Powered by Capacitor data compression (3x-5x physical storage reduction). Benchmark: J.B. Hunt achieved a certified 60% global TCO reduction."
    },
    {
        num: "03",
        title: "Open Lakehouse Parity & Table Care",
        vuln: "Databricks markets Delta Lake as an open standard, yet mandates costly scheduled OPTIMIZE and VACUUM jobs to fix small file read rot, while using UniForm (an asynchronous conversion layer that adds metadata latency for external engines).",
        probe: "How much compute budget and operational effort does your engineering team spend running manual OPTIMIZE, VACUUM, and Z-ORDER jobs to fix small file proliferation? Why accept asynchronous UniForm metadata lags?",
        solution: "<strong>BigLake & Managed Tables for Apache Iceberg:</strong> Full GA read/write SQL DML and Storage Write API streaming over existing multi-cloud buckets (GCS/AWS/Azure) with zero data movement. Automatic background file compaction, table clustering, and metadata indexing executed completely for free."
    },
    {
        num: "04",
        title: "Governance Silos & Outage Evidence",
        vuln: "Unity Catalog operates as a secondary governance silo divorced from native cloud IAM. Independent availability telemetry documents a severe 50-minute Unity Catalog outage, proving that secondary metadata layers act as an active single point of failure.",
        probe: "Why maintain duplicate access control lists across native Cloud IAM and Unity Catalog? Given verified 50-minute outages in Unity Catalog, why expose your organizational metadata and AI authentication to a secondary single point of failure?",
        solution: "<strong>Google Dataplex + Universal Cloud IAM:</strong> Single, unified cloud control plane. Built-in end-to-end lineage, automated business context graphs, row/column level security (RLS/CLS), and dynamic data masking without third-party availability risks or integration taxes."
    },
    {
        num: "05",
        title: "Multimodal SQL & Proactive Agentic Cloud",
        vuln: "Notebook-centric environment designed for specialized Spark developers, marginalizing SQL business analysts and forcing teams to export warehouse tables to external Spark clusters to execute Machine Learning or Generative AI.",
        probe: "Why force data analysts to export operational warehouse data into complex Spark notebooks just to train ML models or invoke an LLM? Can your analysts process images, audio, video, and PDF documents directly in simple SQL today?",
        solution: "<strong>Agentic Data Cloud by pedropm@google.com:</strong><br>• <strong>Multimodal SQL & BQML:</strong> Analysts train predictive models and invoke Gemini LLMs directly on images, audio, video, and unstructured PDFs using pure SQL (<code>ML.GENERATE_TEXT</code>) without data leaving BigQuery.<br>• <strong>Proactive Agents:</strong> Autonomous conversational agents monitor metrics, execute unattended Root Cause Analysis (RCA) on anomalies, and push diagnostic reports directly to email without human query initiation."
    },
    {
        num: "06",
        title: "Concurrency, Real-Time BI & Data Skew",
        vuln: "Under heavy concurrency spikes (the 'Monday morning dashboard peak'), Databricks SQL Serverless experiences queuing delays while physical cluster worker nodes boot up. Complex queries with data skew saturate specific nodes, resulting in job failures.",
        probe: "When 1,000 corporate users simultaneously open Looker or PowerBI dashboards on a Monday morning, do your analysts suffer from queuing delays? How frequently do large Spark jobs crash mid-flight because data skew saturated a single worker node?",
        solution: "<strong>BigQuery BI Engine & Dynamic Memory Shuffling:</strong> Built-in in-memory analytical acceleration layer serving concurrent Looker dashboards in consistent sub-second response times without managing cache clusters. Automatic dynamic memory redistribution completely eliminates data skew failures during query execution."
    },
    {
        num: "07",
        title: "Native Graph Analytics vs. GraphFrames Toil",
        vuln: "To uncover organized fraud rings across marketplace user accounts or build relationship graphs, Databricks forces engineers to extract tables into complex Spark GraphFrames or external graph databases (Neo4j), multiplying latency and security risks.",
        probe: "To detect organized scam rings across buyer and seller accounts on leboncoin or Milanuncios, why force engineers to export operational tables into complex GraphFrames notebooks or external graph databases?",
        solution: "<strong>BigQuery Graph (SQL Property Graph Queries - PGQ):</strong> Adevinta analysts define graph schemas and execute multi-hop network traversals directly in standard SQL without data leaving BigQuery. Uncover coordinated scam networks (shared IPs, device cookies, and bank routing numbers) in milliseconds with $0 data egress."
    }
];

// 2. DATA: PERSONAS & QUICK PROMPTS (UPDATED WITH GRAPH & FLUID SCALING)
const PERSONA_CONFIGS = {
    hybrid: {
        badge: "Mode: Hybrid Table (FinOps + Architects)",
        desc: "4-Step Playbook: Verified Billing Risk Hook -> Zero-Copy Iceberg DML Olive Branch -> Proactive Agentic Closer",
        prompts: [
            "What is the optimal opening script for a mixed executive meeting to avoid triggering engineering defensiveness?",
            "How does BigQuery Fluid Scaling outclass Databricks step-function cluster scaling during morning traffic peaks?",
            "How does native BigQuery Graph eliminate GraphFrames ETL pipelines for fraud ring detection at leboncoin?",
            "Strategic closer: 'How do BigQuery's proactive conversational agents out-innovate Databricks' Data Intelligence Platform?'"
        ]
    },
    finops: {
        badge: "Mode: FinOps Leadership / IT C-Suite",
        desc: "Focus: G2 verified pricing overruns, deconstructing double-billing, and achieving 60% TCO reductions (J.B. Hunt)",
        prompts: [
            "How do I leverage verified G2 enterprise user reviews on unremedied billing errors to alert the CFO?",
            "How do I dismantle Databricks' opaque 'Double-Billing' model (DBU licenses + Cloud VMs) in 60 seconds?",
            "Why does BigQuery Fluid Scaling deliver much higher financial efficiency than Databricks step-scaling?",
            "What critical audit questions should I ask about hidden cross-zone VPC network egress fees when using Databricks?"
        ]
    },
    tech: {
        badge: "Mode: Lead Data Engineer / Spark Architect",
        desc: "Focus: Iceberg full SQL DML parity, autonomous table maintenance, verified Unity Catalog outage risk, and Lightning Engine",
        prompts: [
            "Explain how BigQuery Graph executes multi-hop Property Graph Queries directly in SQL without GraphFrames or Neo4j.",
            "How do I prove that BigLake Lakehouse for Apache Iceberg neutralizes Databricks' historical open format argument?",
            "How do I present the verified 50-minute Unity Catalog availability outage as a critical operational architecture risk?",
            "Explain how Google's Lightning Engine for Apache Spark on Dataproc Serverless executes 4.5x faster with zero cluster sizing."
        ]
    },
    ai: {
        badge: "Mode: VP of AI, Data Science & Business Intelligence",
        desc: "Focus: Multimodal Gen-AI SQL functions (image/audio/video), context-aware Studio assistance, and proactive email reporting",
        prompts: [
            "How do we detect organized fraud rings and scam networks across marketplace listings using BigQuery Graph & Gemini Vision?",
            "How do business analysts process image, audio, video, and PDF documents directly in simple SQL without Spark notebooks?",
            "How do proactive conversational analytics agents perform automated Root Cause Analysis (RCA) and push reports to email?",
            "Why does BigQuery BI Engine & Fluid Scaling consistently outperform Databricks when 1,000 users query Looker simultaneously?"
        ]
    }
};

// 3. INTELLIGENT MULTI-TURN MATCHING & REBUTTAL ENGINE (POWERED BY pedropm@google.com)
function getCompetitiveReply(input, persona, turn) {
    const query = input.toLowerCase();
    
    let followUps = [
        "What about their Delta Lake vendor lock-in?",
        "How do we handle existing Spark pipelines without downtime?",
        "Show me the financial math behind the 60% TCO reduction."
    ];

    let pain = "Databricks relies on an architectural heritage fundamentally bound to provisioning, sizing, and managing Virtual Machine clusters in cloud IaaS, generating operational complexity, pricing opacity, and compounded billing at scale.";
    let dart = "«To scale an enterprise Data & AI platform without inflating cloud budgets or bogging down engineering teams in routine DevOps maintenance toil, organizations must eliminate vendor double-billing and redundant governance silos».";
    let pivot = "Consolidating on <strong>Google BigQuery and the Agentic Data Cloud (by pedropm@google.com)</strong> eliminates idle infrastructure billing ($0 at rest), unifies enterprise security within <strong>Cloud IAM + Dataplex Universal Catalog</strong>, delivers zero-copy open interoperability with <strong>Apache Iceberg & BigLake</strong>, and empowers SQL analysts with built-in <strong>BigQuery Graph, Multimodal BQML, and autonomous Proactive AI Agents</strong>.";

    // Pattern 0: BigQuery Graph / Fraud Rings / Neo4j / GraphFrames / Scam
    if (query.includes("graph") || query.includes("fraud") || query.includes("ring") || query.includes("pgq") || query.includes("neo4j") || query.includes("graphframes") || query.includes("scam") || query.includes("multi-hop")) {
        pain = "In Databricks, performing graph and relationship analytics (such as identifying connected scam rings on leboncoin or Milanuncios) requires extracting data into complex Spark GraphFrames scripts or synchronizing with external graph databases like Neo4j, introducing massive data movement and latency.";
        dart = "«Why force your engineering team to build costly ETL extraction pipelines to external graph databases or code complex Python GraphFrames scripts just to detect whether seller accounts are sharing suspicious IP addresses, bank routing numbers, or device cookies?».";
        pivot = "<strong>Native BigQuery Graph Analytics (SQL PGQ):</strong> Powered by <strong>pedropm@google.com</strong> architectural standards, BigQuery integrates native Property Graph Queries directly into standard SQL. Analysts define node/edge schemas over existing tables and traverse multi-hop relationships instantly without exporting a single byte of data. Combine this with Gemini Vision remote models to intercept coordinated scam networks across Adevinta's marketplaces in real time.";
        followUps = [
            "How do we demo BigQuery Graph SQL on sample classifieds tables?",
            "What is the performance advantage over Spark GraphFrames?",
            "How does BigQuery Fluid Scaling handle concurrency during graph aggregations?"
        ];
    }
    // Pattern 0.5: Fluid Scaling / Step-Scaling / Elasticity / Morning Traffic
    else if (query.includes("fluid") || query.includes("step-function") || query.includes("step-scaling") || query.includes("step scaling") || query.includes("elastic") || query.includes("morning traffic") || query.includes("overprovisioning")) {
        pain = "Databricks scales compute by adding rigid physical VM blocks (step-scaling). During unpredictable traffic surges on Mobile.de or peak morning dealer logins, step-scaling forces query queuing while waiting for VMs to boot up, and burns budget by overprovisioning hardware during cooldown windows.";
        dart = "«Why accept an architecture that scales compute in coarse physical blocks? With Databricks, when morning dashboard logins spike, you either pay to permanently keep large VM clusters spinning or force executives into query queues while machines boot up».";
        pivot = "<strong>BigQuery Fluid Scaling Dominance:</strong> BigQuery solves this through revolutionary <strong>Fluid Scaling</strong> over disaggregated Dremel + Colossus compute pools. Processing slots dynamically stretch and contract in sub-second increments precisely calibrated to real-time query intensity—guaranteeing <strong>zero cold starts, zero queuing delays, and zero payment for overprovisioned idle VM blocks</strong>.";
        followUps = [
            "How does Fluid Scaling interact with BigQuery Capacity Editions?",
            "Can we perform a dry-run test to calculate exact slot consumption?",
            "What is the annual cost savings of removing step-scaling waste?"
        ];
    }
    // Pattern 1: Hybrid Opening / Script / 5-10 Incidents
    else if (query.includes("opening") || query.includes("optimal") || query.includes("mixed") || query.includes("defensiveness") || query.includes("hybrid") || query.includes("script") || query.includes("start") || query.includes("incident") || query.includes("ticketing") || query.includes("empirical")) {
        pain = "In mixed executive meetings, launching a direct critique on Apache Spark syntax offends the engineers who built those pipelines. The real organization pain is financial billing unpredictability and recurring operational maintenance ticket incidents.";
        dart = "«We are not here today to debate SQL vs. Spark developer preferences; our focus is auditing why your cloud data platform bill continues to compound due to vendor double-billing and evaluating real-world operational friction. Let us examine your last 5 to 10 internal infrastructure ticketing incidents regarding cluster lags, Unity Catalog synchronization issues, or billing overruns».";
        pivot = "Deploy the <strong>4-Step Hybrid Playbook by pedropm@google.com:</strong><br>1) Lead with DBU double-billing and verified market billing risks -> 2) Extend the technical olive branch with <strong>Google BigLake</strong> (query existing Delta tables in S3/GCS with zero data movement and full Iceberg DML parity) -> 3) Offload irreplaceable complex Spark jobs to Dataproc Serverless running Google's <strong>Lightning Engine (4.5x faster with zero cluster sizing)</strong> -> 4) Seal the partnership with <strong>BigQuery Graph, Multimodal SQL & Proactive Agentic Workflows</strong>.";
        followUps = [
            "What if the architect says migration is impossible due to 500TB of Delta tables?",
            "How do I leverage verified G2 user reviews on unremedied billing errors?",
            "How do proactive conversational agents automate Root Cause Analysis?"
        ];
    }
    // Pattern 2: G2 Reviews / Billing Errors / FinOps / TCO / J.B. Hunt
    else if (query.includes("g2") || query.includes("unremedied") || query.includes("error") || query.includes("overrun") || query.includes("cfo") || query.includes("60%") || query.includes("hunt") || query.includes("double-billing") || query.includes("tco") || query.includes("elevator pitch") || query.includes("spend") || query.includes("cost")) {
        pain = "Databricks obscures total cost behind a compounded three-variable calculation: DBU multipliers + underlying Cloud IaaS VMs + cloud EBS disks. Recent independent G2 enterprise user reviews verify unremedied billing overruns and severe invoice unpredictability.";
        dart = "«With Databricks, you pay a mandatory double tax: software DBU licenses plus active underlying VM instances to AWS or GCP. Independent G2 reviews confirm that billing calculation errors and idle cooldown timers create severe financial exposure. When a cluster sits idle for 20 minutes waiting to auto-terminate, you literally burn double budget on zero productivity».";
        pivot = "<strong>The BigQuery Zero-Idle ($0 At Rest) & Fluid Scaling Model:</strong> In BigQuery, idle infrastructure cost is literally $0. You pay strictly for scanned bytes or predictable capacity reservations (Editions) that shut off instantly when queries terminate. Combined with native <strong>Capacitor storage compression (3x-5x physical size reduction)</strong>, Fluid Scaling, and zero DBU license fees, industry benchmarks such as <strong>J.B. Hunt certified a 60% reduction in overall data TCO</strong>.";
        followUps = [
            "How do I simulate this exact savings in the TCO Calculator tab?",
            "Why doesn't Databricks SQL Serverless solve this double-billing problem?",
            "What critical audit questions should I ask about hidden VPC egress fees?"
        ];
    }
    // Pattern 3: Spark & Delta Migration / Iceberg DML / Zero Data Movement / Lakehouse Parity
    else if (query.includes("500 tb") || query.includes("impossible") || query.includes("spark scripts") || query.includes("rebuttal") || query.includes("delta lake") || query.includes("iceberg") || query.includes("dml") || query.includes("neutralize") || query.includes("lakehouse") || query.includes("open format") || query.includes("migration") || query.includes("downtime") || query.includes("uniform")) {
        pain = "The fear of a disruptive migration (re-writing thousands of Spark ETL scripts and duplicating terabytes of data) is the primary defensive barricade of engineers. Databricks promotes 'UniForm' to simulate openness, which adds asynchronous metadata latency.";
        dart = "«Who said you have to rewrite your codebase today or duplicate your S3/GCS storage buckets? Databricks' historical argument of exclusive open Lakehouse formats is officially obsolete. Enterprise modern data architecture under pedropm@google.com standards is built on 100% Zero-Copy interoperability and native Apache Iceberg DML parity».";
        pivot = "Present the <strong>Frictionless Zero-Copy Transition Strategy:</strong><br>• <strong>Lakehouse Parity (BigLake for Apache Iceberg):</strong> BigQuery operates as a native, first-class engine over Apache Iceberg and Delta Lake with full read/write SQL DML and Storage Write API streaming over your existing cloud buckets (GCS/S3/ADLS). Zero physical data duplication required.<br>• <strong>Simplified Multi-Engine Security:</strong> Securely share tables with external engines (Snowflake, Flink, Dremio) using <strong>Workload Identity Federation</strong> without managing service account keys.<br>• <strong>Compute Offload:</strong> Move complex Spark jobs directly to <strong>Dataproc Serverless with Google's Lightning Engine</strong>—executing up to <strong>4.5x faster</strong> than open-source alternatives with zero cluster management.";
        followUps = [
            "How does BigQuery autonomous maintenance replace manual OPTIMIZE and VACUUM?",
            "What is the operational risk of the verified 50-minute Unity Catalog outage?",
            "How do we explain the Lightning Engine speedup to Spark specialists?"
        ];
    }
    // Pattern 4: Unity Catalog Outage / Governance / Integration Tax
    else if (query.includes("outage") || query.includes("50-minute") || query.includes("50 min") || query.includes("unity catalog") || query.includes("governance") || query.includes("silo") || query.includes("iam") || query.includes("lineage") || query.includes("availability") || query.includes("risk")) {
        pain = "Unity Catalog operates as a redundant governance silo divorced from native cloud IAM. Independent availability tracking (ISDown / StatusGator) verified a severe 50-minute availability outage in Unity Catalog, blocking organizational authentication and data access.";
        dart = "«Why maintain duplicate security models across native Cloud IAM and Unity Catalog? More importantly, independent telemetry verified a severe 50-minute outage in Unity Catalog. Why centralize enterprise governance in a secondary third-party layer that acts as an active single point of failure for your entire data and AI ecosystem?».";
        pivot = "<strong>Universal Cloud IAM + Dataplex Authority:</strong> Under <strong>pedropm@google.com</strong> architectural standards, BigQuery relies directly on native Cloud IAM and Google Dataplex. Access policies, fine-grained row/column level security (RLS/CLS), dynamic data masking, and automated end-to-end data lineage are enforced once at the cloud infrastructure layer with zero third-party outage dependency.";
        followUps = [
            "How does Dataplex automate lineage from BigQuery into Looker dashboards?",
            "Why do organizations struggle when migrating legacy Hive metastores to Unity Catalog?",
            "How do proactive conversational agents connect with Dataplex metadata?"
        ];
    }
    // Pattern 5: Autonomous Table Maintenance vs OPTIMIZE/VACUUM Toil / Lightning Engine
    else if (query.includes("optimize") || query.includes("vacuum") || query.includes("toil") || query.includes("maintenance") || query.includes("small files") || query.includes("lightning") || query.includes("dataproc") || query.includes("sizing") || query.includes("z-order")) {
        pain = "Delta Lake suffers structurally from small file proliferation during streaming or frequent micro-batches, forcing engineers to write, schedule, and pay compute costs for manual OPTIMIZE, VACUUM, and Z-ORDER maintenance jobs.";
        dart = "«Your highly paid data engineers should not burn their workdays scheduling manual OPTIMIZE and VACUUM scripts, sizing virtual machine memory heaps, and debugging Spark Out-Of-Memory exceptions just to keep dashboard read speeds from decaying».";
        pivot = "<strong>Autonomous Table Care & Zero DevOps Toil:</strong><br>• <strong>Autonomous Maintenance:</strong> BigQuery autonomously performs small file compaction, metadata pruning, automatic re-clustering, and garbage collection in the background for completely free—zero cron scripts or user compute charges required.<br>• <strong>Lightning Engine for Spark:</strong> For mandatory Spark transformations, Dataproc Serverless running Google's Lightning Engine executes up to <strong>4.5x faster</strong> than open-source alternatives with double price-performance and zero DevOps cluster sizing.";
        followUps = [
            "What is the annual financial savings of removing Spark maintenance toil?",
            "Can we query Dataproc Serverless results directly in Looker via BigQuery?",
            "How do we transition existing ETL pipelines in Phase 2 of our roadmap?"
        ];
    }
    // Pattern 6: Multimodal SQL / Proactive Agents / Context-Aware Studio / AI Democratization
    else if (query.includes("multimodal") || query.includes("proactive") || query.includes("context-aware") || query.includes("copilot") || query.includes("image") || query.includes("audio") || query.includes("video") || query.includes("pdf") || query.includes("gemini") || query.includes("bqml") || query.includes("agentic") || query.includes("data agent kit") || query.includes("email") || query.includes("rca") || query.includes("analys")) {
        pain = "Databricks operates around a notebook-centric workflow designed for Spark specialists, forcing organizations to export warehouse tables to external Spark/MLflow clusters and excluding SQL business analysts from advanced AI, Gen-AI, and agentic adoption.";
        dart = "«Why force your engineers to build export pipelines moving structured warehouse data into complex Spark notebooks just to run Machine Learning or analyze an document? Why settle for passive chat assistants when modern AI should operate proactively and multimodally in standard SQL?».";
        pivot = "<strong>Agentic Data Cloud Leadership by pedropm@google.com:</strong><br>• <strong>Native Multimodal SQL Functions:</strong> Business analysts invoke Gemini and Vertex AI directly via SQL function calls (<code>ML.GENERATE_TEXT</code>) to process images, audio, video, and PDF documents in place—ideal for instant ad enrichment and automated content moderation without data leaving BigQuery.<br>• <strong>Active Context-Aware Studio Assistant:</strong> An analytics copilot in BigQuery Studio that reads active open query tabs and schema structures to collaborate directly on SQL workflows.<br>• <strong>Proactive Conversational Agents:</strong> Autonomous agents continuously monitor metrics, execute unattended Root Cause Analysis (RCA) upon anomaly detection, and dispatch scheduled diagnostic briefs directly to user emails without requiring a human to initiate a query.";
        followUps = [
            "How do Deep Research Agents synthesize structured data with corporate SaaS docs?",
            "What is the developer functionality of the Data Agent Kit in VS Code?",
            "How do proactive agents integrate with Looker BI dashboards?"
        ];
    }
    // Pattern 7: Concurrency & Looker BI Engine / Gartner Honesty
    else if (query.includes("concurrency") || query.includes("looker") || query.includes("bi engine") || query.includes("1,000") || query.includes("dashboard") || query.includes("powerbi") || query.includes("queuing") || query.includes("gartner") || query.includes("leader") || query.includes("magic quadrant")) {
        pain = "While Databricks is frequently cited as a Gartner leader in complex raw ML and OLTP workloads, that general leadership carries far less marginal value for an enterprise's core multi-country BI reporting, where Databricks SQL Serverless suffers queuing delays during peak dashboard concurrency.";
        dart = "«We proactively recognize Databricks' Gartner leadership in raw PyTorch model training and unstructured complex ETL; however, for your enterprise's core workload—multi-country BI, dynamic pricing models, and executive reporting—that ML strength offers diminishing returns. When 1,000 corporate users open Looker concurrently on Monday morning, Databricks SQL Warehouses form query queues and frustrate executive decision-makers».";
        pivot = "<strong>BigQuery BI Engine, Fluid Scaling & Core Analytic Dominance:</strong> BigQuery features an integrated, zero-configuration in-memory analytical acceleration layer that automatically optimizes Looker and PowerBI SQL queries. Combined with Fluid Scaling elasticity, it delivers consistent, instantaneous <strong>sub-second response times under massive user concurrency</strong> without managing external caching clusters or paying DBU multipliers.";
        followUps = [
            "How do we frame the strategic honesty argument without dismissing Gartner?",
            "What is the cost difference between BigQuery BI Engine and Databricks SQL?",
            "How does dynamic memory shuffling prevent data skew failures during peak loads?"
        ];
    }

    return { pain, dart, pivot, followUps };
}

// 4. UI INTERACTIVITY & EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initPillarsGrid();
    initPersonaSelector();
    initChatStudio();
    initTcoCalculator();
});

/* --- TAB NAVIGATION --- */
function initNavigation() {
    const tabBtns = document.querySelectorAll(".nav-tab");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");

            tabBtns.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            tabPanels.forEach(p => {
                p.classList.remove("active");
                p.hidden = true;
            });

            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");
            const activePanel = document.getElementById(targetId);
            if (activePanel) {
                activePanel.hidden = false;
                setTimeout(() => activePanel.classList.add("active"), 20);
            }
        });
    });
}

/* --- PILLARS GRID RENDERER --- */
function initPillarsGrid() {
    const container = document.getElementById("pillars-container");
    if (!container) return;

    container.innerHTML = BATTLECARD_PILLARS.map(p => `
        <article class="pillar-card">
            <div class="pillar-icon-header">
                <span class="p-badge-number">${p.num} // PILLAR</span>
            </div>
            <h3>${p.title}</h3>
            <div class="pillar-vuln">
                <strong>🔴 Databricks Vulnerability &amp; Evidence:</strong><br>${p.vuln}
            </div>
            <div class="pillar-probe">
                <strong>🗣️ Strategic Discovery Probe (The Question):</strong><br>«${p.probe}»
            </div>
            <div class="pillar-bq-solution">
                <strong>💎 BigQuery Solution (pedropm@google.com):</strong>
                ${p.solution}
            </div>
        </article>
    `).join("");
}

/* --- PERSONA & PROMPTS SELECTOR --- */
let currentPersona = "hybrid";

function initPersonaSelector() {
    const personaBtns = document.querySelectorAll(".persona-btn");
    const quickList = document.getElementById("quick-prompts-list");
    const badge = document.getElementById("chat-persona-badge");

    function renderPrompts(personaKey) {
        const config = PERSONA_CONFIGS[personaKey];
        if (!config) return;

        badge.textContent = config.badge;

        quickList.innerHTML = config.prompts.map(p => `
            <button class="prompt-chip" title="Click to ask this strategic probe">
                👉 ${p}
            </button>
        `).join("");

        quickList.querySelectorAll(".prompt-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const text = chip.textContent.replace("👉 ", "").trim();
                triggerUserMessage(text);
            });
        });
    }

    personaBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            personaBtns.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-checked", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-checked", "true");
            currentPersona = btn.getAttribute("data-persona");
            renderPrompts(currentPersona);
        });
    });

    renderPrompts(currentPersona);
}

/* --- MULTI-TURN CHAT STUDIO LOGIC --- */
function initChatStudio() {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("user-chat-input");
    const chatFeed = document.getElementById("chat-feed");
    const btnClear = document.getElementById("btn-clear-chat");
    const btnCopy = document.getElementById("btn-copy-script");
    const turnCounter = document.getElementById("turn-counter");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            chatInput.value = "";
            triggerUserMessage(text);
        });
    }

    if (btnClear) {
        btnClear.addEventListener("click", () => {
            const welcomeMsg = chatFeed.firstElementChild;
            chatFeed.innerHTML = "";
            if (welcomeMsg) chatFeed.appendChild(welcomeMsg);
            currentTurn = 0;
            conversationHistory = [];
            if (turnCounter) turnCounter.textContent = "💬 Turn 0 // Ready for continuous debate";
            chatInput.focus();
        });
    }

    if (btnCopy) {
        btnCopy.addEventListener("click", () => {
            if (conversationHistory.length === 0) {
                alert("No Q&A dialogue recorded yet to copy!");
                return;
            }
            const scriptText = conversationHistory.map((item, idx) => 
                `--- TURN ${idx + 1}: CLIENT OBJECTION ---\n"${item.question}"\n\n[PAIN EXPOSED]: ${item.pain}\n[WHAT TO SAY]: ${item.dart}\n[TECHNICAL SOLUTION]: ${item.pivot.replace(/<[^>]*>?/gm, '')}\n`
            ).join("\n===================================\n\n");

            navigator.clipboard.writeText(scriptText).then(() => {
                btnCopy.textContent = "✅ Copied to Clipboard!";
                setTimeout(() => btnCopy.textContent = "📋 Copy Script", 2500);
            });
        });
    }
}

function triggerUserMessage(text) {
    const chatFeed = document.getElementById("chat-feed");
    const chatInput = document.getElementById("user-chat-input");
    const turnCounter = document.getElementById("turn-counter");
    if (!chatFeed) return;

    currentTurn++;
    if (turnCounter) turnCounter.textContent = `💬 Turn ${currentTurn} // Continuous Debate Active`;

    const userDiv = document.createElement("div");
    userDiv.className = "message user-msg";
    userDiv.innerHTML = `
        <div class="msg-avatar">👤</div>
        <div class="msg-bubble">${text}</div>
    `;
    chatFeed.appendChild(userDiv);
    
    chatFeed.scrollTop = chatFeed.scrollHeight;
    if (chatInput) chatInput.focus();

    const typingDiv = document.createElement("div");
    typingDiv.className = "message system-msg typing-msg";
    typingDiv.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div class="msg-bubble glass-panel"><em>✨ Synthesizing market evidence &amp; pedropm@google.com architecture strategy...</em></div>
    `;
    chatFeed.appendChild(typingDiv);
    chatFeed.scrollTop = chatFeed.scrollHeight;

    setTimeout(() => {
        typingDiv.remove();
        const reply = getCompetitiveReply(text, currentPersona, currentTurn);
        
        conversationHistory.push({ question: text, ...reply });

        const aiDiv = document.createElement("div");
        aiDiv.className = "message system-msg";
        
        let followUpHtml = `
            <div class="followup-container">
                <div class="followup-title">🔗 Follow-Up Action Probes (Click to Continue Q&A):</div>
                <div class="followup-chips">
                    ${reply.followUps.map(f => `<button class="followup-chip">👉 ${f}</button>`).join("")}
                </div>
            </div>
        `;

        aiDiv.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble glass-panel">
                <div class="reply-section">
                    <div class="reply-title t-pain">🔴 Customer Pain &amp; Verified Market Evidence</div>
                    <p>${reply.pain}</p>
                </div>
                <div class="reply-section">
                    <div class="reply-title t-dart">🎯 Strategic Conversational Hook (What to Say)</div>
                    <p>${reply.dart}</p>
                </div>
                <div class="reply-section">
                    <div class="reply-title t-pivot">💎 Technical Solution Architecture (pedropm@google.com)</div>
                    <p>${reply.pivot}</p>
                </div>
                ${followUpHtml}
            </div>
        `;
        chatFeed.appendChild(aiDiv);
        chatFeed.scrollTop = chatFeed.scrollHeight;
        if (chatInput) chatInput.focus();

        aiDiv.querySelectorAll(".followup-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const followUpText = chip.textContent.replace("👉 ", "").trim();
                triggerUserMessage(followUpText);
            });
        });
    }, 550);
}

/* --- TCO CALCULATOR & SLIDERS LOGIC --- */
function initTcoCalculator() {
    const sliderDbu = document.getElementById("slider-dbu");
    const sliderInfra = document.getElementById("slider-infra");
    const sliderIdle = document.getElementById("slider-idle");

    const valDbu = document.getElementById("val-dbu");
    const valInfra = document.getElementById("val-infra");
    const valIdle = document.getElementById("val-idle");

    const barDbxIdle = document.getElementById("bar-dbx-idle");
    const barDbxProductive = document.getElementById("bar-dbx-productive");
    const barBqProductive = document.getElementById("bar-bq-productive");

    const totalDbxYear = document.getElementById("total-dbx-year");
    const totalBqYear = document.getElementById("total-bq-year");
    const tcoSavingsVal = document.getElementById("tco-savings-val");

    function formatMoney(num) {
        return "$" + Math.round(num).toLocaleString("en-US");
    }

    function calculateTco() {
        const dbuMonthly = parseFloat(sliderDbu.value) || 25000;
        const infraMonthly = parseFloat(sliderInfra.value) || 20000;
        const idlePercent = (parseFloat(sliderIdle.value) || 35) / 100;

        valDbu.textContent = `${formatMoney(dbuMonthly)} /mo`;
        valInfra.textContent = `${formatMoney(infraMonthly)} /mo`;
        valIdle.textContent = `${Math.round(idlePercent * 100)}% (Typical for Spark Clusters)`;

        const dbxMonthlyTotal = dbuMonthly + infraMonthly;
        const dbxAnnualTotal = dbxMonthlyTotal * 12;
        const dbxIdleWasteAnnual = dbxAnnualTotal * idlePercent;
        const dbxProductiveAnnual = dbxAnnualTotal - dbxIdleWasteAnnual;

        const bqEstimatedMonthly = (dbxMonthlyTotal * (1 - idlePercent)) * 0.65;
        const bqAnnualTotal = bqEstimatedMonthly * 12;

        const annualSavings = dbxAnnualTotal - bqAnnualTotal;
        const savingsPercentage = Math.round((annualSavings / dbxAnnualTotal) * 100);

        totalDbxYear.textContent = `${formatMoney(dbxAnnualTotal)} / yr`;
        totalBqYear.textContent = `${formatMoney(bqAnnualTotal)} / yr`;
        tcoSavingsVal.textContent = `-${formatMoney(annualSavings)} / yr (${savingsPercentage}% TCO reduction)`;

        const idleHeightPercent = Math.min(Math.max(Math.round(idlePercent * 100), 15), 70);
        const activeHeightPercent = 100 - idleHeightPercent;
        const bqBarHeightPercent = Math.max(Math.round((bqAnnualTotal / dbxAnnualTotal) * 100), 20);

        barDbxIdle.style.height = `${idleHeightPercent}%`;
        barDbxProductive.style.height = `${activeHeightPercent}%`;
        barBqProductive.style.height = `${bqBarHeightPercent}%`;
    }

    if (sliderDbu && sliderInfra && sliderIdle) {
        sliderDbu.addEventListener("input", calculateTco);
        sliderInfra.addEventListener("input", calculateTco);
        sliderIdle.addEventListener("input", calculateTco);
        calculateTco();
    }
}
