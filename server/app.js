const express = require("express");
const cors = require("cors");
const app = express();

const server = require("http").Server(app);

// functions of binance.js
const {
  ChartBtcData,
  percentagePerHourBtc,
  percentage24hBtc,
  percentage7DayBtc,
} = require("./src/utils/binance");

// cors
app.use(cors());

// config cors in socket
const io = require("socket.io")(server, {
  cors: {
    origins: ["http://localhost:4200"],
  },
});

// socket connection
io.on("connection", (socket) => {
  setInterval(async () => {
    // pct is percentage
    let pricesBTC = await ChartBtcData();
    let pctHourBtc = await percentagePerHourBtc();
    let pct24hBtc = await percentage24hBtc();
    let pct7DayBtc = await percentage7DayBtc();

    // data emit of BTC.
    socket.emit("BTC", {
      data: [
        {
          name: "BTC",
          prices: pricesBTC,
          percentageHour: pctHourBtc,
          percentage24h: pct24hBtc,
          percentage7Day: pct7DayBtc
        },
      ],
    });
  }, 5000);
});

server.listen(3000, () => console.log("Ready!"));
