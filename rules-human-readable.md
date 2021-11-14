# Rules

1. [project 'backlog' rule](#Rule-1)
2. [project 'blocked'' rule](#Rule-2)
3. [project 'clean up' rule](#Rule-3)
4. [project 'in progress' rule](#Rule-4)
5. [project 'In progress' by assignees rule](#Rule-5)
6. [project card moved rule](#Rule-6)
7. [project card moved rule](#Rule-7)
8. [project 'To do' unassigned rule](#Rule-8)
9. [project 'todo' rule](#Rule-9)
---

## Rule-1

**Rule Name:** `project 'backlog' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-backlog.yml](docs/tutorial-project-rules/project-issue-backlog.yml)

- If the fact `'issue.labels.name'`  `contains`  `'Backlog'`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'issue.labels.name'`  `doesNotContain`  `'Blocked'`,

#### ... then do ['issuesAssignToProject'](src/eventHandlers/issuesAssignToProject.js)

---

## Rule-2

**Rule Name:** `project 'blocked'' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-blocked.yml](docs/tutorial-project-rules/project-issue-blocked.yml)

- If the fact `'issue.labels.name'`  `contains`  `'Blocked'`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issuesAssignToProject'](src/eventHandlers/issuesAssignToProject.js)

---

## Rule-3

**Rule Name:** `project 'clean up' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-cleanup.yml](docs/tutorial-project-rules/project-issue-cleanup.yml)

- If the fact `'issue.state'` is `equal` to `'closed'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issuesRemoveLabels'](src/eventHandlers/issuesRemoveLabels.js)

---

## Rule-4

**Rule Name:** `project 'in progress' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-inProgress-01.yml](docs/tutorial-project-rules/project-issue-inProgress-01.yml)

- If the fact `'issue.assignees.login'` is `notEmpty`  `''`,
- If the fact `'issue.labels.name'`  `contains`  `'To_do'`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'issue.labels.name'`  `doesNotContain`  `'Blocked'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issuesOverrideLabel'](src/eventHandlers/issuesOverrideLabel.js)

---

## Rule-5

**Rule Name:** `project 'In progress' by assignees rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-inProgress.yml](docs/tutorial-project-rules/project-issue-inProgress.yml)

- If the fact `'issue.labels.name'`  `contains`  `'In_progress'`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'issue.labels.name'`  `doesNotContain`  `'Blocked'`,

#### ... then do ['issuesAssignToProject'](src/eventHandlers/issuesAssignToProject.js)

---

## Rule-6

**Rule Name:** `project card moved rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-moved-01.yml](docs/tutorial-project-rules/project-issue-moved-01.yml)

- If the fact `'action'` is `equal` to `'moved'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['projectRemoveAllIssueAssignees'](src/eventHandlers/projectRemoveAllIssueAssignees.js)

---

## Rule-7

**Rule Name:** `project card moved rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-moved.yml](docs/tutorial-project-rules/project-issue-moved.yml)

- If the fact `'action'` is `equal` to `'moved'`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['projectToIssueLabel'](src/eventHandlers/projectToIssueLabel.js)

---

## Rule-8

**Rule Name:** `project 'To do' unassigned rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-todo-01.yml](docs/tutorial-project-rules/project-issue-todo-01.yml)

- If the fact `'issue.assignees.login'`  `isEmpty`  `''`,
- If the fact `'issue.labels.name'`  `doesNotContain`  `'Backlog'`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'issue.labels.name'`  `doesNotContain`  `'Blocked'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issuesOverrideLabel'](src/eventHandlers/issuesOverrideLabel.js)

---

## Rule-9

**Rule Name:** `project 'todo' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-todo.yml](docs/tutorial-project-rules/project-issue-todo.yml)

- If the fact `'issue.labels.name'`  `contains`  `'To_do'`,
- If the fact `'issue.assignees.login'`  `isEmpty`  `''`,
- If the fact `'issue.state'` is `notEqual` to `'closed'`,
- If the fact `'issue.labels.name'`  `doesNotContain`  `'Blocked'`,

#### ... then do ['issuesAssignToProject'](src/eventHandlers/issuesAssignToProject.js)

---
