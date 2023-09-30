const locationmodel = (sequelize, Sequelize) => {
    const Location = sequelize.define("location", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:Sequelize.STRING(50),
            allowNull: false
        },
        location_type:{
            type:Sequelize.STRING(50),
            allowNull: false
        },
        email:{
            type:Sequelize.STRING(250) //Default could be authentication email
        },
        status:{
            type:Sequelize.STRING(1),
            comment: 'A - Active; D - Deleted',
            defaultValue: 'A',
            allowNull: false
        },
        created_by:{
            type:Sequelize.STRING(25),
            allowNull: false,
            defaultValue: 'admin'
        },
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

    return Location;
};

module.exports = locationmodel;