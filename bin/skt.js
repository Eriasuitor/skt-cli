#!/usr/bin/env node
const program = require('commander')


Promise.resolve().then(async () => {
	program.version('1.0.0')
		.usage('[cmd]')
		.command('create', 'creat a folder and initialize it to be a web server')
		.parse(process.argv)
})