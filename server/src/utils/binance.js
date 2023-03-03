const Binance = require("node-binance-api");

// ENV
const ENV = require("../configs/config");

const binance = new Binance().options({
  APIKEY: ENV.BINANCE.API_KEY,
  APISECRET: ENV.BINANCE.API_SECRET,
});

/**
 *
 * @returns array
 * @description This function creates a promise by making a
 * request to the binance API to get the candlesticks of bitcoin,
 *  to return the time, closing price, and total volume sold for that candle.
 */
function ChartBtcData() {
  return new Promise((resolve, reject) => {
    binance.candlesticks("BTCUSDT", "1m", (err, ticks, symbol) => {
      if (err) {
        reject(err);
      }
      pricesBTC = ticks.map((tick) => {
        const [
          time,
          open,
          high,
          low,
          close,
          volume,
          closeTime,
          assetVolume,
          trades,
          buyBaseVolume,
          buyAssetVolume,
          ignored,
        ] = tick;
        return [time, parseFloat(close), parseFloat(buyBaseVolume)];
      });
      resolve(pricesBTC);
    });
  });
}

/**
 * All functions of percentage
 * @returns array
 * @descriptionThis This set of functions returns a
 *  promise, which accesses the binance api to obtain
 *  and calculate the percentage of
 * decrease or increase in "1h, 24h, 7d-1week" of the bitcoin
 */

function percentagePerHourBtc() {
  return new Promise((resolve, reject) => {
    binance.candlesticks("BTCUSDT", "1h", (err, ticks) => {
      if (err) reject(err);
      const currentPrice = parseFloat(ticks[ticks.length - 1][4]);
      const prevPrice = parseFloat(ticks[ticks.length - 2][4]);

      const priceChange = currentPrice - prevPrice;
      const percentChange = (priceChange / prevPrice) * 100;

      const result = [
        currentPrice,
        parseFloat(priceChange.toFixed(2)),
        parseFloat(percentChange.toFixed(2)),
      ];
      resolve(result);
    });
  });
}

function percentage24hBtc() {
  return new Promise((resolve, reject) => {
    binance.candlesticks("BTCUSDT", "1d", (err, ticks) => {
      if (err) reject(err);
      const currentPrice = parseFloat(ticks[ticks.length - 1][4]);
      const prevPrice = parseFloat(ticks[ticks.length - 2][4]);

      const priceChange = currentPrice - prevPrice;
      const percentChange = (priceChange / prevPrice) * 100;

      const result = [
        currentPrice,
        parseFloat(priceChange.toFixed(2)),
        parseFloat(percentChange.toFixed(2)),
      ];
      resolve(result);
    });
  });
}

function percentage7DayBtc() {
  return new Promise((resolve, reject) => {
    binance.candlesticks("BTCUSDT", "1w", (err, ticks) => {
      if (err) reject(err);
      const currentPrice = parseFloat(ticks[ticks.length - 1][4]);
      const prevPrice = parseFloat(ticks[ticks.length - 2][4]);

      const priceChange = currentPrice - prevPrice;
      const percentChange = (priceChange / prevPrice) * 100;

      const result = [
        currentPrice,
        parseFloat(priceChange.toFixed(2)),
        parseFloat(percentChange.toFixed(2)),
      ];
      resolve(result);
    });
  });
}

module.exports = {
  ChartBtcData,
  percentagePerHourBtc,
  percentage24hBtc,
  percentage7DayBtc,
};
