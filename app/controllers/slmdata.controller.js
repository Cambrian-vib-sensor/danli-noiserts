const db = require("../models");
const SLMData = db.slmdata;
const Op =  db.Sequelize.Op;
const seqWhere = db.Sequelize.where;
const seqFn = db.Sequelize.fn;
const seqCol = db.Sequelize.col;


exports.create = (req, res)=> {
    // Validate request
    if (!req.body.leq5min) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    const slmdata = {
        leq_5min: req.body.leq5min
    };

    SLMData.create(slmdata)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        });
    });
};

exports.findAll = (req, res)=> {
    if (req.body.fromdate /*&& req.body.sensorid*/) {
      let todate = new Date().toDateString();
      if (req.body.todate) todate = req.body.todate;

      //var condition = {sensor_id: req.body.sensorid, received_at: {[Op.between]: [req.body.fromdate, todate]}};      
      var condition = {[Op.and]: [
        /*{sensor_id: req.body.sensorid},*/
        seqWhere(seqFn('date', seqCol('received_at')), {[Op.between]: [req.body.fromdate, todate]})
      ]};
      
      SLMData.findAll({where: condition})
      .then((data) => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving SLM data."
        });
      });
    } else {
      res.status(500).send({message: "Missing params"});
    }
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    SLMData.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find SLM data with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving SLM data with id=" + id
      });
    });
};

/*exports.findSensorIds = (req, res) => {
  db.sequelize.query("Select `sensor_id` as sensorid from (SELECT distinct `sensor_id`, max(`received_at`) as `maxi` FROM `sensordata` group by `sensor_id` order by substring(`sensor_id`, 1, 4), `maxi` DESC) A group by substring(`sensor_id`, 1, 4)", { type: db.sequelize.QueryTypes.SELECT })
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Error finding sensor ids`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving sensor ids"
    });
  });
}*/

exports.update = (req, res)=> {

};

exports.delete = (req, res)=> {

};

exports.deleteAll = (req, res)=> {

};