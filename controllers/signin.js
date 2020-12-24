const handleSignin = (req, res, db, bcrypt) => {
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
}

module.exports = {
  handleSignin: handleSignin
};