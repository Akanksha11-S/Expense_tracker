const locale = import.meta.env.VITE_LOCALE || 'en-IN';
const currency = import.meta.env.VITE_CURRENCY || 'INR';

const money = new Intl.NumberFormat(locale, { style: 'currency', currency });
const dateTime = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });

export const formatMoney = (n) => money.format(n);
export const formatDate = (iso) => dateTime.format(new Date(iso));
