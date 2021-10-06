const Sequelize = require ("sequelize");
const connection = require ("../database/db")  
const Termin = require ("../termine/Termin")

const Studie = connection.define('studies',{
    studie_id:{
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
        allowNull: false,
    },
    beschreibung:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    dauer_von_bis:{
        type: Sequelize.STRING,
        allowNull: false
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    },
    vergutung_euro_std:{
        type: Sequelize.DOUBLE,
        allowNull:false
    }
},{ 
        tableName: 'studies'
}) 

Studie.hasMany(Termin, {foreignKey: 'studie_id'})
Termin.belongsTo(Studie,{
    foreignKey:'studie_id'
})
//Studie.sync({force: true})

module.exports= Studie;