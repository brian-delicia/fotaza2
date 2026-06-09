const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Notification extends Model {}

Notification.init(
  {
    type: {
                                                       /* comment->comentarios
                                                        rating → valoración
                                                        interest → me interesa
                                                        follow → seguimiento
                                                        report → denuncia*/
      type: DataTypes.STRING(100),
      allowNull: false,

      validate: {
        isIn: [["comment", "rating", "interest", "follow", "report"]],
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      //leida no leida
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: false,
  },
);

module.exports = Notification;
