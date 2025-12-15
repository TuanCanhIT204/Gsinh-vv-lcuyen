function calculateDaysBetween(startDate, endDate = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const oneDayMs = 1000 * 60 * 60 * 24;
  return Math.floor(diffMs / oneDayMs);
}

module.exports = {
  calculateDaysBetween
};
