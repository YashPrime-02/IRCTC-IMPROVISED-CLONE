// models/booking.js
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
    date: {
      type: DataTypes.STRING, // 👈 Add this
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING, // 👈 And this
      allowNull: true
    },
    passengers: {
      type: DataTypes.JSON,
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
