const sensordatamodel = (sequelize, Sequelize) => {
    const SensorData = sequelize.define("sensordata", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        sensor_id:{
            type:Sequelize.STRING(50),
            allowNull: false
        },
        sensor_value:{
            type:Sequelize.DOUBLE,
            allowNull: false
        },
        received_at:{
            type:Sequelize.DATE,
            allowNull: false
        },
        gmail_id:{
            type:Sequelize.STRING(20),
            comment: 'Unique id from GMail for each email'
        },
        created_at:{
            type:Sequelize.DATE,
            allowNull: false,
            defaultValue:Sequelize.fn('NOW')
        }
    }, {
        timestamps: false,
        //updatedAt: false,
        //createdAt: 'created_at'
        indexes: [
            {
                name: 'gmail_id',
                unique: true,
                fields: ['gmail_id']
            },
            {
                name: 'sensor_id_received_at',
                unique: true,
                fields: ['sensor_id', 'received_at']
            }
        ]
    });
    
    return SensorData;
};

module.exports = sensordatamodel;