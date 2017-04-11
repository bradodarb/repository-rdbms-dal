'use strict';

module.exports = (sequelize, DataTypes) => {

  let role = sequelize.define('role', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2,14]
        }
      },
      data: {
        type: DataTypes.STRING(256),
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
          role.userIncludes = role.belongsToMany(models.webUser, { through: 'userRoles' });
        },
        scopes: () => {
          role.addScope('minimal', {
            attributes: {
              exclude: ['modified', 'modifiedBy', 'created']
            }
          });
        }
      },
      timestamps: true,
      createdAt: 'created',
      updatedAt: 'modified',
      deletedAt: 'deleted',
      paranoid: true
    });

  return role;

};
