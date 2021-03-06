'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GoogleDriveOAuths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING,
				allowNull: false
      },
			credentials: {
				type: Sequelize.TEXT,
				allowNull: false
			},
      user_id: {
        type: Sequelize.INTEGER,
				allowNull: false,
				reference: {
					model: 'Users',
					key: 'id'
				}
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('GoogleDriveOAuths');
  }
};
