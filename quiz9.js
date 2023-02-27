const express = require("express");
const app = express();
const axios = require("axios");
const https = require("https");
const port = 3001;

app.get('/say', (req,res) => {
  axios.get(`https://tznp9ekm7j.execute-api.us-east-2.amazonaws.com/say?keyword=${req.query.keyword}`)
  .then(result => {
      res.status(200)
      res.send(result.data)
  })
  .catch(err => {
      res.status(400)
      res.send(err)
  })
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
