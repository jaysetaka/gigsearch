const express = require('express');
const bodyParser = require('body-parser');
const exphb = require('express-handlebars');
const path = require('path');
// database
const db = require('./config/database');

// test db
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error' + err))



const app = express();

// Handlebars
app.engine('handlebars', exphb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index', {layout: 'landing'}));

// Gig routes
app.use('/gigs', require('./routes/gigs'));

const PORT = process.env.PORT || 5000; 

app.listen(PORT, console.log(`Server Started On port ${PORT}`));