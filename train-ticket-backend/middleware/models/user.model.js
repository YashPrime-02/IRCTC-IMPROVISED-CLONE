module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
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
    },

    // ✅ Fields used for password reset token logic
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return User;
};
