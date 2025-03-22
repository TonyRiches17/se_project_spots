const showInputError = (formEl, inputElement, errMessage) => {
const errMessageEl = formEl.querySelector(`#${inputElement.id}-error`);
errMessageEl.textContent = errMessage;
inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formEl, inputElement,) => {
  const errMessageEl = formEl.querySelector(`#${inputElement.id}-error`);
  errMessageEl.textContent = "";
  inputElement.classList.remove("modal__input_type_error");
  };

const checkInputValidity = (formEl, inputElement) => {
if (!inputElement.validity.valid) {
  showInputError(formEl, inputElement, inputElement.validationMessage);
}
else {hideInputError(formEl, inputElement);}
};

const hasInvalidInput = (inputList) => {
return inputList.some((input) => {
  return !input.validity.valid;
})
};

const toggleButtonState = (inputList, buttonElement) => {
if (hasInvalidInput(inputList)) {
  buttonElement.disabled = true;
  buttonElement.classList.add("modal__submit-button_type_error");
}
else {
  buttonElement.disabled = false;
  buttonElement.classList.remove("modal__submit-button_type_error");
}
};

const setEventListeners = (formEl) => {
const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
const buttonElement = formEl.querySelectorAll(".modal__submit-button");

inputList.forEach((inputElement) => {
  inputElement.addEventListener("input", function () {
    checkInputValidity(formEl, inputElement);
    toggleButtonState(inputList, buttonElement);
  })
})
};

const enableValidation = () => {
const formList = document.querySelectorAll(".modal__form");
formList.forEach((formEl) => {
setEventListeners(formEl);
});
};

enableValidation();