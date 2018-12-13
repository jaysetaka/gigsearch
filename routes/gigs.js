const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get gig list
router.get('/', (req, res) => 
Gig.findAll()
  .then(gigs => res.render('gigs', {gigs}))
  .catch(err => console.log('Error: ' + err))
);

// display add gig form
router.get('/add', (req, res) => res.render('add'));

// add a gig
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;

  // initialize errors
  let errors = [];

  // validate fields
  if(!title){
    errors.push({ text: 'Please Add A Title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please Add Some Technologies' });
  }
  if (!description) {
    errors.push({ text: 'Please Add A Description' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please Add A Contact Email' });
  }

  // check for errors

  if(errors.length > 0){
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email
    });


  }else{
    if(!budget){
      budget = 'Unknown';
    } else {
      budget = `R${budget}`;
    }

    // make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ',');
     // instert into table
    Gig.create({
      title,
      description,
      budget,
      technologies,
      contact_email
    })
      .then(gig => res.redirect('/gigs'))
      .catch(err => console.log(err))
  } 
});
// search gigs
router.get('/search', (req, res) => {
  let { term } = req.query;

  term = term.toLowerCase();

  Gig.findAll({ where: { technologies: { [Op.like]: '%'  + term + '%' } } })
    .then(gigs => res.render('gigs', {gigs} ))
    .catch(err => console.log(err));
});

module.exports = router;