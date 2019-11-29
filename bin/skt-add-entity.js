#!/usr/bin/env node

const program = require('commander')
const fse = require('fs-extra')
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
	console.log(logSymbols.info, chalk.default.cyan('you are adding a entity'))
	const answer = await inquirer.prompt([
		 {
			name: 'name',
			message: `what's the name of the entity`,
			type: 'input',
			
		}
	])
	if(fs.existsSync(path.join(entitiesDir, answer.name))) {
		return console.log(logSymbols.error, chalk.default.red(`entity ${answer.name} has been existed`))
	}
	const location = path.join(entitiesDir, answer.name)
	fse.copySync(path.join(__dirname, '../lib/entity_example'), path.join(location), {dereference: answer.name, overwrite: false, recursive: true, errorOnExist: true})
	console.log()
	console.log(logSymbols.success, chalk.default.green(`entity '${answer.name}' was added successfully`))
	console.log()
	console.log(chalk.default.blueBright(`> router.js: ${path.join(location, 'router.js')}`))
	console.log(chalk.default.blueBright(`> controller.js: ${path.join(location, 'controller.js')}`))
	console.log(chalk.default.blueBright(`> service.js: ${path.join(location, 'service.js')}`))
	}
)