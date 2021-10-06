const Sequelize = require ("sequelize");
const connection = require ("../database/db") 
const moment = require ("moment") 

const Termin = connection.define('termines',{
    termin_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    titel:{
        type: Sequelize.STRING,
        allowNull: false
    },
    datum:{
        type: Sequelize.DATEONLY,
        allowNull: false,
        get: function() {
            return moment(this.getDataValue('datum')).format('DD-MM-YYYY')
         }
    },
    uhrzeit:{
        type: Sequelize.TIME,
        allowNull: false,
    },
    ort:{
        type: Sequelize.STRING,
        allowNull: false
    },
    studie_id:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'termines'
}) 

module.exports= Termin;