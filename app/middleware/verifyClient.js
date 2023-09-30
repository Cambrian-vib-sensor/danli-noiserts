const { linkedhistory } = require("../models");
const db = require("../models");
const Client = db.client;
const Location = db.location;
const Linkedhistory = db.linkedhistory;
const Auth = db.auth;
const Sensor = db.sensor;
const Op =  db.Sequelize.Op;

checkDuplicateClient = (req, res, next) => {
    Client.findOne({
        where: {
            name: req.body.name,
            //status: 'A'
        }
    }).then(client => {
        if (client) {
            res.status(400).send({
                message: "Failed! Client name is already found"
            });
            return;
        }
        next();
    })
}

checkClientAlreadyExists = (req, res, next) => {
    Client.findOne({
        where: {
            name: req.body.name,
            //status: 'A',
            id:{[Op.ne]: req.params.id}
        }
    }).then(client => {
        if (client) {
            res.status(400).send({
                message: "Client already exists!"
            });
            return;
        }
        next();
    })
}

unlinkAndDeleteLocations = (req, res, next) => {
    Location.findAll({
        where: {
            client_id: req.params.id
        }
    }).then(locations => { 
        let locationIds = locations.map(location => location.id);
        Location.update({
            status: "D"
        }, { where: {id:{[Op.in]: locationIds}} }).then(num => {
            locationIds.forEach(element => { //Each element is handled one by one inorder to save in history
                Sensor.findAll({
                    where: {location_id:element} 
                }).then(data => {
                    data.forEach(sensordata => {
                        if (sensordata) {
                            Sensor.update({
                                location_id: null,
                                linked_date: null
                            }, { where: {id: sensordata.id} }).then(num => {
                                Linkedhistory.create({
                                    location_id: element,
                                    sensor_id: sensordata.id,
                                    client_id: req.params.id,
                                    linked_date: sensordata.linked_date
                                }).then(history => {
        
                                })
                            })
                        }
                    })
                })
            });
            next();
            /*Sensor.update({
                location_id: null
            }, { where: {location_id:{[Op.in]: locationIds}} }).then(num => {
                next();
            })*/
        })
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

deleteAuthentications = (req, res, next) => {
    Auth.update({
        status: "D"
    }, { where: { client_id: req.params.id} }).then(num => {
        next();
    })
}

const verifyClient = {
    checkDuplicateClient,
    checkClientAlreadyExists,
    unlinkAndDeleteLocations,
    deleteAuthentications
};
  
module.exports = verifyClient;