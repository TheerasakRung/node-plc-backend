'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.User, { foreignKey: 'company_id', as: 'users' });
      Company.hasMany(models.Role, { foreignKey: 'company_id', as: 'roles' });
    }
  }

  Company.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: false
  });

  return Company;
};
