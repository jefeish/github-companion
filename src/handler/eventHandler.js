/** -------------------------------------------------------------------------
*
* @description An Event Handler Class that uses a Rules-Engine to process
*              GitHub Events against a set of Rules (yaml files).
*              If the conditions of a Rule match event parameters, 
*              this class will invoke the corresponding handler class,
*              specified in the rules yaml.
*
* ------------------------------------------------------------------------- */

const Command = require('./common/command.js')
const Engine = require('json-rules-engine').Engine
const Rule = require('json-rules-engine').Rule
const flatten = require('flat')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const util = require('util')
var handlerMap = {}
let instance = null
let lastRefeshTime = 0
let refreshInterval = 5 // in Minutes (default)
let rules_repo = ''
let config = null
let rulesList = []

/** -------------------------------------------------------------------------
 * @description A basic Rules Engine Handler Class that loads Rules
 *              and applies them to facts from a GitHub event context JSON.
 * 
 * @todo This needs to be a 'Singleton' !!!
 ------------------------------------------------------------------------- */
class eventHandler extends Command {
  constructor(rulesPath, eventHandlersPath) {
    super()
    this.rulesPath = process.cwd() + '/src/rules'
    this.eventHandlersPath = process.cwd() + '/src/handler'
    // make all Classes available, that can process an Event.
    this.loadEventHandlers(this.eventHandlersPath, handlerMap)
    // Create a Rules-Engine instance
    const options = { allowUndefinedFacts: true }
    this.engine = new Engine([], options)
    // Prepare the Rules-Engine
    this.loadCustomOperators()
    this.getServerRules('')
    this.config = this.loadeventConfiguration()
  }

  /** -------------------------------------------------------------------------
   * Singleton pattern
   ------------------------------------------------------------------------- */
  static getInstance() {
    if (!instance) {
      instance = new eventHandler()
    }

    return instance
  }

  /** -------------------------------------------------------------------------
   * @description Load custom configurations.
   *  Eg.: client rules repo, rules reload-interval etc.
   ------------------------------------------------------------------------- */
  loadeventConfiguration() {
    // eslint-disable-next-line no-path-concat
    const tmp_config = fs.readFileSync(process.cwd() + '/.github/config.yml')
    config = JSON.parse(JSON.stringify(yaml.safeLoad(tmp_config), null, 4))
    refreshInterval = config.rules_refreshInterval
    rules_repo = config.rules_repo
    // Debug
    console.log('loadeventConfiguration() \n\t' + util.inspect(config))
  }

  /** -------------------------------------------------------------------------
   * @description Load all the Event Handler Classes that the Rules-Engine 
   *              might need to invoke on a successful Rule match.
   * @param {*} modulesPath 
   * @param {*} handlerMap 
   ------------------------------------------------------------------------- */
  loadEventHandlers(modulesPath, handlerMap) {
    fs.readdir(modulesPath, function (err, files) {
      files.forEach(file => {
        if (file.endsWith('.js')) {
          handlerMap[file.split('.')[0]] = require(modulesPath + '/' + file)
        }
      });
    });
    console.log('handlerMap: ' + util.inspect(handlerMap))
  }

  /** -------------------------------------------------------------------------
   * Add custom operators to the engine
   * These operators support `Regular Expressions` or
   * `Date Time check` (in case something needs to 'expired') 
   ------------------------------------------------------------------------- */
  loadCustomOperators() {

    this.engine.addOperator('doesNotInclude', (factValue, jsonValue) => {
      if (factValue !== undefined) {
        return !(factValue).includes(jsonValue)
      }
      else {
        return false
      }
    })

    this.engine.addOperator('includes', (factValue, jsonValue) => {
      if (factValue !== undefined) {
        return (factValue).includes(jsonValue)
      }
      else {
        return false
      }
    })

    this.engine.addOperator('includesAny', (factValue, jsonValue) => {
      if (factValue !== undefined) {
        return (factValue).every(function () { (factValue).includes(jsonValue) })
      }
      else {
        return false
      }
    })

    this.engine.addOperator('doesNotIncludeAny', (factValue, jsonValue) => {
      if (factValue === undefined) {
        return true
      } else {
        return !(factValue).every(function () { (factValue).includes(jsonValue) })
      }
    })

    this.engine.addOperator('regex', (factValue, jsonValue) => {
      if (factValue !== undefined) {
        return (factValue).search(jsonValue) >= 0
      } else {
        return false
      }
    })

    this.engine.addOperator('isEmpty', (factValue, jsonValue) => {
      if (factValue === undefined || factValue.length == 0) {
        return true
      }
    })

    this.engine.addOperator('notEmpty', (factValue, jsonValue) => {
      if (factValue !== undefined && factValue.length != 0) {
        return true
      }
    })

    this.engine.addOperator('dateLessThan', (factValue, jsonValue) => {
      const nowTimeMs = (new Date()).getTime()
      const orgTimeMs = (new Date(factValue)).getTime()
      const days = Math.floor((nowTimeMs - orgTimeMs) / (1000 * 60 * 60 * 24))
      return days <= jsonValue
    })

    this.engine.addOperator('dateGreaterThan', (factValue, jsonValue) => {
      const nowTimeMs = (new Date()).getTime()
      const orgTimeMs = (new Date(factValue)).getTime()
      const days = Math.floor((nowTimeMs - orgTimeMs) / (1000 * 60 * 60 * 24))
      return days >= jsonValue
    })
  }

