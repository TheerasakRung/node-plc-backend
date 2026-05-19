'use strict';

const { User, UserRoom, Room, Role, Company } = require('../models');

const defaultIncludes = [
  { model: Role, as: 'customRole', attributes: ['id', 'name', 'tab_permissions', 'scope_permissions'] },
  { model: Company, as: 'company', attributes: ['id', 'name'] },
  {
    model: UserRoom,
    as: 'roomAssignments',
    include: [{ model: Room, as: 'room', attributes: ['id', 'name'] }]
  }
];

exports.findAll = (company_id) => {
  return User.findAll({
    where: { company_id },
    attributes: { exclude: ['password_hash'] },
    include: defaultIncludes,
    order: [['created_at', 'DESC']]
  });
};

exports.findById = (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
    include: defaultIncludes
  });
};

exports.update = (id, data) => {
  return User.update(data, { where: { id } });
};

exports.delete = (id) => {
  return User.destroy({ where: { id } });
};
