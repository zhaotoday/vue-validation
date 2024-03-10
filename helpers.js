export const isIdCard = (idCard) => {
  // 简单验证格式
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) {
    return false;
  }

  // 切割身份证号码
  const idCardArray = idCard.split("");

  // 验证生日
  let year, month, day;
  if (idCard.length === 15) {
    year = parseInt("19" + idCard.substr(6, 2), 10);
    month = parseInt(idCard.substr(8, 2), 10);
    day = parseInt(idCard.substr(10, 2), 10);
  } else {
    year = parseInt(idCard.substr(6, 4), 10);
    month = parseInt(idCard.substr(10, 2), 10);
    day = parseInt(idCard.substr(12, 2), 10);
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // 更加严格的格式检查，对最后一位进行校验
  if (idCard.length === 18) {
    let sum = 0;
    const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parityBit = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    for (let i = 0; i < 17; i++) {
      sum += factors[i] * parseInt(idCardArray[i], 10);
    }
    if (parityBit[sum % 11] !== idCardArray[17].toUpperCase()) {
      return false;
    }
  }

  return true;
};
