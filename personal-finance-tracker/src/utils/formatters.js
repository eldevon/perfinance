import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const formatDateForInput = (dateString) => {
  return format(new Date(dateString), 'yyyy-MM-dd');
};
