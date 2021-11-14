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

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.labels.name|contains|Backlog|
|payload.issue.state|notEqual|closed|
|payload.issue.labels.name|doesNotContain|Blocked|

### Event

|Type|Data|
|---|---|
|issuesAssignToProject|Kanban2 , Backlog |
---

## Rule-2

**Rule Name:** `project 'blocked'' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-blocked.yml](docs/tutorial-project-rules/project-issue-blocked.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.labels.name|contains|Blocked|
|payload.issue.state|notEqual|closed|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issuesAssignToProject|Kanban2 , Blocked |
---

## Rule-3

**Rule Name:** `project 'clean up' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-cleanup.yml](docs/tutorial-project-rules/project-issue-cleanup.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.state|equal|closed|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issuesRemoveLabels|Backlog , To do , In progress , Blocked |
---

## Rule-4

**Rule Name:** `project 'in progress' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-inProgress-01.yml](docs/tutorial-project-rules/project-issue-inProgress-01.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.assignees.login|notEmpty||
|payload.issue.labels.name|contains|To do|
|payload.issue.state|notEqual|closed|
|payload.issue.labels.name|doesNotContain|Blocked|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issuesOverrideLabel|To do , In progress |
---

## Rule-5

**Rule Name:** `project 'In progress' by assignees rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-inProgress.yml](docs/tutorial-project-rules/project-issue-inProgress.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.labels.name|contains|In progress|
|payload.issue.state|notEqual|closed|
|payload.issue.labels.name|doesNotContain|Blocked|

### Event

|Type|Data|
|---|---|
|issuesAssignToProject|Kanban2 , In progress |
---

## Rule-6

**Rule Name:** `project card moved rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-moved-01.yml](docs/tutorial-project-rules/project-issue-moved-01.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.action|equal|moved|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|projectRemoveAllIssueAssignees||
---

## Rule-7

**Rule Name:** `project card moved rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-moved.yml](docs/tutorial-project-rules/project-issue-moved.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.action|equal|moved|
|payload.issue.state|notEqual|closed|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|projectToIssueLabel||
---

## Rule-8

**Rule Name:** `project 'To do' unassigned rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-todo-01.yml](docs/tutorial-project-rules/project-issue-todo-01.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.assignees.login|isEmpty||
|payload.issue.labels.name|doesNotContain|Backlog|
|payload.issue.state|notEqual|closed|
|payload.issue.labels.name|doesNotContain|Blocked|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issuesOverrideLabel|In progress , To do |
---

## Rule-9

**Rule Name:** `project 'todo' rule` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [docs/tutorial-project-rules/project-issue-todo.yml](docs/tutorial-project-rules/project-issue-todo.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.labels.name|contains|To do|
|payload.issue.assignees.login|isEmpty||
|payload.issue.state|notEqual|closed|
|payload.issue.labels.name|doesNotContain|Blocked|

### Event

|Type|Data|
|---|---|
|issuesAssignToProject|Kanban2 , To do |
---
