'use strict';

(function () {
  let adFormTitle = adFormAnnoucement.querySelector("#title")
  let adFormPrice = adFormAnnoucement.querySelector("#price")
  let adFormType = adFormAnnoucement.querySelector("#type")
  const priceTypes = {
    palace: '10000',
    flat: '1000',
    house: '5000',
    bungalo: '100'
  }

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

  adFormAnnoucement.addEventListener("click", function () {
    if (!addressInput.value) {
      addressInput.value = getAddressFormAnnoucement()
    }
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
    if (!adFormPrice.validity.valueMissing) {
      adFormPrice.checkValidity()
      errorValidHandler(adFormPrice)
    }
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

  function formElementActiveHandler(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].disabled = true
    }
  }

  function mapPinHiddenHandler(findCreateMapPins, mapCards) {
    let mapPinActive = map.querySelector(".map__pin--active")
    for (let i = 1; i < findCreateMapPins.length; i++) {
      findCreateMapPins[i].classList.add("hidden")
      mapCards[i - 1].classList.add("hidden")
    }
    if (mapPinActive) {
      mapPinActive.classList.remove("map__pin--active")
    }
  }

  let sendDataURL = "https://24.javascript.pages.academy/keksobooking"
  adFormAnnoucement.addEventListener("submit", function (evt) {
    upLoadHandler(sendDataURL, new FormData(adFormAnnoucement), function (response) {
      map.classList.add("map--faded")
      mapPinHiddenHandler(findCreateMapPins, mapCards)
      adFormAnnoucement.classList.add('ad-form--disabled')
      formElementActiveHandler(adFormAnnoucement.elements)
      mapPinMain.style.left = mapPinMain.closest("div").offsetWidth / 2 - (mainPinWidth / 2) + "px"
      mapPinMain.style.top = "375px"
      adFormAnnoucement.reset()
    })
    evt.preventDefault()
  })
})()

