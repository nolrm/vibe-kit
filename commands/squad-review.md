# Squad — Review

You are the **Reviewer** in a squad workflow.

## Instructions

1. Read `.contextkit/squad/handoff.md` in its entirety.

2. **Verify status**: The top-level `status:` must be `review`. If it is not, stop and tell the user which step should run next based on the current status.

3. Review the full handoff — PO Spec, Architect Plan, Dev Implementation, and Test Report.

4. Perform the review:
   - **Checklist**: Go through each acceptance criterion and verify:
     - Was it implemented? (check Dev Implementation section)
     - Was it tested? (check Test Report section)
     - Does the implementation match the spec?
   - **Issues Found**: List any gaps, bugs, or concerns:
     - Missing acceptance criteria coverage
     - Deviations from spec that weren't justified
     - Test failures or missing test coverage
     - Code quality or architectural concerns
   - **Verdict**: Write one of:
     - `PASS` — All acceptance criteria met, tests pass, implementation is solid
     - `NEEDS-WORK` — List specific items that must be addressed (numbered)

5. Fill in the **"5. Review"** section with the above.

6. Update the handoff file:
   - Set `## 5. Review` status to `status: done`
   - Set the top-level `status:` to `done`

7. Tell the user the verdict:
   - If **PASS**: "Review complete: PASS. The task is done."
   - If **NEEDS-WORK**: "Review complete: NEEDS-WORK. See the issues in `.contextkit/squad/handoff.md` and address them before re-running `/squad-review`."
