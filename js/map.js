'use strict';

(function () {
  let findCreateMapPins
  let mapCards
  let map = document.querySelector(".map")
  let template = document.querySelector("template")
  let newTemplate = template.content.querySelector('.map__card');
  let mapPin = template.content.querySelector(".map__pin")
  let mapPinMain = document.querySelector(".map__pin--main")
  let mapFilters = document.querySelector(".map__filters")
  let listOfPins = document.querySelector(".map__pins")
  let adFormAnnoucement = document.querySelector(".ad-form")
  let adFormFieldsets = adFormAnnoucement.querySelectorAll("fieldset")
  let addressInput = adFormAnnoucement.querySelector("#address")
  let mapFiltersContainer = map.querySelector(".map__filters-container")
  const pinWidth = 50
  const pinHeight = 70
  const valueTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalow: 'Бунгало'
  }

  //генерирует случайное число из диапазона
  function getRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //создает новые метки объявлений со случайными координатами (со случайными, т.к. с сервера некорректно подтягиваются данные)
  function createMapPin(element) {
    let newPin = mapPin.cloneNode(true)
    let newPinImg = newPin.querySelector("img")
    newPin.style.left = getRandomIntegerInRange(pinWidth, map.offsetWidth - pinWidth) - pinWidth / 2 + "px"
    newPin.style.top = getRandomIntegerInRange(190, 700) - pinHeight + "px"
    newPinImg.src = element.author.avatar
    newPinImg.alt = element.offer.title
    return newPin
  }

  //добавляет метки объявлений на карту
  function createFragment(arr) {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < arr.length; i++) {
      /*let pinElement = createMapPin(arr[i])*/
      fragment.appendChild(createMapPin(arr[i]))
    }
    listOfPins.appendChild(fragment)
  }

  //удаляет метки/попапы объявлений с карты
  function removeFragment(arr) {
    let parentNode = arr[0].parentNode
    for (let i = 0; i < arr.length; i++) {
      parentNode.removeChild(arr[i])
    }
  }

  const mainPinWidth = 64
  const mainPinHeight = 80
  //высчитывает и записывает в новую метку на карте координаты ее указателя(где нужно отобразить метку)
  function getAddressCoords () { //getAddressCoords
    let coordinatX = Math.round(mapPinMain.offsetLeft + mainPinWidth / 2)
    let coordinatY = Math.round(mapPinMain.offsetTop + mainPinHeight)
    let addressInputValue = coordinatX + ", " + coordinatY
    return addressInputValue
  }

  //убирает визуальную блокировку формы
  function formAnnoucementActiveHandler() {
    adFormAnnoucement.classList.remove('ad-form--disabled')
  }

  //убирает с элементов формы атрибут disabled
  function unblockFormElements(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].disabled = false
    }
  }

  //добавляет список преимуществ в новый попап
  function createFeatures(arr) {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < arr.offer.features.length; i++) {
      let features = document.createElement("li")
      features.className = "popup__feature popup__feature--" + arr.offer.features[i]
      fragment.appendChild(features)
    }
    return fragment
  }

  //добавляет список фото недвижимости в новый попап
  function createPhotos(arr) {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < arr.offer.photos.length; i++) {
      let photos = newTemplate.querySelector(".popup__photo").cloneNode(true)
      photos.src = arr.offer.photos[i]
      fragment.appendChild(photos)
    }
    return fragment
  }

  //создает новый попап объявления о сдаче
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
    if (element.offer.features) {
      let features = createFeatures(element)
      newAnnouncement.querySelector(".popup__features").appendChild(features)
    }
    newAnnouncement.querySelector(".popup__description").textContent = element.offer.description
    newAnnouncement.querySelector(".popup__photos").removeChild(newAnnouncement.querySelector(".popup__photo"))
    if (element.offer.photos) {
      let photos = createPhotos(element)
      newAnnouncement.querySelector(".popup__photos").appendChild(photos)
    }
    newAnnouncement.classList.add("hidden")
    map.insertBefore(newAnnouncement, mapFiltersContainer)
    return newAnnouncement
  }

  //создает попапы объявлений о сдаче при клике по соответствующей метке на карте
  function createMapPinAnnoucements(arr) {
    for (let i = 0; i < arr.length; i++) {
      createAnnouncement(arr[i])
    }
  }

  //показывает объявление, соответствующее нажатой метке на карте + добавляет ей выделяющий класс
  function PopupActiveHandler(annoucement, mapPin) {
    annoucement.classList.remove("hidden")
    mapPin.classList.add("map__pin--active")
  }


  //скрывает объявление, удаляет выделяющий метку класс
  function PopupInactiveHandler(annoucement, mapPin) {
    annoucement.classList.add("hidden")
    mapPin.classList.remove("map__pin--active")
  }

  //действия при нажатии метки: открытие соответствующего попапа и закрытие остальных
  function mapPinClickHandler(mapCards, findCreateMapPins) {
    for (let i = 0; i < findCreateMapPins.length; i++) {
      findCreateMapPins[i].addEventListener("click", function () {
        for (let j = 0; j < findCreateMapPins.length; j++) {
          PopupInactiveHandler(mapCards[j], findCreateMapPins[j])
        }
        PopupActiveHandler(mapCards[i], findCreateMapPins[i])
      })

      let popupClose = mapCards[i].querySelector(".popup__close")
      popupClose.addEventListener("click", function () {
        PopupInactiveHandler(mapCards[i], findCreateMapPins[i])
      })

      window.addEventListener("keydown", function (evt){
        if (evt.keyCode === 27) {
          PopupInactiveHandler(mapCards[i], findCreateMapPins[i])
        }
      })
    }
  }

  //вновь отображает метки на карте
  function mapPinVisibleHandler(findCreateMapPins) {
    for (let i = 1; i < findCreateMapPins.length; i++) {
      findCreateMapPins[i].classList.remove("hidden")
    }
  }

  //записываем значение текущих координат метки в поле "Адрес" формы при загрузке страницы
  addressInput.value = getAddressCoords()
  let clickPin = false
  let loadData = false

  function unblockPageElements() {
    //убираем класс визуальной "блокировки" карты
    map.classList.remove("map--faded")

    //убираем класс визуальной "блокировки" формы
    formAnnoucementActiveHandler()

    //снимаем значение disabled с элементов формы
    unblockFormElements(adFormAnnoucement.elements)
    unblockFormElements(mapFilters.elements)
  }

  function hideMapElements(arr){
    for (let i = 1; i < arr.length; i++) {
      arr[i].classList.add("hidden")
    }
  }

  function changeMapPins () {
    // Фильтрует объявления и создает массив отфильтрованных объявлений
    let filterListObjects = window.filterPins(window.backend.listServerData);

    // Удаляет элементы 'Метка объявления', если они существуют
    if (findCreateMapPins.length){
      removeFragment(findCreateMapPins)
      removeFragment(mapCards)
    }

    // Создает массив элементов 'Метка объявления' на основе массива отфильтрованных объявлений
    createMapElements(filterListObjects)
  }

  function createMapElements(arr) {
    //создает метки объявлений на карте
    createFragment(arr)

    //ищет созданные метки объявлений, кроме перетаскивающейся метки
    findCreateMapPins = map.querySelectorAll(".map__pin:not(.map__pin--main)")

    //создает попапы объявлений о сдаче при клике по соответствующей метке на карте
    createMapPinAnnoucements(arr)

    //ищет созданные попапы объявлений о сдаче
    mapCards = map.querySelectorAll(".map__card")

    //запускает обработчик событий при клике на метку карты для отрисовки соответствующего попапа объявления о сдаче
    mapPinClickHandler(mapCards, findCreateMapPins)
  }

  function mapActiveHandler() {
    //записывает координаты указателя метки в поле формы 'Адрес'
    addressInput.value = getAddressCoords()

    //проверка на подгрузку данных с сервера
    //проверка на первое перетаскивание метки
    //проверка на блокировку карты(были отправлены данные по ajax)
    if (!window.backend.listServerData) {
      window.backend.errorHandler("Упс! Данные еще не загружены")
    } else if (!clickPin) {
      //разблокирует элементы страницы
      unblockPageElements()

      //делает главную кнопку поверх остальных меток
      mapPinMain.style.zIndex = 2

      //создает метки объявлений на карте по данным с сервера
      createMapElements(window.backend.listServerData)

      //изменяем значение, чтобы понимать, что первое перемещение метки произошло
      clickPin = true
    } else if (map.className === "map map--faded") {
      //разблокирует элементы страницы после отправки формы по ajax
      unblockPageElements()

      //покажет скрытые при отправке формы по ajax метки на карте
      mapPinVisibleHandler(findCreateMapPins)
    }
  }

  mapPinMain.addEventListener("pointerdown", function (evt) {
    evt.preventDefault()
    //проверка, что данные не загружены
    if (!loadData) {
      window.backend.loadHandler()
      loadData = true
    }

    let startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    }

    function mouseMoveHandler(moveEvt) {
      //высчитываем новое положение метки
      let shiftCoordinates = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      }
      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      }
      //условие, чтобы метка не выходила за пределы карты
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

    document.addEventListener("pointermove", mouseMoveHandler)

    function mouseUpHandler(upEvt) {
      upEvt.preventDefault()
      //делаем элементы страницы активными, если это не так
      mapActiveHandler()
      document.removeEventListener("pointermove", mouseMoveHandler)
      document.removeEventListener("pointerup", mouseUpHandler)
    }

    document.addEventListener("pointerup", mouseUpHandler)
  })

  window.mapjs = {
    map: map,
    mapPinMain: mapPinMain,
    adFormAnnoucement: adFormAnnoucement,
    addressInput: addressInput,
    mainPinWidth: mainPinWidth,
    findCreateMapPins: findCreateMapPins,
    mapCards: mapCards,
    changeMapPins: changeMapPins,
    getAddressCoords: getAddressCoords,
    removeFragment: removeFragment
  }
})()
