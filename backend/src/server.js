require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 3000;

console.log("PORT =", process.env.PORT);




async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(" Failed to start:", err.message);
    process.exit(1);
  }
}

start();
