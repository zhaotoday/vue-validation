import AsyncValidator from "async-validator";

export const useValidators = ({ ruleOptions = { trigger: "blur" } } = {}) => {
  return {
    isUserId({ message = "" } = {}) {
      return {
        validator(rule, value) {
          return !value || /^[1-9]\d{7}$/.test(value);
        },
        message: message || "请输入8位数字ID",
        ...ruleOptions,
      };
    },
    isAccount({ label = "账号", message = "" } = {}) {
      return {
        pattern: /[a-zA-Z0-9_-]{8,20}/,
        message: message || `${label}格式错误`,
        ...ruleOptions,
      };
    },
    isNickName({ label = "昵称", message = "" } = {}) {
      return {
        pattern: /^[\\w\u4e00-\u9fa5]{2,8}$/,
        message: message || `${label}格式错误`,
        ...ruleOptions,
      };
    },
    isRequired({ label, message } = {}) {
      return {
        required: true,
        message: message || `请输入${label}`,
        ...ruleOptions,
      };
    },
    isPhoneNumber({ label = "手机号", message = "" } = {}) {
      return {
        pattern: /^1\d{2}\s?\d{4}\s?\d{4}$/,
        message: message || `${label}格式错误`,
        ...ruleOptions,
      };
    },
    isEmail({ label = "邮箱", message = "" } = {}) {
      return {
        type: "email",
        message: message || `${label}格式错误`,
        ...ruleOptions,
      };
    },
    isPhoneNumberOrEmail({ label = "账号", message = "" } = {}) {
      const phoneNumberPattern = /^1\d{2}\s?\d{4}\s?\d{4}$/;
      const emailPattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return {
        validator(rule, value) {
          return phoneNumberPattern.test(value) || emailPattern.test(value);
        },
        message: message || `${label}格式错误（必须是手机号或邮箱）`,
        ...ruleOptions,
      };
    },
    isPassword({ label = "密码", message = "" } = {}) {
      return {
        pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[\w\S]{6,16}$/,
        message: message || `${label}需包含字母+数字，且为6-16位`,
        ...ruleOptions,
      };
    },
    isCaptcha({ label = "验证码", message = "", length = 6 } = {}) {
      return {
        len: length,
        message: message || `${label}格式错误`,
        ...ruleOptions,
      };
    },
    isIdCard(idCard) {
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
        const parityBit = [
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
        ];
        for (let i = 0; i < 17; i++) {
          sum += factors[i] * parseInt(idCardArray[i], 10);
        }
        if (parityBit[sum % 11] !== idCardArray[17].toUpperCase()) {
          return false;
        }
      }

      return true;
    },
    async validate(cForm, field, callback) {
      try {
        await new AsyncValidator(cForm.rules).validate(
          cForm.model,
          async (errors) => {
            if (field) {
              if (errors) {
                const error = errors.find((error) => error.field === field);

                if (error) {
                  cForm.errors = { ...cForm.errors, [field]: error.message };
                } else {
                  cForm.errors = { ...cForm.errors, [field]: "" };
                }
              } else {
                cForm.errors = { ...cForm.errors, [field]: "" };
              }
            } else {
              Object.keys(cForm.errors).forEach((field) => {
                cForm.errors = { ...cForm.errors, [field]: "" };
              });

              (errors || []).forEach((error) => {
                if (!cForm.errors[error.field]) {
                  cForm.errors = {
                    ...cForm.errors,
                    [error.field]: error.message,
                  };
                }
              });
            }

            callback && callback(errors, cForm.model, cForm.rules);
          }
        );
      } catch (e) {}
    },
    async clearInput(cForm, field) {
      cForm.model[field] = "";
      await this.validate(cForm, field);
    },
  };
};
