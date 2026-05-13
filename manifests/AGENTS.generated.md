## Agent skills

This repo provides portable agent skills. Load a skill when the user's request matches its description. After loading `SKILL.md`, follow its instructions and read sibling reference files only when needed.

Skill source of truth: `manifests/skills.json`.

### Available skills

- `caveman` (productivity): Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler, articles, and pleasantries while keeping full technical accuracy. Use when user says "caveman mode", "talk like caveman", "use caveman", "less tokens", "be brief", or invokes /caveman.
- `diagnose` (engineering): Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → fix → regression-test. Use when user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, or describes a performance regression.
- `git-guardrails` (misc): Set up safeguards that block or warn before dangerous git operations such as push, reset --hard, clean -f, branch -D, checkout ., or restore .. Use when user wants to prevent destructive git commands, add git safety hooks, or make an agent ask before risky repository changes.
- `goal-pipeline` (engineering): Build a Codex /goal-ready implementation package through an adversarial PRD, design, plan, and TDD workflow. Use when the user wants to refine PRD/design/plan docs, prepare Codex /goal execution, or run specification-first TDD development.
- `grill-me` (productivity): Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
- `grill-with-docs` (engineering): Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise. Use when user wants to stress-test a plan against their project's language and documented decisions.
- `improve-codebase-architecture` (engineering): Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more testable and AI-navigable.
- `migrate-to-shoehorn` (misc): Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to replace `as` in tests, or needs partial test data.
- `scaffold-exercises` (misc): Create exercise directory structures with sections, problems, solutions, and explainers that pass linting. Use when user wants to scaffold exercises, create exercise stubs, or set up a new course section.
- `setup-agent-skills` (engineering): Set up an `## Agent skills` block in the repo's agent config file and `docs/agents/` so engineering skills know the repo's issue tracker, triage label vocabulary, and domain doc layout. Run before first use of `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, or `zoom-out` — or when those skills lack project setup context.
- `setup-pre-commit` (misc): Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
- `tdd` (engineering): Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
- `to-issues` (engineering): Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues.
- `to-prd` (engineering): Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.
- `triage` (engineering): Triage issues through a state machine driven by triage roles. Use when user wants to create an issue, triage issues, review incoming bugs or feature requests, prepare issues for an AFK agent, or manage issue workflow.
- `write-a-skill` (productivity): Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
- `zoom-out` (engineering): Tell the agent to zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a section of code or need to understand how it fits into the bigger picture.

### Loading rule

When a skill triggers, read that skill's `SKILL.md` from the path listed in `manifests/skills.json`. Copy or preserve the whole skill directory when installing, because sibling Markdown files and scripts may be part of the skill.

