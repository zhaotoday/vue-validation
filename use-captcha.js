import { onUnmounted, reactive } from "vue";

export const useCaptcha = ({ sendText = "获取验证码", validate, request }) => {
  const captcha = {
    timer: null,
    i: 0,
    leftSeconds: 120,
  };

  const cCaptcha = reactive({
    disabled: false,
    message: sendText,
  });

  onUnmounted(() => {
    captcha.i = 0;
    captcha.leftSeconds = 120;

    cCaptcha.disabled = false;
    cCaptcha.message = sendText;

    clearInterval(captcha.timer);
  });

  const sendCaptcha = async () => {
    if (cCaptcha.disabled) return;

    await validate();

    await request();

    captcha.i = 0;
    captcha.leftSeconds = 120;

    cCaptcha.disabled = true;
    cCaptcha.message = `${captcha.leftSeconds}s 后获取`;

    captcha.timer = setInterval(() => {
      cCaptcha.message = `${captcha.leftSeconds - ++captcha.i}s 后获取`;

      if (captcha.leftSeconds === captcha.i) {
        clearInterval(captcha.timer);

        cCaptcha.disabled = false;
        cCaptcha.message = sendText;
      }
    }, 1000);
  };

  return {
    cCaptcha,
    sendCaptcha,
  };
};
