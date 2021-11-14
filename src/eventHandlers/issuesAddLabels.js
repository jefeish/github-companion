// ----------------------------------------------------------------------------
//
// Description: Event Handler Class.
//
// ----------------------------------------------------------------------------
const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesAddLabels extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesAddLabels()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  execute(context, data) {
    context.log('issuesAddLabels.execute()')

    if (typeof data == 'undefined') {
      data = []
    }

    const issueLabels = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        labels: data
      }
    )

    return context.github.issues.addLabels(issueLabels)
  }
}

module.exports = issuesAddLabels