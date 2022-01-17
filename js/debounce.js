'use strict';

(function () {
  window.debounce = debounce

  /**
   debounce - Откладывает выполнение функции callback на время interval
   и предотвращает 'дребезг' при повтороном обращении к фукнции callback раньше,
   чем через время interval.
   */
  function debounce(callback, interval) {
    let lastTimeout;
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, interval);
  }
})()
