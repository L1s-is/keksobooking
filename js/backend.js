"use strict";

(function (){
  function loadHandler(url, successHandler, errorHandler) {
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
          errorHandler("Ничего не найдено")
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
  }

  function successHandler(data) {
    console.log(data)
    window.listObjects = data
  }

  let getDataURL = "https://24.javascript.pages.academy/keksobooking/data"
  loadHandler(getDataURL, successHandler, errorHandler)

  function errorMessageHiddenHandler(){
    errorMessage.classList.add("hidden")
  }

  window.upLoadHandler = function (url, data, successHandler) {
    let xhr = new XMLHttpRequest()
    xhr.responseType = "json"
    xhr.addEventListener("load", function () {
      switch (xhr.status) {
        case 200:
          successHandler(xhr.response)
          break
        default:
          errorHandler("Данные не отправлены, попробуйте позднее")
          setTimeout(errorMessageHiddenHandler, 3000)
          break
      }
    })
    xhr.open("Post", url)
    xhr.send()
  }
})()





