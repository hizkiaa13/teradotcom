export const formatNumber = (number) => {
  if (!number) return '';
  const stringNumber = number.toString().replace(/\D/g, '');
  return stringNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseNumber = (string) => {
  if (!string) return 0;
  return parseInt(string.toString().replace(/\D/g, ''), 10) || 0;
};
