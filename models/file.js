'use strict';
module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('file', {
    hash: { 
      type: DataTypes.STRING,
      unique:true,
    },
    file_name: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    file_url: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    filetype: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    filevolume: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    root_user: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    parent_dir: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    directory: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {});
  file.associate = function(models) {
    // associations can be defined here
  };
  return file;
};