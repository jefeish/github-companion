// ----------------------------------------------------------------------------
//
// Description: Event Handler Class.
//
// ----------------------------------------------------------------------------

const Command = require('./common/command.js')
let instance = null

class issuesCreateMilestone extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesCreateMilestone()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  execute(context, data) {
    context.log('issuesCreateMilestone.execute()')

    if (typeof data == 'undefined') {
      data = []
    }

    const milestone = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        title: data[0]
      }
    )

    return context.github.issues.createMilestone(milestone)
  }
}

module.exports = issuesCreateMilestone