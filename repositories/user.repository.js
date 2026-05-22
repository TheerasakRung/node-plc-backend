'use strict';

const { User, UserRoom, Room, Role, Company } = require('../models');

exports.findByEmail = (email) => {
  return User.findOne({
    where: { email },
    include: [
      {
        model: UserRoom,
        as: 'roomAssignments',
        include: [{ model: Room, as: 'room', attributes: ['id', 'name'] }]
      },
      {
        model: Role,
        as: 'customRole',
        attributes: ['id', 'name', 'tab_permissions', 'scope_permissions']
      },
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }
    ]
  });
};

exports.findById = (id) => {
  return User.findByPk(id);
};

exports.create = (data) => {
  return User.create(data);
};

exports.update = (id, data) => {
  return User.update(data, { where: { id } });
};
