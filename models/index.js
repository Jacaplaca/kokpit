"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, "..", "config", "config.json"))[env];
// var config = require(__dirname + '/..configconfig.json')[env];

require("dotenv").config();
// const mysql = require('mysql2');

var db = {};
// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config, {
//     logging: false
//   });
// } else {
var sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorsAliases: false,
    logging: false
  }
);
// }

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// console.log(db);
///
// db.users = require('./user')(sequelize, Sequelize);
// db.clients = require('./client')(sequelize, Sequelize);
// console.log(db.gus_simc);

db.users.belongsTo(db.clients, { foreignKey: "clientId", targetKey: "id" });
db.categories.belongsTo(db.clients, {
  foreignKey: "clientId",
  targetKey: "id"
});
db.groups.belongsTo(db.clients, { foreignKey: "clientId", targetKey: "id" });

db.costs.belongsTo(db.clients, { foreignKey: "clientId", targetKey: "id" });
db.costs.belongsTo(db.users, { foreignKey: "userId", targetKey: "id" });
db.costs.belongsTo(db.categories, {
  foreignKey: "categoryId",
  targetKey: "id"
});
db.costs.belongsTo(db.groups, { foreignKey: "groupId", targetKey: "id" });
//miasta
db.gus_simc.belongsTo(db.gus_terc_woj, { foreignKey: "woj", targetKey: "id" });
// db.gus_simc.belongsTo(db.gus_terc_pow, {
//   foreignKey: `${sequelize.col("db.gus_simc.woj")}${sequelize.col(
//     "db.gus_simc.pow"
//   )}`,
//   targetKey: "woj_pow"
// });
db.gus_simc.belongsTo(db.gus_terc_pow, {
  foreignKey: "woj_pow",
  targetKey: "woj_pow"
});
db.gus_simc.belongsTo(db.gus_terc, {
  foreignKey: "woj_pow_gmi",
  targetKey: "woj_pow_gmi"
});
db.gus_terc_pow.belongsTo(db.gus_terc_woj, {
  foreignKey: "woj_id",
  targetKey: "id"
});
// db.gus_simc.belongsToMany(db.gus_terc_pow, {
//   through: db.gus_terc_woj,
//   foreignKey: "woj_id"
// });
// db.gus_simc.belongsTo(db.gus_terc_gmi, { foreignKey: "gmi", targetKey: "id" });

// db.clients.hasMany(db.users, {})
// User.belongsTo(Client, { foreignKey: 'clientId', targetKey: 'id' });
///
module.exports = db;