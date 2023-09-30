const db = require("../models");
const Router = db.router;

exports.bulkcreate = (req, res)=> {
  // Validate request
  if (!req.body.routers) {
      res.status(400).send({
      message: "Router array can not be empty!"
      });
      return;
  }

  // Save sensors array in the database
  Router.bulkCreate(req.body.routers)
      .then(data => {
      res.send(data);
      })
      .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the router array."
      });
  });
};

exports.findAll = (req, res)=> {
    Router.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving router info."
      });
    });
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    Router.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find router with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving router with id=" + id
      });
    });
};

exports.create = (req, res) => {
  // Save Router data to Database
  Router.create({
    simcardno: req.body.simcardno,
    admin: req.body.admin,
    password: req.body.password,
    remark: req.body.remark,
    location_id: req.body.location_id
  })
  .then(router => {
    console.log(router);
    res.send({ message: "Router is created successfully!", id: router.id });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

exports.update = (req, res)=> {
  Router.update({
    simcardno: req.body.simcardno,
    admin: req.body.admin,
    password: req.body.password,
    remark: req.body.remark,
    location_id: req.body.location_id
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "Router details updated successfully!" });
    else res.send({message: "No change in router data"});
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.delete = (req, res)=> {

};

exports.deleteAll = (req, res)=> {

};
