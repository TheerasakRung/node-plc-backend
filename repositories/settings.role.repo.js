'use strict';

const { Role, User } = require('../models');

exports.findAll = (company_id) => {
  return Role.findAll({
    where: { company_id },
    order: [['name', 'ASC']]
  });
};

exports.findById = (id) => {
  return Role.findByPk(id);
};

exports.findByName = (name, company_id) => {
  return Role.findOne({ where: { name, company_id } });
};

exports.create = (data) => {
  return Role.create(data);
};

exports.update = (id, data) => {
  return Role.update(data, { where: { id } });
};

exports.delete = (id) => {
  return Role.destroy({ where: { id } });
};

exports.countUsers = (role_id) => {
  return User.count({ where: { role_id } });
};
