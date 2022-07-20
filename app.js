const express = require('express');

const path = require('path');

const ejsMate = require('ejs-mate');

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/solver', (req, res) => {
    res.render('solver');
})

app.get('/random', (req, res) => {
    res.render('random');
})

app.get('/grid', (req, res) => {
    res.render('grid');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})