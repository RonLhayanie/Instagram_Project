const express = require('express')
const router = express.Router()
const users = require('../models/chatsModel')

const path = require('path')
router.use(express.static(path.join(__dirname, 'public')))
router.use(express.json())

// https methods - post/get/delete...

module.exports = router