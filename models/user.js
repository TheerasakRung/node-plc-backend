'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
      User.belongsTo(models.User, { foreignKey: 'created_by', as: 'createdBy' });
      User.hasMany(models.User, { foreignKey: 'created_by', as: 'createdUsers' });
      User.hasMany(models.UserRoom, { foreignKey: 'user_id', as: 'roomAssignments', onDelete: 'CASCADE' });
      User.hasMany(models.UserRoom, { foreignKey: 'assigned_by', as: 'assignedRooms' });
      User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'customRole' });
      User.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};
