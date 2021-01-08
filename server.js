const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NOD_TLS_REJECT_UNAUTHORIZED = 0; 		

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: false
  }
});

//db.select('*').from('users').then(data => {
// });

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it is working!') })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => { image.handleImage(req, res, db)})

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


app.listen(process.env.PORT || 3000, ()=> { 
  console.log(`app is running on ${process.env.PORT}`);
})

/*
/ --> res = this is working
/signin --> POST success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/