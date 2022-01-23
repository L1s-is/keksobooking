"use strict";

(function () {
  let fileChooserAvatar = document.querySelector(".ad-form-header__input")
  let fileChooserPhotos = document.querySelector(".ad-form__input")
  const dropAreaAvatar = document.querySelector(".ad-form-header__drop-zone")
  const dropAreaPhotos = document.querySelector(".ad-form__drop-zone")
  let prewiew = document.querySelector(".ad-form-header__preview img")
  const defaultImg = prewiew.src
  const fileTypes = ["jpg", "png", "jpeg"]

// перебираем массив возможных событий дроп и вешаем обработчик, если событие произошло:
// прекращаем распространение и отключаем привычное событие для браузера - открыть картинку в новой вкладке
  ;["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    document.body.addEventListener(eventName, preventDefaults)
  })

// если событие дроп "висит" над областью, то вешаем класс с обводкой
  ;["dragenter", "dragover"].forEach(eventName => {
    dropAreaPhotos.addEventListener(eventName, highlightDropZone)
    dropAreaAvatar.addEventListener(eventName, highlightDropZone)
  })

// если событие дроп покинуло область или произошло, то удаляем класс с обводкой
  ;["dragleave", "drop"].forEach(eventName => {
    dropAreaPhotos.addEventListener(eventName, unhighlightDropZone)
    dropAreaAvatar.addEventListener(eventName, unhighlightDropZone)
  })

  function preventDefaults (evt) {
    evt.preventDefault()
    evt.stopPropagation()
  }

  function highlightDropZone(evt) {
    evt.target.classList.add('drop-zone--active')
  }

  function unhighlightDropZone(evt) {
    evt.target.classList.remove('drop-zone--active')
  }

  //добавление выбранного аватара в превью
  function prewiewAvatar (files) {
    let file = files[0]
    let fileName = file.name.toLowerCase()
    let coincidence = fileTypes.some(element => fileName.endsWith(element))

    if (coincidence) {
      let reader = new FileReader()

      reader.addEventListener("load", function () {
        prewiew.src = reader.result
      })

      reader.readAsDataURL(file)
    } else {
      window.backend.errorHandler("Выберите формат изображения jpg, jpeg или png")
      fileChooserAvatar.value = ""
      prewiew.src = defaultImg
    }
  }

  fileChooserAvatar.addEventListener("change", defineLoadMethod)
  dropAreaAvatar.addEventListener("drop", defineLoadMethod)

  dropAreaPhotos.addEventListener("drop", defineLoadMethod)
  fileChooserPhotos.addEventListener("change", defineLoadMethod)

function defineLoadMethod(evt) {
  let dt = evt.dataTransfer
  let files = dt ? dt.files : evt.target.files

  if (evt.target === dropAreaPhotos || evt.target === fileChooserPhotos) {
    handleFiles(files)
  } else {
    prewiewAvatar(files)
  }
}

function handleFiles(files) {
  files = [...files]
  //files.forEach(uploadFile)
  files.forEach(previewPhotos)
}

function previewPhotos(file) {
  let fileName = file.name.toLowerCase()
  let coincidence = fileTypes.some(element => fileName.endsWith(element))

  if (coincidence) {
    let reader = new FileReader()

    reader.addEventListener("load", function () {
      let img = document.createElement("img")
      img.src = reader.result
      img.classList.add("ad-form__photo")
      let before = document.querySelector('.ad-form__photo--add')
      document.querySelector('.ad-form__photo--storage').insertBefore(img, before)
    })
    uploadFile(file)

    reader.readAsDataURL(file)
  } else {
    window.backend.errorHandler("Выберите формат изображения jpg, jpeg или png")
  }
  fileChooserPhotos.value = ""
}

let formDataPhotos = new FormData()
let k=0
function uploadFile(file, i) {
  let url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
  let xhr = new XMLHttpRequest()

  formDataPhotos.append('file[' + k + ']', file)
  console.log(formDataPhotos.get('file[' + k + ']'))
  k++
  //xhr.send(formData)
}

window.file = {
  formDataPhotos: formDataPhotos
}
})()
