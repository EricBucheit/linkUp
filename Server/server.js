const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const cors = require("cors");

const {db, connection} = require('./sequelize');
const Routes = require('./Server/Routes');

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(bodyParser.json({extended: true}));

const { uuid } = require('uuidv4');
var session = require('express-session')
const Sequelize = require('sequelize')

var SequelizeStore = require("connect-session-sequelize")(session.Store);
 
var myStore = new SequelizeStore({
  db: connection,
});

var sess = {
  secret: "SDEIBSUEBIEYOkdnjbdig912i12ve8vdw7tecwt",
  cookie: {secure: false},
  genid: function(req) {
    return uuid() // use UUIDs for session IDs
  },
  proxy: true,
  store: myStore,
  secure : true,
  true: false,
  saveUninitialized: false,
  resave : false
}

myStore.sync();
 
if (process.env.ENVIRONMENT === 'PRODUCTION') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))


for (let index in Routes) {
  Routes[index](app, db);
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8080);