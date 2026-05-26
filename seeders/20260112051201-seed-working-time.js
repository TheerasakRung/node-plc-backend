'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('working_time', [
      {
        schedule: JSON.stringify({
          monday:    { working_hours: [{ start: '09:00', end: '18:00' }], break_times: [{ start: '12:00', end: '13:00' }] },
          tuesday:   { working_hours: [{ start: '09:00', end: '18:00' }], break_times: [{ start: '12:00', end: '13:00' }] },
          wednesday: { working_hours: [{ start: '09:00', end: '18:00' }], break_times: [{ start: '12:00', end: '13:00' }] },
          thursday:  { working_hours: [{ start: '09:00', end: '18:00' }], break_times: [{ start: '12:00', end: '13:00' }] },
          friday:    { working_hours: [{ start: '09:00', end: '18:00' }], break_times: [{ start: '12:00', end: '13:00' }] },
          saturday:  { working_hours: [], break_times: [] },
          sunday:    { working_hours: [], break_times: [] }
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('working_time', null, {});
  }
};
