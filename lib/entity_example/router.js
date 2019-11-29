const joi = require('joi')
const UserController = require('./controller')
const {validateSchemas, validateToken, selfOnly, withRole} = require('../../utils/middleware')
// eslint-disable-next-line no-unused-vars
const express = require('express')
const Role = require('../../enum/role')
const {userSchemas} = require('../../schema/index')

/**
 * @param {express.application} app
 */
exports.router = (app) => {
  
}
