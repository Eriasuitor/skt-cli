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

const skeletonUrl = 'https://github.com/Eriasuitor/node-server-skeleton.git'
const skeletonRepo = 'github:Eriasuitor/node-server-skeleton#master'

Promise.resolve().then(async () => {
	program.version('1.0.0')
		.usage('<folder-name> the folder name that need to be created and initialized to be a web server')
		.parse(process.argv)

	const projectName = program.args[0]
	if (!projectName) {
		return program.help()
	}

	const pwd = process.cwd()
	const projectPath = path.join(pwd, projectName)
	const dirs = fs.readdirSync(pwd)
	const duplicatedProject = dirs.find(dir => dir === projectName && fs.statSync(path.join(pwd, projectName)).isDirectory())
	if (duplicatedProject) {
		return console.error(logSymbols.warning, chalk.red(`project ${projectName} already existed`))
	}
	try {
		let projectInfo = {
			name: projectName,
			version: '1.0.0',
			desc: ''
		}
		// projectInfo = await inquirer.prompt([
		// 	{
		// 		name: 'name',
		// 		message: 'project name',
		// 		default: projectInfo.name
		// 	}, {
		// 		name: 'version',
		// 		message: 'version',
		// 		default: projectInfo.version
		// 	}, {
		// 		name: 'desc',
		// 		message: projectInfo.desc
		// 	}
		// ])
		const spinner = ora(chalk.blueBright(`cloning skeleton from github: ${skeletonUrl}`), { color: 'blue' })
		spinner.start()
		await new Promise((resolve, reject) => {
			download(skeletonRepo,
				projectPath, (err) => {
					if (err) {
						spinner.fail()
						reject(err)
					} else {
						spinner.succeed()
						resolve()
					}
				})
		})

		await new Promise((resolve, reject) => {
			let metadata = { projectInfo }
			console.log(path.join(projectPath, 'entities'))
			Metalsmith(process.cwd())
				.metadata(metadata)
				.clean(false)
				.source(path.join(projectPath))
				.ignore(path.join(projectPath, 'utils'), path.join(projectPath, 'entities'))
				.destination(projectPath)
				.use((files, metalsmith, done) => {
					const meta = metalsmith.metadata()
					Object.keys(files).forEach(fileName => {
						const t = files[fileName].contents.toString()
						files[fileName].contents = Buffer.from(Handlebars.compile(t)(meta))
					})
					done()
				}).build(err => {
					err ? reject(err) : resolve();
				})
		})
		rimraf.sync(path.join(projectPath, '.git'))
		console.log(logSymbols.success, chalk.green(`project ${projectInfo.name} initialize success`))
	} catch (error) {
		rimraf.sync(projectPath)
		console.error(logSymbols.error, chalk.red(`initialize failed. ${error}`))
		console.error(logSymbols.error, chalk.red(error.stack))
	}
	process.exit(0)
})