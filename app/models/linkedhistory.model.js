const linkedhistorymodel = (sequelize, Sequelize) => {
    const Linkedhistory = sequelize.define("linkedhistory", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        linked_date:{
            type:Sequelize.DATE
        }
    }, {
        timestamps: true,
        updatedAt: false,
        createdAt: 'unlinked_date',
    });
    
    return Linkedhistory;
};

module.exports = linkedhistorymodel;