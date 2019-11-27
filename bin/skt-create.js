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
		.usage('<folder-name> the folder name that need to be created and initialized to be a web server')
		.parse(process.argv)

	let projectName = program.args[0]
	const pwd = process.cwd()
	let projectPath
	let safeMode = false
	if (!projectName) {
		safeMode = true
		console.log(logSymbols.warning, chalk.default.yellow('project name was not specified, project will be created in the current directory'))
		projectName = path.basename(pwd)
		answer = await inquirer.prompt([
			{
				name: 'useCurrentDir',
				message: `do you want to create a project named "${projectName}" in the current directory?`,
				default: false,
				type: 'confirm',
				prefix: logSymbols.warning
			}
		])
		if(!answer.useCurrentDir) {
			return program.help()
		}
		console.log(logSymbols.info, "please insure that no duplicated files or folders was existed in this directory")
		projectPath = pwd
	}
	projectPath =  projectPath || path.join(pwd, projectName)
	const dirs = fs.readdirSync(pwd)
	const duplicatedProject = dirs.find(dir => dir === projectName && fs.statSync(path.join(pwd, projectName)).isDirectory())
	if (duplicatedProject) {
		return console.error(logSymbols.error, chalk.red(`project ${projectName} already existed`))
	}
	try {
		let projectInfo = {
			name: projectName,
			version: '1.0.0',
			desc: ''
		}
		projectInfo = await inquirer.prompt([
			{
				name: 'name',
				message: 'project name',
				default: projectInfo.name
			}
		])
		const spinner = ora(chalk.blueBright(`cloning skeleton from github: ${skeletonUrl}`), { color: 'blue' })
		spinner.start()
		const tmpGitPath = path.join(projectPath, 'tmp_git')
		await new Promise((resolve, reject) => {
			download(skeletonRepo,
				tmpGitPath, (err) => {
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
			Metalsmith(process.cwd())
				.metadata(metadata)
				.clean(false)
				.source(path.join(tmpGitPath))
				.ignore(path.join(tmpGitPath, 'utils'), path.join(tmpGitPath, 'entities'))
				.destination(tmpGitPath)
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
		fse.copySync(tmpGitPath, projectPath, {overwrite: false, recursive: true, errorOnExist: true, filter: (src, dest) => {
			return ![path.join(tmpGitPath, '.git')].includes(src)
		}})
		rimraf.sync(tmpGitPath)
		console.log()
		console.log(logSymbols.success, chalk.green(`project ${projectInfo.name} initialize success`))
		console.log(`as the subsequent steps, you can ${safeMode || "go to the target directory and"} run commands as follow:

npm install: install all dependencies.
npm start: start skeleton server with environment 'local'.
		`)
	} catch (error) {
		rimraf.sync(tmpGitPath)
		!safeMode && rimraf.sync(projectPath)
		console.error(logSymbols.error, chalk.red(`initialize failed. ${error}`))
		console.error(logSymbols.error, chalk.red(error.stack))
	}
	process.exit(0)
})