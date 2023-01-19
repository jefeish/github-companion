/** ---------------------------------------------------------------------------
 * 
 *  @description: This class is used to generate speech from text.
 * 
---------------------------------------------------------------------------- */

const Command = require('./common/command.js')
const util = require('util')
const say = require('say')
const voice = "Daniel"
const speed = 1.0

let instance = null

class issueHandler extends Command {

  //  eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issueHandler()
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

    context.log.debug('issueHandler.execute()')
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
    let issue_action = ''
    let issue_user = ''
    let issue_number = ''
    let issue_title = ''
    let issue_body = ''
    let issue_comment = ''
    let issue_repository = ''

    let issue_action_txt
    let issue_user_txt
    let issue_number_txt
    let issue_title_txt
    let issue_body_txt
    let issue_comment_txt
    let issue_repository_txt
            
    if (data['issue_action']) {
      issue_action = context.payload.action
      issue_action_txt = ', '+ issue_action +' an Issue '
    }
    else {
      issue_action_txt = ' '
    }
    
    if (data['issue_user']) {
      issue_user = context.payload.issue.user.login
      issue_user_txt = ', by user '+ issue_user +' '
    }
    else {
      issue_user_txt = ' '
    }
    
    if (data['issue_number']) {
      issue_number = context.payload.issue.number
      issue_number_txt = ', the Issue number is: '+ issue_number +' '
    }
    else {
      issue_number_txt = ' '
    }
    
    if (data['issue_title']) {
      issue_title = context.payload.issue.title
      issue_title_txt = ', the Issue title is: '+ issue_title +' '
    }
    else {
      issue_title_txt = ' '
    }
    
    if (data['issue_body']) {
      issue_body = context.payload.issue.body
      issue_body_txt = ', the Issue text says: '+ issue_body +' '
    }
    else {
      issue_body_txt = ' '
    }

    if (data['issue_comment']) {
      issue_comment = context.payload.comment.body
      const comment_array = issue_comment.split(' ')
      
      if (comment_array.length > 10) {
        issue_comment_txt = ', Issue comment says: ' + comment_array.slice(0,10).join(' ') + ' and so on... '
      }
      else {
        issue_comment_txt = ', Issue comment says: ' + issue_comment + ' '
      }
    }
    else {
      issue_comment_txt = ' '
    }

    if (data['issue_repository']) {
      issue_repository = context.payload.repository.name
      issue_repository_txt = ', the repository name is: '+ issue_repository +' '
    }
    else {
      issue_repository_txt = ''
    }
    
    console.log('speach task: ' + util.inspect(data))
    
    if (typeof data == 'undefined') {
      data = ' '
    }

    let text =  greeting + issue_user_txt + issue_action_txt + issue_number_txt + issue_title_txt + issue_repository_txt + issue_body_txt + issue_comment_txt

    for (const [key, value] of Object.entries(phonetics)) {
      text = text.replaceAll(key, value)
    }

    console.log('text: ' + text)
    // invike the 'say' module to generate speech
    say.speak( text, voice, speed)
  }
}

module.exports = issueHandler