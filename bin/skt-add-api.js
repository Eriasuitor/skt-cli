#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const adder = require('../lib/adder')


Promise.resolve().then(async () => {
	program.version('1.0.0')
		.parse(process.argv)


	const pwd = process.cwd()
	const entitiesDir = path.join(pwd, 'entities')
	const entities = fs.readdirSync(entitiesDir)
	console.log(logSymbols.info, chalk.default.cyan('you are adding a new api'))
	const answer = await inquirer.prompt([
		 {
			name: 'url',
			message: `first of all, name it`,
			type: 'input',
			
		}, {
			name: 'methods',
			message: `and then, which methods do you like?`,
			choices: ['GET', 'PUT', 'POST', 'DELETE'],
			type: 'checkbox',
		}, {
			name: 'entity',
			message: `please choose the name of the entity which the api belong to`,
			choices: entities,
			type: 'rawlist',
		}
	])
	const result = adder.addApi(answer.entity, entitiesDir, answer.url, answer.methods)
	console.log(logSymbols.success, chalk.default.green(`${answer.url} add success. you can edit the files involved quickly by click those links with your Cmd or Ctrl`))
	answer.methods.forEach(method => {
		const lowerCase = method.toLowerCase()
		console.log()
		console.log(logSymbols.success, chalk.default.green(`${method} ${answer.url}`))
		console.log(chalk.default.blueBright(`> router.js: ${result[lowerCase].routerLink}`))
		console.log(chalk.default.blueBright(`> controller.js: ${result[lowerCase].controllerLink}`))
		console.log(chalk.default.blueBright(`> service.js: ${result[lowerCase].serviceLink}`))
	})
	}
)