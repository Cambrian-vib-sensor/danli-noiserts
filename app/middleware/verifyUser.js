const db = require("../models");
const Auth = db.auth;
const Op =  db.Sequelize.Op;

checkDuplicateUsername = (req, res, next) => {
    Auth.findOne({
        where: {
            username: req.body.username,
            //status: 'A'
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use"
            });
            return;
        }
        next();
    })
}

checkUsernameAlreadyExists = (req, res, next) => {
    Auth.findOne({
        where: {
            username: req.body.username,
            //status: 'A',
            id:{[Op.ne]: req.params.id}
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Email address already exists!"
            });
            return;
        }
        Auth.findOne({
            where: {
                id: req.params.id
            }
        }).then(user => {
            if (!user) {
                res.status(400).send({
                    message: "Invalid User!"
                });
                return;
            }
            req.currentPassword = user.password;
            next();
        });
    })
}

const verifyUser = {
    checkDuplicateUsername,
    checkUsernameAlreadyExists
};
  
module.exports = verifyUser;