const { Model, DataTypes } = require('sequelize');

const db = require('../config/connection.js');

class Tag extends Model { }

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    tag_name: {
      type: DataTypes.STRING
    },

  },
  {
    sequelize:db,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;
