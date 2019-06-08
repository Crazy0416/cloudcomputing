'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_id: {
      type: DataTypes.STRING,
      unique : true,
      allowNull: false,
    } ,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    name : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shared_folder: {
      type: DataTypes.STRING,

    } ,
    sharing_folder: {
      type: DataTypes.STRING,
    } ,
    salt: {
      type: DataTypes.STRING
    }
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};