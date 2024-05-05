import { onUnmounted, reactive } from "vue";

export const useCaptcha = ({
  sendText = "获取验证码",
  waitText = "{seconds}s 后获取",
  validate,
  request,
}) => {
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
    cCaptcha.message = waitText.replace("{seconds}", captcha.leftSeconds + "");

    captcha.timer = setInterval(() => {
      cCaptcha.message = waitText.replace(
        "{seconds}",
        captcha.leftSeconds - ++captcha.i + ""
      );

      if (captcha.leftSeconds === captcha.i) {
        clearInterval(captcha.timer);

        cCaptcha.disabled = false;
        cCaptcha.message = sendText;
      }
    }, 1000);
  };

  const resetCaptcha = () => {
    clearInterval(captcha.timer);

    captcha.timer = null;
    captcha.i = 0;
    captcha.leftSeconds = 120;

    cCaptcha.disabled = false;
    cCaptcha.message = sendText;
  };

  return {
    cCaptcha,
    sendCaptcha,
    resetCaptcha,
  };
};
