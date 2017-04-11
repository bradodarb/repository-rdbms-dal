'use strict';

module.exports = (sequelize, DataTypes) => {

  let state = sequelize.define('state', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      abbrev: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: 2
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      classMethods: {
        associate: (models) => {
          state.locationIncludes = state.hasMany(models.location, {as: 'locations'});
        }
      },
      timestamps: false
    });

  return state;

};
