const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("server is running at http://localhost:3000");
});