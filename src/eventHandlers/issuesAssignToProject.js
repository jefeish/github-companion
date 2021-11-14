// ----------------------------------------------------------------------------
// 
// Description: Event Handler Class
//
// ----------------------------------------------------------------------------
const util = require('util')
const Command = require('./common/command.js')
let instance = null

/**
 * @description - Class to assign a project card to a column 
 *              by the same name as the Issue label.
 *              If the card exists, it will be moved.
 *              If the card does not exist it will be created.
 * 
 * The class requires Project Board Name and Project Column Name
 * 
 */
class issuesAssignToProject extends Command {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    }

    /**
     * @description Singleton pattern
     */
    static getInstance() {
        if (!instance) {
            instance = new issuesAssignToProject()
        }

        return instance
    }

    /**
     * @description Find a project by name, if there are duplicate project names
     *              return the first occurrence.
     * @param {*} context 
     * @param {*} name 
     */
    async getProjectByName(context, name) {
        let result = {}

        const ctx = {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name
        }

        let projectList = await context.github.projects.listForRepo(ctx)

        projectList.data.forEach(project => {

            if (project.name == name) {
                result = project
            }
        })

        return result
    }


    /**
     * @description Find a column by name, if there are duplicate column names
     *              return the first occurrence.
     * 
     * @param {*} context 
     * @param {*} name 
     */
    async getColumnByName(context, project_id, column_name) {
        let result = {}

        const ctx = {
            project_id: project_id
        }

        let projectColumns = await context.github.projects.listColumns(ctx)
        projectColumns.data.forEach(column => {

            if (column.name == column_name) {
                result = column
            }
        })

        return result
    }

    /**
     * 
     * @param {*} card_id 
     */
    async removeExistingCard(context, card_id) {
        const ctx = { card_id: card_id }
        await context.github.projects.deleteCard(ctx)
    }

    /**
     * 
     * @param {*} context 
     * @param {*} card_id 
     * @param {*} coulmn_id 
     */
    async moveExistingCard(context, card_id, column_id) {
        const ctx = {
            card_id: card_id,
            position: 'top',
            column_id: column_id
        }
        await context.github.projects.moveCard(ctx)
    }

    /**
     * 
     * @param {*} context 
     * @param {*} name 
     */
    async getProjectCardByIssueRef(context, project_id) {
        console.log('getProjectCardByIssueRef()')
        // console.log('context: ' + util.inspect(context))
        let ctx = {}

        ctx = {
            project_id: project_id
        }
        const projectColumns = await context.github.projects.listColumns(ctx)

        for (let a = 0; a < projectColumns.data.length; a++) {
            ctx = {
                column_id: projectColumns.data[a].id,
                archived_state: 'not_archived'
            }

            const projectCards = await context.github.projects.listCards(ctx)
            // console.log('projectCards: >' + util.inspect(projectCards.data) + '<')

            for (let i = 0; i < projectCards.data.length; i++) {
                const card = projectCards.data[i]
                ctx = { card_id: card.id }
                const c = await context.github.projects.getCard(ctx)
                // console.log('c.data: >' + util.inspect(c.data) + '<')
                const issue_reference = c.data.content_url

                if (issue_reference === context.payload.issue.url) {
                    console.log('------------------- FOUND A MATCH ------------------')
                    console.log('issue_reference: ' + issue_reference)
                    console.log('context.payload.issue.url: ' + context.payload.issue.url)
                    return card.id
                }
            }
        }
    }

    /**
     * 
     * @param {*} context 
     * @param {*} data 
     */
    async createProjectCard(context, columnId) {

        const card = {
            column_id: columnId,
            content_id: context.payload.issue.id,
            content_type: 'Issue'
        }

        return context.github.projects.createCard(card)
    }

    /**
     * 
     * @param {*} context 
     * @param {*} data 
     */
    async execute(context, data) {
        context.log('issuesAssignToProject.execute()')

        if (typeof data == 'undefined') {
            data = []
        }

        let project = await this.getProjectByName(context, data[0])
        console.log('project: >' + util.inspect(project.name) + '< project.id: >' + project.id + '<')
        let column = await this.getColumnByName(context, project.id, data[1])
        console.log('column: >' + util.inspect(column.name) + '< column.id: >' + column.id + '<')
        let card = await this.getProjectCardByIssueRef(context, project.id)

        if (typeof card != 'undefined') {
            // remove and create gets the latest Issue info (title etc.)
            await this.moveExistingCard(context, card, column.id)
        }
        else {
            this.createProjectCard(context, column.id)
        }
    }
}

module.exports = issuesAssignToProject