const db = require("../models");
const Linkedhistory = db.linkedhistory;

exports.findAll = (req, res)=> {
    Linkedhistory.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving history."
      });
    });
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    Linkedhistory.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find linked history with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving history with id=" + id
      });
    });
};

exports.create = (req, res) => {
  // Save linked data to Database
  Linkedhistory.create(req.body)
  .then(linkhistory => {
    console.log(linkhistory);
    res.send({ message: "History data is stored successfully!", id: linkhistory.id });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}
