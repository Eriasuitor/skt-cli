#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const rimraf = require("rimraf")
const fse = require('fs-extra')
const child_process = require('child_process')

const skeletonUrl = 'https://github.com/Eriasuitor/node-server-skeleton.git'
const skeletonRepo = 'github:Eriasuitor/node-server-skeleton#master'

Promise.resolve().then(async () => {
	program.version('1.0.0')
		.usage('add <item>')
		.command('entity', 'add a entity')
		.command('api', 'add a api with router, controller and service')
		.command('method', 'add a method for specified controller or service')
		.parse(process.argv)
})