  /** -------------------------------------------------------------------------
   * @description Utility function
   * @param {*} element 
   ------------------------------------------------------------------------- */
  extension(element) {
    var extName = path.extname(element)
    return extName === '.yml'
  }

  /** -------------------------------------------------------------------------
   * @description Load and add all Rules to the Rules engine, 
   *              these come from files that start with the 'prefix'.
   * 
   * @param {*} prefix - Group Rules based on file name prefix
   ------------------------------------------------------------------------- */
  getServerRules(prefix) {
    if (typeof prefix == 'undefined') {
      prefix = ''
    }

    try {
      let rulesFiles = ''
      let jsonRule
      const files = fs.readdirSync(this.rulesPath)
      // Filter '.yml' files only
      files.filter(this.extension).forEach(rulesFile => {

        if (!prefix) { prefix = '' }
        if (rulesFile.startsWith(prefix)) {
          rulesFiles += ' ' + rulesFile
          // eslint-disable-next-line no-path-concat
          const ruleData = fs.readFileSync(this.rulesPath + '/' + rulesFile)

          if (path.extname(rulesFile) === '.json') {
            jsonRule = JSON.parse(ruleData)
          } else if (path.extname(rulesFile) === '.yml') {
            jsonRule = JSON.parse(JSON.stringify(yaml.safeLoad(ruleData), null, 4))
          }
          // console.log('jsonRule: ' + util.inspect(jsonRule))
          this.engine.addRule(jsonRule)
        } else {
          console.log('Ignoring rules file(s), [' + rulesFile + ']')
        }
      })
      console.log('Loading server rules file(s), [' + rulesFiles + ' ]')

    } catch (err) {
      console.log('error reading rules from, [' + process.cwd() + '/src/' + this.rulesPath + ']')
      console.log('error: ' + err)
    }
  }

  /** -------------------------------------------------------------------------
   * Load all the Rules files from the Repository '.github/rules' folder
   * (Client-Side)
   * 
   * Note: 'getConfig' does not support reading multiple files from a folder.
   *       We use a workaround to read all files.
   * 
   * @param {*} context 
   ------------------------------------------------------------------------- */
  async getClientRules(context) {
    let files = []

    // Reduce the overhead of loading Repo Rules for every request
    // If the 'refreshInterval' (in min) has not been exceeded, use the 'old' Rules
    const rightNow = Date.now();

    // check if the 'interval' was exceeded and we need to reload the rules
    if (lastRefeshTime !== 0 && (rightNow - lastRefeshTime) < (refreshInterval * 60000)) {
      context.log('NO repository rules refresh required, last refresh ' + ((rightNow - lastRefeshTime) / 60000).toFixed(2) + ' minutes ago (set refresh time = ' + refreshInterval + ' min)')
    }
    else {
      // clean up the client-side rules from the engine and reload the rules 
      // DO NOT touch the server - side rules
      // ----------------------------------------------------------------------
      context.log('Repository rules refresh REQUIRED, last refresh ' + ((rightNow - lastRefeshTime) / 60000).toFixed(2) + ' minutes ago (set refresh time = ' + refreshInterval + ' min)')
      // Clean up - Remove all rules from the engine.
      rulesList.forEach(rule => {
        const ret = this.engine.removeRule(rule)
        context.log('successfully removed rule? ' + ret)
      })
      // store the time of the last reload
      lastRefeshTime = Date.now();

      // set the client-side rules location
      // by default take the repository that send the event
      let rules_repo = context.payload.repository.name
      context.log('rules_repo: ' + rules_repo)

      // if configured, take a custom repo on the Org (kind of centralized)
      if (typeof config.rules_repo !== 'undefined' && config.rules_repo !== '.') {
        rules_repo = config.rules_repo
      }

      // context.log(util.inspect(context))
      
      try {
        context.log('get list of client rules from Repo: '+ rules_repo)
        context.log('context.payload.repository.owner.login: '+ context.payload.repository.owner.login)
        // get a list of Rules files from the Repository config
        const response = await context.github.repos.getContent(
          {
            owner: context.payload.repository.owner.login,
            repo: 'bar',
            path: '.github/rules/'
          }
        )

        // "One File One Rule" - load them all
        for (let i = 0; i < files.length; i++) {
          context.log('reading client-side (' + rules_repo + ') rules file: ' + files[i])
          // Read the Rules from the Repository
          const ruleData = await context.github.repos.getContent(
            {
              owner: context.payload.repository.owner.login,
              repo: rules_repo,
              path: '.github/rules/' + files[i]
            }
          );

          // get the BASE64 Decoded rule-data
          const rule = new Rule(JSON.stringify(yaml.safeLoad(Buffer.from(ruleData.data.content, 'base64'))))

          // Store the rules, so that we can remove them on Rules reload
          rulesList.push(rule)

          try {
            await this.engine.addRule(rule)
          } catch (err) {
            context.log('error reading rules from, [.github/rules/]')
            context.log('error: ' + err)
          }
        }

        // load the file names into an Array
        response.data.forEach(data => {
          files.push(data.name)
        })
      } catch (e) {
        context.log(e)
      }
    }
  }

