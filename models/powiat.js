module.exports = (sequelize, Sequelize) => {
  const Powiat = sequelize.define(
    "gus_terc_pow",
    {
      id: {
        // autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      pow_id: {
        // autoIncrement: false,
        // primaryKey: true,
        type: Sequelize.STRING
      },
      woj_id: {
        // autoIncrement: false,
        // primaryKey: true,
        type: Sequelize.STRING
      },
      // woj_pow: {
      //   // autoIncrement: false,
      //   // primaryKey: true,
      //   type: Sequelize.STRING
      // },
      nazwa: {
        type: Sequelize.STRING
      },
      // pow: {
      //   type: Sequelize.STRING
      //   // get: function() {
      //   //   return "qwer";
      //   // }
      // },
      woj_pow: {
        type: Sequelize.STRING
        // get: function() {
        //   return "qwer";
        // }
      }
      // woj_pow: {
      //   type: new Sequelize.STRING(Sequelize.STRING, ["pow_id", "woj_id"]),
      //   get: function() {
      //     return this.get("pow_id") + this.get("woj_id");
      //   }
      // }
    },
    // {
    //   getterMethods: {
    //     pow() {
    //       return "aaa";
    //     }
    //   },
    //
    //   setterMethods: {
    //     pow(value) {
    //       // const names = value.split(' ');
    //
    //       this.setDataValue("pow", value);
    //       // this.setDataValue('lastname', names.slice(-1).join(' '));
    //     }
    //   }
    // },
    {
      freezeTableName: true
    }
  );

  return Powiat;
};
