"use strict";

(function () {
  let listServerData

  window.backend = {
    loadHandler: loadHandler,
    upLoadHandler: upLoadHandler,
    errorHandler: errorHandler,
    listServerData: listServerData,
    showSuccessMessage: showSuccessMessage
  }

  let getDataURL = "https://24.javascript.pages.academy/keksobooking/data"

  function loadHandler(url = getDataURL) {
    let xhr = new XMLHttpRequest()
    xhr.responseType = "json"
    xhr.addEventListener("load", function () {
      switch (xhr.status) {
        case 200:
          successHandler(xhr.response)
          break
        case 400:
          errorHandler("Неверный запрос")
          break
        case 401:
          errorHandler("Пользователь не авторизован")
          break
        case 404:
          errorHandler("Ошибка загрузки данных с сервера")
          break
        default:
          errorHandler("Статус ответа: " + xhr.status + " " + xhr.statusText)
          break
      }
    })
    xhr.addEventListener("error", function () {
      errorHandler("Произошла ошибка соединения")
    })
    xhr.addEventListener("timeout", function () {
      errorHandler("Запрос не успел выполниться за " + xhr.timeout / 100 + "секунд")
    })
    xhr.timeout = 10000
    xhr.open("GET", url)
    xhr.send()
  }

  let errorMessage = document.querySelector(".error")

  function errorHandler(message) {
    errorMessage.querySelector(".error__message").textContent = message
    errorMessage.classList.remove("hidden")
    errorMessage.querySelector("button").addEventListener("click", hideErrorMessage)
  }

  function successHandler(data) {
    window.backend.listServerData = data
  }

  let successMessage = document.querySelector(".success")

  function showSuccessMessage() {
    successMessage.classList.remove("hidden")
    let successMessageBtn = document.querySelector(".button--success")
    successMessageBtn.addEventListener("click", hideSuccessMessage)
    setTimeout(hideSuccessMessage, 5000)
  }

  function hideSuccessMessage() {
    successMessage.classList.add("hidden")
  }

  function hideErrorMessage() {
    errorMessage.classList.add("hidden")
  }

  function upLoadHandler(url, data, successHandler) {
    let xhr = new XMLHttpRequest()
    xhr.responseType = "json"
    xhr.addEventListener("load", function () {
      switch (xhr.status) {
        case 200:
          successHandler(xhr.response)
          showSuccessMessage()
          break
        default:
          errorHandler("Данные не отправлены, попробуйте позднее")
          setTimeout(hideErrorMessage, 3000)
          break
      }
    })

    let i = 0
    for (let key of window.file.formDataPhotos.keys()) {
      data.append('photos[' + i + ']', window.file.formDataPhotos.get(key), "photos" + i)
      i++
    }

    //удаляет ключи с пустыми значениями
    for (let pair of data.entries()) {
      if (!pair[1]) {
        data.delete(pair[0])
      }
    }

    xhr.open("Post", url)
    xhr.send(data)
  }
})()





