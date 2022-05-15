// make css file available to client
const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
// import connection from sequelize
const sequelize = require('./config/connection');
// set up handlebars.js
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;


const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitalized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
// register hbs engine with the express app
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
// set force: true so tables re-creat/ false to turn off

  app.listen(PORT, () => console.log('Now listening'));
