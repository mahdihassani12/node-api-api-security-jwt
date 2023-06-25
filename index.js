const express = require("express");
const bodyParser = require("body-parser");
const jsonwebtoken = require('jsonwebtoken');
const app = express();
const PORT = 3000;

// Connection to database
const connectDB = require("./db");
connectDB();

// Body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

app.use(express.static("public"));

// API integration
app.use("/api/contacts", require("./src/routes/crm"));
app.use("/api/users", require("./src/routes/user"));

app.get("/", (req, res) => {
  res.send(`Your app is runing on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Your app is runing on port ${PORT}`);
});
