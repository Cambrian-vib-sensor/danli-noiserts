const sensormodel = (sequelize, Sequelize) => {
    const Sensor = sequelize.define("sensor", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:Sequelize.STRING(25),
            allowNull: false
        },
        sensor_id:{
            type:Sequelize.STRING(50),
            comment: "Calculatable field - CONCAT(SUBSTRING(serial_no,1,4), '_', COALESCE(vm, ''), ' ', location.name) but included as all ids do not follow the formula"
        },
        model:{
            type:Sequelize.STRING(15),
            allowNull: false,
            defaultValue: 'VSEW_mk2 (8g)'
        },
        serial_no:{
            type:Sequelize.STRING(25),
            allowNull: false
        },
        vm:{
            type:Sequelize.STRING(5)
        },
        email:{
            type:Sequelize.STRING(30)
        },
        vibration_max_limit:{
            type:Sequelize.FLOAT
        },
        last_calibration_date:{
            type:Sequelize.DATE
        },
        remark:{
            type:Sequelize.STRING(50)
        },
        state:{
            type:Sequelize.STRING(1),
            comment: 'G - Good; F - Faulty',
            defaultValue: 'G',
            allowNull: false
        },
        linked_date:{
            type:Sequelize.DATE
        },
        /*geo_location:{
            type:Sequelize.GEOMETRY('POINT')
        },*/
        location_lat:{
            type:Sequelize.FLOAT,
            comment: "A location may have more than 1 sensor - so lat, lng included here"
        },
        location_lng:{
            type:Sequelize.FLOAT,
            comment: "A location may have more than 1 sensor - so lat, lng included here"
        },
        created_by:{
            type:Sequelize.STRING(25),
            allowNull: false,
            defaultValue: 'admin'
        },
        auth_id:{
            type:Sequelize.BIGINT(20),
            allowNull: true
        },
    }, {
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                name: 'serial_no',
                unique: true,
                fields: ['serial_no']
            },
            {
                name: 'name',
                unique: true,
                fields: ['name']
            },
            {
                name: 'auth_id_un',
                unique: true,
                fields: ['auth_id']
            },
        ]
    });

    //Sensor.belongsTo(SensorData, {foreignKey: 'location_id'});
    
    return Sensor;
};

module.exports = sensormodel;