const db = require("../models");
const Router = db.router;
const Op =  db.Sequelize.Op;

checkDuplicateRouter = (req, res, next) => {
    Router.findOne({
        where: {
            name: req.body.simcardno,
        }
    }).then(router => {
        if (router) {
            res.status(400).send({
                message: "Failed! Router is already found"
            });
            return;
        }
        next();
    })
}

checkRouterAlreadyExists = (req, res, next) => {
    Router.findOne({
        where: {
            name: req.body.simcardno,
            id:{[Op.ne]: req.params.id}
        }
    }).then(router => {
        if (router) {
            res.status(400).send({
                message: "Router already exists!"
            });
            return;
        }
        next();
    })
}

const verifyRouter = {
    checkDuplicateRouter,
    checkRouterAlreadyExists
};
  
module.exports = verifyRouter;