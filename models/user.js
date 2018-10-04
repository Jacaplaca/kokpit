module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // firstname: {
      //     type: Sequelize.STRING,
      //     notEmpty: true
      // },
      // lastname: {
      //     type: Sequelize.STRING,
      //     notEmpty: true
      // },
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
      costs: {
        type: Sequelize.TINYINT
      },
      planer: {
        type: Sequelize.TINYINT
      },
      raporty: {
        type: Sequelize.TINYINT
      },
      nextReports: {
        type: Sequelize.TINYINT
      }
    },
    {
      freezeTableName: true
    }
  );

  // User.associate = function(models) {
  //   console.log(models);
  // };

  User.prototype.isAdmin = function(client) {
    // console.log(client);
    // return console.log(this.clientId === 1);
    return client.name === "Salana";
  };

  return User;
};
