'use strict';

var reactErrorBoundary = require('react-error-boundary');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
}; // create menu component

var DashupUIView = function DashupUIView() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // get type/view/struct
  var type = props.type,
      view = props.view,
      struct = props.struct,
      dashup = props.dashup; // set loading

  var _useState = React.useState(!(!view || !type || !struct || !dashup)),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2);
      _useState4[0];
      _useState4[1]; // tld


  var item = "".concat(type, ".").concat(struct, ".").concat(view).split('/').join('-'); // check has view

  React.useEffect(function () {
    // use effect
    if (!dotProp.get(viewCache, item)) {
      // set loading
      setLoading(true); // try loading

      if (dotProp.get(loadCache, item)) {
        // await loaded from another module
        dotProp.get(loadCache, item).then(function () {
          return setLoading(false);
        });
      } else {
        // create load cache item
        dotProp.set(loadCache, item, new Promise(function (resolve) {
          // load
          props.dashup.rpc({
            type: type,
            struct: struct
          }, 'views', [view]).then(function (data) {
            // check not found
            if (!data || !data[0]) {
              resolve(null);
              setLoading(false);
              return console.log("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view, " not found"));
            } // try/catch


            try {
              // expand data
              var _data = _slicedToArray(data, 1),
                  _data$ = _data[0],
                  code = _data$.code,
                  uuid = _data$.uuid; // create global


              var shimGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null; // check window

              if (!shimGlobal.shimRequire) {
                // create shim require function
                shimGlobal.shimRequire = function (name) {
                  // names
                  if (requCache[name]) return requCache[name];
                };
              } // create new function


              try {
                // try/catch
                new Function("const require = ".concat(typeof window === 'undefined' ? 'global' : 'window', ".shimRequire; ").concat(code))();
              } catch (e) {
                console.error("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view), e);
              } // set code


              var actualView = shimGlobal[uuid]; // set to cache

              dotProp.set(viewCache, item, (actualView === null || actualView === void 0 ? void 0 : actualView["default"]) || actualView); // finish loading

              resolve((actualView === null || actualView === void 0 ? void 0 : actualView["default"]) || actualView);
              setLoading(false);
            } catch (e) {
              // error
              console.error("[dashup] view ".concat(type, ":").concat(struct, " ").concat(view), e);
            }
          });
        }));
      }
    }
  }, [struct, type, view]); // get component

  var Component = dotProp.get(viewCache, item); // on load

  if (Component && !loading && props.onLoad) setTimeout(props.onLoad, 100); // error fallback

  var ErrorFallback = function ErrorFallback(_ref) {
    var error = _ref.error;
        _ref.resetErrorBoundary;
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
