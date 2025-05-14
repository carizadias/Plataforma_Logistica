const jwt = require("jsonwebtoken");

const fakeToken = jwt.sign(
  { user_id: 99999 },
  process.env.JWT_SECRET, 
  { expiresIn: "1h" }
);

console.log("Token falso:", fakeToken);
