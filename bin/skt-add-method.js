#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const adder = require('../lib/adder')


Promise.resolve().then(async () => {
	program.version('1.1.1')
		.parse(process.argv)


	const pwd = process.cwd()
	const entitiesDir = path.join(pwd, 'entities')
	const entities = fs.readdirSync(entitiesDir)
	console.log(logSymbols.info, chalk.default.cyan('you are adding a method for a service/controller'))
	const answer = await inquirer.prompt([
		{
			name: 'type',
			message: `what type of file did you want to add this method`,
			choices: ['Service', 'Controller'],
			type: 'list',
		},
		 {
			name: 'name',
			message: `what's the name of this method you are wanted to add`,
			type: 'input',
			
		}, {
			name: 'entity',
			message: `please choose the name of the entity which the service/controller belong to`,
			choices: entities,
			type: 'rawlist',
		}
	])
	const location = adder[`add${answer.type}`](path.join(entitiesDir, answer.entity), answer.name)
	console.log()
	console.log(logSymbols.success, chalk.default.green(`function '${answer.name}' was added successfully`))
	console.log()
	console.log(chalk.default.blueBright(`> ${answer.type.toLowerCase()}.js: ${location}`))
	}
)