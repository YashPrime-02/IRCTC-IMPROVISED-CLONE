module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Train', {
    trainName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
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
    }
  });
};
