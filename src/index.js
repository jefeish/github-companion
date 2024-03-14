/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const fs = require('fs')
const yaml = require('js-yaml')
const path_module = require('path');
// the speech support, just to welcome you
const say = require('say')
const voice = "Daniel"
const speed = 1.1
/**
 * This is the main entrypoint to your Probot app 
 * @param {import('probot').Application} app
 */
module.exports = app => {

  app.log('Starting Event Pattern / Rules Engine - App!')
  // init.registerEventHandlers(app)
  say.speak( 'Hello', voice, speed)
  app.log('registerEventHandlers')

  try {
    const fileContents = fs.readFileSync('./src/events.yml', 'utf8')
    const events = yaml.safeLoad(fileContents)
    let handlers = ''

    // // eslint-disable-next-line no-path-concat
    // const tmp_config = fs.readFileSync(process.cwd() + '/.github/sample.yml')
    // config = JSON.parse(JSON.stringify(yaml.safeLoad(tmp_config), null, 4))
    // // Debug
    // console.log('loadeventConfiguration() \n\t' + util.inspect(config))
    
    Object.keys(events).forEach(event => {
      events[event].forEach(handler => {
        // instantiate the 'eventHandler' class
        const Cmd = require(process.cwd() + '/src/handler/' + handler + '.js')
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
