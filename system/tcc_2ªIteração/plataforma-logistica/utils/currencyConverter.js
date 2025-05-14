// utils/currencyConverter.js

function convertCVEtoEUR(amountCVE) {
  const exchangeRate = 110.265; // 1 EUR = 110.265 CVE
  return parseFloat((amountCVE / exchangeRate).toFixed(2));
}

module.exports = { convertCVEtoEUR };

//futureproof
//Se quiseres deixar a função ainda mais flexível para outras moedas no futuro, podes criar algo tipo:
// function convertCurrency(amount, fromCurrency, toCurrency) {
//   const exchangeRates = {
//     'CVE_EUR': 110.265,
//     'USD_EUR': 1.07,
//     // adicionar outras taxas se quiser
//   };

//   const key = `${fromCurrency}_${toCurrency}`;
//   const rate = exchangeRates[key];

//   if (!rate) {
//     throw new Error('Taxa de conversão não definida para essas moedas.');
//   }

//   return parseFloat((amount / rate).toFixed(2));
// }

// module.exports = { convertCurrency };
