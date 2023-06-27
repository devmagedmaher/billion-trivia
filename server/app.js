const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { isDev } = require('./config');
if (isDev) require('dotenv').config();
const app = express();

// middlewares 
app.use(cors());
app.use(bodyParser.json());

// ping route
app.use('/ping', (req, res) => res.status(200).send('OK'));

// serve react project static files
const root = require('path').join(__dirname, 'public')
app.use(express.static(root));
app.get('*', (req, res) => res.sendFile('index.html', { root }));

// server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Your server is ready.. PORT: ${PORT}`);
});

// socket io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e6,
});
const socketHandler = require('./socket');
io.on('connection', socketHandler(io));
