function convertCVEtoEUR(amountCVE) {
  const exchangeRate = 110.265; // 1 EUR = 110.265 CVE
  return parseFloat((amountCVE / exchangeRate).toFixed(2));
}

module.exports = { convertCVEtoEUR };
