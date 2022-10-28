const express = require("express");
const router = express.Router();
const registerDetails = require("../models/RegisterModels");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

// add new user
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const newUser = new registerDetails({
    forename: req.body.forename,
    surname: req.body.surname,
    age: req.body.age,
    gender: req.body.gender,
    email: req.body.email,
    username: req.body.username,
    password: password,
    targetlang: req.body.targetlang,
  });
  newUser
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// get all users
router.get("/users/", (req, res) => {
  registerDetails
    .find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// get user by id
router.get("/users/:id", (req, res) => {
  registerDetails
    .findById(ObjectId(req.params.id))
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// delete user by id
router.delete("/users/:id", (req, res) => {
  registerDetails
    .deleteOne(ObjectId(req.params.id))
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// update user by id
router.put("/users/:id", async (req, res) => {
  let password = req.body.password;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(req.body.password, salt);
  }

  registerDetails
    .updateOne({
      forename: req.body.forename,
      surname: req.body.surname,
      age: req.body.age,
      gender: req.body.gender,
      email: req.body.email,
      username: req.body.username,
      password: password,
      targetlang: req.body.targetlang,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;
