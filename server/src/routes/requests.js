const express = require("express");
const router = new express.Router();
const Request = require("../models/request");
const auth = require("../middleware/auth");
const { query } = require("express");

router.post("/requests", auth, async (req, res) => {
  const user = req.user;
  console.log(user);
  const request = new Request({ ...req.body, owner: user._id });
  console.log(request);
  try {
    await request.save();
    res.status(201).send(request);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/requests/admin", auth, async (req, res) => {
  console.log(req.query)
  try {
    const requests = await Request.find({}).sort({createdAt: -1}).limit(+req.query.limit);
    res.send(requests);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/requests/admin/all", auth, async (req, res) => {
  console.log(req.query)
  try {
    const requests = await Request.find({}).sort({createdAt: -1});
    res.send(requests);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/requests", auth, async (req, res) => {
  try {
    await req.user.populate({path: 'requests', options: { sort: {  'updatedAt': -1  } }});
    res.send(req.user.requests);
    console.log(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/requests/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["status", "declineExplanation"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  if (!req.user.isAdmin) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const request = await Request.findOne({
      _id: req.params.id
    });
    if (!request) {
      return res.status(404).send();
    }
    updates.forEach((update) => (request[update] = req.body[update]));

    await request.save();

    res.send(request);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
