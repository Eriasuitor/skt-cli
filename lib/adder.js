const fs = require('fs')
const path = require('path')

const _addTextAtLastBrace = (fileLocation, text) => {
	const data = fs.readFileSync(fileLocation).toString()

  const position = data.lastIndexOf('}')
  const regResult  = data.slice(0, position).match(/\n/g)
	const line = regResult && regResult.length || 0
	fs.writeFileSync(fileLocation, `${data.slice(0, position)}${text}${data.slice(position, data.length)}`)
	return `${fileLocation}:${line + 2}`
}

exports.addController = (entityDir, name, entity) => {
	return _addTextAtLastBrace(path.join(entityDir, 'controller.js'), `
  /**
   * @param {express.request} req
   */
  static async ${name}(req) {
    return ${entity? `${entity.replace(/\w/, t => t.toUpperCase())}Service.${name}`: "null"}
  }
`)
}

exports.addService = (entityDir, name) => {
	return _addTextAtLastBrace(path.join(entityDir, 'service.js'), `
  static async ${name}() {
    return null
  }
`)
}

exports.addRouter = (entity, entityDir, url, method, name) => {
	return _addTextAtLastBrace(path.join(entityDir, 'router.js'), `
  app.${method}(
      '${url}',
      validateToken(),
      selfOnly(),
      validateSchemas({
        schema: joi.any()
      },
      ${entity.replace(/\w/, t => t.toUpperCase())}Controller.${name},
      {
        schema: joi.any()
      })
  )
`)
}

exports.addApi = (entity, entitiesDir, url, methods) => {
  console.log({entity, entitiesDir, url, methods})
  const entityDir = path.join(entitiesDir, entity)
	const result = {}
	methods.forEach(method => {
    method = method.toLowerCase()
		const routerLink = exports.addRouter(entity, entityDir, url, method, method)
		const controllerLink = exports.addController(entityDir, method, entity)
		const serviceLink = exports.addService(entityDir, method)
		result[method] = {routerLink, controllerLink, serviceLink}
	})
	return result
}