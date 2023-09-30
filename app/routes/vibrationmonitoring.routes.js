const vibrationmonitoringroutes = (app) => {
    const sensordata = require("../controllers/sensordata.controller");
    const sensor = require("../controllers/sensor.controller");
    const slmdata = require("../controllers/slmdata.controller.js");
    const location = require("../controllers/location.controller");
    const client = require("../controllers/client.controller");
    const auth = require("../controllers/auth.controller");
    const routers = require("../controllers/router.controller");
    const linkedhistory = require("../controllers/linkedhistory.controller");
    const { verifyUser, authJWT, verifySensor, verifyLocation, verifyClient, verifyRouter } = require("../middleware");
    var router = require("express").Router();

    router.post("/register", [authJWT.verifyToken], [authJWT.isAdmin], verifyUser.checkDuplicateUsername, auth.signup);

    router.post("/login", auth.signin);

    router.put("/auth/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifyUser.checkUsernameAlreadyExists, auth.update);

    router.put("/auth/user/:id", [authJWT.verifyToken], verifyUser.checkUsernameAlreadyExists, auth.userUpdate);

    router.get("/auths", [authJWT.verifyToken], [authJWT.isAdmin], auth.findAll);
    router.get("/auth/:id", [authJWT.verifyToken], auth.findOne);

    router.delete("/auth/:id", [authJWT.verifyToken], [authJWT.isAdmin], auth.delete);

    //router.get("/auth/:id", /*[authJWT.verifyToken],*/ auth.findOne);

    //router.post("/auths/bulkcreate", /*[authJWT.verifyToken],*/ auth.bulkcreate);

    router.get("/sensordata/sensorids", [authJWT.verifyToken], [authJWT.getUserAuth], sensordata.findSensorIds);

    router.post("/sensordata", [authJWT.verifyToken], sensordata.findAll); //Write verifySensor to check if sensorid belongs to the user after verifyToken
    
    router.get("/sensordata/fetchalllocanddatabyclient",[authJWT.verifyToken], [authJWT.getUserAuth], sensordata.getdatafordashboardbarbyclient);
    
    router.get("/sensordata/fetchallsensor",[authJWT.verifyToken], [authJWT.getUserAuth], sensordata.getallsensor);

    // router.get("/sensordata/:id", [authJWT.verifyToken], sensordata.findOne); //verifySensor is required

    router.get("/sensor/sensorvalues", [authJWT.verifyToken], [authJWT.getUserAuth], sensor.findSensorValues);

    router.get("/sensor/sensortoassignee", [authJWT.verifyToken], [authJWT.getUserAuth], sensor.findSensorToAssignee);

    router.get("/sensors", [authJWT.verifyToken], [authJWT.getUserAuth], sensor.findAll);

    router.post("/sensor", [authJWT.verifyToken], [authJWT.isAdmin], verifySensor.checkDuplicateSensor, sensor.create);

    router.put("/sensor/:id/assignee", [authJWT.verifyToken], [authJWT.isAdmin], sensor.assignee);

    router.put("/sensor/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifySensor.checkSensorAlreadyExists, verifySensor.checkIfUnlinkAndAddToHistory, sensor.update);

    router.delete("/sensor/:id", [authJWT.verifyToken], [authJWT.isAdmin], sensor.delete);

   	
	router.post("/slmdata/create", slmdata.create);
	
	router.post("/slmdata", slmdata.findAll);

    router.get("/slmdata/:id", slmdata.findOne);
    //router.get("/sensor/:id", [authJWT.verifyToken], [authJWT.isAdmin], sensor.findOne);

    //router.post("/sensors/bulkcreate", [authJWT.verifyToken], [authJWT.isAdmin], sensor.bulkcreate);

    router.get("/locations", [authJWT.verifyToken], [authJWT.isAdmin], location.findAll);

    router.get("/locationsactive", [authJWT.verifyToken], [authJWT.getUserAuth], location.findAllActive);

    router.post("/location", [authJWT.verifyToken], [authJWT.isAdmin], verifyLocation.checkDuplicateLocation, location.create);

    router.put("/location/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifyLocation.checkLocationAlreadyExists, location.update);

    router.delete("/location/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifyLocation.checkIfSensorLinked, location.delete);

    //router.get("/location/:id", [authJWT.verifyToken], [authJWT.isAdmin], location.findOne);

    //router.post("/locations/bulkcreate", [authJWT.verifyToken], [authJWT.isAdmin], location.bulkcreate);

    router.get("/clients", [authJWT.verifyToken], [authJWT.isAdmin], client.findAll);

    router.get("/clientsactive", [authJWT.verifyToken], [authJWT.getUserAuth], client.findAllActive);

    router.post("/client", [authJWT.verifyToken], [authJWT.isAdmin], verifyClient.checkDuplicateClient, client.create);

    router.put("/client/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifyClient.checkClientAlreadyExists, client.update);

    router.delete("/client/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifyClient.unlinkAndDeleteLocations, verifyClient.deleteAuthentications, client.delete);

    router.get("/client/:id", [authJWT.verifyToken], [authJWT.isAdmin], client.findOne);

    //router.post("/clients/bulkcreate", [authJWT.verifyToken], [authJWT.isAdmin], client.bulkcreate);

    router.get("/routers", [authJWT.verifyToken], [authJWT.isAdmin], routers.findAll);
    
    router.post("/router", [authJWT.verifyToken], [authJWT.isAdmin], verifyRouter.checkDuplicateRouter, routers.create);

    router.put("/router/:id", [authJWT.verifyToken], [authJWT.isAdmin], verifyRouter.checkRouterAlreadyExists, routers.update);

    router.delete("/router/:id", [authJWT.verifyToken], [authJWT.isAdmin], routers.delete);

    router.get("/router/:id", [authJWT.verifyToken], [authJWT.isAdmin], routers.findOne);

    router.post("/routers/bulkcreate", [authJWT.verifyToken], [authJWT.isAdmin], routers.bulkcreate);

    router.post("/linkedhistory", [authJWT.verifyToken], [authJWT.isAdmin], linkedhistory.create);

    app.use("/", router);
    
}

module.exports = vibrationmonitoringroutes;