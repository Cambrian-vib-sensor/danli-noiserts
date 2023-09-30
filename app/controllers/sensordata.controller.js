const db = require("../models");
const SensorData = db.sensordata;
const Op =  db.Sequelize.Op;
const seqWhere = db.Sequelize.where;
const seqFn = db.Sequelize.fn;
const seqCol = db.Sequelize.col;

exports.findAll = (req, res)=> {
    if (req.body.fromdate && req.body.sensorid) {
      let todate = new Date().toDateString();
      if (req.body.todate) todate = req.body.todate;

      //var condition = {sensor_id: req.body.sensorid, received_at: {[Op.between]: [req.body.fromdate, todate]}};      
      var condition = {[Op.and]: [
        {sensor_id: req.body.sensorid},
        seqWhere(seqFn('date', seqCol('received_at')), {[Op.between]: [req.body.fromdate, todate]})
      ]};
      SensorData.findAll({where: condition})
      .then((data) => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving sensor data."
        });
      });
    } else {
      res.status(500).send({message: "Missing params"});
    }
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    SensorData.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find sensor data with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving sensor data with id=" + id
      });
    });
};

exports.findSensorIds = (req, res) => {
  let query, metadata;
  if (req.role === 'A' || req.role === 'U') {
    query = "Select `sensor_id` as sensorid from (SELECT distinct `sensor_id`, max(`received_at`) as `maxi` FROM `sensordata` group by `sensor_id` order by substring(`sensor_id`, 1, 4), `maxi` DESC) A group by substring(`sensor_id`, 1, 4)";
    metadata = { type: db.sequelize.QueryTypes.SELECT };
  } else if (req.role === 'C') {
    query = "Select `sensor_id` as sensorid from `sensors` s left join `locations` l on l.id = s.location_id left join `clients` c on l.client_id = c.id where c.id=?";
    metadata = { replacements: [req.clientId], type: db.sequelize.QueryTypes.SELECT };
  } else {
    res.status(404).send({
      message: `Invalid authorization`
    });
    return;
  }
  //db.sequelize.query("Select `sensor_id` as sensorid from (SELECT distinct `sensor_id`, max(`received_at`) as `maxi` FROM `sensordata` group by `sensor_id` order by substring(`sensor_id`, 1, 4), `maxi` DESC) A group by substring(`sensor_id`, 1, 4)", { type: db.sequelize.QueryTypes.SELECT })
  db.sequelize.query(query, metadata)
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
      message: err.message //"Error retrieving sensor ids"
    });
  });
}

exports.update = (req, res)=> {

};

exports.delete = (req, res)=> {

};

exports.deleteAll = (req, res)=> {

};

exports.getdatafordashboardbarbyclient = (req, res) => {
  let query, metadata;
  // sl.sensor_id, sl.location_lat, sl.location_lng, COUNT(*) AS frequency
  query = `
  SELECT sl.sensor_id, sl.location_lat, sl.location_lng, COUNT(*) AS frequency
  FROM sensors AS sl 
  INNER JOIN sensordata AS sd ON sl.sensor_id = sd.sensor_id
  WHERE sd.sensor_value > sl.vibration_max_limit
  GROUP BY sl.sensor_id, sl.location_lat, sl.location_lng HAVING frequency > 0 ORDER BY frequency DESC;
`;
  if (req.role === 'C') {
    query = `
  SELECT sl.sensor_id, sl.location_lat, sl.location_lng, COUNT(*) AS frequency
  FROM sensors AS sl 
  INNER JOIN sensordata AS sd ON sl.sensor_id = sd.sensor_id
  INNER JOIN locations AS lc ON lc.id = sl.location_id
  INNER JOIN clients AS cl ON cl.id = lc.client_id
  WHERE sd.sensor_value > sl.vibration_max_limit AND cl.id = ${req.clientId}
  GROUP BY sl.sensor_id, sl.location_lat, sl.location_lng HAVING frequency > 0 ORDER BY frequency DESC;
`;
  }
  metadata = { replacements: [req.clientId], type: db.sequelize.QueryTypes.SELECT };

  db.sequelize.query(query, metadata)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Error finding sensor data`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message //"Error retrieving sensor ids"
      });
    });
}

exports.getallsensor = (req, res) => {
  let query, metadata;
  // sl.sensor_id, sl.location_lat, sl.location_lng, COUNT(*) AS frequency
  query = `
  SELECT sl.sensor_id, sl.location_lat, sl.location_lng, maxdate
  FROM sensors as sl
  INNER JOIN (SELECT sensor_id, max(sd.received_at) as maxdate
  FROM sensordata AS sd
  GROUP BY sensor_id) as newsd on sl.sensor_id = newsd.sensor_id
`;

  if (req.role === 'C') {
    query = `
  SELECT sl.sensor_id, sl.location_lat, sl.location_lng, maxdate
  FROM sensors as sl
  INNER JOIN (SELECT sensor_id, max(sd.received_at) as maxdate FROM sensordata AS sd GROUP BY sensor_id) 
    as newsd on sl.sensor_id = newsd.sensor_id
  INNER JOIN locations AS lc ON lc.id = sl.location_id
  INNER JOIN clients AS cl ON cl.id = lc.client_id
  WHERE cl.id = ${req.clientId}
`;
  }

  metadata = { replacements: [req.clientId], type: db.sequelize.QueryTypes.SELECT };
  console.log(req.clientId)

  db.sequelize.query(query, metadata)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Error finding sensor data`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message //"Error retrieving sensor ids"
      });
    });
}