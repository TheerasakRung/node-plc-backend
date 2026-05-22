'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE users DROP CONSTRAINT IF EXISTS "users_role_check";'
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE users ADD CONSTRAINT "users_role_check" CHECK (role IN ('super_admin', 'admin', 'operator', 'viewer', 'guest'));`
    );
  }
};
