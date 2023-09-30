const db = require("../models");
const Client = db.client;

exports.bulkcreate = (req, res)=> {
  // Validate request
  if (!req.body.clients) {
      res.status(400).send({
      message: "Client array can not be empty!"
      });
      return;
  }

  // Save sensors array in the database
  Client.bulkCreate(req.body.clients)
      .then(data => {
      res.send(data);
      })
      .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the client array."
      });
  });
};

exports.findAllActive = (req, res)=> {
  Client.findAll({
    where: {'status': 'A'}
  })
  .then((data) => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving client info."
    });
  });
};

exports.findAll = (req, res)=> {
    Client.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving client info."
      });
    });
};

exports.findOne = (req, res)=> {
    const id = req.params.id;
    Client.findByPk(id, {
      include: { 
        model: db.sensor
      }
    })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find client with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving client with id=" + id
      });
    });
};

exports.create = (req, res) => {
  // Save Client to Database
  Client.create({
    name: req.body.name,
    status: req.body.status
  })
  .then(client => {
    res.send({ message: "Client is created successfully!", id: client.id });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

exports.update = (req, res)=> {
  Client.update({
    name: req.body.name,
    status: req.body.status
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Client details updated successfully!" });
    else res.send({message: "No change in client data"});
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.delete = (req, res)=> {
  //Delete all locations and Unlink each location from sensor
  Client.update({
    status: 'D',
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Client deleted successfully!" });
    else res.send({message: "Client already deleted"});
  })
  .catch(err=>{
    res.status(500).send({ message: err.message });
  })
};

exports.deleteAll = (req, res)=> {

};
