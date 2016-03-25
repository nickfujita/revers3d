function randStr(length) {
  return (Math.floor(Math.random() * Math.pow(10, length + 2))).toString(36).substr(0, length);
}

module.exports.randStr = randStr;
