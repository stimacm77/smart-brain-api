const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'stimacm',
    password : '',
    database : 'smart-brain'
  }
});

//db.select('*').from('users').then(data => {
// });

app.use(express.json());
app.use(cors());

// app.get('/', (req, res => { res.send('It is working!') })

app.post('/signin', (req, res) => {signin.handlesignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.select('*').from('users').where({id}) 
    .then(user => {
      console.log(user)
      if (user.length) {
      res.json(user[0])
    } else {res.status(400).json('User not found')

    }
  })
    .catch(err => res.status(400).json('error getting user'))
  // if (!found) {
  // 	res.status(400).json('not found');
  // }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
 db('entries').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
     console.log(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

// bcrypt functions 
// bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
// });

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
// });


app.listen(3000, ()=> { 
  console.log('app is running on port 3000');
})

/*
/ --> res = this is working
/signin --> POST success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/