const authmodel = (sequelize, Sequelize) => {
    const Auth = sequelize.define("auth", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        username:{
            type:Sequelize.STRING(50),
            allowNull: false
        },
        password:{
            type:Sequelize.STRING(128),
            allowNull: false
        },
        /*salt:{
            type:Sequelize.STRING(32),
            allowNull: false
        },*/
        role: {
            type:Sequelize.STRING(1),
            allowNull: false,
            defaultValue: 'C',
            comment: 'C - Customer; A - Admin; U - Cambrian User'
        },
        status:{
            type:Sequelize.STRING(1),
            allowNull: false,
            comment: 'A - Active; D - Deleted'
        },
        created_by:{
            type:Sequelize.STRING(25),
            allowNull: false,
            defaultValue: 'admin'
        },
        email:{
            type:Sequelize.STRING(50),
            allowNull: true
        },
        name:{
            type:Sequelize.STRING(50),
            allowNull: true
        },
        phone_number:{
            type:Sequelize.STRING(20),
            allowNull: true
        },
        name_2:{
            type:Sequelize.STRING(50),
            allowNull: true
        },
        phone_number_2:{
            type:Sequelize.STRING(20),
            allowNull: true
        },
        phone_number_no_reading:{
            type:Sequelize.STRING(20),
            allowNull: true
        },
        telegram:{
            type:Sequelize.STRING(100),
            allowNull: true
        },
        whatsapp:{
            type:Sequelize.STRING(100),
            allowNull: true
        },
    }, {
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                name: 'username',
                unique: true,
                fields: ['username']
            }
        ]
    });

    return Auth;
};

module.exports = authmodel;