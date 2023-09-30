const db = require("../models");
const Location = db.location;

exports.bulkcreate = (req, res)=> {
  // Validate request
  if (!req.body.locations) {
      res.status(400).send({
      message: "Location array can not be empty!"
      });
      return;
  }

  // Save sensors array in the database
  Location.bulkCreate(req.body.locations)
      .then(data => {
      res.send(data);
      })
      .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the location array."
      });
  });
};

exports.findAllActive = (req, res)=> {
  Location.findAll({
    include: {model: db.client,
              where: {status: 'A'}
             },
    where: {'status': 'A'}
  })
  .then((data) => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving location info."
    });
  });
};


exports.findAll = (req, res)=> {
    Location.findAll({
      include: {model: db.client},
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving location info."
      });
    });
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    Location.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find location with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving location with id=" + id
      });
    });
};

exports.create = (req, res) => {
  // Save Location to Database
  Location.create({
    name: req.body.name,
    client_id: req.body.client_id,
    status: req.body.status,
    email: req.body.email,
    location_type: req.body.location_type
  })
  .then(location => {
    console.log(location);
    res.send({ message: "Location is created successfully!", id: location.id });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

exports.update = (req, res)=> {
  Location.update({
    name: req.body.name,
    email: req.body.email,
    status: req.body.status,
    client_id: req.body.client_id,
    location_type: req.body.location_type
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Location details updated successfully!" });
    else res.send({message: "No change in location data"});
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.delete = (req, res)=> {
  Location.update({
    status: 'D',
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Location deleted successfully!" });
    else res.send({message: "Location already deleted"});
  })
  .catch(err=>{
    res.status(500).send({ message: err.message });
  })
};

exports.deleteAll = (req, res)=> {

};
