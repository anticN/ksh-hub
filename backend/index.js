import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from "cors";
import crypto from "crypto";
/*
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
*/

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use("/record", records);

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))

mongoose.connect('mongodb://localhost:27017/KSH-Hub',
  {
    useNewUrlParser: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to MongoDB");
});

function addUserToDB(user) {
  db.collection("User").insertOne(user, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/login', (req, res) => {
  const { email, password } = req.body
  //! secretAdminCredentials definieren !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (password === secretAdminCredentials.password) {
    req.session.email = email

    res.status(200).json({ email: req.session.email })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
});

app.get('/signup', (req, res) => {
  res.send('Frontend is coming soon')
});

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const credentials = email.split("@");
  if(db.collection("User").countDocuments({email: email}) === 0) {
    if (credentials[1] === "student.ksh.ch") {
      const names = credentials[0].split(".");
      const schoolClass = req.body.schoolClass;
      const goodSubjects = req.body.goodSubjects;
      const badSubjects = req.body.badSubjects;
      
      const user = {
        vorname: names[0],
        nachname: names[1],
        email: email,
        schoolClass: schoolClass,
        goodSubjects: goodSubjects,
        badSubjects: badSubjects,
        coins: 10,
        amntHelpTaken: 0,
        amntHelpGiven: 0,
        ratings: [],
        warnings: 0,
        salt: hashpw().salt,
        hashed: hashpw().hashed
      }
      addUserToDB(user);
      res.send(`Hello ${names[0]} ${names[1]}! your acc has been created with hashed password: ${hashpw()}`);
    } else {
      res.status(401).send("Du musst deine KSH-Mail verwenden!");
    }
} else {
  res.status(401).send("Diese E-Mail ist bereits registriert!");
}

  function hashpw() {
    const salt = crypto.randomBytes(16).toString("hex")
    const hashed = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

    return {salt, hashed}
  }
});

app.post("/validatepw", (req, res) => {
  const password = req.body.password
  const email = req.res.email
  const userSalt = db.collection("User").findOne({email: email}).salt
  const userHash = db.collection("User").findOne({email: email}).hashed

  const thing = crypto.pbkdf2Sync(password, userSalt, 1000, 64, "sha512").toString("hex")

  if (thing == userHash) {
    res.send("Usr valid")
  } else {
    res.send("Usr invalid")
  }
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})