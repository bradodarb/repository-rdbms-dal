'use strict';

module.exports = (sequelize, DataTypes) => {

  let webUser = sequelize.define('webUser', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 24]
      }
    },
    email: {
      type: DataTypes.STRING(96),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    pass: {
      type: DataTypes.STRING(2048)
    },
    salt: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    modifiedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        // Roles
        webUser.roleIncludes = webUser.belongsToMany(models.role, {through: 'userRoles'});

        // Profile
        webUser.profileInclude = webUser.hasOne(models.profile);

      },
      scopes: (models) => {
        webUser.addScope('includeRoles', {
          include: [
            {
              model: models.role
            }
          ]
        });
      }
    },
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true
  });

  return webUser;
};
