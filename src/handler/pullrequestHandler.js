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

    context.log.debug('pullrequestHandler.execute()')
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
    let pullrequest_action = ''
    let pullrequest_user = ''
    let pullrequest_number = ''
    let pullrequest_title = ''
    let pullrequest_body = ''
    let pullrequest_comment = ''
    let pullrequest_repository = ''

    let pullrequest_action_txt
    let pullrequest_user_txt
    let pullrequest_number_txt
    let pullrequest_title_txt
    let pullrequest_body_txt
    let pullrequest_comment_txt
    let pullrequest_repository_txt
            
    if (data['pullrequest_action']) {
      pullrequest_action = context.payload.action
      pullrequest_action_txt = ', '+ pullrequest_action +' an Issue '
    }
    else {
      pullrequest_action_txt = ' '
    }
    
    if (data['pullrequest_user']) {
      pullrequest_user = context.payload.issue.user.login
      pullrequest_user_txt = ', by user '+ pullrequest_user +' '
    }
    else {
      pullrequest_user_txt = ' '
    }
    
    if (data['pullrequest_number']) {
      pullrequest_number = context.payload.issue.number
      pullrequest_number_txt = ', the Issue number is: '+ pullrequest_number +' '
    }
    else {
      pullrequest_number_txt = ' '
    }
    
    if (data['pullrequest_title']) {
      pullrequest_title = context.payload.issue.title
      pullrequest_title_txt = ', the Issue title is: '+ pullrequest_title +' '
    }
    else {
      pullrequest_title_txt = ' '
    }
    
    if (data['pullrequest_body']) {
      pullrequest_body = context.payload.issue.body
      pullrequest_body_txt = ', the Issue text says: '+ pullrequest_body +' '
    }
    else {
      pullrequest_body_txt = ' '
    }

    if (data['pullrequest_comment']) {
      pullrequest_comment = context.payload.comment.body
      const comment_array = pullrequest_comment.split(' ')
      
      if (comment_array.length > 10) {
        pullrequest_comment_txt = ', Issue comment says: ' + comment_array.slice(0,10).join(' ') + ' and so on... '
      }
      else {
        pullrequest_comment_txt = ', Issue comment says: ' + pullrequest_comment + ' '
      }
    }
    else {
      pullrequest_comment_txt = ' '
    }

    if (data['pullrequest_repository']) {
      pullrequest_repository = context.payload.repository.name
      pullrequest_repository_txt = ', the repository name is: '+ pullrequest_repository +' '
    }
    else {
      pullrequest_repository_txt = ''
    }
    
    console.log('speach task: ' + util.inspect(data))
    
    if (typeof data == 'undefined') {
      data = ' '
    }

    let text =  greeting + pullrequest_user_txt + pullrequest_action_txt + pullrequest_number_txt + pullrequest_title_txt + pullrequest_repository_txt + pullrequest_body_txt + pullrequest_comment_txt

    for (const [key, value] of Object.entries(phonetics)) {
      text = text.replaceAll(key, value)
    }

    console.log('text: ' + text)
    // invike the 'say' module to generate speech
    say.speak( text, voice, speed)
  }
}

module.exports = pullrequestHandler