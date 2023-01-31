import express from "express";
import { User } from "./db/db.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import cors from "cors";
import moment from "moment";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

app.get("/", function (req, res) {
  console.log("request came");
  res.json({
    connection:
      "Assalamu Alaykum My dear Brother or Sister Welcome to Users management system",
  });
});

// create user route.
app.post("/create_user", async function (req, res) {
  try {
    const user = new User(req.body);
    user.save(function (err) {
      console.log(err);
    });

    console.log(req.body);

    res.json({ response: "user has been created successfully" });
  } catch (error) {
    console.log(error);
  }
});

// login user
app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    let login = await User.find({
      email: req.body.email,
    });
    console.log(login);
    if (
      login[0].email === req.body.email &&
      login[0].password === req.body.password
    ) {
      if (login[0].status === false) {
        res.sendStatus(200);
      } else if (login[0].status === true) {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

// delete user
app.post("/delete_user", async function (req, res) {
  res.json({ response: "user has been deleted successfully" });
  try {
    await User.remove(
      {
        _id: req.body.id,
      },
      function (err, result) {
        if (err) return console.log(err);
        console.log("removed");
      }
    );
    console.log("deleted");
  } catch (error) {
    console.log(error);
  }
});

// delete selected users
app.post("/delete_selected_users", async function (req, res) {
  try {
    User.deleteMany({ _id: { $in: req.body.selectedUsers } }, function (err) {
      if (err) return console.log(err);
      console.log("deleted");
    });
    console.log("selected users has been deleted successfully");
    res.json({ response: "selected users has been deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ response: "selected users has not been deleted successfully" });
  }
});

// delete all users
app.post("/delete_all", async function (req, res) {
  try {
    User.remove({}, function (err, user) {
      if (err) return console.log(err);
      console.log("deleted");
    });

    res.json({ response: "all users have been deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ response: "all users have not been deleted successfully" });
  }
});

app.post("/updateLoginTime", (req, res) => {
  User.findOne({ email: req.body.email }, function (err, u) {
    if (err) return console.log(err);
    u.lastLogin = moment().format("lll");
    console.log("updated");
    u.save();
    console.log(u);
  });
});

// block user
app.post("/block_user", async function (req, res) {
  User.findOne({ _id: req.body.id }, function (err, u) {
    u.status = !u.status;
    u.save(function (err, updatedUser) {
      if (err) {
        console.log(err);
      } else {
        console.log(updatedUser);
      }
    });
  });
});

// last login
app.post("/lastlogin", async function (req, res) {
  try {
    const email = req.body.email;
    const user = User.findOne({ email: email });

    user.lastLogin = moment().format("lll");
    await user
      .save()
      .then((u) => console.log(u))
      .catch((err) => console.log(err));

    res.json({ javob: "time updated" });
  } catch (error) {
    res.json({ javob: "time not updated" });
  }
});

// fetch all users
app.get("/all_users", async function (req, res) {
  const users = await User.find({});

  res.json(users);
});

// start server
app.listen(8080, () => {
  console.log("app listening on port 8080");
});
