const express = require('express');
const app = express();
app.use((req, res) => {
    res.json({ test: 'express server works!' })
});
module.exports = app;