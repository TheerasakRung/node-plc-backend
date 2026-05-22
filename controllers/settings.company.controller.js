'use strict';

const service = require('../services/settings.company.service');

exports.listCompanies = async (req, res) => {
  try {
    const companies = await service.listAll();
    res.json({ success: true, data: companies });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }
    const company = await service.create({ name });
    res.status(201).json({ success: true, data: company });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    const updated = await service.update(id, { name, is_active });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.json({ success: true, message: 'Company deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
