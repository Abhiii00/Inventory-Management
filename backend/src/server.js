require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes/route');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API root working' });
});

connectDB();

app.use('/api', routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log('Server running');
});
