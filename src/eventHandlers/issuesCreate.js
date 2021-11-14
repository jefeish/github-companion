// ----------------------------------------------------------------------------
//
// Description: Event Handler Class.
//
// ----------------------------------------------------------------------------

const Command = require('./common/command.js')
let instance = null

class issuesCreate extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesCreate()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  execute(context, data) {
    context.log('issuesCreate.execute()')

    if (typeof data == 'undefined') {
      data = 'NA'
    }

    const issue = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        title: data[0],
        body: data[1]
      }
    )

    return context.github.issues.create(issue)
  }
}

module.exports = issuesCreate