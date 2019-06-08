'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('folders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      foldername: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      parent_dir: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      directory: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      root_user: {
        type:Sequelize.STRING,
        allowNull:false,
      },
      modify_user: {
        type: Sequelize.STRING
      },
      read_user: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('folders');
  }
};