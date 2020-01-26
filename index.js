const express = require("express");
const app = express();

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.end("Done");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening at :${PORT}`);
});
