module.exports = {
  asciiToHexa(str) {
    let arr1 = [];
    for (let n = 0, l = str.length; n < l; n++) {
      let hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join("");
  },
  hexaToAscii(hexa) {
    let hex = hexa.toString();
    let str = "";
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
};
