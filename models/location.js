'use strict';

module.exports = (sequelize, DataTypes) => {

  let location = sequelize.define('location', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      zip: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumeric: true
        }
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      modifiedBy: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      }
    },
    {
      classMethods: {
        associate: (models) => {
          location.stateInclude = location.belongsTo(models.state);
          location.profileIncludes = location.hasMany(models.profile,{as: 'users'});
        },
        scopes: (models) => {
          location.addScope('defaultScope', {
            attributes: ['id', 'city', 'zip', 'address', 'modifiedBy', 'created', 'modified'],
            include: [
              {
                model: models.state,
                attributes: ['abbrev', 'name']
              }
            ]
          }, {override: true});
        }
      },
      timestamps: true,
      createdAt: 'created',
      updatedAt: 'modified',
      deletedAt: 'deleted',
      paranoid: true
    });

  return location;

};
