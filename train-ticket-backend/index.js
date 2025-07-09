// const express = require("express");
// const cors = require("cors");
// const db = require("./middleware/models"); 
// require("dotenv").config(); 
// const morgan = require('morgan');
// const logger = require('./utils/logger');
// const app = express();
// const PORT = process.env.PORT || 8080;
// const requestLogger = require('./controllers/requestLogger');
// app.use(requestLogger); 




// const stream = {
//   write: (message) => logger.http(message.trim())
// };
// app.use(morgan('combined', { stream }));



// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("🚄 IRCTC Clone Backend is Running!");
// });

// app.use("/api/auth", require("./routes/auth.routes"));      
// app.use("/api/test", require("./routes/test.routes"));      
// app.use("/api/trains", require("./routes/train.routes"));   
// app.use("/api/stations", require("./routes/station.routes"));
// app.use("/api/dev", require("./routes/dev.routes"));        
// app.use("/api/bookings", require("./routes/booking.routes")); 

// db.sequelize.authenticate()
//   .then(() => {
//     console.log("✅ MySQL connected successfully.");
  
//     return db.sequelize.sync({ alter: true });
//   })
//   .then(() => {
//     console.log("🛠️ Tables synced successfully (with alter: true).");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Unable to connect to MySQL:", err);
//   });
