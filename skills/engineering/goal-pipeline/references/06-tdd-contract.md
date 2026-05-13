# tdd-contract

## Purpose

Make Codex implement every production-code task through a strict behavior-first RED -> GREEN -> REFACTOR loop.

## Required Task Fields

Every task that changes production code must contain:

- `RED Test`: the first test to write, described as behavior through a public interface.
- `Expected Failure`: the exact reason the test should fail before implementation.
- `GREEN Boundary`: the smallest allowed implementation that can make the current test pass.
- `Refactor Allowance`: cleanup allowed only after the verification command is green.
- `Verification Command`: exact command Codex must run.
- `Acceptance Criteria`: observable criteria for this slice.
- `Do Not Touch`: files, modules, behaviors, or APIs Codex must not change.

## Rules

- One behavior per task.
- Do not write all tests first and then all implementation.
- Do not test private implementation details.
- Prefer integration-style tests through public APIs.
- Mock only at true external boundaries.
- If the first RED test passes immediately, the task is invalid and must be rewritten.
- If verification fails, Codex must fix the current task before moving on.
