// ----------------------------------------------------------------------------
//
// Description: Event Handler Class.
//
// ----------------------------------------------------------------------------

const Command = require('./common/command.js')
let instance = null

class projectRemoveAllIssueAssignees extends Command {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    }

    /**
     * Singleton pattern
     */
    static getInstance() {
        if (!instance) {
            instance = new projectRemoveAllIssueAssignees()
        }

        return instance
    }

    /**
     * 
     * @param {*} context 
     * @param {*} data 
     */
    async execute(context, data) {
        context.log('projectRemoveAllIssueAssignees.execute()')
        let issue

        if (typeof data == 'undefined') {
            data = []
        }

        const issueNumberTmp = (context.payload.project_card.content_url).split('/')
        const issueNumber = issueNumberTmp[(issueNumberTmp.length) - 1]

        issue = context.issue(
            {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: issueNumber
            }
        )
        const cardIssue = await context.github.issues.get(issue)
        context.log('cardIssue.assignees: ' + cardIssue.data.issue.assignees)

        issue = context.issue(
            {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: context.payload.issue.number,
                assignees: data
            }
        )
        return await context.github.issues.removeAssignees(issue)
    }
}

module.exports = projectRemoveAllIssueAssignees