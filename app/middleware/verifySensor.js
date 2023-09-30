const db = require("../models");
const Sensor = db.sensor;
const Linkedhistory = db.linkedhistory;
const Op =  db.Sequelize.Op;

checkDuplicateSensor = (req, res, next) => {
    Sensor.findOne({
        where: {
            name: req.body.serial_no,
            //state: 'G'
        }
    }).then(sensor => {
        if (sensor) {
            res.status(400).send({
                message: "Failed! Sensor is already found"
            });
            return;
        }
        next();
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

checkSensorAlreadyExists = (req, res, next) => {
    Sensor.findOne({
        where: {
            name: req.body.serial_no,
            //state: 'G',
            id:{[Op.ne]: req.params.id}
        }
    }).then(sensor => {
        if (sensor) {
            res.status(400).send({
                message: "Sensor serial no already exists!"
            });
            return;
        }
        next();
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

checkIfUnlinkAndAddToHistory = (req, res, next) => {
    Sensor.findOne({
        where: {
            id: req.params.id,
        },
        include: {
            model: db.location,
            include: {
                model: db.client
            }
        }
    }).then(sensor => {
        if (sensor) {
            if (sensor.location_id !== null) { //unlinked already if null
                if (req.body.location_id !== sensor.location_id) { //unlinking
                    //Save in history
                    Linkedhistory.create({
                        location_id: sensor.location_id,
                        sensor_id: sensor.id,
                        client_id: sensor.location.client.id,
                        linked_date: sensor.linked_date
                    }).then(history => {

                    })
                }
            }
        }
        next();
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

const verifySensor = {
    checkDuplicateSensor,
    checkSensorAlreadyExists,
    checkIfUnlinkAndAddToHistory
};
  
module.exports = verifySensor;