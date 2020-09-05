const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert')
const url = process.env.MONGO_URI
const dbName = 'users'

router.get('/users', async function(req, res) {

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err)
    console.log('connected succesfully')

    const db = client.db(dbName)
    db.collection('user').find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records")
      console.log(docs) 
      res.json(docs)
    });
    client.close()
  })
});

router.post('/newuser', async function(req, res) {
  const emails = req.body.emails
  const userData = []
  
  for (email of emails) {
    if (email.length > 3) {
      const newDocument = {
        userid: uuidv4(),
        email: email
      }
      userData.push(newDocument)
    }   
  }

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName)
    db.collection('user').insertMany(userData).then(function(result) {
      console.log(result)      
    })
    client.close();
  })

  res.redirect('/admin')
});

module.exports = router;
