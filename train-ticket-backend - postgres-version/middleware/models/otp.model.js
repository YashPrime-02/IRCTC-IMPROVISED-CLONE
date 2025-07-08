// models/otp.model.js
module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define("otps", {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return Otp;
};
