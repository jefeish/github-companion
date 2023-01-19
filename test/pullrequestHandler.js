/** ---------------------------------------------------------------------------
 * 
 *  @description: This class is used to generate speech from text.
 * 
---------------------------------------------------------------------------- */

const Command = require('./handler/common/command.js')
const util = require('util')
const say = require('say')
const voice = "Daniel"
const speed = 1.0

let instance = null

class pullrequestHandler extends Command {

  //  eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new pullrequestHandler()
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

    /**
     * @description: data to replace phonetic characters with their phonetic equivalent
     *               (make the bot sound better)
     */
    const phonetics = {
      "@": "",
      "jefeish": "yergan",
      "primetheus": "prymetheus"
    }
    
    const greeting = data['greeting']
    let pr_action = ''
    let pr_user = ''
    let pr_number = ''
    let pr_title = ''
    let pr_body = ''
    let pr_comment = ''
    let pr_repository = ''

    let pr_action_txt
    let pr_user_txt
    let pr_number_txt
    let pr_title_txt
    let pr_body_txt
    let pr_comment_txt
    let pr_repository_txt
            
    if (data['pr_action']) {
      pr_action = context.payload.action
      pr_action_txt = ', '+ pr_action +' an Issue '
    }
    else {
      pr_action_txt = ' '
    }
    
    if (data['pr_user']) {
      pr_user = context.payload.issue.user.login
      pr_user_txt = ', by user '+ pr_user +' '
    }
    else {
      pr_user_txt = ' '
    }
    
    if (data['pr_number']) {
      pr_number = context.payload.issue.number
      pr_number_txt = ', the Issue number is: '+ pr_number +' '
    }
    else {
      pr_number_txt = ' '
    }
    
    if (data['pr_title']) {
      pr_title = context.payload.issue.title
      pr_title_txt = ', the Issue title is: '+ pr_title +' '
    }
    else {
      pr_title_txt = ' '
    }
    
    if (data['pr_body']) {
      pr_body = context.payload.issue.body
      pr_body_txt = ', the Issue text says: '+ pr_body +' '
    }
    else {
      pr_body_txt = ' '
    }

    if (data['pr_comment']) {
      pr_comment = context.payload.comment.body
      const comment_array = pr_comment.split(' ')
      
      if (comment_array.length > 10) {
        pr_comment_txt = ', Issue comment says: ' + comment_array.slice(0,10).join(' ') + ' and so on... '
      }
      else {
        pr_comment_txt = ', Issue comment says: ' + pr_comment + ' '
      }
    }
    else {
      pr_comment_txt = ' '
    }

    if (data['pr_repository']) {
      pr_repository = context.payload.repository.name
      pr_repository_txt = ', the repository name is: '+ pr_repository +' '
    }
    else {
      pr_repository_txt = ''
    }
    
    console.log('speach task: ' + util.inspect(data))
    
    if (typeof data == 'undefined') {
      data = ' '
    }

    let text =  greeting + pr_user_txt + pr_action_txt + pr_number_txt + pr_title_txt + pr_repository_txt + pr_body_txt + pr_comment_txt

    for (const [key, value] of Object.entries(phonetics)) {
      text = text.replaceAll(key, value)
    }

    console.log('text: ' + text)
    // invike the 'say' module to generate speech
    say.speak( text, voice, speed)
  }
}

module.exports = pullrequestHandler