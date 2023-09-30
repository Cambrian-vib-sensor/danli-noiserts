const routermodel = (sequelize, Sequelize) => {
    const Router = sequelize.define("router", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        simcardno:{
            type:Sequelize.STRING(25),
            allowNull: false
        },
        admin:{
            type:Sequelize.STRING(20)
        },
        password:{
            type:Sequelize.STRING(20)
        },
        remark:{
            type:Sequelize.STRING(50)
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
                name: 'simcardno',
                unique: true,
                fields: ['simcardno']
            }
        ]
    });

    return Router;
};

module.exports = routermodel;