'use strict';

let map = document.querySelector(".map")
let template = document.querySelector("template")
let newTemplate = template.content.querySelector('.map__card');
let mapCard = template.querySelector(".map__card")
let mapCardPopup = map.querySelector(".map__card")
let mapPin = template.content.querySelector(".map__pin")
let findCreateMapPins
let mapPinMain = document.querySelector(".map__pin--main")
let mapFilters = document.querySelector(".map__filters")
let mapFiltersSelects = mapFilters.querySelectorAll("select")
let mapFiltersFieldset = mapFilters.querySelectorAll("fieldset")
let mapFeatures = document.querySelector(".map__features")
let listOfPins = document.querySelector(".map__pins")
let adFormAnnoucement = document.querySelector(".ad-form")
let adFormFieldsets = adFormAnnoucement.querySelectorAll("fieldset")
let addressInput = adFormAnnoucement.querySelector("#address")
let adFormTitle = adFormAnnoucement.querySelector("#title")
let adFormPrice = adFormAnnoucement.querySelector("#price")
let adFormType = adFormAnnoucement.querySelector("#type")
let mapFiltersContainer = map.querySelector(".map__filters-container")
const pinWidth = 50
const pinHeight = 70
const amountObject = 8
const listOfAvatars = getPathAvatar()
const listOfTitles = ["Большая уютная квартира", "Маленькая неуютная квартира",
  "Огромный прекрасный дворец", "Маленький ужасный дворец",
  "Красивый гостевой домик", "Некрасивый негостеприимный домик",
  "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"]
const listOfTypes = ['palace', 'flat', 'house', 'bungalo']
const listCheckinsCheckouts = ["12:00", "13:00", "14:00"]
const listOfFeatures = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"]
const listOfPhotos = ["https://o0.github.io/assets/images/tokyo/hotel1.jpg", "https://o0.github.io/assets/images/tokyo/hotel2.jpg", "https://o0.github.io/assets/images/tokyo/hotel3.jpg"]
let listObjects = createArrayOfObjects(listOfAvatars, listOfTitles, listOfTypes, listCheckinsCheckouts, listOfFeatures, listOfPhotos)
const valueTypes = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
}
const priceTypes = {
  palace: '10000',
  flat: '1000',
  house: '5000',
  bungalo: '100'
}

function getRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber(num) {
  return Math.floor(Math.random() * num);
}

function getRandomIntegerArray(arr) {
  let endNumber = getRandomIntegerInRange(1, arr.length - 1)
  let startNumber = getRandomIntegerInRange(0, (endNumber - 1))

  while (startNumber >= endNumber) {
    endNumber = getRandomIntegerInRange(1, arr.length - 1)
  }
  return arr.slice(startNumber, endNumber)
}

function getPathAvatar() {
  let arr = []
  for (let k = 0; k < amountObject; k++) {
    arr[k] = "img/avatars/user0" + (k + 1) + ".png"
  }
  return arr
}

function createArrayOfObjects(avatars, titles, types, times, features, photos) {
  let arr = []
  for (let k = 0; k < amountObject; k++) {
    let valueX = getRandomIntegerInRange(100, map.offsetWidth)
    let valueY = getRandomIntegerInRange(190, 630)
    let elementOfArr = {
      "author": {
        "avatar": avatars[k]
      },

      "offer": {
        "title": titles[k],
        "address": valueX + ", " + valueY,
        "price": getRandomIntegerInRange(1000, 1000000),
        "type": types[getRandomNumber(types.length)],
        "rooms": getRandomIntegerInRange(1, 5),
        "guests": getRandomIntegerInRange(1, 12),
        "checkin": times[getRandomNumber(times.length)],
        "checkout": times[getRandomNumber(times.length)],
        "features": getRandomIntegerArray(features),
        "description": "Уютное жилье в самом центре Токио",
        "photos": photos[getRandomNumber(photos.length)]
      },

      "location": {
        "x": valueX,
        "y": valueY,
      }
    }
    arr[k] = elementOfArr
  }
  console.log(arr)
  return arr
}

function createMapPin(element) {
  let newPin = mapPin.cloneNode(true)
  let newPinImg = newPin.querySelector("img")
  newPin.style.left = element.location.x - pinWidth / 2 + "px"
  newPin.style.top = element.location.y - pinHeight + "px"
  newPinImg.src = element.author.avatar
  newPinImg.alt = element.offer.title
  console.log(newPin)
  return newPin
}

function createFragment(arr) {
  let fragment = document.createDocumentFragment()
  for (let i = 0; i < arr.length; i++) {
    /*let pinElement = createMapPin(arr[i])*/
    fragment.appendChild(createMapPin(arr[i]))
  }
  listOfPins.appendChild(fragment)
}

