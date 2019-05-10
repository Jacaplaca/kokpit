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
    define: {
      //charset: "utf8",
      //collate: "utf8_general_ci",
      // collate: "utf8_polish_ci",
      timestamps: true
    },
    logging: false
    // dialectOptions: {
    //   useUTC: false //for reading from database
    // }
    // timezone: "+02:00" //for writing to database
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

const ChannelItems = db.channel_items;
const Channel = db.sales_channels;
const Client = db.clients;
const Module = db.modules;
const Flag = db.flags;
const CustomersOfCustomer = db.planer_klienci;
const Item = db.items;
const User = db.users;
const Transaction = db.transactions;
const Invoices = db.invoices4sms_intf;

// console.log(db);
///
// db.users = require('./user')(sequelize, Sequelize);
// db.clients = require('./client')(sequelize, Sequelize);
// console.log(db.gus_simc);

db.users.belongsTo(db.clients, {
  as: "Company",
  foreignKey: "clientId",
  targetKey: "id"
});
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

// db.planer_aktywnosci.belongsTo(db.gus_simc, {
//   foreignKey: "miejsce_id",
//   targetKey: "id"
// });
db.planer_aktywnosci.belongsTo(db.places, {
  foreignKey: "miejsce_id",
  targetKey: "id"
});
db.planer_aktywnosci.belongsTo(db.planer_akt_rodz, {
  foreignKey: "aktywnosc_id",
  targetKey: "id"
});
db.planer_aktywnosci.belongsTo(db.users, {
  foreignKey: "user_id",
  targetKey: "id"
});
db.planer_aktywnosci.belongsTo(db.clients, {
  foreignKey: "klient_id",
  targetKey: "id"
});

// db.planer_raporty.belongsTo(db.gus_simc, {
//   foreignKey: "miejsce_id",
//   targetKey: "id"
// });
db.planer_raporty.belongsTo(db.places, {
  foreignKey: "miejsce_id",
  targetKey: "id"
});
db.planer_raporty.belongsTo(db.planer_akt_rodz, {
  foreignKey: "aktywnosc_id",
  targetKey: "id"
});
db.planer_raporty.belongsTo(db.users, {
  foreignKey: "user_id",
  targetKey: "id"
});
db.planer_raporty.belongsTo(db.clients, {
  foreignKey: "firma_id",
  targetKey: "id"
});
db.planer_raporty.belongsTo(CustomersOfCustomer, {
  foreignKey: "planer_klienci_id",
  targetKey: "id"
});
db.customer_details.belongsTo(CustomersOfCustomer, {
  foreignKey: "customerId",
  targetKey: "id",
  as: "Customer"
});

CustomersOfCustomer.belongsTo(db.clients, {
  foreignKey: "clientId",
  targetKey: "id"
});

db.overdue_payments.belongsTo(db.users, {
  foreignKey: "id_user",
  targetKey: "id"
});
db.overdue_payments.belongsTo(CustomersOfCustomer, {
  foreignKey: "id_customer_client",
  targetKey: "id"
});

// db.tractors.belongsTo(db.customer_details, {
//   foreignKey: "customerDetailsId",
//   targetKey: "id"
// });

db.customer_details.hasMany(db.tractors, {
  as: "Tractors",
  foreignKey: "customerDetailsId"
});
db.customer_details.hasMany(db.harvesters, {
  as: "Harvesters",
  foreignKey: "customerDetailsId"
});
db.customer_details.hasMany(db.cultivators, {
  as: "Cultivators",
  foreignKey: "customerDetailsId"
});
db.customer_details.hasMany(db.agros, {
  as: "Agros",
  foreignKey: "customerDetailsId"
});

// db.customer_details.hasOne(db.users, {
//   as: "User",
//   foreignKey: "userId"
// });

db.customer_details.belongsTo(db.users, {
  foreignKey: "userId",
  targetKey: "id",
  as: "User"
});

Channel.belongsToMany(Item, {
  as: "SalesItems",
  through: db.channel_items, //this can be string or a model,
  foreignKey: "channel_id"
});

Item.belongsToMany(Channel, {
  as: "SalesChannels",
  through: db.channel_items,
  foreignKey: "item_id"
});

Channel.belongsToMany(User, {
  as: "SalesUsers",
  through: db.channel_users, //this can be string or a model,
  foreignKey: "channel_id"
});

User.belongsToMany(Channel, {
  as: "SalesChannels",
  through: db.channel_users,
  foreignKey: "user_id"
});

db.channels_config_new.belongsTo(Item, {
  as: "Item",
  targetKey: "id",
  foreignKey: "itemId"
});

db.channels_config_new.belongsTo(Channel, {
  as: "Channel",
  targetKey: "id",
  foreignKey: "channelId"
});

Invoices.belongsTo(User, {
  as: "User",
  targetKey: "id_client_soft",
  foreignKey: "id_pracownik"
});

Transaction.belongsTo(User, {
  as: "User",
  targetKey: "id",
  foreignKey: "userId"
});

Transaction.belongsTo(Channel, {
  as: "ChannelTrans",
  targetKey: "id",
  foreignKey: "channelId"
});

Transaction.belongsTo(Item, {
  as: "ItemTrans",
  targetKey: "id",
  foreignKey: "itemId"
});

Transaction.belongsTo(db.places, {
  as: "Places",
  targetKey: "id",
  foreignKey: "cityId"
});

Module.belongsToMany(Client, {
  as: "ModuleClient",
  through: db.modules_clients, //this can be string or a model,
  foreignKey: "module_id"
});

Client.belongsToMany(Module, {
  as: "ClientModule",
  through: db.modules_clients,
  foreignKey: "client_id"
});

Module.belongsToMany(User, {
  as: "ModuleUser",
  through: db.modules_users, //this can be string or a model,
  foreignKey: "module_id"
});

User.belongsToMany(Module, {
  as: "UserModule",
  through: db.modules_users,
  foreignKey: "user_id"
});

Flag.belongsToMany(CustomersOfCustomer, {
  as: "FlagCustomer",
  through: db.flags_customers, //this can be string or a model,
  foreignKey: "flag_id"
});

CustomersOfCustomer.belongsToMany(Flag, {
  as: "CustomerFlag",
  through: db.flags_customers,
  foreignKey: "customer_id"
});

// db.overdue_payments.belongsTo(db.users, {
//   foreignKey: "id_user",
//   targetKey: "id"
// });

// Team.hasOne(Game, {as: 'HomeTeam', foreignKey : 'homeTeamId'});
// Team.hasOne(Game, {as: 'AwayTeam', foreignKey : 'awayTeamId'});

// db.channels_items.belongsTo(db.sales_channels, {
//   foreignKey: "channelId",
//   targetKey: "id"
// });

// db.gus_simc.belongsToMany(db.gus_terc_pow, {
//   through: db.gus_terc_woj,
//   foreignKey: "woj_id"
// });
// db.gus_simc.belongsTo(db.gus_terc_gmi, { foreignKey: "gmi", targetKey: "id" });

// db.clients.hasMany(db.users, {})
// User.belongsTo(Client, { foreignKey: 'clientId', targetKey: 'id' });
///
module.exports = db;
