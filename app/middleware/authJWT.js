const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");
const db = require("../models");
const Auth = db.auth;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      console.log(decoded);
      req.authId = decoded.id;
      next();
    });
};

getUserAuth = (req, res, next) => {
  Auth.findByPk(req.authId).then(auth => {
    if (auth) {
      req.role = auth.role;
      req.clientId = auth.client_id;
      next();
      return;
    }

    res.status(403).send({
      message: "Error in accessing user authentication"
    });
  })
}

isAdmin = (req, res, next) => {
    Auth.findByPk(req.authId).then(auth => {
      if (auth.role === 'A') {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
    })
}

isCustomer = (req, res, next) => {
    Auth.findByPk(req.authId).then(auth => {
      if (auth.role === 'C') {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Customer Role!"
      });
    })
}

isCambrianUser = (req, res, next) => {
    Auth.findByPk(req.authId).then(auth => {
      if (auth.role === 'U') {
        next();
        return;
      }

      res.status(403).send({
        message: "Require User Role!"
      });
    })
}

const authJwt = {
  verifyToken: verifyToken,
  getUserAuth: getUserAuth,
  isAdmin: isAdmin,
  isCustomer: isCustomer,
  isCambrianUser: isCambrianUser
};

module.exports = authJwt;