const express = require('express')
const app = express()
const port = 3000
const connectDB = require('./data/dbConnect')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.get('/', (req, res) => {
    res.send('404 Error Printed By Me')
})
app.get('/testing', (req, res) => {
    res.send("Have You checked")
})
app.use("/auth", require("./router/authrouter"));


app.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`)
})