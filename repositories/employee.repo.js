'use strict';

const { Employee, User } = require('../models');

exports.findAll = () => {
  return Employee.findAll({ order: [['id', 'ASC']] });
};

exports.findById = (id) => {
  return Employee.findByPk(id);
};

exports.findByEmployeeId = (employee_id) => {
  return Employee.findOne({ where: { employee_id } });
};

exports.create = (data) => {
  return Employee.create(data);
};

exports.update = (id, data) => {
  return Employee.update(data, { where: { id } });
};

exports.delete = (id) => {
  return Employee.destroy({ where: { id } });
};

exports.countLinkedUsers = (id) => {
  return User.count({ where: { employee_id: id } });
};
