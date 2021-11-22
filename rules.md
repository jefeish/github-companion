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

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.action|equal|create|

### Event

|Type|Data|
|---|---|
|issueTalk||
---

## Rule-2

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-assigned-to-me.yml](../src/rules/speak-issue-assigned-to-me.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.id|notEmpty||
|payload.action|equal|assigned|
|payload.issue.assignee.login|equal|jefeish|

### Event

|Type|Data|
|---|---|
|issueTalk|hello @jefeish, someone assigned an Issue to you  ,false,false,true,true,true,false,false |
---

## Rule-3

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-comment.yml](../src/rules/speak-issue-comment.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.id|notEmpty||
|payload.comment.id|notEmpty||
|payload.action|equal|created|
|payload.comment.body|doesNotInclude|@jefeish|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issueTalk|hello, an Issue comment was created,  ,false,true,true,false,true,false,false |
---

## Rule-4

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-mentioned.yml](../src/rules/speak-issue-mentioned.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.id|notEmpty||
|payload.comment.id|notEmpty||
|payload.action|equal|created|
|payload.comment.body|includes|@jefeish|
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issueTalk|hello @jefeish, someone mentioned you in an Issue  ,false,true,true,true,true,false,true |
---

## Rule-5

**Rule Name:** `null` &nbsp;&nbsp;&nbsp;&nbsp;
**Rule File:** [../src/rules/speak-issue-opened.yml](../src/rules/speak-issue-opened.yml)

### Conditions

|Fact(s)|Operator|Value|
|---|---|---|
|payload.issue.id|notEmpty||
|payload.action|equal|opened|
|payload.comment.id|isEmpty||
|payload.sender.type|notEqual|Bot|

### Event

|Type|Data|
|---|---|
|issueTalk|hello, there is a new Issue.  ,false,true,false,false,true,true,false |
---
