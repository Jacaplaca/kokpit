module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
        // notEmpty: true
      },
      surname: {
        type: Sequelize.STRING
        // notEmpty: true
      },
      // username: {
      //     type: Sequelize.TEXT
      // },
      // about: {
      //     type: Sequelize.TEXT
      // },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
          // unique: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resetPasswordToken: {
        type: Sequelize.STRING
      },
      resetPasswordExpires: {
        type: Sequelize.STRING
      },
      last_login: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active"
      },
      role: {
        type: Sequelize.ENUM("master", "admin", "pracownik"),
        defaultValue: "pracownik"
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      nr_telefonu: {
        type: Sequelize.STRING
      },
      id_client_soft: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      channel_first: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      start_comp: {
        type: Sequelize.INTEGER
        // defaultValue: 1
      },
      nextReports_user: {
        type: Sequelize.STRING
      },
      nextReports_pass: {
        type: Sequelize.STRING
      },
      filesToDownload: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  // User.associate = function(models) {
  //   console.log(models);
  // };

  // User.prototype.isAdmin = function(client) {
  //   // console.log(client);
  //   // return console.log(this.clientId === 1);
  //   return client.name === "Salana";
  // };
  // User.prototype.isAdmin = function() {
  //   // console.log(client);
  //   // return console.log(this.clientId === 1);
  //   return User.clientId === 1;
  // };

  return User;
};
