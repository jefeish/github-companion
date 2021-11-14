// ----------------------------------------------------------------------------
//
// Description: Event Handler Class (TEMPLATE).
// 
//  PLEASE REPLACE ALL `change this!` MARKERS WITH YOUR OWN CODE 
//  (including this)
//
// ----------------------------------------------------------------------------

const Command = require('./common/command.js')
let instance = null


class eventHandlerTemplate extends Command {
  //  ^^^^^^^^^^^^^^^^^^^^--- change this!

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new eventHandlerTemplate()
                 //  ^^^^^^^^^^^^^^^^^^^^--- change this!
    }

    return instance
  }

  /**
   * @description Main entry point for invocation from client
   * 
   * @param {*} context 
   * @param {*} data 
   */
  execute(context, data) {

    if (typeof data == 'undefined') {
      data = 'NA'
    }

    // THIS IS A SAMPLE GITHUB REST API CALL
    // PLEASE PROVIDE YOUR OWN CODE HERE !
    // --------------------------------------

    // const issue = context.issue(
    //   {
    //     owner: context.payload.repository.owner.login,
    //     repo: context.payload.repository.name,
    //     title: data[0],
    //     body: data[1]
    //   }
    // )
    // 
    // return context.github.issues.create(issue)
  }
}

module.exports = eventHandlerTemplate
             //  ^^^^^^^^^^^^^^^^^^^^--- change this!