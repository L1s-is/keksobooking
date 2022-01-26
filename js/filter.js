'use strict';

(function () {
  window.filterPins = filterPins;

  let Debounce_interval = 500;

  let PriceValues = {
    Middle_start: 10000,
    Middle_final: 50000
  };

  let filtersContainer = document.querySelector('.map__filters-container');
  let filters = filtersContainer.querySelectorAll('.map__filter');
  let filteredAds = [];

  //Фильтрует объявления по типу жилья.
  function filterByType(arr, filterValue) {
    return arr.filter(element => element.offer.type === filterValue)
  }

  //Фильтрует объявления по количеству комнат.
  function filterByRooms(arr, filterValue) {
    return arr.filter(element => element.offer.rooms.toString() === filterValue)
  }

  //Фильтрует объявления по количеству гостей.
  function filterByGuests(arr, filterValue) {
    return arr.filter(element => element.offer.guests.toString() === filterValue)
  }

  //Фильтрует объявления по интервалу цен
  function filterByPrice(arr, filterValue) {
    return arr.filter(element => {
      let priceInterval = {
        'low': element.offer.price < PriceValues.Middle_start,
        'middle': element.offer.price >= PriceValues.Middle_start && element.offer.price <= PriceValues.Middle_final,
        'high': element.offer.price > PriceValues.Middle_final
      }
      return priceInterval[filterValue]
    })
  }

  //Фильтрует объявления по характеристикам жилья
  function filterByFeatures(arr, filterValue) {
    return arr.filter(element => element.offer.features.indexOf(featureValue) >= 0)
  }

  let listNameToFilter = {
    'housing-type': filterByType,
    'housing-rooms': filterByRooms,
    'housing-guests': filterByGuests,
    'housing-price': filterByPrice
  }

  filtersContainer.addEventListener('change', function () {
    window.debounce(window.mapjs.changeMapPins, Debounce_interval)
  })

  //Возвращает отфильтрованный массив объявлений.
  function filterPins(ads) {
    filteredAds = ads.slice()

    // Формирует массив из фильтров, которые были применены (фильтр был применен,
    // если его значение отличается от значения 'any')
    let appliedFilters = Array.from(filters).filter(function (filter) {
      return filter.value !== 'any'
    })

    // Формирует массив из выбранных характеристик объявления
    let checkedFeatures = Array.from(filtersContainer.querySelectorAll('.map__filter-set input[name="features"]:checked'));

    // Фильтрует объявления по каждому примененному фильтру
    appliedFilters.forEach(function (filter) {
      filteredAds = listNameToFilter[filter.name](filteredAds, filter.value)
    })

    // Фильтрует объявления по каждой выбранной характеристике
    checkedFeatures.forEach(function (feature) {
      filteredAds = filterByFeatures(filteredAds, feature.value)
    })

    return filteredAds
  }
})()
