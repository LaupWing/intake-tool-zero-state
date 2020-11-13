const { json } = require('body-parser');
const express = require('express')
const router = express.Router()

const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGO_URI;
let usersList = [];


router.get('/', async function(req, res) {
  if (req.session.loggedin) {
    MongoClient.connect(url, function(err, client){
      const db = client.db('users');
      db.collection('user').find({}).toArray(function(err, users){
        let counter;
        for(counter= 0; counter <= (users.length-1); counter++) {
          console.log(users[counter].email);
          if(!usersList.includes(users[counter].email) && !users[counter].email == ""){
            usersList.push(users[counter].email);
          }
        }
      })
        res.render('admin', {
          context:'admin',
          usersList
      })
    })
  } else {
    res.redirect('/login')
  }
})

module.exports = router
