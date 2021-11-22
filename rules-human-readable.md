# Rules

1. [null](#Rule-1)
2. [null](#Rule-2)
3. [null](#Rule-3)
4. [null](#Rule-4)
5. [null](#Rule-5)
---

## Rule-1

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/issues-rule-0.yml](../src/rules/issues-rule-0.yml)

- If the fact `'action'` is `equal` to `'create'`,

#### ... then do ['issueTalk'](src/eventHandlers/issueTalk.js)

---

## Rule-2

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-assigned-to-me.yml](../src/rules/speak-issue-assigned-to-me.yml)

- If the fact `'issue.id'` is `notEmpty`  `''`,
- If the fact `'action'` is `equal` to `'assigned'`,
- If the fact `'issue.assignee.login'` is `equal` to `'jefeish'`,

#### ... then do ['issueTalk'](src/eventHandlers/issueTalk.js)

---

## Rule-3

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-comment.yml](../src/rules/speak-issue-comment.yml)

- If the fact `'issue.id'` is `notEmpty`  `''`,
- If the fact `'comment.id'` is `notEmpty`  `''`,
- If the fact `'action'` is `equal` to `'created'`,
- If the fact `'comment.body'`  `doesNotInclude`  `'@jefeish'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issueTalk'](src/eventHandlers/issueTalk.js)

---

## Rule-4

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-mentioned.yml](../src/rules/speak-issue-mentioned.yml)

- If the fact `'issue.id'` is `notEmpty`  `''`,
- If the fact `'comment.id'` is `notEmpty`  `''`,
- If the fact `'action'` is `equal` to `'created'`,
- If the fact `'comment.body'`  `includes`  `'@jefeish'`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issueTalk'](src/eventHandlers/issueTalk.js)

---

## Rule-5

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-opened.yml](../src/rules/speak-issue-opened.yml)

- If the fact `'issue.id'` is `notEmpty`  `''`,
- If the fact `'action'` is `equal` to `'opened'`,
- If the fact `'comment.id'`  `isEmpty`  `''`,
- If the fact `'sender.type'` is `notEqual` to `'Bot'`,

#### ... then do ['issueTalk'](src/eventHandlers/issueTalk.js)

---
