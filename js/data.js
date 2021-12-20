'use strict';

let map = document.querySelector(".map")
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
