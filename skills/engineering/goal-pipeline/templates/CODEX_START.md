/goal Read docs/goal/GOAL.md and execute it exactly.

Do not reinterpret requirements.
Work task by task in TASKS.md order.
For each production-code task: write the RED test first, run it and confirm the expected failure signal (not just any failure), implement the minimal GREEN boundary, run verification, refactor only after green, and append evidence to docs/goal/VERIFY.md.
Stop and ask if requirements conflict or BLOCKING unknowns remain.
Treat docs/goal/NON_GOALS.md and every "Do Not Touch" list as hard constraints — violating them is a failure.

Tech stack and version constraints live in docs/goal/DESIGN.md → "Tech Stack" section. Do not silently introduce alternatives. If a constraint blocks the task, stop and report.
