const express = require('express')
const app = express()

const usersRouter = require('./controllers/usersController')

const path = require('path')

app.use(express.json())
app.use(express.static('views'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

app.use('/users', usersRouter)

app.get('/', (req, res) => {
    res.redirect('signup/signup.html')
})

app.listen(3000)