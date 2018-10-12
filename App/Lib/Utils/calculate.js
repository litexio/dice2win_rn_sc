
const getMaxBet = (maxWin = 5, winRate, edge = 0.01) => {
  return maxWin / ((1 - edge) * (1 / winRate) - 1)
}

module.exports = {
  getMaxBet,
}