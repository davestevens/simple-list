export default (hex: string): string => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  return red * 0.299 + green * 0.587 + blue * 0.114 > 186
    ? '#000000'
    : '#FFFFFF';
};
