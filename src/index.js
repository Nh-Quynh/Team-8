const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routes = require('./routes')
const cors = require('cors')
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_DB)
  .then(
    console.log('Connect database success')
  )

app.use(cors())
app.use(bodyParser.json())

routes(app)

app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})