  /** -------------------------------------------------------------------------
   * @description Transform GitHub context (JSON) into event Facts.
   *              This is a little 'workaround' method.
   * 
   *              A sample event Fact:
   *              {key: value}
   * 
   *              Sample JSON context (dummy array 'a[]'):
   *              {
   *                d: {
   *                  e: 'foo2'
   *                },
   *                a: [
   *                  {
   *                    b: 'x1',
   *                    c: 'y1'
   *                  },
   *                  {
   *                    b: 'x2',
   *                    c: 'y2'
   *                  },
   *                ]
   *              } 
   * 
   *              Flatten the JSON context (array result of 'flatten()')
   *              {
   *                 d.e: 'foo2',
   *                 a.1.b: 'x1',
   *                 a.1.c: 'y1',
   *                 a.2.b: 'x2', 
   *                 a.2.c: 'y2',
   *              }
   * 
   *              translate to...
   *              {
   *                 d.e: 'foo2',                
   *                 a.b: [x1,x2],
   *                 a.c: [y1,y2]
   *              }
   * 
   * @param {*} context 
   ------------------------------------------------------------------------- */
  translateToRulesFacts(context) {
    var facts = flatten(context)
    var newFacts = {}

    context.log('translateToRulesFacts(context)')
    // Let's turn an Array into a fact
    // Regex to identify an Array, the key contains a sequence number (eg: .1. )
    const regex = /\.\d{1}\.|\d{2}\./;

    for (const [key, value] of Object.entries(facts)) {
      if (key.startsWith('payload.') && key.match(regex)) {
        var newKey = key.replace(regex, '.')
        if (!newFacts.hasOwnProperty(newKey)) {
          newFacts[newKey] = []
        }
        newFacts[newKey].push(value)
        // remove the 'old' key
        delete facts[key]
      }
    }

    // Add the translated facts (Array) to the original facts
    for (const [key, value] of Object.entries(newFacts)) {
      facts[key] = value
    }

    return facts
  }

  /** -------------------------------------------------------------------------
   * @description Execute the Rule process and load (or reload) the rules
   *              for every event invocation.
   *              This creates some 'loading' overhead but also allows us to
   *              update the rules without having to restart the App.
   *              (NOTE: rule loading, operates on interval timeout)
   * @param context
   ------------------------------------------------------------------------- */
  async execute(context) {
    context.log('eventHandler.execute()')
    // check if client-side rules need to be reloaded, if yes, do so
    // await this.getClientRules(context)
    const facts = this.translateToRulesFacts(context)
    let e

    try {
      console.log('facts payload.action: ' + util.inspect(facts['payload.action']))
      console.log('facts payload.issue.id: ' + util.inspect(facts['payload.issue.id']))
      console.log('facts payload.comment.id: ' + util.inspect(facts['payload.comment.id']))
      console.log('facts payload.comment.body: ' + util.inspect(facts['payload.comment.body']))
      console.log('facts payload.issue.assignee: ' + util.inspect(facts['payload.issue.assignee.login']))
      console.log('facts payload.issue.assignees: ' + util.inspect(facts['payload.issue.assignees.login']))
    }
    catch (e)
    {
      consile.log(e)
    }

    // if (context.payload.sender.type != 'Bot') {
    // Run the engine to evaluate the facts and conditions
    this.engine
      .run(facts, { cache: false })
      .then(results => {
        results.events.map(event => {
          e = event
          context.log('===>> Rule Matched: ' + event.type + '(' + util.inspect(event.params) + ')')
          context.log('handlerMap[event.type]: '+ util.inspect(handlerMap))
          const m = new handlerMap[event.type]()
          // Debug
          context.log('===>> Routing to rulesHandler Class: ' + event.type + '(' + context + ',' + util.inspect(event.params) + ')')
          m.execute(context, event.params.data)
        })
      })
      .catch(function (err) {
        console.log('error: ', err)
        console.log('event.type: >' + e.type + '<')
        console.log(util.inspect(e.params))
      })

    // }
    // else {
    //   console.log('context.payload.sender.type: >' + context.payload.sender.type + '<')
    // }
  }
}

module.exports = eventHandler;
