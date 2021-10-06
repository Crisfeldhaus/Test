const Sequelize = require ("sequelize");
const connection = require ("../database/db")
const Termin = require ("../termine/Termin")  

const Users = connection.define('beta_users',{
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    }, vorname:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nachname:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    role:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
        //role default 0 User mode
        //role = 1 Admin mode
    }

},{ 
        tableName: 'beta_users'
}) 

Users.hasOne(Termin , {foreignKey: 'user_id'})

module.exports= Users;