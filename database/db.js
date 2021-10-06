const Sequelize = require('sequelize')

 //Connection with the Database
 const connection = new Sequelize('registerSystem', 'root', '12345678',{
    host: "localhost",
    dialect:'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
      },
})

module.exports = connection;
    
    