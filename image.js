const handleImage = (req, res, db, bcrypt) => {
  const { id } = req.body;
 db('entries').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
     console.log(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports ={
  handleImage: handleImage
};