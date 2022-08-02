const range = 'ABCDEF0123456789';

export default (): string => {
  let hex = '#';

  for (let i = 0; i < 6; i += 1) {
    hex += range.charAt(Math.floor(Math.random() * range.length));
  }

  return hex;
};
