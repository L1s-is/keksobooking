'use strict';

(function () {
  let adFormTitle = window.mapjs.adFormAnnoucement.querySelector("#title")
  let adFormPrice = window.mapjs.adFormAnnoucement.querySelector("#price")
  let adFormType = window.mapjs.adFormAnnoucement.querySelector("#type")
  const priceTypes = {
    palace: '10000',
    flat: '1000',
    house: '5000',
    bungalo: '100'
  }

  //валидация элементов формы "Заголовок" и "Цена"
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

  let submitButton = window.mapjs.adFormAnnoucement.querySelector(".ad-form__submit")

  //валидация элементов формы при клике на кнопку отправки формы
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

  window.mapjs.adFormAnnoucement.addEventListener("click", function () {
    if (!window.mapjs.addressInput.value) {
      window.mapjs.addressInput.value = window.mapjs.getAddressCoords()
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

  //меняет значение минимальной цены и плейсхолдера для разных типов жилья
  function changeValueMinPrice (adFormType, adFormPrice) {
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

  changeValueMinPrice(adFormType, adFormPrice)

  adFormType.addEventListener("input", function () {
    changeValueMinPrice(adFormType, adFormPrice)
    if (!adFormPrice.validity.valueMissing) {
      adFormPrice.checkValidity()
      errorValidHandler(adFormPrice)
    }
  })

  let adFormRoomNumber = window.mapjs.adFormAnnoucement.querySelector("#room_number")
  let adFormCapacity = window.mapjs.adFormAnnoucement.querySelector("#capacity")
  roomNumberChangeValueHandler(adFormRoomNumber, adFormCapacity)
  adFormRoomNumber.addEventListener("input", function () {
    roomNumberChangeValueHandler(adFormRoomNumber, adFormCapacity)
  })

  function hideCapacityOptions(options) {
    for (let i = 0; i < options.length; i++) {
      options[i].classList.add("hidden")
    }
  }

  function showCapacityOptions(option) {
    option.classList.remove("hidden")
  }

  //удаление неподходящих элементов поля "колличество гостей" (каждому гостю не менее, чем одна комната, выбор "Не для гостей" при колличестве комнат = 100)
  function roomNumberChangeValueHandler(adFormRoomNumber, adFormCapacity) {
    let capacityOptions = adFormCapacity.querySelectorAll("option")
    hideCapacityOptions(capacityOptions)
    switch (adFormRoomNumber.value) {
      case "100":
        showCapacityOptions(capacityOptions[3])
        capacityOptions[3].selected = true
        break
      case "1":
        showCapacityOptions(capacityOptions[2])
        capacityOptions[2].selected = true
        break
      case "2":
        showCapacityOptions(capacityOptions[1])
        showCapacityOptions(capacityOptions[2])
        capacityOptions[1].selected = true
        break
      case "3":
        for (let i = 0; i < capacityOptions.length - 1; i++) {
          showCapacityOptions(capacityOptions[i])
        }
        capacityOptions[0].selected = true
        break
      default:
        for (let i = 0; i < capacityOptions.length; i++) {
          showCapacityOptions(capacityOptions[i])
        }
        capacityOptions[0].selected = true
    }
  }

  let adFormTimeIn = window.mapjs.adFormAnnoucement.querySelector("#timein")
  let adFormTimeOut = window.mapjs.adFormAnnoucement.querySelector("#timeout")

  //синхронизирует значение полей время заезда и выезда
  function timeClickHandler(clickTime, changeTime) {
    changeTime.value = clickTime.value
  }

  adFormTimeIn.addEventListener("input", function () {
    timeClickHandler(adFormTimeIn, adFormTimeOut)
  })
  adFormTimeOut.addEventListener("input", function () {
    timeClickHandler(adFormTimeOut, adFormTimeIn)
  })

  //блокирует поля формы при успешной отправке данных на сервер (по ТЗ сайт возвращается в начальное положение без перезагрузки страницы)
  function blockFormElements(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].disabled = true
    }
  }

  //скрывает элементы с карты
  function hideMapPins(findCreateMapPins, mapCards) {
    let mapPinActive = window.mapjs.map.querySelector(".map__pin--active")
    for (let i = 0; i < findCreateMapPins.length; i++) {
      findCreateMapPins[i].classList.add("hidden")
      mapCards[i].classList.add("hidden")
    }
    if (mapPinActive) {
      mapPinActive.classList.remove("map__pin--active")
    }
  }

  function resetPageElements (response) {
    //сброс елементов карты
    resetMapElements()

    //сброс элементов формы
    resetFormElements()

    //сброс превью фото и аватара
    resetAdPhotos()

    window.mapjs.adFormAnnoucement.reset()
  }

  function resetMapElements () {
    window.mapjs.map.classList.add("map--faded")
    window.mapjs.findCreateMapPins = window.mapjs.map.querySelectorAll(".map__pin:not(.map__pin--main)")
    window.mapjs.mapCards = window.mapjs.map.querySelectorAll(".map__card")
    hideMapPins(window.mapjs.findCreateMapPins, window.mapjs.mapCards)
    window.mapjs.mapPinMain.style.left = window.mapjs.mapPinMain.closest("div").offsetWidth / 2 - (window.mapjs.mainPinWidth / 2) + "px"
    window.mapjs.mapPinMain.style.top = "375px"
  }

  function resetFormElements () {
    window.mapjs.adFormAnnoucement.classList.add('ad-form--disabled')
    blockFormElements(window.mapjs.adFormAnnoucement.elements)
  }

  function resetAdPhotos () {
    window.file.prewiewUserAvatar.src = window.file.defaultUserAvatar
    window.file.k = 0
    let prewiewPhotos = document.querySelectorAll(".ad-form__photo:not(.ad-form__photo--add)")
    if (prewiewPhotos.length) {
      window.mapjs.removeFragment(prewiewPhotos)
    }
  }

  let sendDataURL = "https://24.javascript.pages.academy/keksobooking"
  window.mapjs.adFormAnnoucement.addEventListener("submit", function (evt) {
    window.backend.upLoadHandler(sendDataURL, new FormData(window.mapjs.adFormAnnoucement), resetPageElements)
    evt.preventDefault()
  })

  window.mapjs.adFormAnnoucement.addEventListener("reset", resetAdPhotos)
})()

