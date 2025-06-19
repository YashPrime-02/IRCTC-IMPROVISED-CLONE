module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Booking', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trainName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sourceCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destinationCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passengers: {
      type: DataTypes.JSON, // ✅ JSON field
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    bookingDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
};
