// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex(dec: number) {
  return ('0' + dec.toString(16)).substr(-2);
}

// generateId :: Integer -> String
export function newId(len?: number) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}
