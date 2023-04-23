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
        pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[\w!@#$%^&*()-+=]{6,16}$/,
        message: message || `${label}格式错误（6-16位字母+数字）`,
        ...ruleOptions,
      };
    },
    isCaptcha({ label = "验证码", message = "" } = {}) {
      return {
        len: 6,
        message: message || `${label}格式错误`,
        ...ruleOptions,
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
                cForm.errors = { ...cForm.errors, [error.field]: error.message };
              }
            });
          }

          callback && callback(errors, cForm.model, cForm.rules);
        }
      );
    },
    async clearInput(cForm, field){
      cForm.model[field] = '';
      await this.validate(cForm, field);
    }
  };
};
