// ----------------------------------------------------------------------------
//
// Description: Speech Handler Class.
// 
//  PLEASE REPLACE ALL `change this!` MARKERS WITH YOUR OWN CODE 
//  (including this)
//
// ----------------------------------------------------------------------------

const Command = require('./common/command.js')
const say = require('say')
const voice = "Daniel"
const speed = 1.0

let instance = null


class speech extends Command {

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new speech()
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
    say.speak(data, voice, speed)
  }
}

module.exports = speech