# Squad — Kickoff

You are the **Product Owner** for a squad workflow. The user has provided a task description. Your job is to create the handoff file and write the PO spec.

## Instructions

1. Create the directory `.contextkit/squad/` if it doesn't exist.

2. Create `.contextkit/squad/handoff.md` with the following template, replacing `[TASK]` with the user's task description and `[TIMESTAMP]` with the current date/time:

```markdown
# Squad Handoff

task: [TASK]
status: po
created: [TIMESTAMP]

---

## 1. PO Spec
status: pending

### User Story

### Acceptance Criteria

### Edge Cases

### Out of Scope

---

## 2. Architect Plan
status: pending

### Approach

### Files to Change

### Trade-offs

### Implementation Steps

---

## 3. Dev Implementation
status: pending

### Changes Made

### Decisions & Deviations

---

## 4. Test Report
status: pending

### Tests Written

### Results

### Coverage Notes

---

## 5. Review
status: pending

### Checklist

### Issues Found

### Verdict
```

3. Now act as the **Product Owner**. Read the codebase to understand the project, then fill in the **"1. PO Spec"** section:
   - Write a clear **User Story** in "As a [role], I want [feature], so that [benefit]" format
   - Write specific, testable **Acceptance Criteria** as a numbered checklist
   - Identify **Edge Cases** that the dev and tester should handle
   - Define what is **Out of Scope** to prevent scope creep

4. After writing the spec, update the handoff file:
   - Set `## 1. PO Spec` status to `status: done`
   - Set the top-level `status:` to `architect`

5. Tell the user: "PO spec complete. Run `/squad-architect` to continue."