function getAddressFormAnnoucement() {
  let coordinats = mapPinMain.getBoundingClientRect()
  let coordinatX = Math.round(coordinats.left - pinWidth / 2)
  let coordinatY = Math.round(coordinats.top + window.pageYOffset - pinHeight)
  let addressInputValue = coordinatX + ", " + coordinatY
  return addressInputValue
}

function formAnnoucementActiveHandler() {
  adFormAnnoucement.classList.remove('ad-form--disabled')
}

function formElementActiveHandler(disabledArr) {
  for (let i = 0; i < disabledArr.length; i++) {
    disabledArr[i].disabled = false
  }
}

function createFeatures(arr) {
  let fragment = document.createDocumentFragment()
  for (let i = 0; i < arr.offer.features.length; i++) {
    let features = document.createElement("li")
    features.className = "popup__feature popup__feature--" + arr.offer.features[i]
    fragment.appendChild(features)
  }
  return fragment
}

function createAnnouncement(element) {
  let newAnnouncement = newTemplate.cloneNode(true)
  newAnnouncement.querySelector(".popup__avatar").src = element.author.avatar
  newAnnouncement.querySelector(".popup__title").textContent = element.offer.title
  newAnnouncement.querySelector(".popup__text--address").textContent = element.offer.address
  newAnnouncement.querySelector(".popup__text--price").textContent = element.offer.price + " ₽/ночь"
  newAnnouncement.querySelector(".popup__type").textContent = valueTypes[element.offer.type]
  newAnnouncement.querySelector(".popup__text--capacity").textContent = element.offer.rooms + " комнаты для " + element.offer.guests + " гостей"
  newAnnouncement.querySelector(".popup__text--time").textContent = "Заезд после " + element.offer.checkin + ", выезд до " + element.offer.checkout
  newAnnouncement.querySelector(".popup__features").textContent = ""
  let features = createFeatures(element)
  newAnnouncement.querySelector(".popup__features").appendChild(features)
  newAnnouncement.querySelector(".popup__description").textContent = element.offer.description
  newAnnouncement.querySelector(".popup__photo").src = element.offer.photos
  newAnnouncement.classList.add("visually-hidden")
  map.insertBefore(newAnnouncement, mapFiltersContainer)
  return newAnnouncement
}

function createMapPinAnnoucements() {
  for (let i = 0; i < listObjects.length; i++) {
    createAnnouncement(listObjects[i])
  }
}

function PopupActiveHandler(annoucement, mapPin) {
  annoucement.classList.remove("visually-hidden")
  mapPin.classList.add("map__pin--active")
}

function PopupInactiveHandler(annoucement, mapPin) {
  annoucement.classList.add("visually-hidden")
  mapPin.classList.remove("map__pin--active")
}

function mapPinClickHandler(mapCards) {
  for (let i = 1; i < findCreateMapPins.length; i++) {
    findCreateMapPins[i].addEventListener("click", function () {
      for (let j = 1; j < findCreateMapPins.length; j++) {
        PopupInactiveHandler(mapCards[j - 1], findCreateMapPins[j])
      }
      PopupActiveHandler(mapCards[i - 1], findCreateMapPins[i])
    })
    let popupClose = mapCards[i - 1].querySelector(".popup__close")
    popupClose.addEventListener("click", function () {
      PopupInactiveHandler(mapCards[i - 1], findCreateMapPins[i])
    })
    window.addEventListener("keydown", function (evt) {
      if (evt.keyCode === 27) {
        PopupInactiveHandler(mapCards[i - 1], findCreateMapPins[i])
      }
    })
  }
}

let k = true

function mapActiveHandler() {
  addressInput.value = getAddressFormAnnoucement()
  if (k) {
    map.classList.remove("map--faded")
    formAnnoucementActiveHandler()
    formElementActiveHandler(adFormFieldsets)
    formElementActiveHandler(mapFiltersSelects)
    formElementActiveHandler(mapFiltersFieldset)
    createFragment(listObjects)
    findCreateMapPins = map.querySelectorAll(".map__pin")
    console.log(findCreateMapPins)
    createMapPinAnnoucements()
    let mapCards = map.querySelectorAll(".map__card")
    mapPinClickHandler(mapCards)
    k = false
  }
}

mapPinMain.addEventListener('mouseup', mapActiveHandler)

