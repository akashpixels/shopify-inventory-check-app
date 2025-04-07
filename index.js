const express = require('express');
require('dotenv').config();
const app = express();
const checkStock = require('./routes/checkStock');

app.use(express.json());

app.get('/check-stock', checkStock);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
