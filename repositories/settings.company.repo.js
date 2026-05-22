'use strict';

const { Company, User } = require('../models');

exports.findAll = () => {
  return Company.findAll({ order: [['name', 'ASC']] });
};

exports.findById = (id) => {
  return Company.findByPk(id);
};

exports.findByName = (name) => {
  return Company.findOne({ where: { name } });
};

exports.create = (data) => {
  return Company.create(data);
};

exports.update = (id, data) => {
  return Company.update(data, { where: { id } });
};

exports.delete = (id) => {
  return Company.destroy({ where: { id } });
};

exports.countUsers = (company_id) => {
  return User.count({ where: { company_id } });
};
