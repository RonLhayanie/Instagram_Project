const express = require('express')
const app = express()

const usersRouter = require('./controllers/usersController')
const chatsRouter = require('./controllers/chatsController')

const path = require('path')

app.use(express.json())
app.use(express.static('views'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

app.use('/users', usersRouter)
app.use('/chats', chatsRouter)

app.get('/', (req, res) => {
    res.redirect('login/login.html')
})

app.listen(3000)