// models/user.model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", { // 🔁 table name should match here too
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return User;
};
