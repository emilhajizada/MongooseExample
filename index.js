const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();
const app = express();

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true },
  age: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const Users = mongoose.model("users", userSchema);

app.use(cors());
app.use(bodyParser.json());

//GetAllUser

app.get("/users", (req, res) => {
  Users.find({}, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.status(404).json({ message: err });
    }
  });
});

//GEt user by Id

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  Users.findById(id, (err, doc) => {
    if (!err) {
      if (doc) {
        res.send(doc);
        res.status(200);
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    }
  });
});

//Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  Users.findByIdAndDelete(id, (err, doc) => {
    if (!err) {
      res.send("Successfully deleted");
    } else {
      res.status(404).json({ message: err });
    }
  });
});

//Add user

app.post("/users", (req, res) => {
  let user = new Users({
    fullName: req.body.fullName,
    userName: req.body.userName,
    age: req.body.age,
    imageUrl: req.body.imageUrl,
  });

  user.save();

  res.send({ message: "Success" });
});

//update user

app.put("/users/:id", (req, res) => {
  const { id } = req.params;

  Users.findByIdAndUpdate(id, (err, doc) => {
    if (!err) {
      res.status(201);
    } else {
      res.status(404).json({ message: err });
    }
  });
  res.send({ message: "Successfully Updated" });
});

const PORT = process.env.PORT;
const url = process.env.CONNECTION_URL.replace(
  "<password>",
  process.env.PASSWORD
);

app.get("/", (req, res) => {
  res.send("<h1>Admin PAnel</h1>");
});
mongoose.set("strictQuery", false);
mongoose.connect(url, (err) => {
  if (!err) {
    console.log("DB Connect");

    app.listen(PORT, () => {
      console.log("Server start");
    });
  }
});
