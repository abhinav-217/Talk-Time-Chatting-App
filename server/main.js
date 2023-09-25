const express = require('express')
const app = express()
const port = 3000
const connectDB = require('./data/dbConnect')
const cookieParser = require('cookie-parser');
const {makeServer} = require('./webServer/chatServer')
const dotenv = require('dotenv')
const ws = require('ws')
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'))
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
app.use("/user", require("./router/userrouter"));

const server = app.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`)
})

const wss = new ws.WebSocketServer({server});
makeServer(wss);