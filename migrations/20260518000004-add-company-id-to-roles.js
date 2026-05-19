'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'companies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roles', 'company_id');
  }
};
