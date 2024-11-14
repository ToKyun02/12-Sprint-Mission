const authForm = document.querySelector(".auth-form");

const addErrorMessage = (target, errorMessage) => {
  const nextNode = target.nextElementSibling;

  if (!errorMessage) return;
  target.classList.add("error-input-border");

  if (!nextNode || nextNode.classList.contains("toggle-password")) {
    const errorElement = document.createElement("span");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("error-message");
    target.after(errorElement);
    return;
  }
  if (nextNode.textContent !== errorMessage) {
    nextNode.textContent = errorMessage;
  }
};

const removeErrorMessage = (target) => {
  const nextNode = target.nextElementSibling;
  if (nextNode.classList.contains("error-message")) nextNode.remove();
  target.classList.remove("error-input-border");
};

const comparePassword = (target) => {
  const prevPassword = document.querySelector("#password");
  return prevPassword.value === target.value;
};

const changePasswordType = () => {
  document.querySelectorAll(".password-field").forEach((element) => {
    element.type = "password";
  });
};

const togglePassword = (target) => {
  target.classList.toggle("visible");
  if (target.classList.contains("visible")) {
    target.src = "./img/img_opend_eye.png";
    target.alt = "opend eye";
    target.parentNode.children[0].type = "text";
  } else {
    target.src = "./img/img_closed_eye.png";
    target.alt = "closed eye";
    target.parentNode.children[0].type = "password";
  }
};

const validCheck = {
  email: (target) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (target.value.length === 0) return "이메일을 입력해 주세요";
    if (!emailRegex.test(target.value)) return "잘못된 이메일입니다.";
    if (target.nextElementSibling) removeErrorMessage(target);
    return null;
  },
  nickname: (target) => {
    if (target.value.length === 0) return "닉네임을 입력해 주세요";
    if (target.nextElementSibling) removeErrorMessage(target);
    return null;
  },
  password: (target) => {
    if (target.value.length === 0) return "비밀번호를 입력해 주세요";
    if (target.value.length < 8) return "비밀번호를 8자리 이상 입력해 주세요";
    if (document.querySelector("#password-confirm"))
      validCheck["password-confirm"](
        document.querySelector("#password-confirm")
      );
    if (target.nextElementSibling) removeErrorMessage(target);
    return null;
  },
  "password-confirm": (target) => {
    if (target.value.length === 0) return "비밀번호를 입력해 주세요";
    if (target.value.length < 8) return "비밀번호를 8자리 이상 입력해 주세요";
    if (!comparePassword(target)) return "비밀번호가 일치하지 않습니다.";
    if (target.nextElementSibling) removeErrorMessage(target);
    return null;
  },
};

const focusoutHandler = ({ target }) => {
  if (validCheck[target.name]) {
    addErrorMessage(target, validCheck[target.name](target));
  }

  const result = Object.values(validCheck).map((validFunc) => {
    const element = document.querySelector(`#${validFunc.name}`);
    if (element === null) return null;
    return validFunc(element);
  });

  if (result.every((value) => value === null)) {
    const submitButton = document.querySelector(".submitButton");
    submitButton.disabled = false;
  }
};

const clickHandler = ({ target }) => {
  if (target.classList.contains("toggle-password")) togglePassword(target);
};

authForm.addEventListener("focusout", focusoutHandler);
authForm.addEventListener("click", clickHandler);
authForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    changePasswordType();
    authForm.removeEventListener("focusout", focusoutHandler);
    authForm.removeEventListener("click", clickHandler);
    authForm.submit();
  },
  { once: true }
);