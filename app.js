require('dotenv').config();

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const connection = require('./util/Connection');

const mongoref = connection.mongoref;

const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
// const { connect } = require('http2');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(homeRoutes);

app.use(authRoutes);

app.use('/admin', adminRoutes);

app.use((req, res, next) => {
    res.status(404).render('error.ejs',{
            pageTitle: 'Page Not found'
    });
});

// Run 'http://localhost:3000/' to run the code

app.listen(process.env.PORT);