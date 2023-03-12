const express = require('express');
const router = new express.Router()
const User = require("../models/user");
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken');

router.post("/users", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    const expiresIn = jwt.verify(token, 'finalproject').exp
    res.status(201).send({ user, token, expiresIn })
  } catch (e) {
     res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    const expiresIn = jwt.verify(token, 'finalproject').exp
    res.send({ user, token, expiresIn })
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/users/password', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
      return res.status(404).send()
    }
    user.password = req.body.password
    await user.save();
    const token = await user.generateAuthToken()
    const expiresIn = jwt.verify(token, 'finalproject').exp
    res.send( {user, expiresIn, token } )
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch("/users/email", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    if (!user) {
      req.user.email = req.body.email
      await req.user.save();
      res.send(req.user)
    } else {
      res.status(500).send(e);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/users/changePassword", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email
    });
    user.password = req.body.password
    await user.save();
      res.send(user)
  } catch (e) {
    res.status(400).send(e);
  }
});


  router.get("/users", async (req, res) => {
    try {
      const users = await User.find({})
      res.send(users)
    } catch (e) {
      res.status(500).send()
    }
  });
  

module.exports = router