function errorValidHandler(formElement) {
  formElement.classList.add("ad-form__element--error")
  if (formElement.validity.valueMissing) {
    formElement.setCustomValidity("Пожалуйста, заполните поле")
  } else if (formElement.validity.tooShort) {
    formElement.setCustomValidity("Поле может содержать не менее " + formElement.minLength + " символов. Введено " + formElement.value.length + " символов.")
  } else if (formElement.validity.tooLong) {
    formElement.setCustomValidity("Поле может содержать не более " + formElement.maxLength + " символов. Введено " + formElement.value.length + " символов.")
  } else if (formElement.validity.rangeUnderflow) {
    formElement.setCustomValidity("Для выбранного типа жилья минимальная сумма оплаты за ночь не может быть менее " + formElement.min + " рублей.")
  } else if (formElement.validity.rangeOverflow) {
    formElement.setCustomValidity("Максимальная сумма оплаты за ночь не может быть выше " + formElement.max + " рублей.")
  } else {
    formElement.setCustomValidity("")
    formElement.classList.remove("ad-form__element--error")
  }
}

let submitButton = adFormAnnoucement.querySelector(".ad-form__submit")

function submitButtonClickHandler(formElement) {
  formElement.addEventListener("input", function () {
    formElement.checkValidity()
  })
  formElement.addEventListener("invalid", function () {
    errorValidHandler(formElement)
  })
}

submitButton.addEventListener("click", function () {
  submitButtonClickHandler(adFormTitle)
  submitButtonClickHandler(adFormPrice)
})

function formElementChangeHandler(formElement) {
  formElement.setCustomValidity("")
  formElement.checkValidity()
  formElement.addEventListener("input", function () {
    formElement.checkValidity()
  })
}

formElementValidHandler(adFormTitle)
formElementValidHandler(adFormPrice)

function formElementValidHandler(formElement) {
  formElement.addEventListener("change", function () {
    formElementChangeHandler(formElement)
  })
  formElement.addEventListener("valid", function () {
    formElement.setCustomValidity("")
    formElement.classList.remove("ad-form__element--error")
    formElement.checkValidity()
  })
  formElement.addEventListener("invalid", function () {
    errorValidHandler(formElement)
  })
}

function minPriceValueHandler(adFormType, adFormPrice) {
  switch (adFormType.value) {
    case "bungalo":
      adFormPrice.min = priceTypes.bungalo
      adFormPrice.placeholder = priceTypes.bungalo
      break
    case "flat":
      adFormPrice.min = priceTypes.flat
      adFormPrice.placeholder = priceTypes.flat
      break
    case "house":
      adFormPrice.min = priceTypes.house
      adFormPrice.placeholder = priceTypes.house
      break
    case "palace":
      adFormPrice.min = priceTypes.palace
      adFormPrice.placeholder = priceTypes.palace
      break
    default:
      adFormPrice.min = "0"
      adFormPrice.placeholder = "0"
  }
}

minPriceValueHandler(adFormType, adFormPrice)

adFormType.addEventListener("input", function () {
  minPriceValueHandler(adFormType, adFormPrice)
})

let adFormRoomNumber = adFormAnnoucement.querySelector("#room_number")
let adFormCapacity = adFormAnnoucement.querySelector("#capacity")
roomNumberChangeValueHandler(adFormRoomNumber, adFormCapacity)
adFormRoomNumber.addEventListener("input", function () {
  roomNumberChangeValueHandler(adFormRoomNumber, adFormCapacity)
})

function capacityOptionsHiddenHandler(options) {
  for (let i = 0; i < options.length; i++) {
    options[i].classList.add("hidden")
  }
}

function capacityOptionsVisibleHandler(option) {
  option.classList.remove("hidden")
}

function roomNumberChangeValueHandler(adFormRoomNumber, adFormCapacity) {
  let capacityOptions = adFormCapacity.querySelectorAll("option")
  capacityOptionsHiddenHandler(capacityOptions)
  switch (adFormRoomNumber.value) {
    case "100":
      capacityOptionsVisibleHandler(capacityOptions[3])
      capacityOptions[3].selected = true
      break
    case "1":
      capacityOptionsVisibleHandler(capacityOptions[2])
      capacityOptions[2].selected = true
      break
    case "2":
      capacityOptionsVisibleHandler(capacityOptions[1])
      capacityOptionsVisibleHandler(capacityOptions[2])
      capacityOptions[1].selected = true
      break
    case "3":
      for (let i = 0; i < capacityOptions.length - 1; i++) {
        capacityOptionsVisibleHandler(capacityOptions[i])
      }
      capacityOptions[0].selected = true
      break
    default:
      for (let i = 0; i < capacityOptions.length; i++) {
        capacityOptionsVisibleHandler(capacityOptions[i])
      }
      capacityOptions[0].selected = true
  }
}

let adFormTimeIn = adFormAnnoucement.querySelector("#timein")
let adFormTimeOut = adFormAnnoucement.querySelector("#timeout")

function timeClickHandler(clickTime, changeTime) {
  changeTime.value = clickTime.value
}

adFormTimeIn.addEventListener("input", function () {
  timeClickHandler(adFormTimeIn, adFormTimeOut)
})
adFormTimeOut.addEventListener("input", function () {
  timeClickHandler(adFormTimeOut, adFormTimeIn)
})
