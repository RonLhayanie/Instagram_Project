const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // להתקנה: npm install cors

const postsRouter = require('./controllers/postsController');
const usersRouter = require('./controllers/usersController');

app.use(cors()); // אפשר בקשות ממקורות שונים
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.redirect('/login/login.html');
});

app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});