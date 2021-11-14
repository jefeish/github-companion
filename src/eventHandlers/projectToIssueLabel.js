// ----------------------------------------------------------------------------
// 
// Description: Event Handler Class.
//
// ----------------------------------------------------------------------------

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class projectToIssueLabel extends Command {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    }

    /**
     * Singleton pattern
     */
    static getInstance() {
        if (!instance) {
            instance = new projectToIssueLabel()
        }

        return instance
    }

    /**
     * Utility function
     * @param {*} Conext 
     */
    async getAllIssueLabels(context, issueNumber) {
        const listLabels = context.issue(
            {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: issueNumber
            }
        )

        const labels = await context.github.issues.listLabelsOnIssue(listLabels)
        let names = []
        labels.data.forEach(label => {
            names.push(label.name)
        })

        return names
    }

    /**
     * 
     * @param {*} context 
     */
    async setIssueLabelByColumn(context) {
        let ctx = {}
        const oldLabels = ['Blocked', 'In progress', 'To do', 'Backlog', 'Done', 'Peer review']

        ctx = {
            card_id: context.payload.project_card.id
        }
        const card = await context.github.projects.getCard(ctx)

        const issueNumberTmp = (card.data.content_url).split('/')
        const issueNumber = issueNumberTmp[(issueNumberTmp.length) - 1]

        ctx = {
            column_id: context.payload.project_card.column_id
        }
        const column = await context.github.projects.getColumn(ctx)
        const columnName = column.data.name

        const names = await this.getAllIssueLabels(context, issueNumber)

        oldLabels.forEach(label => {
            if (names.includes(label)) {
                const issueLabel = context.issue(
                    {
                        owner: context.payload.repository.owner.login,
                        repo: context.payload.repository.name,
                        issue_number: issueNumber,
                        name: label
                    }
                )
                context.github.issues.removeLabel(issueLabel)
            }
        })

        const issueLabels = context.issue(
            {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: issueNumber,
                labels: [columnName]
            }
        )

        return await context.github.issues.addLabels(issueLabels)
    }

    /**
     * 
     * @param {*} context 
     * @param {*} data 
     */
    async execute(context, data) {
        context.log('projectToIssueLabel.execute()')

        if (typeof data === 'undefined') {
            data = []
        }

        console.log('payload: >' + util.inspect(context.payload) + '<')

        if (typeof context.payload.project_card.column_id !== 'undefined') {
            return this.setIssueLabelByColumn(context, context.payload.project_card.column_id, context.payload.project_card.id)
        }

        return 200
    }
}

module.exports = projectToIssueLabel