'use strict';

module.exports = (sequelize, DataTypes) => {

  let profile = sequelize.define('profile', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      photoUrl: {
        type: DataTypes.STRING,
        length: 2080,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      subscriptionLevel: {
        type: DataTypes.ENUM('Basic', 'Premium', 'Subscription'),
        allowNull: false,
        defaultValue: 'Basic'
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      websiteUrl: {
        type: DataTypes.STRING,
        length: 2080,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      phone: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [8, 15]
        }
      },
      modifiedBy: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      }
    },
    {
      classMethods: {
        associate: (models) => {
          profile.userInclude = profile.belongsTo(models.webUser);
          profile.locationInclude = profile.belongsTo(models.location, {as: 'location', foreignKey: 'locationId'});
        },
        scopes: (models) => {
          profile.addScope('defaultScope', {
            include: [{
              model: models.location,
              as: 'location'
            }]
          }, {override: true});
        }
      },
      timestamps: true,
      createdAt: 'created',
      updatedAt: 'modified',
      deletedAt: 'deleted',
      paranoid: true
    });

  return profile;

};
