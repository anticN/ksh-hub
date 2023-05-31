import express from "express";
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from "cors";

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

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const credentials = email.split("@");
  const names = credentials[0].split(".");
  //const lastName = credentials.split(".")[1]
  res.send(`Hello ${names[0]} your family ${names[1]}!`);
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})