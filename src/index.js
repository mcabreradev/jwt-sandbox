// init project
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var jwt = require("jsonwebtoken");

const SECRET_KEY = "9-yj_R^736MW?w96%Wa8_@xSG2VBfY";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided." });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ auth: false, message: "The session is expired!" });
  }

  res.status(200).json({ cool: true, decode: decoded });
});

app.post("/login", function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(500).json({
      auth: false,
      message: "Failed to authenticate missing parameter(s)"
    });
  }

  const username = req.body.username;
  const password = req.body.password;

  if (!validateLogin(username, password)) {
    return res.status(500).json({
      auth: false,
      message: "Failed to authenticate username and password"
    });
  }

  const token = generateJWTToken({ username: username, password: password });

  res.status(200).send({ auth: true, token: token });
});

const generateJWTToken = payload => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "60s" });
};

const verifyToken = token => {
  return jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) {
      return false;
    }
    return decoded;
  });
};

const validateLogin = (username, password) => {
  if (username === "pepito" && password === "papo") {
    return true;
  } else {
    return false;
  }
};

// Listen on port 8080
var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
