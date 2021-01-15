const range: string = "ABCDEF0123456789";

export default (): string => {
    let hex: string = "#";

    for (var i = 0; i < 6; i++ ) {
      hex += range.charAt(Math.floor(Math.random() * range.length));
    }

    return hex;
}
