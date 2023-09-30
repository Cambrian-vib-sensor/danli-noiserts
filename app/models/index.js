const dbConfig = require("../../config/db.config.js");
const sensordatamodel = require("./sensordata.model.js");
const sensormodel = require("./sensor.model.js");
const locationmodel = require("./location.model.js");
const clientmodel = require("./client.model.js");
const authmodel = require("./auth.model.js");
const routermodel = require("./router.model.js");
const linkedhistorymodel = require("./linkedhistory.model.js");
const slmdatamodel = require("./slmdata.model.js");

const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.USER, dbConfig.PWD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    /*dialectOptions: {
        useUTC: false,
    },*/ //This option is required for Postgres to specify that the server datetime is not in UTC
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },

    timezone: "+08:00", //Specify the timezone set in mysql server

    logging: console.log
});

const db={};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sensordata = sensordatamodel(sequelize,Sequelize);
db.sensor = sensormodel(sequelize,Sequelize);
db.location = locationmodel(sequelize,Sequelize);
db.client = clientmodel(sequelize,Sequelize);
db.auth = authmodel(sequelize,Sequelize);
db.router = routermodel(sequelize, Sequelize);
db.linkedhistory = linkedhistorymodel(sequelize, Sequelize);

db.sensor.belongsTo(db.location, {foreignKey: 'location_id'});
db.location.belongsTo(db.client, {foreignKey: 'client_id'});
db.auth.belongsTo(db.client, {foreignKey: 'client_id'});
db.client.hasMany(db.auth, {foreignKey: 'client_id'});
db.location.hasOne(db.router, {foreignKey: 'location_id'});
db.linkedhistory.belongsTo(db.client, {foreignKey: 'client_id'});
db.linkedhistory.belongsTo(db.location, {foreignKey: 'location_id'});
db.linkedhistory.belongsTo(db.sensor, {foreignKey: 'sensor_id'});
db.slmdata = slmdatamodel(sequelize, Sequelize);
db.auth.hasOne(db.sensor, {foreignKey: 'auth_id' });

(async () => {
    await db.sensordata.sync({ alter: true });
    await db.sensor.sync({ alter: true });
    await db.location.sync({ alter: true });
    await db.client.sync({ alter: true });
    await db.auth.sync({ alter: true });
    await db.router.sync({ alter: true });
    await db.linkedhistory.sync({ alter:true });
})();

module.exports = db;