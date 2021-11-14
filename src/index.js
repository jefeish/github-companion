/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const init = require('./init.js')

/**
 * This is the main entrypoint to your Probot app 
 * @param {import('probot').Application} app
 */
module.exports = app => {

  app.log('Starting Event Pattern / Rules Engine - App!')
  init.registerEventHandlers(app)

}
