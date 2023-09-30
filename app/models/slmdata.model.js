const slmdatamodel = (sequelize, Sequelize) => {
    const SLMData = sequelize.define("noisesensor", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        /*sensor_id:{
            type:Sequelize.STRING(50),
            allowNull: false
        },*/
        leq_5min:{
            type:Sequelize.FLOAT,
            allowNull: false
        },
        received_at:{
            type:Sequelize.DATE,
            allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
		freezeTableName: true,
        timestamps: false,
        /*indexes: [
            {
                name: 'sensor_id_received_at',
                unique: true,
                fields: ['sensor_id', 'received_at']
            }
        ]*/
    });
    
    return SLMData;
};

module.exports = slmdatamodel;