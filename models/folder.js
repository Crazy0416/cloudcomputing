'use strict';
module.exports = (sequelize, DataTypes) => {
  const folder = sequelize.define('folder', {
    foldername: { 
      type: DataTypes.STRING,
      allowNull:false,
    },
    parent_dir: { 
      type: DataTypes.STRING,
      allowNull:false,
    },
    directory: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    root_user: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    modify_user: DataTypes.STRING,
    read_user: DataTypes.STRING
  }, {});
  folder.associate = function(models) {
    // associations can be defined here
  };
  return folder;
};