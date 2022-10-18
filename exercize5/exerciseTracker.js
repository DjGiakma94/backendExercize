const express = require('express')
const app = express()
const userRouter = require("./routes/trackerRouter");

app.use(express.json());

// ROUTES

app.use("/api/v1/users", userRouter);

module.exports = app;


app.listen(3000)