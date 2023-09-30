const clientmodel = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:Sequelize.STRING(100),
            allowNull: false
        },
        status:{
            type:Sequelize.STRING(1), //Default could be authentication email
            comment: 'A - Active; D - Deleted'
        },
        created_by:{
            type:Sequelize.STRING(25),
            allowNull: false,
            defaultValue: 'admin'
        }
    }, {
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                name: 'name',
                unique: true,
                fields: ['name']
            }
        ]
    });

    return Client;
};

module.exports = clientmodel;