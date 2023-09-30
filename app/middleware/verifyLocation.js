const db = require("../models");
const Location = db.location;
const Sensor = db.sensor;
const Op =  db.Sequelize.Op;

checkDuplicateLocation = (req, res, next) => {
    Location.findOne({
        where: {
            name: req.body.name,
            //status: 'A'
        }
    }).then(location => {
        if (location) {
            res.status(400).send({
                message: "Failed! Location name is already found"
            });
            return;
        }
        next();
    })
}

checkLocationAlreadyExists = (req, res, next) => {
    Location.findOne({
        where: {
            name: req.body.name,
            //status: 'A',
            id:{[Op.ne]: req.params.id}
        }
    }).then(location => {
        if (location) {
            res.status(400).send({
                message: "Location already exists!"
            });
            return;
        }
        next();
    })
}

checkIfSensorLinked = (req, res, next) => {
    Sensor.findOne({
        where: {
            location_id: req.params.id
        }
    }).then(sensor => {
        if (sensor) {
            res.status(400).send({
                message: "Location linked to sensor",
                sensor: sensor.name
            });
            return;
        }
        next();
    })
}

const verifyLocation = {
    checkDuplicateLocation,
    checkLocationAlreadyExists,
    checkIfSensorLinked
};
  
module.exports = verifyLocation;