'use strict';

var events = require('events');
var reactErrorBoundary = require('react-error-boundary');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var isObj = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};

const disallowedKeys = new Set([
	'__proto__',
	'prototype',
	'constructor'
]);

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.has(segment));

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}

var dotProp = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return;
		}

		for (let i = 0; i < pathArray.length; i++) {
			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object === undefined ? value : object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return true;
			}

			object = object[p];

			if (!isObj(object)) {
				return false;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return false;
		}

		// eslint-disable-next-line unicorn/no-for-loop
		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};

var viewCache = {};
var loadCache = {};
var requCache = {
  react: React__default['default']
};
var viewEvents = new events.EventEmitter(); // create menu component

var DashupUIView = function DashupUIView() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // get type/view/struct
  var type = props.type,
      view = props.view,
      struct = props.struct,
      dashup = props.dashup; // tld

  var item = "".concat(type, ".").concat(struct, ".").concat(view).split('/').join('-'); // set loading

  var _useState = React.useState(!!dotProp.get(viewCache, item)),
      _useState2 = _slicedToArray(_useState, 2);
      _useState2[0];
      var setLoaded = _useState2[1];

  var _useState3 = React.useState(!(!view || !type || !struct || !dashup)),
      _useState4 = _slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1]; // load view


  var loadView = function loadView() {
    var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    // reattempt
    var reAttempt = function reAttempt() {
      // reattempt
      if (attempt < 5) {
        // create load cache item
        setTimeout(function () {
          // set
          dotProp.set(loadCache, item, loadView(attempt + 1)); // set events

          viewEvents.emit(item, true);
        }, attempt * 2000);
      }
    }; // return new promise


    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
        var finished, dataPromise, timeoutPromise, data, _data, _data$, code, uuid, shimGlobal, actualView;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // finished
                finished = false; // data promise

                dataPromise = props.dashup.rpc({
                  type: type,
                  struct: struct
                }, 'views', [view]); // timeout promise

                timeoutPromise = setTimeout(function () {
                  // timeout
                  finished = true; // reject

                  reject();
                  reAttempt();
                }, 5000); // try/catch

                _context.prev = 3;
                _context.next = 6;
                return dataPromise;

              case 6:
                data = _context.sent;

                if (!finished) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return");

              case 9:
                finished = true;
                clearTimeout(timeoutPromise); // check not found

                if (!(!data || !data[0])) {
                  _context.next = 15;
                  break;
                }

                // resolve
                resolve(null);
                reAttempt(); // log return

                return _context.abrupt("return", console.log("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view, " not found")));

              case 15:
                // expand data
                _data = _slicedToArray(data, 1), _data$ = _data[0], code = _data$.code, uuid = _data$.uuid; // create global

                shimGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null; // check window

                if (!shimGlobal.shimRequire) {
                  // create shim require function
                  shimGlobal.shimRequire = function (name) {
                    // names
                    if (requCache[name]) return requCache[name];
                  };
                } // create new function


                try {
                  // try/catch
                  new Function("const fileName = '".concat(type, ":").concat(struct, "'; const ", 'req', 'uire', " = ").concat(typeof window === 'undefined' ? 'global' : 'window', ".shimRequire; ").concat(code))();
                } catch (e) {
                  console.error("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view), e);
                } // set code


                actualView = shimGlobal[uuid]; // set to cache

                dotProp.set(viewCache, item, (actualView === null || actualView === void 0 ? void 0 : actualView["default"]) || actualView);
                setLoaded(true); // finish loading

                resolve((actualView === null || actualView === void 0 ? void 0 : actualView["default"]) || actualView);
                _context.next = 29;
                break;

              case 25:
                _context.prev = 25;
                _context.t0 = _context["catch"](3);
                reject(_context.t0);
                reAttempt();

              case 29:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 25]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  }; // check has view


  React.useEffect(function () {
    // use effect
    if (!dotProp.get(viewCache, item)) {
      // set loading
      setLoading(true); // try loading

      if (dotProp.get(loadCache, item)) {
        // await loaded from another module
        dotProp.get(loadCache, item).then(function () {
          return setLoading(false);
        }); // retry loader

        var retryLoader = function retryLoader() {
          // await loaded from another module
          dotProp.get(loadCache, item).then(function () {
            return setLoading(false);
          });
        }; // add listener


        viewEvents.on(item, retryLoader); // return

        return function () {
          // off
          viewEvents.removeListener(item, retryLoader);
        };
      } else {
        // create load cache item
        dotProp.set(loadCache, item, loadView());
      }
    }
  }, [struct, type, view]); // get component

  var Component = dotProp.get(viewCache, item); // on load

  if (Component && !loading && props.onLoad) setTimeout(props.onLoad, 100); // error fallback

  var ErrorFallback = function ErrorFallback(_ref2) {
    var error = _ref2.error;
        _ref2.resetErrorBoundary;
    // log error
    console.error("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view), error); // return ! div

    return /*#__PURE__*/React__default['default'].createElement("div", null);
  }; // create new function


  try {
    // return JSX
    return Component ? /*#__PURE__*/React__default['default'].createElement(reactErrorBoundary.ErrorBoundary, {
      FallbackComponent: ErrorFallback,
      onReset: function onReset() {// reset the state of your app so the error doesn't happen again
      }
    }, /*#__PURE__*/React__default['default'].createElement(Component, props)) : props.children || /*#__PURE__*/React__default['default'].createElement("div", null);
  } catch (e) {
    // error
    console.error("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view), e);
  }
}; // set defaults


DashupUIView.setDefaults = function (def) {
  // loop
  Object.keys(def).map(function (key) {
    requCache[key] = def[key];
  });
}; // export default

module.exports = DashupUIView;
