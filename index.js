const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("views"));

app.get("/login", (req, res) => {
  let accounts = {
    account: "arthur",
    password: "secret hee hee"
  };

  res.json(accounts);
});

// {account: "arthur", password: "secret hee hee"}
app.post("/login", (req, res) => {
  let account = req.body.account;
  let password = req.body.password;
  console.log(account + " " + password);
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at :${PORT}`);
});
