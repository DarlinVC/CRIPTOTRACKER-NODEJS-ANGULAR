const dotenv = require("dotenv");
dotenv.config();

const ENV =  {
  BINANCE: {
    API_KEY: process.env.BINANCE_API_KEY,
    API_SECRET: process.env.BINANCE_API_SECRET,
  },
};

module.exports = ENV;