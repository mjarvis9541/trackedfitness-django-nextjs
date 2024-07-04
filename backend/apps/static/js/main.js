/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/select.js":
/*!**************************!*\
  !*** ./src/js/select.js ***!
  \**************************/
/***/ (() => {

var selectAll = document.querySelector('.meal_1_select_all');
var selectAll2 = document.querySelector('.meal_2_select_all');
var selectAll3 = document.querySelector('.meal_3_select_all');
var selectAll4 = document.querySelector('.meal_4_select_all');
var selectAll5 = document.querySelector('.meal_5_select_all');
var selectAll6 = document.querySelector('.meal_6_select_all');
var checkboxes = document.querySelectorAll('.meal_1');
var checkboxes2 = document.querySelectorAll('.meal_2');
var checkboxes3 = document.querySelectorAll('.meal_3');
var checkboxes4 = document.querySelectorAll('.meal_4');
var checkboxes5 = document.querySelectorAll('.meal_5');
var checkboxes6 = document.querySelectorAll('.meal_6'); // Meal 1

selectAll.addEventListener('change', function () {
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = selectAll.checked;
  });
});
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked == false) {
      selectAll.checked = false;
    }

    if (document.querySelectorAll('.meal_1:checked').length == checkboxes.length) {
      selectAll.checked = true;
    }
  });
}); // Meal 2

selectAll2.addEventListener('change', function () {
  checkboxes2.forEach(function (checkbox) {
    checkbox.checked = selectAll2.checked;
  });
});
checkboxes2.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked == false) {
      selectAll2.checked = false;
    }

    if (document.querySelectorAll('.meal_1:checked').length == checkboxes2.length) {
      selectAll2.checked = true;
    }
  });
}); // Meal 3

selectAll3.addEventListener('change', function () {
  checkboxes3.forEach(function (checkbox) {
    checkbox.checked = selectAll3.checked;
  });
});
checkboxes3.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked == false) {
      selectAll3.checked = false;
    }

    if (document.querySelectorAll('.meal_1:checked').length == checkboxes3.length) {
      selectAll3.checked = true;
    }
  });
}); // Meal 4

selectAll4.addEventListener('change', function () {
  checkboxes4.forEach(function (checkbox) {
    checkbox.checked = selectAll4.checked;
  });
});
checkboxes4.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked == false) {
      selectAll4.checked = false;
    }

    if (document.querySelectorAll('.meal_1:checked').length == checkboxes4.length) {
      selectAll4.checked = true;
    }
  });
}); // Meal 5

selectAll5.addEventListener('change', function () {
  checkboxes5.forEach(function (checkbox) {
    checkbox.checked = selectAll5.checked;
  });
});
checkboxes5.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked == false) {
      selectAll5.checked = false;
    }

    if (document.querySelectorAll('.meal_1:checked').length == checkboxes5.length) {
      selectAll5.checked = true;
    }
  });
}); // Meal 6

selectAll6.addEventListener('change', function () {
  checkboxes6.forEach(function (checkbox) {
    checkbox.checked = selectAll6.checked;
  });
});
checkboxes6.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked == false) {
      selectAll6.checked = false;
    }

    if (document.querySelectorAll('.meal_1:checked').length == checkboxes6.length) {
      selectAll6.checked = true;
    }
  });
});

/***/ }),

/***/ "./src/js/swipe.js":
/*!*************************!*\
  !*** ./src/js/swipe.js ***!
  \*************************/
/***/ (() => {

// Future implementation - swiping left and right through the diary pages
// https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
var previous = document.querySelector('.prev');
var next = document.querySelector('.next');
var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches;
}

function handleTouchStart(evt) {
  var firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) + Math.abs(yDiff) > 150) {
    //to deal with to short swipes
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        /* left swipe */
        console.log('left swipe');
        next.click();
      } else {
        /* right swipe */
        console.log('right swipe');
        previous.click();
      }
    } else {
      if (yDiff > 0) {// console.log('up swipe');

        /* up swipe */
      } else {
          /* down swipe */
          // console.log('down swipe');
        }
    }
    /* reset values */


    xDown = null;
    yDown = null;
  }
}

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./select */ "./src/js/select.js");
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_select__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _swipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./swipe */ "./src/js/swipe.js");
/* harmony import */ var _swipe__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_swipe__WEBPACK_IMPORTED_MODULE_2__);



console.log("hello");
})();

/******/ })()
;
//# sourceMappingURL=main.js.map