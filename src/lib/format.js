export function formatNumber(number) {
  return new Intl.NumberFormat('es-PE').format(number);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatPercentage(value, decimals = 1) {
  return `${Number(value).toFixed(decimals)}%`;
}

export function getTimePeriods() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const last3Months = new Date(now);
  last3Months.setMonth(last3Months.getMonth() - 3);
  
  const last6Months = new Date(now);
  last6Months.setMonth(last6Months.getMonth() - 6);
  
  return {
    today,
    lastMonth,
    last3Months,
    last6Months
  };
}

export function calculateGrowth(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}