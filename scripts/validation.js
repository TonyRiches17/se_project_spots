const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_type_error",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error"
}

const showInputError = (formEl, inputElement, errMessage, config) => {
const errMessageEl = formEl.querySelector(`#${inputElement.id}-error`);
errMessageEl.textContent = errMessage;
inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputElement, config) => {
  const errMessageEl = formEl.querySelector(`#${inputElement.id}-error`);
  errMessageEl.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);
  };

const checkInputValidity = (formEl, inputElement, config) => {
if (!inputElement.validity.valid) {
  showInputError(formEl, inputElement, inputElement.validationMessage, config);
}
else {hideInputError(formEl, inputElement, config);}
};

const hasInvalidInput = (inputList, config) => {
return inputList.some((input) => {
  return !input.validity.valid;
})
};

const toggleButtonState = (inputList, buttonElement, config) => {
if (hasInvalidInput(inputList)) {
 disableButton(buttonElement, config);
}
else {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
}
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
  })
};

const setEventListeners = (formEl, config) => {
const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
const buttonElement = formEl.querySelector(config.submitButtonSelector);

toggleButtonState(inputList, buttonElement, config);

inputList.forEach((inputElement) => {
  inputElement.addEventListener("input", function () {
    checkInputValidity(formEl, inputElement, config);
    toggleButtonState(inputList, buttonElement, config);
  })
})
};

const enableValidation = (config) => {
const formList = document.querySelectorAll(config.formSelector);
formList.forEach((formEl) => {
setEventListeners(formEl, config);
});
};

enableValidation(settings);
