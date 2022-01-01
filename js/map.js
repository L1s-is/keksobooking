'use strict';

(function () {
  window.map = document.querySelector(".map")
  let template = document.querySelector("template")
  let newTemplate = template.content.querySelector('.map__card');
  let mapPin = template.content.querySelector(".map__pin")
  let findCreateMapPins
  window.mapPinMain = document.querySelector(".map__pin--main")
  let mapFilters = document.querySelector(".map__filters")
  let listOfPins = document.querySelector(".map__pins")
  window.adFormAnnoucement = document.querySelector(".ad-form")
  let adFormFieldsets = adFormAnnoucement.querySelectorAll("fieldset")
  window.addressInput = adFormAnnoucement.querySelector("#address")
  let mapFiltersContainer = map.querySelector(".map__filters-container")
  const pinWidth = 50
  const pinHeight = 70
  const valueTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalow: 'Бунгало'
  }

  function getRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createMapPin(element) {
    let newPin = mapPin.cloneNode(true)
    let newPinImg = newPin.querySelector("img")
    newPin.style.left = getRandomIntegerInRange(pinWidth, map.offsetWidth-pinWidth) - pinWidth / 2 + "px"
    newPin.style.top = getRandomIntegerInRange(190, 700) - pinHeight + "px"
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

  window.mainPinWidth = 64
  const mainPinHeight = 80
  window.getAddressFormAnnoucement = function (){
    let coordinatX = Math.round(mapPinMain.offsetLeft + mainPinWidth / 2)
    let coordinatY = Math.round(mapPinMain.offsetTop + mainPinHeight)
    let addressInputValue = coordinatX + ", " + coordinatY
    return addressInputValue
  }

  function formAnnoucementActiveHandler() {
      adFormAnnoucement.classList.remove('ad-form--disabled')
  }

  function formElementActiveHandler(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].disabled = false
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
    if (element.offer.features){
      let features = createFeatures(element)
    newAnnouncement.querySelector(".popup__features").appendChild(features)
    }

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

  addressInput.value = window.getAddressFormAnnoucement()

  function mapActiveHandler() {
    addressInput.value = window.getAddressFormAnnoucement()
    if (map.className === "map map--faded") {
      map.classList.remove("map--faded")
      formAnnoucementActiveHandler()
      formElementActiveHandler(adFormAnnoucement.elements)
      formElementActiveHandler(mapFilters.elements)
      createFragment(listObjects)
      findCreateMapPins = map.querySelectorAll(".map__pin")
      console.log(findCreateMapPins)
      createMapPinAnnoucements()
      let mapCards = map.querySelectorAll(".map__card")
      mapPinClickHandler(mapCards)
    }
  }

  mapPinMain.addEventListener('mousedown', function (evt) {
    let startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    }

    function mouseMoveHandler(moveEvt) {
      let shiftCoordinates = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      }
      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      }
      if (mapPinMain.offsetLeft < 0) {
        mapPinMain.style.left = 1 + "px"
      } else if (mapPinMain.offsetTop < 90) {
        mapPinMain.style.top = 91 + "px"
      } else if (mapPinMain.offsetLeft + mainPinWidth > mapPinMain.parentElement.clientWidth) {
        mapPinMain.style.left = (mapPinMain.parentElement.clientWidth - mainPinWidth - 1) + "px"
      } else if (mapPinMain.offsetTop + mainPinHeight > mapPinMain.parentElement.clientHeight) {
        mapPinMain.style.top = (mapPinMain.parentElement.clientHeight - mainPinHeight - 1) + "px"
      } else {
        mapPinMain.style.left = (mapPinMain.offsetLeft - shiftCoordinates.x) + "px"
        mapPinMain.style.top = (mapPinMain.offsetTop - shiftCoordinates.y) + "px"
      }
    }

    document.addEventListener('mousemove', mouseMoveHandler)

    function mouseUpHandler(upEvt) {
      mapActiveHandler()
      document.removeEventListener("mousemove", mouseMoveHandler)
      document.removeEventListener("mouseup", mouseUpHandler)
    }

    document.addEventListener("mouseup", mouseUpHandler)
  })
})()


