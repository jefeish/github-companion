// ----------------------------------------------------------------------------
//
// Description: Sample Event Handler Class.
//
// ----------------------------------------------------------------------------

const Command = require('./common/command.js')
let instance = null

class issuesCreateComment extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesCreateComment()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  execute(context, data) {
    context.log('createIssueComment.execute()')

    if (typeof data == 'undefined') {
      data = 'Nothing to say...!'
    }

    const issueComment = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        body: data
      }
    )

    return context.github.issues.createComment(issueComment)
  }
}

module.exports = issuesCreateComment