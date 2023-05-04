const express = require("express");
const router = express.Router();
const registerDetails = require("../models/RegisterModels");
const reportDetails = require("../models/UserReportModels");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { rename } = require("node:fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./userProfileImages/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.username + "_profile_image.jpg");
  },
});

const upload = multer({ storage: storage });

dotenv.config();

// add new user
router.post("/register", upload.single("profileImage"), async (req, res) => {
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

  const user = await registerDetails.findOne({
    username: req.body.username,
  });

  if(user !== null) {
    return res.json({
      status: "error",
      error: "Username is already taken",
    });
  }

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
    .findOne({ username: req.params.username })
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
      error: "Invalid username",
    });
  }

  // is user banned?
  const currentDate = new Date()
  
  if(user.banEndDate !== null && user.banEndDate > currentDate) {
    const formattedDate = user.banEndDate.toUTCString();
    return res.json({ status: "User Banned", error: `You are banned from accessing LangChat's services until ${formattedDate}` });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", token: token });
    } else {
      return res.json({ status: "error", error: "Invalid password" });
    }
  }
  res.json({ error: "Invalid password" });
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

// delete user by username
router.delete("/users/:username", (req, res) => {
  registerDetails
    .deleteOne({ username: req.params.username })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// update user by username
router.put(
  "/users/:username",
  upload.single("profileImage"),
  async (req, res) => {
    const user = await registerDetails.findOne({
      username: req.params.username,
    });

    let password = user.password;

    if (req.body.oldPassword && req.body.newPassword) {
      if (!user) {
        return res.json({
          status: "error",
          error: "Specified user does not exist",
        });
      }
      if (await bcrypt.compare(req.body.oldPassword, user.password)) {
        if (req.body.newPassword) {
          const salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(req.body.newPassword, salt);
        }
      } else {
        return res.json({ error: "Invalid password" });
      }
    }

    // if username changed, change profile image file name
    if (req.params.username !== req.body.username) {
      rename(
        `userProfileImages/${req.params.username}_profile_image.jpg`,
        `userProfileImages/${req.body.username}_profile_image.jpg`,
        (err) => {
          if (err) throw err;
        }
      );
    }

    registerDetails
      .updateOne(
        { username: req.params.username },
        {
          $set: {
            forename: req.body.forename,
            surname: req.body.surname,
            age: req.body.age,
            gender: req.body.gender,
            password: password,
            email: req.body.email,
            username: req.body.username,
            nativeLang: req.body.nativeLang,
            targetLang: req.body.targetLang,
          },
        }
      )
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  }
);

// create new user report
router.post("/report", async (req, res) => {
  const newReport = new reportDetails({
    message: req.body.message,
    reportedUser: req.body.reportedUser,
    reason: req.body.reason,
  });
  newReport
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// get all user reports
router.get("/reports/", (req, res) => {
  reportDetails
    .find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

// ban user by username
router.put("/ban/:username", async (req, res) => {
  // calculate ban end date
  const banLength = parseInt(req.body.banLength);
  let banEndDate = new Date();

  banEndDate.setDate(banEndDate.getDate() + banLength);

  registerDetails
    .updateOne(
      { username: req.params.username },
      {
        $set: {
          banEndDate: banEndDate,
        },
      }
    )
    .then((data) => {
      reportDetails
        .deleteOne({ _id: req.body.reportId })
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res.json(error);
        });
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;
