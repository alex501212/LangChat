const express = require("express");
const router = express.Router();
const registerDetails = require("../models/RegisterModels");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

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
    nativeLang: req.body.nativeLang,
    targetLang: req.body.targetLang,
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

// get user by username
router.get("/profile/:username", (req, res) => {
  registerDetails
    .findOne({username: req.params.username})
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// authenticate user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await registerDetails.findOne({ username: username });
  if (!user) {
    return res.json({
      status: "error",
      error: "specified user does not exist",
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", token: token });
    } else {
      return res.json({ status: "error", error: "error" });
    }
  }
  res.json({ error: "invalid password" });
});

router.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    registerDetails
      .findOne({ username: user.user.username })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
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
      nativeLang: req.body.nativeLang,
      targetLang: req.body.targetLang,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;
