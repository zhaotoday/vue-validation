import AsyncValidator from "async-validator";

export const useFormValidators = () => {
  return {
    isUserId({ message = "" } = {}) {
      return {
        validator(rule, value) {
          return !value || /^[1-9]\d{7}$/.test(value);
        },
        message: message || "请输入8位数字ID",
      };
    },
    isAccount({ label = "账号", message = "" } = {}) {
      return {
        pattern: /[a-zA-Z0-9_-]{8,20}/,
        message: message || `${label}格式错误`,
      };
    },
    isNickName({ label = "昵称", message = "" } = {}) {
      return {
        pattern: /^[\\w\u4e00-\u9fa5]{2,8}$/,
        message: message || `${label}格式错误`,
      };
    },
    isRequired({ label, message } = {}) {
      return {
        required: true,
        message: message || `请输入${label}`,
      };
    },
    isPhoneNumber({ label = "手机号", message = "" } = {}) {
      return {
        pattern: /^1\d{2}\s?\d{4}\s?\d{4}$/,
        message: message || `${label}格式错误`,
      };
    },
    isEmail({ label = "邮箱", message = "" } = {}) {
      return {
        type: "email",
        message: message || `${label}格式错误`,
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
      };
    },
    isPassword({ label = "密码", message = "" } = {}) {
      return {
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
        message: message || `${label}格式错误`,
      };
    },
    isCaptcha({ label = "验证码", message = "" } = {}) {
      return {
        len: 6,
        message: message || `${label}格式错误`,
      };
    },
    async validate(cForm, field, callback) {
      await new AsyncValidator(cForm.rules).validate(
        cForm.model,
        async (errors) => {
          if (field) {
            if (errors) {
              const error = errors.find((error) => error.field === field);

              if (error) {
                cForm.errors[field] = error.message;
              } else {
                cForm.errors[field] = "";
              }
            } else {
              cForm.errors[field] = "";
            }
          } else {
            Object.keys(cForm.errors).forEach((field) => {
              cForm.errors[field] = "";
            });

            (errors || []).forEach((error) => {
              cForm.errors[error.field] = error.message;
            });
          }

          callback && callback(errors, cForm.model, cForm.rules);
        }
      );
    },
  };
};
