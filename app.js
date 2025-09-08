const express = require('express')
const app = express()
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const usersRouter   = require('./controllers/usersController')
const chatsRouter   = require('./controllers/chatsController')
const postsRouter   = require('./controllers/postsController')
const weatherRouter = require('./controllers/weatherController');


const path = require('path')

app.use(express.json())
app.use(express.static('views'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

app.use('/users', usersRouter)
app.use('/chats', chatsRouter)
app.use('/posts', postsRouter)
app.use('/weather', weatherRouter);
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
    res.redirect('login/login.html')
})

app.listen(3000)