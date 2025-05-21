// Verificar disponibilidad de Intl globalmente
const hasIntl = typeof window !== 'undefined' && 'Intl' in window;

export function formatNumber(number) {
  try {
    if (!hasIntl) {
      return number.toLocaleString();
    }
    return new Intl.NumberFormat('es-PE').format(number);
  } catch (error) {
    console.error('Error al formatear número:', error);
    return number.toString();
  }
}

export function formatDate(date) {
  try {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Fecha inválida';

    if (!hasIntl) {
      return d.toLocaleString();
    }

    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/Lima'
    }).format(d);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error de formato';
  }
}

export function formatDateTime(date) {
  try {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Fecha inválida';

    if (!hasIntl) {
      return d.toLocaleString();
    }

    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima'
    }).format(d);
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Error de formato';
  }
}

export function formatPercentage(value, decimals = 1) {
  try {
    const num = Number(value);
    if (isNaN(num)) return '0%';
    return `${num.toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error al formatear porcentaje:', error);
    return '0%';
  }
}

export function getTimePeriods() {
  try {
    const now = new Date();
    // Convertir a hora local de Perú
    const peruOptions = { timeZone: 'America/Lima' };
    const peruDate = hasIntl
      ? new Date(now.toLocaleString('en-US', peruOptions))
      : now;
    
    const today = new Date(peruDate.getFullYear(), peruDate.getMonth(), peruDate.getDate());
    const lastMonth = new Date(peruDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const last3Months = new Date(peruDate);
    last3Months.setMonth(last3Months.getMonth() - 3);
    
    const last6Months = new Date(peruDate);
    last6Months.setMonth(last6Months.getMonth() - 6);
    
    return {
      today,
      lastMonth,
      last3Months,
      last6Months
    };
  } catch (error) {
    console.error('Error al obtener períodos de tiempo:', error);
    const now = new Date();
    return {
      today: now,
      lastMonth: now,
      last3Months: now,
      last6Months: now
    };
  }
}

export function calculateGrowth(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function formatDateAsISO(date) {
  if (!date) return null;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    // Convertir a zona horaria de Perú
    const peruOptions = { timeZone: 'America/Lima' };
    const peruDate = hasIntl
      ? new Date(d.toLocaleString('en-US', peruOptions))
      : d;
    
    return peruDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error al formatear fecha como ISO:', error, date);
    return null;
  }
}