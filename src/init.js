/**
 * This code maps the 'eventHandler' classes 
 * 
 * 
 */

const fs = require('fs')
const yaml = require('js-yaml')
const path_module = require('path');

/**
 * 
 * Implement a simple 'command pattern'
 * | @param app
 */
exports.registerEventHandlers = function (app) {
  app.log('registerEventHandlers')

  try {
    const fileContents = fs.readFileSync('./src/eventHandlers.yml', 'utf8')
    const events = yaml.safeLoad(fileContents)
    let handlers = ''

    Object.keys(events).forEach(event => {
      events[event].forEach(handler => {
        // instantiate the 'eventHandler' class
        const Cmd = require(process.cwd() + '/src/eventHandlers/' + handler + '.js')
        const action = Cmd.getInstance()
        // create a list of handler names for logging
        handlers += ' ' + handler
        // register the WebHook event and map it to an 'eventHandler' class
        app.on(event, async (context, data) => action.execute(context, data))
      })

      if (handlers) {
        app.log('Event: [' + event + '] is assigned Handler(s): [' + handlers + ' ]')
        handlers = ''
      }
    })
  } catch (handler) {
    app.log(handler)
  }
}
