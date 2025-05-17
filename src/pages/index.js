import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "b9d2e9cf-c178-4a7d-bd39-cc7989bda50e",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      profileName.textContent = user.name;
      profileDescription.textContent = user.about;
      profileAvatar.src = user.avatar;
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardNameElement.textContent = data.name;
  cardImageElement.alt = data.name;
  cardImageElement.src = data.link;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", (evt) =>
    handleToggleLike(evt, data._id)
  );

  cardDeleteButton.addEventListener("click", () =>
    handleRemoveCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalImageElement.alt = data.name;
    previewModalImageCaption.textContent = data.name;
  });

  return cardElement;
}

const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-modal");
const editProfileModalCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editAvatarButton = document.querySelector(".profile__avatar-button");
const addCardButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-card-modal");
const addCardCloseButton = addCardModal.querySelector(".modal__close-button");
const addCardSubmitButton = addCardModal.querySelector(".modal__submit-button");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalImageCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const deleteModalPrompt = document.querySelector("#delete-modal");
const deleteModalCloseButton = deleteModalPrompt.querySelector(
  ".modal__close-button"
);
const deleteModalCancelButton = deleteModalPrompt.querySelector(".modal__submit-button_cancel")

let selectedCard;
let selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", closeModalOverlay);
  document.addEventListener("keydown", handleEscape);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

editAvatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", closeModalOverlay);
  document.removeEventListener("keydown", handleEscape);
}

editProfileModalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

addCardCloseButton.addEventListener("click", () => {
  closeModal(addCardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModalPrompt);
});

// Submit content
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const profileDescription = document.querySelector(".profile__description");
const addCardModalLinkInput = addCardModal.querySelector(
  "#add-card-link-input"
);
const addCardModalNameInput = addCardModal.querySelector(
  "#add-card-name-input"
);
const avatarModalInput = avatarModal.querySelector("#profile-avatar-input");

// Submit button functionality
const editModalSaveButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
const editFormElement = editProfileModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const deleteModalForm = deleteModalPrompt.querySelector(".modal__form");

function handleToggleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .toggleLike(id, isLiked)
    .then(() => {
      if (isLiked) {
        evt.target.classList.toggle("card__like-button_liked");
      } else {
        evt.target.classList.toggle("card__like-button_liked");
      }
    })
    .catch(console.error);
}

function handleRemoveSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true, "Deleting...", "Delete");
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModalPrompt);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(evt.submitter, false, "Deleting...", "Delete");
    });
}

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModalPrompt);
})

function handleRemoveCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModalPrompt);
}

deleteModalForm.addEventListener("submit", handleRemoveSubmit);

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(evt.submitter, false);
    });
}

editFormElement.addEventListener("submit", handleEditFormSubmit);

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true);
  api
    .addCard({
      link: addCardModalLinkInput.value,
      name: addCardModalNameInput.value,
    })
    .then((data) => {
      const inputValues = {
        name: data.name,
        link: data.link,
      };
      const cardElement = getCardElement(inputValues);
      cardsList.prepend(cardElement);
      addCardFormElement.reset();
      disableButton(addCardSubmitButton, settings);
      closeModal(addCardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(evt.submitter, false);
    });
}

addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true);
  api
    .editAvatarInfo({ avatar: avatarModalInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      profileAvatar.alt = `Avatar picture for ${data.name}'s profile`;
      avatarFormElement.reset();
      disableButton(evt.submitter, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(evt.submitter, false);
    });
}

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

function closeModalOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_opened");
    closeModal(openedPopup);
  }
}

enableValidation(settings);
