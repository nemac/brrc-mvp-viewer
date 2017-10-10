/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _parser = __webpack_require__(2);
	
	var _search = __webpack_require__(3);
	
	var _search2 = _interopRequireDefault(_search);
	
	var _panel = __webpack_require__(22);
	
	var _baselayer = __webpack_require__(28);
	
	var _graph = __webpack_require__(26);
	
	var _poi = __webpack_require__(25);
	
	var _tabs = __webpack_require__(30);
	
	var _map = __webpack_require__(24);
	
	var _share = __webpack_require__(27);
	
	var _layer = __webpack_require__(23);
	
	var _logo = __webpack_require__(32);
	
	var _logo2 = _interopRequireDefault(_logo);
	
	var _mobile = __webpack_require__(33);
	
	var _mobile2 = _interopRequireDefault(_mobile);
	
	var _panelToggle = __webpack_require__(34);
	
	var _panelToggle2 = _interopRequireDefault(_panelToggle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var css = __webpack_require__(35);
	
	// Does not rely on map object or config file
	var Base = function Base(config) {
		(0, _parser.ParseConfig)(config, callback);
		(0, _graph.SetupGraphs)();
		(0, _tabs.BindTabEvents)();
		(0, _share.BindCopyLinkEvents)();
		(0, _mobile2.default)();
		(0, _panelToggle2.default)();
	};
	
	// Does rely on map object or config file
	var callback = function callback(data) {
		(0, _share.AddShareSettingsToConfig)(data);
		var map = (0, _map.CreateMap)(data.map);
		(0, _baselayer.CreateBaseLayers)(map, data.baselayers);
		(0, _layer.CreateDefaultLayers)(data.layers, data["active-layers"]);
		(0, _panel.SetupPanel)(data.layers, data.layout);
		(0, _search2.default)(map);
		(0, _logo2.default)(data.logo);
		if (data.tab) (0, _tabs.HandleTabChange)(data.tab);
		if (data.graph) (0, _graph.HandleGraphTabChange)(data.graph);
		(0, _poi.BindGraphEvents)(map);
		(0, _share.BindUpdateShareUrl)(map);
		(0, _poi.SetupPointsOfInterest)(map, data.pois);
		(0, _share.updateShareUrl)();
	};
	
	window.Base = Base;
	
	exports.default = { Base: Base };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ParseConfig = ParseConfig;
	exports.GetAjaxObject = GetAjaxObject;
	/**
	 * Parses a config file. Since the process to get external files
	 * uses AJAX you need to pass a callback to handle the next steps
	 * of using the config file, since we do not know how long it
	 * will take to grab the file.
	 */
	function ParseConfig(configFile, callback) {
		GetConfig(configFile, callback);
	}
	
	function GetAjaxObject(responseHandler) {
		var xmlhttp;
		if (!window.XMLHttpRequest && window.ActiveXObject) {
			xmlhttp = new window.ActiveXObject("MSXML2.XMLHTTP.3.0");
		} else {
			xmlhttp = new XMLHttpRequest();
		}
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {
				responseHandler(xmlhttp.response);
			}
		};
		return xmlhttp;
	}
	
	function GetConfig(configFile, callback) {
		var xmlhttp = GetAjaxObject(function (response) {
			var data = responseHandler(response);
			callback(data);
		});
		xmlhttp.open("GET", configFile, true);
		xmlhttp.send();
		console.log("hi");
	}
	
	function responseHandler(response) {
		response = JSON.parse(response);
		formatMap(response);
		formatLayers(response);
		return response;
	}
	
	function formatMap(data) {
		if (!data.map) data.map = {};
	}
	
	function formatLayers(data) {
		var layers = data.layers;
		var defaultMapserverUrl = data.mapserverUrl;
		var defaultEnabledLayers = data["active-layers"];
		var layergroup;
		var i;
	
		for (var prop in layers) {
			if (!layers.hasOwnProperty(prop)) return;
			layergroup = layers[prop];
			for (i = 0; i < layergroup.length; i++) {
				setMapserverUrl(layergroup[i], defaultMapserverUrl);
				setDefaultLayerOpacity(layergroup[i], data.defaultLayerOpacity);
			}
		}
	}
	
	function setDefaultLayerOpacity(layer, opacity) {
		layer.opacity = layer.opacity || opacity;
	}
	
	function setMapserverUrl(layer, url) {
		layer.url = layer.url || url;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = CreateSearch;
	
	var _leafletGeosearch = __webpack_require__(4);
	
	function CreateSearch(map) {
		var provider = new _leafletGeosearch.OpenStreetMapProvider();
	
		var searchControl = new _leafletGeosearch.GeoSearchControl({
			provider: provider,
			showMarker: false,
			autoComplete: true,
			showPopup: false
		});
	
		map.addControl(searchControl);
	
		var searchElements = searchControl.searchElement.elements;
	
		L.DomEvent.on(searchElements.container, "click", function (ev) {
			L.DomEvent.stopPropagation(ev);
	
			var searchEntries = searchElements.form.getElementsByClassName('results')[0].children;
	
			for (var i = 0; i < searchEntries.length; i++) {
				if (ev.target === searchEntries[i]) {
					searchElements.container.classList.remove('active');
				}
			}
	
			//send google analytics for search by address
			ga('send', 'event', {
				eventCategory: 'map',
				eventAction: 'search',
				eventLabel: 'click',
				nonInteraction: false
			});
		});
	
		L.DomEvent.on(searchElements.container, "keydown", function (ev) {
			L.DomEvent.stopPropagation(ev);
	
			if (ev.which == 13 || ev.keyCode == 13) {
				searchElements.container.classList.remove('active');
	
				//send google analytics for seacrch by address
				ga('send', 'event', {
					eventCategory: 'map',
					eventAction: 'search address',
					eventLabel: ev.target.value,
					nonInteraction: false
				});
			}
		});
	}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _leafletControl = __webpack_require__(5);
	
	Object.defineProperty(exports, 'GeoSearchControl', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_leafletControl).default;
	  }
	});
	
	var _searchElement = __webpack_require__(13);
	
	Object.defineProperty(exports, 'SearchElement', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_searchElement).default;
	  }
	});
	
	var _bingProvider = __webpack_require__(17);
	
	Object.defineProperty(exports, 'BingProvider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_bingProvider).default;
	  }
	});
	
	var _esriProvider = __webpack_require__(19);
	
	Object.defineProperty(exports, 'EsriProvider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_esriProvider).default;
	  }
	});
	
	var _googleProvider = __webpack_require__(20);
	
	Object.defineProperty(exports, 'GoogleProvider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_googleProvider).default;
	  }
	});
	
	var _openStreetMapProvider = __webpack_require__(21);
	
	Object.defineProperty(exports, 'OpenStreetMapProvider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_openStreetMapProvider).default;
	  }
	});
	
	var _provider = __webpack_require__(18);
	
	Object.defineProperty(exports, 'Provider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_provider).default;
	  }
	});
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _nodentRuntime = __webpack_require__(6);
	
	var _nodentRuntime2 = _interopRequireDefault(_nodentRuntime);
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	exports.default = LeafletControl;
	
	var _lodash = __webpack_require__(12);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _searchElement = __webpack_require__(13);
	
	var _searchElement2 = _interopRequireDefault(_searchElement);
	
	var _resultList = __webpack_require__(16);
	
	var _resultList2 = _interopRequireDefault(_resultList);
	
	var _domUtils = __webpack_require__(14);
	
	var _constants = __webpack_require__(15);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	var defaultOptions = function defaultOptions() {
	  return {
	    position: 'topleft',
	    style: 'button',
	    showMarker: true,
	    showPopup: false,
	    popupFormat: function popupFormat(_ref) {
	      var result = _ref.result;
	      return '' + result.label;
	    },
	    marker: {
	      icon: new L.Icon.Default(),
	      draggable: false
	    },
	    maxMarkers: 1,
	    retainZoomLevel: false,
	    animateZoom: true,
	    searchLabel: 'Enter address',
	    notFoundMessage: 'Sorry, that address could not be found.',
	    messageHideDelay: 3000,
	    zoomLevel: 18,
	    classNames: {
	      container: 'leaflet-bar leaflet-control leaflet-control-geosearch',
	      button: 'leaflet-bar-part leaflet-bar-part-single',
	      resetButton: 'reset',
	      msgbox: 'leaflet-bar message',
	      form: '',
	      input: ''
	    },
	    autoComplete: true,
	    autoCompleteDelay: 250,
	    autoClose: false,
	    keepResult: false
	  };
	};
	
	var wasHandlerEnabled = {};
	var mapHandlers = ['dragging', 'touchZoom', 'doubleClickZoom', 'scrollWheelZoom', 'boxZoom', 'keyboard'];
	
	var Control = {
	  initialize: function initialize(options) {
	    var _this = this;
	
	    this.markers = new L.FeatureGroup();
	    this.handlersDisabled = false;
	
	    this.options = _extends({}, defaultOptions(), options);
	
	    var _options = this.options,
	        style = _options.style,
	        classNames = _options.classNames,
	        searchLabel = _options.searchLabel,
	        autoComplete = _options.autoComplete,
	        autoCompleteDelay = _options.autoCompleteDelay;
	
	    if (style !== 'button') {
	      this.options.classNames.container += ' ' + options.style;
	    }
	
	    this.searchElement = new _searchElement2.default(_extends({}, this.options, {
	      handleSubmit: function handleSubmit(query) {
	        return _this.onSubmit(query);
	      }
	    }));
	
	    var _searchElement$elemen = this.searchElement.elements,
	        container = _searchElement$elemen.container,
	        form = _searchElement$elemen.form,
	        input = _searchElement$elemen.input;
	
	    var button = (0, _domUtils.createElement)('a', classNames.button, container);
	    button.title = searchLabel;
	    button.href = '#';
	
	    button.addEventListener('click', function (e) {
	      _this.onClick(e);
	    }, false);
	
	    var resetButton = (0, _domUtils.createElement)('a', classNames.resetButton, form);
	    resetButton.innerHTML = 'X';
	    button.href = '#';
	    resetButton.addEventListener('click', function () {
	      _this.clearResults(null, true);
	    }, false);
	
	    if (autoComplete) {
	      this.resultList = new _resultList2.default({
	        handleClick: function handleClick(_ref2) {
	          var result = _ref2.result;
	
	          input.value = result.label;
	          _this.onSubmit({ query: result.label });
	        }
	      });
	
	      form.appendChild(this.resultList.elements.container);
	
	      input.addEventListener('keyup', (0, _lodash2.default)(function (e) {
	        return _this.autoSearch(e);
	      }, autoCompleteDelay), true);
	      input.addEventListener('keydown', function (e) {
	        return _this.selectResult(e);
	      }, true);
	      input.addEventListener('keydown', function (e) {
	        return _this.clearResults(e, true);
	      }, true);
	    }
	
	    form.addEventListener('mouseenter', function (e) {
	      return _this.disableHandlers(e);
	    }, true);
	    form.addEventListener('mouseleave', function (e) {
	      return _this.restoreHandlers(e);
	    }, true);
	
	    this.elements = { button: button, resetButton: resetButton };
	  },
	  onAdd: function onAdd(map) {
	    var _options2 = this.options,
	        showMarker = _options2.showMarker,
	        style = _options2.style;
	
	    this.map = map;
	    if (showMarker) {
	      this.markers.addTo(map);
	    }
	
	    if (style === 'bar') {
	      var form = this.searchElement.elements.form;
	
	      var root = map.getContainer().querySelector('.leaflet-control-container');
	
	      var container = (0, _domUtils.createElement)('div', 'leaflet-control-geosearch bar');
	      container.appendChild(form);
	      root.appendChild(container);
	      this.elements.container = container;
	    }
	
	    return this.searchElement.elements.container;
	  },
	  onRemove: function onRemove() {
	    var container = this.elements.container;
	
	    if (container) {
	      container.remove();
	    }
	
	    return this;
	  },
	  onClick: function onClick(event) {
	    event.preventDefault();
	
	    var _searchElement$elemen2 = this.searchElement.elements,
	        container = _searchElement$elemen2.container,
	        input = _searchElement$elemen2.input;
	
	    if (container.classList.contains('active')) {
	      (0, _domUtils.removeClassName)(container, 'active');
	      this.clearResults();
	    } else {
	      (0, _domUtils.addClassName)(container, 'active');
	      input.focus();
	    }
	  },
	  disableHandlers: function disableHandlers(e) {
	    var _this2 = this;
	
	    var form = this.searchElement.elements.form;
	
	    if (this.handlersDisabled || e && e.target !== form) {
	      return;
	    }
	
	    this.handlersDisabled = true;
	    mapHandlers.forEach(function (handler) {
	      if (_this2.map[handler]) {
	        wasHandlerEnabled[handler] = _this2.map[handler].enabled();
	        _this2.map[handler].disable();
	      }
	    });
	  },
	  restoreHandlers: function restoreHandlers(e) {
	    var _this3 = this;
	
	    var form = this.searchElement.elements.form;
	
	    if (!this.handlersDisabled || e && e.target !== form) {
	      return;
	    }
	
	    this.handlersDisabled = false;
	    mapHandlers.forEach(function (handler) {
	      if (wasHandlerEnabled[handler]) {
	        _this3.map[handler].enable();
	      }
	    });
	  },
	  selectResult: function selectResult(event) {
	    if (![_constants.ENTER_KEY, _constants.ARROW_DOWN_KEY, _constants.ARROW_UP_KEY].includes(event.keyCode)) {
	      return;
	    }
	
	    event.preventDefault();
	
	    var input = this.searchElement.elements.input;
	
	    if (event.keyCode === _constants.ENTER_KEY) {
	      this.onSubmit({ query: input.value });
	      return;
	    }
	
	    var list = this.resultList;
	    var max = list.count() - 1;
	    if (max < 0) {
	      return;
	    }
	
	    // eslint-disable-next-line no-bitwise
	    var next = event.code === 'ArrowDown' ? ~~list.selected + 1 : ~~list.selected - 1;
	    // eslint-disable-next-line no-nested-ternary
	    var idx = next < 0 ? max : next > max ? 0 : next;
	
	    var item = list.select(idx);
	    input.value = item.label;
	  },
	  clearResults: function clearResults(event) {
	    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	    if (event && event.keyCode !== _constants.ESCAPE_KEY) {
	      return;
	    }
	
	    var input = this.searchElement.elements.input;
	    var _options3 = this.options,
	        keepResult = _options3.keepResult,
	        autoComplete = _options3.autoComplete;
	
	    if (force || !keepResult) {
	      input.value = '';
	      this.markers.clearLayers();
	    }
	
	    if (autoComplete) {
	      this.resultList.clear();
	    }
	  },
	  autoSearch: function autoSearch(event) {
	    return new Promise(function ($return, $error) {
	      var query, provider, results;
	
	      if (_constants.SPECIAL_KEYS.includes(event.keyCode)) {
	        return $return();
	      }
	
	      query = event.target.value;
	      provider = this.options.provider;
	
	      if (query.length) {
	        return provider.search({ query: query }).then(function ($await_2) {
	          results = $await_2;
	          this.resultList.render(results);
	          return $If_1.call(this);
	        }.$asyncbind(this, $error), $error);
	      } else {
	        this.resultList.clear();
	        return $If_1.call(this);
	      }
	
	      function $If_1() {
	        return $return();
	      }
	    }.$asyncbind(this));
	  },
	  onSubmit: function onSubmit(query) {
	    return new Promise(function ($return, $error) {
	      var provider, results;
	      provider = this.options.provider;
	      return provider.search(query).then(function ($await_3) {
	
	        results = $await_3;
	
	        if (results && results.length > 0) {
	          this.showResult(results[0], query);
	        }
	        return $return();
	      }.$asyncbind(this, $error), $error);
	    }.$asyncbind(this));
	  },
	  showResult: function showResult(result, _ref3) {
	    var query = _ref3.query;
	    var autoClose = this.options.autoClose;
	
	    var markers = Object.keys(this.markers._layers);
	    if (markers.length >= this.options.maxMarkers) {
	      this.markers.removeLayer(markers[0]);
	    }
	
	    var marker = this.addMarker(result, query);
	    this.centerMap(result);
	
	    this.map.fireEvent('geosearch/showlocation', {
	      location: result,
	      marker: marker
	    });
	
	    if (autoClose) {
	      this.closeResults();
	    }
	  },
	  closeResults: function closeResults() {
	    var container = this.searchElement.elements.container;
	
	    if (container.classList.contains('active')) {
	      (0, _domUtils.removeClassName)(container, 'active');
	    }
	
	    this.restoreHandlers();
	    this.clearResults();
	  },
	  addMarker: function addMarker(result, query) {
	    var _this4 = this;
	
	    var _options4 = this.options,
	        options = _options4.marker,
	        showPopup = _options4.showPopup,
	        popupFormat = _options4.popupFormat;
	
	    var marker = new L.Marker([result.y, result.x], options);
	    var popupLabel = result.label;
	
	    if (typeof popupFormat === 'function') {
	      popupLabel = popupFormat({ query: query, result: result });
	    }
	
	    marker.bindPopup(popupLabel);
	
	    this.markers.addLayer(marker);
	
	    if (showPopup) {
	      marker.openPopup();
	    }
	
	    if (options.draggable) {
	      marker.on('dragend', function (args) {
	        _this4.map.fireEvent('geosearch/marker/dragend', {
	          location: marker.getLatLng(),
	          event: args
	        });
	      });
	    }
	
	    return marker;
	  },
	  centerMap: function centerMap(result) {
	    var _options5 = this.options,
	        retainZoomLevel = _options5.retainZoomLevel,
	        animateZoom = _options5.animateZoom;
	
	    var resultBounds = new L.LatLngBounds(result.bounds);
	    var bounds = resultBounds.isValid() ? resultBounds : this.markers.getBounds();
	
	    if (!retainZoomLevel && resultBounds.isValid()) {
	      this.map.fitBounds(bounds, { animate: animateZoom });
	    } else {
	      this.map.setView(bounds.getCenter(), this.getZoom(), { animate: animateZoom });
	    }
	  },
	  getZoom: function getZoom() {
	    var _options6 = this.options,
	        retainZoomLevel = _options6.retainZoomLevel,
	        zoomLevel = _options6.zoomLevel;
	
	    return retainZoomLevel ? this.map.getZoom() : zoomLevel;
	  }
	};
	
	function LeafletControl() {
	  if (!L || !L.Control || !L.Control.extend) {
	    throw new Error('Leaflet must be loaded before instantiating the GeoSearch control');
	  }
	
	  var LControl = L.Control.extend(Control);
	
	  for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
	    options[_key] = arguments[_key];
	  }
	
	  return new (Function.prototype.bind.apply(LControl, [null].concat(options)))();
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/*
	 * $asyncbind has multiple uses, depending on the parameter list. It is in Function.prototype, so 'this' is always a function
	 *
	 * 1) If called with a single argument (this), it is used when defining an async function to ensure when
	 *      it is invoked, the correct 'this' is present, just like "bind". For legacy reasons, 'this' is given
	 *      a memeber 'then' which refers to itself.
	 * 2) If called with a second parameter ("catcher") and catcher!==true it is being used to invoke an async
	 *      function where the second parameter is the error callback (for sync exceptions and to be passed to
	 *      nested async calls)
	 * 3) If called with the second parameter===true, it is the same use as (1), but the function is wrapped
	 *      in an 'Promise' as well bound to 'this'.
	 *      It is the same as calling 'new Promise(this)', where 'this' is the function being bound/wrapped
	 * 4) If called with the second parameter===0, it is the same use as (1), but the function is wrapped
	 *      in a 'LazyThenable', which executes lazily and can resolve synchronously.
	 *      It is the same as calling 'new LazyThenable(this)' (if such a type were exposed), where 'this' is
	 *      the function being bound/wrapped
	 */
	
	function processIncludes(includes, input) {
	    var src = input.toString();
	    var t = "return " + src;
	    var args = src.match(/.*\(([^)]*)\)/)[1];
	    var re = /['"]!!!([^'"]*)['"]/g;
	    var m = [];
	    while (1) {
	        var mx = re.exec(t);
	        if (mx) m.push(mx);else break;
	    }
	    m.reverse().forEach(function (e) {
	        t = t.slice(0, e.index) + includes[e[1]] + t.substr(e.index + e[0].length);
	    });
	    t = t.replace(/\/\*[^*]*\*\//g, ' ').replace(/\s+/g, ' ');
	    return new Function(args, t)();
	}
	
	var $asyncbind = processIncludes({
	    zousan: __webpack_require__(7).toString(),
	    thenable: __webpack_require__(11).toString()
	}, function $asyncbind(self, catcher) {
	    "use strict";
	
	    if (!Function.prototype.$asyncbind) {
	        Object.defineProperty(Function.prototype, "$asyncbind", { value: $asyncbind, enumerable: false, configurable: true, writable: true });
	    }
	
	    if (!$asyncbind.trampoline) {
	        $asyncbind.trampoline = function trampoline(t, x, s, e, u) {
	            return function b(q) {
	                while (q) {
	                    if (q.then) {
	                        q = q.then(b, e);
	                        return u ? undefined : q;
	                    }
	                    try {
	                        if (q.pop) {
	                            if (q.length) return q.pop() ? x.call(t) : q;
	                            q = s;
	                        } else q = q.call(t);
	                    } catch (r) {
	                        return e(r);
	                    }
	                }
	            };
	        };
	    }
	    if (!$asyncbind.LazyThenable) {
	        $asyncbind.LazyThenable = '!!!thenable'();
	        $asyncbind.EagerThenable = $asyncbind.Thenable = ($asyncbind.EagerThenableFactory = '!!!zousan')();
	    }
	
	    var resolver = this;
	    switch (catcher) {
	        case true:
	            return new $asyncbind.Thenable(boundThen);
	        case 0:
	            return new $asyncbind.LazyThenable(boundThen);
	        case undefined:
	            /* For runtime compatibility with Nodent v2.x, provide a thenable */
	            boundThen.then = boundThen;
	            return boundThen;
	        default:
	            return function () {
	                try {
	                    return resolver.apply(self, arguments);
	                } catch (ex) {
	                    return catcher(ex);
	                }
	            };
	    }
	    function boundThen() {
	        return resolver.apply(self, arguments);
	    }
	});
	
	function $asyncspawn(promiseProvider, self) {
	    if (!Function.prototype.$asyncspawn) {
	        Object.defineProperty(Function.prototype, "$asyncspawn", { value: $asyncspawn, enumerable: false, configurable: true, writable: true });
	    }
	    if (!(this instanceof Function)) return;
	
	    var genF = this;
	    return new promiseProvider(function enough(resolve, reject) {
	        var gen = genF.call(self, resolve, reject);
	        function step(fn, arg) {
	            var next;
	            try {
	                next = fn.call(gen, arg);
	                if (next.done) {
	                    if (next.value !== resolve) {
	                        if (next.value && next.value === next.value.then) return next.value(resolve, reject);
	                        resolve && resolve(next.value);
	                        resolve = null;
	                    }
	                    return;
	                }
	
	                if (next.value.then) {
	                    next.value.then(function (v) {
	                        step(gen.next, v);
	                    }, function (e) {
	                        step(gen.throw, e);
	                    });
	                } else {
	                    step(gen.next, next.value);
	                }
	            } catch (e) {
	                reject && reject(e);
	                reject = null;
	                return;
	            }
	        }
	        step(gen.next);
	    });
	}
	
	// Initialize async bindings
	$asyncbind();
	$asyncspawn();
	
	// Export async bindings
	module.exports = {
	    $asyncbind: $asyncbind,
	    $asyncspawn: $asyncspawn
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {/* This code is based on:
	zousan - A Lightning Fast, Yet Very Small Promise A+ Compliant Implementation
	https://github.com/bluejava/zousan
	Author: Glenn Crownover <glenn@bluejava.com> (http://www.bluejava.com)
	Version 2.3.3
	License: MIT */
	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = function (tick) {
	    tick = tick || (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.nextTick || typeof setImmediate === "function" && setImmediate || function (f) {
	        setTimeout(f, 0);
	    };
	    var soon = function () {
	        var fq = [],
	            fqStart = 0,
	            bufferSize = 1024;
	        function callQueue() {
	            while (fq.length - fqStart) {
	                try {
	                    fq[fqStart]();
	                } catch (ex) {/* console.error(ex) */}
	                fq[fqStart++] = undefined;
	                if (fqStart === bufferSize) {
	                    fq.splice(0, bufferSize);
	                    fqStart = 0;
	                }
	            }
	        }
	
	        return function (fn) {
	            fq.push(fn);
	            if (fq.length - fqStart === 1) tick(callQueue);
	        };
	    }();
	
	    function Zousan(func) {
	        if (func) {
	            var me = this;
	            func(function (arg) {
	                me.resolve(arg);
	            }, function (arg) {
	                me.reject(arg);
	            });
	        }
	    }
	
	    Zousan.prototype = {
	        resolve: function resolve(value) {
	            if (this.state !== undefined) return;
	            if (value === this) return this.reject(new TypeError("Attempt to resolve promise with self"));
	            var me = this;
	            if (value && (typeof value === "function" || (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object")) {
	                try {
	                    var first = 0;
	                    var then = value.then;
	                    if (typeof then === "function") {
	                        then.call(value, function (ra) {
	                            if (!first++) {
	                                me.resolve(ra);
	                            }
	                        }, function (rr) {
	                            if (!first++) {
	                                me.reject(rr);
	                            }
	                        });
	                        return;
	                    }
	                } catch (e) {
	                    if (!first) this.reject(e);
	                    return;
	                }
	            }
	            this.state = STATE_FULFILLED;
	            this.v = value;
	            if (me.c) soon(function () {
	                for (var n = 0, l = me.c.length; n < l; n++) {
	                    STATE_FULFILLED(me.c[n], value);
	                }
	            });
	        },
	        reject: function reject(reason) {
	            if (this.state !== undefined) return;
	            this.state = STATE_REJECTED;
	            this.v = reason;
	            var clients = this.c;
	            if (clients) soon(function () {
	                for (var n = 0, l = clients.length; n < l; n++) {
	                    STATE_REJECTED(clients[n], reason);
	                }
	            });
	        },
	        then: function then(onF, onR) {
	            var p = new Zousan();
	            var client = {
	                y: onF,
	                n: onR,
	                p: p
	            };
	            if (this.state === undefined) {
	                if (this.c) this.c.push(client);else this.c = [client];
	            } else {
	                var s = this.state,
	                    a = this.v;
	                soon(function () {
	                    s(client, a);
	                });
	            }
	            return p;
	        }
	    };
	
	    function STATE_FULFILLED(c, arg) {
	        if (typeof c.y === "function") {
	            try {
	                var yret = c.y.call(undefined, arg);
	                c.p.resolve(yret);
	            } catch (err) {
	                c.p.reject(err);
	            }
	        } else c.p.resolve(arg);
	    }
	
	    function STATE_REJECTED(c, reason) {
	        if (typeof c.n === "function") {
	            try {
	                var yret = c.n.call(undefined, reason);
	                c.p.resolve(yret);
	            } catch (err) {
	                c.p.reject(err);
	            }
	        } else c.p.reject(reason);
	    }
	
	    Zousan.resolve = function (val) {
	        if (val && val instanceof Zousan) return val;
	        var z = new Zousan();
	        z.resolve(val);
	        return z;
	    };
	    Zousan.reject = function (err) {
	        if (err && err instanceof Zousan) return err;
	        var z = new Zousan();
	        z.reject(err);
	        return z;
	    };
	
	    Zousan.version = "2.3.3-nodent";
	    return Zousan;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(9).setImmediate))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) {
	    return [];
	};
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var apply = Function.prototype.apply;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function () {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function () {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout = exports.clearInterval = function (timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function () {};
	Timeout.prototype.close = function () {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function (item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function (item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function (item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout) item._onTimeout();
	    }, msecs);
	  }
	};
	
	// setimmediate attaches itself to the global object
	__webpack_require__(10);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";
	
	(function (global, undefined) {
	    "use strict";
	
	    if (global.setImmediate) {
	        return;
	    }
	
	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;
	
	    function setImmediate(callback) {
	        // Callback can either be a function or a string
	        if (typeof callback !== "function") {
	            callback = new Function("" + callback);
	        }
	        // Copy function arguments
	        var args = new Array(arguments.length - 1);
	        for (var i = 0; i < args.length; i++) {
	            args[i] = arguments[i + 1];
	        }
	        // Store and register the task
	        var task = { callback: callback, args: args };
	        tasksByHandle[nextHandle] = task;
	        registerImmediate(nextHandle);
	        return nextHandle++;
	    }
	
	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }
	
	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	            case 0:
	                callback();
	                break;
	            case 1:
	                callback(args[0]);
	                break;
	            case 2:
	                callback(args[0], args[1]);
	                break;
	            case 3:
	                callback(args[0], args[1], args[2]);
	                break;
	            default:
	                callback.apply(undefined, args);
	                break;
	        }
	    }
	
	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }
	
	    function installNextTickImplementation() {
	        registerImmediate = function registerImmediate(handle) {
	            process.nextTick(function () {
	                runIfPresent(handle);
	            });
	        };
	    }
	
	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function () {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }
	
	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
	
	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function onGlobalMessage(event) {
	            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };
	
	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }
	
	        registerImmediate = function registerImmediate(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }
	
	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function (event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };
	
	        registerImmediate = function registerImmediate(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }
	
	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function registerImmediate(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }
	
	    function installSetTimeoutImplementation() {
	        registerImmediate = function registerImmediate(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }
	
	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
	
	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();
	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();
	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();
	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();
	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }
	
	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(8)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports = function () {
	    function isThenable(obj) {
	        return obj && obj instanceof Object && typeof obj.then === "function";
	    }
	
	    function resolution(p, r, how) {
	        try {
	            /* 2.2.7.1 */
	            var x = how ? how(r) : r;
	
	            if (p === x) /* 2.3.1 */
	                return p.reject(new TypeError("Promise resolution loop"));
	
	            if (isThenable(x)) {
	                /* 2.3.3 */
	                x.then(function (y) {
	                    resolution(p, y);
	                }, function (e) {
	                    p.reject(e);
	                });
	            } else {
	                p.resolve(x);
	            }
	        } catch (ex) {
	            /* 2.2.7.2 */
	            p.reject(ex);
	        }
	    }
	
	    function Chained() {};
	    Chained.prototype = {
	        resolve: _unchained,
	        reject: _unchained,
	        then: thenChain
	    };
	    function _unchained(v) {}
	    function thenChain(res, rej) {
	        this.resolve = res;
	        this.reject = rej;
	    }
	
	    function then(res, rej) {
	        var chain = new Chained();
	        try {
	            this._resolver(function (value) {
	                return isThenable(value) ? value.then(res, rej) : resolution(chain, value, res);
	            }, function (ex) {
	                resolution(chain, ex, rej);
	            });
	        } catch (ex) {
	            resolution(chain, ex, rej);
	        }
	        return chain;
	    }
	
	    function Thenable(resolver) {
	        this._resolver = resolver;
	        this.then = then;
	    };
	
	    Thenable.resolve = function (v) {
	        return Thenable.isThenable(v) ? v : { then: function then(resolve) {
	                return resolve(v);
	            } };
	    };
	
	    Thenable.isThenable = isThenable;
	
	    return Thenable;
	};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;
	
	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;
	
	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;
	
	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;
	
	/** Detect free variable `self`. */
	var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;
	
	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function now() {
	  return root.Date.now();
	};
	
	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;
	
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	
	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;
	
	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }
	
	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }
	
	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        result = wait - timeSinceLastCall;
	
	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	  }
	
	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;
	
	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	  }
	
	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }
	
	  function trailingEdge(time) {
	    timerId = undefined;
	
	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }
	
	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }
	
	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }
	
	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);
	
	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;
	
	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}
	
	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? other + '' : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}
	
	module.exports = debounce;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _nodentRuntime = __webpack_require__(6);
	
	var _nodentRuntime2 = _interopRequireDefault(_nodentRuntime);
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _domUtils = __webpack_require__(14);
	
	var _constants = __webpack_require__(15);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	var SearchElement = function () {
	  function SearchElement() {
	    var _this = this;
	
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$handleSubmit = _ref.handleSubmit,
	        handleSubmit = _ref$handleSubmit === undefined ? function () {} : _ref$handleSubmit,
	        _ref$searchLabel = _ref.searchLabel,
	        searchLabel = _ref$searchLabel === undefined ? 'search' : _ref$searchLabel,
	        _ref$classNames = _ref.classNames,
	        classNames = _ref$classNames === undefined ? {} : _ref$classNames;
	
	    _classCallCheck(this, SearchElement);
	
	    var container = (0, _domUtils.createElement)('div', ['geosearch', classNames.container].join(' '));
	    var form = (0, _domUtils.createElement)('form', ['', classNames.form].join(' '), container);
	    var input = (0, _domUtils.createElement)('input', ['glass', classNames.input].join(' '), form);
	
	    input.type = 'text';
	    input.placeholder = searchLabel;
	
	    input.addEventListener('input', function (e) {
	      _this.onInput(e);
	    }, false);
	    input.addEventListener('keyup', function (e) {
	      _this.onKeyUp(e);
	    }, false);
	    input.addEventListener('keypress', function (e) {
	      _this.onKeyPress(e);
	    }, false);
	    input.addEventListener('focus', function (e) {
	      _this.onFocus(e);
	    }, false);
	    input.addEventListener('blur', function (e) {
	      _this.onBlur(e);
	    }, false);
	
	    this.elements = { container: container, form: form, input: input };
	    this.handleSubmit = handleSubmit;
	  }
	
	  _createClass(SearchElement, [{
	    key: 'onFocus',
	    value: function onFocus() {
	      (0, _domUtils.addClassName)(this.elements.form, 'active');
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur() {
	      (0, _domUtils.removeClassName)(this.elements.form, 'active');
	    }
	  }, {
	    key: 'onSubmit',
	    value: function onSubmit(event) {
	      return new Promise(function ($return, $error) {
	        var _elements, input, container;
	
	        event.preventDefault();
	        event.stopPropagation();
	
	        _elements = this.elements, input = _elements.input, container = _elements.container;
	
	        (0, _domUtils.removeClassName)(container, 'error');
	        (0, _domUtils.addClassName)(container, 'pending');
	
	        return this.handleSubmit({ query: input.value }).then(function ($await_1) {
	          (0, _domUtils.removeClassName)(container, 'pending');
	          return $return();
	        }.$asyncbind(this, $error), $error);
	      }.$asyncbind(this));
	    }
	  }, {
	    key: 'onInput',
	    value: function onInput() {
	      var container = this.elements.container;
	
	      if (this.hasError) {
	        (0, _domUtils.removeClassName)(container, 'error');
	        this.hasError = false;
	      }
	    }
	  }, {
	    key: 'onKeyUp',
	    value: function onKeyUp(event) {
	      var _elements2 = this.elements,
	          container = _elements2.container,
	          input = _elements2.input;
	
	      if (event.keyCode === _constants.ESCAPE_KEY) {
	        (0, _domUtils.removeClassName)(container, 'pending');
	        (0, _domUtils.removeClassName)(container, 'active');
	
	        input.value = '';
	
	        document.body.focus();
	        document.body.blur();
	      }
	    }
	  }, {
	    key: 'onKeyPress',
	    value: function onKeyPress(event) {
	      if (event.keyCode === _constants.ENTER_KEY) {
	        this.onSubmit(event);
	      }
	    }
	  }, {
	    key: 'setQuery',
	    value: function setQuery(query) {
	      var input = this.elements.input;
	
	      input.value = query;
	    }
	  }]);
	
	  return SearchElement;
	}();
	
	exports.default = SearchElement;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* eslint-disable import/prefer-default-export */
	var createElement = exports.createElement = function createElement(element) {
	  var classNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	  var el = document.createElement(element);
	  el.className = classNames;
	
	  if (parent) {
	    parent.appendChild(el);
	  }
	
	  return el;
	};
	
	var createScriptElement = exports.createScriptElement = function createScriptElement(url, cb) {
	  var script = createElement('script', null, document.body);
	  script.setAttribute('type', 'text/javascript');
	
	  return new Promise(function (resolve) {
	    window[cb] = function (json) {
	      script.remove();
	      delete window[cb];
	      resolve(json);
	    };
	
	    script.setAttribute('src', url);
	  });
	};
	
	var addClassName = exports.addClassName = function addClassName(element, className) {
	  if (element && !element.classList.contains(className)) {
	    element.classList.add(className);
	  }
	};
	
	var removeClassName = exports.removeClassName = function removeClassName(element, className) {
	  if (element && element.classList.contains(className)) {
	    element.classList.remove(className);
	  }
	};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ENTER_KEY = exports.ENTER_KEY = 13;
	var ESCAPE_KEY = exports.ESCAPE_KEY = 27;
	var ARROW_DOWN_KEY = exports.ARROW_DOWN_KEY = 40;
	var ARROW_UP_KEY = exports.ARROW_UP_KEY = 38;
	var ARROW_LEFT_KEY = exports.ARROW_LEFT_KEY = 37;
	var ARROW_RIGHT_KEY = exports.ARROW_RIGHT_KEY = 39;
	
	var SPECIAL_KEYS = exports.SPECIAL_KEYS = [ENTER_KEY, ESCAPE_KEY, ARROW_DOWN_KEY, ARROW_UP_KEY, ARROW_LEFT_KEY, ARROW_RIGHT_KEY];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _domUtils = __webpack_require__(14);
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	var cx = function cx() {
	  for (var _len = arguments.length, classnames = Array(_len), _key = 0; _key < _len; _key++) {
	    classnames[_key] = arguments[_key];
	  }
	
	  return classnames.join(' ').trim();
	};
	
	var ResultList = function () {
	  function ResultList() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$handleClick = _ref.handleClick,
	        handleClick = _ref$handleClick === undefined ? function () {} : _ref$handleClick,
	        _ref$classNames = _ref.classNames,
	        classNames = _ref$classNames === undefined ? {} : _ref$classNames;
	
	    _classCallCheck(this, ResultList);
	
	    _initialiseProps.call(this);
	
	    this.props = { handleClick: handleClick, classNames: classNames };
	    this.selected = -1;
	
	    var container = (0, _domUtils.createElement)('div', cx('results', classNames.container));
	    var resultItem = (0, _domUtils.createElement)('div', cx(classNames.item));
	
	    container.addEventListener('click', this.onClick, true);
	    this.elements = { container: container, resultItem: resultItem };
	  }
	
	  _createClass(ResultList, [{
	    key: 'render',
	    value: function render() {
	      var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	      var _elements = this.elements,
	          container = _elements.container,
	          resultItem = _elements.resultItem;
	
	      this.clear();
	
	      results.forEach(function (result, idx) {
	        var child = resultItem.cloneNode(true);
	        child.setAttribute('data-key', idx);
	        child.innerHTML = result.label;
	        container.appendChild(child);
	      });
	
	      if (results.length > 0) {
	        (0, _domUtils.addClassName)(container, 'active');
	      }
	
	      this.results = results;
	    }
	  }, {
	    key: 'select',
	    value: function select(index) {
	      var container = this.elements.container;
	
	      // eslint-disable-next-line no-confusing-arrow
	
	      Array.from(container.children).forEach(function (child, idx) {
	        return idx === index ? (0, _domUtils.addClassName)(child, 'active') : (0, _domUtils.removeClassName)(child, 'active');
	      });
	
	      this.selected = index;
	      return this.results[index];
	    }
	  }, {
	    key: 'count',
	    value: function count() {
	      return this.results ? this.results.length : 0;
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      var container = this.elements.container;
	
	      this.selected = -1;
	
	      while (container.lastChild) {
	        container.removeChild(container.lastChild);
	      }
	
	      (0, _domUtils.removeClassName)(container, 'active');
	    }
	  }]);
	
	  return ResultList;
	}();
	
	var _initialiseProps = function _initialiseProps() {
	  var _this = this;
	
	  this.onClick = function () {
	    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        target = _ref2.target;
	
	    var handleClick = _this.props.handleClick;
	    var container = _this.elements.container;
	
	    if (target.parentNode !== container || !target.hasAttribute('data-key')) {
	      return;
	    }
	
	    var idx = target.getAttribute('data-key');
	    var result = _this.results[idx];
	    handleClick({ result: result });
	  };
	};
	
	exports.default = ResultList;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _nodentRuntime = __webpack_require__(6);
	
	var _nodentRuntime2 = _interopRequireDefault(_nodentRuntime);
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _provider = __webpack_require__(18);
	
	var _provider2 = _interopRequireDefault(_provider);
	
	var _domUtils = __webpack_require__(14);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	
	var Provider = function (_BaseProvider) {
	  _inherits(Provider, _BaseProvider);
	
	  function Provider() {
	    _classCallCheck(this, Provider);
	
	    return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
	  }
	
	  _createClass(Provider, [{
	    key: 'endpoint',
	    value: function endpoint() {
	      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	          query = _ref.query,
	          protocol = _ref.protocol,
	          jsonp = _ref.jsonp;
	
	      var params = this.options.params;
	
	      var paramString = this.getParamString(_extends({}, params, {
	        query: query,
	        jsonp: jsonp
	      }));
	
	      return protocol + '//dev.virtualearth.net/REST/v1/Locations?' + paramString;
	    }
	  }, {
	    key: 'parse',
	    value: function parse(_ref2) {
	      var data = _ref2.data;
	
	      if (data.resourceSets.length === 0) {
	        return [];
	      }
	
	      return data.resourceSets[0].resources.map(function (r) {
	        return {
	          x: r.point.coordinates[1],
	          y: r.point.coordinates[0],
	          label: r.address.formattedAddress,
	          bounds: [[r.bbox[0], r.bbox[1]], // s, w
	          [r.bbox[2], r.bbox[3]]],
	          raw: r
	        };
	      });
	    }
	  }, {
	    key: 'search',
	    value: function search(_ref3) {
	      return new Promise(function ($return, $error) {
	        var query, protocol, jsonp, url, json;
	        query = _ref3.query;
	
	        protocol = ~location.protocol.indexOf('http') ? location.protocol : 'https:';
	
	        jsonp = 'BING_JSONP_CB_' + Date.now();
	        url = this.endpoint({ query: query, protocol: protocol, jsonp: jsonp });
	
	        return (0, _domUtils.createScriptElement)(url, jsonp).then(function ($await_1) {
	          json = $await_1;
	          return $return(this.parse({ data: json }));
	        }.$asyncbind(this, $error), $error);
	      }.$asyncbind(this));
	    }
	  }]);
	
	  return Provider;
	}(_provider2.default);
	
	exports.default = Provider;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _nodentRuntime = __webpack_require__(6);
	
	var _nodentRuntime2 = _interopRequireDefault(_nodentRuntime);
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	var Provider = function () {
	  function Provider() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Provider);
	
	    this.options = options;
	  }
	
	  _createClass(Provider, [{
	    key: 'getParamString',
	    value: function getParamString(params) {
	      return Object.keys(params).map(function (key) {
	        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	      }).join('&');
	    }
	  }, {
	    key: 'search',
	    value: function search(_ref) {
	      return new Promise(function ($return, $error) {
	        var query, protocol, url, request, json;
	        query = _ref.query;
	
	        protocol = ~location.protocol.indexOf('http') ? location.protocol : 'https:';
	        url = this.endpoint({ query: query, protocol: protocol });
	
	        return fetch(url).then(function ($await_1) {
	          request = $await_1;
	          return request.json().then(function ($await_2) {
	            json = $await_2;
	            return $return(this.parse({ data: json }));
	          }.$asyncbind(this, $error), $error);
	        }.$asyncbind(this, $error), $error);
	      }.$asyncbind(this));
	    }
	  }]);
	
	  return Provider;
	}();
	
	exports.default = Provider;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _provider = __webpack_require__(18);
	
	var _provider2 = _interopRequireDefault(_provider);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	
	var Provider = function (_BaseProvider) {
	  _inherits(Provider, _BaseProvider);
	
	  function Provider() {
	    _classCallCheck(this, Provider);
	
	    return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
	  }
	
	  _createClass(Provider, [{
	    key: 'endpoint',
	    value: function endpoint() {
	      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	          query = _ref.query,
	          protocol = _ref.protocol;
	
	      var params = this.options.params;
	
	      var paramString = this.getParamString(_extends({}, params, {
	        f: 'json',
	        text: query
	      }));
	
	      return protocol + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?' + paramString;
	    }
	  }, {
	    key: 'parse',
	    value: function parse(_ref2) {
	      var data = _ref2.data;
	
	      return data.locations.map(function (r) {
	        return {
	          x: r.feature.geometry.x,
	          y: r.feature.geometry.y,
	          label: r.name,
	          bounds: [[r.extent.ymin, r.extent.xmin], // s, w
	          [r.extent.ymax, r.extent.xmax]],
	          raw: r
	        };
	      });
	    }
	  }]);
	
	  return Provider;
	}(_provider2.default);
	
	exports.default = Provider;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _provider = __webpack_require__(18);
	
	var _provider2 = _interopRequireDefault(_provider);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	
	var Provider = function (_BaseProvider) {
	  _inherits(Provider, _BaseProvider);
	
	  function Provider() {
	    _classCallCheck(this, Provider);
	
	    return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
	  }
	
	  _createClass(Provider, [{
	    key: 'endpoint',
	    value: function endpoint() {
	      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	          query = _ref.query,
	          protocol = _ref.protocol;
	
	      var params = this.options.params;
	
	      var paramString = this.getParamString(_extends({}, params, {
	        address: query
	      }));
	
	      // google requires a secure connection when using api keys
	      var proto = params && params.key ? 'https:' : protocol;
	      return proto + '//maps.googleapis.com/maps/api/geocode/json?' + paramString;
	    }
	  }, {
	    key: 'parse',
	    value: function parse(_ref2) {
	      var data = _ref2.data;
	
	      return data.results.map(function (r) {
	        return {
	          x: r.geometry.location.lng,
	          y: r.geometry.location.lat,
	          label: r.formatted_address,
	          bounds: [[r.geometry.viewport.southwest.lat, r.geometry.viewport.southwest.lng], // s, w
	          [r.geometry.viewport.northeast.lat, r.geometry.viewport.northeast.lng]],
	          raw: r
	        };
	      });
	    }
	  }]);
	
	  return Provider;
	}(_provider2.default);
	
	exports.default = Provider;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _provider = __webpack_require__(18);
	
	var _provider2 = _interopRequireDefault(_provider);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	
	var Provider = function (_BaseProvider) {
	  _inherits(Provider, _BaseProvider);
	
	  function Provider() {
	    _classCallCheck(this, Provider);
	
	    return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
	  }
	
	  _createClass(Provider, [{
	    key: 'endpoint',
	    value: function endpoint() {
	      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	          query = _ref.query,
	          protocol = _ref.protocol;
	
	      var params = this.options.params;
	
	      var paramString = this.getParamString(_extends({}, params, {
	        format: 'json',
	        q: query
	      }));
	
	      return protocol + '//nominatim.openstreetmap.org/search?' + paramString;
	    }
	  }, {
	    key: 'parse',
	    value: function parse(_ref2) {
	      var data = _ref2.data;
	
	      return data.map(function (r) {
	        return {
	          x: r.lon,
	          y: r.lat,
	          label: r.display_name,
	          bounds: [[parseFloat(r.boundingbox[0]), parseFloat(r.boundingbox[2])], // s, w
	          [parseFloat(r.boundingbox[1]), parseFloat(r.boundingbox[3])]],
	          raw: r
	        };
	      });
	    }
	  }]);
	
	  return Provider;
	}(_provider2.default);
	
	exports.default = Provider;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.GetActiveLayerGroups = GetActiveLayerGroups;
	exports.resetPanelState = resetPanelState;
	exports.getLayerGroups = getLayerGroups;
	exports.SetupPanel = SetupPanel;
	exports.updatePanelDragOverlayHeight = updatePanelDragOverlayHeight;
	exports.toggleLayerToolsUI = toggleLayerToolsUI;
	
	var _layer = __webpack_require__(23);
	
	var _opacitySlider = __webpack_require__(31);
	
	var _share = __webpack_require__(27);
	
	var layerGroupLayout = [];
	var layerGroups;
	
	function GetActiveLayerGroups() {
		return layerGroupLayout.filter(function (layerGroup) {
			return layerGroup.active;
		});
	}
	
	function resetPanelState() {}
	
	function getLayerGroups() {
		return layerGroups;
	}
	
	function SetupPanel(layers, layout) {
		layerGroupLayout = layout['layer-groups-order'];
		layerGroups = makeLayerGroups(layout['layer-groups-order']);
		makeLayerElems(layerGroups, layers);
		makePanelDraggable();
		setPanelScrollHandler();
	}
	
	function browserIsInternetExplorer() {
		var ua = window.navigator.userAgent;
		return ua.indexOf('MSIE') > -1 || ua.indexOf('rv:11.0') > -1;
	}
	
	function setPanelScrollHandler() {
		var panel = document.getElementById('right-panel');
		panel.onscroll = updatePanelDragOverlayHeight;
	}
	
	function makePanelDraggable() {
		if (browserIsInternetExplorer()) return;
	
		var overlay = d3.select('#right-panel-drag-overlay');
	
		overlay.style('cursor', 'ew-resize');
	
		overlay.call(d3.drag().on('drag', function () {
			panelDragEventHandler.call(this);
		}));
	}
	
	function panelDragEventHandler() {
		updatePanelDragOverlayHeight();
		updatePanelWidth();
	}
	
	function updatePanelDragOverlayHeight() {
		var panel = d3.select('#right-panel');
		var panelOffsetHeight = panel.property('offsetHeight');
		var panelDragOverlay = document.getElementById('right-panel-drag-overlay');
		var header = document.getElementById('right-panel-header');
	
		var newHeight;
	
		if (panel.classed('graphs-active')) {
			var graphListExtraSpace = 700;
			var graphList = document.getElementById('graph-list');
			newHeight = header.scrollHeight + graphList.scrollHeight + graphListExtraSpace;
		} else {
			// panel.classed('layers-active')
			var layerList = document.getElementById('layer-list');
			newHeight = header.scrollHeight + layerList.scrollHeight;
		}
		newHeight = newHeight > panelOffsetHeight ? "" + newHeight + 'px' : null;
		panelDragOverlay.style.height = newHeight;
	}
	
	function updatePanelWidth() {
		var panel = d3.select('#right-panel');
		var panelMinWidth = +panel.style('min-width').slice(0, -2);
		var panelClientWidth = panel.property('clientWidth');
	
		var wrapper = document.getElementById('wrapper');
		var wrapperWidth = wrapper.clientWidth;
	
		var mapWrapper = document.getElementById('map-wrapper');
	
		var mouseX = d3.event.sourceEvent.x;
		var xDelta = wrapperWidth - mouseX - panelClientWidth;
	
		var newPanelWidth = panelClientWidth + xDelta;
		newPanelWidth = newPanelWidth < panelMinWidth ? panelMinWidth : newPanelWidth > wrapperWidth ? wrapperWidth : newPanelWidth;
		mapWrapper.style.paddingRight = "" + newPanelWidth + 'px';
		panel.style('width', "" + newPanelWidth + 'px');
	}
	
	function makeLayerGroups(layout) {
		return d3.select('#layer-list').selectAll('.layer-group-wrapper').data(layout).enter().append('div').attr('class', 'layer-group-wrapper').attr('id', function (layerGroup) {
			return layerGroup.id;
		}).classed('active', function (layerGroup) {
			return layerGroup.active;
		}).each(function (layerGroup) {
			d3.select(this).append('div').attr('class', 'layer-group-btn btn').on('click', function (layerGroup) {
	
				//send google analytics toggle the layer list accordians
				ga('send', 'event', {
					eventCategory: 'layer list',
					eventAction: 'toggle ' + !layerGroup.active,
					eventLabel: layerGroup.name,
					nonInteraction: false
				});
	
				layerGroup.active = !layerGroup.active;
				d3.select(this.parentNode).classed('active', function () {
					return layerGroup.active;
				});
				updatePanelDragOverlayHeight();
				(0, _share.updateShareUrl)();
			}).text(layerGroup.name);
		}).append('div').attr('class', 'layer-group');
	}
	
	function makeLayerElems(layerGroups, layers) {
		layerGroups.selectAll('.layer-select').data(function (layerGroup) {
			return layers[layerGroup.id];
		}).enter().append('div').attr('class', 'layer-select').each(function (layer) {
			var groupName = this.parentNode.parentNode.id;
			var layerDiv = d3.select(this);
			layer.layerDiv = layerDiv;
			makeCheckbox(layer, layerDiv);
			makeLabel(layer, layerDiv);
			makeDescription(layer, layerDiv);
			layerDiv.node().appendChild(makeLayerTools(layer));
		});
	}
	
	function makeCheckbox(layer, layerDiv) {
		layerDiv.append('input').attr('type', 'checkbox').attr('id', function (layer) {
			return layer.id;
		}).attr('checked', function (layer) {
			return layer.active ? 'checked' : null;
		}).on('click', function (layer) {
			(0, _layer.toggleLayer)(layer);
			toggleLayerToolsUI(layer);
		});
	}
	
	function toggleLayerToolsUI(layer) {
		layer.layerDiv.select('.layer-tools-wrapper').classed('active', layer.active);
		if (layer.active) {
			var sliderHandle = layer.layerDiv.select('.opacity-slider-handle').node();
			(0, _opacitySlider.setOpacitySliderPosition)(layer, sliderHandle, layer.opacitiy);
		}
	}
	
	function makeLabel(layer, layerDiv) {
		layerDiv.append('div').attr('class', 'layer-label-wrapper').append('label').attr('for', function (layer) {
			return layer.id;
		}).attr('class', 'layer-label').html(function (layer) {
			return layer.name;
		});
	}
	
	function makeDescription(layer, layerDiv) {
		if (layer.info && layer.info !== '') {
			layerDiv.append('div').attr('class', 'layer-info-btn-wrapper').on('click', function () {
				d3.select(this.parentNode).select('.layer-info-wrapper').classed('active', function () {
	
					//send google analytics click on layer info
					ga('send', 'event', {
						eventCategory: 'layer info',
						eventAction: 'clicked',
						eventLabel: layer.name + " " + !d3.select(this).classed('active'),
						nonInteraction: false
					});
	
					return !d3.select(this).classed('active');
				});
			}).append('img').attr('class', 'layer-info-icon').attr('src', 'imgs/more-info-icon-64x64.png').attr("alt", "Read more about the " + layer.name + " layer").attr("title", "Read more about the " + layer.name + " layer");
	
			layerDiv.append('div').attr('class', 'layer-info-wrapper').text(function (layer) {
				return layer.info;
			});
		}
	}
	
	function makeLayerTools(layer, layerDiv) {
		var layerToolsDiv = document.createElement('div');
		layerToolsDiv.classList.add('layer-tools-wrapper');
		if (layer.active) layerToolsDiv.classList.add('active');
	
		var opacitySlider = (0, _opacitySlider.makeOpacitySlider)(layer);
		var legend = makeLegend(layer);
	
		layerToolsDiv.appendChild(legend);
		layerToolsDiv.appendChild(opacitySlider);
	
		return layerToolsDiv;
	}
	
	function makeLegend(layer, layerToolsWrapper) {
		var legendWrapper = document.createElement('div');
		var legendImg = document.createElement('img');
		legendWrapper.classList.add('legend-wrapper');
		legendImg.setAttribute('src', layer.legend);
		legendWrapper.appendChild(legendImg);
		return legendWrapper;
	}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.GetCurrentLayers = GetCurrentLayers;
	exports.turnOffNonBaseLayers = turnOffNonBaseLayers;
	exports.CreateDefaultLayers = CreateDefaultLayers;
	exports.toggleLayer = toggleLayer;
	exports.enableLayer = enableLayer;
	exports.disableLayer = disableLayer;
	exports.updateLayerOpacity = updateLayerOpacity;
	
	var _map = __webpack_require__(24);
	
	var _share = __webpack_require__(27);
	
	var _panel = __webpack_require__(22);
	
	/**
	 * Needed for the share url since Leaflet does not have a default way to surface
	 * the order of layers in the map
	 */
	var _current_layers = [];
	var _current_layers_objects = [];
	
	/**
	 * Note: layer is not the leaflet concept of a layer, but rather the internal
	 *       object which tracks them. layer.mapLayer is the pointer to the
	 *       leaflet layer.
	 */
	
	function GetCurrentLayers() {
		return _current_layers;
	}
	
	function turnOffNonBaseLayers() {
		while (_current_layers_objects.length) {
			var layer = _current_layers_objects.pop();
			layer.active = false;
			disableLayer(layer);
			document.getElementById(layer.id).checked = false;
			(0, _panel.toggleLayerToolsUI)(layer);
		}
	}
	
	function CreateDefaultLayers(layers, defaultLayers) {
		var i, j, prop, layergroup;
		var defaultLayer;
		var foundLayer;
	
		if (!defaultLayers || defaultLayers.length === 0) return;
	
		for (i = 0; i < defaultLayers.length; i++) {
			foundLayer = false;
			defaultLayer = defaultLayers[i];
			for (prop in layers) {
				if (!layers.hasOwnProperty(prop)) return;
				layergroup = layers[prop];
				for (j = 0; j < layergroup.length; j++) {
					if (layergroup[j].id === defaultLayer) {
						enableLayer(layergroup[j]);
						foundLayer = true;
						break;
					}
				}
				if (foundLayer) break;
			}
		}
	}
	
	function toggleLayer(layer) {
		if (!layer.active) {
			enableLayer(layer);
	
			//send google analytics toggle the layer on
			ga('send', 'event', {
				eventCategory: 'layer',
				eventAction: 'toggle on',
				eventLabel: layer.name,
				nonInteraction: false
			});
		} else {
			disableLayer(layer);
	
			//send google analytics toggle the layer off
			ga('send', 'event', {
				eventCategory: 'layer',
				eventAction: 'toggle off',
				eventLabel: layer.name,
				nonInteraction: false
			});
		}
	}
	
	function enableLayer(layer) {
		var map = (0, _map.GetMap)();
	
		layer.active = true;
		layer.mapLayer = layer.mapLayer || makeWmsTileLayer(layer);
		map.addLayer(layer.mapLayer);
		addLayerToInternalTracker(layer);
		moveOverlayLayersToTop();
		(0, _share.updateShareUrl)();
	}
	
	function moveOverlayLayersToTop() {
		var layer;
		var i, l;
	
		for (i = 0, l = _current_layers_objects.length; i < l; i++) {
			layer = _current_layers_objects[i];
			if (layer.type === "overlay") layer.mapLayer.bringToFront();
		}
	}
	
	function addLayerToInternalTracker(layer) {
		_current_layers.push(layer.id);
		_current_layers_objects.push(layer);
	}
	
	function disableLayer(layer) {
		var map = (0, _map.GetMap)();
	
		layer.active = false;
		if (layer.mapLayer && map.hasLayer(layer.mapLayer)) {
			map.removeLayer(layer.mapLayer);
		}
		removeLayerFromInternalTracker(layer);
		(0, _share.updateShareUrl)();
	}
	
	function removeLayerFromInternalTracker(layer) {
		var loc = _current_layers.indexOf(layer.id);
		if (loc === -1) return;
		_current_layers.splice(loc, 1);
		_current_layers_objects.splice(loc, 1);
	}
	
	function updateLayerOpacity(layer, newOpacity) {
		layer.opacity = newOpacity;
		layer.mapLayer.setOpacity(newOpacity);
	}
	
	function makeWmsTileLayer(layer) {
		return L.tileLayer.wms(layer.url, {
			layers: layer.id,
			transparent: layer.transparent || true,
			version: layer.version || '1.3.0',
			crs: layer.crs || L.CRS.EPSG900913,
			format: layer.format || 'image/png',
			opacity: layer.opacity || .75,
			tileSize: layer.tileSize || 1024
		});
	}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.clearMap = clearMap;
	exports.CreateMap = CreateMap;
	exports.GetMap = GetMap;
	
	var _poi = __webpack_require__(25);
	
	var _layer = __webpack_require__(23);
	
	var _graph = __webpack_require__(26);
	
	var _panel = __webpack_require__(22);
	
	var _share = __webpack_require__(27);
	
	var map;
	
	function clearMap() {
		(0, _poi.removeAllPointsOfInterest)();
		(0, _graph.removeAllGraphs)();
		(0, _layer.turnOffNonBaseLayers)();
		(0, _panel.resetPanelState)();
		(0, _panel.updatePanelDragOverlayHeight)();
		(0, _share.updateShareUrl)();
	}
	
	function CreateMap(mapConfig) {
		var id = mapConfig.id || "map";
		var options = mapConfig.options || { "scrollWheelZoom": false };
		var initialCenter = mapConfig.center || ["38.5", "-81"];
		var initialZoom = mapConfig.zoom || 6;
	
		map = L.map(id, options).setView(initialCenter, initialZoom);
		L.control.attribution().addTo(map);
	
		var leafletZoomIn = document.getElementsByClassName("leaflet-control-zoom-in")[0];
	
		leafletZoomIn.addEventListener("click", function () {
			//send google analytics for seacrch by address
			ga('send', 'event', {
				eventCategory: 'map',
				eventAction: 'click button',
				eventLabel: 'zoom in',
				nonInteraction: false
			});
		});
	
		var leafletZoomOut = document.getElementsByClassName("leaflet-control-zoom-out")[0];
	
		leafletZoomOut.addEventListener("click", function () {
			//send google analytics for seacrch by address
			ga('send', 'event', {
				eventCategory: 'map',
				eventAction: 'click button',
				eventLabel: 'zoom out',
				nonInteraction: false
			});
		});
	
		map.on("dragend", function (e) {
			//send google analytics for drag (pan) end
			ga('send', 'event', {
				eventCategory: 'map',
				eventAction: 'drag',
				eventLabel: JSON.stringify(map.getBounds()),
				nonInteraction: true
			});
		});
	
		map.on("zoomend", function (e) {
			//send google analytics for zoom end
			ga('send', 'event', {
				eventCategory: 'map',
				eventAction: 'zoom',
				eventLabel: JSON.stringify(map.getBounds()),
				nonInteraction: true
			});
		});
		return map;
	}
	
	function GetMap() {
		return map;
	}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BindGraphEvents = BindGraphEvents;
	exports.removeAllPointsOfInterest = removeAllPointsOfInterest;
	exports.GetAllPointsOfInterest = GetAllPointsOfInterest;
	exports.createPOI = createPOI;
	exports.SetupPointsOfInterest = SetupPointsOfInterest;
	
	var _graph = __webpack_require__(26);
	
	var _marker = __webpack_require__(29);
	
	var _share = __webpack_require__(27);
	
	var _map = __webpack_require__(24);
	
	var _tabs = __webpack_require__(30);
	
	var _panel = __webpack_require__(22);
	
	var _points_of_interest = [];
	
	function BindGraphEvents(map) {
		map.on("click", handleMapClick);
	}
	
	function removeAllPointsOfInterest() {
		var map = (0, _map.GetMap)();
		_points_of_interest.forEach(function (poi) {
			map.removeLayer(poi.marker);
		});
		_points_of_interest = [];
	}
	
	function handleMapClick(e) {
		var map = this;
		var lat = e.latlng.lat;
		var lng = e.latlng.lng;
	
		var poi = createPOI(lat, lng, null);
		AddPointOfInterestToTracker(poi);
		SetupPointOfInterestUI(map, poi);
		(0, _share.updateShareUrl)();
	
		//send google analytics event click on map
		ga('send', 'event', {
			eventCategory: 'map',
			eventAction: 'click',
			eventLabel: JSON.stringify({ "action": "add map marker", "lat": lat, "long": lng }),
			nonInteraction: false
		});
	}
	
	function createGraphRemover(map, div, marker, poi) {
		var elem = createGraphRemoverElem();
		div.getElementsByClassName("graph-elem-header")[0].appendChild(elem);
		d3.select(elem).on("click", function () {
	
			//send google analytics remove graph
			ga('send', 'event', {
				eventCategory: 'graph',
				eventAction: 'click',
				eventLabel: 'remove',
				nonInteraction: false
			});
	
			RemovePointOfInterestFromTracker(poi);
			RemovePointOfInterestUI(map, div, marker);
			(0, _panel.updatePanelDragOverlayHeight)();
			(0, _share.updateShareUrl)();
		});
	}
	
	function createGraphRemoverElem() {
		var elem = document.createElement("button");
		elem.className = "remove-graph";
		elem.innerText = String.fromCharCode("10005");
		elem.setAttribute("title", "Remove graph");
		return elem;
	}
	
	function GetAllPointsOfInterest() {
		return _points_of_interest;
	}
	
	function createPOI(lat, lng, plots) {
		return {
			lat: lat,
			lng: lng,
			plots: plots || ["L10_Day", "L50_Day", "L90_Day", "L10_Night", "L50_Night", "L90_Night"]
		};
	}
	
	function AddPointOfInterestToTracker(poi) {
		_points_of_interest.push(poi);
	}
	
	function SetupPointsOfInterest(map, newPois) {
		AddMultiplePointsOfInterest(newPois);
		var pois = GetAllPointsOfInterest();
		var map = (0, _map.GetMap)();
		pois.forEach(function (poi) {
			SetupPointOfInterestUI(map, poi);
		});
	}
	
	function AddMultiplePointsOfInterest(pois) {
		Array.prototype.push.apply(_points_of_interest, pois);
	}
	
	function RemovePointOfInterestFromTracker(poiToRemove) {
		_points_of_interest = _points_of_interest.filter(function (poi) {
			return !(poi === poiToRemove);
		});
	}
	
	function SetupPointOfInterestUI(map, poi) {
		var div = (0, _graph.createGraphDiv)(poi);
		var marker = (0, _marker.createMarker)(poi.lat, poi.lng);
		poi.graphDiv = div;
		poi.marker = marker;
		marker.addTo(map);
		createGraphRemover(map, div, marker, poi);
	
		d3.select(div).on("mouseenter", function (e) {
			marker.setIcon((0, _marker.getIcon)('hover'));
		});
		d3.select(div).on("mouseleave", function () {
			marker.setIcon((0, _marker.getIcon)('graph'));
		});
		marker.on('click dblclick', function (e) {
			handleMarkerMouseEvent(e, poi);
		});
		marker.on('mouseover', function (e) {
			marker.setIcon((0, _marker.getIcon)('hover'));
		});
		marker.on('mouseout', function (e) {
			marker.setIcon((0, _marker.getIcon)('graph'));
			poi.graphDiv.getElementsByClassName('pan-to-marker-btn')[0].classList.remove('animate');
		});
	}
	
	function handleMarkerMouseEvent(e, poi) {
		e.originalEvent.stopPropagation();
		(0, _tabs.HandleTabChange)('graphs-active');
		scrollToPointOfInterestGraph(poi);
		triggerGraphAnimation(poi);
	}
	
	function triggerGraphAnimation(poi) {
		poi.graphDiv.getElementsByClassName('pan-to-marker-btn')[0].classList.add('animate');
	}
	
	function scrollToPointOfInterestGraph(poi) {
		var rightPanel = document.getElementById('right-panel');
		rightPanel.scrollTop = poi.graphDiv.offsetTop;
	}
	
	function RemovePointOfInterestUI(map, div, marker) {
		var list = document.getElementById('graph-list');
		list.removeChild(div);
		map.removeLayer(marker);
		(0, _share.updateShareUrl)();
	}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SetupGraphs = SetupGraphs;
	exports.removeAllGraphs = removeAllGraphs;
	exports.HandleGraphTabChange = HandleGraphTabChange;
	exports.createGraphDiv = createGraphDiv;
	
	var _panel = __webpack_require__(22);
	
	var _share = __webpack_require__(27);
	
	var _map = __webpack_require__(24);
	
	var _parser = __webpack_require__(2);
	
	var tip = {};
	
	function SetupGraphs() {
	  d3.selectAll(".graph-type-btn").on("click", handleGraphTypeBtnClick);
	  extendDateModule();
	  tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
	    return d;
	  });
	}
	
	function removeAllGraphs() {
	  var graphList = document.getElementById('graph-list');
	  while (graphList.firstChild) {
	    graphList.removeChild(graphList.firstChild);
	  }
	}
	
	function extendDateModule() {
	  Date.prototype.isLeapYear = function () {
	    var year = this.getFullYear();
	    if ((year & 3) != 0) return false;
	    return year % 100 != 0 || year % 400 == 0;
	  };
	
	  // Get Day of Year
	  Date.prototype.getDOY = function () {
	    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	    var mn = this.getMonth();
	    var dn = this.getDate();
	    var dayOfYear = dayCount[mn] + dn;
	    if (mn > 1 && this.isLeapYear()) dayOfYear++;
	    return dayOfYear;
	  };
	}
	
	////////////////////// GRAPH DATA PROCESSING ///////////////////////////////
	
	function handleGraphDataResponse(div, poi, response) {
	  response = response.replace(/\[|\]|\'/g, "").split(", ");
	  drawGraph(response, div, poi);
	  (0, _panel.updatePanelDragOverlayHeight)();
	}
	
	function getData(poi, div) {
	  var url = "https://gis.nemac.org/brrc-data?args=" + poi.lng + "," + poi.lat;
	  var oReq = (0, _parser.GetAjaxObject)(function (response) {
	    handleGraphDataResponse(div, poi, response);
	  });
	
	  oReq.open("GET", url);
	  oReq.send();
	}
	
	function splitData(data) {
	  var i;
	  for (i = 0; i < data.length; i++) {
	    data[i] = data[i].split(",");
	  }
	  return data;
	}
	
	function reprocessData(origData) {
	  return origData.map(function (d, i) {
	    if (d[0].indexOf("SpringAutumn") > -1) {
	      d[0] = d[0].replace("SpringAutumn", i % 2 === 0 ? "Spring" : "Autumn");
	    }
	    return d;
	  });
	}
	
	function computeAverage(arr) {
	  var sum = 0,
	      i,
	      l;
	
	  for (i = 0, l = arr.length; i < l; i++) {
	    sum += arr[i];
	  }
	
	  return (sum / l).toString();
	}
	
	////////////////////// GRAPH INTERFACE ///////////////////////////
	
	function handleGraphTypeBtnClick() {
	  var type = this.getAttribute('data-type');
	  var activeType = document.getElementsByClassName("graph-type-btn active")[0].getAttribute('data-type');
	
	  if (type === activeType) {
	    return;
	  }
	
	  //send google analytics click on graph type
	  ga('send', 'event', {
	    eventCategory: 'graph type',
	    eventAction: 'click',
	    eventLabel: type,
	    nonInteraction: false
	  });
	
	  HandleGraphTabChange(type, activeType);
	}
	
	function HandleGraphTabChange(graphType) {
	  if (!isGraphListEmpty()) {
	    var oldActiveGraphElemHeight = document.getElementsByClassName('graph-elem')[0].scrollHeight;
	    var oldActiveGraphInfoHeight = document.getElementsByClassName('graph-type-info active')[0].scrollHeight;
	    var rightPanelScrollTop = document.getElementById('right-panel').scrollTop;
	  }
	  disableActiveGraphTab();
	  enableGraphTab(graphType);
	  if (!isGraphListEmpty()) adjustScrollPosition(oldActiveGraphInfoHeight, oldActiveGraphElemHeight, rightPanelScrollTop);
	  (0, _share.updateShareUrl)();
	}
	
	function isGraphListEmpty() {
	  return document.getElementsByClassName('graph-elem')[0] === undefined;
	}
	
	function adjustScrollPosition(oldGraphInfoHeight, oldGraphElemHeight, oldRightPanelScrollTop) {
	  var newGraphInfoHeight = document.getElementsByClassName('graph-type-info active')[0].scrollHeight;
	  var newGraphElemHeight = document.getElementsByClassName('graph-elem')[0].scrollHeight;
	
	  var newGraphElemHeightScale = newGraphElemHeight / oldGraphElemHeight;
	  var newRightPanelScrollTop = newGraphInfoHeight + (oldRightPanelScrollTop - oldGraphInfoHeight) * newGraphElemHeightScale;
	
	  document.getElementById('right-panel').scrollTop = newRightPanelScrollTop;
	}
	
	function disableActiveGraphTab() {
	  var activeElem = document.getElementsByClassName("graph-type-btn active")[0];
	  var activeClass = "graph-" + activeElem.getAttribute("data-type");
	
	  activeElem.classList.remove("active");
	  document.getElementById("graph-list").classList.remove(activeClass);
	}
	
	function enableGraphTab(graphType) {
	  d3.select(".graph-type-btn[data-type='" + graphType + "']").classed("active", true);
	  document.getElementById("graph-list").classList.add("graph-" + graphType);
	  d3.selectAll('.graph-type-info').classed('active', function () {
	    return graphType === this.id.split('-')[0];
	  });
	}
	
	function createGraphDiv(poi) {
	  var decimalPlaces = 3;
	  var latShort = roundFloat(poi.lat, decimalPlaces);
	  var lngShort = roundFloat(poi.lng, decimalPlaces);
	  var wrapper = document.createElement("div");
	  var header = document.createElement("div");
	  wrapper.appendChild(header);
	  var zoomToMarkerButton = makeZoomToMapMarkerButton(poi);
	  var content = document.createTextNode("Lat: " + latShort + ", Long: " + lngShort);
	  var contentDiv = document.createElement("div");
	  contentDiv.className = "graph-lat-lon";
	  contentDiv.appendChild(content);
	
	  header.appendChild(zoomToMarkerButton);
	  header.appendChild(contentDiv);
	
	  var loadingDiv = document.createElement("div");
	  loadingDiv.classList.add("graph-loading-div");
	  wrapper.appendChild(loadingDiv);
	
	  wrapper.classList.add("graph-elem");
	  wrapper.classList.add("graph-loading");
	  header.classList.add("graph-elem-header");
	
	  var list = document.getElementById("graph-list");
	  list.appendChild(wrapper);
	  getData(poi, wrapper);
	  return wrapper;
	}
	
	function makeZoomToMapMarkerButton(poi) {
	  var button = document.createElement("button");
	  button.classList.add('btn');
	  button.classList.add('pan-to-marker-btn');
	  button.textContent = "Show On Map";
	  button.onclick = function (poi, e) {
	    var map = (0, _map.GetMap)();
	    map.panTo([poi.lat, poi.lng]);
	
	    //send google analytics click on show on map
	    ga('send', 'event', {
	      eventCategory: 'graph',
	      eventAction: 'click',
	      eventLabel: '{"show on map":{"lat":' + poi.lat + ',"long":' + poi.lng + '}}',
	      nonInteraction: false
	    });
	  }.bind(button, poi);
	  return button;
	}
	
	function drawGraph(data, div, poi) {
	  data = splitData(data);
	  var reprocessedData = reprocessData(data);
	  //makeUpDownLineGraph(data, div);
	  //makeUpDownOverlapingLineGraphWithCheckboxes(reprocessedData, div, poi);
	  drawUpDownPolarWithCheckboxesAndThresholds(reprocessedData, div, poi);
	  div.classList.remove("graph-loading");
	}
	
	function roundFloat(number, decimalPlaces) {
	  return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
	}
	
	///////////////////// TIMESERIES LINE GRAPH ////////////////////////////////
	
	function makeUpDownLineGraph(data, div) {
	  // Set the dimensions of the canvas / graph
	  var margin = { top: 30, right: 20, bottom: 30, left: 29 },
	      width = 580 - margin.left - margin.right,
	      height = 270 - margin.top - margin.bottom;
	
	  // Set the ranges
	  var x = d3.scaleTime().range([0, width]).domain([parseDate(data[0][0]), parseDate(data[data.length - 1][0])]);
	  var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);
	
	  // Define the axes
	  var xAxis = d3.axisBottom(x).ticks(16).tickFormat(function (d) {
	    return d.getFullYear();
	  });
	
	  var yAxis = d3.axisLeft(y).ticks(6);
	
	  // Define the line
	  var valueline = d3.line().x(function (d) {
	    return x(parseDate(d[0]));
	  }).y(function (d) {
	    return y(d[1]);
	  });
	
	  var wrapper = d3.select(div).append("div").classed("timeseries-graph", true);
	
	  // Adds the svg canvas
	  var svg = wrapper.append("svg").attr("height", height + margin.top + margin.bottom).attr('viewBox', function () {
	    var w = width + margin.left + margin.right;
	    var h = height + margin.top + margin.bottom;
	    return '0 0 ' + w + ' ' + h;
	  }).attr('preserveAspectRatio', 'xMidYMid').append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	  svg.call(tip);
	
	  // Add the valueline path.
	  drawLinearPath(data, valueline, svg);
	
	  // Add the X Axis
	  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
	
	  // Add the Y Axis
	  svg.append("g").attr("class", "y axis").call(yAxis);
	  /**
	   * This block of code draws the point at each data point
	   */
	  drawLinearPoints(data, valueline, svg);
	}
	
	///////////////// OVERLAPPING TIMESERIES LINE GRAPH ////////////////
	
	function makeUpDownOverlapingLineGraphWithCheckboxes(data, div, poi) {
	  var charts = {};
	
	  // Set the dimensions of the canvas / graph
	  var margin = { top: 30, right: 20, bottom: 30, left: 29 },
	      width = 500 - margin.left - margin.right,
	      height = 270 - margin.top - margin.bottom;
	
	  var averages = data.baseline;
	
	  var x = d3.scaleLinear().range([0, width]).domain([0, 365]);
	  var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);
	
	  // Define the axes
	  function formatMonthTick(d) {
	    return MONTH_LABELS[(d - 15) / 30];
	  }
	  var xAxis = d3.axisBottom(x).ticks(11).tickValues([15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345]).tickFormat(formatMonthTick);
	
	  var yAxis = d3.axisLeft(y).ticks(6);
	
	  // Define the line
	  var valueline = d3.line().x(function (d, i) {
	    return Array.isArray(d) ? x(parseJulianDay(d[0])) : x(i * 8 + 3);
	  }).y(function (d) {
	    return Array.isArray(d) ? y(d[1]) : y(d);
	  });
	
	  var wrapper = d3.select(div).append("div").classed("overlapping-graph", true);
	
	  // Adds the svg canvas
	  var svg = wrapper.append("svg").attr('viewBox', function () {
	    var w = width + margin.left + margin.right;
	    var h = height + margin.top + margin.bottom;
	    return '0 0 ' + w + ' ' + h;
	  }).attr('preserveAspectRatio', 'xMidYMid')
	  //.attr("width", width + margin.left + margin.right)
	  //.attr("height", height + margin.top + margin.bottom)
	  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	  svg.call(tip);
	
	  // Add the X Axis
	  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
	
	  // Add the Y Axis
	  svg.append("g").attr("class", "y axis").call(yAxis);
	
	  var plot, i, l;
	  for (i = 0, l = poi.plots.length; i < l; i++) {
	    plot = poi.plots[i];
	    if (plot === "thresholds") continue;
	    charts[plot] = {
	      "path": drawLinearPath(data[plot], valueline, svg)
	    };
	  }
	
	  /**
	   * This block of code draws the point at each data point
	   */
	  for (i = 0, l = poi.plots.length; i < l; i++) {
	    plot = poi.plots[i];
	    if (plot === "thresholds") continue;
	    charts[plot].points = drawLinearPoints(data[plot], valueline, svg);
	  }
	
	  var inputwrapper = wrapper.append("div").classed("input-wrapper", true);
	
	  data.keys.forEach(function (key) {
	    createCheckbox(inputwrapper, key, "overlapping", poi, charts, data, valueline, svg, averages);
	  });
	
	  createCheckbox(inputwrapper, "baseline", "overlapping", poi, charts, data, valueline, svg, averages);
	}
	
	///////////////////////// POLAR GRAPH //////////////////////////////////////
	
	function drawUpDownPolarWithCheckboxesAndThresholds(data, div, poi) {
	  var width = 490,
	      height = 490,
	      radius = Math.min(width, height) / 2 - 30;
	
	  //var averages = data["baseline"];
	  //var center = findPolarCenter(data);
	  //var thresholds = findPolarThresholds(averages, center[1][0]);
	
	  /**
	   * Sets up scaling of data. We know that the ndvi values fall between
	   * 0 & 100 so we set our domain to that. The range controls where the
	   * points will lie in our graph, so we set them to be between 0 and the
	   * radius.
	   */
	  var r = d3.scaleLinear().domain([0, 70]).range([0, radius]);
	
	  var line = d3.radialLine().radius(function (d) {
	    return r(d[1]);
	  }).angle(function (d, i) {
	    var val = d[0].indexOf("Spring") > -1 ? 0 : d[0].indexOf("Summer") > -1 ? 1 : d[0].indexOf("Autumn") > -1 ? 2 : 3;
	    return val * (Math.PI / 2);
	  });
	
	  /**
	   * Sets up the canvas where the circle will be drawn.
	   */
	  var wrapper = d3.select(div).append("div").classed("polar-graph", true);
	  var svg = wrapper.append("svg")
	  //.attr("width", width)
	  //.attr("height", height)
	  .attr('viewBox', function () {
	    return '0 0 ' + width + ' ' + height;
	  }).attr('preserveAspectRatio', 'xMidYMid').append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	  svg.call(tip);
	
	  /**
	   * This block of code draws the big circles of the graph & their labels
	   */
	  var gr = svg.append("g").attr("class", "r axis").selectAll("g").data(r.ticks(5).slice(1)).enter().append("g");
	
	  gr.append("circle").attr("r", r);
	
	  gr.append("text").attr("y", function (d) {
	    return -r(d) - 4;
	  }).attr("transform", "rotate(15)").style("text-anchor", "middle").text(function (d) {
	    return d;
	  });
	
	  /**
	  * This block of code draws the labels for each season and the lines
	  * that go out to them.
	  */
	
	  var ga_a = svg.append("g").attr("class", "a axis").selectAll("g").data(d3.range(0, 360, 90)).enter().append("g").attr("transform", function (d) {
	    return "rotate(" + (d - 90) + ")";
	  });
	
	  ga_a.append("line").attr("x2", radius);
	
	  var SEASON_LABELS = ["Spring", "Summer", "Autumn", "Winter"];
	
	  ga_a.append("text").attr("x", radius + 6).attr("dy", ".35em").style("text-anchor", function (d) {
	    return "middle";
	  }).attr("transform", function (d) {
	    var angle = d === 180 ? "270" : "90";
	    return "rotate(" + angle + " " + (radius + 6) + ",0)";
	  }).text(function (d) {
	    return SEASON_LABELS[d / 90];
	  });
	
	  /**
	   * This block of code draws the labels for each month and the lines
	   * that go out to them.
	   */
	
	  /*
	  var ga_a = svg.append("g")
	    .attr("class", "a axis")
	    .selectAll("g")
	    .data(d3.range(0, 360, 30))
	    .enter().append("g")
	      .attr("transform", function(d) { return "rotate(" + (d - 90) + ")"; });
	   ga_a.append("line")
	    .attr("x2", radius);
	   ga_a.append("text")
	    .attr("x", radius + 6)
	    .attr("dy", ".35em")
	    .style("text-anchor", function(d) { return d < 360 && d > 180 ? "end" : null; })
	    .attr("transform", function(d) { return d < 360 && d > 180 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
	    .text(function(d) { return MONTH_LABELS[d/30]; });
	  
	  */
	
	  /**
	   * Draws the threshold lines
	   */
	
	  /*
	  var thresholdElem = svg.append("g")
	    .selectAll("g")
	    .data(thresholds)
	    .enter().append("g")
	      .attr("transform", function(d) { return "rotate(" + (d.data[1][0] - 90) + ")"; });
	   thresholdElem.append("line")
	    .attr("class", "line")
	    .attr("x2", radius);
	   thresholdElem.append("text")
	    .attr("x", function (d) { var day = d.data[1][0]; return day < 360 && day > 180 ? radius + 30 : radius - 30})
	    .attr("y", function (d) { return ((((d.data[1][0])%365)/365) * (2*Math.PI)) + 6; })
	    .attr("dy", ".35em")
	    .style("text-anchor", function(d) { var day = d.data[1][0]; return day < 360 && day > 180 ? "middle" : null; })
	    .attr("transform", function(d) { var day = d.data[1][0]; return day < 360 && day > 180 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
	    .text(function(d) { return d.label; });
	   thresholdElem.style("opacity", (poi.plots.indexOf("thresholds") !== -1) ? 1 : 0);
	  */
	
	  /**
	   * Draws the line to the center of the data
	   */
	
	  /*
	  var centerDay = center[1][0];
	  var centerDayOpposite = (centerDay + (365/2)) % 365;
	  var centerDayData = [centerDay, 100];
	  var centerDayOppositeData = [centerDayOpposite, 100];
	  var growingSeasonData = [centerDayData, centerDayOppositeData]
	   drawPolarPath(growingSeasonData, line, svg)
	    .classed("growing-season-line", "true");
	   drawPolarPath(center, line, svg)
	    .classed("center-line", "true");
	   svg.selectAll("point")
	    .data([center[1]])
	    .enter()
	    .append("circle")
	    .attr("class", "center")
	    .attr("r", 4)
	    .attr("transform", function(d) {
	      var coors = line([d]).slice(1).slice(0, -1);
	      return "translate(" + coors + ")"
	    })
	    .attr("stroke", "#000")
	    .attr("fill", "#ea0c48")
	    .on("mouseover", function(d) {
	      tip.show("Center: "  + String(d[1]).substring(0, 7));
	      this.setAttribute("r", 5)
	    })
	    .on("mouseout", function (d) {
	      tip.hide();
	      this.setAttribute("r", 4)
	    });
	  */
	
	  var charts = {};
	
	  var getSeasonWeight = function getSeasonWeight(str) {
	    return str.indexOf("Spring") > -1 ? 0 : str.indexOf("Summer") > -1 ? 1 : str.indexOf("Autumn") > -1 ? 2 : 3;
	  };
	
	  var sortFunc = function sortFunc(a, b) {
	    var aWeight = getSeasonWeight(a[0]);
	    var bWeight = getSeasonWeight(b[0]);
	    return aWeight - bWeight;
	  };
	
	  var buildPlotData = function buildPlotData(data, plotConditions) {
	    var plotData = data.filter(function (arr) {
	      var toKeep = true;
	      plotConditions.forEach(function (cond) {
	        if (arr[0].indexOf(cond) === -1) {
	          toKeep = false;
	        }
	      });
	      return toKeep;
	    }).sort(sortFunc);
	    // Add the first datapoint to the end of the list so
	    // the polar plot line "completes the circuit"
	    plotData.push(plotData[0]);
	    return plotData;
	  };
	
	  data.plots = {
	    "L10_Day": buildPlotData(data, ["L10", "Day"]),
	    "L50_Day": buildPlotData(data, ["L50", "Day"]),
	    "L90_Day": buildPlotData(data, ["L90", "Day"]),
	    "L10_Night": buildPlotData(data, ["L10", "Night"]),
	    "L50_Night": buildPlotData(data, ["L50", "Night"]),
	    "L90_Night": buildPlotData(data, ["L90", "Night"])
	
	    /**
	     * This block of code draws the line that the data follows
	     */
	  };var plot, i, l;
	  for (i = 0, l = poi.plots.length; i < l; i++) {
	    plot = poi.plots[i];
	    charts[plot] = {
	      "path": drawPolarPath(data.plots[plot], line, svg, plot)
	    };
	  }
	
	  /**
	   * This block of code draws the point at each data point
	   */
	  for (i = 0, l = poi.plots.length; i < l; i++) {
	    plot = poi.plots[i];
	    charts[plot].points = drawLinearPoints(data.plots[plot], line, svg);
	  }
	
	  var inputwrapper = wrapper.append("div").classed("input-wrapper", true);
	
	  Object.keys(data.plots).forEach(function (key) {
	    createCheckbox(inputwrapper, key, "polar", poi, charts, data, line, svg);
	  });
	}
	
	//////////////////////// GRAPH HELPERS ///////////////////////////////////
	
	function drawLinearPath(data, line, svg) {
	  return svg.append("path").attr("class", "line").attr("d", line(data));
	}
	
	function drawPolarPath(data, line, svg, plotName) {
	  return svg.append("path").datum(data)
	  //.attr("class", "line")
	  .attr("d", line).attr("fill", "none").attr("stroke-width", "1px").attr("stroke", function (d) {
	    return pullDistinctColor(d[0][0]);
	  });
	}
	
	function drawLinearPoints(data, line, svg) {
	  return svg.selectAll("point").data(data).enter().append("circle").attr("r", 3).attr("class", "point").attr("transform", function (d, i) {
	    var point = Array.isArray(d) ? d : [i * 8 + 3, d];
	    var coors = line([point]).slice(1).slice(0, -1);
	    return "translate(" + coors + ")";
	  })
	  //.attr("r", 3)
	  .attr("stroke", "#000").attr("fill", function (d, i) {
	    return pullDistinctColor(d[0]);
	  }).on("mouseover", handlePointMouseover).on("mouseout", handlePointMouseout);
	}
	
	function handlePointMouseover(d) {
	  var tipString = d[0] + ': ' + d[1];
	  tip.show(tipString);
	  this.setAttribute("r", "4");
	}
	
	function handlePointMouseout(d) {
	  tip.hide();
	  this.setAttribute("r", "3");
	
	  var activeType = document.getElementsByClassName("graph-type-btn active")[0].getAttribute('data-type');
	
	  //send google analytics tool tip on graph do this on the mouseout so mouseover dose not do a lot of events....
	  // we miss a few but that is better than over counting.
	  ga('send', 'event', {
	    eventCategory: 'graph',
	    eventAction: 'hover',
	    eventLabel: activeType + ' tool tip',
	    nonInteraction: false
	  });
	}
	
	function createCheckbox(wrapper, key, type, poi, charts, data, line, svg) {
	  var checkboxWrapper = wrapper.append("div");
	  var lat = poi.lat;
	  var lng = poi.lng;
	
	  checkboxWrapper.append("input").attr("type", "checkbox").attr("id", type + "-" + key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", "")).attr("data-link", key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", "")).attr("value", key).property("checked", poi.plots.indexOf(key) !== -1 ? true : false).on("change", function (e) {
	    var plotName = this.value;
	    if (!this.checked) {
	      handleCheckboxDisable(charts, plotName);
	      removeKeyFromPOI(poi, key);
	      //send google analytics graph year click off
	      dispatchGraphCheckboxClick(plotName + ' ' + type + ' off');
	    } else {
	      handleCheckboxEnable(charts, plotName, data, line, svg);
	      addKeyToPOI(poi, key);
	      //send google analytics graph year click on
	      dispatchGraphCheckboxClick(plotName + ' ' + type + '  on');
	    }
	    handleCheckboxSync(key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", ""), this.checked);
	    (0, _share.updateShareUrl)();
	  });
	
	  checkboxWrapper.append("label").text(key).attr("for", type + "-" + key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", ""));
	
	  checkboxWrapper.append("div").style("background", pullDistinctColor(key)).classed("graph-pip-example", true);
	}
	
	function handleCheckboxDisable(charts, plotName) {
	  charts[plotName].path.remove();
	  charts[plotName].points.remove();
	}
	
	function handleCheckboxEnable(charts, plotName, data, line, svg) {
	  if (!charts.hasOwnProperty(plotName)) {
	    charts[plotName] = {};
	  }
	  charts[plotName].path = drawPolarPath(data.plots[plotName], line, svg, plotName);
	  charts[plotName].points = drawLinearPoints(data.plots[plotName], line, svg);
	}
	
	function handleCheckboxSync(key, checkedStatus, wrapper) {
	  d3.selectAll("input[data-link='" + key + "']").each(function (p, j) {
	    var elem = d3.select(this);
	    if (elem.property("checked") !== checkedStatus) {
	      elem.property("checked", checkedStatus);
	      elem.dispatch("change");
	    }
	  });
	}
	
	function removeKeyFromPOI(poi, key) {
	  var index = poi.plots.indexOf(key);
	  if (index === -1) return;
	  poi.plots.splice(index, 1);
	}
	
	function addKeyToPOI(poi, key) {
	  if (poi.plots.indexOf(key) !== -1) return;
	  poi.plots.push(key);
	}
	
	function dispatchGraphCheckboxClick(label) {
	  ga('send', 'event', {
	    eventCategory: 'graph',
	    eventAction: 'click',
	    eventLabel: label,
	    nonInteraction: false
	  });
	}
	
	function pullDistinctColor(plotName) {
	  var timeOfDay = plotName.indexOf("Day") > -1 ? "day" : "night";
	  var plotLevel = plotName.indexOf("L10") > -1 ? "L10" : plotName.indexOf("L50") > -1 ? "L50" : "L90";
	  var colorRamp = {
	    "day": {
	      "L10": "#f49141",
	      "L50": "#f4c141",
	      "L90": "#d4f442"
	    },
	    "night": {
	      "L10": "#0b1026",
	      "L50": "#283fa3",
	      "L90": "#3d5adb"
	    }
	  };
	
	  return colorRamp[timeOfDay][plotLevel];
	}
	
	/* POLAR GRAPH HELPERS */
	
	function findPolarCenter(data) {
	  var i, j, length, arr;
	  var totalSum = 0;
	  var incompleteYears = 0;
	  var sum;
	  length = 46;
	
	  for (i = 0; i < data.keys.length; i++) {
	    arr = data[data.keys[i]];
	    if (arr.length !== length) {
	      incompleteYears++;
	      continue;
	    }
	    sum = 0;
	    for (j = 0; j < length / 2; j++) {
	      sum += arr[j][1] - arr[j + 23][1];
	    }
	    sum = sum / 23;
	    totalSum += sum;
	  }
	  totalSum = Math.abs(totalSum) / (data.keys.length - incompleteYears);
	
	  var areaDiff = 1000000;
	  var checkDiff;
	  var areaIndex = 0;
	  var leftArea, rightArea;
	  var avgs = data.baseline;
	  var k, counter;
	
	  for (i = 0; i < length / 2; i++) {
	    leftArea = 0;
	    rightArea = 0;
	    for (counter = 0; counter < length / 2; counter++) {
	      j = (i + counter) % 46;
	      k = (j + 23) % 46;
	
	      leftArea += parseInt(avgs[j], 10);
	      rightArea += parseInt(avgs[k], 10);
	    }
	    checkDiff = Math.abs(leftArea - rightArea);
	    if (checkDiff < areaDiff) {
	      areaDiff = checkDiff;
	      areaIndex = i;
	    }
	  }
	
	  var firstRadius = parseInt(avgs[areaIndex], 10);
	  var secondRadius = parseInt(-avgs[areaIndex + 23], 10);
	
	  var midpoint = (firstRadius + secondRadius) / 2;
	  var firstDiff = Math.abs(totalSum - midpoint);
	  var secondDiff = Math.abs(-totalSum - midpoint);
	  if (secondDiff < firstDiff) {
	    areaIndex = areaIndex + 23;
	  }
	
	  var circlecenter = [0, 0];
	  var datacenter = [areaIndex * 8 + 3, totalSum];
	
	  return [circlecenter, datacenter];
	}
	
	/**
	 * startDay is actually the seasonality index, it should be flipped
	 */
	function findPolarThresholds(data, startDay) {
	  var startIndex = Math.floor((startDay - 3) / 8);
	  startIndex += startIndex > 22 ? -23 : 23;
	  var i, j, length, arr;
	  var totalSum = 0;
	  var sum;
	  length = 46;
	
	  for (i = 0; i < length; i++) {
	    j = (startIndex + i) % length;
	    totalSum += parseInt(data[j], 10);
	  }
	
	  var fifteenThreshold = totalSum * .15;
	  var eightyThreshold = totalSum * .80;
	  var fifteenIndexFound = false,
	      eightyIndexFound = false;
	  var fifteenIndex, eightyIndex;
	
	  totalSum = 0;
	  for (i = 0; i < length; i++) {
	    j = (startIndex + i) % length;
	    totalSum += parseInt(data[j], 10);
	    if (!fifteenIndexFound && totalSum > fifteenThreshold) {
	      fifteenIndex = j;
	      fifteenIndexFound = true;
	      continue;
	    }
	    if (!eightyIndexFound && totalSum > eightyThreshold) {
	      eightyIndex = j;
	      eightyIndexFound = true;
	      continue;
	    }
	  }
	
	  var circleCenter = [0, 0];
	
	  var fifteenEnd = [fifteenIndex * 8 + 3, 100];
	  var eightyEnd = [eightyIndex * 8 + 3, 100];
	
	  return [{
	    "label": "15%",
	    "data": [circleCenter, fifteenEnd]
	  }, {
	    "label": "80%",
	    "data": [circleCenter, eightyEnd]
	  }];
	}
	
	///////////////////////// DATE HELPERS /////////////////////////////////
	
	function parseDate(date) {
	  date = date.toString();
	  var year = date.substring(0, 4);
	  var month = parseInt(date.substring(4, 6), 10) - 1;
	  var day = date.substring(6, 8);
	
	  return new Date(year, month, day);
	}
	
	function parseJulianDay(date) {
	  if (typeof date === "string") {
	    date = parseDate(date);
	    return date.getDOY();
	  } else {
	    return date;
	  }
	}
	
	function formatDate(date) {
	  if (date === "Average") {
	    return date;
	  }
	
	  date = parseDate(date);
	  return formatMonth(date.getMonth()) + " " + ordinal_suffix_of(date.getDate()) + ", " + date.getFullYear();
	}
	
	function formatMonth(month) {
	  return FORMATTED_MONTH_LABELS[month];
	}
	
	function ordinal_suffix_of(day) {
	  var j = day % 10,
	      k = day % 100;
	  if (j === 1 && k !== 11) {
	    return day + "st";
	  }
	  if (j === 2 && k !== 12) {
	    return day + "nd";
	  }
	  if (j === 3 && k !== 13) {
	    return day + "rd";
	  }
	  return day + "th";
	}
	
	var MONTH_LABELS = {
	  0: "Jan",
	  1: "Feb",
	  2: "Mar",
	  3: "Apr",
	  4: "May",
	  5: "Jun",
	  6: "Jul",
	  7: "Aug",
	  8: "Sep",
	  9: "Oct",
	  10: "Nov",
	  11: "Dec"
	};
	
	var FORMATTED_MONTH_LABELS = {
	  0: "Jan.",
	  1: "Feb.",
	  2: "Mar.",
	  3: "Apr.",
	  4: "May",
	  5: "Jun.",
	  6: "Jul.",
	  7: "Aug.",
	  8: "Sep.",
	  9: "Oct.",
	  10: "Nov.",
	  11: "Dec."
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BindUpdateShareUrl = BindUpdateShareUrl;
	exports.updateShareUrl = updateShareUrl;
	exports.AddShareSettingsToConfig = AddShareSettingsToConfig;
	exports.BindCopyLinkEvents = BindCopyLinkEvents;
	
	var _map = __webpack_require__(24);
	
	var _baselayer = __webpack_require__(28);
	
	var _layer = __webpack_require__(23);
	
	var _poi = __webpack_require__(25);
	
	var _panel = __webpack_require__(22);
	
	function BindUpdateShareUrl(map) {
		map.on("moveend", updateShareUrl);
	}
	
	function updateShareUrl(e) {
		var map = (0, _map.GetMap)();
	
		var params = [makeCenterString(map), makeZoomString(map), makeLayerString(map), makeLayerGroupsString(), makeBaseLayerString(map), makePointsOfInterestString(), makeActiveTabString(), makeActiveGraphTabString()];
	
		setShareUrl(makeShareUrl(params));
		setCopyLinkUrl();
		setSocialUrls();
	}
	
	function AddShareSettingsToConfig(config) {
		var share = parseShareUrl();
		if (!share) return;
		if (share.center) config.map.center = share.center;
		if (share.zoom) config.map.zoom = share.zoom;
		if (share.layers) addLayerSettingsToConfig(share.layers, config);
		if (share.baselayers) addBaseLayerSettingsToConfig(share.baselayers, config);
		if (share.pois) addPointsOfInterestToConfig(share.pois, config);
		if (share.tab) config.tab = share.tab;
		if (share.graph) config.graph = share.graph;
		if (share.layerGroups) config.layerGroups = addLayerGroupSettingsToConfig(share.layerGroups, config);
	}
	
	function makeShareUrl(params) {
		return "?" + params.filter(function (p) {
			return p !== undefined;
		}).join("&");
	}
	
	function setShareUrl(url) {
		if (window.history && window.history.replaceState) {
			window.history.replaceState({}, "", url);
		}
	}
	
	function setCopyLinkUrl() {
		var url = window.location.href;
		document.getElementById("shareurl-link-url").setAttribute("value", url);
	}
	
	function BindCopyLinkEvents() {
		d3.select(document).on("click", handleBodyClick);
		d3.select(".shareurl-link a").on("click", handleShareLinkButtonClick);
		d3.select(".shareurl-link-url").on("click", handleShareLinkUrlClick);
		d3.select(".shareurl-link-popup-remover").on("click", handleShareLinkCloseButtonClick);
	}
	
	/**
	 * Should close the copy link popup if it is active and if you click on any element
	 * that is not the popup or its children.
	 */
	function handleBodyClick() {
		var event = d3.event;
		var nodePath = [];
		nodePath = getDomPath(event.target);
	
		var toClosePopup = true;
		var i, l;
	
		for (i = 0, l = nodePath.length; i < l; i++) {
			try {
				if (nodePath[i].classList.contains('shareurl-link-popup') || nodePath[i].classList.contains('shareurl-link')) {
					toClosePopup = false;
					break;
				}
			} catch (e) {
				// clicking svg throws an error in IE
			}
		}
	
		if (toClosePopup) {
			var sharePopup = document.getElementsByClassName('shareurl-link-popup').item(0);
			handleCopyLinkClose(sharePopup);
		}
	}
	
	function getDomPath(node) {
		var path = [];
		while (node && node.parentNode) {
			path.push(node);
			node = node.parentNode;
		}
		return path;
	}
	
	function handleShareLinkButtonClick() {
		var sharePopup = document.getElementsByClassName("shareurl-link-popup").item(0);
		if (d3.select(sharePopup).classed("active")) {
			handleCopyLinkClose(sharePopup);
		} else {
			handleCopyLinkOpen(sharePopup);
		}
	}
	
	function handleShareLinkCloseButtonClick() {
		var sharePopup = document.getElementsByClassName("shareurl-link-popup").item(0);
		handleCopyLinkClose(sharePopup);
	}
	
	function handleShareLinkUrlClick() {
		selectCopyLinkUrl();
	}
	
	function handleCopyLinkOpen(sharePopup) {
		sharePopup.classList.toggle("active");
		selectCopyLinkUrl();
	
		//send google analytics event click on share url
		ga('send', 'event', {
			eventCategory: 'shareurl',
			eventAction: 'open',
			eventLabel: document.getElementById("shareurl-link-url").getAttribute("value"),
			nonInteraction: false
		});
	}
	
	function handleCopyLinkClose(sharePopup) {
	
		//send google analytics event click on share url close
		ga('send', 'event', {
			eventCategory: 'shareurl',
			eventAction: 'close',
			eventLabel: document.getElementById("shareurl-link-url").getAttribute("value"),
			nonInteraction: false
		});
	
		sharePopup.classList.remove("active");
	}
	
	function selectCopyLinkUrl() {
		var shareInput = document.getElementById("shareurl-link-url");
		shareInput.focus();
		shareInput.setSelectionRange(0, shareInput.value.length);
	}
	
	function setSocialUrls() {
		var url = mangleParamString(window.location.href);
		var socialLinks = document.getElementsByClassName("shareurl-social");
		var socialLink;
		var newUrl;
		var i, l;
	
		for (i = 0, l = socialLinks.length; i < l; i++) {
			socialLink = socialLinks[i];
	
			newUrl = socialLink.getAttribute("data-baseurl") + url;
			socialLink.setAttribute("href", newUrl);
	
			//send google analytics event for social urls
			socialLink.addEventListener('click', function () {
	
				ga('send', 'event', {
					eventCategory: 'shareurl',
					eventAction: this.getAttribute("aria-label"),
					eventLabel: this.href,
					nonInteraction: false
				});
			});
		}
	}
	
	function makeCenterString(map) {
		var center = map.getCenter();
		return "center=" + center.lat.toString() + "," + center.lng.toString();
	}
	
	function makeZoomString(map) {
		return "zoom=" + map.getZoom();
	}
	
	function makeLayerString(map) {
		var layers = [];
		var opacityVals = {};
		var currentLayers = (0, _layer.GetCurrentLayers)();
	
		map.eachLayer(function (layer) {
			var options = layer.options;
			if (options && options.layers) {
				opacityVals[options.layers] = options.hasOwnProperty("opacity") ? options.opacity : "1";
			}
		});
	
		var currentLayer;
		var i;
		for (i = 0; i < currentLayers.length; i++) {
			currentLayer = currentLayers[i];
			layers.push(currentLayer);
			layers.push(opacityVals[currentLayer]);
		}
		return "layers=" + layers.join(",");
	}
	
	function makeBaseLayerString(map) {
		var layers = [];
		map.eachLayer(function (layer) {
			if (layer.options && layer.options.type === _baselayer.BASE_LAYER_TYPE) {
				layers.push(layer.options.id);
			}
		});
		return "baselayers=" + layers.join(",");
	}
	
	function makeLayerGroupsString() {
		var activeLayerGroups = (0, _panel.GetActiveLayerGroups)();
		return "layerGroups=" + activeLayerGroups.map(function (d) {
			return d.id;
		}).join(',');
	}
	
	function makePointsOfInterestString() {
		var pois = (0, _poi.GetAllPointsOfInterest)();
		if (!pois.length) return;
		var poiString = "pois=";
		pois.forEach(function (poi) {
			poiString += poi.lat + ',' + poi.lng;
			if (poi.plots && poi.plots.length) {
				poiString += ',' + poi.plots.join(',');
			}
			poiString += ';';
		});
		return poiString;
	}
	
	function makeActiveTabString() {
		return "tab=" + d3.select(".panel-top-btn.active").attr("data-active");
	}
	
	function makeActiveGraphTabString() {
		return "graph=" + d3.select(".graph-type-btn.active").attr("data-type");
	}
	
	function parseShareUrl() {
		var params = window.location.search;
		if (params === "") return;
	
		params = getParamsArray(params);
		params = makeKeyedParamsObject(params);
	
		formatParams(params);
		return params;
	}
	
	function getParamsArray(params) {
		params = params.substring(1);
		params = unmangleParamString(params);
		return params.split("&");
	}
	
	function mangleParamString(url) {
		return url.replace(/\:/g, "%3A").replace(/\;/g, "%3B").replace(/\//g, "%2F").replace(/\,/g, "%2C").replace(/\&/g, "%26");
	}
	
	function unmangleParamString(params) {
		return params.replace(/\%2[c|C]/g, ",").replace(/\%3[b|B]/g, ";");
	}
	
	function makeKeyedParamsObject(paramsArr) {
		var parsedParams = {};
		var paramPair;
		var i;
	
		for (i = 0; i < paramsArr.length; i++) {
			paramPair = paramsArr[i].split("=");
			parsedParams[paramPair[0]] = paramPair[1];
		}
	
		return parsedParams;
	}
	
	function formatParams(params) {
		if (params.center) params.center = formatCenterParam(params.center);
		if (params.layers) params.layers = formatLayerParam(params.layers);
		if (params.baselayers) params.baselayers = formatBaseLayerParam(params.baselayers);
		if (params.pois) params.pois = formatPointsOfInterestParam(params.pois);
		if (params.layerGroups) params.layerGroups = formatLayerGroupsParam(params.layerGroups);
	}
	
	function formatCenterParam(center) {
		return center.split(",");
	}
	
	function formatLayerParam(layers) {
		var formattedLayers = {
			"enabledLayers": [],
			"opacityVals": {}
		};
		var layerId;
		var i;
	
		layers = layers.split(",");
		for (i = 0; i < layers.length; i = i + 2) {
			layerId = layers[i];
			formattedLayers.enabledLayers.push(layerId);
			formattedLayers.opacityVals[layerId] = layers[i + 1];
		}
	
		return formattedLayers;
	}
	
	function formatBaseLayerParam(baselayers) {
		return baselayers.split(",");
	}
	
	function formatPointsOfInterestParam(pois) {
		return pois.split(';').filter(function (str) {
			return str !== '';
		}).map(function (poi) {
			poi = poi.split(',');
			if (poi.length > 2) {
				return (0, _poi.createPOI)(poi[0], poi[1], poi.splice(2));
			} else {
				return (0, _poi.createPOI)(poi[0], poi[1], null);
			}
		});
	}
	
	function formatLayerGroupsParam(layerGroupSettings) {
		return layerGroupSettings.split(',');
	}
	
	function addLayerGroupSettingsToConfig(activeLayerGroupIds, config) {
		config.layout['layer-groups-order'].forEach(function (layerGroup) {
			// set layer group to active if its id appears in the share url settings
			layerGroup.active = activeLayerGroupIds.filter(function (id) {
				return id === layerGroup.id;
			}).length > 0;
		});
	}
	
	function addLayerSettingsToConfig(shareLayerSettings, config) {
		var enabledLayers = shareLayerSettings.enabledLayers;
		config["active-layers"] = enabledLayers;
	
		var i, j, prop, layergroup;
		var enabledLayer;
		var foundLayer;
		var layers = config.layers;
	
		for (i = 0; i < enabledLayers.length; i++) {
			foundLayer = false;
			enabledLayer = enabledLayers[i];
			for (prop in layers) {
				if (!layers.hasOwnProperty(prop)) return;
				layergroup = layers[prop];
				for (j = 0; j < layergroup.length; j++) {
					if (layergroup[j].id === enabledLayer) {
						layergroup[j].opacity = shareLayerSettings.opacityVals[enabledLayer];
						foundLayer = true;
						break;
					}
				}
				if (foundLayer) break;
			}
		}
	}
	
	function addBaseLayerSettingsToConfig(shareBaseLayerSettings, config) {
		var baselayers = config.baselayers;
		var baselayer;
		var i;
	
		for (i = 0; i < baselayers.length; i++) {
			baselayer = baselayers[i];
			baselayer.active = shareBaseLayerSettings.indexOf(baselayer.id) !== -1 ? true : false;
		}
	}
	
	function addPointsOfInterestToConfig(pois, config) {
		config["pois"] = pois;
	}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BASE_LAYER_TYPE = undefined;
	exports.CreateBaseLayers = CreateBaseLayers;
	
	var _map = __webpack_require__(24);
	
	var _share = __webpack_require__(27);
	
	var BASE_LAYER_TYPE = exports.BASE_LAYER_TYPE = "baselayer";
	
	var _baselayers;
	
	function CreateBaseLayers(map, layerConfig) {
		layerConfig = layerConfig || [{
			"id": "carto-light-default",
			"url": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
			"attribution": '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
		}];
	
		_baselayers = layerConfig;
		var i;
		var baseLayer;
		var config;
	
		for (i = 0; i < layerConfig.length; i++) {
			config = layerConfig[i];
	
			if (!config.active) continue;
			baseLayer = createBaseLayer(config);
			config.layer = baseLayer;
			baseLayer.addTo(map);
		}
	
		createBaseLayerUI(layerConfig);
	}
	
	function createBaseLayerUI(config) {
		var baseUI = document.createElement("div");
		baseUI.className = "baselayer-ui";
		var baseWrapper;
		var baseImg;
		var baseLabel;
	
		var layer;
		for (var i = 0, l = config.length; i < l; i++) {
			layer = config[i];
			if (!layer.hasOwnProperty("image")) continue;
	
			baseWrapper = document.createElement("div");
			baseWrapper.setAttribute("data-layer", layer.id);
			baseImg = document.createElement("img");
			baseImg.setAttribute("src", layer.image);
			baseImg.setAttribute("alt", layer.label);
			baseImg.setAttribute("title", layer.label);
			baseLabel = document.createElement("div");
			baseLabel.textContent = layer.label;
			baseWrapper.appendChild(baseImg);
			baseWrapper.appendChild(baseLabel);
			baseWrapper.addEventListener("click", handleBaseClick);
	
			d3.select(baseWrapper).classed("base-selector", true).classed("active", layer.active);
	
			baseUI.appendChild(baseWrapper);
		}
	
		document.getElementsByClassName("leaflet-bottom leaflet-left")[0].appendChild(baseUI);
	}
	
	function handleBaseClick(e) {
		e.stopPropagation();
		var layerid = this.getAttribute("data-layer");
		toggleActiveBaseUI(this);
		removeCurrentBaseLayer();
		addNewBaseLayerToMap(layerid);
	
		//send google analytics for changeing base layer
		ga('send', 'event', {
			eventCategory: 'map',
			eventAction: 'change base layer',
			eventLabel: layerid,
			nonInteraction: false
		});
	
		(0, _share.updateShareUrl)();
	}
	
	function toggleActiveBaseUI(baseUIElem) {
		d3.select(".base-selector.active").classed("active", false);
		d3.select(baseUIElem).classed("active", true);
	}
	
	function removeCurrentBaseLayer() {
		var map = (0, _map.GetMap)();
	
		map.eachLayer(function (layer) {
			if (layer.options.type !== BASE_LAYER_TYPE) return;
			map.removeLayer(layer);
		});
	}
	
	function addNewBaseLayerToMap(layerid) {
		var map = (0, _map.GetMap)();
	
		var layer;
		for (var i = 0, l = _baselayers.length; i < l; i++) {
			layer = _baselayers[i];
			if (layer.id !== layerid) continue;
			if (!layer.layer) layer.layer = createBaseLayer(layer);
			layer.layer.addTo(map);
			layer.layer.bringToBack();
			break;
		}
	}
	
	function createBaseLayer(layerConfig) {
		return L.tileLayer(layerConfig.url, makeBaseLayerOptions(layerConfig));
	}
	
	function makeBaseLayerOptions(config) {
		var options = {};
		if (config.id) options.id = config.id;
		if (config.attribution) options.attribution = config.attribution;
		if (config.subdomains) options.subdomains = config.subdomains;
		options.type = BASE_LAYER_TYPE;
	
		return options;
	}

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createMarker = createMarker;
	exports.getIcon = getIcon;
	function createMarker(lat, lng) {
		return L.marker([lat, lng], { icon: graphIcon });
	}
	
	function getIcon(type) {
		return type === 'hover' ? hoverIcon : graphIcon;
	}
	
	var baseIcon = L.Icon.extend({});
	
	var graphIcon = new baseIcon({
		iconUrl: 'imgs/blue_icon.png',
		shadowUrl: 'imgs/marker_shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
	
	var hoverIcon = new baseIcon({
		iconUrl: 'imgs/orange_icon.png',
		shadowUrl: 'imgs/marker_shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BindTabEvents = BindTabEvents;
	exports.GetActiveTab = GetActiveTab;
	exports.HandleTabChange = HandleTabChange;
	
	var _panel = __webpack_require__(22);
	
	var _share = __webpack_require__(27);
	
	function BindTabEvents() {
		d3.selectAll(".panel-top-btn").on("click", handleTabHeaderBtnClick);
	}
	
	function GetActiveTab() {
		return document.getElementsByClassName("panel-top-btn active")[0].getAttribute("data-active");
	}
	
	function handleTabHeaderBtnClick() {
		// If the section is already active, do nothing
		if (this.classList.contains("active")) return;
	
		//send google analytics click on graph type
		ga('send', 'event', {
			eventCategory: 'tab',
			eventAction: 'click',
			eventLabel: this.getAttribute("data-active"),
			nonInteraction: false
		});
	
		HandleTabChange(this.getAttribute("data-active"));
	}
	
	function HandleTabChange(newClass) {
		disableActiveTab();
		enableTab(newClass);
		(0, _share.updateShareUrl)();
	}
	
	function enableTab(newClass) {
		d3.select(".panel-top-btn[data-active='" + newClass + "']").classed("active", true);
	
		document.getElementById("map-wrapper").classList.add(newClass);
		document.getElementById("right-panel").classList.add(newClass);
	
		d3.select(".panel-section-wrapper[data-active='" + newClass + "']").classed("active", true);
	
		toggleMapPadding();
		resetPanelWidth();
		(0, _panel.updatePanelDragOverlayHeight)();
	}
	
	function disableActiveTab() {
		var activeClass = d3.select(".panel-top-btn.active").attr("data-active");
	
		d3.selectAll('#map-wrapper, #right-panel').classed(activeClass, false);
	
		d3.selectAll('.panel-top-btn.active, .panel-section-wrapper.active').classed('active', false);
	}
	
	function toggleMapPadding() {
		var paddingRight = document.getElementById("right-panel").offsetWidth;
		document.getElementById("map-wrapper").style.paddingRight = paddingRight + "px";
	}
	
	/**
	 * Since the panel has child elements with position fixed and width inherit
	 * we need to clear the inline width property if and only if the inline
	 * width is less than the min width
	 */
	function resetPanelWidth() {
		var panel = document.getElementById("right-panel");
		var width = panel.style.width;
		if (!width) return;
	
		var panelMinWidth = d3.select(panel).style('min-width').slice(0, -2);
		if (parseInt(width.slice(0, -2), 10) > parseInt(panelMinWidth, 10)) return;
	
		panel.style.width = "";
	}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.setOpacitySliderPosition = setOpacitySliderPosition;
	exports.makeOpacitySlider = makeOpacitySlider;
	
	var _share = __webpack_require__(27);
	
	var _layer = __webpack_require__(23);
	
	// set it manually for now
	var OPACITY_RANGE_MAX = 90;
	
	var opacityScale = d3.scaleLinear().domain([1, 0]).range([0, OPACITY_RANGE_MAX]).clamp(true);
	
	function setOpacitySliderPosition(layer, sliderHandle, opacity) {
		opacity = opacity || layer.opacity;
		sliderHandle.style.top = '' + opacityScale(opacity) + 'px';
	}
	
	function makeOpacitySlider(layer) {
		var layerOpacity = layer.opacity !== undefined ? layer.opacity : 1;
		var wrapper = document.createElement('div');
		var sliderTrackOverlay = makeSliderTrack(layer, layerOpacity);
		var iconWrapperClosed = makeOpacityIconWrapper('closed', layer, sliderTrackOverlay);
	
		wrapper.classList.add('opacity-slider-wrapper');
		wrapper.appendChild(sliderTrackOverlay);
		wrapper.appendChild(iconWrapperClosed);
		return wrapper;
	}
	
	function makeOpacityIconWrapper(state, layer, sliderTrackOverlay) {
		var wrapper = document.createElement('div');
		var icon = document.createElement('img');
		wrapper.classList.add('opacity-icon-wrapper');
		icon.classList.add('opacity-icon');
		icon.classList.add(state);
		icon.setAttribute('src', 'imgs/opacity-icon-' + state + '-64x64.png');
		icon.setAttribute('alt', 'Use this slider to adjust transparency for the ' + layer.name + ' layer');
		icon.setAttribute('title', 'Use this slider to adjust transparency for the ' + layer.name + ' layer');
		wrapper.appendChild(icon);
		wrapper.onclick = function (e) {
			var sliderHandle = sliderTrackOverlay.getElementsByClassName('opacity-slider-handle')[0];
			(0, _layer.updateLayerOpacity)(layer, 0);
			setOpacitySliderPosition(layer, sliderHandle, 0);
		};
		return wrapper;
	}
	
	function makeSliderTrack(layer, layerOpacity) {
	
		var overlay = document.createElement('div');
		var track = document.createElement('div');
		var sliderHandle = document.createElement('div');
	
		overlay.classList.add('opacity-slider-track-overlay');
		track.classList.add('opacity-slider-track');
		sliderHandle.classList.add('opacity-slider-handle');
	
		overlay.appendChild(track);
		overlay.appendChild(sliderHandle);
	
		if (layer.active) setOpacitySliderPosition(layer, sliderHandle);
		setDragEventListener(overlay, layer, layerOpacity);
	
		return overlay;
	}
	
	function setDragEventListener(overlay, layer, layerOpacity) {
		d3.select(overlay).call(d3.drag().on('start drag', function () {
			var sliderHandle = overlay.getElementsByClassName('opacity-slider-handle')[0];
			var newOpacity = calcOpacityFromMousePos(overlay);
			(0, _layer.updateLayerOpacity)(layer, newOpacity);
			setOpacitySliderPosition(layer, sliderHandle, newOpacity);
		}).on('end', function () {
	
			var newOpacity = calcOpacityFromMousePos(overlay);
	
			//send google analytics opacity slider change
			ga('send', 'event', {
				eventCategory: 'opacity slider',
				eventAction: 'change',
				eventLabel: '{"' + layer.name + '": "' + newOpacity + '"}',
				nonInteraction: false
			});
	
			(0, _share.updateShareUrl)();
		}));
	}
	
	function calcOpacityFromMousePos(overlay) {
		var yPos = d3.mouse(overlay)[1];
		var newOpacity = opacityScale.invert(yPos);
		return newOpacity;
	}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = CreateLogo;
	/*
	  "logo": {
		"image": "imgs/landat_logo_blue.png",
		"alt": "Logo for the LanDat project",
		"link": "https://landat-dev.nemac.org",
		"location": ["bottom", "right"]
	  },
	*/
	
	function CreateLogo(logodata) {
		if (!logodata.image) return;
	
		var logoWrapper = createLogoWrapper();
		var logoImage = createLogoImage(logodata);
		var logoLink = logodata.link ? createLogoLink(logodata.link) : null;
	
		if (logoLink) {
			logoLink.appendChild(logoImage);
			logoWrapper.appendChild(logoLink);
		} else {
			logoWrapper.appendChild(logoImage);
		}
	
		var insertElement = document.getElementsByClassName(logodata.location)[0];
		var existingChild = insertElement.firstChild;
		insertElement.insertBefore(logoWrapper, existingChild);
	}
	
	function createLogoWrapper() {
		var logoWrapper = document.createElement("div");
		d3.select(logoWrapper).classed("project-logo", true);
		return logoWrapper;
	}
	
	function createLogoImage(logodata) {
		var logoImage = document.createElement("img");
		logoImage.setAttribute("src", logodata.image);
		if (logodata.label) {
			logoImage.setAttribute("alt", logodata.label);
			logoImage.setAttribute("title", logodata.label);
		}
		return logoImage;
	}
	
	function createLogoLink(link) {
		var logoLink = document.createElement("a");
		logoLink.setAttribute("href", link);
		logoLink.setAttribute("target", "_blank");
	
		logoLink.addEventListener('click', function () {
	
			//send google analytics for clicking logo
			ga('send', 'event', {
				eventCategory: 'map',
				eventAction: 'click',
				eventLabel: 'landat logo',
				nonInteraction: false
			});
		});
	
		return logoLink;
	}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = BindMobileMenuEvents;
	
	var _map = __webpack_require__(24);
	
	function BindMobileMenuEvents() {
		d3.select("#mobile-toggle-panel-button").on("click", handleMobileTogglePanelBtnClick);
		d3.selectAll("#mobile-clear-map-button").on("click", handleMobileClearMapBtnClick);
	}
	
	function handleMobileClearMapBtnClick() {
		d3.event.stopPropagation();
		(0, _map.clearMap)();
		dispatchMobileClearMapBtnClickAnalytics();
	}
	
	function handleMobileTogglePanelBtnClick() {
		d3.event.stopPropagation();
		var wrapper = d3.select("#wrapper");
		var status = wrapper.classed("mobile-menu-hidden");
		wrapper.classed("mobile-menu-hidden", !status);
		dispatchMobileTogglePanelBtnClickAnalytics(!status ? "opening" : "closing");
	}
	
	function dispatchMobileClearMapBtnClickAnalytics() {
		ga('send', 'event', {
			eventCategory: 'mobile clearmap',
			eventAction: 'click',
			eventLabel: 'Mobile Clear Map',
			nonInteraction: false
		});
	}
	
	function dispatchMobileTogglePanelBtnClickAnalytics(status) {
		ga('send', 'event', {
			eventCategory: 'mobile menu',
			eventAction: 'click',
			eventLabel: 'Mobile Panel Toggle' + status,
			nonInteraction: false
		});
	}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = BindDesktopMenuEvents;
	
	var _map = __webpack_require__(24);
	
	function BindDesktopMenuEvents() {
		d3.select("#toggle-panel-button").on("click", handleDesktopTogglePanelBtnClick);
		d3.selectAll("#clear-map-button").on("click", handleDesktopClearMapBtnClick);
	}
	
	function handleDesktopClearMapBtnClick(e) {
		d3.event.stopPropagation();
		(0, _map.clearMap)();
		// Quick and dirty solution -- creates a new session for google analytics?
		//var url = window.location.href.split('?')[0]
		//window.location.href = url
		dispatchDesktopClearMapBtnClickAnalytics();
	}
	
	function handleDesktopTogglePanelBtnClick(e) {
		d3.event.stopPropagation();
		var wrapper = d3.select("#wrapper");
		var status = wrapper.classed("panel-active");
		wrapper.classed("panel-active", !status);
		wrapper.classed("panel-inactive", status);
		(0, _map.GetMap)().invalidateSize({ pan: false });
		dispatchDesktopTogglePanelBtnClickAnalytics(!status ? "Open" : "Close");
	}
	
	function dispatchDesktopClearMapBtnClickAnalytics() {
		ga('send', 'event', {
			eventCategory: 'desktop',
			eventAction: 'click',
			eventLabel: 'Clear Map Btn',
			nonInteraction: false
		});
	}
	
	function dispatchDesktopTogglePanelBtnClickAnalytics(status) {
		ga('send', 'event', {
			eventCategory: 'desktop',
			eventAction: 'click',
			eventLabel: 'Panel Toggle ' + status,
			nonInteraction: false
		});
	}

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTRlMWQ1ZWNkMDYyZDE3Njg5MTgiLCJ3ZWJwYWNrOi8vLy4vanMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc2VhcmNoLmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL2xlYWZsZXRDb250cm9sLmpzIiwid2VicGFjazovLy8uL34vbm9kZW50LXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly8vLi9+L25vZGVudC1ydW50aW1lL3pvdXNhbi5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL34vbm9kZW50LXJ1bnRpbWUvdGhlbmFibGVGYWN0b3J5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3NlYXJjaEVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvZG9tVXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3Jlc3VsdExpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL2JpbmdQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvcHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL2VzcmlQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvZ29vZ2xlUHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL29wZW5TdHJlZXRNYXBQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9sYXllci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvcG9pLmpzIiwid2VicGFjazovLy8uL2pzL2dyYXBoLmpzIiwid2VicGFjazovLy8uL2pzL3NoYXJlLmpzIiwid2VicGFjazovLy8uL2pzL2Jhc2VsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYXJrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvdGFicy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9vcGFjaXR5U2xpZGVyLmpzIiwid2VicGFjazovLy8uL2pzL2xvZ28uanMiLCJ3ZWJwYWNrOi8vLy4vanMvbW9iaWxlLmpzIiwid2VicGFjazovLy8uL2pzL3BhbmVsVG9nZ2xlLmpzIiwid2VicGFjazovLy8uL2Nzcy9zYXNzL2xhbmRhdC5zY3NzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiX2xlYWZsZXRDb250cm9sIiwicmVxdWlyZSIsImVudW1lcmFibGUiLCJnZXQiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiZGVmYXVsdCIsIl9zZWFyY2hFbGVtZW50IiwiX2JpbmdQcm92aWRlciIsIl9lc3JpUHJvdmlkZXIiLCJfZ29vZ2xlUHJvdmlkZXIiLCJfb3BlblN0cmVldE1hcFByb3ZpZGVyIiwiX3Byb3ZpZGVyIiwib2JqIiwiX19lc01vZHVsZSIsIl9ub2RlbnRSdW50aW1lIiwiX25vZGVudFJ1bnRpbWUyIiwiX2V4dGVuZHMiLCJhc3NpZ24iLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiTGVhZmxldENvbnRyb2wiLCJfbG9kYXNoIiwiX2xvZGFzaDIiLCJfc2VhcmNoRWxlbWVudDIiLCJfcmVzdWx0TGlzdCIsIl9yZXN1bHRMaXN0MiIsIl9kb21VdGlscyIsIl9jb25zdGFudHMiLCJkZWZhdWx0T3B0aW9ucyIsInBvc2l0aW9uIiwic3R5bGUiLCJzaG93TWFya2VyIiwic2hvd1BvcHVwIiwicG9wdXBGb3JtYXQiLCJfcmVmIiwicmVzdWx0IiwibGFiZWwiLCJtYXJrZXIiLCJpY29uIiwiTCIsIkljb24iLCJEZWZhdWx0IiwiZHJhZ2dhYmxlIiwibWF4TWFya2VycyIsInJldGFpblpvb21MZXZlbCIsImFuaW1hdGVab29tIiwic2VhcmNoTGFiZWwiLCJub3RGb3VuZE1lc3NhZ2UiLCJtZXNzYWdlSGlkZURlbGF5Iiwiem9vbUxldmVsIiwiY2xhc3NOYW1lcyIsImNvbnRhaW5lciIsImJ1dHRvbiIsInJlc2V0QnV0dG9uIiwibXNnYm94IiwiZm9ybSIsImlucHV0IiwiYXV0b0NvbXBsZXRlIiwiYXV0b0NvbXBsZXRlRGVsYXkiLCJhdXRvQ2xvc2UiLCJrZWVwUmVzdWx0Iiwid2FzSGFuZGxlckVuYWJsZWQiLCJtYXBIYW5kbGVycyIsIkNvbnRyb2wiLCJpbml0aWFsaXplIiwib3B0aW9ucyIsIl90aGlzIiwibWFya2VycyIsIkZlYXR1cmVHcm91cCIsImhhbmRsZXJzRGlzYWJsZWQiLCJfb3B0aW9ucyIsInNlYXJjaEVsZW1lbnQiLCJoYW5kbGVTdWJtaXQiLCJxdWVyeSIsIm9uU3VibWl0IiwiX3NlYXJjaEVsZW1lbnQkZWxlbWVuIiwiZWxlbWVudHMiLCJjcmVhdGVFbGVtZW50IiwidGl0bGUiLCJocmVmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvbkNsaWNrIiwiaW5uZXJIVE1MIiwiY2xlYXJSZXN1bHRzIiwicmVzdWx0TGlzdCIsImhhbmRsZUNsaWNrIiwiX3JlZjIiLCJhcHBlbmRDaGlsZCIsImF1dG9TZWFyY2giLCJzZWxlY3RSZXN1bHQiLCJkaXNhYmxlSGFuZGxlcnMiLCJyZXN0b3JlSGFuZGxlcnMiLCJvbkFkZCIsIm1hcCIsIl9vcHRpb25zMiIsImFkZFRvIiwicm9vdCIsImdldENvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJvblJlbW92ZSIsInJlbW92ZSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJfc2VhcmNoRWxlbWVudCRlbGVtZW4yIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJyZW1vdmVDbGFzc05hbWUiLCJhZGRDbGFzc05hbWUiLCJmb2N1cyIsIl90aGlzMiIsImZvckVhY2giLCJoYW5kbGVyIiwiZW5hYmxlZCIsImRpc2FibGUiLCJfdGhpczMiLCJlbmFibGUiLCJFTlRFUl9LRVkiLCJBUlJPV19ET1dOX0tFWSIsIkFSUk9XX1VQX0tFWSIsImluY2x1ZGVzIiwia2V5Q29kZSIsImxpc3QiLCJtYXgiLCJjb3VudCIsIm5leHQiLCJjb2RlIiwic2VsZWN0ZWQiLCJpZHgiLCJpdGVtIiwic2VsZWN0IiwiZm9yY2UiLCJ1bmRlZmluZWQiLCJFU0NBUEVfS0VZIiwiX29wdGlvbnMzIiwiY2xlYXJMYXllcnMiLCJjbGVhciIsIlByb21pc2UiLCIkcmV0dXJuIiwiJGVycm9yIiwicHJvdmlkZXIiLCJyZXN1bHRzIiwiU1BFQ0lBTF9LRVlTIiwic2VhcmNoIiwidGhlbiIsIiRhd2FpdF8yIiwicmVuZGVyIiwiJElmXzEiLCIkYXN5bmNiaW5kIiwiJGF3YWl0XzMiLCJzaG93UmVzdWx0IiwiX3JlZjMiLCJrZXlzIiwiX2xheWVycyIsInJlbW92ZUxheWVyIiwiYWRkTWFya2VyIiwiY2VudGVyTWFwIiwiZmlyZUV2ZW50IiwibG9jYXRpb24iLCJjbG9zZVJlc3VsdHMiLCJfdGhpczQiLCJfb3B0aW9uczQiLCJNYXJrZXIiLCJ5IiwieCIsInBvcHVwTGFiZWwiLCJiaW5kUG9wdXAiLCJhZGRMYXllciIsIm9wZW5Qb3B1cCIsIm9uIiwiYXJncyIsImdldExhdExuZyIsIl9vcHRpb25zNSIsInJlc3VsdEJvdW5kcyIsIkxhdExuZ0JvdW5kcyIsImJvdW5kcyIsImlzVmFsaWQiLCJnZXRCb3VuZHMiLCJmaXRCb3VuZHMiLCJhbmltYXRlIiwic2V0VmlldyIsImdldENlbnRlciIsImdldFpvb20iLCJfb3B0aW9uczYiLCJleHRlbmQiLCJFcnJvciIsIkxDb250cm9sIiwiX2xlbiIsIkFycmF5IiwiX2tleSIsIkZ1bmN0aW9uIiwiYmluZCIsImFwcGx5IiwiY29uY2F0IiwicHJvY2Vzc0luY2x1ZGVzIiwic3JjIiwidG9TdHJpbmciLCJ0IiwibWF0Y2giLCJyZSIsIm0iLCJteCIsImV4ZWMiLCJwdXNoIiwicmV2ZXJzZSIsInNsaWNlIiwiaW5kZXgiLCJzdWJzdHIiLCJyZXBsYWNlIiwiem91c2FuIiwidGhlbmFibGUiLCJzZWxmIiwiY2F0Y2hlciIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwidHJhbXBvbGluZSIsInMiLCJ1IiwiYiIsInEiLCJwb3AiLCJyIiwiTGF6eVRoZW5hYmxlIiwiRWFnZXJUaGVuYWJsZSIsIlRoZW5hYmxlIiwiRWFnZXJUaGVuYWJsZUZhY3RvcnkiLCJyZXNvbHZlciIsImJvdW5kVGhlbiIsImV4IiwiJGFzeW5jc3Bhd24iLCJwcm9taXNlUHJvdmlkZXIiLCJnZW5GIiwiZW5vdWdoIiwicmVzb2x2ZSIsInJlamVjdCIsImdlbiIsInN0ZXAiLCJmbiIsImFyZyIsImRvbmUiLCJ2IiwidGhyb3ciLCJtb2R1bGUiLCJ0aWNrIiwicHJvY2VzcyIsIm5leHRUaWNrIiwic2V0SW1tZWRpYXRlIiwiZiIsInNldFRpbWVvdXQiLCJzb29uIiwiZnEiLCJmcVN0YXJ0IiwiYnVmZmVyU2l6ZSIsImNhbGxRdWV1ZSIsInNwbGljZSIsIlpvdXNhbiIsImZ1bmMiLCJtZSIsInN0YXRlIiwiVHlwZUVycm9yIiwiZmlyc3QiLCJyYSIsInJyIiwiU1RBVEVfRlVMRklMTEVEIiwiYyIsIm4iLCJsIiwicmVhc29uIiwiU1RBVEVfUkVKRUNURUQiLCJjbGllbnRzIiwib25GIiwib25SIiwicCIsImNsaWVudCIsImEiLCJ5cmV0IiwiZXJyIiwidmFsIiwieiIsInZlcnNpb24iLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIkl0ZW0iLCJhcnJheSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2IiwidmVyc2lvbnMiLCJub29wIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsIm5hbWUiLCJiaW5kaW5nIiwiY3dkIiwiY2hkaXIiLCJkaXIiLCJ1bWFzayIsIlRpbWVvdXQiLCJ3aW5kb3ciLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJjbG9zZSIsImlkIiwiY2xlYXJGbiIsIl9pZCIsIl9jbGVhckZuIiwidW5yZWYiLCJyZWYiLCJlbnJvbGwiLCJtc2VjcyIsIl9pZGxlVGltZW91dElkIiwiX2lkbGVUaW1lb3V0IiwidW5lbnJvbGwiLCJfdW5yZWZBY3RpdmUiLCJhY3RpdmUiLCJvblRpbWVvdXQiLCJfb25UaW1lb3V0IiwiY2xlYXJJbW1lZGlhdGUiLCJnbG9iYWwiLCJuZXh0SGFuZGxlIiwidGFza3NCeUhhbmRsZSIsImN1cnJlbnRseVJ1bm5pbmdBVGFzayIsImRvYyIsImRvY3VtZW50IiwicmVnaXN0ZXJJbW1lZGlhdGUiLCJjYWxsYmFjayIsInRhc2siLCJoYW5kbGUiLCJydW5JZlByZXNlbnQiLCJpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbiIsImNhblVzZVBvc3RNZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJpbXBvcnRTY3JpcHRzIiwicG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyIsIm9sZE9uTWVzc2FnZSIsIm9ubWVzc2FnZSIsImluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uIiwibWVzc2FnZVByZWZpeCIsIk1hdGgiLCJyYW5kb20iLCJvbkdsb2JhbE1lc3NhZ2UiLCJkYXRhIiwiaW5kZXhPZiIsImF0dGFjaEV2ZW50IiwiaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24iLCJjaGFubmVsIiwiTWVzc2FnZUNoYW5uZWwiLCJwb3J0MSIsInBvcnQyIiwiaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbiIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJzY3JpcHQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZW1vdmVDaGlsZCIsImluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24iLCJhdHRhY2hUbyIsImdldFByb3RvdHlwZU9mIiwiaXNUaGVuYWJsZSIsInJlc29sdXRpb24iLCJob3ciLCJDaGFpbmVkIiwiX3VuY2hhaW5lZCIsInRoZW5DaGFpbiIsInJlcyIsInJlaiIsImNoYWluIiwiX3Jlc29sdmVyIiwiRlVOQ19FUlJPUl9URVhUIiwiTkFOIiwic3ltYm9sVGFnIiwicmVUcmltIiwicmVJc0JhZEhleCIsInJlSXNCaW5hcnkiLCJyZUlzT2N0YWwiLCJmcmVlUGFyc2VJbnQiLCJwYXJzZUludCIsImZyZWVHbG9iYWwiLCJmcmVlU2VsZiIsIm9iamVjdFByb3RvIiwib2JqZWN0VG9TdHJpbmciLCJuYXRpdmVNYXgiLCJuYXRpdmVNaW4iLCJtaW4iLCJub3ciLCJEYXRlIiwiZGVib3VuY2UiLCJ3YWl0IiwibGFzdEFyZ3MiLCJsYXN0VGhpcyIsIm1heFdhaXQiLCJ0aW1lcklkIiwibGFzdENhbGxUaW1lIiwibGFzdEludm9rZVRpbWUiLCJsZWFkaW5nIiwibWF4aW5nIiwidHJhaWxpbmciLCJ0b051bWJlciIsImlzT2JqZWN0IiwiaW52b2tlRnVuYyIsInRpbWUiLCJ0aGlzQXJnIiwibGVhZGluZ0VkZ2UiLCJ0aW1lckV4cGlyZWQiLCJyZW1haW5pbmdXYWl0IiwidGltZVNpbmNlTGFzdENhbGwiLCJ0aW1lU2luY2VMYXN0SW52b2tlIiwic2hvdWxkSW52b2tlIiwidHJhaWxpbmdFZGdlIiwiY2FuY2VsIiwiZmx1c2giLCJkZWJvdW5jZWQiLCJpc0ludm9raW5nIiwidHlwZSIsImlzT2JqZWN0TGlrZSIsImlzU3ltYm9sIiwib3RoZXIiLCJ2YWx1ZU9mIiwiaXNCaW5hcnkiLCJ0ZXN0IiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInByb3BzIiwiZGVzY3JpcHRvciIsIkNvbnN0cnVjdG9yIiwicHJvdG9Qcm9wcyIsInN0YXRpY1Byb3BzIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJTZWFyY2hFbGVtZW50IiwiX3JlZiRoYW5kbGVTdWJtaXQiLCJfcmVmJHNlYXJjaExhYmVsIiwiX3JlZiRjbGFzc05hbWVzIiwiam9pbiIsInBsYWNlaG9sZGVyIiwib25JbnB1dCIsIm9uS2V5VXAiLCJvbktleVByZXNzIiwib25Gb2N1cyIsIm9uQmx1ciIsIl9lbGVtZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsIiRhd2FpdF8xIiwiaGFzRXJyb3IiLCJfZWxlbWVudHMyIiwiYm9keSIsImJsdXIiLCJzZXRRdWVyeSIsImVsZW1lbnQiLCJwYXJlbnQiLCJlbCIsImNsYXNzTmFtZSIsImNyZWF0ZVNjcmlwdEVsZW1lbnQiLCJ1cmwiLCJjYiIsInNldEF0dHJpYnV0ZSIsImpzb24iLCJhZGQiLCJBUlJPV19MRUZUX0tFWSIsIkFSUk9XX1JJR0hUX0tFWSIsImN4IiwiY2xhc3NuYW1lcyIsInRyaW0iLCJSZXN1bHRMaXN0IiwiX3JlZiRoYW5kbGVDbGljayIsIl9pbml0aWFsaXNlUHJvcHMiLCJyZXN1bHRJdGVtIiwiY2hpbGQiLCJjbG9uZU5vZGUiLCJmcm9tIiwiY2hpbGRyZW4iLCJsYXN0Q2hpbGQiLCJwYXJlbnROb2RlIiwiaGFzQXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlIiwiX3Byb3ZpZGVyMiIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiUHJvdmlkZXIiLCJfQmFzZVByb3ZpZGVyIiwiZW5kcG9pbnQiLCJwcm90b2NvbCIsImpzb25wIiwicGFyYW1zIiwicGFyYW1TdHJpbmciLCJnZXRQYXJhbVN0cmluZyIsInBhcnNlIiwicmVzb3VyY2VTZXRzIiwicmVzb3VyY2VzIiwicG9pbnQiLCJjb29yZGluYXRlcyIsImFkZHJlc3MiLCJmb3JtYXR0ZWRBZGRyZXNzIiwiYmJveCIsInJhdyIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlcXVlc3QiLCJmZXRjaCIsInRleHQiLCJsb2NhdGlvbnMiLCJmZWF0dXJlIiwiZ2VvbWV0cnkiLCJleHRlbnQiLCJ5bWluIiwieG1pbiIsInltYXgiLCJ4bWF4IiwicHJvdG8iLCJsbmciLCJsYXQiLCJmb3JtYXR0ZWRfYWRkcmVzcyIsInZpZXdwb3J0Iiwic291dGh3ZXN0Iiwibm9ydGhlYXN0IiwiZm9ybWF0IiwibG9uIiwiZGlzcGxheV9uYW1lIiwicGFyc2VGbG9hdCIsImJvdW5kaW5nYm94Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7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UUFBUSxRQUNyQjtVQUFRLFFBQVEsc0JBQXNCLENBQ3RDOzZDQUEyQyxDQUFDLFNBQVMsWUFDckQ7OztBQUVELFVBQVMsMENBQ1I7S0FBRyxRQUFRO2tCQUVWO2dCQUNBO2VBQ0E7bUJBRUQ7QUFMQzs7O0FBT0YsVUFBUywyQ0FBNEMsUUFDcEQ7S0FBRyxRQUFRO2tCQUVWO2dCQUNBO2VBQVksd0JBQ1o7bUJBRUQ7QUFMQzs7Ozs7Ozs7Ozs7Ozs7QUNoQ0Y7O0FBQWUsVUFBUyx3QkFDdkI7S0FBRyxPQUFPLHdCQUNSLEdBQUcsU0FDTDtLQUFHLFVBQVUscUJBQ1gsR0FBRyxTQUNMOzs7QUFFRCxVQUFTLDhCQUE4QixHQUN0QztLQUFHLE1BQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFRCxVQUFTLGlDQUFrQyxHQUMxQztLQUFHLE1BQ0g7TUFBSSxVQUFVLEdBQUcsT0FDakI7TUFBSSxTQUFTLFFBQVEsUUFDckI7VUFBUSxRQUFRLGdCQUFnQixDQUNoQztVQUFRLFFBQVEsa0JBQ2Y7QUFBRCxxQkFBVyxlQUFlLEVBQUMsS0FDM0I7OENBQTRDLENBQUMsU0FBUyxTQUN0RDs7O0FBRUQsVUFBUywyQ0FDUjtLQUFHLFFBQVE7a0JBRVY7Z0JBQ0E7ZUFDQTttQkFFRDtBQUxDOzs7QUFPRixVQUFTLDRDQUE2QyxRQUNyRDtLQUFHLFFBQVE7a0JBRVY7Z0JBQ0E7ZUFBWSxrQkFDWjttQkFFRDtBQUxDOzs7Ozs7O0FDdkNGLDBDIiwiZmlsZSI6ImluZGV4X2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDU0ZTFkNWVjZDA2MmQxNzY4OTE4IiwiaW1wb3J0IHtQYXJzZUNvbmZpZ30gZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IENyZWF0ZVNlYXJjaCBmcm9tICcuL3NlYXJjaCc7XG5pbXBvcnQge1NldHVwUGFuZWx9IGZyb20gJy4vcGFuZWwnO1xuaW1wb3J0IHtDcmVhdGVCYXNlTGF5ZXJzfSBmcm9tICcuL2Jhc2VsYXllcic7XG5pbXBvcnQge1NldHVwR3JhcGhzLCBIYW5kbGVHcmFwaFRhYkNoYW5nZX0gZnJvbSAnLi9ncmFwaCdcbmltcG9ydCB7QmluZEdyYXBoRXZlbnRzfSBmcm9tICcuL3BvaSc7XG5pbXBvcnQge0JpbmRUYWJFdmVudHMsIEhhbmRsZVRhYkNoYW5nZX0gZnJvbSAnLi90YWJzJ1xuaW1wb3J0IHtDcmVhdGVNYXB9IGZyb20gJy4vbWFwJ1xuaW1wb3J0IHtCaW5kVXBkYXRlU2hhcmVVcmwsIEFkZFNoYXJlU2V0dGluZ3NUb0NvbmZpZywgQmluZENvcHlMaW5rRXZlbnRzfSBmcm9tICcuL3NoYXJlJ1xuaW1wb3J0IHtDcmVhdGVEZWZhdWx0TGF5ZXJzfSBmcm9tICcuL2xheWVyJ1xuaW1wb3J0IENyZWF0ZUxvZ28gZnJvbSAnLi9sb2dvJztcbmltcG9ydCB7U2V0dXBQb2ludHNPZkludGVyZXN0fSBmcm9tICcuL3BvaSc7XG5pbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tICcuL3NoYXJlJztcbmltcG9ydCBCaW5kTW9iaWxlTWVudUV2ZW50cyBmcm9tICcuL21vYmlsZSc7XG5pbXBvcnQgQmluZERlc2t0b3BNZW51RXZlbnRzIGZyb20gJy4vcGFuZWxUb2dnbGUnO1xuXG52YXIgY3NzID0gcmVxdWlyZSgnLi4vY3NzL3Nhc3MvbGFuZGF0LnNjc3MnKVxuXG4vLyBEb2VzIG5vdCByZWx5IG9uIG1hcCBvYmplY3Qgb3IgY29uZmlnIGZpbGVcbnZhciBCYXNlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuXHRQYXJzZUNvbmZpZyhjb25maWcsIGNhbGxiYWNrKTtcblx0U2V0dXBHcmFwaHMoKTtcblx0QmluZFRhYkV2ZW50cygpO1xuXHRCaW5kQ29weUxpbmtFdmVudHMoKTtcblx0QmluZE1vYmlsZU1lbnVFdmVudHMoKTtcblx0QmluZERlc2t0b3BNZW51RXZlbnRzKCk7XG59XG5cbi8vIERvZXMgcmVseSBvbiBtYXAgb2JqZWN0IG9yIGNvbmZpZyBmaWxlXG52YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRBZGRTaGFyZVNldHRpbmdzVG9Db25maWcoZGF0YSlcblx0dmFyIG1hcCA9IENyZWF0ZU1hcChkYXRhLm1hcCk7XG5cdENyZWF0ZUJhc2VMYXllcnMobWFwLCBkYXRhLmJhc2VsYXllcnMpO1xuXHRDcmVhdGVEZWZhdWx0TGF5ZXJzKGRhdGEubGF5ZXJzLCBkYXRhW1wiYWN0aXZlLWxheWVyc1wiXSk7XG5cdFNldHVwUGFuZWwoZGF0YS5sYXllcnMsIGRhdGEubGF5b3V0KTtcblx0Q3JlYXRlU2VhcmNoKG1hcCk7XG5cdENyZWF0ZUxvZ28oZGF0YS5sb2dvKTtcblx0aWYgKGRhdGEudGFiKSBIYW5kbGVUYWJDaGFuZ2UoZGF0YS50YWIpO1xuXHRpZiAoZGF0YS5ncmFwaCkgSGFuZGxlR3JhcGhUYWJDaGFuZ2UoZGF0YS5ncmFwaCk7XG5cdEJpbmRHcmFwaEV2ZW50cyhtYXApO1xuXHRCaW5kVXBkYXRlU2hhcmVVcmwobWFwKTtcblx0U2V0dXBQb2ludHNPZkludGVyZXN0KG1hcCwgZGF0YS5wb2lzKVxuXHR1cGRhdGVTaGFyZVVybCgpXG59XG5cbndpbmRvdy5CYXNlID0gQmFzZTtcblxuZXhwb3J0IGRlZmF1bHQge0Jhc2V9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvYmFzZS5qcyIsIi8qKlxuICogUGFyc2VzIGEgY29uZmlnIGZpbGUuIFNpbmNlIHRoZSBwcm9jZXNzIHRvIGdldCBleHRlcm5hbCBmaWxlc1xuICogdXNlcyBBSkFYIHlvdSBuZWVkIHRvIHBhc3MgYSBjYWxsYmFjayB0byBoYW5kbGUgdGhlIG5leHQgc3RlcHNcbiAqIG9mIHVzaW5nIHRoZSBjb25maWcgZmlsZSwgc2luY2Ugd2UgZG8gbm90IGtub3cgaG93IGxvbmcgaXRcbiAqIHdpbGwgdGFrZSB0byBncmFiIHRoZSBmaWxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUGFyc2VDb25maWcgKGNvbmZpZ0ZpbGUsIGNhbGxiYWNrKSB7XG5cdEdldENvbmZpZyhjb25maWdGaWxlLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRBamF4T2JqZWN0KHJlc3BvbnNlSGFuZGxlcikge1xuXHR2YXIgeG1saHR0cFxuXHRpZiAoIXdpbmRvdy5YTUxIdHRwUmVxdWVzdCAmJiB3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xuXHRcdHhtbGh0dHAgPSBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoXCJNU1hNTDIuWE1MSFRUUC4zLjBcIilcblx0fSBlbHNlIHtcblx0XHR4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblx0fVxuXHR4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRyZXNwb25zZUhhbmRsZXIoeG1saHR0cC5yZXNwb25zZSlcblx0XHR9XG5cdH1cblx0cmV0dXJuIHhtbGh0dHBcbn1cblxuZnVuY3Rpb24gR2V0Q29uZmlnIChjb25maWdGaWxlLCBjYWxsYmFjaykge1xuXHR2YXIgeG1saHR0cCA9IEdldEFqYXhPYmplY3QoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0dmFyIGRhdGEgPSByZXNwb25zZUhhbmRsZXIocmVzcG9uc2UpXG5cdFx0Y2FsbGJhY2soZGF0YSlcblx0fSlcblx0eG1saHR0cC5vcGVuKFwiR0VUXCIsIGNvbmZpZ0ZpbGUsIHRydWUpO1xuXHR4bWxodHRwLnNlbmQoKTtcblx0Y29uc29sZS5sb2coXCJoaVwiKVxufVxuXG5mdW5jdGlvbiByZXNwb25zZUhhbmRsZXIgKHJlc3BvbnNlKSB7XG5cdHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSlcblx0Zm9ybWF0TWFwKHJlc3BvbnNlKTtcblx0Zm9ybWF0TGF5ZXJzKHJlc3BvbnNlKTtcblx0cmV0dXJuIHJlc3BvbnNlXG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1hcCAoZGF0YSkge1xuXHRpZiAoIWRhdGEubWFwKSBkYXRhLm1hcCA9IHt9O1xufVxuXG5mdW5jdGlvbiBmb3JtYXRMYXllcnMgKGRhdGEpIHtcblx0dmFyIGxheWVycyA9IGRhdGEubGF5ZXJzO1xuXHR2YXIgZGVmYXVsdE1hcHNlcnZlclVybCA9IGRhdGEubWFwc2VydmVyVXJsO1xuXHR2YXIgZGVmYXVsdEVuYWJsZWRMYXllcnMgPSBkYXRhW1wiYWN0aXZlLWxheWVyc1wiXTtcblx0dmFyIGxheWVyZ3JvdXA7XG5cdHZhciBpO1xuXG5cdGZvciAodmFyIHByb3AgaW4gbGF5ZXJzKSB7XG5cdFx0aWYgKCFsYXllcnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHJldHVybjtcblx0XHRsYXllcmdyb3VwID0gbGF5ZXJzW3Byb3BdO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsYXllcmdyb3VwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzZXRNYXBzZXJ2ZXJVcmwobGF5ZXJncm91cFtpXSwgZGVmYXVsdE1hcHNlcnZlclVybCk7XG5cdFx0XHRzZXREZWZhdWx0TGF5ZXJPcGFjaXR5KGxheWVyZ3JvdXBbaV0sIGRhdGEuZGVmYXVsdExheWVyT3BhY2l0eSlcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0RGVmYXVsdExheWVyT3BhY2l0eSAobGF5ZXIsIG9wYWNpdHkpIHtcblx0bGF5ZXIub3BhY2l0eSA9IGxheWVyLm9wYWNpdHkgfHwgb3BhY2l0eVxufVxuXG5mdW5jdGlvbiBzZXRNYXBzZXJ2ZXJVcmwgKGxheWVyLCB1cmwpIHtcblx0bGF5ZXIudXJsID0gbGF5ZXIudXJsIHx8IHVybDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3BhcnNlci5qcyIsImltcG9ydCB7IEdlb1NlYXJjaENvbnRyb2wsIE9wZW5TdHJlZXRNYXBQcm92aWRlciB9IGZyb20gJ2xlYWZsZXQtZ2Vvc2VhcmNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3JlYXRlU2VhcmNoIChtYXApIHtcblx0Y29uc3QgcHJvdmlkZXIgPSBuZXcgT3BlblN0cmVldE1hcFByb3ZpZGVyKCk7XG5cblx0Y29uc3Qgc2VhcmNoQ29udHJvbCA9IG5ldyBHZW9TZWFyY2hDb250cm9sKHtcblx0XHRwcm92aWRlcjogcHJvdmlkZXIsXG5cdFx0c2hvd01hcmtlcjogZmFsc2UsXG5cdFx0YXV0b0NvbXBsZXRlOiB0cnVlLFxuXHRcdHNob3dQb3B1cDogZmFsc2UsXG5cdH0pO1xuXG5cdG1hcC5hZGRDb250cm9sKHNlYXJjaENvbnRyb2wpO1xuXG5cdHZhciBzZWFyY2hFbGVtZW50cyA9IHNlYXJjaENvbnRyb2wuc2VhcmNoRWxlbWVudC5lbGVtZW50c1xuXG5cdEwuRG9tRXZlbnQub24oc2VhcmNoRWxlbWVudHMuY29udGFpbmVyLCBcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuXHRcdEwuRG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uKGV2KTtcblxuXHRcdHZhciBzZWFyY2hFbnRyaWVzID0gc2VhcmNoRWxlbWVudHMuZm9ybVxuXHRcdFx0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Jlc3VsdHMnKVswXS5jaGlsZHJlblxuXG5cdFx0Zm9yICh2YXIgaT0wOyBpPHNlYXJjaEVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChldi50YXJnZXQgPT09IHNlYXJjaEVudHJpZXNbaV0pIHtcblx0XHRcdFx0c2VhcmNoRWxlbWVudHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZm9yIHNlYXJjaCBieSBhZGRyZXNzXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRldmVudENhdGVnb3J5OiAnbWFwJyxcblx0XHRcdGV2ZW50QWN0aW9uOiAnc2VhcmNoJyxcblx0XHRcdGV2ZW50TGFiZWw6ICdjbGljaycsXG5cdFx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHR9KTtcblxuXHR9KTtcblxuXHRMLkRvbUV2ZW50Lm9uKHNlYXJjaEVsZW1lbnRzLmNvbnRhaW5lciwgXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldikge1xuXHRcdEwuRG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uKGV2KTtcblxuXHRcdGlmIChldi53aGljaCA9PSAxMyB8fCBldi5rZXlDb2RlID09IDEzKSB7XG5cdFx0XHRzZWFyY2hFbGVtZW50cy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblxuXHRcdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZm9yIHNlYWNyY2ggYnkgYWRkcmVzc1xuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdtYXAnLFxuXHRcdFx0XHRldmVudEFjdGlvbjogJ3NlYXJjaCBhZGRyZXNzJyxcblx0XHRcdFx0ZXZlbnRMYWJlbDogZXYudGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3NlYXJjaC5qcyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sZWFmbGV0Q29udHJvbCA9IHJlcXVpcmUoJy4vbGVhZmxldENvbnRyb2wnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdHZW9TZWFyY2hDb250cm9sJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGVhZmxldENvbnRyb2wpLmRlZmF1bHQ7XG4gIH1cbn0pO1xuXG52YXIgX3NlYXJjaEVsZW1lbnQgPSByZXF1aXJlKCcuL3NlYXJjaEVsZW1lbnQnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTZWFyY2hFbGVtZW50Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2VhcmNoRWxlbWVudCkuZGVmYXVsdDtcbiAgfVxufSk7XG5cbnZhciBfYmluZ1Byb3ZpZGVyID0gcmVxdWlyZSgnLi9wcm92aWRlcnMvYmluZ1Byb3ZpZGVyJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQmluZ1Byb3ZpZGVyJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmluZ1Byb3ZpZGVyKS5kZWZhdWx0O1xuICB9XG59KTtcblxudmFyIF9lc3JpUHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVycy9lc3JpUHJvdmlkZXInKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFc3JpUHJvdmlkZXInLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lc3JpUHJvdmlkZXIpLmRlZmF1bHQ7XG4gIH1cbn0pO1xuXG52YXIgX2dvb2dsZVByb3ZpZGVyID0gcmVxdWlyZSgnLi9wcm92aWRlcnMvZ29vZ2xlUHJvdmlkZXInKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdHb29nbGVQcm92aWRlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dvb2dsZVByb3ZpZGVyKS5kZWZhdWx0O1xuICB9XG59KTtcblxudmFyIF9vcGVuU3RyZWV0TWFwUHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVycy9vcGVuU3RyZWV0TWFwUHJvdmlkZXInKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdPcGVuU3RyZWV0TWFwUHJvdmlkZXInLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vcGVuU3RyZWV0TWFwUHJvdmlkZXIpLmRlZmF1bHQ7XG4gIH1cbn0pO1xuXG52YXIgX3Byb3ZpZGVyID0gcmVxdWlyZSgnLi9wcm92aWRlcnMvcHJvdmlkZXInKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdQcm92aWRlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3ZpZGVyKS5kZWZhdWx0O1xuICB9XG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9ub2RlbnRSdW50aW1lID0gcmVxdWlyZSgnbm9kZW50LXJ1bnRpbWUnKTtcblxudmFyIF9ub2RlbnRSdW50aW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVudFJ1bnRpbWUpO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBMZWFmbGV0Q29udHJvbDtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2guZGVib3VuY2UnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9zZWFyY2hFbGVtZW50ID0gcmVxdWlyZSgnLi9zZWFyY2hFbGVtZW50Jyk7XG5cbnZhciBfc2VhcmNoRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZWFyY2hFbGVtZW50KTtcblxudmFyIF9yZXN1bHRMaXN0ID0gcmVxdWlyZSgnLi9yZXN1bHRMaXN0Jyk7XG5cbnZhciBfcmVzdWx0TGlzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZXN1bHRMaXN0KTtcblxudmFyIF9kb21VdGlscyA9IHJlcXVpcmUoJy4vZG9tVXRpbHMnKTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSBmdW5jdGlvbiBkZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIHN0eWxlOiAnYnV0dG9uJyxcbiAgICBzaG93TWFya2VyOiB0cnVlLFxuICAgIHNob3dQb3B1cDogZmFsc2UsXG4gICAgcG9wdXBGb3JtYXQ6IGZ1bmN0aW9uIHBvcHVwRm9ybWF0KF9yZWYpIHtcbiAgICAgIHZhciByZXN1bHQgPSBfcmVmLnJlc3VsdDtcbiAgICAgIHJldHVybiAnJyArIHJlc3VsdC5sYWJlbDtcbiAgICB9LFxuICAgIG1hcmtlcjoge1xuICAgICAgaWNvbjogbmV3IEwuSWNvbi5EZWZhdWx0KCksXG4gICAgICBkcmFnZ2FibGU6IGZhbHNlXG4gICAgfSxcbiAgICBtYXhNYXJrZXJzOiAxLFxuICAgIHJldGFpblpvb21MZXZlbDogZmFsc2UsXG4gICAgYW5pbWF0ZVpvb206IHRydWUsXG4gICAgc2VhcmNoTGFiZWw6ICdFbnRlciBhZGRyZXNzJyxcbiAgICBub3RGb3VuZE1lc3NhZ2U6ICdTb3JyeSwgdGhhdCBhZGRyZXNzIGNvdWxkIG5vdCBiZSBmb3VuZC4nLFxuICAgIG1lc3NhZ2VIaWRlRGVsYXk6IDMwMDAsXG4gICAgem9vbUxldmVsOiAxOCxcbiAgICBjbGFzc05hbWVzOiB7XG4gICAgICBjb250YWluZXI6ICdsZWFmbGV0LWJhciBsZWFmbGV0LWNvbnRyb2wgbGVhZmxldC1jb250cm9sLWdlb3NlYXJjaCcsXG4gICAgICBidXR0b246ICdsZWFmbGV0LWJhci1wYXJ0IGxlYWZsZXQtYmFyLXBhcnQtc2luZ2xlJyxcbiAgICAgIHJlc2V0QnV0dG9uOiAncmVzZXQnLFxuICAgICAgbXNnYm94OiAnbGVhZmxldC1iYXIgbWVzc2FnZScsXG4gICAgICBmb3JtOiAnJyxcbiAgICAgIGlucHV0OiAnJ1xuICAgIH0sXG4gICAgYXV0b0NvbXBsZXRlOiB0cnVlLFxuICAgIGF1dG9Db21wbGV0ZURlbGF5OiAyNTAsXG4gICAgYXV0b0Nsb3NlOiBmYWxzZSxcbiAgICBrZWVwUmVzdWx0OiBmYWxzZVxuICB9O1xufTtcblxudmFyIHdhc0hhbmRsZXJFbmFibGVkID0ge307XG52YXIgbWFwSGFuZGxlcnMgPSBbJ2RyYWdnaW5nJywgJ3RvdWNoWm9vbScsICdkb3VibGVDbGlja1pvb20nLCAnc2Nyb2xsV2hlZWxab29tJywgJ2JveFpvb20nLCAna2V5Ym9hcmQnXTtcblxudmFyIENvbnRyb2wgPSB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRpYWxpemUob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLm1hcmtlcnMgPSBuZXcgTC5GZWF0dXJlR3JvdXAoKTtcbiAgICB0aGlzLmhhbmRsZXJzRGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0T3B0aW9ucygpLCBvcHRpb25zKTtcblxuICAgIHZhciBfb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgc3R5bGUgPSBfb3B0aW9ucy5zdHlsZSxcbiAgICAgICAgY2xhc3NOYW1lcyA9IF9vcHRpb25zLmNsYXNzTmFtZXMsXG4gICAgICAgIHNlYXJjaExhYmVsID0gX29wdGlvbnMuc2VhcmNoTGFiZWwsXG4gICAgICAgIGF1dG9Db21wbGV0ZSA9IF9vcHRpb25zLmF1dG9Db21wbGV0ZSxcbiAgICAgICAgYXV0b0NvbXBsZXRlRGVsYXkgPSBfb3B0aW9ucy5hdXRvQ29tcGxldGVEZWxheTtcblxuICAgIGlmIChzdHlsZSAhPT0gJ2J1dHRvbicpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5jbGFzc05hbWVzLmNvbnRhaW5lciArPSAnICcgKyBvcHRpb25zLnN0eWxlO1xuICAgIH1cblxuICAgIHRoaXMuc2VhcmNoRWxlbWVudCA9IG5ldyBfc2VhcmNoRWxlbWVudDIuZGVmYXVsdChfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChxdWVyeSkge1xuICAgICAgICByZXR1cm4gX3RoaXMub25TdWJtaXQocXVlcnkpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHZhciBfc2VhcmNoRWxlbWVudCRlbGVtZW4gPSB0aGlzLnNlYXJjaEVsZW1lbnQuZWxlbWVudHMsXG4gICAgICAgIGNvbnRhaW5lciA9IF9zZWFyY2hFbGVtZW50JGVsZW1lbi5jb250YWluZXIsXG4gICAgICAgIGZvcm0gPSBfc2VhcmNoRWxlbWVudCRlbGVtZW4uZm9ybSxcbiAgICAgICAgaW5wdXQgPSBfc2VhcmNoRWxlbWVudCRlbGVtZW4uaW5wdXQ7XG5cblxuICAgIHZhciBidXR0b24gPSAoMCwgX2RvbVV0aWxzLmNyZWF0ZUVsZW1lbnQpKCdhJywgY2xhc3NOYW1lcy5idXR0b24sIGNvbnRhaW5lcik7XG4gICAgYnV0dG9uLnRpdGxlID0gc2VhcmNoTGFiZWw7XG4gICAgYnV0dG9uLmhyZWYgPSAnIyc7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX3RoaXMub25DbGljayhlKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgcmVzZXRCdXR0b24gPSAoMCwgX2RvbVV0aWxzLmNyZWF0ZUVsZW1lbnQpKCdhJywgY2xhc3NOYW1lcy5yZXNldEJ1dHRvbiwgZm9ybSk7XG4gICAgcmVzZXRCdXR0b24uaW5uZXJIVE1MID0gJ1gnO1xuICAgIGJ1dHRvbi5ocmVmID0gJyMnO1xuICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuY2xlYXJSZXN1bHRzKG51bGwsIHRydWUpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIGlmIChhdXRvQ29tcGxldGUpIHtcbiAgICAgIHRoaXMucmVzdWx0TGlzdCA9IG5ldyBfcmVzdWx0TGlzdDIuZGVmYXVsdCh7XG4gICAgICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhfcmVmMikge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBfcmVmMi5yZXN1bHQ7XG5cbiAgICAgICAgICBpbnB1dC52YWx1ZSA9IHJlc3VsdC5sYWJlbDtcbiAgICAgICAgICBfdGhpcy5vblN1Ym1pdCh7IHF1ZXJ5OiByZXN1bHQubGFiZWwgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmb3JtLmFwcGVuZENoaWxkKHRoaXMucmVzdWx0TGlzdC5lbGVtZW50cy5jb250YWluZXIpO1xuXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsICgwLCBfbG9kYXNoMi5kZWZhdWx0KShmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuYXV0b1NlYXJjaChlKTtcbiAgICAgIH0sIGF1dG9Db21wbGV0ZURlbGF5KSwgdHJ1ZSk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnNlbGVjdFJlc3VsdChlKTtcbiAgICAgIH0sIHRydWUpO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5jbGVhclJlc3VsdHMoZSwgdHJ1ZSk7XG4gICAgICB9LCB0cnVlKTtcbiAgICB9XG5cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIF90aGlzLmRpc2FibGVIYW5kbGVycyhlKTtcbiAgICB9LCB0cnVlKTtcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIF90aGlzLnJlc3RvcmVIYW5kbGVycyhlKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHRoaXMuZWxlbWVudHMgPSB7IGJ1dHRvbjogYnV0dG9uLCByZXNldEJ1dHRvbjogcmVzZXRCdXR0b24gfTtcbiAgfSxcbiAgb25BZGQ6IGZ1bmN0aW9uIG9uQWRkKG1hcCkge1xuICAgIHZhciBfb3B0aW9uczIgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHNob3dNYXJrZXIgPSBfb3B0aW9uczIuc2hvd01hcmtlcixcbiAgICAgICAgc3R5bGUgPSBfb3B0aW9uczIuc3R5bGU7XG5cblxuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIGlmIChzaG93TWFya2VyKSB7XG4gICAgICB0aGlzLm1hcmtlcnMuYWRkVG8obWFwKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUgPT09ICdiYXInKSB7XG4gICAgICB2YXIgZm9ybSA9IHRoaXMuc2VhcmNoRWxlbWVudC5lbGVtZW50cy5mb3JtO1xuXG4gICAgICB2YXIgcm9vdCA9IG1hcC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKCcubGVhZmxldC1jb250cm9sLWNvbnRhaW5lcicpO1xuXG4gICAgICB2YXIgY29udGFpbmVyID0gKDAsIF9kb21VdGlscy5jcmVhdGVFbGVtZW50KSgnZGl2JywgJ2xlYWZsZXQtY29udHJvbC1nZW9zZWFyY2ggYmFyJyk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB0aGlzLmVsZW1lbnRzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWFyY2hFbGVtZW50LmVsZW1lbnRzLmNvbnRhaW5lcjtcbiAgfSxcbiAgb25SZW1vdmU6IGZ1bmN0aW9uIG9uUmVtb3ZlKCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnRzLmNvbnRhaW5lcjtcblxuICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgX3NlYXJjaEVsZW1lbnQkZWxlbWVuMiA9IHRoaXMuc2VhcmNoRWxlbWVudC5lbGVtZW50cyxcbiAgICAgICAgY29udGFpbmVyID0gX3NlYXJjaEVsZW1lbnQkZWxlbWVuMi5jb250YWluZXIsXG4gICAgICAgIGlucHV0ID0gX3NlYXJjaEVsZW1lbnQkZWxlbWVuMi5pbnB1dDtcblxuXG4gICAgaWYgKGNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAoMCwgX2RvbVV0aWxzLnJlbW92ZUNsYXNzTmFtZSkoY29udGFpbmVyLCAnYWN0aXZlJyk7XG4gICAgICB0aGlzLmNsZWFyUmVzdWx0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAoMCwgX2RvbVV0aWxzLmFkZENsYXNzTmFtZSkoY29udGFpbmVyLCAnYWN0aXZlJyk7XG4gICAgICBpbnB1dC5mb2N1cygpO1xuICAgIH1cbiAgfSxcbiAgZGlzYWJsZUhhbmRsZXJzOiBmdW5jdGlvbiBkaXNhYmxlSGFuZGxlcnMoZSkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgdmFyIGZvcm0gPSB0aGlzLnNlYXJjaEVsZW1lbnQuZWxlbWVudHMuZm9ybTtcblxuXG4gICAgaWYgKHRoaXMuaGFuZGxlcnNEaXNhYmxlZCB8fCBlICYmIGUudGFyZ2V0ICE9PSBmb3JtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVyc0Rpc2FibGVkID0gdHJ1ZTtcbiAgICBtYXBIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICBpZiAoX3RoaXMyLm1hcFtoYW5kbGVyXSkge1xuICAgICAgICB3YXNIYW5kbGVyRW5hYmxlZFtoYW5kbGVyXSA9IF90aGlzMi5tYXBbaGFuZGxlcl0uZW5hYmxlZCgpO1xuICAgICAgICBfdGhpczIubWFwW2hhbmRsZXJdLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcmVzdG9yZUhhbmRsZXJzOiBmdW5jdGlvbiByZXN0b3JlSGFuZGxlcnMoZSkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIGZvcm0gPSB0aGlzLnNlYXJjaEVsZW1lbnQuZWxlbWVudHMuZm9ybTtcblxuXG4gICAgaWYgKCF0aGlzLmhhbmRsZXJzRGlzYWJsZWQgfHwgZSAmJiBlLnRhcmdldCAhPT0gZm9ybSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlcnNEaXNhYmxlZCA9IGZhbHNlO1xuICAgIG1hcEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgIGlmICh3YXNIYW5kbGVyRW5hYmxlZFtoYW5kbGVyXSkge1xuICAgICAgICBfdGhpczMubWFwW2hhbmRsZXJdLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBzZWxlY3RSZXN1bHQ6IGZ1bmN0aW9uIHNlbGVjdFJlc3VsdChldmVudCkge1xuICAgIGlmICghW19jb25zdGFudHMuRU5URVJfS0VZLCBfY29uc3RhbnRzLkFSUk9XX0RPV05fS0VZLCBfY29uc3RhbnRzLkFSUk9XX1VQX0tFWV0uaW5jbHVkZXMoZXZlbnQua2V5Q29kZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIGlucHV0ID0gdGhpcy5zZWFyY2hFbGVtZW50LmVsZW1lbnRzLmlucHV0O1xuXG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gX2NvbnN0YW50cy5FTlRFUl9LRVkpIHtcbiAgICAgIHRoaXMub25TdWJtaXQoeyBxdWVyeTogaW5wdXQudmFsdWUgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGxpc3QgPSB0aGlzLnJlc3VsdExpc3Q7XG4gICAgdmFyIG1heCA9IGxpc3QuY291bnQoKSAtIDE7XG4gICAgaWYgKG1heCA8IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgIHZhciBuZXh0ID0gZXZlbnQuY29kZSA9PT0gJ0Fycm93RG93bicgPyB+fmxpc3Quc2VsZWN0ZWQgKyAxIDogfn5saXN0LnNlbGVjdGVkIC0gMTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcbiAgICB2YXIgaWR4ID0gbmV4dCA8IDAgPyBtYXggOiBuZXh0ID4gbWF4ID8gMCA6IG5leHQ7XG5cbiAgICB2YXIgaXRlbSA9IGxpc3Quc2VsZWN0KGlkeCk7XG4gICAgaW5wdXQudmFsdWUgPSBpdGVtLmxhYmVsO1xuICB9LFxuICBjbGVhclJlc3VsdHM6IGZ1bmN0aW9uIGNsZWFyUmVzdWx0cyhldmVudCkge1xuICAgIHZhciBmb3JjZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG5cbiAgICBpZiAoZXZlbnQgJiYgZXZlbnQua2V5Q29kZSAhPT0gX2NvbnN0YW50cy5FU0NBUEVfS0VZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGlucHV0ID0gdGhpcy5zZWFyY2hFbGVtZW50LmVsZW1lbnRzLmlucHV0O1xuICAgIHZhciBfb3B0aW9uczMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGtlZXBSZXN1bHQgPSBfb3B0aW9uczMua2VlcFJlc3VsdCxcbiAgICAgICAgYXV0b0NvbXBsZXRlID0gX29wdGlvbnMzLmF1dG9Db21wbGV0ZTtcblxuXG4gICAgaWYgKGZvcmNlIHx8ICFrZWVwUmVzdWx0KSB7XG4gICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgdGhpcy5tYXJrZXJzLmNsZWFyTGF5ZXJzKCk7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9Db21wbGV0ZSkge1xuICAgICAgdGhpcy5yZXN1bHRMaXN0LmNsZWFyKCk7XG4gICAgfVxuICB9LFxuICBhdXRvU2VhcmNoOiBmdW5jdGlvbiBhdXRvU2VhcmNoKGV2ZW50KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uICgkcmV0dXJuLCAkZXJyb3IpIHtcbiAgICAgIHZhciBxdWVyeSwgcHJvdmlkZXIsIHJlc3VsdHM7XG5cbiAgICAgIGlmIChfY29uc3RhbnRzLlNQRUNJQUxfS0VZUy5pbmNsdWRlcyhldmVudC5rZXlDb2RlKSkge1xuICAgICAgICByZXR1cm4gJHJldHVybigpO1xuICAgICAgfVxuXG4gICAgICBxdWVyeSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIHByb3ZpZGVyID0gdGhpcy5vcHRpb25zLnByb3ZpZGVyO1xuXG5cbiAgICAgIGlmIChxdWVyeS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyLnNlYXJjaCh7IHF1ZXJ5OiBxdWVyeSB9KS50aGVuKGZ1bmN0aW9uICgkYXdhaXRfMikge1xuICAgICAgICAgIHJlc3VsdHMgPSAkYXdhaXRfMjtcbiAgICAgICAgICB0aGlzLnJlc3VsdExpc3QucmVuZGVyKHJlc3VsdHMpO1xuICAgICAgICAgIHJldHVybiAkSWZfMS5jYWxsKHRoaXMpO1xuICAgICAgICB9LiRhc3luY2JpbmQodGhpcywgJGVycm9yKSwgJGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVzdWx0TGlzdC5jbGVhcigpO1xuICAgICAgICByZXR1cm4gJElmXzEuY2FsbCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gJElmXzEoKSB7XG4gICAgICAgIHJldHVybiAkcmV0dXJuKCk7XG4gICAgICB9XG4gICAgfS4kYXN5bmNiaW5kKHRoaXMpKTtcbiAgfSxcbiAgb25TdWJtaXQ6IGZ1bmN0aW9uIG9uU3VibWl0KHF1ZXJ5KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uICgkcmV0dXJuLCAkZXJyb3IpIHtcbiAgICAgIHZhciBwcm92aWRlciwgcmVzdWx0cztcbiAgICAgIHByb3ZpZGVyID0gdGhpcy5vcHRpb25zLnByb3ZpZGVyO1xuICAgICAgcmV0dXJuIHByb3ZpZGVyLnNlYXJjaChxdWVyeSkudGhlbihmdW5jdGlvbiAoJGF3YWl0XzMpIHtcblxuICAgICAgICByZXN1bHRzID0gJGF3YWl0XzM7XG5cbiAgICAgICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5zaG93UmVzdWx0KHJlc3VsdHNbMF0sIHF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHJldHVybigpO1xuICAgICAgfS4kYXN5bmNiaW5kKHRoaXMsICRlcnJvciksICRlcnJvcik7XG4gICAgfS4kYXN5bmNiaW5kKHRoaXMpKTtcbiAgfSxcbiAgc2hvd1Jlc3VsdDogZnVuY3Rpb24gc2hvd1Jlc3VsdChyZXN1bHQsIF9yZWYzKSB7XG4gICAgdmFyIHF1ZXJ5ID0gX3JlZjMucXVlcnk7XG4gICAgdmFyIGF1dG9DbG9zZSA9IHRoaXMub3B0aW9ucy5hdXRvQ2xvc2U7XG5cblxuICAgIHZhciBtYXJrZXJzID0gT2JqZWN0LmtleXModGhpcy5tYXJrZXJzLl9sYXllcnMpO1xuICAgIGlmIChtYXJrZXJzLmxlbmd0aCA+PSB0aGlzLm9wdGlvbnMubWF4TWFya2Vycykge1xuICAgICAgdGhpcy5tYXJrZXJzLnJlbW92ZUxheWVyKG1hcmtlcnNbMF0pO1xuICAgIH1cblxuICAgIHZhciBtYXJrZXIgPSB0aGlzLmFkZE1hcmtlcihyZXN1bHQsIHF1ZXJ5KTtcbiAgICB0aGlzLmNlbnRlck1hcChyZXN1bHQpO1xuXG4gICAgdGhpcy5tYXAuZmlyZUV2ZW50KCdnZW9zZWFyY2gvc2hvd2xvY2F0aW9uJywge1xuICAgICAgbG9jYXRpb246IHJlc3VsdCxcbiAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgfSk7XG5cbiAgICBpZiAoYXV0b0Nsb3NlKSB7XG4gICAgICB0aGlzLmNsb3NlUmVzdWx0cygpO1xuICAgIH1cbiAgfSxcbiAgY2xvc2VSZXN1bHRzOiBmdW5jdGlvbiBjbG9zZVJlc3VsdHMoKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuc2VhcmNoRWxlbWVudC5lbGVtZW50cy5jb250YWluZXI7XG5cblxuICAgIGlmIChjb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKGNvbnRhaW5lciwgJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIHRoaXMucmVzdG9yZUhhbmRsZXJzKCk7XG4gICAgdGhpcy5jbGVhclJlc3VsdHMoKTtcbiAgfSxcbiAgYWRkTWFya2VyOiBmdW5jdGlvbiBhZGRNYXJrZXIocmVzdWx0LCBxdWVyeSkge1xuICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgdmFyIF9vcHRpb25zNCA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgb3B0aW9ucyA9IF9vcHRpb25zNC5tYXJrZXIsXG4gICAgICAgIHNob3dQb3B1cCA9IF9vcHRpb25zNC5zaG93UG9wdXAsXG4gICAgICAgIHBvcHVwRm9ybWF0ID0gX29wdGlvbnM0LnBvcHVwRm9ybWF0O1xuXG4gICAgdmFyIG1hcmtlciA9IG5ldyBMLk1hcmtlcihbcmVzdWx0LnksIHJlc3VsdC54XSwgb3B0aW9ucyk7XG4gICAgdmFyIHBvcHVwTGFiZWwgPSByZXN1bHQubGFiZWw7XG5cbiAgICBpZiAodHlwZW9mIHBvcHVwRm9ybWF0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwb3B1cExhYmVsID0gcG9wdXBGb3JtYXQoeyBxdWVyeTogcXVlcnksIHJlc3VsdDogcmVzdWx0IH0pO1xuICAgIH1cblxuICAgIG1hcmtlci5iaW5kUG9wdXAocG9wdXBMYWJlbCk7XG5cbiAgICB0aGlzLm1hcmtlcnMuYWRkTGF5ZXIobWFya2VyKTtcblxuICAgIGlmIChzaG93UG9wdXApIHtcbiAgICAgIG1hcmtlci5vcGVuUG9wdXAoKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kcmFnZ2FibGUpIHtcbiAgICAgIG1hcmtlci5vbignZHJhZ2VuZCcsIGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIF90aGlzNC5tYXAuZmlyZUV2ZW50KCdnZW9zZWFyY2gvbWFya2VyL2RyYWdlbmQnLCB7XG4gICAgICAgICAgbG9jYXRpb246IG1hcmtlci5nZXRMYXRMbmcoKSxcbiAgICAgICAgICBldmVudDogYXJnc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrZXI7XG4gIH0sXG4gIGNlbnRlck1hcDogZnVuY3Rpb24gY2VudGVyTWFwKHJlc3VsdCkge1xuICAgIHZhciBfb3B0aW9uczUgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHJldGFpblpvb21MZXZlbCA9IF9vcHRpb25zNS5yZXRhaW5ab29tTGV2ZWwsXG4gICAgICAgIGFuaW1hdGVab29tID0gX29wdGlvbnM1LmFuaW1hdGVab29tO1xuXG5cbiAgICB2YXIgcmVzdWx0Qm91bmRzID0gbmV3IEwuTGF0TG5nQm91bmRzKHJlc3VsdC5ib3VuZHMpO1xuICAgIHZhciBib3VuZHMgPSByZXN1bHRCb3VuZHMuaXNWYWxpZCgpID8gcmVzdWx0Qm91bmRzIDogdGhpcy5tYXJrZXJzLmdldEJvdW5kcygpO1xuXG4gICAgaWYgKCFyZXRhaW5ab29tTGV2ZWwgJiYgcmVzdWx0Qm91bmRzLmlzVmFsaWQoKSkge1xuICAgICAgdGhpcy5tYXAuZml0Qm91bmRzKGJvdW5kcywgeyBhbmltYXRlOiBhbmltYXRlWm9vbSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXAuc2V0Vmlldyhib3VuZHMuZ2V0Q2VudGVyKCksIHRoaXMuZ2V0Wm9vbSgpLCB7IGFuaW1hdGU6IGFuaW1hdGVab29tIH0pO1xuICAgIH1cbiAgfSxcbiAgZ2V0Wm9vbTogZnVuY3Rpb24gZ2V0Wm9vbSgpIHtcbiAgICB2YXIgX29wdGlvbnM2ID0gdGhpcy5vcHRpb25zLFxuICAgICAgICByZXRhaW5ab29tTGV2ZWwgPSBfb3B0aW9uczYucmV0YWluWm9vbUxldmVsLFxuICAgICAgICB6b29tTGV2ZWwgPSBfb3B0aW9uczYuem9vbUxldmVsO1xuXG4gICAgcmV0dXJuIHJldGFpblpvb21MZXZlbCA/IHRoaXMubWFwLmdldFpvb20oKSA6IHpvb21MZXZlbDtcbiAgfVxufTtcblxuZnVuY3Rpb24gTGVhZmxldENvbnRyb2woKSB7XG4gIGlmICghTCB8fCAhTC5Db250cm9sIHx8ICFMLkNvbnRyb2wuZXh0ZW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdMZWFmbGV0IG11c3QgYmUgbG9hZGVkIGJlZm9yZSBpbnN0YW50aWF0aW5nIHRoZSBHZW9TZWFyY2ggY29udHJvbCcpO1xuICB9XG5cbiAgdmFyIExDb250cm9sID0gTC5Db250cm9sLmV4dGVuZChDb250cm9sKTtcblxuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgb3B0aW9ucyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIG9wdGlvbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseShMQ29udHJvbCwgW251bGxdLmNvbmNhdChvcHRpb25zKSkpKCk7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvbGVhZmxldENvbnRyb2wuanMiLCJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiAkYXN5bmNiaW5kIGhhcyBtdWx0aXBsZSB1c2VzLCBkZXBlbmRpbmcgb24gdGhlIHBhcmFtZXRlciBsaXN0LiBJdCBpcyBpbiBGdW5jdGlvbi5wcm90b3R5cGUsIHNvICd0aGlzJyBpcyBhbHdheXMgYSBmdW5jdGlvblxuICpcbiAqIDEpIElmIGNhbGxlZCB3aXRoIGEgc2luZ2xlIGFyZ3VtZW50ICh0aGlzKSwgaXQgaXMgdXNlZCB3aGVuIGRlZmluaW5nIGFuIGFzeW5jIGZ1bmN0aW9uIHRvIGVuc3VyZSB3aGVuXG4gKiAgICAgIGl0IGlzIGludm9rZWQsIHRoZSBjb3JyZWN0ICd0aGlzJyBpcyBwcmVzZW50LCBqdXN0IGxpa2UgXCJiaW5kXCIuIEZvciBsZWdhY3kgcmVhc29ucywgJ3RoaXMnIGlzIGdpdmVuXG4gKiAgICAgIGEgbWVtZWJlciAndGhlbicgd2hpY2ggcmVmZXJzIHRvIGl0c2VsZi5cbiAqIDIpIElmIGNhbGxlZCB3aXRoIGEgc2Vjb25kIHBhcmFtZXRlciAoXCJjYXRjaGVyXCIpIGFuZCBjYXRjaGVyIT09dHJ1ZSBpdCBpcyBiZWluZyB1c2VkIHRvIGludm9rZSBhbiBhc3luY1xuICogICAgICBmdW5jdGlvbiB3aGVyZSB0aGUgc2Vjb25kIHBhcmFtZXRlciBpcyB0aGUgZXJyb3IgY2FsbGJhY2sgKGZvciBzeW5jIGV4Y2VwdGlvbnMgYW5kIHRvIGJlIHBhc3NlZCB0b1xuICogICAgICBuZXN0ZWQgYXN5bmMgY2FsbHMpXG4gKiAzKSBJZiBjYWxsZWQgd2l0aCB0aGUgc2Vjb25kIHBhcmFtZXRlcj09PXRydWUsIGl0IGlzIHRoZSBzYW1lIHVzZSBhcyAoMSksIGJ1dCB0aGUgZnVuY3Rpb24gaXMgd3JhcHBlZFxuICogICAgICBpbiBhbiAnUHJvbWlzZScgYXMgd2VsbCBib3VuZCB0byAndGhpcycuXG4gKiAgICAgIEl0IGlzIHRoZSBzYW1lIGFzIGNhbGxpbmcgJ25ldyBQcm9taXNlKHRoaXMpJywgd2hlcmUgJ3RoaXMnIGlzIHRoZSBmdW5jdGlvbiBiZWluZyBib3VuZC93cmFwcGVkXG4gKiA0KSBJZiBjYWxsZWQgd2l0aCB0aGUgc2Vjb25kIHBhcmFtZXRlcj09PTAsIGl0IGlzIHRoZSBzYW1lIHVzZSBhcyAoMSksIGJ1dCB0aGUgZnVuY3Rpb24gaXMgd3JhcHBlZFxuICogICAgICBpbiBhICdMYXp5VGhlbmFibGUnLCB3aGljaCBleGVjdXRlcyBsYXppbHkgYW5kIGNhbiByZXNvbHZlIHN5bmNocm9ub3VzbHkuXG4gKiAgICAgIEl0IGlzIHRoZSBzYW1lIGFzIGNhbGxpbmcgJ25ldyBMYXp5VGhlbmFibGUodGhpcyknIChpZiBzdWNoIGEgdHlwZSB3ZXJlIGV4cG9zZWQpLCB3aGVyZSAndGhpcycgaXNcbiAqICAgICAgdGhlIGZ1bmN0aW9uIGJlaW5nIGJvdW5kL3dyYXBwZWRcbiAqL1xuXG5mdW5jdGlvbiBwcm9jZXNzSW5jbHVkZXMoaW5jbHVkZXMsaW5wdXQpIHtcbiAgICB2YXIgc3JjID0gaW5wdXQudG9TdHJpbmcoKSA7XG4gICAgdmFyIHQgPSBcInJldHVybiBcIitzcmMgO1xuICAgIHZhciBhcmdzID0gc3JjLm1hdGNoKC8uKlxcKChbXildKilcXCkvKVsxXSA7XG4gICAgdmFyIHJlID0gL1snXCJdISEhKFteJ1wiXSopWydcIl0vZyA7XG4gICAgdmFyIG0gPSBbXSA7XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgdmFyIG14ID0gcmUuZXhlYyh0KSA7XG4gICAgICAgIGlmIChteClcbiAgICAgICAgICAgIG0ucHVzaChteCkgO1xuICAgICAgICBlbHNlIGJyZWFrIDtcbiAgICB9XG4gICAgbS5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihlKXtcbiAgICAgICAgdCA9IHQuc2xpY2UoMCxlLmluZGV4KStpbmNsdWRlc1tlWzFdXSt0LnN1YnN0cihlLmluZGV4K2VbMF0ubGVuZ3RoKSA7XG4gICAgfSkgO1xuICAgIHQgPSB0LnJlcGxhY2UoL1xcL1xcKlteKl0qXFwqXFwvL2csJyAnKS5yZXBsYWNlKC9cXHMrL2csJyAnKSA7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihhcmdzLHQpKCkgO1xufVxuXG52YXIgJGFzeW5jYmluZCA9IHByb2Nlc3NJbmNsdWRlcyh7XG4gICAgem91c2FuOnJlcXVpcmUoJy4vem91c2FuJykudG9TdHJpbmcoKSxcbiAgICB0aGVuYWJsZTpyZXF1aXJlKCcuL3RoZW5hYmxlRmFjdG9yeScpLnRvU3RyaW5nKClcbn0sXG5mdW5jdGlvbiAkYXN5bmNiaW5kKHNlbGYsY2F0Y2hlcikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICghRnVuY3Rpb24ucHJvdG90eXBlLiRhc3luY2JpbmQpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSxcIiRhc3luY2JpbmRcIix7dmFsdWU6JGFzeW5jYmluZCxlbnVtZXJhYmxlOmZhbHNlLGNvbmZpZ3VyYWJsZTp0cnVlLHdyaXRhYmxlOnRydWV9KSA7XG4gICAgfVxuXG4gICAgaWYgKCEkYXN5bmNiaW5kLnRyYW1wb2xpbmUpIHtcbiAgICAgICRhc3luY2JpbmQudHJhbXBvbGluZSA9IGZ1bmN0aW9uIHRyYW1wb2xpbmUodCx4LHMsZSx1KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGIocSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChxLnRoZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHEgPSBxLnRoZW4oYiwgZSkgO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHU/dW5kZWZpbmVkOnE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLnBvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBxLnBvcCgpID8geC5jYWxsKHQpIDogcTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcztcbiAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcS5jYWxsKHQpXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlKHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoISRhc3luY2JpbmQuTGF6eVRoZW5hYmxlKSB7XG4gICAgICAgICRhc3luY2JpbmQuTGF6eVRoZW5hYmxlID0gJyEhIXRoZW5hYmxlJygpO1xuICAgICAgICAkYXN5bmNiaW5kLkVhZ2VyVGhlbmFibGUgPSAkYXN5bmNiaW5kLlRoZW5hYmxlID0gKCRhc3luY2JpbmQuRWFnZXJUaGVuYWJsZUZhY3RvcnkgPSAnISEhem91c2FuJykoKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzb2x2ZXIgPSB0aGlzO1xuICAgIHN3aXRjaCAoY2F0Y2hlcikge1xuICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgcmV0dXJuIG5ldyAoJGFzeW5jYmluZC5UaGVuYWJsZSkoYm91bmRUaGVuKTtcbiAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBuZXcgKCRhc3luY2JpbmQuTGF6eVRoZW5hYmxlKShib3VuZFRoZW4pO1xuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICAvKiBGb3IgcnVudGltZSBjb21wYXRpYmlsaXR5IHdpdGggTm9kZW50IHYyLngsIHByb3ZpZGUgYSB0aGVuYWJsZSAqL1xuICAgICAgICBib3VuZFRoZW4udGhlbiA9IGJvdW5kVGhlbiA7XG4gICAgICAgIHJldHVybiBib3VuZFRoZW4gO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXIuYXBwbHkoc2VsZixhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBjYXRjaChleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYXRjaGVyKGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBib3VuZFRoZW4oKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlci5hcHBseShzZWxmLGFyZ3VtZW50cyk7XG4gICAgfVxufSkgO1xuXG5mdW5jdGlvbiAkYXN5bmNzcGF3bihwcm9taXNlUHJvdmlkZXIsc2VsZikge1xuICAgIGlmICghRnVuY3Rpb24ucHJvdG90eXBlLiRhc3luY3NwYXduKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsXCIkYXN5bmNzcGF3blwiLHt2YWx1ZTokYXN5bmNzcGF3bixlbnVtZXJhYmxlOmZhbHNlLGNvbmZpZ3VyYWJsZTp0cnVlLHdyaXRhYmxlOnRydWV9KSA7XG4gICAgfVxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHJldHVybiA7XG5cbiAgICB2YXIgZ2VuRiA9IHRoaXMgO1xuICAgIHJldHVybiBuZXcgcHJvbWlzZVByb3ZpZGVyKGZ1bmN0aW9uIGVub3VnaChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIGdlbiA9IGdlbkYuY2FsbChzZWxmLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICBmdW5jdGlvbiBzdGVwKGZuLGFyZykge1xuICAgICAgICAgICAgdmFyIG5leHQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5leHQgPSBmbi5jYWxsKGdlbixhcmcpO1xuICAgICAgICAgICAgICAgIGlmKG5leHQuZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dC52YWx1ZSAhPT0gcmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQudmFsdWUgJiYgbmV4dC52YWx1ZT09PW5leHQudmFsdWUudGhlbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dC52YWx1ZShyZXNvbHZlLHJlamVjdCkgO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSAmJiByZXNvbHZlKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSA9IG51bGwgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dC52YWx1ZS50aGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQudmFsdWUudGhlbihmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwKGdlbi5uZXh0LHYpO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwKGdlbi50aHJvdyxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcChnZW4ubmV4dCxuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICByZWplY3QgJiYgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIHJlamVjdCA9IG51bGwgO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGVwKGdlbi5uZXh0KTtcbiAgICB9KTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBhc3luYyBiaW5kaW5nc1xuJGFzeW5jYmluZCgpIDtcbiRhc3luY3NwYXduKCkgO1xuXG4vLyBFeHBvcnQgYXN5bmMgYmluZGluZ3Ncbm1vZHVsZS5leHBvcnRzID0ge1xuICAgICRhc3luY2JpbmQ6JGFzeW5jYmluZCxcbiAgICAkYXN5bmNzcGF3bjokYXN5bmNzcGF3blxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbm9kZW50LXJ1bnRpbWUvcnVudGltZS5qcyIsIi8qIFRoaXMgY29kZSBpcyBiYXNlZCBvbjpcbnpvdXNhbiAtIEEgTGlnaHRuaW5nIEZhc3QsIFlldCBWZXJ5IFNtYWxsIFByb21pc2UgQSsgQ29tcGxpYW50IEltcGxlbWVudGF0aW9uXG5odHRwczovL2dpdGh1Yi5jb20vYmx1ZWphdmEvem91c2FuXG5BdXRob3I6IEdsZW5uIENyb3dub3ZlciA8Z2xlbm5AYmx1ZWphdmEuY29tPiAoaHR0cDovL3d3dy5ibHVlamF2YS5jb20pXG5WZXJzaW9uIDIuMy4zXG5MaWNlbnNlOiBNSVQgKi9cblwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aWNrKXtcbiAgICB0aWNrID0gdGljayB8fCAodHlwZW9mIHByb2Nlc3M9PT1cIm9iamVjdFwiICYmIHByb2Nlc3MubmV4dFRpY2spIHx8ICh0eXBlb2Ygc2V0SW1tZWRpYXRlPT09XCJmdW5jdGlvblwiICYmIHNldEltbWVkaWF0ZSkgfHwgZnVuY3Rpb24oZil7c2V0VGltZW91dChmLDApfTtcbiAgICB2YXIgc29vbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmcSA9IFtdLCBmcVN0YXJ0ID0gMCwgYnVmZmVyU2l6ZSA9IDEwMjQ7XG4gICAgICAgIGZ1bmN0aW9uIGNhbGxRdWV1ZSgpIHtcbiAgICAgICAgICAgIHdoaWxlIChmcS5sZW5ndGggLSBmcVN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsgZnFbZnFTdGFydF0oKSB9IGNhdGNoKGV4KSB7IC8qIGNvbnNvbGUuZXJyb3IoZXgpICovIH1cbiAgICAgICAgICAgICAgICBmcVtmcVN0YXJ0KytdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChmcVN0YXJ0ID09PSBidWZmZXJTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGZxLnNwbGljZSgwLCBidWZmZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgZnFTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgZnEucHVzaChmbik7XG4gICAgICAgICAgICBpZiAoZnEubGVuZ3RoIC0gZnFTdGFydCA9PT0gMSlcbiAgICAgICAgICAgICAgICB0aWNrKGNhbGxRdWV1ZSk7XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIGZ1bmN0aW9uIFpvdXNhbihmdW5jKSB7XG4gICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgZnVuYyhmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgbWUucmVzb2x2ZShhcmcpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgICAgIG1lLnJlamVjdChhcmcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBab3VzYW4ucHJvdG90eXBlID0ge1xuICAgICAgICByZXNvbHZlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlamVjdChuZXcgVHlwZUVycm9yKFwiQXR0ZW1wdCB0byByZXNvbHZlIHByb21pc2Ugd2l0aCBzZWxmXCIpKTtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGhlbiA9IHZhbHVlLnRoZW47XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bmN0aW9uIChyYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3QrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5yZXNvbHZlKHJhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUucmVqZWN0KHJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZVTEZJTExFRDtcbiAgICAgICAgICAgIHRoaXMudiA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKG1lLmMpXG4gICAgICAgICAgICAgICAgc29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwLCBsID0gbWUuYy5sZW5ndGg7biA8IGw7IG4rKylcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQVRFX0ZVTEZJTExFRChtZS5jW25dLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlamVjdDogZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUkVKRUNURUQ7XG4gICAgICAgICAgICB0aGlzLnYgPSByZWFzb247XG4gICAgICAgICAgICB2YXIgY2xpZW50cyA9IHRoaXMuYztcbiAgICAgICAgICAgIGlmIChjbGllbnRzKVxuICAgICAgICAgICAgICAgIHNvb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMCwgbCA9IGNsaWVudHMubGVuZ3RoO24gPCBsOyBuKyspXG4gICAgICAgICAgICAgICAgICAgICAgICBTVEFURV9SRUpFQ1RFRChjbGllbnRzW25dLCByZWFzb24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB0aGVuOiBmdW5jdGlvbiAob25GLCBvblIpIHtcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFpvdXNhbigpO1xuICAgICAgICAgICAgdmFyIGNsaWVudCA9IHtcbiAgICAgICAgICAgICAgICB5OiBvbkYsXG4gICAgICAgICAgICAgICAgbjogb25SLFxuICAgICAgICAgICAgICAgIHA6IHBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jLnB1c2goY2xpZW50KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYyA9IFtjbGllbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgcyA9IHRoaXMuc3RhdGUsIGEgPSB0aGlzLnY7XG4gICAgICAgICAgICAgICAgc29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHMoY2xpZW50LCBhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIFNUQVRFX0ZVTEZJTExFRChjLCBhcmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjLnkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgeXJldCA9IGMueS5jYWxsKHVuZGVmaW5lZCwgYXJnKTtcbiAgICAgICAgICAgICAgICBjLnAucmVzb2x2ZSh5cmV0KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGMucC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBjLnAucmVzb2x2ZShhcmcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFNUQVRFX1JFSkVDVEVEKGMsIHJlYXNvbikge1xuICAgICAgICBpZiAodHlwZW9mIGMubiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciB5cmV0ID0gYy5uLmNhbGwodW5kZWZpbmVkLCByZWFzb24pO1xuICAgICAgICAgICAgICAgIGMucC5yZXNvbHZlKHlyZXQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgYy5wLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGMucC5yZWplY3QocmVhc29uKTtcbiAgICB9XG5cbiAgICBab3VzYW4ucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCAmJiAodmFsIGluc3RhbmNlb2YgWm91c2FuKSlcbiAgICAgICAgICAgIHJldHVybiB2YWwgO1xuICAgICAgICB2YXIgeiA9IG5ldyBab3VzYW4oKTtcbiAgICAgICAgei5yZXNvbHZlKHZhbCk7XG4gICAgICAgIHJldHVybiB6O1xuICAgIH07XG4gICAgWm91c2FuLnJlamVjdCA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciAmJiAoZXJyIGluc3RhbmNlb2YgWm91c2FuKSlcbiAgICAgICAgICAgIHJldHVybiBlcnIgO1xuICAgICAgICB2YXIgeiA9IG5ldyBab3VzYW4oKTtcbiAgICAgICAgei5yZWplY3QoZXJyKTtcbiAgICAgICAgcmV0dXJuIHo7XG4gICAgfTtcblxuICAgIFpvdXNhbi52ZXJzaW9uID0gXCIyLjMuMy1ub2RlbnRcIiA7XG4gICAgcmV0dXJuIFpvdXNhbiA7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9ub2RlbnQtcnVudGltZS96b3VzYW4uanMiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gaXNUaGVuYWJsZShvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KSAmJiB0eXBlb2Ygb2JqLnRoZW49PT1cImZ1bmN0aW9uXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x1dGlvbihwLHIsaG93KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKiAyLjIuNy4xICovXG4gICAgICAgICAgICB2YXIgeCA9IGhvdyA/IGhvdyhyKTpyIDtcblxuICAgICAgICAgICAgaWYgKHA9PT14KSAvKiAyLjMuMSAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBwLnJlamVjdChuZXcgVHlwZUVycm9yKFwiUHJvbWlzZSByZXNvbHV0aW9uIGxvb3BcIikpIDtcblxuICAgICAgICAgICAgaWYgKGlzVGhlbmFibGUoeCkpIHtcbiAgICAgICAgICAgICAgICAvKiAyLjMuMyAqL1xuICAgICAgICAgICAgICAgIHgudGhlbihmdW5jdGlvbih5KXtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x1dGlvbihwLHkpO1xuICAgICAgICAgICAgICAgIH0sZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIHAucmVqZWN0KGUpXG4gICAgICAgICAgICAgICAgfSkgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoeCkgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgLyogMi4yLjcuMiAqL1xuICAgICAgICAgICAgcC5yZWplY3QoZXgpIDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIENoYWluZWQoKSB7fTtcbiAgICBDaGFpbmVkLnByb3RvdHlwZSA9IHtcbiAgICAgICAgcmVzb2x2ZTpfdW5jaGFpbmVkLFxuICAgICAgICByZWplY3Q6X3VuY2hhaW5lZCxcbiAgICAgICAgdGhlbjp0aGVuQ2hhaW5cbiAgICB9O1xuICAgIGZ1bmN0aW9uIF91bmNoYWluZWQodil7fVxuICAgIGZ1bmN0aW9uIHRoZW5DaGFpbihyZXMscmVqKXtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzO1xuICAgICAgICB0aGlzLnJlamVjdCA9IHJlajtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gdGhlbihyZXMscmVqKXtcbiAgICAgICAgdmFyIGNoYWluID0gbmV3IENoYWluZWQoKSA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNvbHZlcihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc1RoZW5hYmxlKHZhbHVlKSA/IHZhbHVlLnRoZW4ocmVzLHJlaikgOiByZXNvbHV0aW9uKGNoYWluLHZhbHVlLHJlcyk7XG4gICAgICAgICAgICB9LGZ1bmN0aW9uKGV4KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x1dGlvbihjaGFpbixleCxyZWopIDtcbiAgICAgICAgICAgIH0pIDtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIHJlc29sdXRpb24oY2hhaW4sZXgscmVqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhaW4gO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFRoZW5hYmxlKHJlc29sdmVyKSB7XG4gICAgICAgIHRoaXMuX3Jlc29sdmVyID0gcmVzb2x2ZXIgO1xuICAgICAgICB0aGlzLnRoZW4gPSB0aGVuIDtcbiAgICB9O1xuXG4gICAgVGhlbmFibGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHYpe1xuICAgICAgICByZXR1cm4gVGhlbmFibGUuaXNUaGVuYWJsZSh2KSA/IHYgOiB7dGhlbjpmdW5jdGlvbihyZXNvbHZlKXtyZXR1cm4gcmVzb2x2ZSh2KX19O1xuICAgIH07XG5cbiAgICBUaGVuYWJsZS5pc1RoZW5hYmxlID0gaXNUaGVuYWJsZSA7XG5cbiAgICByZXR1cm4gVGhlbmFibGUgO1xufSA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L25vZGVudC1ydW50aW1lL3RoZW5hYmxlRmFjdG9yeS5qcyIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX25vZGVudFJ1bnRpbWUgPSByZXF1aXJlKCdub2RlbnQtcnVudGltZScpO1xuXG52YXIgX25vZGVudFJ1bnRpbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZW50UnVudGltZSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfZG9tVXRpbHMgPSByZXF1aXJlKCcuL2RvbVV0aWxzJyk7XG5cbnZhciBfY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFNlYXJjaEVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNlYXJjaEVsZW1lbnQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgX3JlZiRoYW5kbGVTdWJtaXQgPSBfcmVmLmhhbmRsZVN1Ym1pdCxcbiAgICAgICAgaGFuZGxlU3VibWl0ID0gX3JlZiRoYW5kbGVTdWJtaXQgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX3JlZiRoYW5kbGVTdWJtaXQsXG4gICAgICAgIF9yZWYkc2VhcmNoTGFiZWwgPSBfcmVmLnNlYXJjaExhYmVsLFxuICAgICAgICBzZWFyY2hMYWJlbCA9IF9yZWYkc2VhcmNoTGFiZWwgPT09IHVuZGVmaW5lZCA/ICdzZWFyY2gnIDogX3JlZiRzZWFyY2hMYWJlbCxcbiAgICAgICAgX3JlZiRjbGFzc05hbWVzID0gX3JlZi5jbGFzc05hbWVzLFxuICAgICAgICBjbGFzc05hbWVzID0gX3JlZiRjbGFzc05hbWVzID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY2xhc3NOYW1lcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZWFyY2hFbGVtZW50KTtcblxuICAgIHZhciBjb250YWluZXIgPSAoMCwgX2RvbVV0aWxzLmNyZWF0ZUVsZW1lbnQpKCdkaXYnLCBbJ2dlb3NlYXJjaCcsIGNsYXNzTmFtZXMuY29udGFpbmVyXS5qb2luKCcgJykpO1xuICAgIHZhciBmb3JtID0gKDAsIF9kb21VdGlscy5jcmVhdGVFbGVtZW50KSgnZm9ybScsIFsnJywgY2xhc3NOYW1lcy5mb3JtXS5qb2luKCcgJyksIGNvbnRhaW5lcik7XG4gICAgdmFyIGlucHV0ID0gKDAsIF9kb21VdGlscy5jcmVhdGVFbGVtZW50KSgnaW5wdXQnLCBbJ2dsYXNzJywgY2xhc3NOYW1lcy5pbnB1dF0uam9pbignICcpLCBmb3JtKTtcblxuICAgIGlucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgaW5wdXQucGxhY2Vob2xkZXIgPSBzZWFyY2hMYWJlbDtcblxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIF90aGlzLm9uSW5wdXQoZSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIF90aGlzLm9uS2V5VXAoZSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIF90aGlzLm9uS2V5UHJlc3MoZSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIF90aGlzLm9uRm9jdXMoZSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX3RoaXMub25CbHVyKGUpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHRoaXMuZWxlbWVudHMgPSB7IGNvbnRhaW5lcjogY29udGFpbmVyLCBmb3JtOiBmb3JtLCBpbnB1dDogaW5wdXQgfTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IGhhbmRsZVN1Ym1pdDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTZWFyY2hFbGVtZW50LCBbe1xuICAgIGtleTogJ29uRm9jdXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkZvY3VzKCkge1xuICAgICAgKDAsIF9kb21VdGlscy5hZGRDbGFzc05hbWUpKHRoaXMuZWxlbWVudHMuZm9ybSwgJ2FjdGl2ZScpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ29uQmx1cicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uQmx1cigpIHtcbiAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKSh0aGlzLmVsZW1lbnRzLmZvcm0sICdhY3RpdmUnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdvblN1Ym1pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uU3VibWl0KGV2ZW50KSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCRyZXR1cm4sICRlcnJvcikge1xuICAgICAgICB2YXIgX2VsZW1lbnRzLCBpbnB1dCwgY29udGFpbmVyO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIF9lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMsIGlucHV0ID0gX2VsZW1lbnRzLmlucHV0LCBjb250YWluZXIgPSBfZWxlbWVudHMuY29udGFpbmVyO1xuXG4gICAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKShjb250YWluZXIsICdlcnJvcicpO1xuICAgICAgICAoMCwgX2RvbVV0aWxzLmFkZENsYXNzTmFtZSkoY29udGFpbmVyLCAncGVuZGluZycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVN1Ym1pdCh7IHF1ZXJ5OiBpbnB1dC52YWx1ZSB9KS50aGVuKGZ1bmN0aW9uICgkYXdhaXRfMSkge1xuICAgICAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKShjb250YWluZXIsICdwZW5kaW5nJyk7XG4gICAgICAgICAgcmV0dXJuICRyZXR1cm4oKTtcbiAgICAgICAgfS4kYXN5bmNiaW5kKHRoaXMsICRlcnJvciksICRlcnJvcik7XG4gICAgICB9LiRhc3luY2JpbmQodGhpcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ29uSW5wdXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbklucHV0KCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudHMuY29udGFpbmVyO1xuXG5cbiAgICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKShjb250YWluZXIsICdlcnJvcicpO1xuICAgICAgICB0aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25LZXlVcCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uS2V5VXAoZXZlbnQpIHtcbiAgICAgIHZhciBfZWxlbWVudHMyID0gdGhpcy5lbGVtZW50cyxcbiAgICAgICAgICBjb250YWluZXIgPSBfZWxlbWVudHMyLmNvbnRhaW5lcixcbiAgICAgICAgICBpbnB1dCA9IF9lbGVtZW50czIuaW5wdXQ7XG5cblxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IF9jb25zdGFudHMuRVNDQVBFX0tFWSkge1xuICAgICAgICAoMCwgX2RvbVV0aWxzLnJlbW92ZUNsYXNzTmFtZSkoY29udGFpbmVyLCAncGVuZGluZycpO1xuICAgICAgICAoMCwgX2RvbVV0aWxzLnJlbW92ZUNsYXNzTmFtZSkoY29udGFpbmVyLCAnYWN0aXZlJyk7XG5cbiAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmZvY3VzKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYmx1cigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ29uS2V5UHJlc3MnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbktleVByZXNzKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gX2NvbnN0YW50cy5FTlRFUl9LRVkpIHtcbiAgICAgICAgdGhpcy5vblN1Ym1pdChldmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0UXVlcnknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRRdWVyeShxdWVyeSkge1xuICAgICAgdmFyIGlucHV0ID0gdGhpcy5lbGVtZW50cy5pbnB1dDtcblxuICAgICAgaW5wdXQudmFsdWUgPSBxdWVyeTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU2VhcmNoRWxlbWVudDtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gU2VhcmNoRWxlbWVudDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9zZWFyY2hFbGVtZW50LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydCAqL1xudmFyIGNyZWF0ZUVsZW1lbnQgPSBleHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgdmFyIGNsYXNzTmFtZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuICB2YXIgcGFyZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG4gIGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZXM7XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICByZXR1cm4gZWw7XG59O1xuXG52YXIgY3JlYXRlU2NyaXB0RWxlbWVudCA9IGV4cG9ydHMuY3JlYXRlU2NyaXB0RWxlbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZVNjcmlwdEVsZW1lbnQodXJsLCBjYikge1xuICB2YXIgc2NyaXB0ID0gY3JlYXRlRWxlbWVudCgnc2NyaXB0JywgbnVsbCwgZG9jdW1lbnQuYm9keSk7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgd2luZG93W2NiXSA9IGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICBzY3JpcHQucmVtb3ZlKCk7XG4gICAgICBkZWxldGUgd2luZG93W2NiXTtcbiAgICAgIHJlc29sdmUoanNvbik7XG4gICAgfTtcblxuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybCk7XG4gIH0pO1xufTtcblxudmFyIGFkZENsYXNzTmFtZSA9IGV4cG9ydHMuYWRkQ2xhc3NOYW1lID0gZnVuY3Rpb24gYWRkQ2xhc3NOYW1lKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudCAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICB9XG59O1xuXG52YXIgcmVtb3ZlQ2xhc3NOYW1lID0gZXhwb3J0cy5yZW1vdmVDbGFzc05hbWUgPSBmdW5jdGlvbiByZW1vdmVDbGFzc05hbWUoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgfVxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9kb21VdGlscy5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIEVOVEVSX0tFWSA9IGV4cG9ydHMuRU5URVJfS0VZID0gMTM7XG52YXIgRVNDQVBFX0tFWSA9IGV4cG9ydHMuRVNDQVBFX0tFWSA9IDI3O1xudmFyIEFSUk9XX0RPV05fS0VZID0gZXhwb3J0cy5BUlJPV19ET1dOX0tFWSA9IDQwO1xudmFyIEFSUk9XX1VQX0tFWSA9IGV4cG9ydHMuQVJST1dfVVBfS0VZID0gMzg7XG52YXIgQVJST1dfTEVGVF9LRVkgPSBleHBvcnRzLkFSUk9XX0xFRlRfS0VZID0gMzc7XG52YXIgQVJST1dfUklHSFRfS0VZID0gZXhwb3J0cy5BUlJPV19SSUdIVF9LRVkgPSAzOTtcblxudmFyIFNQRUNJQUxfS0VZUyA9IGV4cG9ydHMuU1BFQ0lBTF9LRVlTID0gW0VOVEVSX0tFWSwgRVNDQVBFX0tFWSwgQVJST1dfRE9XTl9LRVksIEFSUk9XX1VQX0tFWSwgQVJST1dfTEVGVF9LRVksIEFSUk9XX1JJR0hUX0tFWV07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvY29uc3RhbnRzLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2RvbVV0aWxzID0gcmVxdWlyZSgnLi9kb21VdGlscycpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgY3ggPSBmdW5jdGlvbiBjeCgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNsYXNzbmFtZXMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBjbGFzc25hbWVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGNsYXNzbmFtZXMuam9pbignICcpLnRyaW0oKTtcbn07XG5cbnZhciBSZXN1bHRMaXN0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSZXN1bHRMaXN0KCkge1xuICAgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgX3JlZiRoYW5kbGVDbGljayA9IF9yZWYuaGFuZGxlQ2xpY2ssXG4gICAgICAgIGhhbmRsZUNsaWNrID0gX3JlZiRoYW5kbGVDbGljayA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKCkge30gOiBfcmVmJGhhbmRsZUNsaWNrLFxuICAgICAgICBfcmVmJGNsYXNzTmFtZXMgPSBfcmVmLmNsYXNzTmFtZXMsXG4gICAgICAgIGNsYXNzTmFtZXMgPSBfcmVmJGNsYXNzTmFtZXMgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZiRjbGFzc05hbWVzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJlc3VsdExpc3QpO1xuXG4gICAgX2luaXRpYWxpc2VQcm9wcy5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5wcm9wcyA9IHsgaGFuZGxlQ2xpY2s6IGhhbmRsZUNsaWNrLCBjbGFzc05hbWVzOiBjbGFzc05hbWVzIH07XG4gICAgdGhpcy5zZWxlY3RlZCA9IC0xO1xuXG4gICAgdmFyIGNvbnRhaW5lciA9ICgwLCBfZG9tVXRpbHMuY3JlYXRlRWxlbWVudCkoJ2RpdicsIGN4KCdyZXN1bHRzJywgY2xhc3NOYW1lcy5jb250YWluZXIpKTtcbiAgICB2YXIgcmVzdWx0SXRlbSA9ICgwLCBfZG9tVXRpbHMuY3JlYXRlRWxlbWVudCkoJ2RpdicsIGN4KGNsYXNzTmFtZXMuaXRlbSkpO1xuXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0cnVlKTtcbiAgICB0aGlzLmVsZW1lbnRzID0geyBjb250YWluZXI6IGNvbnRhaW5lciwgcmVzdWx0SXRlbTogcmVzdWx0SXRlbSB9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFJlc3VsdExpc3QsIFt7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICAgICAgdmFyIF9lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMsXG4gICAgICAgICAgY29udGFpbmVyID0gX2VsZW1lbnRzLmNvbnRhaW5lcixcbiAgICAgICAgICByZXN1bHRJdGVtID0gX2VsZW1lbnRzLnJlc3VsdEl0ZW07XG5cbiAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQsIGlkeCkge1xuICAgICAgICB2YXIgY2hpbGQgPSByZXN1bHRJdGVtLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWtleScsIGlkeCk7XG4gICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHJlc3VsdC5sYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVzdWx0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICgwLCBfZG9tVXRpbHMuYWRkQ2xhc3NOYW1lKShjb250YWluZXIsICdhY3RpdmUnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0cztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZWxlY3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZWxlY3QoaW5kZXgpIHtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnRzLmNvbnRhaW5lcjtcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbmZ1c2luZy1hcnJvd1xuXG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGlkeCkge1xuICAgICAgICByZXR1cm4gaWR4ID09PSBpbmRleCA/ICgwLCBfZG9tVXRpbHMuYWRkQ2xhc3NOYW1lKShjaGlsZCwgJ2FjdGl2ZScpIDogKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKGNoaWxkLCAnYWN0aXZlJyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZWxlY3RlZCA9IGluZGV4O1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c1tpbmRleF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnY291bnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdHMgPyB0aGlzLnJlc3VsdHMubGVuZ3RoIDogMDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdjbGVhcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudHMuY29udGFpbmVyO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkID0gLTE7XG5cbiAgICAgIHdoaWxlIChjb250YWluZXIubGFzdENoaWxkKSB7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIubGFzdENoaWxkKTtcbiAgICAgIH1cblxuICAgICAgKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKGNvbnRhaW5lciwgJ2FjdGl2ZScpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBSZXN1bHRMaXN0O1xufSgpO1xuXG52YXIgX2luaXRpYWxpc2VQcm9wcyA9IGZ1bmN0aW9uIF9pbml0aWFsaXNlUHJvcHMoKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdGhpcy5vbkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfcmVmMiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgIHRhcmdldCA9IF9yZWYyLnRhcmdldDtcblxuICAgIHZhciBoYW5kbGVDbGljayA9IF90aGlzLnByb3BzLmhhbmRsZUNsaWNrO1xuICAgIHZhciBjb250YWluZXIgPSBfdGhpcy5lbGVtZW50cy5jb250YWluZXI7XG5cblxuICAgIGlmICh0YXJnZXQucGFyZW50Tm9kZSAhPT0gY29udGFpbmVyIHx8ICF0YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLWtleScpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGlkeCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG4gICAgdmFyIHJlc3VsdCA9IF90aGlzLnJlc3VsdHNbaWR4XTtcbiAgICBoYW5kbGVDbGljayh7IHJlc3VsdDogcmVzdWx0IH0pO1xuICB9O1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUmVzdWx0TGlzdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9yZXN1bHRMaXN0LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX25vZGVudFJ1bnRpbWUgPSByZXF1aXJlKCdub2RlbnQtcnVudGltZScpO1xuXG52YXIgX25vZGVudFJ1bnRpbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZW50UnVudGltZSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVyJyk7XG5cbnZhciBfcHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvdmlkZXIpO1xuXG52YXIgX2RvbVV0aWxzID0gcmVxdWlyZSgnLi4vZG9tVXRpbHMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgUHJvdmlkZXIgPSBmdW5jdGlvbiAoX0Jhc2VQcm92aWRlcikge1xuICBfaW5oZXJpdHMoUHJvdmlkZXIsIF9CYXNlUHJvdmlkZXIpO1xuXG4gIGZ1bmN0aW9uIFByb3ZpZGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQcm92aWRlcik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFByb3ZpZGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUHJvdmlkZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQcm92aWRlciwgW3tcbiAgICBrZXk6ICdlbmRwb2ludCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuZHBvaW50KCkge1xuICAgICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICAgIHF1ZXJ5ID0gX3JlZi5xdWVyeSxcbiAgICAgICAgICBwcm90b2NvbCA9IF9yZWYucHJvdG9jb2wsXG4gICAgICAgICAganNvbnAgPSBfcmVmLmpzb25wO1xuXG4gICAgICB2YXIgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcztcblxuXG4gICAgICB2YXIgcGFyYW1TdHJpbmcgPSB0aGlzLmdldFBhcmFtU3RyaW5nKF9leHRlbmRzKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICBqc29ucDoganNvbnBcbiAgICAgIH0pKTtcblxuICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vZGV2LnZpcnR1YWxlYXJ0aC5uZXQvUkVTVC92MS9Mb2NhdGlvbnM/JyArIHBhcmFtU3RyaW5nO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3BhcnNlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGFyc2UoX3JlZjIpIHtcbiAgICAgIHZhciBkYXRhID0gX3JlZjIuZGF0YTtcblxuICAgICAgaWYgKGRhdGEucmVzb3VyY2VTZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXMubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogci5wb2ludC5jb29yZGluYXRlc1sxXSxcbiAgICAgICAgICB5OiByLnBvaW50LmNvb3JkaW5hdGVzWzBdLFxuICAgICAgICAgIGxhYmVsOiByLmFkZHJlc3MuZm9ybWF0dGVkQWRkcmVzcyxcbiAgICAgICAgICBib3VuZHM6IFtbci5iYm94WzBdLCByLmJib3hbMV1dLCAvLyBzLCB3XG4gICAgICAgICAgW3IuYmJveFsyXSwgci5iYm94WzNdXV0sXG4gICAgICAgICAgcmF3OiByXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZWFyY2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZWFyY2goX3JlZjMpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoJHJldHVybiwgJGVycm9yKSB7XG4gICAgICAgIHZhciBxdWVyeSwgcHJvdG9jb2wsIGpzb25wLCB1cmwsIGpzb247XG4gICAgICAgIHF1ZXJ5ID0gX3JlZjMucXVlcnk7XG5cbiAgICAgICAgcHJvdG9jb2wgPSB+bG9jYXRpb24ucHJvdG9jb2wuaW5kZXhPZignaHR0cCcpID8gbG9jYXRpb24ucHJvdG9jb2wgOiAnaHR0cHM6JztcblxuICAgICAgICBqc29ucCA9ICdCSU5HX0pTT05QX0NCXycgKyBEYXRlLm5vdygpO1xuICAgICAgICB1cmwgPSB0aGlzLmVuZHBvaW50KHsgcXVlcnk6IHF1ZXJ5LCBwcm90b2NvbDogcHJvdG9jb2wsIGpzb25wOiBqc29ucCB9KTtcblxuICAgICAgICByZXR1cm4gKDAsIF9kb21VdGlscy5jcmVhdGVTY3JpcHRFbGVtZW50KSh1cmwsIGpzb25wKS50aGVuKGZ1bmN0aW9uICgkYXdhaXRfMSkge1xuICAgICAgICAgIGpzb24gPSAkYXdhaXRfMTtcbiAgICAgICAgICByZXR1cm4gJHJldHVybih0aGlzLnBhcnNlKHsgZGF0YToganNvbiB9KSk7XG4gICAgICAgIH0uJGFzeW5jYmluZCh0aGlzLCAkZXJyb3IpLCAkZXJyb3IpO1xuICAgICAgfS4kYXN5bmNiaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUHJvdmlkZXI7XG59KF9wcm92aWRlcjIuZGVmYXVsdCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFByb3ZpZGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3Byb3ZpZGVycy9iaW5nUHJvdmlkZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbm9kZW50UnVudGltZSA9IHJlcXVpcmUoJ25vZGVudC1ydW50aW1lJyk7XG5cbnZhciBfbm9kZW50UnVudGltZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlbnRSdW50aW1lKTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFByb3ZpZGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQcm92aWRlcigpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJvdmlkZXIpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQcm92aWRlciwgW3tcbiAgICBrZXk6ICdnZXRQYXJhbVN0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBhcmFtU3RyaW5nKHBhcmFtcykge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHBhcmFtcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trZXldKTtcbiAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZWFyY2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZWFyY2goX3JlZikge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uICgkcmV0dXJuLCAkZXJyb3IpIHtcbiAgICAgICAgdmFyIHF1ZXJ5LCBwcm90b2NvbCwgdXJsLCByZXF1ZXN0LCBqc29uO1xuICAgICAgICBxdWVyeSA9IF9yZWYucXVlcnk7XG5cbiAgICAgICAgcHJvdG9jb2wgPSB+bG9jYXRpb24ucHJvdG9jb2wuaW5kZXhPZignaHR0cCcpID8gbG9jYXRpb24ucHJvdG9jb2wgOiAnaHR0cHM6JztcbiAgICAgICAgdXJsID0gdGhpcy5lbmRwb2ludCh7IHF1ZXJ5OiBxdWVyeSwgcHJvdG9jb2w6IHByb3RvY29sIH0pO1xuXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwpLnRoZW4oZnVuY3Rpb24gKCRhd2FpdF8xKSB7XG4gICAgICAgICAgcmVxdWVzdCA9ICRhd2FpdF8xO1xuICAgICAgICAgIHJldHVybiByZXF1ZXN0Lmpzb24oKS50aGVuKGZ1bmN0aW9uICgkYXdhaXRfMikge1xuICAgICAgICAgICAganNvbiA9ICRhd2FpdF8yO1xuICAgICAgICAgICAgcmV0dXJuICRyZXR1cm4odGhpcy5wYXJzZSh7IGRhdGE6IGpzb24gfSkpO1xuICAgICAgICAgIH0uJGFzeW5jYmluZCh0aGlzLCAkZXJyb3IpLCAkZXJyb3IpO1xuICAgICAgICB9LiRhc3luY2JpbmQodGhpcywgJGVycm9yKSwgJGVycm9yKTtcbiAgICAgIH0uJGFzeW5jYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFByb3ZpZGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQcm92aWRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvcHJvdmlkZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVyJyk7XG5cbnZhciBfcHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvdmlkZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBQcm92aWRlciA9IGZ1bmN0aW9uIChfQmFzZVByb3ZpZGVyKSB7XG4gIF9pbmhlcml0cyhQcm92aWRlciwgX0Jhc2VQcm92aWRlcik7XG5cbiAgZnVuY3Rpb24gUHJvdmlkZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFByb3ZpZGVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUHJvdmlkZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQcm92aWRlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFByb3ZpZGVyLCBbe1xuICAgIGtleTogJ2VuZHBvaW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5kcG9pbnQoKSB7XG4gICAgICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgICAgcXVlcnkgPSBfcmVmLnF1ZXJ5LFxuICAgICAgICAgIHByb3RvY29sID0gX3JlZi5wcm90b2NvbDtcblxuICAgICAgdmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG5cblxuICAgICAgdmFyIHBhcmFtU3RyaW5nID0gdGhpcy5nZXRQYXJhbVN0cmluZyhfZXh0ZW5kcyh7fSwgcGFyYW1zLCB7XG4gICAgICAgIGY6ICdqc29uJyxcbiAgICAgICAgdGV4dDogcXVlcnlcbiAgICAgIH0pKTtcblxuICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vZ2VvY29kZS5hcmNnaXMuY29tL2FyY2dpcy9yZXN0L3NlcnZpY2VzL1dvcmxkL0dlb2NvZGVTZXJ2ZXIvZmluZD8nICsgcGFyYW1TdHJpbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncGFyc2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJzZShfcmVmMikge1xuICAgICAgdmFyIGRhdGEgPSBfcmVmMi5kYXRhO1xuXG4gICAgICByZXR1cm4gZGF0YS5sb2NhdGlvbnMubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogci5mZWF0dXJlLmdlb21ldHJ5LngsXG4gICAgICAgICAgeTogci5mZWF0dXJlLmdlb21ldHJ5LnksXG4gICAgICAgICAgbGFiZWw6IHIubmFtZSxcbiAgICAgICAgICBib3VuZHM6IFtbci5leHRlbnQueW1pbiwgci5leHRlbnQueG1pbl0sIC8vIHMsIHdcbiAgICAgICAgICBbci5leHRlbnQueW1heCwgci5leHRlbnQueG1heF1dLFxuICAgICAgICAgIHJhdzogclxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFByb3ZpZGVyO1xufShfcHJvdmlkZXIyLmRlZmF1bHQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQcm92aWRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvZXNyaVByb3ZpZGVyLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3Byb3ZpZGVyID0gcmVxdWlyZSgnLi9wcm92aWRlcicpO1xuXG52YXIgX3Byb3ZpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3ZpZGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgUHJvdmlkZXIgPSBmdW5jdGlvbiAoX0Jhc2VQcm92aWRlcikge1xuICBfaW5oZXJpdHMoUHJvdmlkZXIsIF9CYXNlUHJvdmlkZXIpO1xuXG4gIGZ1bmN0aW9uIFByb3ZpZGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQcm92aWRlcik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFByb3ZpZGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUHJvdmlkZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQcm92aWRlciwgW3tcbiAgICBrZXk6ICdlbmRwb2ludCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuZHBvaW50KCkge1xuICAgICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICAgIHF1ZXJ5ID0gX3JlZi5xdWVyeSxcbiAgICAgICAgICBwcm90b2NvbCA9IF9yZWYucHJvdG9jb2w7XG5cbiAgICAgIHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zO1xuXG5cbiAgICAgIHZhciBwYXJhbVN0cmluZyA9IHRoaXMuZ2V0UGFyYW1TdHJpbmcoX2V4dGVuZHMoe30sIHBhcmFtcywge1xuICAgICAgICBhZGRyZXNzOiBxdWVyeVxuICAgICAgfSkpO1xuXG4gICAgICAvLyBnb29nbGUgcmVxdWlyZXMgYSBzZWN1cmUgY29ubmVjdGlvbiB3aGVuIHVzaW5nIGFwaSBrZXlzXG4gICAgICB2YXIgcHJvdG8gPSBwYXJhbXMgJiYgcGFyYW1zLmtleSA/ICdodHRwczonIDogcHJvdG9jb2w7XG4gICAgICByZXR1cm4gcHJvdG8gKyAnLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj8nICsgcGFyYW1TdHJpbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncGFyc2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJzZShfcmVmMikge1xuICAgICAgdmFyIGRhdGEgPSBfcmVmMi5kYXRhO1xuXG4gICAgICByZXR1cm4gZGF0YS5yZXN1bHRzLm1hcChmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHIuZ2VvbWV0cnkubG9jYXRpb24ubG5nLFxuICAgICAgICAgIHk6IHIuZ2VvbWV0cnkubG9jYXRpb24ubGF0LFxuICAgICAgICAgIGxhYmVsOiByLmZvcm1hdHRlZF9hZGRyZXNzLFxuICAgICAgICAgIGJvdW5kczogW1tyLmdlb21ldHJ5LnZpZXdwb3J0LnNvdXRod2VzdC5sYXQsIHIuZ2VvbWV0cnkudmlld3BvcnQuc291dGh3ZXN0LmxuZ10sIC8vIHMsIHdcbiAgICAgICAgICBbci5nZW9tZXRyeS52aWV3cG9ydC5ub3J0aGVhc3QubGF0LCByLmdlb21ldHJ5LnZpZXdwb3J0Lm5vcnRoZWFzdC5sbmddXSxcbiAgICAgICAgICByYXc6IHJcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQcm92aWRlcjtcbn0oX3Byb3ZpZGVyMi5kZWZhdWx0KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUHJvdmlkZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL2dvb2dsZVByb3ZpZGVyLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3Byb3ZpZGVyID0gcmVxdWlyZSgnLi9wcm92aWRlcicpO1xuXG52YXIgX3Byb3ZpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3ZpZGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgUHJvdmlkZXIgPSBmdW5jdGlvbiAoX0Jhc2VQcm92aWRlcikge1xuICBfaW5oZXJpdHMoUHJvdmlkZXIsIF9CYXNlUHJvdmlkZXIpO1xuXG4gIGZ1bmN0aW9uIFByb3ZpZGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQcm92aWRlcik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFByb3ZpZGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUHJvdmlkZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQcm92aWRlciwgW3tcbiAgICBrZXk6ICdlbmRwb2ludCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuZHBvaW50KCkge1xuICAgICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICAgIHF1ZXJ5ID0gX3JlZi5xdWVyeSxcbiAgICAgICAgICBwcm90b2NvbCA9IF9yZWYucHJvdG9jb2w7XG5cbiAgICAgIHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zO1xuXG5cbiAgICAgIHZhciBwYXJhbVN0cmluZyA9IHRoaXMuZ2V0UGFyYW1TdHJpbmcoX2V4dGVuZHMoe30sIHBhcmFtcywge1xuICAgICAgICBmb3JtYXQ6ICdqc29uJyxcbiAgICAgICAgcTogcXVlcnlcbiAgICAgIH0pKTtcblxuICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD8nICsgcGFyYW1TdHJpbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncGFyc2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJzZShfcmVmMikge1xuICAgICAgdmFyIGRhdGEgPSBfcmVmMi5kYXRhO1xuXG4gICAgICByZXR1cm4gZGF0YS5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiByLmxvbixcbiAgICAgICAgICB5OiByLmxhdCxcbiAgICAgICAgICBsYWJlbDogci5kaXNwbGF5X25hbWUsXG4gICAgICAgICAgYm91bmRzOiBbW3BhcnNlRmxvYXQoci5ib3VuZGluZ2JveFswXSksIHBhcnNlRmxvYXQoci5ib3VuZGluZ2JveFsyXSldLCAvLyBzLCB3XG4gICAgICAgICAgW3BhcnNlRmxvYXQoci5ib3VuZGluZ2JveFsxXSksIHBhcnNlRmxvYXQoci5ib3VuZGluZ2JveFszXSldXSxcbiAgICAgICAgICByYXc6IHJcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQcm92aWRlcjtcbn0oX3Byb3ZpZGVyMi5kZWZhdWx0KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUHJvdmlkZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL29wZW5TdHJlZXRNYXBQcm92aWRlci5qcyIsImltcG9ydCB7dG9nZ2xlTGF5ZXJ9IGZyb20gXCIuL2xheWVyXCI7XG5pbXBvcnQge21ha2VPcGFjaXR5U2xpZGVyfSBmcm9tIFwiLi9vcGFjaXR5U2xpZGVyXCJcbmltcG9ydCB7c2V0T3BhY2l0eVNsaWRlclBvc2l0aW9ufSBmcm9tIFwiLi9vcGFjaXR5U2xpZGVyXCJcbmltcG9ydCB7dXBkYXRlU2hhcmVVcmx9IGZyb20gXCIuL3NoYXJlXCI7XG5cbnZhciBsYXllckdyb3VwTGF5b3V0ID0gW11cbnZhciBsYXllckdyb3Vwc1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0QWN0aXZlTGF5ZXJHcm91cHMgKCkge1xuXHRyZXR1cm4gbGF5ZXJHcm91cExheW91dC5maWx0ZXIobGF5ZXJHcm91cCA9PiB7XG5cdFx0cmV0dXJuIGxheWVyR3JvdXAuYWN0aXZlXG5cdH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFBhbmVsU3RhdGUgKCkge1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXllckdyb3VwcyAoKSB7XG5cdHJldHVybiBsYXllckdyb3Vwc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0dXBQYW5lbCAobGF5ZXJzLCBsYXlvdXQpIHtcblx0bGF5ZXJHcm91cExheW91dCA9IGxheW91dFsnbGF5ZXItZ3JvdXBzLW9yZGVyJ11cblx0bGF5ZXJHcm91cHMgPSBtYWtlTGF5ZXJHcm91cHMobGF5b3V0WydsYXllci1ncm91cHMtb3JkZXInXSk7XG5cdG1ha2VMYXllckVsZW1zKGxheWVyR3JvdXBzLCBsYXllcnMpO1xuXHRtYWtlUGFuZWxEcmFnZ2FibGUoKVxuXHRzZXRQYW5lbFNjcm9sbEhhbmRsZXIoKVxufVxuXG5mdW5jdGlvbiBicm93c2VySXNJbnRlcm5ldEV4cGxvcmVyKCkge1xuXHR2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuXHRyZXR1cm4gdWEuaW5kZXhPZignTVNJRScpID4gLTEgfHwgdWEuaW5kZXhPZigncnY6MTEuMCcpID4gLTFcbn1cblxuZnVuY3Rpb24gc2V0UGFuZWxTY3JvbGxIYW5kbGVyKCkge1xuXHR2YXIgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmlnaHQtcGFuZWwnKVxuXHRwYW5lbC5vbnNjcm9sbCA9IHVwZGF0ZVBhbmVsRHJhZ092ZXJsYXlIZWlnaHRcbn1cblxuZnVuY3Rpb24gbWFrZVBhbmVsRHJhZ2dhYmxlKCkge1xuXHRpZiAoYnJvd3NlcklzSW50ZXJuZXRFeHBsb3JlcigpKSByZXR1cm5cblxuXHR2YXIgb3ZlcmxheSA9IGQzLnNlbGVjdCgnI3JpZ2h0LXBhbmVsLWRyYWctb3ZlcmxheScpXG5cblx0b3ZlcmxheS5zdHlsZSgnY3Vyc29yJywgJ2V3LXJlc2l6ZScpXG5cblx0b3ZlcmxheS5jYWxsKGQzLmRyYWcoKVxuXHRcdC5vbignZHJhZycsIGZ1bmN0aW9uICgpIHtcblx0XHRwYW5lbERyYWdFdmVudEhhbmRsZXIuY2FsbCh0aGlzKVxuXHR9KSk7XG59XG5cbmZ1bmN0aW9uIHBhbmVsRHJhZ0V2ZW50SGFuZGxlcigpIHtcblx0dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodCgpXG5cdHVwZGF0ZVBhbmVsV2lkdGgoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodCAoKSB7XG5cdHZhciBwYW5lbCA9IGQzLnNlbGVjdCgnI3JpZ2h0LXBhbmVsJylcblx0dmFyIHBhbmVsT2Zmc2V0SGVpZ2h0ID0gcGFuZWwucHJvcGVydHkoJ29mZnNldEhlaWdodCcpXG5cdHZhciBwYW5lbERyYWdPdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JpZ2h0LXBhbmVsLWRyYWctb3ZlcmxheScpXG5cdHZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmlnaHQtcGFuZWwtaGVhZGVyJylcblxuXHR2YXIgbmV3SGVpZ2h0XG5cblx0aWYgKHBhbmVsLmNsYXNzZWQoJ2dyYXBocy1hY3RpdmUnKSkge1xuXHRcdHZhciBncmFwaExpc3RFeHRyYVNwYWNlID0gNzAwXG5cdFx0dmFyIGdyYXBoTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaC1saXN0Jylcblx0XHRuZXdIZWlnaHQgPSBoZWFkZXIuc2Nyb2xsSGVpZ2h0ICsgZ3JhcGhMaXN0LnNjcm9sbEhlaWdodCArIGdyYXBoTGlzdEV4dHJhU3BhY2Vcblx0fVxuXHRlbHNlIHsgLy8gcGFuZWwuY2xhc3NlZCgnbGF5ZXJzLWFjdGl2ZScpXG5cdFx0dmFyIGxheWVyTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXllci1saXN0Jylcblx0XHRuZXdIZWlnaHQgPSBoZWFkZXIuc2Nyb2xsSGVpZ2h0ICsgbGF5ZXJMaXN0LnNjcm9sbEhlaWdodFxuXHR9XG5cdG5ld0hlaWdodCA9IG5ld0hlaWdodCA+IHBhbmVsT2Zmc2V0SGVpZ2h0ID8gYCR7bmV3SGVpZ2h0fWArJ3B4JyA6IG51bGxcblx0cGFuZWxEcmFnT3ZlcmxheS5zdHlsZS5oZWlnaHQgPSBuZXdIZWlnaHRcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGFuZWxXaWR0aCgpIHtcblx0dmFyIHBhbmVsID0gZDMuc2VsZWN0KCcjcmlnaHQtcGFuZWwnKVxuXHR2YXIgcGFuZWxNaW5XaWR0aCA9ICtwYW5lbC5zdHlsZSgnbWluLXdpZHRoJykuc2xpY2UoMCwgLTIpXG5cdHZhciBwYW5lbENsaWVudFdpZHRoID0gcGFuZWwucHJvcGVydHkoJ2NsaWVudFdpZHRoJylcblxuXHR2YXIgd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJylcblx0dmFyIHdyYXBwZXJXaWR0aCA9IHdyYXBwZXIuY2xpZW50V2lkdGhcblxuXHR2YXIgbWFwV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtd3JhcHBlcicpXG5cblx0dmFyIG1vdXNlWCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50Lnhcblx0dmFyIHhEZWx0YSA9ICh3cmFwcGVyV2lkdGggLSBtb3VzZVgpIC0gcGFuZWxDbGllbnRXaWR0aFxuXG5cdHZhciBuZXdQYW5lbFdpZHRoID0gcGFuZWxDbGllbnRXaWR0aCArIHhEZWx0YVxuXHRuZXdQYW5lbFdpZHRoID0gbmV3UGFuZWxXaWR0aCA8IHBhbmVsTWluV2lkdGggP1xuXHRcdHBhbmVsTWluV2lkdGhcblx0OiAgIG5ld1BhbmVsV2lkdGggPiB3cmFwcGVyV2lkdGggP1xuXHRcdHdyYXBwZXJXaWR0aFxuXHQ6ICAgbmV3UGFuZWxXaWR0aFxuXHRtYXBXcmFwcGVyLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke25ld1BhbmVsV2lkdGh9YCsncHgnXG5cdHBhbmVsLnN0eWxlKCd3aWR0aCcsIGAke25ld1BhbmVsV2lkdGh9YCsncHgnKVxufVxuXG5mdW5jdGlvbiBtYWtlTGF5ZXJHcm91cHMgKGxheW91dCkge1xuXHRyZXR1cm4gZDMuc2VsZWN0KCcjbGF5ZXItbGlzdCcpXG5cdFx0LnNlbGVjdEFsbCgnLmxheWVyLWdyb3VwLXdyYXBwZXInKVxuXHRcdC5kYXRhKGxheW91dClcblx0XHQuZW50ZXIoKVxuXHRcdFx0LmFwcGVuZCgnZGl2Jylcblx0XHRcdC5hdHRyKCdjbGFzcycsICdsYXllci1ncm91cC13cmFwcGVyJylcblx0XHRcdC5hdHRyKCdpZCcsIGxheWVyR3JvdXAgPT4gbGF5ZXJHcm91cC5pZClcblx0XHRcdC5jbGFzc2VkKCdhY3RpdmUnLCBsYXllckdyb3VwID0+IGxheWVyR3JvdXAuYWN0aXZlKVxuXHRcdFx0LmVhY2goZnVuY3Rpb24gKGxheWVyR3JvdXApIHtcblx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgnZGl2Jylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGF5ZXItZ3JvdXAtYnRuIGJ0bicpXG5cdFx0XHRcdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChsYXllckdyb3VwKSB7XG5cblx0XHRcdFx0XHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIHRvZ2dsZSB0aGUgbGF5ZXIgbGlzdCBhY2NvcmRpYW5zXG5cdFx0XHRcdFx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdFx0XHRcdCAgZXZlbnRDYXRlZ29yeTogJ2xheWVyIGxpc3QnLFxuXHRcdFx0XHRcdFx0ICBldmVudEFjdGlvbjogJ3RvZ2dsZSAnICsgIWxheWVyR3JvdXAuYWN0aXZlLFxuXHRcdFx0XHRcdFx0ICBldmVudExhYmVsOiBsYXllckdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHQgIG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGxheWVyR3JvdXAuYWN0aXZlID0gIWxheWVyR3JvdXAuYWN0aXZlO1xuXHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSkuY2xhc3NlZCgnYWN0aXZlJywgKCkgPT4gbGF5ZXJHcm91cC5hY3RpdmUpO1xuXHRcdFx0XHRcdFx0dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodCgpXG5cdFx0XHRcdFx0XHR1cGRhdGVTaGFyZVVybCgpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQudGV4dChsYXllckdyb3VwLm5hbWUpXG5cdFx0XHR9KVxuXHRcdFx0LmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnbGF5ZXItZ3JvdXAnKTtcbn1cblxuZnVuY3Rpb24gbWFrZUxheWVyRWxlbXMgKGxheWVyR3JvdXBzLCBsYXllcnMpIHtcblx0bGF5ZXJHcm91cHMuc2VsZWN0QWxsKCcubGF5ZXItc2VsZWN0Jylcblx0XHQuZGF0YShsYXllckdyb3VwID0+IGxheWVyc1tsYXllckdyb3VwLmlkXSlcblx0XHQuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgJ2xheWVyLXNlbGVjdCcpXG5cdFx0LmVhY2goZnVuY3Rpb24gKGxheWVyKSB7XG5cdFx0XHR2YXIgZ3JvdXBOYW1lID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuaWQ7XG5cdFx0XHR2YXIgbGF5ZXJEaXYgPSBkMy5zZWxlY3QodGhpcylcblx0XHRcdGxheWVyLmxheWVyRGl2ID0gbGF5ZXJEaXZcblx0XHRcdG1ha2VDaGVja2JveChsYXllciwgbGF5ZXJEaXYpO1xuXHRcdFx0bWFrZUxhYmVsKGxheWVyLCBsYXllckRpdik7XG5cdFx0XHRtYWtlRGVzY3JpcHRpb24obGF5ZXIsIGxheWVyRGl2KTtcblx0XHRcdGxheWVyRGl2Lm5vZGUoKS5hcHBlbmRDaGlsZChtYWtlTGF5ZXJUb29scyhsYXllcikpO1xuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBtYWtlQ2hlY2tib3ggKGxheWVyLCBsYXllckRpdikge1xuXHRsYXllckRpdi5hcHBlbmQoJ2lucHV0Jylcblx0XHQuYXR0cigndHlwZScsICdjaGVja2JveCcpXG5cdFx0LmF0dHIoJ2lkJywgbGF5ZXIgPT4gbGF5ZXIuaWQpXG5cdFx0LmF0dHIoJ2NoZWNrZWQnLCAobGF5ZXIpID0+IHtcblx0XHRcdHJldHVybiBsYXllci5hY3RpdmUgPyAnY2hlY2tlZCcgOiBudWxsO1xuXHRcdH0pXG5cdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGxheWVyKSB7XG5cdFx0XHR0b2dnbGVMYXllcihsYXllcilcblx0XHRcdHRvZ2dsZUxheWVyVG9vbHNVSShsYXllcilcblx0XHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZUxheWVyVG9vbHNVSSAobGF5ZXIpIHtcblx0bGF5ZXIubGF5ZXJEaXYuc2VsZWN0KCcubGF5ZXItdG9vbHMtd3JhcHBlcicpXG5cdFx0LmNsYXNzZWQoJ2FjdGl2ZScsIGxheWVyLmFjdGl2ZSk7XG5cdGlmIChsYXllci5hY3RpdmUpIHtcblx0XHR2YXIgc2xpZGVySGFuZGxlID0gbGF5ZXIubGF5ZXJEaXYuc2VsZWN0KCcub3BhY2l0eS1zbGlkZXItaGFuZGxlJykubm9kZSgpXG5cdFx0c2V0T3BhY2l0eVNsaWRlclBvc2l0aW9uKGxheWVyLCBzbGlkZXJIYW5kbGUsIGxheWVyLm9wYWNpdGl5KVxuXHR9ICAgIFxufVxuXG5mdW5jdGlvbiBtYWtlTGFiZWwobGF5ZXIsIGxheWVyRGl2KSB7XG5cdGxheWVyRGl2XG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHRcdC5hdHRyKCdjbGFzcycsICdsYXllci1sYWJlbC13cmFwcGVyJylcblx0XHQuYXBwZW5kKCdsYWJlbCcpXG5cdFx0XHQuYXR0cignZm9yJywgbGF5ZXIgPT4gbGF5ZXIuaWQpXG5cdFx0XHQuYXR0cignY2xhc3MnLCAnbGF5ZXItbGFiZWwnKVxuXHRcdFx0Lmh0bWwobGF5ZXIgPT4gbGF5ZXIubmFtZSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VEZXNjcmlwdGlvbiAobGF5ZXIsIGxheWVyRGl2KSB7XG5cdGlmIChsYXllci5pbmZvICYmIGxheWVyLmluZm8gIT09ICcnKSB7XG5cdFx0bGF5ZXJEaXYuYXBwZW5kKCdkaXYnKVxuXHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xheWVyLWluZm8tYnRuLXdyYXBwZXInKVxuXHRcdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSlcblx0XHRcdFx0XHQuc2VsZWN0KCcubGF5ZXItaW5mby13cmFwcGVyJylcblx0XHRcdFx0XHQuY2xhc3NlZCgnYWN0aXZlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCAgXG5cdFx0XHRcdFx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyBjbGljayBvbiBsYXllciBpbmZvXG5cdFx0XHRcdFx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdFx0XHRcdCAgZXZlbnRDYXRlZ29yeTogJ2xheWVyIGluZm8nLFxuXHRcdFx0XHRcdFx0ICBldmVudEFjdGlvbjogJ2NsaWNrZWQnLFxuXHRcdFx0XHRcdFx0ICBldmVudExhYmVsOiBsYXllci5uYW1lICsgXCIgXCIgKyAhZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2FjdGl2ZScpLFxuXHRcdFx0XHRcdFx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0XHRcdHJldHVybiAhZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHRcdFx0LmFwcGVuZCgnaW1nJylcblx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xheWVyLWluZm8taWNvbicpXG5cdFx0XHRcdC5hdHRyKCdzcmMnLCAnaW1ncy9tb3JlLWluZm8taWNvbi02NHg2NC5wbmcnKVxuXHRcdFx0XHQuYXR0cihcImFsdFwiLCBcIlJlYWQgbW9yZSBhYm91dCB0aGUgXCIgKyBsYXllci5uYW1lICsgXCIgbGF5ZXJcIilcblx0XHRcdFx0LmF0dHIoXCJ0aXRsZVwiLCBcIlJlYWQgbW9yZSBhYm91dCB0aGUgXCIgKyBsYXllci5uYW1lICsgXCIgbGF5ZXJcIilcblxuXHRcdGxheWVyRGl2LmFwcGVuZCgnZGl2Jylcblx0XHRcdC5hdHRyKCdjbGFzcycsICdsYXllci1pbmZvLXdyYXBwZXInKVxuXHRcdFx0LnRleHQobGF5ZXIgPT4gbGF5ZXIuaW5mbyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFrZUxheWVyVG9vbHMobGF5ZXIsIGxheWVyRGl2KSB7XG5cdHZhciBsYXllclRvb2xzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0bGF5ZXJUb29sc0Rpdi5jbGFzc0xpc3QuYWRkKCdsYXllci10b29scy13cmFwcGVyJylcblx0aWYgKGxheWVyLmFjdGl2ZSkgbGF5ZXJUb29sc0Rpdi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG5cdHZhciBvcGFjaXR5U2xpZGVyID0gbWFrZU9wYWNpdHlTbGlkZXIobGF5ZXIpO1xuXHR2YXIgbGVnZW5kID0gbWFrZUxlZ2VuZChsYXllcik7XG5cblx0bGF5ZXJUb29sc0Rpdi5hcHBlbmRDaGlsZChsZWdlbmQpXG5cdGxheWVyVG9vbHNEaXYuYXBwZW5kQ2hpbGQob3BhY2l0eVNsaWRlcilcblxuXHRyZXR1cm4gbGF5ZXJUb29sc0RpdlxufVxuXG5mdW5jdGlvbiBtYWtlTGVnZW5kIChsYXllciwgbGF5ZXJUb29sc1dyYXBwZXIpIHtcblx0dmFyIGxlZ2VuZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgbGVnZW5kSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcblx0bGVnZW5kV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdsZWdlbmQtd3JhcHBlcicpXG5cdGxlZ2VuZEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGxheWVyLmxlZ2VuZClcblx0bGVnZW5kV3JhcHBlci5hcHBlbmRDaGlsZChsZWdlbmRJbWcpXG5cdHJldHVybiBsZWdlbmRXcmFwcGVyXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9wYW5lbC5qcyIsImltcG9ydCB7R2V0TWFwfSBmcm9tIFwiLi9tYXBcIjtcbmltcG9ydCB7dXBkYXRlU2hhcmVVcmx9IGZyb20gXCIuL3NoYXJlXCI7XG5pbXBvcnQge3RvZ2dsZUxheWVyVG9vbHNVSX0gZnJvbSBcIi4vcGFuZWxcIjtcbi8qKlxuICogTmVlZGVkIGZvciB0aGUgc2hhcmUgdXJsIHNpbmNlIExlYWZsZXQgZG9lcyBub3QgaGF2ZSBhIGRlZmF1bHQgd2F5IHRvIHN1cmZhY2VcbiAqIHRoZSBvcmRlciBvZiBsYXllcnMgaW4gdGhlIG1hcFxuICovXG52YXIgX2N1cnJlbnRfbGF5ZXJzID0gW107XG52YXIgX2N1cnJlbnRfbGF5ZXJzX29iamVjdHMgPSBbXTtcblxuLyoqXG4gKiBOb3RlOiBsYXllciBpcyBub3QgdGhlIGxlYWZsZXQgY29uY2VwdCBvZiBhIGxheWVyLCBidXQgcmF0aGVyIHRoZSBpbnRlcm5hbFxuICogICAgICAgb2JqZWN0IHdoaWNoIHRyYWNrcyB0aGVtLiBsYXllci5tYXBMYXllciBpcyB0aGUgcG9pbnRlciB0byB0aGVcbiAqICAgICAgIGxlYWZsZXQgbGF5ZXIuXG4gKi9cblxuXG5leHBvcnQgZnVuY3Rpb24gR2V0Q3VycmVudExheWVycyAoKSB7XG5cdHJldHVybiBfY3VycmVudF9sYXllcnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0dXJuT2ZmTm9uQmFzZUxheWVycyAoKSB7XG5cdHdoaWxlIChfY3VycmVudF9sYXllcnNfb2JqZWN0cy5sZW5ndGgpIHtcblx0XHR2YXIgbGF5ZXIgPSBfY3VycmVudF9sYXllcnNfb2JqZWN0cy5wb3AoKVxuXHRcdGxheWVyLmFjdGl2ZSA9IGZhbHNlXG5cdFx0ZGlzYWJsZUxheWVyKGxheWVyKVxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVyLmlkKS5jaGVja2VkID0gZmFsc2Vcblx0XHR0b2dnbGVMYXllclRvb2xzVUkobGF5ZXIpXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZURlZmF1bHRMYXllcnMgKGxheWVycywgZGVmYXVsdExheWVycykge1xuXHR2YXIgaSwgaiwgcHJvcCwgbGF5ZXJncm91cDtcblx0dmFyIGRlZmF1bHRMYXllcjtcblx0dmFyIGZvdW5kTGF5ZXI7XG5cblx0aWYgKCFkZWZhdWx0TGF5ZXJzIHx8IGRlZmF1bHRMYXllcnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cblx0Zm9yIChpID0gMDsgaSA8IGRlZmF1bHRMYXllcnMubGVuZ3RoOyBpKyspIHtcblx0XHRmb3VuZExheWVyID0gZmFsc2U7XG5cdFx0ZGVmYXVsdExheWVyID0gZGVmYXVsdExheWVyc1tpXTtcblx0XHRmb3IgKHByb3AgaW4gbGF5ZXJzKSB7XG5cdFx0XHRpZiAoIWxheWVycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgcmV0dXJuO1xuXHRcdFx0bGF5ZXJncm91cCA9IGxheWVyc1twcm9wXTtcblx0XHRcdGZvciAoaiA9IDA7IGogPCBsYXllcmdyb3VwLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGlmIChsYXllcmdyb3VwW2pdLmlkID09PSBkZWZhdWx0TGF5ZXIpIHtcblx0XHRcdFx0XHRlbmFibGVMYXllcihsYXllcmdyb3VwW2pdKTtcblx0XHRcdFx0XHRmb3VuZExheWVyID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGZvdW5kTGF5ZXIpIGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlTGF5ZXIgKGxheWVyKSB7XG5cdGlmICghbGF5ZXIuYWN0aXZlKSB7XG5cdFx0ZW5hYmxlTGF5ZXIobGF5ZXIpO1xuXG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgdG9nZ2xlIHRoZSBsYXllciBvblxuXHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdCAgZXZlbnRDYXRlZ29yeTogJ2xheWVyJyxcblx0XHQgIGV2ZW50QWN0aW9uOiAndG9nZ2xlIG9uJyxcblx0XHQgIGV2ZW50TGFiZWw6IGxheWVyLm5hbWUsXG5cdFx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHR9KTtcblxuXHR9IGVsc2Uge1xuXHRcdGRpc2FibGVMYXllcihsYXllcik7XG5cblx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyB0b2dnbGUgdGhlIGxheWVyIG9mZlxuXHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdCAgZXZlbnRDYXRlZ29yeTogJ2xheWVyJyxcblx0XHQgIGV2ZW50QWN0aW9uOiAndG9nZ2xlIG9mZicsXG5cdFx0ICBldmVudExhYmVsOiBsYXllci5uYW1lLFxuXHRcdCAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdFx0fSk7XG5cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlTGF5ZXIgKGxheWVyKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHRsYXllci5hY3RpdmUgPSB0cnVlO1xuXHRsYXllci5tYXBMYXllciA9IGxheWVyLm1hcExheWVyIHx8IG1ha2VXbXNUaWxlTGF5ZXIobGF5ZXIpO1xuXHRtYXAuYWRkTGF5ZXIobGF5ZXIubWFwTGF5ZXIpO1xuXHRhZGRMYXllclRvSW50ZXJuYWxUcmFja2VyKGxheWVyKTtcblx0bW92ZU92ZXJsYXlMYXllcnNUb1RvcCgpO1xuXHR1cGRhdGVTaGFyZVVybCgpO1xufVxuXG5mdW5jdGlvbiBtb3ZlT3ZlcmxheUxheWVyc1RvVG9wICgpIHtcblx0dmFyIGxheWVyO1xuXHR2YXIgaSwgbDtcblxuXHRmb3IgKGkgPSAwLCBsID0gX2N1cnJlbnRfbGF5ZXJzX29iamVjdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0bGF5ZXIgPSBfY3VycmVudF9sYXllcnNfb2JqZWN0c1tpXTtcblx0XHRpZiAobGF5ZXIudHlwZSA9PT0gXCJvdmVybGF5XCIpIGxheWVyLm1hcExheWVyLmJyaW5nVG9Gcm9udCgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFkZExheWVyVG9JbnRlcm5hbFRyYWNrZXIgKGxheWVyKSB7XG5cdF9jdXJyZW50X2xheWVycy5wdXNoKGxheWVyLmlkKTtcblx0X2N1cnJlbnRfbGF5ZXJzX29iamVjdHMucHVzaChsYXllcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlTGF5ZXIgKGxheWVyKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHRsYXllci5hY3RpdmUgPSBmYWxzZTtcblx0aWYgKGxheWVyLm1hcExheWVyICYmIG1hcC5oYXNMYXllcihsYXllci5tYXBMYXllcikpIHtcblx0XHRtYXAucmVtb3ZlTGF5ZXIobGF5ZXIubWFwTGF5ZXIpO1xuXHR9XG5cdHJlbW92ZUxheWVyRnJvbUludGVybmFsVHJhY2tlcihsYXllcik7XG5cdHVwZGF0ZVNoYXJlVXJsKCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUxheWVyRnJvbUludGVybmFsVHJhY2tlciAobGF5ZXIpIHtcblx0dmFyIGxvYyA9IF9jdXJyZW50X2xheWVycy5pbmRleE9mKGxheWVyLmlkKTtcblx0aWYgKGxvYyA9PT0gLTEpIHJldHVybjtcblx0X2N1cnJlbnRfbGF5ZXJzLnNwbGljZShsb2MsIDEpO1xuXHRfY3VycmVudF9sYXllcnNfb2JqZWN0cy5zcGxpY2UobG9jLCAxKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUxheWVyT3BhY2l0eSAobGF5ZXIsIG5ld09wYWNpdHkpIHtcblx0bGF5ZXIub3BhY2l0eSA9IG5ld09wYWNpdHlcblx0bGF5ZXIubWFwTGF5ZXIuc2V0T3BhY2l0eShuZXdPcGFjaXR5KVxufVxuXG5mdW5jdGlvbiBtYWtlV21zVGlsZUxheWVyIChsYXllcikge1xuXHRyZXR1cm4gTC50aWxlTGF5ZXIud21zKGxheWVyLnVybCwge1xuXHRcdGxheWVyczogbGF5ZXIuaWQsXG5cdFx0dHJhbnNwYXJlbnQ6IGxheWVyLnRyYW5zcGFyZW50IHx8IHRydWUsXG5cdFx0dmVyc2lvbjogbGF5ZXIudmVyc2lvbiB8fCAnMS4zLjAnLFxuXHRcdGNyczogbGF5ZXIuY3JzIHx8IEwuQ1JTLkVQU0c5MDA5MTMsXG5cdFx0Zm9ybWF0OiBsYXllci5mb3JtYXQgfHwgJ2ltYWdlL3BuZycsXG5cdFx0b3BhY2l0eTogbGF5ZXIub3BhY2l0eSB8fCAuNzUsXG5cdFx0dGlsZVNpemU6IGxheWVyLnRpbGVTaXplIHx8IDEwMjRcblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9sYXllci5qcyIsImltcG9ydCB7cmVtb3ZlQWxsUG9pbnRzT2ZJbnRlcmVzdH0gZnJvbSAnLi9wb2knXG5pbXBvcnQge3R1cm5PZmZOb25CYXNlTGF5ZXJzfSBmcm9tICcuL2xheWVyJ1xuaW1wb3J0IHtyZW1vdmVBbGxHcmFwaHN9IGZyb20gJy4vZ3JhcGgnXG5pbXBvcnQge3Jlc2V0UGFuZWxTdGF0ZX0gZnJvbSAnLi9wYW5lbCdcbmltcG9ydCB7dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodH0gZnJvbSAgJy4vcGFuZWwnXG5pbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tICcuL3NoYXJlJ1xuXG52YXIgbWFwO1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNYXAgKCkge1xuXHRyZW1vdmVBbGxQb2ludHNPZkludGVyZXN0KClcblx0cmVtb3ZlQWxsR3JhcGhzKClcblx0dHVybk9mZk5vbkJhc2VMYXllcnMoKVxuXHRyZXNldFBhbmVsU3RhdGUoKVxuXHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KClcblx0dXBkYXRlU2hhcmVVcmwoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlTWFwIChtYXBDb25maWcpIHtcblx0dmFyIGlkID0gbWFwQ29uZmlnLmlkIHx8IFwibWFwXCI7XG5cdHZhciBvcHRpb25zID0gbWFwQ29uZmlnLm9wdGlvbnMgfHwge1wic2Nyb2xsV2hlZWxab29tXCIgOiBmYWxzZX07XG5cdHZhciBpbml0aWFsQ2VudGVyID0gbWFwQ29uZmlnLmNlbnRlciB8fCBbXCIzOC41XCIsIFwiLTgxXCJdO1xuXHR2YXIgaW5pdGlhbFpvb20gPSBtYXBDb25maWcuem9vbSB8fCA2O1xuXG5cdG1hcCA9IEwubWFwKGlkLCBvcHRpb25zKS5zZXRWaWV3KGluaXRpYWxDZW50ZXIsIGluaXRpYWxab29tKTtcblx0TC5jb250cm9sLmF0dHJpYnV0aW9uKCkuYWRkVG8obWFwKVxuXG5cdHZhciBsZWFmbGV0Wm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxlYWZsZXQtY29udHJvbC16b29tLWluXCIpWzBdO1xuXG5cdGxlYWZsZXRab29tSW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZm9yIHNlYWNyY2ggYnkgYWRkcmVzc1xuXHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0XHRldmVudEFjdGlvbjogJ2NsaWNrIGJ1dHRvbicsXG5cdFx0XHRldmVudExhYmVsOiAnem9vbSBpbicsXG5cdFx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHR9KTtcblx0fSlcblxuXHR2YXIgbGVhZmxldFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGVhZmxldC1jb250cm9sLXpvb20tb3V0XCIpWzBdO1xuXG5cdGxlYWZsZXRab29tT3V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciBzZWFjcmNoIGJ5IGFkZHJlc3Ncblx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdtYXAnLFxuXHRcdFx0ZXZlbnRBY3Rpb246ICdjbGljayBidXR0b24nLFxuXHRcdFx0ZXZlbnRMYWJlbDogJ3pvb20gb3V0Jyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXHR9KVxuXG5cdG1hcC5vbihcImRyYWdlbmRcIiwgZnVuY3Rpb24oZSl7XG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZm9yIGRyYWcgKHBhbikgZW5kXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRldmVudENhdGVnb3J5OiAnbWFwJyxcblx0XHRcdGV2ZW50QWN0aW9uOiAnZHJhZycsXG5cdFx0XHRldmVudExhYmVsOiBKU09OLnN0cmluZ2lmeShtYXAuZ2V0Qm91bmRzKCkpLFxuXHRcdFx0bm9uSW50ZXJhY3Rpb246IHRydWVcblx0XHR9KTtcblx0fSlcblxuXHRtYXAub24oXCJ6b29tZW5kXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciB6b29tIGVuZFxuXHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0XHRldmVudEFjdGlvbjogJ3pvb20nLFxuXHRcdFx0ZXZlbnRMYWJlbDogSlNPTi5zdHJpbmdpZnkobWFwLmdldEJvdW5kcygpKSxcblx0XHRcdG5vbkludGVyYWN0aW9uOiB0cnVlXG5cdFx0fSk7XG5cdH0pXG5cdHJldHVybiBtYXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRNYXAgKCkge1xuXHRyZXR1cm4gbWFwO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvbWFwLmpzIiwiaW1wb3J0IHtjcmVhdGVHcmFwaERpdn0gZnJvbSAnLi9ncmFwaCc7XG5pbXBvcnQge2NyZWF0ZU1hcmtlciwgZ2V0SWNvbn0gZnJvbSAnLi9tYXJrZXInO1xuaW1wb3J0IHt1cGRhdGVTaGFyZVVybH0gZnJvbSAnLi9zaGFyZSc7XG5pbXBvcnQge0dldE1hcH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHtHZXRBY3RpdmVUYWIsIEhhbmRsZVRhYkNoYW5nZX0gZnJvbSAnLi90YWJzJztcbmltcG9ydCB7dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodH0gZnJvbSAnLi9wYW5lbCc7XG5cbnZhciBfcG9pbnRzX29mX2ludGVyZXN0ID0gW11cblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmRHcmFwaEV2ZW50cyAobWFwKSB7XG5cdG1hcC5vbihcImNsaWNrXCIsIGhhbmRsZU1hcENsaWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbFBvaW50c09mSW50ZXJlc3QgKCkge1xuXHR2YXIgbWFwID0gR2V0TWFwKClcblx0X3BvaW50c19vZl9pbnRlcmVzdC5mb3JFYWNoKHBvaSA9PiB7XG5cdFx0bWFwLnJlbW92ZUxheWVyKHBvaS5tYXJrZXIpXG5cdH0pXG5cdF9wb2ludHNfb2ZfaW50ZXJlc3QgPSBbXVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXBDbGljayAoZSkge1xuXHR2YXIgbWFwID0gdGhpcztcblx0dmFyIGxhdCA9IGUubGF0bG5nLmxhdDtcblx0dmFyIGxuZyA9IGUubGF0bG5nLmxuZztcblxuXHR2YXIgcG9pID0gY3JlYXRlUE9JKGxhdCwgbG5nLCBudWxsKTtcblx0QWRkUG9pbnRPZkludGVyZXN0VG9UcmFja2VyKHBvaSk7XG5cdFNldHVwUG9pbnRPZkludGVyZXN0VUkobWFwLCBwb2kpO1xuXHR1cGRhdGVTaGFyZVVybCgpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGV2ZW50IGNsaWNrIG9uIG1hcFxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRldmVudENhdGVnb3J5OiAnbWFwJyxcblx0XHRldmVudEFjdGlvbjogJ2NsaWNrJyxcblx0XHRldmVudExhYmVsOiBKU09OLnN0cmluZ2lmeSh7XCJhY3Rpb25cIjpcImFkZCBtYXAgbWFya2VyXCIsXCJsYXRcIjpsYXQsXCJsb25nXCI6bG5nfSksXG5cdFx0bm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHcmFwaFJlbW92ZXIgKG1hcCwgZGl2LCBtYXJrZXIsIHBvaSkge1xuXHR2YXIgZWxlbSA9IGNyZWF0ZUdyYXBoUmVtb3ZlckVsZW0oKTtcblx0ZGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmFwaC1lbGVtLWhlYWRlclwiKVswXS5hcHBlbmRDaGlsZChlbGVtKTtcblx0ZDMuc2VsZWN0KGVsZW0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgcmVtb3ZlIGdyYXBoXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRldmVudENhdGVnb3J5OiAnZ3JhcGgnLFxuXHRcdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0XHRldmVudExhYmVsOiAncmVtb3ZlJyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXG5cdFx0UmVtb3ZlUG9pbnRPZkludGVyZXN0RnJvbVRyYWNrZXIocG9pKVxuXHRcdFJlbW92ZVBvaW50T2ZJbnRlcmVzdFVJKG1hcCwgZGl2LCBtYXJrZXIpXG5cdFx0dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodCgpXG5cdFx0dXBkYXRlU2hhcmVVcmwoKVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR3JhcGhSZW1vdmVyRWxlbSAoKSB7XG5cdHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0ZWxlbS5jbGFzc05hbWUgPSBcInJlbW92ZS1ncmFwaFwiO1xuXHRlbGVtLmlubmVyVGV4dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoXCIxMDAwNVwiKTtcblx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIlJlbW92ZSBncmFwaFwiKTtcblx0cmV0dXJuIGVsZW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRBbGxQb2ludHNPZkludGVyZXN0ICgpIHtcblx0cmV0dXJuIF9wb2ludHNfb2ZfaW50ZXJlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQT0kgKGxhdCwgbG5nLCBwbG90cykge1xuXHRyZXR1cm4ge1xuXHRcdGxhdDogbGF0LFxuXHRcdGxuZzogbG5nLFxuXHRcdHBsb3RzOiBwbG90cyB8fCBbXCJMMTBfRGF5XCIsIFwiTDUwX0RheVwiLCBcIkw5MF9EYXlcIiwgXCJMMTBfTmlnaHRcIiwgXCJMNTBfTmlnaHRcIiwgXCJMOTBfTmlnaHRcIl1cblx0fVxufVxuXG5mdW5jdGlvbiBBZGRQb2ludE9mSW50ZXJlc3RUb1RyYWNrZXIgKHBvaSkge1xuXHRfcG9pbnRzX29mX2ludGVyZXN0LnB1c2gocG9pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNldHVwUG9pbnRzT2ZJbnRlcmVzdCAobWFwLCBuZXdQb2lzKSB7XG5cdEFkZE11bHRpcGxlUG9pbnRzT2ZJbnRlcmVzdChuZXdQb2lzKVxuXHR2YXIgcG9pcyA9IEdldEFsbFBvaW50c09mSW50ZXJlc3QoKVxuXHR2YXIgbWFwID0gR2V0TWFwKClcblx0cG9pcy5mb3JFYWNoKHBvaSA9PiB7XG5cdFx0U2V0dXBQb2ludE9mSW50ZXJlc3RVSShtYXAsIHBvaSlcblx0fSlcbn1cblxuZnVuY3Rpb24gQWRkTXVsdGlwbGVQb2ludHNPZkludGVyZXN0IChwb2lzKSB7XG5cdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KF9wb2ludHNfb2ZfaW50ZXJlc3QsIHBvaXMpO1xufVxuXG5mdW5jdGlvbiBSZW1vdmVQb2ludE9mSW50ZXJlc3RGcm9tVHJhY2tlcihwb2lUb1JlbW92ZSkge1xuXHRfcG9pbnRzX29mX2ludGVyZXN0ID0gX3BvaW50c19vZl9pbnRlcmVzdC5maWx0ZXIocG9pID0+IHtcblx0XHRyZXR1cm4gIShwb2kgPT09IHBvaVRvUmVtb3ZlKVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gU2V0dXBQb2ludE9mSW50ZXJlc3RVSSAobWFwLCBwb2kpIHtcblx0dmFyIGRpdiA9IGNyZWF0ZUdyYXBoRGl2KHBvaSk7XG5cdHZhciBtYXJrZXIgPSBjcmVhdGVNYXJrZXIocG9pLmxhdCwgcG9pLmxuZyk7XG5cdHBvaS5ncmFwaERpdiA9IGRpdlxuXHRwb2kubWFya2VyID0gbWFya2VyXG5cdG1hcmtlci5hZGRUbyhtYXApXG5cdGNyZWF0ZUdyYXBoUmVtb3ZlcihtYXAsIGRpdiwgbWFya2VyLCBwb2kpO1xuXG5cdGQzLnNlbGVjdChkaXYpLm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdG1hcmtlci5zZXRJY29uKGdldEljb24oJ2hvdmVyJykpO1xuXHR9KVxuXHRkMy5zZWxlY3QoZGl2KS5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuXHRcdG1hcmtlci5zZXRJY29uKGdldEljb24oJ2dyYXBoJykpO1xuXHR9KVxuXHRtYXJrZXIub24oJ2NsaWNrIGRibGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRoYW5kbGVNYXJrZXJNb3VzZUV2ZW50KGUsIHBvaSlcblx0fSlcblx0bWFya2VyLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZSkge1xuXHRcdG1hcmtlci5zZXRJY29uKGdldEljb24oJ2hvdmVyJykpXG5cdH0pXG5cdG1hcmtlci5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdG1hcmtlci5zZXRJY29uKGdldEljb24oJ2dyYXBoJykpXG5cdFx0cG9pLmdyYXBoRGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Bhbi10by1tYXJrZXItYnRuJylbMF0uY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1hcmtlck1vdXNlRXZlbnQgKGUsIHBvaSkge1xuXHRlLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0SGFuZGxlVGFiQ2hhbmdlKCdncmFwaHMtYWN0aXZlJylcblx0c2Nyb2xsVG9Qb2ludE9mSW50ZXJlc3RHcmFwaChwb2kpXG5cdHRyaWdnZXJHcmFwaEFuaW1hdGlvbihwb2kpXG59XG5cbmZ1bmN0aW9uIHRyaWdnZXJHcmFwaEFuaW1hdGlvbiAocG9pKSB7XG5cdHBvaS5ncmFwaERpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYW4tdG8tbWFya2VyLWJ0bicpWzBdLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxufVxuXG5mdW5jdGlvbiBzY3JvbGxUb1BvaW50T2ZJbnRlcmVzdEdyYXBoIChwb2kpIHtcblx0dmFyIHJpZ2h0UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmlnaHQtcGFuZWwnKTtcblx0cmlnaHRQYW5lbC5zY3JvbGxUb3AgPSBwb2kuZ3JhcGhEaXYub2Zmc2V0VG9wO1xufVxuXG5mdW5jdGlvbiBSZW1vdmVQb2ludE9mSW50ZXJlc3RVSSAobWFwLCBkaXYsIG1hcmtlcikge1xuXHR2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaC1saXN0Jyk7XG5cdGxpc3QucmVtb3ZlQ2hpbGQoZGl2KTtcblx0bWFwLnJlbW92ZUxheWVyKG1hcmtlcik7XG5cdHVwZGF0ZVNoYXJlVXJsKClcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3BvaS5qcyIsImltcG9ydCB7dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodH0gZnJvbSAnLi9wYW5lbCdcbmltcG9ydCB7dXBkYXRlU2hhcmVVcmx9IGZyb20gJy4vc2hhcmUnXG5pbXBvcnQge0dldE1hcH0gZnJvbSAnLi9tYXAnXG5pbXBvcnQge0dldEFqYXhPYmplY3R9IGZyb20gJy4vcGFyc2VyJ1xuXG52YXIgdGlwID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXR1cEdyYXBocyAoKSB7XG4gIGQzLnNlbGVjdEFsbChcIi5ncmFwaC10eXBlLWJ0blwiKS5vbihcImNsaWNrXCIsIGhhbmRsZUdyYXBoVHlwZUJ0bkNsaWNrKTtcbiAgZXh0ZW5kRGF0ZU1vZHVsZSgpO1xuICB0aXAgPSBkMy50aXAoKS5hdHRyKCdjbGFzcycsICdkMy10aXAnKS5odG1sKGZ1bmN0aW9uIChkKSB7IHJldHVybiBkOyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbEdyYXBocygpIHtcbiAgdmFyIGdyYXBoTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaC1saXN0JylcbiAgd2hpbGUgKGdyYXBoTGlzdC5maXJzdENoaWxkKSB7XG4gICAgZ3JhcGhMaXN0LnJlbW92ZUNoaWxkKGdyYXBoTGlzdC5maXJzdENoaWxkKVxuICB9XG59XG5cbmZ1bmN0aW9uIGV4dGVuZERhdGVNb2R1bGUgKCkge1xuICBEYXRlLnByb3RvdHlwZS5pc0xlYXBZZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHllYXIgPSB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgaWYgKCh5ZWFyICYgMykgIT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiAoKHllYXIgJSAxMDApICE9IDAgfHwgKHllYXIgJSA0MDApID09IDApO1xuICB9O1xuXG4gIC8vIEdldCBEYXkgb2YgWWVhclxuICBEYXRlLnByb3RvdHlwZS5nZXRET1kgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF5Q291bnQgPSBbMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzRdO1xuICAgIHZhciBtbiA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICB2YXIgZG4gPSB0aGlzLmdldERhdGUoKTtcbiAgICB2YXIgZGF5T2ZZZWFyID0gZGF5Q291bnRbbW5dICsgZG47XG4gICAgaWYgKG1uID4gMSAmJiB0aGlzLmlzTGVhcFllYXIoKSkgZGF5T2ZZZWFyKys7XG4gICAgcmV0dXJuIGRheU9mWWVhcjtcbiAgfTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBHUkFQSCBEQVRBIFBST0NFU1NJTkcgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBoYW5kbGVHcmFwaERhdGFSZXNwb25zZSAoZGl2LCBwb2ksIHJlc3BvbnNlKSB7XG4gIHJlc3BvbnNlID0gcmVzcG9uc2UucmVwbGFjZSgvXFxbfFxcXXxcXCcvZywgXCJcIikuc3BsaXQoXCIsIFwiKTtcbiAgZHJhd0dyYXBoKHJlc3BvbnNlLCBkaXYsIHBvaSk7XG4gIHVwZGF0ZVBhbmVsRHJhZ092ZXJsYXlIZWlnaHQoKVxufVxuXG5mdW5jdGlvbiBnZXREYXRhKHBvaSwgZGl2KSB7XG4gIHZhciB1cmwgPSBcImh0dHBzOi8vZ2lzLm5lbWFjLm9yZy9icnJjLWRhdGE/YXJncz1cIiArIHBvaS5sbmcgKyBcIixcIiArIHBvaS5sYXQ7XG4gIHZhciBvUmVxID0gR2V0QWpheE9iamVjdChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBoYW5kbGVHcmFwaERhdGFSZXNwb25zZShkaXYsIHBvaSwgcmVzcG9uc2UpXG4gIH0pXG5cbiAgb1JlcS5vcGVuKFwiR0VUXCIsIHVybCk7XG4gIG9SZXEuc2VuZCgpXG59XG5cbmZ1bmN0aW9uIHNwbGl0RGF0YShkYXRhKSB7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGRhdGFbaV0gPSBkYXRhW2ldLnNwbGl0KFwiLFwiKTtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gcmVwcm9jZXNzRGF0YSAob3JpZ0RhdGEpIHtcbiAgcmV0dXJuIG9yaWdEYXRhLm1hcCgoZCwgaSkgPT4ge1xuICAgIGlmIChkWzBdLmluZGV4T2YoXCJTcHJpbmdBdXR1bW5cIikgPiAtMSkge1xuICAgICAgZFswXSA9IGRbMF0ucmVwbGFjZShcbiAgICAgICAgXCJTcHJpbmdBdXR1bW5cIixcbiAgICAgICAgaSAlIDIgPT09IDAgPyBcIlNwcmluZ1wiIDogXCJBdXR1bW5cIlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gZFxuICB9KVxufVxuXG5mdW5jdGlvbiBjb21wdXRlQXZlcmFnZSAoYXJyKSB7XG4gIHZhciBzdW0gPSAwLCBpLCBsO1xuXG4gIGZvciAoaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgc3VtICs9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiAoc3VtIC8gbCkudG9TdHJpbmcoKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBHUkFQSCBJTlRFUkZBQ0UgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGhhbmRsZUdyYXBoVHlwZUJ0bkNsaWNrICgpIHtcbiAgdmFyIHR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJyk7XG4gIHZhciBhY3RpdmVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyYXBoLXR5cGUtYnRuIGFjdGl2ZVwiKVswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpO1xuXG4gIGlmICh0eXBlID09PSBhY3RpdmVUeXBlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy9zZW5kIGdvb2dsZSBhbmFseXRpY3MgY2xpY2sgb24gZ3JhcGggdHlwZVxuICBnYSgnc2VuZCcsICdldmVudCcsIHtcbiAgICBldmVudENhdGVnb3J5OiAnZ3JhcGggdHlwZScsXG4gICAgZXZlbnRBY3Rpb246ICdjbGljaycsXG4gICAgZXZlbnRMYWJlbDogdHlwZSxcbiAgICBub25JbnRlcmFjdGlvbjogZmFsc2VcbiAgfSk7XG5cbiAgSGFuZGxlR3JhcGhUYWJDaGFuZ2UodHlwZSwgYWN0aXZlVHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5kbGVHcmFwaFRhYkNoYW5nZSAoZ3JhcGhUeXBlKSB7XG4gIGlmICghaXNHcmFwaExpc3RFbXB0eSgpKSB7XG4gICAgdmFyIG9sZEFjdGl2ZUdyYXBoRWxlbUhlaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dyYXBoLWVsZW0nKVswXS5zY3JvbGxIZWlnaHRcbiAgICB2YXIgb2xkQWN0aXZlR3JhcGhJbmZvSGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ3JhcGgtdHlwZS1pbmZvIGFjdGl2ZScpWzBdLnNjcm9sbEhlaWdodFxuICAgIHZhciByaWdodFBhbmVsU2Nyb2xsVG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JpZ2h0LXBhbmVsJykuc2Nyb2xsVG9wXG4gIH1cbiAgZGlzYWJsZUFjdGl2ZUdyYXBoVGFiKCk7XG4gIGVuYWJsZUdyYXBoVGFiKGdyYXBoVHlwZSk7XG4gIGlmICghaXNHcmFwaExpc3RFbXB0eSgpKSBhZGp1c3RTY3JvbGxQb3NpdGlvbihvbGRBY3RpdmVHcmFwaEluZm9IZWlnaHQsIG9sZEFjdGl2ZUdyYXBoRWxlbUhlaWdodCwgcmlnaHRQYW5lbFNjcm9sbFRvcClcbiAgdXBkYXRlU2hhcmVVcmwoKTtcbn1cblxuZnVuY3Rpb24gaXNHcmFwaExpc3RFbXB0eSgpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dyYXBoLWVsZW0nKVswXSA9PT0gdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIGFkanVzdFNjcm9sbFBvc2l0aW9uKG9sZEdyYXBoSW5mb0hlaWdodCwgb2xkR3JhcGhFbGVtSGVpZ2h0LCBvbGRSaWdodFBhbmVsU2Nyb2xsVG9wKSB7XG4gIHZhciBuZXdHcmFwaEluZm9IZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdncmFwaC10eXBlLWluZm8gYWN0aXZlJylbMF0uc2Nyb2xsSGVpZ2h0XG4gIHZhciBuZXdHcmFwaEVsZW1IZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdncmFwaC1lbGVtJylbMF0uc2Nyb2xsSGVpZ2h0XG5cbiAgdmFyIG5ld0dyYXBoRWxlbUhlaWdodFNjYWxlID0gKG5ld0dyYXBoRWxlbUhlaWdodCAvIG9sZEdyYXBoRWxlbUhlaWdodClcbiAgdmFyIG5ld1JpZ2h0UGFuZWxTY3JvbGxUb3AgPSBuZXdHcmFwaEluZm9IZWlnaHQgKyAoXG4gICAgKG9sZFJpZ2h0UGFuZWxTY3JvbGxUb3AgLSBvbGRHcmFwaEluZm9IZWlnaHQpICogbmV3R3JhcGhFbGVtSGVpZ2h0U2NhbGVcbiAgKVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyaWdodC1wYW5lbCcpLnNjcm9sbFRvcCA9IG5ld1JpZ2h0UGFuZWxTY3JvbGxUb3Bcbn1cblxuZnVuY3Rpb24gZGlzYWJsZUFjdGl2ZUdyYXBoVGFiICgpIHtcbiAgdmFyIGFjdGl2ZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ3JhcGgtdHlwZS1idG4gYWN0aXZlXCIpWzBdO1xuICB2YXIgYWN0aXZlQ2xhc3MgPSBcImdyYXBoLVwiICsgYWN0aXZlRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIik7XG5cbiAgYWN0aXZlRWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXBoLWxpc3RcIikuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcyk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUdyYXBoVGFiIChncmFwaFR5cGUpIHtcbiAgZDMuc2VsZWN0KFwiLmdyYXBoLXR5cGUtYnRuW2RhdGEtdHlwZT0nXCIgKyBncmFwaFR5cGUgKyBcIiddXCIpLmNsYXNzZWQoXCJhY3RpdmVcIiwgdHJ1ZSk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JhcGgtbGlzdFwiKS5jbGFzc0xpc3QuYWRkKFwiZ3JhcGgtXCIgKyBncmFwaFR5cGUpO1xuICBkMy5zZWxlY3RBbGwoJy5ncmFwaC10eXBlLWluZm8nKVxuICAuY2xhc3NlZCgnYWN0aXZlJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBncmFwaFR5cGUgPT09IHRoaXMuaWQuc3BsaXQoJy0nKVswXVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR3JhcGhEaXYgKHBvaSkge1xuICB2YXIgZGVjaW1hbFBsYWNlcyA9IDNcbiAgdmFyIGxhdFNob3J0ID0gcm91bmRGbG9hdChwb2kubGF0LCBkZWNpbWFsUGxhY2VzKVxuICB2YXIgbG5nU2hvcnQgPSByb3VuZEZsb2F0KHBvaS5sbmcsIGRlY2ltYWxQbGFjZXMpXG4gIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaGVhZGVyKVxuICB2YXIgem9vbVRvTWFya2VyQnV0dG9uID0gbWFrZVpvb21Ub01hcE1hcmtlckJ1dHRvbihwb2kpXG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJMYXQ6IFwiICsgbGF0U2hvcnQgKyBcIiwgTG9uZzogXCIgKyBsbmdTaG9ydCk7XG4gIHZhciBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY29udGVudERpdi5jbGFzc05hbWUgPSBcImdyYXBoLWxhdC1sb25cIjtcbiAgY29udGVudERpdi5hcHBlbmRDaGlsZChjb250ZW50KTtcblxuICBoZWFkZXIuYXBwZW5kQ2hpbGQoem9vbVRvTWFya2VyQnV0dG9uKVxuICBoZWFkZXIuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XG5cbiAgdmFyIGxvYWRpbmdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBsb2FkaW5nRGl2LmNsYXNzTGlzdC5hZGQoXCJncmFwaC1sb2FkaW5nLWRpdlwiKTtcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChsb2FkaW5nRGl2KTtcblxuICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJncmFwaC1lbGVtXCIpO1xuICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJncmFwaC1sb2FkaW5nXCIpO1xuICBoZWFkZXIuY2xhc3NMaXN0LmFkZChcImdyYXBoLWVsZW0taGVhZGVyXCIpO1xuXG4gIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaC1saXN0XCIpO1xuICBsaXN0LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuICBnZXREYXRhKHBvaSwgd3JhcHBlcik7XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5mdW5jdGlvbiBtYWtlWm9vbVRvTWFwTWFya2VyQnV0dG9uKHBvaSkge1xuICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJylcbiAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Bhbi10by1tYXJrZXItYnRuJylcbiAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJTaG93IE9uIE1hcFwiXG4gIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKHBvaSwgZSkge1xuICAgIHZhciBtYXAgPSBHZXRNYXAoKVxuICAgIG1hcC5wYW5UbyhbcG9pLmxhdCwgcG9pLmxuZ10pXG5cbiAgICAvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyBjbGljayBvbiBzaG93IG9uIG1hcFxuICAgIGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuICAgICAgZXZlbnRDYXRlZ29yeTogJ2dyYXBoJyxcbiAgICAgIGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuICAgICAgZXZlbnRMYWJlbDogJ3tcInNob3cgb24gbWFwXCI6e1wibGF0XCI6JyArIHBvaS5sYXQgKyAnLFwibG9uZ1wiOicrICBwb2kubG5nKyAnfX0nLFxuICAgICAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgfS5iaW5kKGJ1dHRvbiwgcG9pKVxuICByZXR1cm4gYnV0dG9uXG59XG5cbmZ1bmN0aW9uIGRyYXdHcmFwaChkYXRhLCBkaXYsIHBvaSkge1xuICBkYXRhID0gc3BsaXREYXRhKGRhdGEpO1xuICB2YXIgcmVwcm9jZXNzZWREYXRhID0gcmVwcm9jZXNzRGF0YShkYXRhKTtcbiAgLy9tYWtlVXBEb3duTGluZUdyYXBoKGRhdGEsIGRpdik7XG4gIC8vbWFrZVVwRG93bk92ZXJsYXBpbmdMaW5lR3JhcGhXaXRoQ2hlY2tib3hlcyhyZXByb2Nlc3NlZERhdGEsIGRpdiwgcG9pKTtcbiAgZHJhd1VwRG93blBvbGFyV2l0aENoZWNrYm94ZXNBbmRUaHJlc2hvbGRzKHJlcHJvY2Vzc2VkRGF0YSwgZGl2LCBwb2kpO1xuICBkaXYuY2xhc3NMaXN0LnJlbW92ZShcImdyYXBoLWxvYWRpbmdcIik7XG59XG5cbmZ1bmN0aW9uIHJvdW5kRmxvYXQobnVtYmVyLCBkZWNpbWFsUGxhY2VzKSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKG51bWJlciAqIE1hdGgucG93KDEwLCBkZWNpbWFsUGxhY2VzKSkgLyAoTWF0aC5wb3coMTAsIGRlY2ltYWxQbGFjZXMpKVxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8gVElNRVNFUklFUyBMSU5FIEdSQVBIIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIG1ha2VVcERvd25MaW5lR3JhcGggKGRhdGEsIGRpdikge1xuICAvLyBTZXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNhbnZhcyAvIGdyYXBoXG4gIHZhciBtYXJnaW4gPSB7dG9wOiAzMCwgcmlnaHQ6IDIwLCBib3R0b206IDMwLCBsZWZ0OiAyOX0sXG4gIHdpZHRoID0gNTgwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG4gIGhlaWdodCA9IDI3MCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuXG4gIC8vIFNldCB0aGUgcmFuZ2VzXG4gIHZhciB4ID0gZDMuc2NhbGVUaW1lKCkucmFuZ2UoWzAsIHdpZHRoXSlcbiAgICAuZG9tYWluKFtcbiAgICAgIHBhcnNlRGF0ZShkYXRhWzBdWzBdKSxcbiAgICAgIHBhcnNlRGF0ZShkYXRhW2RhdGEubGVuZ3RoLTFdWzBdKVxuICAgIF0pO1xuICB2YXIgeSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW2hlaWdodCwgMF0pXG4gICAgLmRvbWFpbihbMCwgMTAwXSk7XG5cbiAgLy8gRGVmaW5lIHRoZSBheGVzXG4gIHZhciB4QXhpcyA9IGQzLmF4aXNCb3R0b20oeClcbiAgICAudGlja3MoMTYpXG4gICAgLnRpY2tGb3JtYXQoZnVuY3Rpb24gKGQpIHtcbiAgICAgIHJldHVybiBkLmdldEZ1bGxZZWFyKCk7XG4gICAgfSk7XG5cbiAgdmFyIHlBeGlzID0gZDMuYXhpc0xlZnQoeSlcbiAgICAudGlja3MoNik7XG5cbiAgLy8gRGVmaW5lIHRoZSBsaW5lXG4gIHZhciB2YWx1ZWxpbmUgPSBkMy5saW5lKClcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4KHBhcnNlRGF0ZShkWzBdKSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geShkWzFdKTsgfSk7XG5cbiAgdmFyIHdyYXBwZXIgPSBkMy5zZWxlY3QoZGl2KVxuICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAuY2xhc3NlZChcInRpbWVzZXJpZXMtZ3JhcGhcIiwgdHJ1ZSk7XG5cbiAgLy8gQWRkcyB0aGUgc3ZnIGNhbnZhc1xuICB2YXIgc3ZnID0gd3JhcHBlci5hcHBlbmQoXCJzdmdcIilcbiAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcbiAgICAuYXR0cigndmlld0JveCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB3ID0gd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodFxuICAgICAgdmFyIGggPSBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbVxuICAgICAgcmV0dXJuICcwIDAgJyArIHcgKyAnICcgKyBoXG4gICAgfSlcbiAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpXG4gICAgLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG5cbiAgc3ZnLmNhbGwodGlwKTtcblxuICAvLyBBZGQgdGhlIHZhbHVlbGluZSBwYXRoLlxuICBkcmF3TGluZWFyUGF0aChkYXRhLCB2YWx1ZWxpbmUsIHN2Zyk7XG5cbiAgLy8gQWRkIHRoZSBYIEF4aXNcbiAgc3ZnLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwieCBheGlzXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIGhlaWdodCArIFwiKVwiKVxuICAgIC5jYWxsKHhBeGlzKTtcblxuICAvLyBBZGQgdGhlIFkgQXhpc1xuICBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ5IGF4aXNcIilcbiAgICAuY2FsbCh5QXhpcyk7XG4gIC8qKlxuICAgKiBUaGlzIGJsb2NrIG9mIGNvZGUgZHJhd3MgdGhlIHBvaW50IGF0IGVhY2ggZGF0YSBwb2ludFxuICAgKi9cbiAgZHJhd0xpbmVhclBvaW50cyhkYXRhLCB2YWx1ZWxpbmUsIHN2Zyk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vIE9WRVJMQVBQSU5HIFRJTUVTRVJJRVMgTElORSBHUkFQSCAvLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIG1ha2VVcERvd25PdmVybGFwaW5nTGluZUdyYXBoV2l0aENoZWNrYm94ZXMgKGRhdGEsIGRpdiwgcG9pKSB7XG4gIHZhciBjaGFydHMgPSB7fTtcblxuICAvLyBTZXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNhbnZhcyAvIGdyYXBoXG4gIHZhciBtYXJnaW4gPSB7dG9wOiAzMCwgcmlnaHQ6IDIwLCBib3R0b206IDMwLCBsZWZ0OiAyOX0sXG4gICAgd2lkdGggPSA1MDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcbiAgICBoZWlnaHQgPSAyNzAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblxuICB2YXIgYXZlcmFnZXMgPSBkYXRhLmJhc2VsaW5lO1xuXG4gIHZhciB4ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgd2lkdGhdKVxuICAgIC5kb21haW4oWzAsIDM2NV0pO1xuICB2YXIgeSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW2hlaWdodCwgMF0pXG4gICAgLmRvbWFpbihbMCwgMTAwXSk7XG5cbiAgLy8gRGVmaW5lIHRoZSBheGVzXG4gIGZ1bmN0aW9uIGZvcm1hdE1vbnRoVGljayAoZCkge1xuICAgIHJldHVybiAoTU9OVEhfTEFCRUxTWyhkLTE1KS8zMF0pO1xuICB9XG4gIHZhciB4QXhpcyA9IGQzLmF4aXNCb3R0b20oeClcbiAgICAudGlja3MoMTEpXG4gICAgLnRpY2tWYWx1ZXMoWzE1LCA0NSwgNzUsIDEwNSwgMTM1LCAxNjUsIDE5NSwgMjI1LCAyNTUsIDI4NSwgMzE1LCAzNDVdKVxuICAgIC50aWNrRm9ybWF0KGZvcm1hdE1vbnRoVGljayk7XG5cbiAgdmFyIHlBeGlzID0gZDMuYXhpc0xlZnQoeSlcbiAgICAudGlja3MoNik7XG5cbiAgLy8gRGVmaW5lIHRoZSBsaW5lXG4gIHZhciB2YWx1ZWxpbmUgPSBkMy5saW5lKClcbiAgICAueChmdW5jdGlvbihkLCBpKSB7IHJldHVybiAoQXJyYXkuaXNBcnJheShkKSA/IHgocGFyc2VKdWxpYW5EYXkoZFswXSkpIDogeCgoaSAqIDgpICsgMyApKTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiAoQXJyYXkuaXNBcnJheShkKSA/IHkoZFsxXSkgOiB5KGQpKTsgfSk7XG5cbiAgdmFyIHdyYXBwZXIgPSBkMy5zZWxlY3QoZGl2KS5hcHBlbmQoXCJkaXZcIikuY2xhc3NlZChcIm92ZXJsYXBwaW5nLWdyYXBoXCIsIHRydWUpO1xuXG4gIC8vIEFkZHMgdGhlIHN2ZyBjYW52YXNcbiAgdmFyIHN2ZyA9IHdyYXBwZXJcbiAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAuYXR0cigndmlld0JveCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHcgPSB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0XG4gICAgICAgIHZhciBoID0gaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b21cbiAgICAgICAgcmV0dXJuICcwIDAgJyArIHcgKyAnICcgKyBoXG4gICAgICB9KVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKVxuICAgICAgLy8uYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG4gICAgICAvLy5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKVxuICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLFxuICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG5cbiAgc3ZnLmNhbGwodGlwKTtcblxuICAvLyBBZGQgdGhlIFggQXhpc1xuICBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgaGVpZ2h0ICsgXCIpXCIpXG4gICAgLmNhbGwoeEF4aXMpO1xuXG4gIC8vIEFkZCB0aGUgWSBBeGlzXG4gIHN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcInkgYXhpc1wiKVxuICAgIC5jYWxsKHlBeGlzKTtcblxuICB2YXIgcGxvdCwgaSwgbDtcbiAgZm9yIChpID0gMCwgbCA9IHBvaS5wbG90cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBwbG90ID0gcG9pLnBsb3RzW2ldO1xuICAgIGlmIChwbG90ID09PSBcInRocmVzaG9sZHNcIikgY29udGludWU7XG4gICAgY2hhcnRzW3Bsb3RdID0ge1xuICAgICAgXCJwYXRoXCIgOiBkcmF3TGluZWFyUGF0aChkYXRhW3Bsb3RdLCB2YWx1ZWxpbmUsIHN2ZylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBibG9jayBvZiBjb2RlIGRyYXdzIHRoZSBwb2ludCBhdCBlYWNoIGRhdGEgcG9pbnRcbiAgICovXG4gIGZvciAoaSA9IDAsIGwgPSBwb2kucGxvdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgcGxvdCA9IHBvaS5wbG90c1tpXTtcbiAgICBpZiAocGxvdCA9PT0gXCJ0aHJlc2hvbGRzXCIpIGNvbnRpbnVlO1xuICAgIGNoYXJ0c1twbG90XS5wb2ludHMgPSBkcmF3TGluZWFyUG9pbnRzKGRhdGFbcGxvdF0sIHZhbHVlbGluZSwgc3ZnKTtcbiAgfVxuXG4gIHZhciBpbnB1dHdyYXBwZXIgPSB3cmFwcGVyLmFwcGVuZChcImRpdlwiKS5jbGFzc2VkKFwiaW5wdXQtd3JhcHBlclwiLCB0cnVlKTtcblxuICBkYXRhLmtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgY3JlYXRlQ2hlY2tib3goaW5wdXR3cmFwcGVyLCBrZXksIFwib3ZlcmxhcHBpbmdcIiwgcG9pLCBjaGFydHMsIGRhdGEsIHZhbHVlbGluZSwgc3ZnLCBhdmVyYWdlcyk7XG4gIH0pO1xuXG4gIGNyZWF0ZUNoZWNrYm94KGlucHV0d3JhcHBlciwgXCJiYXNlbGluZVwiLCBcIm92ZXJsYXBwaW5nXCIsIHBvaSwgY2hhcnRzLCBkYXRhLCB2YWx1ZWxpbmUsIHN2ZywgYXZlcmFnZXMpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFBPTEFSIEdSQVBIIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGRyYXdVcERvd25Qb2xhcldpdGhDaGVja2JveGVzQW5kVGhyZXNob2xkcyAoZGF0YSwgZGl2LCBwb2kpIHtcbiAgdmFyIHdpZHRoID0gNDkwLFxuICAgIGhlaWdodCA9IDQ5MCxcbiAgICByYWRpdXMgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDIgLSAzMDtcblxuICAvL3ZhciBhdmVyYWdlcyA9IGRhdGFbXCJiYXNlbGluZVwiXTtcbiAgLy92YXIgY2VudGVyID0gZmluZFBvbGFyQ2VudGVyKGRhdGEpO1xuICAvL3ZhciB0aHJlc2hvbGRzID0gZmluZFBvbGFyVGhyZXNob2xkcyhhdmVyYWdlcywgY2VudGVyWzFdWzBdKTtcblxuICAvKipcbiAgICogU2V0cyB1cCBzY2FsaW5nIG9mIGRhdGEuIFdlIGtub3cgdGhhdCB0aGUgbmR2aSB2YWx1ZXMgZmFsbCBiZXR3ZWVuXG4gICAqIDAgJiAxMDAgc28gd2Ugc2V0IG91ciBkb21haW4gdG8gdGhhdC4gVGhlIHJhbmdlIGNvbnRyb2xzIHdoZXJlIHRoZVxuICAgKiBwb2ludHMgd2lsbCBsaWUgaW4gb3VyIGdyYXBoLCBzbyB3ZSBzZXQgdGhlbSB0byBiZSBiZXR3ZWVuIDAgYW5kIHRoZVxuICAgKiByYWRpdXMuXG4gICAqL1xuICB2YXIgciA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFswLCA3MF0pXG4gICAgLnJhbmdlKFswLCByYWRpdXNdKTtcblxuICB2YXIgbGluZSA9IGQzLnJhZGlhbExpbmUoKVxuICAgIC5yYWRpdXMoZnVuY3Rpb24oZCkgeyByZXR1cm4gcihkWzFdKSB9IClcbiAgICAuYW5nbGUoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgbGV0IHZhbCA9IGRbMF0uaW5kZXhPZihcIlNwcmluZ1wiKSA+IC0xID9cbiAgICAgICAgMFxuICAgICAgOiBkWzBdLmluZGV4T2YoXCJTdW1tZXJcIikgPiAtMSA/XG4gICAgICAgIDFcbiAgICAgIDogZFswXS5pbmRleE9mKFwiQXV0dW1uXCIpID4gLTEgP1xuICAgICAgICAyXG4gICAgICA6IDNcbiAgICAgIHJldHVybiB2YWwgKiAoTWF0aC5QSSAvIDIpXG4gICAgfSk7XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGNhbnZhcyB3aGVyZSB0aGUgY2lyY2xlIHdpbGwgYmUgZHJhd24uXG4gICAqL1xuICB2YXIgd3JhcHBlciA9IGQzLnNlbGVjdChkaXYpLmFwcGVuZChcImRpdlwiKS5jbGFzc2VkKFwicG9sYXItZ3JhcGhcIiwgdHJ1ZSk7XG4gIHZhciBzdmcgPSB3cmFwcGVyLmFwcGVuZChcInN2Z1wiKVxuICAgIC8vLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAvLy5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAuYXR0cigndmlld0JveCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnMCAwICcrIHdpZHRoICsgJyAnICsgaGVpZ2h0XG4gICAgfSlcbiAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpXG4gICAgLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHdpZHRoIC8gMiArIFwiLFwiICsgaGVpZ2h0IC8gMiArIFwiKVwiKTtcblxuICBzdmcuY2FsbCh0aXApO1xuXG4gIC8qKlxuICAgKiBUaGlzIGJsb2NrIG9mIGNvZGUgZHJhd3MgdGhlIGJpZyBjaXJjbGVzIG9mIHRoZSBncmFwaCAmIHRoZWlyIGxhYmVsc1xuICAgKi9cbiAgdmFyIGdyID0gc3ZnLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwiciBheGlzXCIpXG4gICAgLnNlbGVjdEFsbChcImdcIilcbiAgICAuZGF0YShyLnRpY2tzKDUpLnNsaWNlKDEpKVxuICAgIC5lbnRlcigpLmFwcGVuZChcImdcIik7XG5cbiAgZ3IuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJyXCIsIHIpO1xuXG4gIGdyLmFwcGVuZChcInRleHRcIilcbiAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gLXIoZCkgLSA0OyB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwicm90YXRlKDE1KVwiKVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSk7XG5cblxuICAvKipcbiAgKiBUaGlzIGJsb2NrIG9mIGNvZGUgZHJhd3MgdGhlIGxhYmVscyBmb3IgZWFjaCBzZWFzb24gYW5kIHRoZSBsaW5lc1xuICAqIHRoYXQgZ28gb3V0IHRvIHRoZW0uXG4gICovXG5cbiAgdmFyIGdhX2EgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJhIGF4aXNcIilcbiAgICAuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5kYXRhKGQzLnJhbmdlKDAsIDM2MCwgOTApKVxuICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwicm90YXRlKFwiICsgKGQgLSA5MCkgKyBcIilcIjsgfSk7XG5cbiAgZ2FfYS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgLmF0dHIoXCJ4MlwiLCByYWRpdXMpO1xuXG4gIGNvbnN0IFNFQVNPTl9MQUJFTFMgPSBbXG4gICAgXCJTcHJpbmdcIixcbiAgICBcIlN1bW1lclwiLFxuICAgIFwiQXV0dW1uXCIsXG4gICAgXCJXaW50ZXJcIlxuICBdXG5cbiAgZ2FfYS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoXCJ4XCIsIHJhZGl1cyArIDYpXG4gICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgZCA9PiBcIm1pZGRsZVwiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkKSA9PiB7XG4gICAgICBsZXQgYW5nbGUgPSBkID09PSAxODAgPyBcIjI3MFwiIDogXCI5MFwiXG4gICAgICByZXR1cm4gXCJyb3RhdGUoXCIgKyBhbmdsZSArIFwiIFwiICsgKHJhZGl1cyArIDYpICsgXCIsMClcIjtcbiAgICB9KVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFNFQVNPTl9MQUJFTFNbZC85MF07IH0pO1xuXG5cbiAgLyoqXG4gICAqIFRoaXMgYmxvY2sgb2YgY29kZSBkcmF3cyB0aGUgbGFiZWxzIGZvciBlYWNoIG1vbnRoIGFuZCB0aGUgbGluZXNcbiAgICogdGhhdCBnbyBvdXQgdG8gdGhlbS5cbiAgICovXG5cbiAgLypcbiAgdmFyIGdhX2EgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJhIGF4aXNcIilcbiAgICAuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5kYXRhKGQzLnJhbmdlKDAsIDM2MCwgMzApKVxuICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwicm90YXRlKFwiICsgKGQgLSA5MCkgKyBcIilcIjsgfSk7XG5cbiAgZ2FfYS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgLmF0dHIoXCJ4MlwiLCByYWRpdXMpO1xuXG4gIGdhX2EuYXBwZW5kKFwidGV4dFwiKVxuICAgIC5hdHRyKFwieFwiLCByYWRpdXMgKyA2KVxuICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQgPCAzNjAgJiYgZCA+IDE4MCA/IFwiZW5kXCIgOiBudWxsOyB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQgPCAzNjAgJiYgZCA+IDE4MCA/IFwicm90YXRlKDE4MCBcIiArIChyYWRpdXMgKyA2KSArIFwiLDApXCIgOiBudWxsOyB9KVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIE1PTlRIX0xBQkVMU1tkLzMwXTsgfSk7XG4gIFxuICAqL1xuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgdGhyZXNob2xkIGxpbmVzXG4gICAqL1xuICBcbiAgLypcbiAgdmFyIHRocmVzaG9sZEVsZW0gPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmRhdGEodGhyZXNob2xkcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInJvdGF0ZShcIiArIChkLmRhdGFbMV1bMF0gLSA5MCkgKyBcIilcIjsgfSk7XG5cbiAgdGhyZXNob2xkRWxlbS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcbiAgICAuYXR0cihcIngyXCIsIHJhZGl1cyk7XG5cbiAgdGhyZXNob2xkRWxlbS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7IHZhciBkYXkgPSBkLmRhdGFbMV1bMF07IHJldHVybiBkYXkgPCAzNjAgJiYgZGF5ID4gMTgwID8gcmFkaXVzICsgMzAgOiByYWRpdXMgLSAzMH0pXG4gICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiAoKCgoZC5kYXRhWzFdWzBdKSUzNjUpLzM2NSkgKiAoMipNYXRoLlBJKSkgKyA2OyB9KVxuICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uKGQpIHsgdmFyIGRheSA9IGQuZGF0YVsxXVswXTsgcmV0dXJuIGRheSA8IDM2MCAmJiBkYXkgPiAxODAgPyBcIm1pZGRsZVwiIDogbnVsbDsgfSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHZhciBkYXkgPSBkLmRhdGFbMV1bMF07IHJldHVybiBkYXkgPCAzNjAgJiYgZGF5ID4gMTgwID8gXCJyb3RhdGUoMTgwIFwiICsgKHJhZGl1cyArIDYpICsgXCIsMClcIiA6IG51bGw7IH0pXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5sYWJlbDsgfSk7XG5cbiAgdGhyZXNob2xkRWxlbS5zdHlsZShcIm9wYWNpdHlcIiwgKHBvaS5wbG90cy5pbmRleE9mKFwidGhyZXNob2xkc1wiKSAhPT0gLTEpID8gMSA6IDApO1xuICAqL1xuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgbGluZSB0byB0aGUgY2VudGVyIG9mIHRoZSBkYXRhXG4gICAqL1xuICBcbiAgLypcbiAgdmFyIGNlbnRlckRheSA9IGNlbnRlclsxXVswXTtcbiAgdmFyIGNlbnRlckRheU9wcG9zaXRlID0gKGNlbnRlckRheSArICgzNjUvMikpICUgMzY1O1xuICB2YXIgY2VudGVyRGF5RGF0YSA9IFtjZW50ZXJEYXksIDEwMF07XG4gIHZhciBjZW50ZXJEYXlPcHBvc2l0ZURhdGEgPSBbY2VudGVyRGF5T3Bwb3NpdGUsIDEwMF07XG4gIHZhciBncm93aW5nU2Vhc29uRGF0YSA9IFtjZW50ZXJEYXlEYXRhLCBjZW50ZXJEYXlPcHBvc2l0ZURhdGFdXG5cbiAgZHJhd1BvbGFyUGF0aChncm93aW5nU2Vhc29uRGF0YSwgbGluZSwgc3ZnKVxuICAgIC5jbGFzc2VkKFwiZ3Jvd2luZy1zZWFzb24tbGluZVwiLCBcInRydWVcIik7XG5cbiAgZHJhd1BvbGFyUGF0aChjZW50ZXIsIGxpbmUsIHN2ZylcbiAgICAuY2xhc3NlZChcImNlbnRlci1saW5lXCIsIFwidHJ1ZVwiKTtcblxuICBzdmcuc2VsZWN0QWxsKFwicG9pbnRcIilcbiAgICAuZGF0YShbY2VudGVyWzFdXSlcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwiY2VudGVyXCIpXG4gICAgLmF0dHIoXCJyXCIsIDQpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGNvb3JzID0gbGluZShbZF0pLnNsaWNlKDEpLnNsaWNlKDAsIC0xKTtcbiAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGNvb3JzICsgXCIpXCJcbiAgICB9KVxuICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiIzAwMFwiKVxuICAgIC5hdHRyKFwiZmlsbFwiLCBcIiNlYTBjNDhcIilcbiAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgdGlwLnNob3coXCJDZW50ZXI6IFwiICArIFN0cmluZyhkWzFdKS5zdWJzdHJpbmcoMCwgNykpO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJyXCIsIDUpXG4gICAgfSlcbiAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgdGlwLmhpZGUoKTtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiclwiLCA0KVxuICAgIH0pO1xuICAqL1xuXG4gIHZhciBjaGFydHMgPSB7fTtcblxuICB2YXIgZ2V0U2Vhc29uV2VpZ2h0ID0gc3RyID0+IHtcbiAgICByZXR1cm4gc3RyLmluZGV4T2YoXCJTcHJpbmdcIikgPiAtMSA/XG4gICAgICAwXG4gICAgOiBzdHIuaW5kZXhPZihcIlN1bW1lclwiKSA+IC0xID9cbiAgICAgIDFcbiAgICA6IHN0ci5pbmRleE9mKFwiQXV0dW1uXCIpID4gLTEgP1xuICAgICAgMlxuICAgIDogM1xuICB9XG5cbiAgdmFyIHNvcnRGdW5jID0gKGEsIGIpID0+IHtcbiAgICBsZXQgYVdlaWdodCA9IGdldFNlYXNvbldlaWdodChhWzBdKVxuICAgIGxldCBiV2VpZ2h0ID0gZ2V0U2Vhc29uV2VpZ2h0KGJbMF0pXG4gICAgcmV0dXJuIGFXZWlnaHQgLSBiV2VpZ2h0XG4gIH1cblxuICB2YXIgYnVpbGRQbG90RGF0YSA9IChkYXRhLCBwbG90Q29uZGl0aW9ucykgPT4ge1xuICAgIHZhciBwbG90RGF0YSA9IGRhdGEuZmlsdGVyKCBhcnIgPT4ge1xuICAgICAgdmFyIHRvS2VlcCA9IHRydWVcbiAgICAgIHBsb3RDb25kaXRpb25zLmZvckVhY2goY29uZCA9PiB7XG4gICAgICAgIGlmIChhcnJbMF0uaW5kZXhPZihjb25kKSA9PT0gLTEpIHtcbiAgICAgICAgICB0b0tlZXAgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIHRvS2VlcFxuICAgIH0pLnNvcnQoc29ydEZ1bmMpXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBkYXRhcG9pbnQgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBzb1xuICAgIC8vIHRoZSBwb2xhciBwbG90IGxpbmUgXCJjb21wbGV0ZXMgdGhlIGNpcmN1aXRcIlxuICAgIHBsb3REYXRhLnB1c2gocGxvdERhdGFbMF0pXG4gICAgcmV0dXJuIHBsb3REYXRhXG4gIH1cblxuICBkYXRhLnBsb3RzID0ge1xuICAgIFwiTDEwX0RheVwiICAgOiBidWlsZFBsb3REYXRhKGRhdGEsIFtcIkwxMFwiLCBcIkRheVwiXSksXG4gICAgXCJMNTBfRGF5XCIgICA6IGJ1aWxkUGxvdERhdGEoZGF0YSwgW1wiTDUwXCIsIFwiRGF5XCJdKSxcbiAgICBcIkw5MF9EYXlcIiAgIDogYnVpbGRQbG90RGF0YShkYXRhLCBbXCJMOTBcIiwgXCJEYXlcIl0pLFxuICAgIFwiTDEwX05pZ2h0XCIgOiBidWlsZFBsb3REYXRhKGRhdGEsIFtcIkwxMFwiLCBcIk5pZ2h0XCJdKSxcbiAgICBcIkw1MF9OaWdodFwiIDogYnVpbGRQbG90RGF0YShkYXRhLCBbXCJMNTBcIiwgXCJOaWdodFwiXSksXG4gICAgXCJMOTBfTmlnaHRcIiA6IGJ1aWxkUGxvdERhdGEoZGF0YSwgW1wiTDkwXCIsIFwiTmlnaHRcIl0pXG4gIH1cblxuICAvKipcbiAgICogVGhpcyBibG9jayBvZiBjb2RlIGRyYXdzIHRoZSBsaW5lIHRoYXQgdGhlIGRhdGEgZm9sbG93c1xuICAgKi9cbiAgdmFyIHBsb3QsIGksIGw7XG4gIGZvciAoaSA9IDAsIGwgPSBwb2kucGxvdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgcGxvdCA9IHBvaS5wbG90c1tpXTtcbiAgICBjaGFydHNbcGxvdF0gPSB7XG4gICAgICBcInBhdGhcIiA6IGRyYXdQb2xhclBhdGgoZGF0YS5wbG90c1twbG90XSwgbGluZSwgc3ZnLCBwbG90KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGJsb2NrIG9mIGNvZGUgZHJhd3MgdGhlIHBvaW50IGF0IGVhY2ggZGF0YSBwb2ludFxuICAgKi9cbiAgZm9yIChpID0gMCwgbCA9IHBvaS5wbG90cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBwbG90ID0gcG9pLnBsb3RzW2ldO1xuICAgIGNoYXJ0c1twbG90XS5wb2ludHMgPSBkcmF3TGluZWFyUG9pbnRzKGRhdGEucGxvdHNbcGxvdF0sIGxpbmUsIHN2Zyk7XG4gIH1cblxuICB2YXIgaW5wdXR3cmFwcGVyID0gd3JhcHBlci5hcHBlbmQoXCJkaXZcIikuY2xhc3NlZChcImlucHV0LXdyYXBwZXJcIiwgdHJ1ZSk7XG4gICAgXG4gIE9iamVjdC5rZXlzKGRhdGEucGxvdHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGNyZWF0ZUNoZWNrYm94KGlucHV0d3JhcHBlciwga2V5LCBcInBvbGFyXCIsIHBvaSwgY2hhcnRzLCBkYXRhLCBsaW5lLCBzdmcpO1xuICB9KTtcblxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBHUkFQSCBIRUxQRVJTIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGRyYXdMaW5lYXJQYXRoKGRhdGEsIGxpbmUsIHN2Zykge1xuICByZXR1cm4gc3ZnLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxuICAgIC5hdHRyKFwiZFwiLCBsaW5lKGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gZHJhd1BvbGFyUGF0aChkYXRhLCBsaW5lLCBzdmcsIHBsb3ROYW1lKSB7XG4gIHJldHVybiBzdmcuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShkYXRhKVxuICAgIC8vLmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcbiAgICAuYXR0cihcImRcIiwgbGluZSlcbiAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgXCIxcHhcIilcbiAgICAuYXR0cihcInN0cm9rZVwiLCBkID0+IHtcbiAgICAgIHJldHVybiBwdWxsRGlzdGluY3RDb2xvcihkWzBdWzBdKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGRyYXdMaW5lYXJQb2ludHMoZGF0YSwgbGluZSwgc3ZnKSB7XG4gIHJldHVybiBzdmcuc2VsZWN0QWxsKFwicG9pbnRcIilcbiAgICAuZGF0YShkYXRhKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKFwiclwiLCAzKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwb2ludFwiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciBwb2ludCA9IEFycmF5LmlzQXJyYXkoZCkgPyBkIDogWyhpKjgpICsgMywgZF07XG4gICAgICB2YXIgY29vcnMgPSBsaW5lKFtwb2ludF0pLnNsaWNlKDEpLnNsaWNlKDAsIC0xKTtcbiAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGNvb3JzICsgXCIpXCJcbiAgICB9KVxuICAgIC8vLmF0dHIoXCJyXCIsIDMpXG4gICAgLmF0dHIoXCJzdHJva2VcIiwgXCIjMDAwXCIpXG4gICAgLmF0dHIoXCJmaWxsXCIsZnVuY3Rpb24oZCxpKXtcbiAgICAgIHJldHVybiBwdWxsRGlzdGluY3RDb2xvcihkWzBdKVxuICAgIH0pXG4gICAgLm9uKFwibW91c2VvdmVyXCIsIGhhbmRsZVBvaW50TW91c2VvdmVyKVxuICAgIC5vbihcIm1vdXNlb3V0XCIsIGhhbmRsZVBvaW50TW91c2VvdXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQb2ludE1vdXNlb3ZlcihkKSB7XG4gIHZhciB0aXBTdHJpbmcgPSBgJHtkWzBdfTogJHtkWzFdfWA7XG4gIHRpcC5zaG93KHRpcFN0cmluZyk7XG4gIHRoaXMuc2V0QXR0cmlidXRlKFwiclwiLCBcIjRcIik7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBvaW50TW91c2VvdXQoZCkge1xuICB0aXAuaGlkZSgpO1xuICB0aGlzLnNldEF0dHJpYnV0ZShcInJcIiwgXCIzXCIpO1xuXG4gIHZhciBhY3RpdmVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyYXBoLXR5cGUtYnRuIGFjdGl2ZVwiKVswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpO1xuXG4gIC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIHRvb2wgdGlwIG9uIGdyYXBoIGRvIHRoaXMgb24gdGhlIG1vdXNlb3V0IHNvIG1vdXNlb3ZlciBkb3NlIG5vdCBkbyBhIGxvdCBvZiBldmVudHMuLi4uXG4gIC8vIHdlIG1pc3MgYSBmZXcgYnV0IHRoYXQgaXMgYmV0dGVyIHRoYW4gb3ZlciBjb3VudGluZy5cbiAgZ2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG4gICAgZXZlbnRDYXRlZ29yeTogJ2dyYXBoJyxcbiAgICBldmVudEFjdGlvbjogJ2hvdmVyJyxcbiAgICBldmVudExhYmVsOiBhY3RpdmVUeXBlICsgJyB0b29sIHRpcCcsXG4gICAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDaGVja2JveCh3cmFwcGVyLCBrZXksIHR5cGUsIHBvaSwgY2hhcnRzLCBkYXRhLCBsaW5lLCBzdmcpIHtcbiAgdmFyIGNoZWNrYm94V3JhcHBlciA9IHdyYXBwZXIuYXBwZW5kKFwiZGl2XCIpO1xuICB2YXIgbGF0ID0gcG9pLmxhdDtcbiAgdmFyIGxuZyA9IHBvaS5sbmc7XG5cbiAgY2hlY2tib3hXcmFwcGVyLmFwcGVuZChcImlucHV0XCIpXG4gICAgLmF0dHIoXCJ0eXBlXCIsIFwiY2hlY2tib3hcIilcbiAgICAuYXR0cihcImlkXCIsIHR5cGUgKyBcIi1cIiArIGtleSArIGxhdC50b1N0cmluZygpLnJlcGxhY2UoXCIuXCIsIFwiXCIpICsgXCItXCIgKyBsbmcudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSlcbiAgICAuYXR0cihcImRhdGEtbGlua1wiLCBrZXkgKyBsYXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSArIFwiLVwiICsgbG5nLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIikpXG4gICAgLmF0dHIoXCJ2YWx1ZVwiLCBrZXkpXG4gICAgLnByb3BlcnR5KFwiY2hlY2tlZFwiLCAocG9pLnBsb3RzLmluZGV4T2Yoa2V5KSAhPT0gLTEpID8gdHJ1ZSA6IGZhbHNlKVxuICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHBsb3ROYW1lID0gdGhpcy52YWx1ZTtcbiAgICAgIGlmICghdGhpcy5jaGVja2VkKSB7XG4gICAgICAgIGhhbmRsZUNoZWNrYm94RGlzYWJsZShjaGFydHMsIHBsb3ROYW1lKTtcbiAgICAgICAgcmVtb3ZlS2V5RnJvbVBPSShwb2ksIGtleSk7XG4gICAgICAgIC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGdyYXBoIHllYXIgY2xpY2sgb2ZmXG4gICAgICAgIGRpc3BhdGNoR3JhcGhDaGVja2JveENsaWNrKHBsb3ROYW1lICsgJyAnICsgdHlwZSArICcgb2ZmJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYW5kbGVDaGVja2JveEVuYWJsZShjaGFydHMsIHBsb3ROYW1lLCBkYXRhLCBsaW5lLCBzdmcpO1xuICAgICAgICBhZGRLZXlUb1BPSShwb2ksIGtleSk7XG4gICAgICAgIC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGdyYXBoIHllYXIgY2xpY2sgb25cbiAgICAgICAgZGlzcGF0Y2hHcmFwaENoZWNrYm94Q2xpY2socGxvdE5hbWUgKyAnICcgKyB0eXBlICsgJyAgb24nKTtcbiAgICAgIH1cbiAgICAgIGhhbmRsZUNoZWNrYm94U3luYyhrZXkgKyBsYXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSArIFwiLVwiICsgbG5nLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIiksIHRoaXMuY2hlY2tlZCk7XG4gICAgICB1cGRhdGVTaGFyZVVybCgpO1xuICAgIH0pO1xuXG4gIGNoZWNrYm94V3JhcHBlci5hcHBlbmQoXCJsYWJlbFwiKVxuICAgIC50ZXh0KGtleSlcbiAgICAuYXR0cihcImZvclwiLCB0eXBlICsgXCItXCIgKyBrZXkgKyBsYXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSArIFwiLVwiICsgbG5nLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIikpO1xuXG4gIGNoZWNrYm94V3JhcHBlci5hcHBlbmQoXCJkaXZcIilcbiAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIHB1bGxEaXN0aW5jdENvbG9yKGtleSkpXG4gICAgLmNsYXNzZWQoXCJncmFwaC1waXAtZXhhbXBsZVwiLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2hlY2tib3hEaXNhYmxlIChjaGFydHMsIHBsb3ROYW1lKSB7XG4gIGNoYXJ0c1twbG90TmFtZV0ucGF0aC5yZW1vdmUoKTtcbiAgY2hhcnRzW3Bsb3ROYW1lXS5wb2ludHMucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNoZWNrYm94RW5hYmxlIChjaGFydHMsIHBsb3ROYW1lLCBkYXRhLCBsaW5lLCBzdmcpIHtcbiAgaWYgKCFjaGFydHMuaGFzT3duUHJvcGVydHkocGxvdE5hbWUpKSB7XG4gICAgY2hhcnRzW3Bsb3ROYW1lXSA9IHt9O1xuICB9XG4gIGNoYXJ0c1twbG90TmFtZV0ucGF0aCA9IGRyYXdQb2xhclBhdGgoZGF0YS5wbG90c1twbG90TmFtZV0sIGxpbmUsIHN2ZywgcGxvdE5hbWUpO1xuICBjaGFydHNbcGxvdE5hbWVdLnBvaW50cyA9IGRyYXdMaW5lYXJQb2ludHMoZGF0YS5wbG90c1twbG90TmFtZV0sIGxpbmUsIHN2Zyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNoZWNrYm94U3luYyAoa2V5LCBjaGVja2VkU3RhdHVzLCB3cmFwcGVyKSB7XG4gIGQzLnNlbGVjdEFsbChcImlucHV0W2RhdGEtbGluaz0nXCIgKyBrZXkgKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKHAsIGopIHtcbiAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICBpZiAoZWxlbS5wcm9wZXJ0eShcImNoZWNrZWRcIikgIT09IGNoZWNrZWRTdGF0dXMpIHtcbiAgICAgIGVsZW0ucHJvcGVydHkoXCJjaGVja2VkXCIsIGNoZWNrZWRTdGF0dXMpO1xuICAgICAgZWxlbS5kaXNwYXRjaChcImNoYW5nZVwiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVLZXlGcm9tUE9JIChwb2ksIGtleSkge1xuICB2YXIgaW5kZXggPSBwb2kucGxvdHMuaW5kZXhPZihrZXkpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm47XG4gIHBvaS5wbG90cy5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG5mdW5jdGlvbiBhZGRLZXlUb1BPSSAocG9pLCBrZXkpIHtcbiAgaWYgKHBvaS5wbG90cy5pbmRleE9mKGtleSkgIT09IC0xKSByZXR1cm47XG4gIHBvaS5wbG90cy5wdXNoKGtleSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoR3JhcGhDaGVja2JveENsaWNrIChsYWJlbCkge1xuICBnYSgnc2VuZCcsICdldmVudCcsIHtcbiAgICBldmVudENhdGVnb3J5OiAnZ3JhcGgnLFxuICAgIGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuICAgIGV2ZW50TGFiZWw6ICBsYWJlbCxcbiAgICBub25JbnRlcmFjdGlvbjogZmFsc2VcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHB1bGxEaXN0aW5jdENvbG9yIChwbG90TmFtZSkge1xuICB2YXIgdGltZU9mRGF5ID0gcGxvdE5hbWUuaW5kZXhPZihcIkRheVwiKSA+IC0xID8gXCJkYXlcIiA6IFwibmlnaHRcIlxuICB2YXIgcGxvdExldmVsID0gcGxvdE5hbWUuaW5kZXhPZihcIkwxMFwiKSA+IC0xID9cbiAgICBcIkwxMFwiXG4gIDogcGxvdE5hbWUuaW5kZXhPZihcIkw1MFwiKSA+IC0xID9cbiAgICBcIkw1MFwiXG4gIDogXCJMOTBcIlxuICB2YXIgY29sb3JSYW1wID0ge1xuICAgIFwiZGF5XCIgOiB7XG4gICAgICBcIkwxMFwiIDogXCIjZjQ5MTQxXCIsXG4gICAgICBcIkw1MFwiIDogXCIjZjRjMTQxXCIsXG4gICAgICBcIkw5MFwiIDogXCIjZDRmNDQyXCJcbiAgICB9LFxuICAgIFwibmlnaHRcIiA6IHtcbiAgICAgIFwiTDEwXCI6IFwiIzBiMTAyNlwiLFxuICAgICAgXCJMNTBcIjogXCIjMjgzZmEzXCIsXG4gICAgICBcIkw5MFwiOiBcIiMzZDVhZGJcIlxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb2xvclJhbXBbdGltZU9mRGF5XVtwbG90TGV2ZWxdO1xufVxuXG4vKiBQT0xBUiBHUkFQSCBIRUxQRVJTICovXG5cbmZ1bmN0aW9uIGZpbmRQb2xhckNlbnRlciAoZGF0YSkge1xuICB2YXIgaSwgaiwgbGVuZ3RoLCBhcnI7XG4gIHZhciB0b3RhbFN1bSA9IDA7XG4gIHZhciBpbmNvbXBsZXRlWWVhcnMgPSAwO1xuICB2YXIgc3VtO1xuICBsZW5ndGggPSA0NjtcblxuICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5rZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgYXJyID0gZGF0YVtkYXRhLmtleXNbaV1dO1xuICAgIGlmIChhcnIubGVuZ3RoICE9PSBsZW5ndGgpIHtcbiAgICAgIGluY29tcGxldGVZZWFycysrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHN1bSA9IDA7XG4gICAgZm9yIChqID0gMDsgaiA8IGxlbmd0aC8yOyBqKyspIHtcbiAgICAgIHN1bSArPSAoYXJyW2pdWzFdIC0gYXJyW2orMjNdWzFdKTtcbiAgICB9XG4gICAgc3VtID0gc3VtIC8gMjM7XG4gICAgdG90YWxTdW0gKz0gc3VtO1xuICB9XG4gIHRvdGFsU3VtID0gTWF0aC5hYnModG90YWxTdW0pIC8gKGRhdGEua2V5cy5sZW5ndGggLSBpbmNvbXBsZXRlWWVhcnMpO1xuXG4gIHZhciBhcmVhRGlmZiA9IDEwMDAwMDA7XG4gIHZhciBjaGVja0RpZmY7XG4gIHZhciBhcmVhSW5kZXggPSAwO1xuICB2YXIgbGVmdEFyZWEsIHJpZ2h0QXJlYTtcbiAgdmFyIGF2Z3MgPSBkYXRhLmJhc2VsaW5lO1xuICB2YXIgaywgY291bnRlcjtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoLzI7IGkrKykge1xuICAgIGxlZnRBcmVhID0gMDtcbiAgICByaWdodEFyZWEgPSAwO1xuICAgIGZvciAoY291bnRlciA9IDA7IGNvdW50ZXIgPCBsZW5ndGgvMjsgY291bnRlcisrKSB7XG4gICAgICBqID0gKGkgKyBjb3VudGVyKSAlIDQ2O1xuICAgICAgayA9IChqICsgMjMpICUgNDY7XG5cbiAgICAgIGxlZnRBcmVhICs9IHBhcnNlSW50KGF2Z3Nbal0sIDEwKTtcbiAgICAgIHJpZ2h0QXJlYSArPSBwYXJzZUludChhdmdzW2tdLDEwKTtcbiAgICB9XG4gICAgY2hlY2tEaWZmID0gTWF0aC5hYnMobGVmdEFyZWEgLSByaWdodEFyZWEpO1xuICAgIGlmIChjaGVja0RpZmYgPCBhcmVhRGlmZikge1xuICAgICAgYXJlYURpZmYgPSBjaGVja0RpZmY7XG4gICAgICBhcmVhSW5kZXggPSBpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBmaXJzdFJhZGl1cyA9IHBhcnNlSW50KGF2Z3NbYXJlYUluZGV4XSwgMTApO1xuICB2YXIgc2Vjb25kUmFkaXVzID0gcGFyc2VJbnQoLWF2Z3NbYXJlYUluZGV4ICsgMjNdLCAxMCk7XG5cbiAgdmFyIG1pZHBvaW50ID0gKGZpcnN0UmFkaXVzICsgc2Vjb25kUmFkaXVzKSAvIDI7XG4gIHZhciBmaXJzdERpZmYgPSBNYXRoLmFicyh0b3RhbFN1bSAtIG1pZHBvaW50KTtcbiAgdmFyIHNlY29uZERpZmYgPSBNYXRoLmFicygtdG90YWxTdW0gLSBtaWRwb2ludCk7XG4gIGlmIChzZWNvbmREaWZmIDwgZmlyc3REaWZmKSB7XG4gICAgYXJlYUluZGV4ID0gYXJlYUluZGV4ICsgMjM7XG4gIH1cblxuICB2YXIgY2lyY2xlY2VudGVyID0gWzAsIDBdO1xuICB2YXIgZGF0YWNlbnRlciA9IFsoYXJlYUluZGV4ICogOCkgKyAzLCB0b3RhbFN1bV07XG5cbiAgcmV0dXJuKFtjaXJjbGVjZW50ZXIsIGRhdGFjZW50ZXJdKTtcbn1cblxuLyoqXG4gKiBzdGFydERheSBpcyBhY3R1YWxseSB0aGUgc2Vhc29uYWxpdHkgaW5kZXgsIGl0IHNob3VsZCBiZSBmbGlwcGVkXG4gKi9cbmZ1bmN0aW9uIGZpbmRQb2xhclRocmVzaG9sZHMgKGRhdGEsIHN0YXJ0RGF5KSB7XG4gIHZhciBzdGFydEluZGV4ID0gTWF0aC5mbG9vcigoc3RhcnREYXkgLSAzKSAvIDgpO1xuICBzdGFydEluZGV4ICs9IChzdGFydEluZGV4ID4gMjIpID8gKC0yMykgOiAyMztcbiAgdmFyIGksIGosIGxlbmd0aCwgYXJyO1xuICB2YXIgdG90YWxTdW0gPSAwO1xuICB2YXIgc3VtO1xuICBsZW5ndGggPSA0NjtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBqID0gKHN0YXJ0SW5kZXggKyBpKSAlIGxlbmd0aDtcbiAgICB0b3RhbFN1bSArPSBwYXJzZUludChkYXRhW2pdLCAxMCk7XG4gIH1cblxuICB2YXIgZmlmdGVlblRocmVzaG9sZCA9IHRvdGFsU3VtICogLjE1O1xuICB2YXIgZWlnaHR5VGhyZXNob2xkID0gdG90YWxTdW0gKiAuODA7XG4gIHZhciBmaWZ0ZWVuSW5kZXhGb3VuZCA9IGZhbHNlLFxuICAgIGVpZ2h0eUluZGV4Rm91bmQgPSBmYWxzZTtcbiAgdmFyIGZpZnRlZW5JbmRleCwgZWlnaHR5SW5kZXg7XG5cbiAgdG90YWxTdW0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBqID0gKHN0YXJ0SW5kZXggKyBpKSAlIGxlbmd0aDtcbiAgICB0b3RhbFN1bSArPSBwYXJzZUludChkYXRhW2pdLCAxMCk7XG4gICAgaWYgKCFmaWZ0ZWVuSW5kZXhGb3VuZCAmJiB0b3RhbFN1bSA+IGZpZnRlZW5UaHJlc2hvbGQpIHtcbiAgICAgIGZpZnRlZW5JbmRleCA9IGo7XG4gICAgICBmaWZ0ZWVuSW5kZXhGb3VuZCA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKCFlaWdodHlJbmRleEZvdW5kICYmIHRvdGFsU3VtID4gZWlnaHR5VGhyZXNob2xkKSB7XG4gICAgICBlaWdodHlJbmRleCA9IGo7XG4gICAgICBlaWdodHlJbmRleEZvdW5kID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjaXJjbGVDZW50ZXIgPSBbMCwgMF07XG5cbiAgdmFyIGZpZnRlZW5FbmQgPSBbKGZpZnRlZW5JbmRleCAqIDgpICsgMywgMTAwXTtcbiAgdmFyIGVpZ2h0eUVuZCA9IFsoZWlnaHR5SW5kZXggKiA4KSArIDMsIDEwMF07XG5cbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBcImxhYmVsXCIgOiBcIjE1JVwiLFxuICAgICAgXCJkYXRhXCIgOiBbY2lyY2xlQ2VudGVyLCBmaWZ0ZWVuRW5kXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJsYWJlbFwiIDogXCI4MCVcIixcbiAgICAgIFwiZGF0YVwiIDogW2NpcmNsZUNlbnRlciwgZWlnaHR5RW5kXVxuICAgIH1cbiAgXTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIERBVEUgSEVMUEVSUyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gcGFyc2VEYXRlIChkYXRlKSB7XG4gIGRhdGUgPSBkYXRlLnRvU3RyaW5nKCk7XG4gIHZhciB5ZWFyID0gZGF0ZS5zdWJzdHJpbmcoMCwgNCk7XG4gIHZhciBtb250aCA9IHBhcnNlSW50KGRhdGUuc3Vic3RyaW5nKDQsIDYpLCAxMCkgLSAxO1xuICB2YXIgZGF5ID0gZGF0ZS5zdWJzdHJpbmcoNiwgOCk7XG5cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXkpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUp1bGlhbkRheSAoZGF0ZSkge1xuICBpZiAodHlwZW9mKGRhdGUpID09PSBcInN0cmluZ1wiKSB7XG4gICAgZGF0ZSA9IHBhcnNlRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gZGF0ZS5nZXRET1koKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRlIChkYXRlKSB7XG4gIGlmIChkYXRlID09PSBcIkF2ZXJhZ2VcIikgeyByZXR1cm4gZGF0ZTsgfVxuXG4gIGRhdGUgPSBwYXJzZURhdGUoZGF0ZSk7XG4gIHJldHVybiBmb3JtYXRNb250aChkYXRlLmdldE1vbnRoKCkpICsgXCIgXCIgKyBvcmRpbmFsX3N1ZmZpeF9vZihkYXRlLmdldERhdGUoKSkgKyBcIiwgXCIgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1vbnRoIChtb250aCkge1xuICByZXR1cm4gRk9STUFUVEVEX01PTlRIX0xBQkVMU1ttb250aF07XG59XG5cbmZ1bmN0aW9uIG9yZGluYWxfc3VmZml4X29mKGRheSkge1xuICB2YXIgaiA9IGRheSAlIDEwLFxuICAgIGsgPSBkYXkgJSAxMDA7XG4gIGlmIChqID09PSAxICYmIGsgIT09IDExKSB7XG4gICAgcmV0dXJuIGRheSArIFwic3RcIjtcbiAgfVxuICBpZiAoaiA9PT0gMiAmJiBrICE9PSAxMikge1xuICAgIHJldHVybiBkYXkgKyBcIm5kXCI7XG4gIH1cbiAgaWYgKGogPT09IDMgJiYgayAhPT0gMTMpIHtcbiAgICByZXR1cm4gZGF5ICsgXCJyZFwiO1xuICB9XG4gIHJldHVybiBkYXkgKyBcInRoXCI7XG59XG5cbnZhciBNT05USF9MQUJFTFMgPSB7XG4gIDA6IFwiSmFuXCIsXG4gIDE6IFwiRmViXCIsXG4gIDI6IFwiTWFyXCIsXG4gIDM6IFwiQXByXCIsXG4gIDQ6IFwiTWF5XCIsXG4gIDU6IFwiSnVuXCIsXG4gIDY6IFwiSnVsXCIsXG4gIDc6IFwiQXVnXCIsXG4gIDg6IFwiU2VwXCIsXG4gIDk6IFwiT2N0XCIsXG4gIDEwOiBcIk5vdlwiLFxuICAxMTogXCJEZWNcIlxufTtcblxudmFyIEZPUk1BVFRFRF9NT05USF9MQUJFTFMgPSB7XG4gIDA6IFwiSmFuLlwiLFxuICAxOiBcIkZlYi5cIixcbiAgMjogXCJNYXIuXCIsXG4gIDM6IFwiQXByLlwiLFxuICA0OiBcIk1heVwiLFxuICA1OiBcIkp1bi5cIixcbiAgNjogXCJKdWwuXCIsXG4gIDc6IFwiQXVnLlwiLFxuICA4OiBcIlNlcC5cIixcbiAgOTogXCJPY3QuXCIsXG4gIDEwOiBcIk5vdi5cIixcbiAgMTE6IFwiRGVjLlwiXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZ3JhcGguanMiLCJpbXBvcnQge0dldE1hcH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHtCQVNFX0xBWUVSX1RZUEV9IGZyb20gJy4vYmFzZWxheWVyJztcbmltcG9ydCB7R2V0Q3VycmVudExheWVyc30gZnJvbSAnLi9sYXllcic7XG5pbXBvcnQge0dldEFsbFBvaW50c09mSW50ZXJlc3QsIGNyZWF0ZVBPSX0gZnJvbSAnLi9wb2knO1xuaW1wb3J0IHtHZXRBY3RpdmVMYXllckdyb3Vwc30gZnJvbSAnLi9wYW5lbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCaW5kVXBkYXRlU2hhcmVVcmwgKG1hcCkge1xuXHRtYXAub24oXCJtb3ZlZW5kXCIsIHVwZGF0ZVNoYXJlVXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVNoYXJlVXJsIChlKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHR2YXIgcGFyYW1zID0gW1xuXHRcdG1ha2VDZW50ZXJTdHJpbmcobWFwKSxcblx0XHRtYWtlWm9vbVN0cmluZyhtYXApLFxuXHRcdG1ha2VMYXllclN0cmluZyhtYXApLFxuXHRcdG1ha2VMYXllckdyb3Vwc1N0cmluZygpLFxuXHRcdG1ha2VCYXNlTGF5ZXJTdHJpbmcobWFwKSxcblx0XHRtYWtlUG9pbnRzT2ZJbnRlcmVzdFN0cmluZygpLFxuXHRcdG1ha2VBY3RpdmVUYWJTdHJpbmcoKSxcblx0XHRtYWtlQWN0aXZlR3JhcGhUYWJTdHJpbmcoKVxuXHRdO1xuXG5cdHNldFNoYXJlVXJsKG1ha2VTaGFyZVVybChwYXJhbXMpKTtcblx0c2V0Q29weUxpbmtVcmwoKTtcblx0c2V0U29jaWFsVXJscygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkU2hhcmVTZXR0aW5nc1RvQ29uZmlnIChjb25maWcpIHtcblx0dmFyIHNoYXJlID0gcGFyc2VTaGFyZVVybCgpO1xuXHRpZiAoIXNoYXJlKSByZXR1cm47XG5cdGlmIChzaGFyZS5jZW50ZXIpIGNvbmZpZy5tYXAuY2VudGVyID0gc2hhcmUuY2VudGVyO1xuXHRpZiAoc2hhcmUuem9vbSkgY29uZmlnLm1hcC56b29tID0gc2hhcmUuem9vbTtcblx0aWYgKHNoYXJlLmxheWVycykgYWRkTGF5ZXJTZXR0aW5nc1RvQ29uZmlnKHNoYXJlLmxheWVycywgY29uZmlnKTtcblx0aWYgKHNoYXJlLmJhc2VsYXllcnMpIGFkZEJhc2VMYXllclNldHRpbmdzVG9Db25maWcoc2hhcmUuYmFzZWxheWVycywgY29uZmlnKTtcblx0aWYgKHNoYXJlLnBvaXMpIGFkZFBvaW50c09mSW50ZXJlc3RUb0NvbmZpZyhzaGFyZS5wb2lzLCBjb25maWcpXG5cdGlmIChzaGFyZS50YWIpIGNvbmZpZy50YWIgPSBzaGFyZS50YWI7XG5cdGlmIChzaGFyZS5ncmFwaCkgY29uZmlnLmdyYXBoID0gc2hhcmUuZ3JhcGg7XG5cdGlmIChzaGFyZS5sYXllckdyb3VwcykgY29uZmlnLmxheWVyR3JvdXBzID0gYWRkTGF5ZXJHcm91cFNldHRpbmdzVG9Db25maWcoc2hhcmUubGF5ZXJHcm91cHMsIGNvbmZpZylcbn1cblxuZnVuY3Rpb24gbWFrZVNoYXJlVXJsIChwYXJhbXMpIHtcblx0cmV0dXJuIFwiP1wiICsgcGFyYW1zLmZpbHRlcihmdW5jdGlvbiAocCkgeyByZXR1cm4gcCAhPT0gdW5kZWZpbmVkIH0pLmpvaW4oXCImXCIpO1xufVxuXG5mdW5jdGlvbiBzZXRTaGFyZVVybCAodXJsKSB7XG5cdGlmICh3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcblx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIFwiXCIsIHVybCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Q29weUxpbmtVcmwgKCkge1xuXHR2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hhcmV1cmwtbGluay11cmxcIikuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmRDb3B5TGlua0V2ZW50cyAoKSB7XG5cdGQzLnNlbGVjdChkb2N1bWVudCkub24oXCJjbGlja1wiLCBoYW5kbGVCb2R5Q2xpY2spO1xuXHRkMy5zZWxlY3QoXCIuc2hhcmV1cmwtbGluayBhXCIpLm9uKFwiY2xpY2tcIiwgaGFuZGxlU2hhcmVMaW5rQnV0dG9uQ2xpY2spO1xuXHRkMy5zZWxlY3QoXCIuc2hhcmV1cmwtbGluay11cmxcIikub24oXCJjbGlja1wiLCBoYW5kbGVTaGFyZUxpbmtVcmxDbGljayk7XG5cdGQzLnNlbGVjdChcIi5zaGFyZXVybC1saW5rLXBvcHVwLXJlbW92ZXJcIikub24oXCJjbGlja1wiLCBoYW5kbGVTaGFyZUxpbmtDbG9zZUJ1dHRvbkNsaWNrKTtcbn1cblxuLyoqXG4gKiBTaG91bGQgY2xvc2UgdGhlIGNvcHkgbGluayBwb3B1cCBpZiBpdCBpcyBhY3RpdmUgYW5kIGlmIHlvdSBjbGljayBvbiBhbnkgZWxlbWVudFxuICogdGhhdCBpcyBub3QgdGhlIHBvcHVwIG9yIGl0cyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gaGFuZGxlQm9keUNsaWNrICgpIHtcblx0dmFyIGV2ZW50ID0gZDMuZXZlbnQ7XG5cdHZhciBub2RlUGF0aCA9IFtdXG5cdG5vZGVQYXRoID0gZ2V0RG9tUGF0aChldmVudC50YXJnZXQpXG5cblx0dmFyIHRvQ2xvc2VQb3B1cCA9IHRydWU7XG5cdHZhciBpLCBsO1xuXG5cdGZvciAoaSA9IDAsIGwgPSBub2RlUGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKG5vZGVQYXRoW2ldLmNsYXNzTGlzdC5jb250YWlucygnc2hhcmV1cmwtbGluay1wb3B1cCcpIHx8XG5cdFx0XHRcdFx0bm9kZVBhdGhbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzaGFyZXVybC1saW5rJykpIHtcblx0XHRcdFx0dG9DbG9zZVBvcHVwID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fSAgICAgICAgICAgIFxuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Ly8gY2xpY2tpbmcgc3ZnIHRocm93cyBhbiBlcnJvciBpbiBJRVxuXHRcdH1cblx0fVxuXG5cdGlmICh0b0Nsb3NlUG9wdXApIHtcblx0XHR2YXIgc2hhcmVQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NoYXJldXJsLWxpbmstcG9wdXAnKS5pdGVtKDApXG5cdFx0aGFuZGxlQ29weUxpbmtDbG9zZShzaGFyZVBvcHVwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXREb21QYXRoKG5vZGUpIHtcblx0dmFyIHBhdGggPSBbXVxuXHR3aGlsZSAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpIHtcblx0XHRwYXRoLnB1c2gobm9kZSlcblx0XHRub2RlID0gbm9kZS5wYXJlbnROb2RlXG5cdH1cblx0cmV0dXJuIHBhdGhcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2hhcmVMaW5rQnV0dG9uQ2xpY2sgKCkge1xuXHR2YXIgc2hhcmVQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXVybC1saW5rLXBvcHVwXCIpLml0ZW0oMClcblx0aWYgKGQzLnNlbGVjdChzaGFyZVBvcHVwKS5jbGFzc2VkKFwiYWN0aXZlXCIpKSB7XG5cdFx0aGFuZGxlQ29weUxpbmtDbG9zZShzaGFyZVBvcHVwKVxuXHR9IGVsc2Uge1xuXHRcdGhhbmRsZUNvcHlMaW5rT3BlbihzaGFyZVBvcHVwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVTaGFyZUxpbmtDbG9zZUJ1dHRvbkNsaWNrICgpIHtcblx0dmFyIHNoYXJlUG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2hhcmV1cmwtbGluay1wb3B1cFwiKS5pdGVtKDApXG5cdGhhbmRsZUNvcHlMaW5rQ2xvc2Uoc2hhcmVQb3B1cCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNoYXJlTGlua1VybENsaWNrICgpIHtcblx0c2VsZWN0Q29weUxpbmtVcmwoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ29weUxpbmtPcGVuIChzaGFyZVBvcHVwKSB7XG5cdHNoYXJlUG9wdXAuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKVxuXHRzZWxlY3RDb3B5TGlua1VybCgpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGV2ZW50IGNsaWNrIG9uIHNoYXJlIHVybFxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0ICBldmVudENhdGVnb3J5OiAnc2hhcmV1cmwnLFxuXHQgIGV2ZW50QWN0aW9uOiAnb3BlbicsXG5cdCAgZXZlbnRMYWJlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGFyZXVybC1saW5rLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSxcblx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG5cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ29weUxpbmtDbG9zZSAoc2hhcmVQb3B1cCkge1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGV2ZW50IGNsaWNrIG9uIHNoYXJlIHVybCBjbG9zZVxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0ICBldmVudENhdGVnb3J5OiAnc2hhcmV1cmwnLFxuXHQgIGV2ZW50QWN0aW9uOiAnY2xvc2UnLFxuXHQgIGV2ZW50TGFiZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hhcmV1cmwtbGluay11cmxcIikuZ2V0QXR0cmlidXRlKFwidmFsdWVcIiksXG5cdCAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xuXG5cdHNoYXJlUG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxufVxuXG5mdW5jdGlvbiBzZWxlY3RDb3B5TGlua1VybCAoKSB7XG5cdHZhciBzaGFyZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGFyZXVybC1saW5rLXVybFwiKTtcblx0c2hhcmVJbnB1dC5mb2N1cygpO1xuXHRzaGFyZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKDAsIHNoYXJlSW5wdXQudmFsdWUubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gc2V0U29jaWFsVXJscyAoKSB7XG5cdHZhciB1cmwgPSBtYW5nbGVQYXJhbVN0cmluZyh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdHZhciBzb2NpYWxMaW5rcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXVybC1zb2NpYWxcIik7XG5cdHZhciBzb2NpYWxMaW5rO1xuXHR2YXIgbmV3VXJsO1xuXHR2YXIgaSwgbDtcblxuXHRmb3IgKGkgPSAwLCBsID0gc29jaWFsTGlua3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0c29jaWFsTGluayA9IHNvY2lhbExpbmtzW2ldO1xuXG5cdFx0bmV3VXJsID0gc29jaWFsTGluay5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJhc2V1cmxcIikgKyB1cmw7XG5cdFx0c29jaWFsTGluay5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIG5ld1VybCk7XG5cblx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyBldmVudCBmb3Igc29jaWFsIHVybHNcblx0XHRzb2NpYWxMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblx0XHQgIGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0ZXZlbnRDYXRlZ29yeTogJ3NoYXJldXJsJyxcblx0XHRcdGV2ZW50QWN0aW9uOiB0aGlzLmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiksXG5cdFx0XHRldmVudExhYmVsOiB0aGlzLmhyZWYsXG5cdFx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHQgIH0pO1xuXG5cdFx0fSk7XG5cblx0fVxufVxuXG5mdW5jdGlvbiBtYWtlQ2VudGVyU3RyaW5nIChtYXApIHtcblx0dmFyIGNlbnRlciA9IG1hcC5nZXRDZW50ZXIoKTtcblx0cmV0dXJuIFwiY2VudGVyPVwiICsgY2VudGVyLmxhdC50b1N0cmluZygpICsgXCIsXCIgKyBjZW50ZXIubG5nLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIG1ha2Vab29tU3RyaW5nIChtYXApIHtcblx0cmV0dXJuIFwiem9vbT1cIiArIG1hcC5nZXRab29tKCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VMYXllclN0cmluZyAobWFwKSB7XG5cdHZhciBsYXllcnMgPSBbXTtcblx0dmFyIG9wYWNpdHlWYWxzID0ge307XG5cdHZhciBjdXJyZW50TGF5ZXJzID0gR2V0Q3VycmVudExheWVycygpO1xuXG5cdG1hcC5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBsYXllci5vcHRpb25zO1xuXHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMubGF5ZXJzKSB7XG5cdFx0XHRvcGFjaXR5VmFsc1tvcHRpb25zLmxheWVyc10gPSBvcHRpb25zLmhhc093blByb3BlcnR5KFwib3BhY2l0eVwiKSA/IG9wdGlvbnMub3BhY2l0eSA6IFwiMVwiO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIGN1cnJlbnRMYXllcjtcblx0dmFyIGk7XG5cdGZvciAoaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y3VycmVudExheWVyID0gY3VycmVudExheWVyc1tpXTtcblx0XHRsYXllcnMucHVzaChjdXJyZW50TGF5ZXIpO1xuXHRcdGxheWVycy5wdXNoKG9wYWNpdHlWYWxzW2N1cnJlbnRMYXllcl0pO1xuXHR9XG5cdHJldHVybiBcImxheWVycz1cIiArIGxheWVycy5qb2luKFwiLFwiKTtcbn1cblxuZnVuY3Rpb24gbWFrZUJhc2VMYXllclN0cmluZyAobWFwKSB7XG5cdHZhciBsYXllcnMgPSBbXTtcblx0bWFwLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcblx0XHRpZiAobGF5ZXIub3B0aW9ucyAmJiBsYXllci5vcHRpb25zLnR5cGUgPT09IEJBU0VfTEFZRVJfVFlQRSkge1xuXHRcdFx0bGF5ZXJzLnB1c2gobGF5ZXIub3B0aW9ucy5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIFwiYmFzZWxheWVycz1cIiArIGxheWVycy5qb2luKFwiLFwiKTtcbn1cblxuZnVuY3Rpb24gbWFrZUxheWVyR3JvdXBzU3RyaW5nICgpIHtcblx0dmFyIGFjdGl2ZUxheWVyR3JvdXBzID0gR2V0QWN0aXZlTGF5ZXJHcm91cHMoKVxuXHRyZXR1cm4gXCJsYXllckdyb3Vwcz1cIithY3RpdmVMYXllckdyb3Vwcy5tYXAoZCA9PiBkLmlkKS5qb2luKCcsJylcbn1cblxuZnVuY3Rpb24gbWFrZVBvaW50c09mSW50ZXJlc3RTdHJpbmcgKCkge1xuXHR2YXIgcG9pcyA9IEdldEFsbFBvaW50c09mSW50ZXJlc3QoKVxuXHRpZiAoIXBvaXMubGVuZ3RoKSByZXR1cm47XG5cdHZhciBwb2lTdHJpbmcgPSBcInBvaXM9XCI7XG5cdHBvaXMuZm9yRWFjaChwb2kgPT4ge1xuXHRcdHBvaVN0cmluZyArPSBwb2kubGF0ICsgJywnICsgcG9pLmxuZztcblx0XHRpZiAocG9pLnBsb3RzICYmIHBvaS5wbG90cy5sZW5ndGgpIHtcblx0XHRcdHBvaVN0cmluZyArPSAnLCcgKyBwb2kucGxvdHMuam9pbignLCcpO1xuXHRcdH1cblx0XHRwb2lTdHJpbmcgKz0gJzsnO1xuXHR9KVxuXHRyZXR1cm4gcG9pU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBtYWtlQWN0aXZlVGFiU3RyaW5nICgpIHtcblx0cmV0dXJuIFwidGFiPVwiICsgZDMuc2VsZWN0KFwiLnBhbmVsLXRvcC1idG4uYWN0aXZlXCIpLmF0dHIoXCJkYXRhLWFjdGl2ZVwiKTtcbn1cblxuZnVuY3Rpb24gbWFrZUFjdGl2ZUdyYXBoVGFiU3RyaW5nICgpIHtcblx0cmV0dXJuIFwiZ3JhcGg9XCIgKyBkMy5zZWxlY3QoXCIuZ3JhcGgtdHlwZS1idG4uYWN0aXZlXCIpLmF0dHIoXCJkYXRhLXR5cGVcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2hhcmVVcmwgKCkge1xuXHR2YXIgcGFyYW1zID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcblx0aWYgKHBhcmFtcyA9PT0gXCJcIikgcmV0dXJuO1xuXG5cdHBhcmFtcyA9IGdldFBhcmFtc0FycmF5KHBhcmFtcyk7XG5cdHBhcmFtcyA9IG1ha2VLZXllZFBhcmFtc09iamVjdChwYXJhbXMpO1xuXG5cdGZvcm1hdFBhcmFtcyhwYXJhbXMpO1xuXHRyZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJhbXNBcnJheSAocGFyYW1zKSB7XG5cdHBhcmFtcyA9IHBhcmFtcy5zdWJzdHJpbmcoMSk7XG5cdHBhcmFtcyA9IHVubWFuZ2xlUGFyYW1TdHJpbmcocGFyYW1zKTtcblx0cmV0dXJuIHBhcmFtcy5zcGxpdChcIiZcIik7XG59XG5cbmZ1bmN0aW9uIG1hbmdsZVBhcmFtU3RyaW5nICh1cmwpIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKC9cXDovZywgXCIlM0FcIilcblx0XHQucmVwbGFjZSgvXFw7L2csIFwiJTNCXCIpXG5cdFx0LnJlcGxhY2UoL1xcLy9nLCBcIiUyRlwiKVxuXHRcdC5yZXBsYWNlKC9cXCwvZywgXCIlMkNcIilcblx0XHQucmVwbGFjZSgvXFwmL2csIFwiJTI2XCIpO1xufVxuXG5mdW5jdGlvbiB1bm1hbmdsZVBhcmFtU3RyaW5nIChwYXJhbXMpIHtcblx0cmV0dXJuIHBhcmFtcy5yZXBsYWNlKC9cXCUyW2N8Q10vZywgXCIsXCIpLnJlcGxhY2UoL1xcJTNbYnxCXS9nLCBcIjtcIilcbn1cblxuZnVuY3Rpb24gbWFrZUtleWVkUGFyYW1zT2JqZWN0IChwYXJhbXNBcnIpIHtcblx0dmFyIHBhcnNlZFBhcmFtcyA9IHt9O1xuXHR2YXIgcGFyYW1QYWlyO1xuXHR2YXIgaTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgcGFyYW1zQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0cGFyYW1QYWlyID0gcGFyYW1zQXJyW2ldLnNwbGl0KFwiPVwiKTtcblx0XHRwYXJzZWRQYXJhbXNbcGFyYW1QYWlyWzBdXSA9IHBhcmFtUGFpclsxXVxuXHR9XG5cblx0cmV0dXJuIHBhcnNlZFBhcmFtcztcbn1cblxuZnVuY3Rpb24gZm9ybWF0UGFyYW1zIChwYXJhbXMpIHtcblx0aWYgKHBhcmFtcy5jZW50ZXIpIHBhcmFtcy5jZW50ZXIgPSBmb3JtYXRDZW50ZXJQYXJhbShwYXJhbXMuY2VudGVyKTtcblx0aWYgKHBhcmFtcy5sYXllcnMpIHBhcmFtcy5sYXllcnMgPSBmb3JtYXRMYXllclBhcmFtKHBhcmFtcy5sYXllcnMpO1xuXHRpZiAocGFyYW1zLmJhc2VsYXllcnMpIHBhcmFtcy5iYXNlbGF5ZXJzID0gZm9ybWF0QmFzZUxheWVyUGFyYW0ocGFyYW1zLmJhc2VsYXllcnMpO1xuXHRpZiAocGFyYW1zLnBvaXMpIHBhcmFtcy5wb2lzID0gZm9ybWF0UG9pbnRzT2ZJbnRlcmVzdFBhcmFtKHBhcmFtcy5wb2lzKVxuXHRpZiAocGFyYW1zLmxheWVyR3JvdXBzKSBwYXJhbXMubGF5ZXJHcm91cHMgPSBmb3JtYXRMYXllckdyb3Vwc1BhcmFtKHBhcmFtcy5sYXllckdyb3Vwcylcbn1cblxuZnVuY3Rpb24gZm9ybWF0Q2VudGVyUGFyYW0gKGNlbnRlcikge1xuXHRyZXR1cm4gY2VudGVyLnNwbGl0KFwiLFwiKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGF5ZXJQYXJhbSAobGF5ZXJzKSB7XG5cdHZhciBmb3JtYXR0ZWRMYXllcnMgPSB7XG5cdFx0XCJlbmFibGVkTGF5ZXJzXCI6IFtdLFxuXHRcdFwib3BhY2l0eVZhbHNcIjoge31cblx0fTtcblx0dmFyIGxheWVySWQ7XG5cdHZhciBpO1xuXG5cdGxheWVycyA9IGxheWVycy5zcGxpdChcIixcIik7XG5cdGZvciAoaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpID0gaSArIDIpIHtcblx0XHRsYXllcklkID0gbGF5ZXJzW2ldO1xuXHRcdGZvcm1hdHRlZExheWVycy5lbmFibGVkTGF5ZXJzLnB1c2gobGF5ZXJJZCk7XG5cdFx0Zm9ybWF0dGVkTGF5ZXJzLm9wYWNpdHlWYWxzW2xheWVySWRdID0gbGF5ZXJzW2krMV07XG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0dGVkTGF5ZXJzO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRCYXNlTGF5ZXJQYXJhbSAoYmFzZWxheWVycykge1xuXHRyZXR1cm4gYmFzZWxheWVycy5zcGxpdChcIixcIik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBvaW50c09mSW50ZXJlc3RQYXJhbSAocG9pcykge1xuXHRyZXR1cm4gcG9pcy5zcGxpdCgnOycpXG5cdFx0LmZpbHRlcigoc3RyKSA9PiBzdHIgIT09ICcnKVxuXHRcdC5tYXAoKHBvaSkgPT4ge1xuXHRcdFx0cG9pID0gcG9pLnNwbGl0KCcsJyk7XG5cdFx0XHRpZiAocG9pLmxlbmd0aCA+IDIpIHtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVBPSShwb2lbMF0sIHBvaVsxXSwgcG9pLnNwbGljZSgyKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY3JlYXRlUE9JKHBvaVswXSwgcG9pWzFdLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGF5ZXJHcm91cHNQYXJhbSAobGF5ZXJHcm91cFNldHRpbmdzKSB7XG5cdHJldHVybiBsYXllckdyb3VwU2V0dGluZ3Muc3BsaXQoJywnKVxufVxuXG5mdW5jdGlvbiBhZGRMYXllckdyb3VwU2V0dGluZ3NUb0NvbmZpZyhhY3RpdmVMYXllckdyb3VwSWRzLCBjb25maWcpIHtcblx0Y29uZmlnLmxheW91dFsnbGF5ZXItZ3JvdXBzLW9yZGVyJ10uZm9yRWFjaChsYXllckdyb3VwID0+IHtcblx0XHQvLyBzZXQgbGF5ZXIgZ3JvdXAgdG8gYWN0aXZlIGlmIGl0cyBpZCBhcHBlYXJzIGluIHRoZSBzaGFyZSB1cmwgc2V0dGluZ3Ncblx0XHRsYXllckdyb3VwLmFjdGl2ZSA9IGFjdGl2ZUxheWVyR3JvdXBJZHMuZmlsdGVyKGlkID0+IHtcblx0XHRcdHJldHVybiBpZCA9PT0gbGF5ZXJHcm91cC5pZFxuXHRcdH0pLmxlbmd0aCA+IDBcblx0fSlcbn1cblxuZnVuY3Rpb24gYWRkTGF5ZXJTZXR0aW5nc1RvQ29uZmlnIChzaGFyZUxheWVyU2V0dGluZ3MsIGNvbmZpZykge1xuXHR2YXIgZW5hYmxlZExheWVycyA9IHNoYXJlTGF5ZXJTZXR0aW5ncy5lbmFibGVkTGF5ZXJzO1xuXHRjb25maWdbXCJhY3RpdmUtbGF5ZXJzXCJdID0gZW5hYmxlZExheWVycztcblxuXHR2YXIgaSwgaiwgcHJvcCwgbGF5ZXJncm91cDtcblx0dmFyIGVuYWJsZWRMYXllcjtcblx0dmFyIGZvdW5kTGF5ZXI7XG5cdHZhciBsYXllcnMgPSBjb25maWcubGF5ZXJzO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBlbmFibGVkTGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Zm91bmRMYXllciA9IGZhbHNlO1xuXHRcdGVuYWJsZWRMYXllciA9IGVuYWJsZWRMYXllcnNbaV07XG5cdFx0Zm9yIChwcm9wIGluIGxheWVycykge1xuXHRcdFx0aWYgKCFsYXllcnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHJldHVybjtcblx0XHRcdGxheWVyZ3JvdXAgPSBsYXllcnNbcHJvcF07XG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgbGF5ZXJncm91cC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRpZiAobGF5ZXJncm91cFtqXS5pZCA9PT0gZW5hYmxlZExheWVyKSB7XG5cdFx0XHRcdFx0bGF5ZXJncm91cFtqXS5vcGFjaXR5ID0gc2hhcmVMYXllclNldHRpbmdzLm9wYWNpdHlWYWxzW2VuYWJsZWRMYXllcl07XG5cdFx0XHRcdFx0Zm91bmRMYXllciA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChmb3VuZExheWVyKSBicmVhaztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkQmFzZUxheWVyU2V0dGluZ3NUb0NvbmZpZyAoc2hhcmVCYXNlTGF5ZXJTZXR0aW5ncywgY29uZmlnKSB7XG5cdHZhciBiYXNlbGF5ZXJzID0gY29uZmlnLmJhc2VsYXllcnM7XG5cdHZhciBiYXNlbGF5ZXI7XG5cdHZhciBpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBiYXNlbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YmFzZWxheWVyID0gYmFzZWxheWVyc1tpXTtcblx0XHRiYXNlbGF5ZXIuYWN0aXZlID0gKHNoYXJlQmFzZUxheWVyU2V0dGluZ3MuaW5kZXhPZihiYXNlbGF5ZXIuaWQpICE9PSAtMSkgPyB0cnVlIDogZmFsc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkUG9pbnRzT2ZJbnRlcmVzdFRvQ29uZmlnKHBvaXMsIGNvbmZpZykge1xuXHRjb25maWdbXCJwb2lzXCJdID0gcG9pc1xufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9zaGFyZS5qcyIsImltcG9ydCB7R2V0TWFwfSBmcm9tIFwiLi9tYXBcIjtcbmltcG9ydCB7dXBkYXRlU2hhcmVVcmx9IGZyb20gXCIuL3NoYXJlXCI7XG5cbmV4cG9ydCBjb25zdCBCQVNFX0xBWUVSX1RZUEUgPSBcImJhc2VsYXllclwiO1xuXG52YXIgX2Jhc2VsYXllcnM7XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVCYXNlTGF5ZXJzIChtYXAsIGxheWVyQ29uZmlnKSB7XG5cdGxheWVyQ29uZmlnID0gbGF5ZXJDb25maWcgfHxcblx0XHRbe1xuXHRcdFx0XCJpZFwiIDogXCJjYXJ0by1saWdodC1kZWZhdWx0XCIsXG5cdFx0XHRcInVybFwiIDogXCJodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9hbGwve3p9L3t4fS97eX0ucG5nXCIsXG5cdFx0XHRcImF0dHJpYnV0aW9uXCIgOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL2NhcnRvLmNvbS9hdHRyaWJ1dGlvbnNcIj5DQVJUTzwvYT4nXG5cdFx0fV07XG5cblx0X2Jhc2VsYXllcnMgPSBsYXllckNvbmZpZztcblx0dmFyIGk7XG5cdHZhciBiYXNlTGF5ZXI7XG5cdHZhciBjb25maWc7XG5cblx0Zm9yIChpID0gMDsgaSA8IGxheWVyQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uZmlnID0gbGF5ZXJDb25maWdbaV07XG5cblx0XHRpZiAoIWNvbmZpZy5hY3RpdmUpIGNvbnRpbnVlO1xuXHRcdGJhc2VMYXllciA9IGNyZWF0ZUJhc2VMYXllcihjb25maWcpO1xuXHRcdGNvbmZpZy5sYXllciA9IGJhc2VMYXllcjtcblx0XHRiYXNlTGF5ZXIuYWRkVG8obWFwKTtcblx0fVxuXG5cdGNyZWF0ZUJhc2VMYXllclVJKGxheWVyQ29uZmlnKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVCYXNlTGF5ZXJVSSAoY29uZmlnKSB7XG5cdHZhciBiYXNlVUkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRiYXNlVUkuY2xhc3NOYW1lID0gXCJiYXNlbGF5ZXItdWlcIjtcblx0dmFyIGJhc2VXcmFwcGVyO1xuXHR2YXIgYmFzZUltZztcblx0dmFyIGJhc2VMYWJlbDtcblxuXHR2YXIgbGF5ZXI7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gY29uZmlnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGxheWVyID0gY29uZmlnW2ldO1xuXHRcdGlmICghbGF5ZXIuaGFzT3duUHJvcGVydHkoXCJpbWFnZVwiKSkgY29udGludWU7XG5cblx0XHRiYXNlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0YmFzZVdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZGF0YS1sYXllclwiLCBsYXllci5pZCk7XG5cdFx0YmFzZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdFx0YmFzZUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgbGF5ZXIuaW1hZ2UpO1xuXHRcdGJhc2VJbWcuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGxheWVyLmxhYmVsKTtcblx0XHRiYXNlSW1nLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxheWVyLmxhYmVsKTtcblx0XHRiYXNlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGJhc2VMYWJlbC50ZXh0Q29udGVudCA9IGxheWVyLmxhYmVsO1xuXHRcdGJhc2VXcmFwcGVyLmFwcGVuZENoaWxkKGJhc2VJbWcpO1xuXHRcdGJhc2VXcmFwcGVyLmFwcGVuZENoaWxkKGJhc2VMYWJlbCk7XG5cdFx0YmFzZVdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUJhc2VDbGljaylcblxuXHRcdGQzLnNlbGVjdChiYXNlV3JhcHBlcilcblx0XHRcdC5jbGFzc2VkKFwiYmFzZS1zZWxlY3RvclwiLCB0cnVlKVxuXHRcdFx0LmNsYXNzZWQoXCJhY3RpdmVcIiwgbGF5ZXIuYWN0aXZlKTtcblxuXHRcdGJhc2VVSS5hcHBlbmRDaGlsZChiYXNlV3JhcHBlcik7XG5cdH1cblxuXHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGVhZmxldC1ib3R0b20gbGVhZmxldC1sZWZ0XCIpWzBdLmFwcGVuZENoaWxkKGJhc2VVSSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJhc2VDbGljayAoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR2YXIgbGF5ZXJpZCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1sYXllclwiKTtcblx0dG9nZ2xlQWN0aXZlQmFzZVVJKHRoaXMpO1xuXHRyZW1vdmVDdXJyZW50QmFzZUxheWVyKCk7XG5cdGFkZE5ld0Jhc2VMYXllclRvTWFwKGxheWVyaWQpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciBjaGFuZ2VpbmcgYmFzZSBsYXllclxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0ICBldmVudENhdGVnb3J5OiAnbWFwJyxcblx0ICBldmVudEFjdGlvbjogJ2NoYW5nZSBiYXNlIGxheWVyJyxcblx0ICBldmVudExhYmVsOiBsYXllcmlkLFxuXHQgIG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHR9KTtcblxuXHR1cGRhdGVTaGFyZVVybCgpO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVBY3RpdmVCYXNlVUkgKGJhc2VVSUVsZW0pIHtcblx0ZDMuc2VsZWN0KFwiLmJhc2Utc2VsZWN0b3IuYWN0aXZlXCIpLmNsYXNzZWQoXCJhY3RpdmVcIiwgZmFsc2UpO1xuXHRkMy5zZWxlY3QoYmFzZVVJRWxlbSkuY2xhc3NlZChcImFjdGl2ZVwiLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ3VycmVudEJhc2VMYXllciAoKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHRtYXAuZWFjaExheWVyKGZ1bmN0aW9uIChsYXllcikge1xuXHRcdGlmIChsYXllci5vcHRpb25zLnR5cGUgIT09IEJBU0VfTEFZRVJfVFlQRSkgcmV0dXJuO1xuXHRcdG1hcC5yZW1vdmVMYXllcihsYXllcik7XG5cdH0pXG59XG5cbmZ1bmN0aW9uIGFkZE5ld0Jhc2VMYXllclRvTWFwIChsYXllcmlkKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHR2YXIgbGF5ZXI7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gX2Jhc2VsYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0bGF5ZXIgPSBfYmFzZWxheWVyc1tpXTtcblx0XHRpZiAobGF5ZXIuaWQgIT09IGxheWVyaWQpIGNvbnRpbnVlO1xuXHRcdGlmICghbGF5ZXIubGF5ZXIpIGxheWVyLmxheWVyID0gY3JlYXRlQmFzZUxheWVyKGxheWVyKTtcblx0XHRsYXllci5sYXllci5hZGRUbyhtYXApO1xuXHRcdGxheWVyLmxheWVyLmJyaW5nVG9CYWNrKCk7XG5cdFx0YnJlYWs7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQmFzZUxheWVyIChsYXllckNvbmZpZykge1xuXHRyZXR1cm4gTC50aWxlTGF5ZXIoXG5cdFx0bGF5ZXJDb25maWcudXJsLFxuXHRcdG1ha2VCYXNlTGF5ZXJPcHRpb25zKGxheWVyQ29uZmlnKVxuXHQpO1xufVxuXG5mdW5jdGlvbiBtYWtlQmFzZUxheWVyT3B0aW9ucyAoY29uZmlnKSB7XG5cdHZhciBvcHRpb25zID0ge307XG5cdGlmIChjb25maWcuaWQpIG9wdGlvbnMuaWQgPSBjb25maWcuaWQ7XG5cdGlmIChjb25maWcuYXR0cmlidXRpb24pIG9wdGlvbnMuYXR0cmlidXRpb24gPSBjb25maWcuYXR0cmlidXRpb247XG5cdGlmIChjb25maWcuc3ViZG9tYWlucykgb3B0aW9ucy5zdWJkb21haW5zID0gY29uZmlnLnN1YmRvbWFpbnM7XG5cdG9wdGlvbnMudHlwZSA9IEJBU0VfTEFZRVJfVFlQRTtcblxuXHRyZXR1cm4gb3B0aW9ucztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2Jhc2VsYXllci5qcyIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXJrZXIgKGxhdCwgbG5nKSB7XG5cdHJldHVybiBMLm1hcmtlcihbbGF0LCBsbmddLCB7aWNvbjogZ3JhcGhJY29ufSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJY29uICh0eXBlKSB7XG5cdHJldHVybiB0eXBlID09PSAnaG92ZXInID8gaG92ZXJJY29uIDogZ3JhcGhJY29uO1xufVxuXG52YXIgYmFzZUljb24gPSBMLkljb24uZXh0ZW5kKHt9KTtcblxudmFyIGdyYXBoSWNvbiA9IG5ldyBiYXNlSWNvbih7XG5cdGljb25Vcmw6ICdpbWdzL2JsdWVfaWNvbi5wbmcnLFxuXHRzaGFkb3dVcmw6ICdpbWdzL21hcmtlcl9zaGFkb3cucG5nJyxcblx0aWNvblNpemU6IFsyNSwgNDFdLFxuXHRpY29uQW5jaG9yOiBbMTIsIDQxXSxcblx0cG9wdXBBbmNob3I6IFsxLCAtMzRdLFxuXHRzaGFkb3dTaXplOiBbNDEsIDQxXVxufSk7XG5cbnZhciBob3Zlckljb24gPSBuZXcgYmFzZUljb24oe1xuXHRpY29uVXJsOiAnaW1ncy9vcmFuZ2VfaWNvbi5wbmcnLFxuXHRzaGFkb3dVcmw6ICdpbWdzL21hcmtlcl9zaGFkb3cucG5nJyxcblx0aWNvblNpemU6IFsyNSwgNDFdLFxuXHRpY29uQW5jaG9yOiBbMTIsIDQxXSxcblx0cG9wdXBBbmNob3I6IFsxLCAtMzRdLFxuXHRzaGFkb3dTaXplOiBbNDEsIDQxXVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9tYXJrZXIuanMiLCJpbXBvcnQge3VwZGF0ZVBhbmVsRHJhZ092ZXJsYXlIZWlnaHR9IGZyb20gXCIuL3BhbmVsXCI7XG5pbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tIFwiLi9zaGFyZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gQmluZFRhYkV2ZW50cyAoKSB7XG5cdGQzLnNlbGVjdEFsbChcIi5wYW5lbC10b3AtYnRuXCIpLm9uKFwiY2xpY2tcIiwgaGFuZGxlVGFiSGVhZGVyQnRuQ2xpY2spO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gR2V0QWN0aXZlVGFiICgpIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYW5lbC10b3AtYnRuIGFjdGl2ZVwiKVswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVGFiSGVhZGVyQnRuQ2xpY2sgKCkge1xuXHQvLyBJZiB0aGUgc2VjdGlvbiBpcyBhbHJlYWR5IGFjdGl2ZSwgZG8gbm90aGluZ1xuXHRpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHJldHVybjtcblx0XG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGNsaWNrIG9uIGdyYXBoIHR5cGVcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdCAgZXZlbnRDYXRlZ29yeTogJ3RhYicsXG5cdCAgZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdCAgZXZlbnRMYWJlbDogdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiKSxcblx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG5cblx0SGFuZGxlVGFiQ2hhbmdlKHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1hY3RpdmVcIikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZGxlVGFiQ2hhbmdlIChuZXdDbGFzcykge1xuXHRkaXNhYmxlQWN0aXZlVGFiKCk7XG5cdGVuYWJsZVRhYihuZXdDbGFzcyk7XG5cdHVwZGF0ZVNoYXJlVXJsKCk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZVRhYiAobmV3Q2xhc3MpIHtcblx0ZDMuc2VsZWN0KFwiLnBhbmVsLXRvcC1idG5bZGF0YS1hY3RpdmU9J1wiICsgbmV3Q2xhc3MgKyBcIiddXCIpLmNsYXNzZWQoXCJhY3RpdmVcIiwgdHJ1ZSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXAtd3JhcHBlclwiKS5jbGFzc0xpc3QuYWRkKG5ld0NsYXNzKVxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmVsXCIpLmNsYXNzTGlzdC5hZGQobmV3Q2xhc3MpXG5cblx0ZDMuc2VsZWN0KFwiLnBhbmVsLXNlY3Rpb24td3JhcHBlcltkYXRhLWFjdGl2ZT0nXCIgKyBuZXdDbGFzcyArIFwiJ11cIikuY2xhc3NlZChcImFjdGl2ZVwiLCB0cnVlKTtcblxuXHR0b2dnbGVNYXBQYWRkaW5nKCk7XG5cdHJlc2V0UGFuZWxXaWR0aCgpO1xuXHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KCk7XG59XG5cbmZ1bmN0aW9uIGRpc2FibGVBY3RpdmVUYWIgKCkge1xuXHR2YXIgYWN0aXZlQ2xhc3MgPSBkMy5zZWxlY3QoXCIucGFuZWwtdG9wLWJ0bi5hY3RpdmVcIikuYXR0cihcImRhdGEtYWN0aXZlXCIpO1xuXG5cdGQzLnNlbGVjdEFsbCgnI21hcC13cmFwcGVyLCAjcmlnaHQtcGFuZWwnKVxuXHRcdC5jbGFzc2VkKGFjdGl2ZUNsYXNzLCBmYWxzZSk7XG5cblx0ZDMuc2VsZWN0QWxsKCcucGFuZWwtdG9wLWJ0bi5hY3RpdmUsIC5wYW5lbC1zZWN0aW9uLXdyYXBwZXIuYWN0aXZlJylcblx0XHQuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVNYXBQYWRkaW5nICgpIHtcblx0dmFyIHBhZGRpbmdSaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZWxcIikub2Zmc2V0V2lkdGg7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwLXdyYXBwZXJcIikuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1JpZ2h0ICsgXCJweFwiO1xufVxuXG4vKipcbiAqIFNpbmNlIHRoZSBwYW5lbCBoYXMgY2hpbGQgZWxlbWVudHMgd2l0aCBwb3NpdGlvbiBmaXhlZCBhbmQgd2lkdGggaW5oZXJpdFxuICogd2UgbmVlZCB0byBjbGVhciB0aGUgaW5saW5lIHdpZHRoIHByb3BlcnR5IGlmIGFuZCBvbmx5IGlmIHRoZSBpbmxpbmVcbiAqIHdpZHRoIGlzIGxlc3MgdGhhbiB0aGUgbWluIHdpZHRoXG4gKi9cbmZ1bmN0aW9uIHJlc2V0UGFuZWxXaWR0aCAoKSB7XG5cdHZhciBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZWxcIik7XG5cdHZhciB3aWR0aCA9IHBhbmVsLnN0eWxlLndpZHRoO1xuXHRpZiAoIXdpZHRoKSByZXR1cm47XG5cblx0dmFyIHBhbmVsTWluV2lkdGggPSBkMy5zZWxlY3QocGFuZWwpLnN0eWxlKCdtaW4td2lkdGgnKS5zbGljZSgwLCAtMik7XG5cdGlmIChwYXJzZUludCh3aWR0aC5zbGljZSgwLCAtMiksIDEwKSA+IHBhcnNlSW50KHBhbmVsTWluV2lkdGgsIDEwKSkgcmV0dXJuO1xuXG5cdHBhbmVsLnN0eWxlLndpZHRoID0gXCJcIjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3RhYnMuanMiLCJpbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tICcuL3NoYXJlJ1xuaW1wb3J0IHt1cGRhdGVMYXllck9wYWNpdHl9IGZyb20gXCIuL2xheWVyXCI7XG5cbi8vIHNldCBpdCBtYW51YWxseSBmb3Igbm93XG5jb25zdCBPUEFDSVRZX1JBTkdFX01BWCA9IDkwXG5cbnZhciBvcGFjaXR5U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG5cdC5kb21haW4oWzEsIDBdKVxuXHQucmFuZ2UoWzAsIE9QQUNJVFlfUkFOR0VfTUFYXSlcblx0LmNsYW1wKHRydWUpXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRPcGFjaXR5U2xpZGVyUG9zaXRpb24gKGxheWVyLCBzbGlkZXJIYW5kbGUsIG9wYWNpdHkpIHtcblx0b3BhY2l0eSA9IG9wYWNpdHkgfHwgbGF5ZXIub3BhY2l0eVxuXHRzbGlkZXJIYW5kbGUuc3R5bGUudG9wID0gJycrb3BhY2l0eVNjYWxlKG9wYWNpdHkpKydweCdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPcGFjaXR5U2xpZGVyIChsYXllcikge1xuXHR2YXIgbGF5ZXJPcGFjaXR5ID0gbGF5ZXIub3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gbGF5ZXIub3BhY2l0eSA6IDFcblx0dmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgc2xpZGVyVHJhY2tPdmVybGF5ID0gbWFrZVNsaWRlclRyYWNrKGxheWVyLCBsYXllck9wYWNpdHkpXG5cdHZhciBpY29uV3JhcHBlckNsb3NlZCA9IG1ha2VPcGFjaXR5SWNvbldyYXBwZXIoJ2Nsb3NlZCcsIGxheWVyLCBzbGlkZXJUcmFja092ZXJsYXkpXG5cblx0d3JhcHBlci5jbGFzc0xpc3QuYWRkKCdvcGFjaXR5LXNsaWRlci13cmFwcGVyJylcblx0d3JhcHBlci5hcHBlbmRDaGlsZChzbGlkZXJUcmFja092ZXJsYXkpXG5cdHdyYXBwZXIuYXBwZW5kQ2hpbGQoaWNvbldyYXBwZXJDbG9zZWQpXG5cdHJldHVybiB3cmFwcGVyXG59XG5cbmZ1bmN0aW9uIG1ha2VPcGFjaXR5SWNvbldyYXBwZXIoc3RhdGUsIGxheWVyLCBzbGlkZXJUcmFja092ZXJsYXkpIHtcblx0dmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cdHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnb3BhY2l0eS1pY29uLXdyYXBwZXInKVxuXHRpY29uLmNsYXNzTGlzdC5hZGQoJ29wYWNpdHktaWNvbicpXG5cdGljb24uY2xhc3NMaXN0LmFkZChzdGF0ZSlcblx0aWNvbi5zZXRBdHRyaWJ1dGUoJ3NyYycsICdpbWdzL29wYWNpdHktaWNvbi0nK3N0YXRlKyctNjR4NjQucG5nJylcblx0aWNvbi5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdVc2UgdGhpcyBzbGlkZXIgdG8gYWRqdXN0IHRyYW5zcGFyZW5jeSBmb3IgdGhlICcgKyBsYXllci5uYW1lICsgJyBsYXllcicpXG5cdGljb24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdVc2UgdGhpcyBzbGlkZXIgdG8gYWRqdXN0IHRyYW5zcGFyZW5jeSBmb3IgdGhlICcgKyBsYXllci5uYW1lICsgJyBsYXllcicpXG5cdHdyYXBwZXIuYXBwZW5kQ2hpbGQoaWNvbilcblx0d3JhcHBlci5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgc2xpZGVySGFuZGxlID0gc2xpZGVyVHJhY2tPdmVybGF5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ29wYWNpdHktc2xpZGVyLWhhbmRsZScpWzBdXG5cdFx0dXBkYXRlTGF5ZXJPcGFjaXR5KGxheWVyLCAwKVxuXHRcdHNldE9wYWNpdHlTbGlkZXJQb3NpdGlvbihsYXllciwgc2xpZGVySGFuZGxlLCAwKVxuXHR9XG5cdHJldHVybiB3cmFwcGVyXG59XG5cbmZ1bmN0aW9uIG1ha2VTbGlkZXJUcmFjayhsYXllciwgbGF5ZXJPcGFjaXR5KSB7XG5cblx0dmFyIG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgdHJhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgc2xpZGVySGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuXHRvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ29wYWNpdHktc2xpZGVyLXRyYWNrLW92ZXJsYXknKVxuXHR0cmFjay5jbGFzc0xpc3QuYWRkKCdvcGFjaXR5LXNsaWRlci10cmFjaycpXG5cdHNsaWRlckhhbmRsZS5jbGFzc0xpc3QuYWRkKCdvcGFjaXR5LXNsaWRlci1oYW5kbGUnKVxuXG5cdG92ZXJsYXkuYXBwZW5kQ2hpbGQodHJhY2spXG5cdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc2xpZGVySGFuZGxlKVxuXG5cdGlmIChsYXllci5hY3RpdmUpIHNldE9wYWNpdHlTbGlkZXJQb3NpdGlvbihsYXllciwgc2xpZGVySGFuZGxlKVxuXHRzZXREcmFnRXZlbnRMaXN0ZW5lcihvdmVybGF5LCBsYXllciwgbGF5ZXJPcGFjaXR5KVxuXG5cdHJldHVybiBvdmVybGF5XG59XG5cbmZ1bmN0aW9uIHNldERyYWdFdmVudExpc3RlbmVyKG92ZXJsYXksIGxheWVyLCBsYXllck9wYWNpdHkpIHtcblx0ZDMuc2VsZWN0KG92ZXJsYXkpLmNhbGwoZDMuZHJhZygpXG5cdFx0Lm9uKCdzdGFydCBkcmFnJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHNsaWRlckhhbmRsZSA9IG92ZXJsYXkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3BhY2l0eS1zbGlkZXItaGFuZGxlJylbMF1cblx0XHRcdHZhciBuZXdPcGFjaXR5ID0gY2FsY09wYWNpdHlGcm9tTW91c2VQb3Mob3ZlcmxheSlcblx0XHRcdHVwZGF0ZUxheWVyT3BhY2l0eShsYXllciwgbmV3T3BhY2l0eSlcblx0XHRcdHNldE9wYWNpdHlTbGlkZXJQb3NpdGlvbihsYXllciwgc2xpZGVySGFuZGxlLCBuZXdPcGFjaXR5KVxuXHRcdH0pXG5cdFx0Lm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG5cblx0XHQgIHZhciBuZXdPcGFjaXR5ID0gY2FsY09wYWNpdHlGcm9tTW91c2VQb3Mob3ZlcmxheSlcblxuXHRcdCAgLy9zZW5kIGdvb2dsZSBhbmFseXRpY3Mgb3BhY2l0eSBzbGlkZXIgY2hhbmdlXG5cdFx0ICBnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdvcGFjaXR5IHNsaWRlcicsXG5cdFx0XHRldmVudEFjdGlvbjogJ2NoYW5nZScsXG5cdFx0XHRldmVudExhYmVsOiAne1wiJyArIGxheWVyLm5hbWUgKyAnXCI6IFwiJyArIG5ld09wYWNpdHkgKyAnXCJ9Jyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdCAgfSk7XG5cblx0XHRcdHVwZGF0ZVNoYXJlVXJsKClcblx0XHR9KVxuXHQpXG59XG5cbmZ1bmN0aW9uIGNhbGNPcGFjaXR5RnJvbU1vdXNlUG9zKG92ZXJsYXkpIHtcblx0dmFyIHlQb3MgPSBkMy5tb3VzZShvdmVybGF5KVsxXVxuXHR2YXIgbmV3T3BhY2l0eSA9IG9wYWNpdHlTY2FsZS5pbnZlcnQoeVBvcylcblx0cmV0dXJuIG5ld09wYWNpdHlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL29wYWNpdHlTbGlkZXIuanMiLCIvKlxuICBcImxvZ29cIjoge1xuXHRcImltYWdlXCI6IFwiaW1ncy9sYW5kYXRfbG9nb19ibHVlLnBuZ1wiLFxuXHRcImFsdFwiOiBcIkxvZ28gZm9yIHRoZSBMYW5EYXQgcHJvamVjdFwiLFxuXHRcImxpbmtcIjogXCJodHRwczovL2xhbmRhdC1kZXYubmVtYWMub3JnXCIsXG5cdFwibG9jYXRpb25cIjogW1wiYm90dG9tXCIsIFwicmlnaHRcIl1cbiAgfSxcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENyZWF0ZUxvZ28gKGxvZ29kYXRhKSB7XG5cdGlmICghbG9nb2RhdGEuaW1hZ2UpIHJldHVybjtcblxuXHR2YXIgbG9nb1dyYXBwZXIgPSBjcmVhdGVMb2dvV3JhcHBlcigpO1xuXHR2YXIgbG9nb0ltYWdlID0gY3JlYXRlTG9nb0ltYWdlKGxvZ29kYXRhKTtcblx0dmFyIGxvZ29MaW5rID0gbG9nb2RhdGEubGluayA/IGNyZWF0ZUxvZ29MaW5rKGxvZ29kYXRhLmxpbmspIDogbnVsbDtcblxuXHRpZiAobG9nb0xpbmspIHtcblx0XHRsb2dvTGluay5hcHBlbmRDaGlsZChsb2dvSW1hZ2UpO1xuXHRcdGxvZ29XcmFwcGVyLmFwcGVuZENoaWxkKGxvZ29MaW5rKTtcblx0fSBlbHNlIHtcblx0XHRsb2dvV3JhcHBlci5hcHBlbmRDaGlsZChsb2dvSW1hZ2UpO1xuXHR9XG5cblx0dmFyIGluc2VydEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGxvZ29kYXRhLmxvY2F0aW9uKVswXTtcblx0dmFyIGV4aXN0aW5nQ2hpbGQgPSBpbnNlcnRFbGVtZW50LmZpcnN0Q2hpbGQ7XG5cdGluc2VydEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGxvZ29XcmFwcGVyLCBleGlzdGluZ0NoaWxkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9nb1dyYXBwZXIgKCkge1xuXHR2YXIgbG9nb1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRkMy5zZWxlY3QobG9nb1dyYXBwZXIpLmNsYXNzZWQoXCJwcm9qZWN0LWxvZ29cIiwgdHJ1ZSk7XG5cdHJldHVybiBsb2dvV3JhcHBlcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9nb0ltYWdlIChsb2dvZGF0YSkge1xuXHR2YXIgbG9nb0ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0bG9nb0ltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBsb2dvZGF0YS5pbWFnZSk7XG5cdGlmIChsb2dvZGF0YS5sYWJlbCkge1xuXHRcdGxvZ29JbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgbG9nb2RhdGEubGFiZWwpO1xuXHRcdGxvZ29JbWFnZS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsb2dvZGF0YS5sYWJlbCk7XG5cdH1cblx0cmV0dXJuIGxvZ29JbWFnZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9nb0xpbmsgKGxpbmspIHtcblx0dmFyIGxvZ29MaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdGxvZ29MaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgbGluayk7XG5cdGxvZ29MaW5rLnNldEF0dHJpYnV0ZShcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcblxuXHRsb2dvTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuXHQgIC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciBjbGlja2luZyBsb2dvXG5cdCAgZ2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0ZXZlbnRMYWJlbDogJ2xhbmRhdCBsb2dvJyxcblx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0ICB9KTtcblx0fSk7XG5cblx0cmV0dXJuIGxvZ29MaW5rO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvbG9nby5qcyIsImltcG9ydCB7Y2xlYXJNYXB9IGZyb20gJy4vbWFwJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCaW5kTW9iaWxlTWVudUV2ZW50cyAoKSB7XG5cdGQzLnNlbGVjdChcIiNtb2JpbGUtdG9nZ2xlLXBhbmVsLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZU1vYmlsZVRvZ2dsZVBhbmVsQnRuQ2xpY2spXG5cdGQzLnNlbGVjdEFsbChcIiNtb2JpbGUtY2xlYXItbWFwLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZU1vYmlsZUNsZWFyTWFwQnRuQ2xpY2spXG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1vYmlsZUNsZWFyTWFwQnRuQ2xpY2soKSB7XG5cdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdGNsZWFyTWFwKClcblx0ZGlzcGF0Y2hNb2JpbGVDbGVhck1hcEJ0bkNsaWNrQW5hbHl0aWNzKClcbn1cblxuZnVuY3Rpb24gaGFuZGxlTW9iaWxlVG9nZ2xlUGFuZWxCdG5DbGljayAoKSB7XG5cdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdHZhciB3cmFwcGVyID0gZDMuc2VsZWN0KFwiI3dyYXBwZXJcIik7XG5cdHZhciBzdGF0dXMgPSB3cmFwcGVyLmNsYXNzZWQoXCJtb2JpbGUtbWVudS1oaWRkZW5cIik7XG5cdHdyYXBwZXIuY2xhc3NlZChcIm1vYmlsZS1tZW51LWhpZGRlblwiLCAhc3RhdHVzKTtcblx0ZGlzcGF0Y2hNb2JpbGVUb2dnbGVQYW5lbEJ0bkNsaWNrQW5hbHl0aWNzKCFzdGF0dXMgPyBcIm9wZW5pbmdcIiA6IFwiY2xvc2luZ1wiKTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hNb2JpbGVDbGVhck1hcEJ0bkNsaWNrQW5hbHl0aWNzICgpIHtcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ21vYmlsZSBjbGVhcm1hcCcsXG5cdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0ZXZlbnRMYWJlbDogJ01vYmlsZSBDbGVhciBNYXAnLFxuXHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHR9KVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE1vYmlsZVRvZ2dsZVBhbmVsQnRuQ2xpY2tBbmFseXRpY3MgKHN0YXR1cykge1xuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRldmVudENhdGVnb3J5OiAnbW9iaWxlIG1lbnUnLFxuXHRcdGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuXHRcdGV2ZW50TGFiZWw6ICdNb2JpbGUgUGFuZWwgVG9nZ2xlJyArIHN0YXR1cyxcblx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9tb2JpbGUuanMiLCJpbXBvcnQge0dldE1hcCwgY2xlYXJNYXB9IGZyb20gXCIuL21hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCaW5kRGVza3RvcE1lbnVFdmVudHMgKCkge1xuXHRkMy5zZWxlY3QoXCIjdG9nZ2xlLXBhbmVsLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZURlc2t0b3BUb2dnbGVQYW5lbEJ0bkNsaWNrKVxuXHRkMy5zZWxlY3RBbGwoXCIjY2xlYXItbWFwLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZURlc2t0b3BDbGVhck1hcEJ0bkNsaWNrKVxufVxuXG5mdW5jdGlvbiBoYW5kbGVEZXNrdG9wQ2xlYXJNYXBCdG5DbGljayhlKSB7XG5cdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdGNsZWFyTWFwKClcblx0Ly8gUXVpY2sgYW5kIGRpcnR5IHNvbHV0aW9uIC0tIGNyZWF0ZXMgYSBuZXcgc2Vzc2lvbiBmb3IgZ29vZ2xlIGFuYWx5dGljcz9cblx0Ly92YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKVswXVxuXHQvL3dpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsXG5cdGRpc3BhdGNoRGVza3RvcENsZWFyTWFwQnRuQ2xpY2tBbmFseXRpY3MoKVxufVxuXG5mdW5jdGlvbiBoYW5kbGVEZXNrdG9wVG9nZ2xlUGFuZWxCdG5DbGljayAoZSkge1xuXHRkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHR2YXIgd3JhcHBlciA9IGQzLnNlbGVjdChcIiN3cmFwcGVyXCIpO1xuXHR2YXIgc3RhdHVzID0gd3JhcHBlci5jbGFzc2VkKFwicGFuZWwtYWN0aXZlXCIpO1xuXHR3cmFwcGVyLmNsYXNzZWQoXCJwYW5lbC1hY3RpdmVcIiwgIXN0YXR1cyk7XG5cdHdyYXBwZXIuY2xhc3NlZChcInBhbmVsLWluYWN0aXZlXCIsIHN0YXR1cyk7XG5cdChHZXRNYXAoKSkuaW52YWxpZGF0ZVNpemUoe3BhbjogZmFsc2V9KTtcblx0ZGlzcGF0Y2hEZXNrdG9wVG9nZ2xlUGFuZWxCdG5DbGlja0FuYWx5dGljcyghc3RhdHVzID8gXCJPcGVuXCIgOiBcIkNsb3NlXCIpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaERlc2t0b3BDbGVhck1hcEJ0bkNsaWNrQW5hbHl0aWNzICgpIHtcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ2Rlc2t0b3AnLFxuXHRcdGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuXHRcdGV2ZW50TGFiZWw6ICdDbGVhciBNYXAgQnRuJyxcblx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRGVza3RvcFRvZ2dsZVBhbmVsQnRuQ2xpY2tBbmFseXRpY3MgKHN0YXR1cykge1xuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRldmVudENhdGVnb3J5OiAnZGVza3RvcCcsXG5cdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0ZXZlbnRMYWJlbDogJ1BhbmVsIFRvZ2dsZSAnICsgc3RhdHVzLFxuXHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHR9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3BhbmVsVG9nZ2xlLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Nzcy9zYXNzL2xhbmRhdC5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9