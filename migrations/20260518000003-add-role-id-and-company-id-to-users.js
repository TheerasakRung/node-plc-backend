'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'roles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'companies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'company_id');
    await queryInterface.removeColumn('users', 'role_id');
  }
};
