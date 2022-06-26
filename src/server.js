const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./database');
const auth = require('./routes/auth');

const HTTP_PORT = 8000;

app.use(cors());

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/auth', auth);
