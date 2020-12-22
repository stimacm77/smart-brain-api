const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

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

app.post('/signin', (req, res) => {
  // console.log('signin', email, name, password);
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      // console.log(data);
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
      if (isValid) {
        return db.select('*').from('users')
        .where('email','=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user', isValid))
      } else {
        res.status(400).json('login info not correct')
      }
  })
    .catch(err => res.status(400).json('wrong credentials'))

})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  console.log(email, name, password);
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*')
      .insert({
      email: loginEmail[0],
      name: name,
      joined: new Date()
    })
      .then(user => {
      res.json(user[0]);
    })
  })
  .then(trx.commit) 
  .then(console.log('commit'))
  .catch(trx.rollback)
  // console.log('rollback')
}) 
    .catch(err => res.status(400).json('unable to register'))
})

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