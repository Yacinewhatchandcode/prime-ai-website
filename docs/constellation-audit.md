# PRIME-AI route audit

Audit against the Sovereign Constellation Upgrade spec (2026-10-03). “Rewrite” means retain the route but update its content, hierarchy, metadata, and role to match PRIME-AI as the sovereign infrastructure layer. Internal consoles remain distinct from the public story and must not imply unverified live capabilities.

| Route | Purpose | Issues | Action |
|---|---|---|---|
| `/` | Main PRIME-AI entry point (`Vision`) | Former generic hero did not explain sovereignty, infrastructure boundaries, or the constellation role. | Keep; rewritten as the sovereign-infrastructure homepage. |
| `/vision` | Legacy PRIME-AI vision landing page | Duplicated `/` and split canonical/navigation signals. | Merge; redirects to `/`. |
| `/technologie` | Technology and architecture overview | Former copy included unsupported absolutes and performance claims. | Rewrite; now explains the configurable models → memory → governed agents → execution path. |
| `/ecosysteme` | PRIME-AI products and deployment ecosystem | Former copy implied universal synchronization/offline behavior and blurred product boundaries. | Rewrite; now describes the distinct research, infrastructure and execution roles. |
| `/sovereign-ai` | Sovereignty principles and deployment choices | Former copy made broad privacy claims without explaining data location, access control, or optional providers. | Rewrite; now defines sovereignty through qualified deployment choices. |
| `/multi-agent-systems` | Agent orchestration concepts | Former copy promised flawless synchronization and instant automation. | Rewrite; now explains bounded roles, tools, approvals and auditability. |
| `/enterprise-ai-orchestration` | Enterprise workflow orchestration | Former copy blurred infrastructure and operational application promises. | Rewrite; now focuses on governed integrations and links execution to AMLAZR. |
| `/yace-aura` | Yace Aura assistant / control surface | Separate product identity and unclear relationship to PRIME-AI; console-style live status needs verification. | Rewrite; label as an internal/preview console and connect it to the sovereign platform. |
| `/orb` | ORB subsystem interface | Duplicates the home/architecture story if treated as a public product page; demo/live status is unclear. | Keep; label demo or live status accurately and add infrastructure context. |
| `/orchestration` | Multi-agent fleet orchestration console | Similar promise to `/multi-agent-systems`; operational telemetry may be simulated. | Keep; make it a clearly identified console and distinguish it from the public explainer. |
| `/media` | Media command center | Narrow internal capability with no standalone public positioning; unclear production status. | Keep; identify as a console/demo and avoid unsupported operational claims. |
| `/whatsapp` | WhatsApp agent integration interface | Integration availability, permissions, and live connectivity are unclear. | Keep; disclose demo/integration status and required account permissions. |
| `/memory` | Memory subsystem interface | “Absolute/perfect” memory wording elsewhere overpromises; data retention and storage boundaries are not explicit. | Keep; explain storage location, retention, and controls. |
| `/factory` | Agent/product factory interface | Could be mistaken for a shipped product; relation to governed deployment is unclear. | Keep; label preview state and describe review/deployment controls. |
| `/amlazr` | AMLAZR operational arena preview | Correctly points toward execution, but the route lives inside PRIME-AI and may imply both brands are the same product. | Rewrite; position AMLAZR as the operational application built on the infrastructure. |
| `/azirem` | Azirem coding assistant interface | Separate brand/capability without clear relation or current availability. | Keep; clarify ownership, preview status, and integration boundary. |
| `/credentials` | Legacy credentials/back-office route | Sensitive operational console had no evident public authentication boundary. | Remove from public navigation; route now redirects to `/`. |
| `/revenue` | Legacy revenue dashboard route | Internal financial surface had no evident authentication boundary or verified data provenance. | Remove from public navigation; route now redirects to `/`. |
| `/yace19` | Legacy YACE19 research lab route | Duplicated the YACE19AI research brand and conflated its role with PRIME-AI. | Merge; route now opens YACE19AI’s canonical research site. |
| `/fleet-command` | Legacy fleet control dashboard route | Duplicated `/orchestration` and could imply unverified live state. | Merge into `/orchestration`; route redirects there and has been removed from navigation. |
| `/surveyor` | Cyber Surveyor QA/security dashboard preview | Security/testing utility, not a standalone customer product; no live scan or telemetry source is connected. | Keep as an internal preview; now explicitly marks security and QA as not run and metrics as not measured. |
| `/uk` | United Kingdom deployment-planning page | No verified UK hosting, operator, or compliance details. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/de` | Germany deployment-planning page | No verified German hosting, operator, or compliance details. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/ch` | Switzerland deployment-planning page | No verified Swiss hosting, operator, or compliance details. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/ae` | UAE deployment-planning page | No verified local deployment facts; former label incorrectly implied Dubai was the country. | Rewrite; now uses “United Arab Emirates” and an explicitly unverified planning checklist. |
| `/jp` | Japan deployment-planning page | No verified Japan-specific deployment facts. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/cn` | China deployment-planning page | No verified China-specific deployment facts; localization requires deliberate review. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/sg` | Singapore deployment-planning page | No verified Singapore-specific deployment facts. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/za` | South Africa deployment-planning page | No verified South Africa-specific deployment facts. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/br` | Brazil deployment-planning page | No verified Brazil-specific deployment facts. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |
| `/ca` | Canada deployment-planning page | No verified Canada-specific deployment facts. | Rewrite; now presents an explicitly unverified planning checklist, not an active node claim. |

## Cross-route findings

- The router now uses canonical path URLs; `/vision` redirects to `/`, unknown paths render a 404, and retained routes receive localized title, description, canonical, social, breadcrumb, and WebPage structured metadata.
- Credential and revenue routes redirect to the homepage and are absent from public navigation; `/fleet-command` redirects to `/orchestration`.
- The public architecture pages now use qualified implementation language. Country templates state that no regional deployment or data residency is confirmed and list facts requiring verification.
- The public pages use one architecture narrative: models → memory and reasoning → governed agents → execution. AMLAZR’s operational role is distinct from PRIME-AI’s infrastructure role.
- Shared constellation navigation/footer, semantic landmarks, sitemap, robots policy, and `/llms.txt` are in place. Internal console routes carry an operator-preview/data disclaimer; Cyber Surveyor no longer presents generated numbers as live telemetry.
