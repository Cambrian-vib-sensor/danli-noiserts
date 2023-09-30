const db = require("../models");
const Sensor = db.sensor;

exports.bulkcreate = (req, res)=> {
  // Validate request
  if (!req.body.sensors) {
      res.status(400).send({
      message: "Sensor array can not be empty!"
      });
      return;
  }

  // Save sensors array in the database
  Sensor.bulkCreate(req.body.sensors)
      .then(data => {
      res.send(data);
      })
      .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the sensor array."
      });
  });
};

exports.findSensorValues = (req, res) => {
  let query = "Select s.*, l.name as location_name, c.name as client_name, sensor_value from `sensors` s left join `locations` l on l.id = s.location_id and s.state = 'G' inner join `clients` c on l.client_id = c.id ";
  let metadata = { type: db.sequelize.QueryTypes.SELECT };

  if (req.role === 'C') {
    query += " and l.client_id = ? ";
    metadata = { replacements: [req.clientId], type: db.sequelize.QueryTypes.SELECT };
  } else if (!(req.role === 'A' || req.role === 'U')) {
    res.status(500).send({
      message: "Invalid authorization"
    });
    return;
  }

  query += " left join (Select s1.* from sensordata s1 inner join (Select max(received_at) as received_at, sensor_id from sensordata group by sensor_id) s2 on s1.sensor_id = s2.sensor_id and s1.received_at = s2.received_at) sdata on s.sensor_id = sdata.sensor_id";
  
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
      message: err.message
    });
  });
};

exports.findAll = (req, res)=> {
    let condition = {
      include: {
        model: db.location,
        include: { model: db.client}
      }/*,
      where: {
        state:'G'
      }*/
    };

    if (req.role === 'C') {
      condition = {
        include: {
          model: db.location,
          required: true,  //Inner join.. Not left join
          include: { model: db.client,
                     required: true,
                     where: {id: req.clientId}}
        }/*,
        where: {
          state:'G'
        }*/
      };
    } else if (!(req.role === 'A' || req.role === 'U')) {
      res.status(500).send({
        message: "Invalid authorization"
      });
      return;
    }
    Sensor.findAll(condition)
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sensor info."
      });
    });
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    Sensor.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find sensor with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving sensor with id=" + id
      });
    });
};

exports.create = (req, res) => {
  // Save Sensor to Database
  Sensor.create(req.body)
  .then(sensor => {
    console.log(sensor);
    res.send({ message: "Sensor is created successfully!", id: sensor.id });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

exports.update = (req, res)=> {
  //Link/unlink before updating
  Sensor.update(req.body, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Sensor details updated successfully!" });
    else res.send({message: "No change in sensor data"});
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.delete = (req, res)=> {
  //Unlink location from sensor
  Sensor.update({
    state: 'F',
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Sensor marked as faulty successfully!" });
    else res.send({message: "Sensor already marked as faulty"});
  })
  .catch(err=>{
    res.status(500).send({ message: err.message });
  })
};

exports.deleteAll = (req, res)=> {

};

exports.findSensorToAssignee = (req, res) => {
  const query = `
  SELECT s.* from sensors s
  WHERE s.auth_id is null
  `
  db.sequelize.query(query,{ type: db.sequelize.QueryTypes.SELECT })
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
      message: err.message
    });
  });
};
exports.assignee = (req, res)=> {
  //Link/unlink before updating
  Sensor.update({auth_id: req.body.auth_id}, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Sensor details assignee successfully!" });
    else res.send({message: "No change in sensor data"});
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};