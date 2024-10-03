const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const routes = require("./routes")
const cors = require('cors')

const port = process.env.PORT || 3001

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())
routes(app)

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect to Mongodb")
  })
  .catch((err) => {
    console.log(err)
  });

app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
});
