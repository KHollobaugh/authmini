const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
  //grab username from body
  const creds = req.body;
  //generate hash from password
  const hash = bcrypt.hashSync(creds.password, 4)
  // override user.password with the hash
  creds.password = hash;
  //save user to database
  db('users')
  .insert(creds)
  .then(ids => {
    res.status(201).json(ids);
  })
  .catch(err => json(err));
})



server.post('/api/login', (req, res) => {
  //grab username from body
  const creds = req.body;
  db('users')
  .where({ username: creds.username })
  //generate hash from password
  .first()
  .then( user => {
    if (user && bcrypt.compareSync(creds.password, user.password)
) {
  //passwords match and user exists
  res.status(200).json({ message: 'welcome!' })
    } else {
      //username invalid or password wrong
      res.status(401).json({ message: 'you shall not pass!'})
    }
  })
  .catch(err => res.json(err)) //rounds is 2^X
  //override user.password with the hash
//   creds.password = hash;
//   //save user to database
//   db('users')
//   .insert(creds)
//   .then(ids => {
//     res.status(201).json(ids);
//   })
//   .catch(err => json(err));
})

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
