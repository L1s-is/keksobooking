"use strict"

function loadHandler(url, successHandler, errorHandler) {
  let xhr = new XMLHttpRequest()
  xhr.responseType = "json"
  xhr.addEventListener("load", function () {
    let error
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
      case 401:
        errorHandler("Ничего не найдено")
        break
      default:
        errorHandler("Статус ответа: " + xhr.status + " " + xhr.statusText)
        break
    }
    xhr.addEventListener("error", function () {
      errorHandler("Произошла ошибка соединения")
    })
    xhr.addEventListener("timeout", function () {
      errorHandler("Запрос не успел выполниться за " + xhr.timeout / 100 + "секунд")
    })
  })
  xhr.timeout = 10000
  xhr.open("GET", url)
  xhr.send()
}
function upLoadHandler(url, data, successHandler) {
  let xhr = new XMLHttpRequest()
  xhr.responseType = "json"
  xhr.addEventListener("load", function () {
    successHandler(xhr.response)
  })
  xhr.open("Post", url)
  xhr.send()
}

function errorHandler(message) {
  console.log(message)
}

function successHandler(data) {
  console.log(data)
  /*window.listObjects = data*/
}

let getDataURL = "https://24.javascript.pages.academy/keksobooking/data"
loadHandler(getDataURL, successHandler, errorHandler)




