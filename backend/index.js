import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from "cors";
import crypto from "crypto";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))

//Connection to MongoDB
mongoose.connect('mongodb://localhost:27017/KSH-Hub',
  {
    useNewUrlParser: true
  }
);

//Check if connection to MongoDB is established
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to MongoDB");
});

//hashing function for passwords with salt and crypto module
function hashpw(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hashed = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return { salt, hashed }
}

//function to add user to DB
function addUserToDB(user) {
  db.collection("User").insertOne(user, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
}


app.get('/', (req, res) => {
  res.send('Hello World!')
});

//signup page with form
app.get('/signup', (req, res) => {
  res.send("Signup page")
  //res.sendFile("C:\\Users\\Nikola\\OneDrive - Bildungszentrum Zürichsee\\Dokumente\\IMS\\FS 2023 (4 von 6)\\BZZ\\M 426 Agile Methoden SCRUM etc\\ksh-hub\\frontend\\index.html")
});

//login process, checks if user exists and if password is correct
app.post("/login", (req, res) => {
  const password = req.body.password
  const Uemail = req.body.email
  const userData = db.collection("User").findOne({ email: Uemail }, { "salt": 1, "hashed": 1, "_id": 0 }, (err, udata) => {
    if (err) {
      res.send("Error occurred")
      return
    } else if (!udata) {
      res.status(400).send("User not found")
    }else{
      const userSalt = udata.salt;
      const userHash = udata.hashed;

      const userpasswd = crypto.pbkdf2Sync(password, userSalt, 1000, 64, "sha512").toString("hex")

      if (userpasswd === userHash) {
        res.status(200).send("User valid")
      } else {
        res.status(401).send("User invalid")
      } 
    }
  });
});

//signup process, checks if user exists, if the email format is valid and creates a new account
app.post("/signup", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const credentials = email.split("@");
  db.collection("User").findOne({ email: req.body.email }, (error, result) => {
    //const checkMail = req.body.email
    if (result) {
      // TODO: add 2nd collection to save all time emails so user cannot create multiple accounts with same email
      res.status(401).json({ error: "Email already used" });
    } else {
      if (credentials[1] === "student.ksh.ch") {
        const names = credentials[0].split(".");
        const schoolClass = req.body.schoolClass;
        const goodSubjects = req.body.goodSubjects;
        const badSubjects = req.body.badSubjects;
        const passwd_hash = hashpw(password);

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
          salt: passwd_hash.salt,
          hashed: passwd_hash.hashed
        }
        addUserToDB(user);
        res.send(`Hello ${names[0]} ${names[1]}! your acc has been created with hashed password:`);
      } else {
        res.status(401).send("Du musst deine KSH-Mail verwenden!");
      }
    }
  });
});

//listener for the current port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})