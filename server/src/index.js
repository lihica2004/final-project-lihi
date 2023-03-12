const express = require("express");
require("./db/mongoose");
// const User = require("./models/user");
const userRouter = require('./routes/users')
const reqRouter = require('./routes/requests')

const app = express();
const port = 4000;

app.use(express.json());
app.use(userRouter)
app.use(reqRouter)


app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const jwt = require('jsonwebtoken')
