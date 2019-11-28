#!/usr/bin/env node
const program = require('commander')


Promise.resolve().then(async () => {
	program.version('1.0.0')
		.usage('[cmd]')
		.command('create', 'creat a folder and initialize it as a basic web server')
		.command('add', 'add controller, service, model(when sequelize was used) etc. for your application')
		.parse(process.argv)
})