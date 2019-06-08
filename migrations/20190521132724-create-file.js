'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hash: {
        type: Sequelize.STRING,
        unique:true,
        allowNull:false
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull:false
      },
      filetype: {
        type: Sequelize.STRING,
        allowNull:false
      },
      filevolume: {
        type: Sequelize.STRING,
        allowNull:false
      },
      root_user: {
        type: Sequelize.STRING,
        allowNull:false
      },
      parent_dir: {
        type: Sequelize.STRING,
        allowNull:false
      },
      directory: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('files');
  }
};