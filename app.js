const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const method = require('method-override');
const flash = require('connect-flash');
const log = require('./bin/trash');

require('dotenv').config();

// routes 
const root = require('./routes/index');
const todo = require('./routes/todo');

const app = express();

const PORT = process.env.PORT;
const dbURI = process.env.URI;
const SECRET = process.env.SECRET;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, err => err ? log(err) : log(`running on ${PORT}`));
})
.catch((err) => {
    log(err)
})

const db = mongoose.connection;
db.on('connected', () => {
    log(`Database ${db.name} connected at ${db.host}:${db.port}`);
});

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(method('_method'));
app.use(express.static('public'));
app.use(session({
    secret: SECRET,
    name: 'session-api',
    saveUninitialized: false, 
    resave: false,
    store: new MongoStore({
        mongoUrl: dbURI,
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
    }
}));
app.use(flash());

app.set('view engine', 'ejs');

app.use('/', root);
app.use('/todo', todo);

app.use((req, res) => {
    res.status(404).render('unfound/404', {
        title: 'Oops',
        current: req.originalUrl,
    });
});