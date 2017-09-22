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
			tileSize: layer.tileSize || document.getElementById("map").clientWidth
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
			plots: plots || ["baseline", "2015", "thresholds"]
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
		var url = "https://fcav-ndvi.nemac.org/landdat_product.cgi?args=" + poi.lng + "," + poi.lat;
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
	
	function reprocessData(origdata) {
		var expectedYearLength = 46;
		var data = {};
		var point;
		var key;
		var i, j;
	
		data["keys"] = [];
		for (i = 0; i < origdata.length; i++) {
			point = origdata[i];
			key = point[0].substring(0, 4);
			if (!data.hasOwnProperty(key)) {
				data[key] = [];
				data["keys"].push(key);
			}
			data[key].push(point);
		}
	
		var keysToBeDeleted = [];
		for (i = 0; i < data.keys.length; i++) {
			key = data.keys[i];
			if (data[key].length !== expectedYearLength) {
				keysToBeDeleted.push(key);
			}
		}
	
		for (i = 0; i < keysToBeDeleted.length; i++) {
			key = keysToBeDeleted[i];
			delete data[key];
			data.keys.splice(data.keys.indexOf(key), 1);
		}
	
		var dataForBaseline;
		var mean;
		data["baseline"] = [];
		for (i = 0; i < expectedYearLength; i++) {
			dataForBaseline = [];
			for (j = i; j < origdata.length; j += expectedYearLength) {
				dataForBaseline.push(parseInt(origdata[j][1], 10));
			}
	
			mean = computeAverage(dataForBaseline);
			data["baseline"].push(mean);
		}
	
		return data;
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
		makeUpDownLineGraph(data, div);
		makeUpDownOverlapingLineGraphWithCheckboxes(reprocessedData, div, poi);
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
	
		var averages = data["baseline"];
		var center = findPolarCenter(data);
		var thresholds = findPolarThresholds(averages, center[1][0]);
	
		/**
	  * Sets up scaling of data. We know that the ndvi values fall between
	  * 0 & 100 so we set our domain to that. The range controls where the
	  * points will lie in our graph, so we set them to be between 0 and the
	  * radius.
	  */
		var r = d3.scaleLinear().domain([0, 100]).range([0, radius]);
	
		/**
	  * function which will draw each point. To compute the distance from the
	  * center each point is we pass the datapoint to the function defined above.
	  * To determine the angle from the origin we need to convert the day to
	  * radians, so we convert the day to a number between 0 & 1 and then multiply
	  * it by 2 pi.
	  */
		var line = d3.radialLine().radius(function (d) {
			return Array.isArray(d) ? r(d[1]) : r(d);
		}).angle(function (d, i) {
			var day = Array.isArray(d) ? parseJulianDay(d[0]) : i * 8 + 3;
			return (day - 1) % 365 / 365 * (2 * Math.PI);
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
	  * This block of code draws the labels for each month and the lines
	  * that go out to them.
	  */
		var ga_a = svg.append("g").attr("class", "a axis").selectAll("g").data(d3.range(0, 360, 30)).enter().append("g").attr("transform", function (d) {
			return "rotate(" + (d - 90) + ")";
		});
	
		ga_a.append("line").attr("x2", radius);
	
		ga_a.append("text").attr("x", radius + 6).attr("dy", ".35em").style("text-anchor", function (d) {
			return d < 360 && d > 180 ? "end" : null;
		}).attr("transform", function (d) {
			return d < 360 && d > 180 ? "rotate(180 " + (radius + 6) + ",0)" : null;
		}).text(function (d) {
			return MONTH_LABELS[d / 30];
		});
	
		/**
	  * Draws the threshold lines
	  */
		var thresholdElem = svg.append("g").selectAll("g").data(thresholds).enter().append("g").attr("transform", function (d) {
			return "rotate(" + (d.data[1][0] - 90) + ")";
		});
	
		thresholdElem.append("line").attr("class", "line").attr("x2", radius);
	
		thresholdElem.append("text").attr("x", function (d) {
			var day = d.data[1][0];return day < 360 && day > 180 ? radius + 30 : radius - 30;
		}).attr("y", function (d) {
			return d.data[1][0] % 365 / 365 * (2 * Math.PI) + 6;
		}).attr("dy", ".35em").style("text-anchor", function (d) {
			var day = d.data[1][0];return day < 360 && day > 180 ? "middle" : null;
		}).attr("transform", function (d) {
			var day = d.data[1][0];return day < 360 && day > 180 ? "rotate(180 " + (radius + 6) + ",0)" : null;
		}).text(function (d) {
			return d.label;
		});
	
		thresholdElem.style("opacity", poi.plots.indexOf("thresholds") !== -1 ? 1 : 0);
	
		/**
	  * Draws the line to the center of the data
	  */
		var centerDay = center[1][0];
		var centerDayOpposite = (centerDay + 365 / 2) % 365;
		var centerDayData = [centerDay, 100];
		var centerDayOppositeData = [centerDayOpposite, 100];
		var growingSeasonData = [centerDayData, centerDayOppositeData];
	
		drawPolarPath(growingSeasonData, line, svg).classed("growing-season-line", "true");
	
		drawPolarPath(center, line, svg).classed("center-line", "true");
	
		svg.selectAll("point").data([center[1]]).enter().append("circle").attr("class", "center").attr("r", 4).attr("transform", function (d) {
			var coors = line([d]).slice(1).slice(0, -1);
			return "translate(" + coors + ")";
		}).attr("stroke", "#000").attr("fill", "#ea0c48").on("mouseover", function (d) {
			tip.show("Center: " + String(d[1]).substring(0, 7));
			this.setAttribute("r", 5);
		}).on("mouseout", function (d) {
			tip.hide();
			this.setAttribute("r", 4);
		});
	
		var charts = {};
	
		/**
	  * This block of code draws the line that the data follows
	  */
		var plot, i, l;
		for (i = 0, l = poi.plots.length; i < l; i++) {
			plot = poi.plots[i];
			if (plot === "thresholds") continue;
			charts[plot] = {
				"path": drawPolarPath(data[plot], line, svg)
			};
		}
	
		/**
	  * This block of code draws the point at each data point
	  */
		for (i = 0, l = poi.plots.length; i < l; i++) {
			plot = poi.plots[i];
			if (plot === "thresholds") continue;
			charts[plot].points = drawLinearPoints(data[plot], line, svg);
		}
	
		var inputwrapper = wrapper.append("div").classed("input-wrapper", true);
	
		data.keys.forEach(function (key) {
			createCheckbox(inputwrapper, key, "polar", poi, charts, data, line, svg, averages);
		});
	
		createCheckbox(inputwrapper, "baseline", "polar", poi, charts, data, line, svg, averages);
	
		var thresholdCheckbox = inputwrapper.append("div").classed("threshold-checkbox", true);
	
		thresholdCheckbox.append("input").attr("type", "checkbox").attr("id", "threshold-checkbox-" + poi.lat.toString().replace(".", "") + "-" + poi.lng.toString().replace(".", "")).property("checked", poi.plots.indexOf("thresholds") !== -1).on("change", function (e) {
			thresholdElem.style("opacity", this.checked ? 1 : 0);
			var offon = this.checked ? 'off' : 'on';
	
			if (this.checked) {
				addKeyToPOI(poi, "thresholds");
			} else {
				removeKeyFromPOI(poi, "thresholds");
			}
	
			(0, _share.updateShareUrl)();
			//send google analytics graph threshold click off
			dispatchGraphCheckboxClick('threshold polar timeseries ' + offon);
		});
	
		thresholdCheckbox.append("label").text("Thresholds").attr("for", "threshold-checkbox-" + poi.lat.toString().replace(".", "") + "-" + poi.lng.toString().replace(".", ""));
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
	
	//////////////////////// GRAPH HELPERS ///////////////////////////////////
	
	function drawLinearPath(data, line, svg) {
		return svg.append("path").attr("class", "line").attr("d", line(data));
	}
	
	function drawPolarPath(data, line, svg) {
		return svg.append("path").datum(data).attr("class", "line").attr("d", line);
	}
	
	function drawLinearPoints(data, line, svg) {
		return svg.selectAll("point").data(data).enter().append("circle").attr("r", 2).attr("class", "point").attr("transform", function (d, i) {
			var point = Array.isArray(d) ? d : [i * 8 + 3, d];
			var coors = line([point]).slice(1).slice(0, -1);
			return "translate(" + coors + ")";
		})
		//.attr("r", 3)
		.attr("stroke", "#000").attr("fill", function (d, i) {
			var val = Array.isArray(d) ? d[0].substring(0, 4) : 0;
			return pullDistinctColor(val);
		}).on("mouseover", handlePointMouseover).on("mouseout", handlePointMouseout);
	}
	
	function handlePointMouseover(d) {
		var tipString = Array.isArray(d) ? formatDate(d[0]) + ": " + d[1] : "Average: " + d;
		tip.show(tipString);
		this.setAttribute("r", "4");
	}
	
	function handlePointMouseout(d) {
		tip.hide();
		this.setAttribute("r", "2");
	
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
	
	function createCheckbox(wrapper, key, type, poi, charts, data, line, svg, averages) {
		var checkboxWrapper = wrapper.append("div");
		var lat = poi.lat;
		var lng = poi.lng;
	
		checkboxWrapper.append("input").attr("type", "checkbox").attr("id", type + "-" + key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", "")).attr("data-link", key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", "")).attr("value", key).property("checked", poi.plots.indexOf(key) !== -1 ? true : false).on("change", function (e) {
			var newYear = this.value;
			if (!this.checked) {
				handleCheckboxDisable(charts, newYear);
				removeKeyFromPOI(poi, key);
				//send google analytics graph year click off
				dispatchGraphCheckboxClick(newYear + ' ' + type + ' timeseries off');
			} else {
				handleCheckboxEnable(charts, newYear, data, line, svg, averages);
				addKeyToPOI(poi, key);
				//send google analytics graph year click on
				dispatchGraphCheckboxClick(newYear + ' ' + type + ' timeseries on');
			}
			handleCheckboxSync(key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", ""), this.checked);
			(0, _share.updateShareUrl)();
		});
	
		checkboxWrapper.append("label").text(key !== "baseline" ? key : "Baseline").attr("for", type + "-" + key + lat.toString().replace(".", "") + "-" + lng.toString().replace(".", ""));
	
		checkboxWrapper.append("div").style("background", pullDistinctColor(key !== "baseline" ? key : 0)).classed("graph-pip-example", true);
	}
	
	function handleCheckboxDisable(charts, newYear) {
		charts[newYear].path.remove();
		charts[newYear].points.remove();
	}
	
	function handleCheckboxEnable(charts, newYear, data, line, svg) {
		if (!charts.hasOwnProperty(newYear)) {
			charts[newYear] = {};
		}
		charts[newYear].path = drawLinearPath(data[newYear], line, svg);
		charts[newYear].points = drawLinearPoints(data[newYear], line, svg);
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
	
	function pullDistinctColor(year) {
		var colorRamp = ["#ffe476", "#036593", "#116c91", "#1e7390", "#2c7b8e", "#39828c", "#4c8c8a", "#5e9589", "#719f87", "#83a886", "#95b183", "#a6ba80", "#b8c37c", "#cacc79", "#d6d279", "#e2d779", "#efdd78", "#fbe378"];
	
		return year === 0 ? "#fff" : colorRamp[parseInt(year, 10) % colorRamp.length];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzA2ZWI3ODFiNGJlOTA4NmY1MjYiLCJ3ZWJwYWNrOi8vLy4vanMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc2VhcmNoLmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL2xlYWZsZXRDb250cm9sLmpzIiwid2VicGFjazovLy8uL34vbm9kZW50LXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly8vLi9+L25vZGVudC1ydW50aW1lL3pvdXNhbi5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL34vbm9kZW50LXJ1bnRpbWUvdGhlbmFibGVGYWN0b3J5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3NlYXJjaEVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvZG9tVXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3Jlc3VsdExpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL2JpbmdQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvcHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL2VzcmlQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvZ29vZ2xlUHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL29wZW5TdHJlZXRNYXBQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9sYXllci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvcG9pLmpzIiwid2VicGFjazovLy8uL2pzL2dyYXBoLmpzIiwid2VicGFjazovLy8uL2pzL3NoYXJlLmpzIiwid2VicGFjazovLy8uL2pzL2Jhc2VsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYXJrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvdGFicy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9vcGFjaXR5U2xpZGVyLmpzIiwid2VicGFjazovLy8uL2pzL2xvZ28uanMiLCJ3ZWJwYWNrOi8vLy4vanMvbW9iaWxlLmpzIiwid2VicGFjazovLy8uL2pzL3BhbmVsVG9nZ2xlLmpzIiwid2VicGFjazovLy8uL2Nzcy9zYXNzL2xhbmRhdC5zY3NzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiX2xlYWZsZXRDb250cm9sIiwicmVxdWlyZSIsImVudW1lcmFibGUiLCJnZXQiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiZGVmYXVsdCIsIl9zZWFyY2hFbGVtZW50IiwiX2JpbmdQcm92aWRlciIsIl9lc3JpUHJvdmlkZXIiLCJfZ29vZ2xlUHJvdmlkZXIiLCJfb3BlblN0cmVldE1hcFByb3ZpZGVyIiwiX3Byb3ZpZGVyIiwib2JqIiwiX19lc01vZHVsZSIsIl9ub2RlbnRSdW50aW1lIiwiX25vZGVudFJ1bnRpbWUyIiwiX2V4dGVuZHMiLCJhc3NpZ24iLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiTGVhZmxldENvbnRyb2wiLCJfbG9kYXNoIiwiX2xvZGFzaDIiLCJfc2VhcmNoRWxlbWVudDIiLCJfcmVzdWx0TGlzdCIsIl9yZXN1bHRMaXN0MiIsIl9kb21VdGlscyIsIl9jb25zdGFudHMiLCJkZWZhdWx0T3B0aW9ucyIsInBvc2l0aW9uIiwic3R5bGUiLCJzaG93TWFya2VyIiwic2hvd1BvcHVwIiwicG9wdXBGb3JtYXQiLCJfcmVmIiwicmVzdWx0IiwibGFiZWwiLCJtYXJrZXIiLCJpY29uIiwiTCIsIkljb24iLCJEZWZhdWx0IiwiZHJhZ2dhYmxlIiwibWF4TWFya2VycyIsInJldGFpblpvb21MZXZlbCIsImFuaW1hdGVab29tIiwic2VhcmNoTGFiZWwiLCJub3RGb3VuZE1lc3NhZ2UiLCJtZXNzYWdlSGlkZURlbGF5Iiwiem9vbUxldmVsIiwiY2xhc3NOYW1lcyIsImNvbnRhaW5lciIsImJ1dHRvbiIsInJlc2V0QnV0dG9uIiwibXNnYm94IiwiZm9ybSIsImlucHV0IiwiYXV0b0NvbXBsZXRlIiwiYXV0b0NvbXBsZXRlRGVsYXkiLCJhdXRvQ2xvc2UiLCJrZWVwUmVzdWx0Iiwid2FzSGFuZGxlckVuYWJsZWQiLCJtYXBIYW5kbGVycyIsIkNvbnRyb2wiLCJpbml0aWFsaXplIiwib3B0aW9ucyIsIl90aGlzIiwibWFya2VycyIsIkZlYXR1cmVHcm91cCIsImhhbmRsZXJzRGlzYWJsZWQiLCJfb3B0aW9ucyIsInNlYXJjaEVsZW1lbnQiLCJoYW5kbGVTdWJtaXQiLCJxdWVyeSIsIm9uU3VibWl0IiwiX3NlYXJjaEVsZW1lbnQkZWxlbWVuIiwiZWxlbWVudHMiLCJjcmVhdGVFbGVtZW50IiwidGl0bGUiLCJocmVmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvbkNsaWNrIiwiaW5uZXJIVE1MIiwiY2xlYXJSZXN1bHRzIiwicmVzdWx0TGlzdCIsImhhbmRsZUNsaWNrIiwiX3JlZjIiLCJhcHBlbmRDaGlsZCIsImF1dG9TZWFyY2giLCJzZWxlY3RSZXN1bHQiLCJkaXNhYmxlSGFuZGxlcnMiLCJyZXN0b3JlSGFuZGxlcnMiLCJvbkFkZCIsIm1hcCIsIl9vcHRpb25zMiIsImFkZFRvIiwicm9vdCIsImdldENvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJvblJlbW92ZSIsInJlbW92ZSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJfc2VhcmNoRWxlbWVudCRlbGVtZW4yIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJyZW1vdmVDbGFzc05hbWUiLCJhZGRDbGFzc05hbWUiLCJmb2N1cyIsIl90aGlzMiIsImZvckVhY2giLCJoYW5kbGVyIiwiZW5hYmxlZCIsImRpc2FibGUiLCJfdGhpczMiLCJlbmFibGUiLCJFTlRFUl9LRVkiLCJBUlJPV19ET1dOX0tFWSIsIkFSUk9XX1VQX0tFWSIsImluY2x1ZGVzIiwia2V5Q29kZSIsImxpc3QiLCJtYXgiLCJjb3VudCIsIm5leHQiLCJjb2RlIiwic2VsZWN0ZWQiLCJpZHgiLCJpdGVtIiwic2VsZWN0IiwiZm9yY2UiLCJ1bmRlZmluZWQiLCJFU0NBUEVfS0VZIiwiX29wdGlvbnMzIiwiY2xlYXJMYXllcnMiLCJjbGVhciIsIlByb21pc2UiLCIkcmV0dXJuIiwiJGVycm9yIiwicHJvdmlkZXIiLCJyZXN1bHRzIiwiU1BFQ0lBTF9LRVlTIiwic2VhcmNoIiwidGhlbiIsIiRhd2FpdF8yIiwicmVuZGVyIiwiJElmXzEiLCIkYXN5bmNiaW5kIiwiJGF3YWl0XzMiLCJzaG93UmVzdWx0IiwiX3JlZjMiLCJrZXlzIiwiX2xheWVycyIsInJlbW92ZUxheWVyIiwiYWRkTWFya2VyIiwiY2VudGVyTWFwIiwiZmlyZUV2ZW50IiwibG9jYXRpb24iLCJjbG9zZVJlc3VsdHMiLCJfdGhpczQiLCJfb3B0aW9uczQiLCJNYXJrZXIiLCJ5IiwieCIsInBvcHVwTGFiZWwiLCJiaW5kUG9wdXAiLCJhZGRMYXllciIsIm9wZW5Qb3B1cCIsIm9uIiwiYXJncyIsImdldExhdExuZyIsIl9vcHRpb25zNSIsInJlc3VsdEJvdW5kcyIsIkxhdExuZ0JvdW5kcyIsImJvdW5kcyIsImlzVmFsaWQiLCJnZXRCb3VuZHMiLCJmaXRCb3VuZHMiLCJhbmltYXRlIiwic2V0VmlldyIsImdldENlbnRlciIsImdldFpvb20iLCJfb3B0aW9uczYiLCJleHRlbmQiLCJFcnJvciIsIkxDb250cm9sIiwiX2xlbiIsIkFycmF5IiwiX2tleSIsIkZ1bmN0aW9uIiwiYmluZCIsImFwcGx5IiwiY29uY2F0IiwicHJvY2Vzc0luY2x1ZGVzIiwic3JjIiwidG9TdHJpbmciLCJ0IiwibWF0Y2giLCJyZSIsIm0iLCJteCIsImV4ZWMiLCJwdXNoIiwicmV2ZXJzZSIsInNsaWNlIiwiaW5kZXgiLCJzdWJzdHIiLCJyZXBsYWNlIiwiem91c2FuIiwidGhlbmFibGUiLCJzZWxmIiwiY2F0Y2hlciIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwidHJhbXBvbGluZSIsInMiLCJ1IiwiYiIsInEiLCJwb3AiLCJyIiwiTGF6eVRoZW5hYmxlIiwiRWFnZXJUaGVuYWJsZSIsIlRoZW5hYmxlIiwiRWFnZXJUaGVuYWJsZUZhY3RvcnkiLCJyZXNvbHZlciIsImJvdW5kVGhlbiIsImV4IiwiJGFzeW5jc3Bhd24iLCJwcm9taXNlUHJvdmlkZXIiLCJnZW5GIiwiZW5vdWdoIiwicmVzb2x2ZSIsInJlamVjdCIsImdlbiIsInN0ZXAiLCJmbiIsImFyZyIsImRvbmUiLCJ2IiwidGhyb3ciLCJtb2R1bGUiLCJ0aWNrIiwicHJvY2VzcyIsIm5leHRUaWNrIiwic2V0SW1tZWRpYXRlIiwiZiIsInNldFRpbWVvdXQiLCJzb29uIiwiZnEiLCJmcVN0YXJ0IiwiYnVmZmVyU2l6ZSIsImNhbGxRdWV1ZSIsInNwbGljZSIsIlpvdXNhbiIsImZ1bmMiLCJtZSIsInN0YXRlIiwiVHlwZUVycm9yIiwiZmlyc3QiLCJyYSIsInJyIiwiU1RBVEVfRlVMRklMTEVEIiwiYyIsIm4iLCJsIiwicmVhc29uIiwiU1RBVEVfUkVKRUNURUQiLCJjbGllbnRzIiwib25GIiwib25SIiwicCIsImNsaWVudCIsImEiLCJ5cmV0IiwiZXJyIiwidmFsIiwieiIsInZlcnNpb24iLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIkl0ZW0iLCJhcnJheSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2IiwidmVyc2lvbnMiLCJub29wIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsIm5hbWUiLCJiaW5kaW5nIiwiY3dkIiwiY2hkaXIiLCJkaXIiLCJ1bWFzayIsIlRpbWVvdXQiLCJ3aW5kb3ciLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJjbG9zZSIsImlkIiwiY2xlYXJGbiIsIl9pZCIsIl9jbGVhckZuIiwidW5yZWYiLCJyZWYiLCJlbnJvbGwiLCJtc2VjcyIsIl9pZGxlVGltZW91dElkIiwiX2lkbGVUaW1lb3V0IiwidW5lbnJvbGwiLCJfdW5yZWZBY3RpdmUiLCJhY3RpdmUiLCJvblRpbWVvdXQiLCJfb25UaW1lb3V0IiwiY2xlYXJJbW1lZGlhdGUiLCJnbG9iYWwiLCJuZXh0SGFuZGxlIiwidGFza3NCeUhhbmRsZSIsImN1cnJlbnRseVJ1bm5pbmdBVGFzayIsImRvYyIsImRvY3VtZW50IiwicmVnaXN0ZXJJbW1lZGlhdGUiLCJjYWxsYmFjayIsInRhc2siLCJoYW5kbGUiLCJydW5JZlByZXNlbnQiLCJpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbiIsImNhblVzZVBvc3RNZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJpbXBvcnRTY3JpcHRzIiwicG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyIsIm9sZE9uTWVzc2FnZSIsIm9ubWVzc2FnZSIsImluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uIiwibWVzc2FnZVByZWZpeCIsIk1hdGgiLCJyYW5kb20iLCJvbkdsb2JhbE1lc3NhZ2UiLCJkYXRhIiwiaW5kZXhPZiIsImF0dGFjaEV2ZW50IiwiaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24iLCJjaGFubmVsIiwiTWVzc2FnZUNoYW5uZWwiLCJwb3J0MSIsInBvcnQyIiwiaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbiIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJzY3JpcHQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZW1vdmVDaGlsZCIsImluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24iLCJhdHRhY2hUbyIsImdldFByb3RvdHlwZU9mIiwiaXNUaGVuYWJsZSIsInJlc29sdXRpb24iLCJob3ciLCJDaGFpbmVkIiwiX3VuY2hhaW5lZCIsInRoZW5DaGFpbiIsInJlcyIsInJlaiIsImNoYWluIiwiX3Jlc29sdmVyIiwiRlVOQ19FUlJPUl9URVhUIiwiTkFOIiwic3ltYm9sVGFnIiwicmVUcmltIiwicmVJc0JhZEhleCIsInJlSXNCaW5hcnkiLCJyZUlzT2N0YWwiLCJmcmVlUGFyc2VJbnQiLCJwYXJzZUludCIsImZyZWVHbG9iYWwiLCJmcmVlU2VsZiIsIm9iamVjdFByb3RvIiwib2JqZWN0VG9TdHJpbmciLCJuYXRpdmVNYXgiLCJuYXRpdmVNaW4iLCJtaW4iLCJub3ciLCJEYXRlIiwiZGVib3VuY2UiLCJ3YWl0IiwibGFzdEFyZ3MiLCJsYXN0VGhpcyIsIm1heFdhaXQiLCJ0aW1lcklkIiwibGFzdENhbGxUaW1lIiwibGFzdEludm9rZVRpbWUiLCJsZWFkaW5nIiwibWF4aW5nIiwidHJhaWxpbmciLCJ0b051bWJlciIsImlzT2JqZWN0IiwiaW52b2tlRnVuYyIsInRpbWUiLCJ0aGlzQXJnIiwibGVhZGluZ0VkZ2UiLCJ0aW1lckV4cGlyZWQiLCJyZW1haW5pbmdXYWl0IiwidGltZVNpbmNlTGFzdENhbGwiLCJ0aW1lU2luY2VMYXN0SW52b2tlIiwic2hvdWxkSW52b2tlIiwidHJhaWxpbmdFZGdlIiwiY2FuY2VsIiwiZmx1c2giLCJkZWJvdW5jZWQiLCJpc0ludm9raW5nIiwidHlwZSIsImlzT2JqZWN0TGlrZSIsImlzU3ltYm9sIiwib3RoZXIiLCJ2YWx1ZU9mIiwiaXNCaW5hcnkiLCJ0ZXN0IiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInByb3BzIiwiZGVzY3JpcHRvciIsIkNvbnN0cnVjdG9yIiwicHJvdG9Qcm9wcyIsInN0YXRpY1Byb3BzIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJTZWFyY2hFbGVtZW50IiwiX3JlZiRoYW5kbGVTdWJtaXQiLCJfcmVmJHNlYXJjaExhYmVsIiwiX3JlZiRjbGFzc05hbWVzIiwiam9pbiIsInBsYWNlaG9sZGVyIiwib25JbnB1dCIsIm9uS2V5VXAiLCJvbktleVByZXNzIiwib25Gb2N1cyIsIm9uQmx1ciIsIl9lbGVtZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsIiRhd2FpdF8xIiwiaGFzRXJyb3IiLCJfZWxlbWVudHMyIiwiYm9keSIsImJsdXIiLCJzZXRRdWVyeSIsImVsZW1lbnQiLCJwYXJlbnQiLCJlbCIsImNsYXNzTmFtZSIsImNyZWF0ZVNjcmlwdEVsZW1lbnQiLCJ1cmwiLCJjYiIsInNldEF0dHJpYnV0ZSIsImpzb24iLCJhZGQiLCJBUlJPV19MRUZUX0tFWSIsIkFSUk9XX1JJR0hUX0tFWSIsImN4IiwiY2xhc3NuYW1lcyIsInRyaW0iLCJSZXN1bHRMaXN0IiwiX3JlZiRoYW5kbGVDbGljayIsIl9pbml0aWFsaXNlUHJvcHMiLCJyZXN1bHRJdGVtIiwiY2hpbGQiLCJjbG9uZU5vZGUiLCJmcm9tIiwiY2hpbGRyZW4iLCJsYXN0Q2hpbGQiLCJwYXJlbnROb2RlIiwiaGFzQXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlIiwiX3Byb3ZpZGVyMiIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiUHJvdmlkZXIiLCJfQmFzZVByb3ZpZGVyIiwiZW5kcG9pbnQiLCJwcm90b2NvbCIsImpzb25wIiwicGFyYW1zIiwicGFyYW1TdHJpbmciLCJnZXRQYXJhbVN0cmluZyIsInBhcnNlIiwicmVzb3VyY2VTZXRzIiwicmVzb3VyY2VzIiwicG9pbnQiLCJjb29yZGluYXRlcyIsImFkZHJlc3MiLCJmb3JtYXR0ZWRBZGRyZXNzIiwiYmJveCIsInJhdyIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlcXVlc3QiLCJmZXRjaCIsInRleHQiLCJsb2NhdGlvbnMiLCJmZWF0dXJlIiwiZ2VvbWV0cnkiLCJleHRlbnQiLCJ5bWluIiwieG1pbiIsInltYXgiLCJ4bWF4IiwicHJvdG8iLCJsbmciLCJsYXQiLCJmb3JtYXR0ZWRfYWRkcmVzcyIsInZpZXdwb3J0Iiwic291dGh3ZXN0Iiwibm9ydGhlYXN0IiwiZm9ybWF0IiwibG9uIiwiZGlzcGxheV9uYW1lIiwicGFyc2VGbG9hdCIsImJvdW5kaW5nYm94Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7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QU8sd0JBQ1IsR0FBRyxTQUNMO0tBQUcsVUFBVSxxQkFDWCxHQUFHLFNBQ0w7OztBQUVELFVBQVMsOEJBQThCLEdBQ3RDO0tBQUcsTUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVELFVBQVMsaUNBQWtDLEdBQzFDO0tBQUcsTUFDSDtNQUFJLFVBQVUsR0FBRyxPQUNqQjtNQUFJLFNBQVMsUUFBUSxRQUNyQjtVQUFRLFFBQVEsZ0JBQWdCLENBQ2hDO1VBQVEsUUFBUSxrQkFDZjtBQUFELHFCQUFXLGVBQWUsRUFBQyxLQUMzQjs4Q0FBNEMsQ0FBQyxTQUFTLFNBQ3REOzs7QUFFRCxVQUFTLDJDQUNSO0tBQUcsUUFBUTtrQkFFVjtnQkFDQTtlQUNBO21CQUVEO0FBTEM7OztBQU9GLFVBQVMsNENBQTZDLFFBQ3JEO0tBQUcsUUFBUTtrQkFFVjtnQkFDQTtlQUFZLGtCQUNaO21CQUVEO0FBTEM7Ozs7Ozs7QUN2Q0YsMEMiLCJmaWxlIjoiaW5kZXhfYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzA2ZWI3ODFiNGJlOTA4NmY1MjYiLCJpbXBvcnQge1BhcnNlQ29uZmlnfSBmcm9tICcuL3BhcnNlcic7XG5pbXBvcnQgQ3JlYXRlU2VhcmNoIGZyb20gJy4vc2VhcmNoJztcbmltcG9ydCB7U2V0dXBQYW5lbH0gZnJvbSAnLi9wYW5lbCc7XG5pbXBvcnQge0NyZWF0ZUJhc2VMYXllcnN9IGZyb20gJy4vYmFzZWxheWVyJztcbmltcG9ydCB7U2V0dXBHcmFwaHMsIEhhbmRsZUdyYXBoVGFiQ2hhbmdlfSBmcm9tICcuL2dyYXBoJ1xuaW1wb3J0IHtCaW5kR3JhcGhFdmVudHN9IGZyb20gJy4vcG9pJztcbmltcG9ydCB7QmluZFRhYkV2ZW50cywgSGFuZGxlVGFiQ2hhbmdlfSBmcm9tICcuL3RhYnMnXG5pbXBvcnQge0NyZWF0ZU1hcH0gZnJvbSAnLi9tYXAnXG5pbXBvcnQge0JpbmRVcGRhdGVTaGFyZVVybCwgQWRkU2hhcmVTZXR0aW5nc1RvQ29uZmlnLCBCaW5kQ29weUxpbmtFdmVudHN9IGZyb20gJy4vc2hhcmUnXG5pbXBvcnQge0NyZWF0ZURlZmF1bHRMYXllcnN9IGZyb20gJy4vbGF5ZXInXG5pbXBvcnQgQ3JlYXRlTG9nbyBmcm9tICcuL2xvZ28nO1xuaW1wb3J0IHtTZXR1cFBvaW50c09mSW50ZXJlc3R9IGZyb20gJy4vcG9pJztcbmltcG9ydCB7dXBkYXRlU2hhcmVVcmx9IGZyb20gJy4vc2hhcmUnO1xuaW1wb3J0IEJpbmRNb2JpbGVNZW51RXZlbnRzIGZyb20gJy4vbW9iaWxlJztcbmltcG9ydCBCaW5kRGVza3RvcE1lbnVFdmVudHMgZnJvbSAnLi9wYW5lbFRvZ2dsZSc7XG5cbnZhciBjc3MgPSByZXF1aXJlKCcuLi9jc3Mvc2Fzcy9sYW5kYXQuc2NzcycpXG5cbi8vIERvZXMgbm90IHJlbHkgb24gbWFwIG9iamVjdCBvciBjb25maWcgZmlsZVxudmFyIEJhc2UgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG5cdFBhcnNlQ29uZmlnKGNvbmZpZywgY2FsbGJhY2spO1xuXHRTZXR1cEdyYXBocygpO1xuXHRCaW5kVGFiRXZlbnRzKCk7XG5cdEJpbmRDb3B5TGlua0V2ZW50cygpO1xuXHRCaW5kTW9iaWxlTWVudUV2ZW50cygpO1xuXHRCaW5kRGVza3RvcE1lbnVFdmVudHMoKTtcbn1cblxuLy8gRG9lcyByZWx5IG9uIG1hcCBvYmplY3Qgb3IgY29uZmlnIGZpbGVcbnZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdEFkZFNoYXJlU2V0dGluZ3NUb0NvbmZpZyhkYXRhKVxuXHR2YXIgbWFwID0gQ3JlYXRlTWFwKGRhdGEubWFwKTtcblx0Q3JlYXRlQmFzZUxheWVycyhtYXAsIGRhdGEuYmFzZWxheWVycyk7XG5cdENyZWF0ZURlZmF1bHRMYXllcnMoZGF0YS5sYXllcnMsIGRhdGFbXCJhY3RpdmUtbGF5ZXJzXCJdKTtcblx0U2V0dXBQYW5lbChkYXRhLmxheWVycywgZGF0YS5sYXlvdXQpO1xuXHRDcmVhdGVTZWFyY2gobWFwKTtcblx0Q3JlYXRlTG9nbyhkYXRhLmxvZ28pO1xuXHRpZiAoZGF0YS50YWIpIEhhbmRsZVRhYkNoYW5nZShkYXRhLnRhYik7XG5cdGlmIChkYXRhLmdyYXBoKSBIYW5kbGVHcmFwaFRhYkNoYW5nZShkYXRhLmdyYXBoKTtcblx0QmluZEdyYXBoRXZlbnRzKG1hcCk7XG5cdEJpbmRVcGRhdGVTaGFyZVVybChtYXApO1xuXHRTZXR1cFBvaW50c09mSW50ZXJlc3QobWFwLCBkYXRhLnBvaXMpXG5cdHVwZGF0ZVNoYXJlVXJsKClcbn1cblxud2luZG93LkJhc2UgPSBCYXNlO1xuXG5leHBvcnQgZGVmYXVsdCB7QmFzZX07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9iYXNlLmpzIiwiLyoqXG4gKiBQYXJzZXMgYSBjb25maWcgZmlsZS4gU2luY2UgdGhlIHByb2Nlc3MgdG8gZ2V0IGV4dGVybmFsIGZpbGVzXG4gKiB1c2VzIEFKQVggeW91IG5lZWQgdG8gcGFzcyBhIGNhbGxiYWNrIHRvIGhhbmRsZSB0aGUgbmV4dCBzdGVwc1xuICogb2YgdXNpbmcgdGhlIGNvbmZpZyBmaWxlLCBzaW5jZSB3ZSBkbyBub3Qga25vdyBob3cgbG9uZyBpdFxuICogd2lsbCB0YWtlIHRvIGdyYWIgdGhlIGZpbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBQYXJzZUNvbmZpZyAoY29uZmlnRmlsZSwgY2FsbGJhY2spIHtcblx0R2V0Q29uZmlnKGNvbmZpZ0ZpbGUsIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEdldEFqYXhPYmplY3QocmVzcG9uc2VIYW5kbGVyKSB7XG5cdHZhciB4bWxodHRwXG5cdGlmICghd2luZG93LlhNTEh0dHBSZXF1ZXN0ICYmIHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XG5cdFx0eG1saHR0cCA9IG5ldyB3aW5kb3cuQWN0aXZlWE9iamVjdChcIk1TWE1MMi5YTUxIVFRQLjMuMFwiKVxuXHR9IGVsc2Uge1xuXHRcdHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXHR9XG5cdHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdHJlc3BvbnNlSGFuZGxlcih4bWxodHRwLnJlc3BvbnNlKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4geG1saHR0cFxufVxuXG5mdW5jdGlvbiBHZXRDb25maWcgKGNvbmZpZ0ZpbGUsIGNhbGxiYWNrKSB7XG5cdHZhciB4bWxodHRwID0gR2V0QWpheE9iamVjdChmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHR2YXIgZGF0YSA9IHJlc3BvbnNlSGFuZGxlcihyZXNwb25zZSlcblx0XHRjYWxsYmFjayhkYXRhKVxuXHR9KVxuXHR4bWxodHRwLm9wZW4oXCJHRVRcIiwgY29uZmlnRmlsZSwgdHJ1ZSk7XG5cdHhtbGh0dHAuc2VuZCgpO1xuXHRjb25zb2xlLmxvZyhcImhpXCIpXG59XG5cbmZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlciAocmVzcG9uc2UpIHtcblx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuXHRmb3JtYXRNYXAocmVzcG9uc2UpO1xuXHRmb3JtYXRMYXllcnMocmVzcG9uc2UpO1xuXHRyZXR1cm4gcmVzcG9uc2Vcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWFwIChkYXRhKSB7XG5cdGlmICghZGF0YS5tYXApIGRhdGEubWFwID0ge307XG59XG5cbmZ1bmN0aW9uIGZvcm1hdExheWVycyAoZGF0YSkge1xuXHR2YXIgbGF5ZXJzID0gZGF0YS5sYXllcnM7XG5cdHZhciBkZWZhdWx0TWFwc2VydmVyVXJsID0gZGF0YS5tYXBzZXJ2ZXJVcmw7XG5cdHZhciBkZWZhdWx0RW5hYmxlZExheWVycyA9IGRhdGFbXCJhY3RpdmUtbGF5ZXJzXCJdO1xuXHR2YXIgbGF5ZXJncm91cDtcblx0dmFyIGk7XG5cblx0Zm9yICh2YXIgcHJvcCBpbiBsYXllcnMpIHtcblx0XHRpZiAoIWxheWVycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgcmV0dXJuO1xuXHRcdGxheWVyZ3JvdXAgPSBsYXllcnNbcHJvcF07XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxheWVyZ3JvdXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNldE1hcHNlcnZlclVybChsYXllcmdyb3VwW2ldLCBkZWZhdWx0TWFwc2VydmVyVXJsKTtcblx0XHRcdHNldERlZmF1bHRMYXllck9wYWNpdHkobGF5ZXJncm91cFtpXSwgZGF0YS5kZWZhdWx0TGF5ZXJPcGFjaXR5KVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBzZXREZWZhdWx0TGF5ZXJPcGFjaXR5IChsYXllciwgb3BhY2l0eSkge1xuXHRsYXllci5vcGFjaXR5ID0gbGF5ZXIub3BhY2l0eSB8fCBvcGFjaXR5XG59XG5cbmZ1bmN0aW9uIHNldE1hcHNlcnZlclVybCAobGF5ZXIsIHVybCkge1xuXHRsYXllci51cmwgPSBsYXllci51cmwgfHwgdXJsO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvcGFyc2VyLmpzIiwiaW1wb3J0IHsgR2VvU2VhcmNoQ29udHJvbCwgT3BlblN0cmVldE1hcFByb3ZpZGVyIH0gZnJvbSAnbGVhZmxldC1nZW9zZWFyY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDcmVhdGVTZWFyY2ggKG1hcCkge1xuXHRjb25zdCBwcm92aWRlciA9IG5ldyBPcGVuU3RyZWV0TWFwUHJvdmlkZXIoKTtcblxuXHRjb25zdCBzZWFyY2hDb250cm9sID0gbmV3IEdlb1NlYXJjaENvbnRyb2woe1xuXHRcdHByb3ZpZGVyOiBwcm92aWRlcixcblx0XHRzaG93TWFya2VyOiBmYWxzZSxcblx0XHRhdXRvQ29tcGxldGU6IHRydWUsXG5cdFx0c2hvd1BvcHVwOiBmYWxzZSxcblx0fSk7XG5cblx0bWFwLmFkZENvbnRyb2woc2VhcmNoQ29udHJvbCk7XG5cblx0dmFyIHNlYXJjaEVsZW1lbnRzID0gc2VhcmNoQ29udHJvbC5zZWFyY2hFbGVtZW50LmVsZW1lbnRzXG5cblx0TC5Eb21FdmVudC5vbihzZWFyY2hFbGVtZW50cy5jb250YWluZXIsIFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XG5cdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZXYpO1xuXG5cdFx0dmFyIHNlYXJjaEVudHJpZXMgPSBzZWFyY2hFbGVtZW50cy5mb3JtXG5cdFx0XHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVzdWx0cycpWzBdLmNoaWxkcmVuXG5cblx0XHRmb3IgKHZhciBpPTA7IGk8c2VhcmNoRW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGV2LnRhcmdldCA9PT0gc2VhcmNoRW50cmllc1tpXSkge1xuXHRcdFx0XHRzZWFyY2hFbGVtZW50cy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyBmb3Igc2VhcmNoIGJ5IGFkZHJlc3Ncblx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdtYXAnLFxuXHRcdFx0ZXZlbnRBY3Rpb246ICdzZWFyY2gnLFxuXHRcdFx0ZXZlbnRMYWJlbDogJ2NsaWNrJyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXG5cdH0pO1xuXG5cdEwuRG9tRXZlbnQub24oc2VhcmNoRWxlbWVudHMuY29udGFpbmVyLCBcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2KSB7XG5cdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZXYpO1xuXG5cdFx0aWYgKGV2LndoaWNoID09IDEzIHx8IGV2LmtleUNvZGUgPT0gMTMpIHtcblx0XHRcdHNlYXJjaEVsZW1lbnRzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG5cdFx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyBmb3Igc2VhY3JjaCBieSBhZGRyZXNzXG5cdFx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0XHRcdGV2ZW50QWN0aW9uOiAnc2VhcmNoIGFkZHJlc3MnLFxuXHRcdFx0XHRldmVudExhYmVsOiBldi50YXJnZXQudmFsdWUsXG5cdFx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvc2VhcmNoLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xlYWZsZXRDb250cm9sID0gcmVxdWlyZSgnLi9sZWFmbGV0Q29udHJvbCcpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0dlb1NlYXJjaENvbnRyb2wnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sZWFmbGV0Q29udHJvbCkuZGVmYXVsdDtcbiAgfVxufSk7XG5cbnZhciBfc2VhcmNoRWxlbWVudCA9IHJlcXVpcmUoJy4vc2VhcmNoRWxlbWVudCcpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1NlYXJjaEVsZW1lbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZWFyY2hFbGVtZW50KS5kZWZhdWx0O1xuICB9XG59KTtcblxudmFyIF9iaW5nUHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVycy9iaW5nUHJvdmlkZXInKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdCaW5nUHJvdmlkZXInLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9iaW5nUHJvdmlkZXIpLmRlZmF1bHQ7XG4gIH1cbn0pO1xuXG52YXIgX2VzcmlQcm92aWRlciA9IHJlcXVpcmUoJy4vcHJvdmlkZXJzL2VzcmlQcm92aWRlcicpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0VzcmlQcm92aWRlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VzcmlQcm92aWRlcikuZGVmYXVsdDtcbiAgfVxufSk7XG5cbnZhciBfZ29vZ2xlUHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVycy9nb29nbGVQcm92aWRlcicpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0dvb2dsZVByb3ZpZGVyJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ29vZ2xlUHJvdmlkZXIpLmRlZmF1bHQ7XG4gIH1cbn0pO1xuXG52YXIgX29wZW5TdHJlZXRNYXBQcm92aWRlciA9IHJlcXVpcmUoJy4vcHJvdmlkZXJzL29wZW5TdHJlZXRNYXBQcm92aWRlcicpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ09wZW5TdHJlZXRNYXBQcm92aWRlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29wZW5TdHJlZXRNYXBQcm92aWRlcikuZGVmYXVsdDtcbiAgfVxufSk7XG5cbnZhciBfcHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVycy9wcm92aWRlcicpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1Byb3ZpZGVyJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvdmlkZXIpLmRlZmF1bHQ7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL2luZGV4LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX25vZGVudFJ1bnRpbWUgPSByZXF1aXJlKCdub2RlbnQtcnVudGltZScpO1xuXG52YXIgX25vZGVudFJ1bnRpbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZW50UnVudGltZSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IExlYWZsZXRDb250cm9sO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaC5kZWJvdW5jZScpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX3NlYXJjaEVsZW1lbnQgPSByZXF1aXJlKCcuL3NlYXJjaEVsZW1lbnQnKTtcblxudmFyIF9zZWFyY2hFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NlYXJjaEVsZW1lbnQpO1xuXG52YXIgX3Jlc3VsdExpc3QgPSByZXF1aXJlKCcuL3Jlc3VsdExpc3QnKTtcblxudmFyIF9yZXN1bHRMaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Jlc3VsdExpc3QpO1xuXG52YXIgX2RvbVV0aWxzID0gcmVxdWlyZSgnLi9kb21VdGlscycpO1xuXG52YXIgX2NvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IGZ1bmN0aW9uIGRlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAgc3R5bGU6ICdidXR0b24nLFxuICAgIHNob3dNYXJrZXI6IHRydWUsXG4gICAgc2hvd1BvcHVwOiBmYWxzZSxcbiAgICBwb3B1cEZvcm1hdDogZnVuY3Rpb24gcG9wdXBGb3JtYXQoX3JlZikge1xuICAgICAgdmFyIHJlc3VsdCA9IF9yZWYucmVzdWx0O1xuICAgICAgcmV0dXJuICcnICsgcmVzdWx0LmxhYmVsO1xuICAgIH0sXG4gICAgbWFya2VyOiB7XG4gICAgICBpY29uOiBuZXcgTC5JY29uLkRlZmF1bHQoKSxcbiAgICAgIGRyYWdnYWJsZTogZmFsc2VcbiAgICB9LFxuICAgIG1heE1hcmtlcnM6IDEsXG4gICAgcmV0YWluWm9vbUxldmVsOiBmYWxzZSxcbiAgICBhbmltYXRlWm9vbTogdHJ1ZSxcbiAgICBzZWFyY2hMYWJlbDogJ0VudGVyIGFkZHJlc3MnLFxuICAgIG5vdEZvdW5kTWVzc2FnZTogJ1NvcnJ5LCB0aGF0IGFkZHJlc3MgY291bGQgbm90IGJlIGZvdW5kLicsXG4gICAgbWVzc2FnZUhpZGVEZWxheTogMzAwMCxcbiAgICB6b29tTGV2ZWw6IDE4LFxuICAgIGNsYXNzTmFtZXM6IHtcbiAgICAgIGNvbnRhaW5lcjogJ2xlYWZsZXQtYmFyIGxlYWZsZXQtY29udHJvbCBsZWFmbGV0LWNvbnRyb2wtZ2Vvc2VhcmNoJyxcbiAgICAgIGJ1dHRvbjogJ2xlYWZsZXQtYmFyLXBhcnQgbGVhZmxldC1iYXItcGFydC1zaW5nbGUnLFxuICAgICAgcmVzZXRCdXR0b246ICdyZXNldCcsXG4gICAgICBtc2dib3g6ICdsZWFmbGV0LWJhciBtZXNzYWdlJyxcbiAgICAgIGZvcm06ICcnLFxuICAgICAgaW5wdXQ6ICcnXG4gICAgfSxcbiAgICBhdXRvQ29tcGxldGU6IHRydWUsXG4gICAgYXV0b0NvbXBsZXRlRGVsYXk6IDI1MCxcbiAgICBhdXRvQ2xvc2U6IGZhbHNlLFxuICAgIGtlZXBSZXN1bHQ6IGZhbHNlXG4gIH07XG59O1xuXG52YXIgd2FzSGFuZGxlckVuYWJsZWQgPSB7fTtcbnZhciBtYXBIYW5kbGVycyA9IFsnZHJhZ2dpbmcnLCAndG91Y2hab29tJywgJ2RvdWJsZUNsaWNrWm9vbScsICdzY3JvbGxXaGVlbFpvb20nLCAnYm94Wm9vbScsICdrZXlib2FyZCddO1xuXG52YXIgQ29udHJvbCA9IHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gaW5pdGlhbGl6ZShvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMubWFya2VycyA9IG5ldyBMLkZlYXR1cmVHcm91cCgpO1xuICAgIHRoaXMuaGFuZGxlcnNEaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpO1xuXG4gICAgdmFyIF9vcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBzdHlsZSA9IF9vcHRpb25zLnN0eWxlLFxuICAgICAgICBjbGFzc05hbWVzID0gX29wdGlvbnMuY2xhc3NOYW1lcyxcbiAgICAgICAgc2VhcmNoTGFiZWwgPSBfb3B0aW9ucy5zZWFyY2hMYWJlbCxcbiAgICAgICAgYXV0b0NvbXBsZXRlID0gX29wdGlvbnMuYXV0b0NvbXBsZXRlLFxuICAgICAgICBhdXRvQ29tcGxldGVEZWxheSA9IF9vcHRpb25zLmF1dG9Db21wbGV0ZURlbGF5O1xuXG4gICAgaWYgKHN0eWxlICE9PSAnYnV0dG9uJykge1xuICAgICAgdGhpcy5vcHRpb25zLmNsYXNzTmFtZXMuY29udGFpbmVyICs9ICcgJyArIG9wdGlvbnMuc3R5bGU7XG4gICAgfVxuXG4gICAgdGhpcy5zZWFyY2hFbGVtZW50ID0gbmV3IF9zZWFyY2hFbGVtZW50Mi5kZWZhdWx0KF9leHRlbmRzKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gaGFuZGxlU3VibWl0KHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5vblN1Ym1pdChxdWVyeSk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdmFyIF9zZWFyY2hFbGVtZW50JGVsZW1lbiA9IHRoaXMuc2VhcmNoRWxlbWVudC5lbGVtZW50cyxcbiAgICAgICAgY29udGFpbmVyID0gX3NlYXJjaEVsZW1lbnQkZWxlbWVuLmNvbnRhaW5lcixcbiAgICAgICAgZm9ybSA9IF9zZWFyY2hFbGVtZW50JGVsZW1lbi5mb3JtLFxuICAgICAgICBpbnB1dCA9IF9zZWFyY2hFbGVtZW50JGVsZW1lbi5pbnB1dDtcblxuXG4gICAgdmFyIGJ1dHRvbiA9ICgwLCBfZG9tVXRpbHMuY3JlYXRlRWxlbWVudCkoJ2EnLCBjbGFzc05hbWVzLmJ1dHRvbiwgY29udGFpbmVyKTtcbiAgICBidXR0b24udGl0bGUgPSBzZWFyY2hMYWJlbDtcbiAgICBidXR0b24uaHJlZiA9ICcjJztcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBfdGhpcy5vbkNsaWNrKGUpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciByZXNldEJ1dHRvbiA9ICgwLCBfZG9tVXRpbHMuY3JlYXRlRWxlbWVudCkoJ2EnLCBjbGFzc05hbWVzLnJlc2V0QnV0dG9uLCBmb3JtKTtcbiAgICByZXNldEJ1dHRvbi5pbm5lckhUTUwgPSAnWCc7XG4gICAgYnV0dG9uLmhyZWYgPSAnIyc7XG4gICAgcmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5jbGVhclJlc3VsdHMobnVsbCwgdHJ1ZSk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgaWYgKGF1dG9Db21wbGV0ZSkge1xuICAgICAgdGhpcy5yZXN1bHRMaXN0ID0gbmV3IF9yZXN1bHRMaXN0Mi5kZWZhdWx0KHtcbiAgICAgICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKF9yZWYyKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IF9yZWYyLnJlc3VsdDtcblxuICAgICAgICAgIGlucHV0LnZhbHVlID0gcmVzdWx0LmxhYmVsO1xuICAgICAgICAgIF90aGlzLm9uU3VibWl0KHsgcXVlcnk6IHJlc3VsdC5sYWJlbCB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGZvcm0uYXBwZW5kQ2hpbGQodGhpcy5yZXN1bHRMaXN0LmVsZW1lbnRzLmNvbnRhaW5lcik7XG5cbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKDAsIF9sb2Rhc2gyLmRlZmF1bHQpKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5hdXRvU2VhcmNoKGUpO1xuICAgICAgfSwgYXV0b0NvbXBsZXRlRGVsYXkpLCB0cnVlKTtcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuc2VsZWN0UmVzdWx0KGUpO1xuICAgICAgfSwgdHJ1ZSk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmNsZWFyUmVzdWx0cyhlLCB0cnVlKTtcbiAgICAgIH0sIHRydWUpO1xuICAgIH1cblxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICByZXR1cm4gX3RoaXMuZGlzYWJsZUhhbmRsZXJzKGUpO1xuICAgIH0sIHRydWUpO1xuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICByZXR1cm4gX3RoaXMucmVzdG9yZUhhbmRsZXJzKGUpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgdGhpcy5lbGVtZW50cyA9IHsgYnV0dG9uOiBidXR0b24sIHJlc2V0QnV0dG9uOiByZXNldEJ1dHRvbiB9O1xuICB9LFxuICBvbkFkZDogZnVuY3Rpb24gb25BZGQobWFwKSB7XG4gICAgdmFyIF9vcHRpb25zMiA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgc2hvd01hcmtlciA9IF9vcHRpb25zMi5zaG93TWFya2VyLFxuICAgICAgICBzdHlsZSA9IF9vcHRpb25zMi5zdHlsZTtcblxuXG4gICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgaWYgKHNob3dNYXJrZXIpIHtcbiAgICAgIHRoaXMubWFya2Vycy5hZGRUbyhtYXApO1xuICAgIH1cblxuICAgIGlmIChzdHlsZSA9PT0gJ2JhcicpIHtcbiAgICAgIHZhciBmb3JtID0gdGhpcy5zZWFyY2hFbGVtZW50LmVsZW1lbnRzLmZvcm07XG5cbiAgICAgIHZhciByb290ID0gbWFwLmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoJy5sZWFmbGV0LWNvbnRyb2wtY29udGFpbmVyJyk7XG5cbiAgICAgIHZhciBjb250YWluZXIgPSAoMCwgX2RvbVV0aWxzLmNyZWF0ZUVsZW1lbnQpKCdkaXYnLCAnbGVhZmxldC1jb250cm9sLWdlb3NlYXJjaCBiYXInKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIHRoaXMuZWxlbWVudHMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlYXJjaEVsZW1lbnQuZWxlbWVudHMuY29udGFpbmVyO1xuICB9LFxuICBvblJlbW92ZTogZnVuY3Rpb24gb25SZW1vdmUoKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudHMuY29udGFpbmVyO1xuXG4gICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgY29udGFpbmVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBfc2VhcmNoRWxlbWVudCRlbGVtZW4yID0gdGhpcy5zZWFyY2hFbGVtZW50LmVsZW1lbnRzLFxuICAgICAgICBjb250YWluZXIgPSBfc2VhcmNoRWxlbWVudCRlbGVtZW4yLmNvbnRhaW5lcixcbiAgICAgICAgaW5wdXQgPSBfc2VhcmNoRWxlbWVudCRlbGVtZW4yLmlucHV0O1xuXG5cbiAgICBpZiAoY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKShjb250YWluZXIsICdhY3RpdmUnKTtcbiAgICAgIHRoaXMuY2xlYXJSZXN1bHRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICgwLCBfZG9tVXRpbHMuYWRkQ2xhc3NOYW1lKShjb250YWluZXIsICdhY3RpdmUnKTtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgfVxuICB9LFxuICBkaXNhYmxlSGFuZGxlcnM6IGZ1bmN0aW9uIGRpc2FibGVIYW5kbGVycyhlKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgZm9ybSA9IHRoaXMuc2VhcmNoRWxlbWVudC5lbGVtZW50cy5mb3JtO1xuXG5cbiAgICBpZiAodGhpcy5oYW5kbGVyc0Rpc2FibGVkIHx8IGUgJiYgZS50YXJnZXQgIT09IGZvcm0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZXJzRGlzYWJsZWQgPSB0cnVlO1xuICAgIG1hcEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgIGlmIChfdGhpczIubWFwW2hhbmRsZXJdKSB7XG4gICAgICAgIHdhc0hhbmRsZXJFbmFibGVkW2hhbmRsZXJdID0gX3RoaXMyLm1hcFtoYW5kbGVyXS5lbmFibGVkKCk7XG4gICAgICAgIF90aGlzMi5tYXBbaGFuZGxlcl0uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICByZXN0b3JlSGFuZGxlcnM6IGZ1bmN0aW9uIHJlc3RvcmVIYW5kbGVycyhlKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB2YXIgZm9ybSA9IHRoaXMuc2VhcmNoRWxlbWVudC5lbGVtZW50cy5mb3JtO1xuXG5cbiAgICBpZiAoIXRoaXMuaGFuZGxlcnNEaXNhYmxlZCB8fCBlICYmIGUudGFyZ2V0ICE9PSBmb3JtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVyc0Rpc2FibGVkID0gZmFsc2U7XG4gICAgbWFwSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgaWYgKHdhc0hhbmRsZXJFbmFibGVkW2hhbmRsZXJdKSB7XG4gICAgICAgIF90aGlzMy5tYXBbaGFuZGxlcl0uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHNlbGVjdFJlc3VsdDogZnVuY3Rpb24gc2VsZWN0UmVzdWx0KGV2ZW50KSB7XG4gICAgaWYgKCFbX2NvbnN0YW50cy5FTlRFUl9LRVksIF9jb25zdGFudHMuQVJST1dfRE9XTl9LRVksIF9jb25zdGFudHMuQVJST1dfVVBfS0VZXS5pbmNsdWRlcyhldmVudC5rZXlDb2RlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaW5wdXQgPSB0aGlzLnNlYXJjaEVsZW1lbnQuZWxlbWVudHMuaW5wdXQ7XG5cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBfY29uc3RhbnRzLkVOVEVSX0tFWSkge1xuICAgICAgdGhpcy5vblN1Ym1pdCh7IHF1ZXJ5OiBpbnB1dC52YWx1ZSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbGlzdCA9IHRoaXMucmVzdWx0TGlzdDtcbiAgICB2YXIgbWF4ID0gbGlzdC5jb3VudCgpIC0gMTtcbiAgICBpZiAobWF4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgdmFyIG5leHQgPSBldmVudC5jb2RlID09PSAnQXJyb3dEb3duJyA/IH5+bGlzdC5zZWxlY3RlZCArIDEgOiB+fmxpc3Quc2VsZWN0ZWQgLSAxO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxuICAgIHZhciBpZHggPSBuZXh0IDwgMCA/IG1heCA6IG5leHQgPiBtYXggPyAwIDogbmV4dDtcblxuICAgIHZhciBpdGVtID0gbGlzdC5zZWxlY3QoaWR4KTtcbiAgICBpbnB1dC52YWx1ZSA9IGl0ZW0ubGFiZWw7XG4gIH0sXG4gIGNsZWFyUmVzdWx0czogZnVuY3Rpb24gY2xlYXJSZXN1bHRzKGV2ZW50KSB7XG4gICAgdmFyIGZvcmNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcblxuICAgIGlmIChldmVudCAmJiBldmVudC5rZXlDb2RlICE9PSBfY29uc3RhbnRzLkVTQ0FQRV9LRVkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW5wdXQgPSB0aGlzLnNlYXJjaEVsZW1lbnQuZWxlbWVudHMuaW5wdXQ7XG4gICAgdmFyIF9vcHRpb25zMyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAga2VlcFJlc3VsdCA9IF9vcHRpb25zMy5rZWVwUmVzdWx0LFxuICAgICAgICBhdXRvQ29tcGxldGUgPSBfb3B0aW9uczMuYXV0b0NvbXBsZXRlO1xuXG5cbiAgICBpZiAoZm9yY2UgfHwgIWtlZXBSZXN1bHQpIHtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICB0aGlzLm1hcmtlcnMuY2xlYXJMYXllcnMoKTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b0NvbXBsZXRlKSB7XG4gICAgICB0aGlzLnJlc3VsdExpc3QuY2xlYXIoKTtcbiAgICB9XG4gIH0sXG4gIGF1dG9TZWFyY2g6IGZ1bmN0aW9uIGF1dG9TZWFyY2goZXZlbnQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCRyZXR1cm4sICRlcnJvcikge1xuICAgICAgdmFyIHF1ZXJ5LCBwcm92aWRlciwgcmVzdWx0cztcblxuICAgICAgaWYgKF9jb25zdGFudHMuU1BFQ0lBTF9LRVlTLmluY2x1ZGVzKGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICAgIHJldHVybiAkcmV0dXJuKCk7XG4gICAgICB9XG5cbiAgICAgIHF1ZXJ5ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgcHJvdmlkZXIgPSB0aGlzLm9wdGlvbnMucHJvdmlkZXI7XG5cblxuICAgICAgaWYgKHF1ZXJ5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcHJvdmlkZXIuc2VhcmNoKHsgcXVlcnk6IHF1ZXJ5IH0pLnRoZW4oZnVuY3Rpb24gKCRhd2FpdF8yKSB7XG4gICAgICAgICAgcmVzdWx0cyA9ICRhd2FpdF8yO1xuICAgICAgICAgIHRoaXMucmVzdWx0TGlzdC5yZW5kZXIocmVzdWx0cyk7XG4gICAgICAgICAgcmV0dXJuICRJZl8xLmNhbGwodGhpcyk7XG4gICAgICAgIH0uJGFzeW5jYmluZCh0aGlzLCAkZXJyb3IpLCAkZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXN1bHRMaXN0LmNsZWFyKCk7XG4gICAgICAgIHJldHVybiAkSWZfMS5jYWxsKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiAkSWZfMSgpIHtcbiAgICAgICAgcmV0dXJuICRyZXR1cm4oKTtcbiAgICAgIH1cbiAgICB9LiRhc3luY2JpbmQodGhpcykpO1xuICB9LFxuICBvblN1Ym1pdDogZnVuY3Rpb24gb25TdWJtaXQocXVlcnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCRyZXR1cm4sICRlcnJvcikge1xuICAgICAgdmFyIHByb3ZpZGVyLCByZXN1bHRzO1xuICAgICAgcHJvdmlkZXIgPSB0aGlzLm9wdGlvbnMucHJvdmlkZXI7XG4gICAgICByZXR1cm4gcHJvdmlkZXIuc2VhcmNoKHF1ZXJ5KS50aGVuKGZ1bmN0aW9uICgkYXdhaXRfMykge1xuXG4gICAgICAgIHJlc3VsdHMgPSAkYXdhaXRfMztcblxuICAgICAgICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLnNob3dSZXN1bHQocmVzdWx0c1swXSwgcXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkcmV0dXJuKCk7XG4gICAgICB9LiRhc3luY2JpbmQodGhpcywgJGVycm9yKSwgJGVycm9yKTtcbiAgICB9LiRhc3luY2JpbmQodGhpcykpO1xuICB9LFxuICBzaG93UmVzdWx0OiBmdW5jdGlvbiBzaG93UmVzdWx0KHJlc3VsdCwgX3JlZjMpIHtcbiAgICB2YXIgcXVlcnkgPSBfcmVmMy5xdWVyeTtcbiAgICB2YXIgYXV0b0Nsb3NlID0gdGhpcy5vcHRpb25zLmF1dG9DbG9zZTtcblxuXG4gICAgdmFyIG1hcmtlcnMgPSBPYmplY3Qua2V5cyh0aGlzLm1hcmtlcnMuX2xheWVycyk7XG4gICAgaWYgKG1hcmtlcnMubGVuZ3RoID49IHRoaXMub3B0aW9ucy5tYXhNYXJrZXJzKSB7XG4gICAgICB0aGlzLm1hcmtlcnMucmVtb3ZlTGF5ZXIobWFya2Vyc1swXSk7XG4gICAgfVxuXG4gICAgdmFyIG1hcmtlciA9IHRoaXMuYWRkTWFya2VyKHJlc3VsdCwgcXVlcnkpO1xuICAgIHRoaXMuY2VudGVyTWFwKHJlc3VsdCk7XG5cbiAgICB0aGlzLm1hcC5maXJlRXZlbnQoJ2dlb3NlYXJjaC9zaG93bG9jYXRpb24nLCB7XG4gICAgICBsb2NhdGlvbjogcmVzdWx0LFxuICAgICAgbWFya2VyOiBtYXJrZXJcbiAgICB9KTtcblxuICAgIGlmIChhdXRvQ2xvc2UpIHtcbiAgICAgIHRoaXMuY2xvc2VSZXN1bHRzKCk7XG4gICAgfVxuICB9LFxuICBjbG9zZVJlc3VsdHM6IGZ1bmN0aW9uIGNsb3NlUmVzdWx0cygpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5zZWFyY2hFbGVtZW50LmVsZW1lbnRzLmNvbnRhaW5lcjtcblxuXG4gICAgaWYgKGNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAoMCwgX2RvbVV0aWxzLnJlbW92ZUNsYXNzTmFtZSkoY29udGFpbmVyLCAnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXN0b3JlSGFuZGxlcnMoKTtcbiAgICB0aGlzLmNsZWFyUmVzdWx0cygpO1xuICB9LFxuICBhZGRNYXJrZXI6IGZ1bmN0aW9uIGFkZE1hcmtlcihyZXN1bHQsIHF1ZXJ5KSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIgX29wdGlvbnM0ID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBvcHRpb25zID0gX29wdGlvbnM0Lm1hcmtlcixcbiAgICAgICAgc2hvd1BvcHVwID0gX29wdGlvbnM0LnNob3dQb3B1cCxcbiAgICAgICAgcG9wdXBGb3JtYXQgPSBfb3B0aW9uczQucG9wdXBGb3JtYXQ7XG5cbiAgICB2YXIgbWFya2VyID0gbmV3IEwuTWFya2VyKFtyZXN1bHQueSwgcmVzdWx0LnhdLCBvcHRpb25zKTtcbiAgICB2YXIgcG9wdXBMYWJlbCA9IHJlc3VsdC5sYWJlbDtcblxuICAgIGlmICh0eXBlb2YgcG9wdXBGb3JtYXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBvcHVwTGFiZWwgPSBwb3B1cEZvcm1hdCh7IHF1ZXJ5OiBxdWVyeSwgcmVzdWx0OiByZXN1bHQgfSk7XG4gICAgfVxuXG4gICAgbWFya2VyLmJpbmRQb3B1cChwb3B1cExhYmVsKTtcblxuICAgIHRoaXMubWFya2Vycy5hZGRMYXllcihtYXJrZXIpO1xuXG4gICAgaWYgKHNob3dQb3B1cCkge1xuICAgICAgbWFya2VyLm9wZW5Qb3B1cCgpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRyYWdnYWJsZSkge1xuICAgICAgbWFya2VyLm9uKCdkcmFnZW5kJywgZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgX3RoaXM0Lm1hcC5maXJlRXZlbnQoJ2dlb3NlYXJjaC9tYXJrZXIvZHJhZ2VuZCcsIHtcbiAgICAgICAgICBsb2NhdGlvbjogbWFya2VyLmdldExhdExuZygpLFxuICAgICAgICAgIGV2ZW50OiBhcmdzXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfSxcbiAgY2VudGVyTWFwOiBmdW5jdGlvbiBjZW50ZXJNYXAocmVzdWx0KSB7XG4gICAgdmFyIF9vcHRpb25zNSA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgcmV0YWluWm9vbUxldmVsID0gX29wdGlvbnM1LnJldGFpblpvb21MZXZlbCxcbiAgICAgICAgYW5pbWF0ZVpvb20gPSBfb3B0aW9uczUuYW5pbWF0ZVpvb207XG5cblxuICAgIHZhciByZXN1bHRCb3VuZHMgPSBuZXcgTC5MYXRMbmdCb3VuZHMocmVzdWx0LmJvdW5kcyk7XG4gICAgdmFyIGJvdW5kcyA9IHJlc3VsdEJvdW5kcy5pc1ZhbGlkKCkgPyByZXN1bHRCb3VuZHMgOiB0aGlzLm1hcmtlcnMuZ2V0Qm91bmRzKCk7XG5cbiAgICBpZiAoIXJldGFpblpvb21MZXZlbCAmJiByZXN1bHRCb3VuZHMuaXNWYWxpZCgpKSB7XG4gICAgICB0aGlzLm1hcC5maXRCb3VuZHMoYm91bmRzLCB7IGFuaW1hdGU6IGFuaW1hdGVab29tIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hcC5zZXRWaWV3KGJvdW5kcy5nZXRDZW50ZXIoKSwgdGhpcy5nZXRab29tKCksIHsgYW5pbWF0ZTogYW5pbWF0ZVpvb20gfSk7XG4gICAgfVxuICB9LFxuICBnZXRab29tOiBmdW5jdGlvbiBnZXRab29tKCkge1xuICAgIHZhciBfb3B0aW9uczYgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHJldGFpblpvb21MZXZlbCA9IF9vcHRpb25zNi5yZXRhaW5ab29tTGV2ZWwsXG4gICAgICAgIHpvb21MZXZlbCA9IF9vcHRpb25zNi56b29tTGV2ZWw7XG5cbiAgICByZXR1cm4gcmV0YWluWm9vbUxldmVsID8gdGhpcy5tYXAuZ2V0Wm9vbSgpIDogem9vbUxldmVsO1xuICB9XG59O1xuXG5mdW5jdGlvbiBMZWFmbGV0Q29udHJvbCgpIHtcbiAgaWYgKCFMIHx8ICFMLkNvbnRyb2wgfHwgIUwuQ29udHJvbC5leHRlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0xlYWZsZXQgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIGluc3RhbnRpYXRpbmcgdGhlIEdlb1NlYXJjaCBjb250cm9sJyk7XG4gIH1cblxuICB2YXIgTENvbnRyb2wgPSBMLkNvbnRyb2wuZXh0ZW5kKENvbnRyb2wpO1xuXG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBvcHRpb25zID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgb3B0aW9uc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBuZXcgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KExDb250cm9sLCBbbnVsbF0uY29uY2F0KG9wdGlvbnMpKSkoKTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9sZWFmbGV0Q29udHJvbC5qcyIsIlwidXNlIHN0cmljdFwiO1xuLypcbiAqICRhc3luY2JpbmQgaGFzIG11bHRpcGxlIHVzZXMsIGRlcGVuZGluZyBvbiB0aGUgcGFyYW1ldGVyIGxpc3QuIEl0IGlzIGluIEZ1bmN0aW9uLnByb3RvdHlwZSwgc28gJ3RoaXMnIGlzIGFsd2F5cyBhIGZ1bmN0aW9uXG4gKlxuICogMSkgSWYgY2FsbGVkIHdpdGggYSBzaW5nbGUgYXJndW1lbnQgKHRoaXMpLCBpdCBpcyB1c2VkIHdoZW4gZGVmaW5pbmcgYW4gYXN5bmMgZnVuY3Rpb24gdG8gZW5zdXJlIHdoZW5cbiAqICAgICAgaXQgaXMgaW52b2tlZCwgdGhlIGNvcnJlY3QgJ3RoaXMnIGlzIHByZXNlbnQsIGp1c3QgbGlrZSBcImJpbmRcIi4gRm9yIGxlZ2FjeSByZWFzb25zLCAndGhpcycgaXMgZ2l2ZW5cbiAqICAgICAgYSBtZW1lYmVyICd0aGVuJyB3aGljaCByZWZlcnMgdG8gaXRzZWxmLlxuICogMikgSWYgY2FsbGVkIHdpdGggYSBzZWNvbmQgcGFyYW1ldGVyIChcImNhdGNoZXJcIikgYW5kIGNhdGNoZXIhPT10cnVlIGl0IGlzIGJlaW5nIHVzZWQgdG8gaW52b2tlIGFuIGFzeW5jXG4gKiAgICAgIGZ1bmN0aW9uIHdoZXJlIHRoZSBzZWNvbmQgcGFyYW1ldGVyIGlzIHRoZSBlcnJvciBjYWxsYmFjayAoZm9yIHN5bmMgZXhjZXB0aW9ucyBhbmQgdG8gYmUgcGFzc2VkIHRvXG4gKiAgICAgIG5lc3RlZCBhc3luYyBjYWxscylcbiAqIDMpIElmIGNhbGxlZCB3aXRoIHRoZSBzZWNvbmQgcGFyYW1ldGVyPT09dHJ1ZSwgaXQgaXMgdGhlIHNhbWUgdXNlIGFzICgxKSwgYnV0IHRoZSBmdW5jdGlvbiBpcyB3cmFwcGVkXG4gKiAgICAgIGluIGFuICdQcm9taXNlJyBhcyB3ZWxsIGJvdW5kIHRvICd0aGlzJy5cbiAqICAgICAgSXQgaXMgdGhlIHNhbWUgYXMgY2FsbGluZyAnbmV3IFByb21pc2UodGhpcyknLCB3aGVyZSAndGhpcycgaXMgdGhlIGZ1bmN0aW9uIGJlaW5nIGJvdW5kL3dyYXBwZWRcbiAqIDQpIElmIGNhbGxlZCB3aXRoIHRoZSBzZWNvbmQgcGFyYW1ldGVyPT09MCwgaXQgaXMgdGhlIHNhbWUgdXNlIGFzICgxKSwgYnV0IHRoZSBmdW5jdGlvbiBpcyB3cmFwcGVkXG4gKiAgICAgIGluIGEgJ0xhenlUaGVuYWJsZScsIHdoaWNoIGV4ZWN1dGVzIGxhemlseSBhbmQgY2FuIHJlc29sdmUgc3luY2hyb25vdXNseS5cbiAqICAgICAgSXQgaXMgdGhlIHNhbWUgYXMgY2FsbGluZyAnbmV3IExhenlUaGVuYWJsZSh0aGlzKScgKGlmIHN1Y2ggYSB0eXBlIHdlcmUgZXhwb3NlZCksIHdoZXJlICd0aGlzJyBpc1xuICogICAgICB0aGUgZnVuY3Rpb24gYmVpbmcgYm91bmQvd3JhcHBlZFxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3NJbmNsdWRlcyhpbmNsdWRlcyxpbnB1dCkge1xuICAgIHZhciBzcmMgPSBpbnB1dC50b1N0cmluZygpIDtcbiAgICB2YXIgdCA9IFwicmV0dXJuIFwiK3NyYyA7XG4gICAgdmFyIGFyZ3MgPSBzcmMubWF0Y2goLy4qXFwoKFteKV0qKVxcKS8pWzFdIDtcbiAgICB2YXIgcmUgPSAvWydcIl0hISEoW14nXCJdKilbJ1wiXS9nIDtcbiAgICB2YXIgbSA9IFtdIDtcbiAgICB3aGlsZSAoMSkge1xuICAgICAgICB2YXIgbXggPSByZS5leGVjKHQpIDtcbiAgICAgICAgaWYgKG14KVxuICAgICAgICAgICAgbS5wdXNoKG14KSA7XG4gICAgICAgIGVsc2UgYnJlYWsgO1xuICAgIH1cbiAgICBtLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe1xuICAgICAgICB0ID0gdC5zbGljZSgwLGUuaW5kZXgpK2luY2x1ZGVzW2VbMV1dK3Quc3Vic3RyKGUuaW5kZXgrZVswXS5sZW5ndGgpIDtcbiAgICB9KSA7XG4gICAgdCA9IHQucmVwbGFjZSgvXFwvXFwqW14qXSpcXCpcXC8vZywnICcpLnJlcGxhY2UoL1xccysvZywnICcpIDtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGFyZ3MsdCkoKSA7XG59XG5cbnZhciAkYXN5bmNiaW5kID0gcHJvY2Vzc0luY2x1ZGVzKHtcbiAgICB6b3VzYW46cmVxdWlyZSgnLi96b3VzYW4nKS50b1N0cmluZygpLFxuICAgIHRoZW5hYmxlOnJlcXVpcmUoJy4vdGhlbmFibGVGYWN0b3J5JykudG9TdHJpbmcoKVxufSxcbmZ1bmN0aW9uICRhc3luY2JpbmQoc2VsZixjYXRjaGVyKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuJGFzeW5jYmluZCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLFwiJGFzeW5jYmluZFwiLHt2YWx1ZTokYXN5bmNiaW5kLGVudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOnRydWUsd3JpdGFibGU6dHJ1ZX0pIDtcbiAgICB9XG5cbiAgICBpZiAoISRhc3luY2JpbmQudHJhbXBvbGluZSkge1xuICAgICAgJGFzeW5jYmluZC50cmFtcG9saW5lID0gZnVuY3Rpb24gdHJhbXBvbGluZSh0LHgscyxlLHUpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYihxKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHEudGhlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcSA9IHEudGhlbihiLCBlKSA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdT91bmRlZmluZWQ6cTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEucG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHEucG9wKCkgPyB4LmNhbGwodCkgOiBxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEgPSBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEgPSBxLmNhbGwodClcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUocik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICghJGFzeW5jYmluZC5MYXp5VGhlbmFibGUpIHtcbiAgICAgICAgJGFzeW5jYmluZC5MYXp5VGhlbmFibGUgPSAnISEhdGhlbmFibGUnKCk7XG4gICAgICAgICRhc3luY2JpbmQuRWFnZXJUaGVuYWJsZSA9ICRhc3luY2JpbmQuVGhlbmFibGUgPSAoJGFzeW5jYmluZC5FYWdlclRoZW5hYmxlRmFjdG9yeSA9ICchISF6b3VzYW4nKSgpO1xuICAgIH1cblxuICAgIHZhciByZXNvbHZlciA9IHRoaXM7XG4gICAgc3dpdGNoIChjYXRjaGVyKSB7XG4gICAgY2FzZSB0cnVlOlxuICAgICAgICByZXR1cm4gbmV3ICgkYXN5bmNiaW5kLlRoZW5hYmxlKShib3VuZFRoZW4pO1xuICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIG5ldyAoJGFzeW5jYmluZC5MYXp5VGhlbmFibGUpKGJvdW5kVGhlbik7XG4gICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIC8qIEZvciBydW50aW1lIGNvbXBhdGliaWxpdHkgd2l0aCBOb2RlbnQgdjIueCwgcHJvdmlkZSBhIHRoZW5hYmxlICovXG4gICAgICAgIGJvdW5kVGhlbi50aGVuID0gYm91bmRUaGVuIDtcbiAgICAgICAgcmV0dXJuIGJvdW5kVGhlbiA7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlci5hcHBseShzZWxmLGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9IGNhdGNoKGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGNoZXIoZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJvdW5kVGhlbigpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVyLmFwcGx5KHNlbGYsYXJndW1lbnRzKTtcbiAgICB9XG59KSA7XG5cbmZ1bmN0aW9uICRhc3luY3NwYXduKHByb21pc2VQcm92aWRlcixzZWxmKSB7XG4gICAgaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuJGFzeW5jc3Bhd24pIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSxcIiRhc3luY3NwYXduXCIse3ZhbHVlOiRhc3luY3NwYXduLGVudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOnRydWUsd3JpdGFibGU6dHJ1ZX0pIDtcbiAgICB9XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgcmV0dXJuIDtcblxuICAgIHZhciBnZW5GID0gdGhpcyA7XG4gICAgcmV0dXJuIG5ldyBwcm9taXNlUHJvdmlkZXIoZnVuY3Rpb24gZW5vdWdoKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgZ2VuID0gZ2VuRi5jYWxsKHNlbGYsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAoZm4sYXJnKSB7XG4gICAgICAgICAgICB2YXIgbmV4dDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbmV4dCA9IGZuLmNhbGwoZ2VuLGFyZyk7XG4gICAgICAgICAgICAgICAgaWYobmV4dC5kb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0LnZhbHVlICE9PSByZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dC52YWx1ZSAmJiBuZXh0LnZhbHVlPT09bmV4dC52YWx1ZS50aGVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LnZhbHVlKHJlc29sdmUscmVqZWN0KSA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlICYmIHJlc29sdmUobmV4dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlID0gbnVsbCA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChuZXh0LnZhbHVlLnRoZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dC52YWx1ZS50aGVuKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAoZ2VuLm5leHQsdik7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAoZ2VuLnRocm93LGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGVwKGdlbi5uZXh0LG5leHQudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIHJlamVjdCAmJiByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgcmVqZWN0ID0gbnVsbCA7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0ZXAoZ2VuLm5leHQpO1xuICAgIH0pO1xufVxuXG4vLyBJbml0aWFsaXplIGFzeW5jIGJpbmRpbmdzXG4kYXN5bmNiaW5kKCkgO1xuJGFzeW5jc3Bhd24oKSA7XG5cbi8vIEV4cG9ydCBhc3luYyBiaW5kaW5nc1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgJGFzeW5jYmluZDokYXN5bmNiaW5kLFxuICAgICRhc3luY3NwYXduOiRhc3luY3NwYXduXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9ub2RlbnQtcnVudGltZS9ydW50aW1lLmpzIiwiLyogVGhpcyBjb2RlIGlzIGJhc2VkIG9uOlxuem91c2FuIC0gQSBMaWdodG5pbmcgRmFzdCwgWWV0IFZlcnkgU21hbGwgUHJvbWlzZSBBKyBDb21wbGlhbnQgSW1wbGVtZW50YXRpb25cbmh0dHBzOi8vZ2l0aHViLmNvbS9ibHVlamF2YS96b3VzYW5cbkF1dGhvcjogR2xlbm4gQ3Jvd25vdmVyIDxnbGVubkBibHVlamF2YS5jb20+IChodHRwOi8vd3d3LmJsdWVqYXZhLmNvbSlcblZlcnNpb24gMi4zLjNcbkxpY2Vuc2U6IE1JVCAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRpY2spe1xuICAgIHRpY2sgPSB0aWNrIHx8ICh0eXBlb2YgcHJvY2Vzcz09PVwib2JqZWN0XCIgJiYgcHJvY2Vzcy5uZXh0VGljaykgfHwgKHR5cGVvZiBzZXRJbW1lZGlhdGU9PT1cImZ1bmN0aW9uXCIgJiYgc2V0SW1tZWRpYXRlKSB8fCBmdW5jdGlvbihmKXtzZXRUaW1lb3V0KGYsMCl9O1xuICAgIHZhciBzb29uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZxID0gW10sIGZxU3RhcnQgPSAwLCBidWZmZXJTaXplID0gMTAyNDtcbiAgICAgICAgZnVuY3Rpb24gY2FsbFF1ZXVlKCkge1xuICAgICAgICAgICAgd2hpbGUgKGZxLmxlbmd0aCAtIGZxU3RhcnQpIHtcbiAgICAgICAgICAgICAgICB0cnkgeyBmcVtmcVN0YXJ0XSgpIH0gY2F0Y2goZXgpIHsgLyogY29uc29sZS5lcnJvcihleCkgKi8gfVxuICAgICAgICAgICAgICAgIGZxW2ZxU3RhcnQrK10gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGZxU3RhcnQgPT09IGJ1ZmZlclNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgZnEuc3BsaWNlKDAsIGJ1ZmZlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICBmcVN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICBmcS5wdXNoKGZuKTtcbiAgICAgICAgICAgIGlmIChmcS5sZW5ndGggLSBmcVN0YXJ0ID09PSAxKVxuICAgICAgICAgICAgICAgIHRpY2soY2FsbFF1ZXVlKTtcbiAgICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgZnVuY3Rpb24gWm91c2FuKGZ1bmMpIHtcbiAgICAgICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBmdW5jKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgICBtZS5yZXNvbHZlKGFyZyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgbWUucmVqZWN0KGFyZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFpvdXNhbi5wcm90b3R5cGUgPSB7XG4gICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJBdHRlbXB0IHRvIHJlc29sdmUgcHJvbWlzZSB3aXRoIHNlbGZcIikpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGVuID0gdmFsdWUudGhlbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVuY3Rpb24gKHJhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLnJlc29sdmUocmEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3QrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5yZWplY3QocnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRlVMRklMTEVEO1xuICAgICAgICAgICAgdGhpcy52ID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAobWUuYylcbiAgICAgICAgICAgICAgICBzb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDAsIGwgPSBtZS5jLmxlbmd0aDtuIDwgbDsgbisrKVxuICAgICAgICAgICAgICAgICAgICAgICAgU1RBVEVfRlVMRklMTEVEKG1lLmNbbl0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVqZWN0OiBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUpFQ1RFRDtcbiAgICAgICAgICAgIHRoaXMudiA9IHJlYXNvbjtcbiAgICAgICAgICAgIHZhciBjbGllbnRzID0gdGhpcy5jO1xuICAgICAgICAgICAgaWYgKGNsaWVudHMpXG4gICAgICAgICAgICAgICAgc29vbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwLCBsID0gY2xpZW50cy5sZW5ndGg7biA8IGw7IG4rKylcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQVRFX1JFSkVDVEVEKGNsaWVudHNbbl0sIHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIChvbkYsIG9uUikge1xuICAgICAgICAgICAgdmFyIHAgPSBuZXcgWm91c2FuKCk7XG4gICAgICAgICAgICB2YXIgY2xpZW50ID0ge1xuICAgICAgICAgICAgICAgIHk6IG9uRixcbiAgICAgICAgICAgICAgICBuOiBvblIsXG4gICAgICAgICAgICAgICAgcDogcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmMucHVzaChjbGllbnQpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jID0gW2NsaWVudF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGF0ZSwgYSA9IHRoaXMudjtcbiAgICAgICAgICAgICAgICBzb29uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcyhjbGllbnQsIGEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gU1RBVEVfRlVMRklMTEVEKGMsIGFyZykge1xuICAgICAgICBpZiAodHlwZW9mIGMueSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciB5cmV0ID0gYy55LmNhbGwodW5kZWZpbmVkLCBhcmcpO1xuICAgICAgICAgICAgICAgIGMucC5yZXNvbHZlKHlyZXQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgYy5wLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGMucC5yZXNvbHZlKGFyZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gU1RBVEVfUkVKRUNURUQoYywgcmVhc29uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYy5uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHlyZXQgPSBjLm4uY2FsbCh1bmRlZmluZWQsIHJlYXNvbik7XG4gICAgICAgICAgICAgICAgYy5wLnJlc29sdmUoeXJldCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjLnAucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgYy5wLnJlamVjdChyZWFzb24pO1xuICAgIH1cblxuICAgIFpvdXNhbi5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICBpZiAodmFsICYmICh2YWwgaW5zdGFuY2VvZiBab3VzYW4pKVxuICAgICAgICAgICAgcmV0dXJuIHZhbCA7XG4gICAgICAgIHZhciB6ID0gbmV3IFpvdXNhbigpO1xuICAgICAgICB6LnJlc29sdmUodmFsKTtcbiAgICAgICAgcmV0dXJuIHo7XG4gICAgfTtcbiAgICBab3VzYW4ucmVqZWN0ID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIgaW5zdGFuY2VvZiBab3VzYW4pKVxuICAgICAgICAgICAgcmV0dXJuIGVyciA7XG4gICAgICAgIHZhciB6ID0gbmV3IFpvdXNhbigpO1xuICAgICAgICB6LnJlamVjdChlcnIpO1xuICAgICAgICByZXR1cm4gejtcbiAgICB9O1xuXG4gICAgWm91c2FuLnZlcnNpb24gPSBcIjIuMy4zLW5vZGVudFwiIDtcbiAgICByZXR1cm4gWm91c2FuIDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L25vZGVudC1ydW50aW1lL3pvdXNhbi5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBpc1RoZW5hYmxlKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpICYmIHR5cGVvZiBvYmoudGhlbj09PVwiZnVuY3Rpb25cIjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHV0aW9uKHAscixob3cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qIDIuMi43LjEgKi9cbiAgICAgICAgICAgIHZhciB4ID0gaG93ID8gaG93KHIpOnIgO1xuXG4gICAgICAgICAgICBpZiAocD09PXgpIC8qIDIuMy4xICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIHAucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlIHJlc29sdXRpb24gbG9vcFwiKSkgO1xuXG4gICAgICAgICAgICBpZiAoaXNUaGVuYWJsZSh4KSkge1xuICAgICAgICAgICAgICAgIC8qIDIuMy4zICovXG4gICAgICAgICAgICAgICAgeC50aGVuKGZ1bmN0aW9uKHkpe1xuICAgICAgICAgICAgICAgICAgICByZXNvbHV0aW9uKHAseSk7XG4gICAgICAgICAgICAgICAgfSxmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZSlcbiAgICAgICAgICAgICAgICB9KSA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHAucmVzb2x2ZSh4KSA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAvKiAyLjIuNy4yICovXG4gICAgICAgICAgICBwLnJlamVjdChleCkgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQ2hhaW5lZCgpIHt9O1xuICAgIENoYWluZWQucHJvdG90eXBlID0ge1xuICAgICAgICByZXNvbHZlOl91bmNoYWluZWQsXG4gICAgICAgIHJlamVjdDpfdW5jaGFpbmVkLFxuICAgICAgICB0aGVuOnRoZW5DaGFpblxuICAgIH07XG4gICAgZnVuY3Rpb24gX3VuY2hhaW5lZCh2KXt9XG4gICAgZnVuY3Rpb24gdGhlbkNoYWluKHJlcyxyZWope1xuICAgICAgICB0aGlzLnJlc29sdmUgPSByZXM7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiB0aGVuKHJlcyxyZWope1xuICAgICAgICB2YXIgY2hhaW4gPSBuZXcgQ2hhaW5lZCgpIDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdmVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzVGhlbmFibGUodmFsdWUpID8gdmFsdWUudGhlbihyZXMscmVqKSA6IHJlc29sdXRpb24oY2hhaW4sdmFsdWUscmVzKTtcbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXgpIHtcbiAgICAgICAgICAgICAgICByZXNvbHV0aW9uKGNoYWluLGV4LHJlaikgO1xuICAgICAgICAgICAgfSkgO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgcmVzb2x1dGlvbihjaGFpbixleCxyZWopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFpbiA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gVGhlbmFibGUocmVzb2x2ZXIpIHtcbiAgICAgICAgdGhpcy5fcmVzb2x2ZXIgPSByZXNvbHZlciA7XG4gICAgICAgIHRoaXMudGhlbiA9IHRoZW4gO1xuICAgIH07XG5cbiAgICBUaGVuYWJsZS5yZXNvbHZlID0gZnVuY3Rpb24odil7XG4gICAgICAgIHJldHVybiBUaGVuYWJsZS5pc1RoZW5hYmxlKHYpID8gdiA6IHt0aGVuOmZ1bmN0aW9uKHJlc29sdmUpe3JldHVybiByZXNvbHZlKHYpfX07XG4gICAgfTtcblxuICAgIFRoZW5hYmxlLmlzVGhlbmFibGUgPSBpc1RoZW5hYmxlIDtcblxuICAgIHJldHVybiBUaGVuYWJsZSA7XG59IDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbm9kZW50LXJ1bnRpbWUvdGhlbmFibGVGYWN0b3J5LmpzIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9sb2Rhc2guZGVib3VuY2UvaW5kZXguanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbm9kZW50UnVudGltZSA9IHJlcXVpcmUoJ25vZGVudC1ydW50aW1lJyk7XG5cbnZhciBfbm9kZW50UnVudGltZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlbnRSdW50aW1lKTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9kb21VdGlscyA9IHJlcXVpcmUoJy4vZG9tVXRpbHMnKTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgU2VhcmNoRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2VhcmNoRWxlbWVudCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICBfcmVmJGhhbmRsZVN1Ym1pdCA9IF9yZWYuaGFuZGxlU3VibWl0LFxuICAgICAgICBoYW5kbGVTdWJtaXQgPSBfcmVmJGhhbmRsZVN1Ym1pdCA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKCkge30gOiBfcmVmJGhhbmRsZVN1Ym1pdCxcbiAgICAgICAgX3JlZiRzZWFyY2hMYWJlbCA9IF9yZWYuc2VhcmNoTGFiZWwsXG4gICAgICAgIHNlYXJjaExhYmVsID0gX3JlZiRzZWFyY2hMYWJlbCA9PT0gdW5kZWZpbmVkID8gJ3NlYXJjaCcgOiBfcmVmJHNlYXJjaExhYmVsLFxuICAgICAgICBfcmVmJGNsYXNzTmFtZXMgPSBfcmVmLmNsYXNzTmFtZXMsXG4gICAgICAgIGNsYXNzTmFtZXMgPSBfcmVmJGNsYXNzTmFtZXMgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZiRjbGFzc05hbWVzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNlYXJjaEVsZW1lbnQpO1xuXG4gICAgdmFyIGNvbnRhaW5lciA9ICgwLCBfZG9tVXRpbHMuY3JlYXRlRWxlbWVudCkoJ2RpdicsIFsnZ2Vvc2VhcmNoJywgY2xhc3NOYW1lcy5jb250YWluZXJdLmpvaW4oJyAnKSk7XG4gICAgdmFyIGZvcm0gPSAoMCwgX2RvbVV0aWxzLmNyZWF0ZUVsZW1lbnQpKCdmb3JtJywgWycnLCBjbGFzc05hbWVzLmZvcm1dLmpvaW4oJyAnKSwgY29udGFpbmVyKTtcbiAgICB2YXIgaW5wdXQgPSAoMCwgX2RvbVV0aWxzLmNyZWF0ZUVsZW1lbnQpKCdpbnB1dCcsIFsnZ2xhc3MnLCBjbGFzc05hbWVzLmlucHV0XS5qb2luKCcgJyksIGZvcm0pO1xuXG4gICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICBpbnB1dC5wbGFjZWhvbGRlciA9IHNlYXJjaExhYmVsO1xuXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX3RoaXMub25JbnB1dChlKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX3RoaXMub25LZXlVcChlKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX3RoaXMub25LZXlQcmVzcyhlKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX3RoaXMub25Gb2N1cyhlKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBfdGhpcy5vbkJsdXIoZSk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy5lbGVtZW50cyA9IHsgY29udGFpbmVyOiBjb250YWluZXIsIGZvcm06IGZvcm0sIGlucHV0OiBpbnB1dCB9O1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gaGFuZGxlU3VibWl0O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNlYXJjaEVsZW1lbnQsIFt7XG4gICAga2V5OiAnb25Gb2N1cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRm9jdXMoKSB7XG4gICAgICAoMCwgX2RvbVV0aWxzLmFkZENsYXNzTmFtZSkodGhpcy5lbGVtZW50cy5mb3JtLCAnYWN0aXZlJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25CbHVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25CbHVyKCkge1xuICAgICAgKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKHRoaXMuZWxlbWVudHMuZm9ybSwgJ2FjdGl2ZScpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ29uU3VibWl0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25TdWJtaXQoZXZlbnQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoJHJldHVybiwgJGVycm9yKSB7XG4gICAgICAgIHZhciBfZWxlbWVudHMsIGlucHV0LCBjb250YWluZXI7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgX2VsZW1lbnRzID0gdGhpcy5lbGVtZW50cywgaW5wdXQgPSBfZWxlbWVudHMuaW5wdXQsIGNvbnRhaW5lciA9IF9lbGVtZW50cy5jb250YWluZXI7XG5cbiAgICAgICAgKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKGNvbnRhaW5lciwgJ2Vycm9yJyk7XG4gICAgICAgICgwLCBfZG9tVXRpbHMuYWRkQ2xhc3NOYW1lKShjb250YWluZXIsICdwZW5kaW5nJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU3VibWl0KHsgcXVlcnk6IGlucHV0LnZhbHVlIH0pLnRoZW4oZnVuY3Rpb24gKCRhd2FpdF8xKSB7XG4gICAgICAgICAgKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKGNvbnRhaW5lciwgJ3BlbmRpbmcnKTtcbiAgICAgICAgICByZXR1cm4gJHJldHVybigpO1xuICAgICAgICB9LiRhc3luY2JpbmQodGhpcywgJGVycm9yKSwgJGVycm9yKTtcbiAgICAgIH0uJGFzeW5jYmluZCh0aGlzKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25JbnB1dCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uSW5wdXQoKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50cy5jb250YWluZXI7XG5cblxuICAgICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgICAgKDAsIF9kb21VdGlscy5yZW1vdmVDbGFzc05hbWUpKGNvbnRhaW5lciwgJ2Vycm9yJyk7XG4gICAgICAgIHRoaXMuaGFzRXJyb3IgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdvbktleVVwJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25LZXlVcChldmVudCkge1xuICAgICAgdmFyIF9lbGVtZW50czIgPSB0aGlzLmVsZW1lbnRzLFxuICAgICAgICAgIGNvbnRhaW5lciA9IF9lbGVtZW50czIuY29udGFpbmVyLFxuICAgICAgICAgIGlucHV0ID0gX2VsZW1lbnRzMi5pbnB1dDtcblxuXG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gX2NvbnN0YW50cy5FU0NBUEVfS0VZKSB7XG4gICAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKShjb250YWluZXIsICdwZW5kaW5nJyk7XG4gICAgICAgICgwLCBfZG9tVXRpbHMucmVtb3ZlQ2xhc3NOYW1lKShjb250YWluZXIsICdhY3RpdmUnKTtcblxuICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZm9jdXMoKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5ibHVyKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25LZXlQcmVzcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uS2V5UHJlc3MoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBfY29uc3RhbnRzLkVOVEVSX0tFWSkge1xuICAgICAgICB0aGlzLm9uU3VibWl0KGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRRdWVyeScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFF1ZXJ5KHF1ZXJ5KSB7XG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLmVsZW1lbnRzLmlucHV0O1xuXG4gICAgICBpbnB1dC52YWx1ZSA9IHF1ZXJ5O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTZWFyY2hFbGVtZW50O1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTZWFyY2hFbGVtZW50O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3NlYXJjaEVsZW1lbnQuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0ICovXG52YXIgY3JlYXRlRWxlbWVudCA9IGV4cG9ydHMuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoZWxlbWVudCkge1xuICB2YXIgY2xhc3NOYW1lcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJyc7XG4gIHZhciBwYXJlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG5cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcbiAgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lcztcblxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIHJldHVybiBlbDtcbn07XG5cbnZhciBjcmVhdGVTY3JpcHRFbGVtZW50ID0gZXhwb3J0cy5jcmVhdGVTY3JpcHRFbGVtZW50ID0gZnVuY3Rpb24gY3JlYXRlU2NyaXB0RWxlbWVudCh1cmwsIGNiKSB7XG4gIHZhciBzY3JpcHQgPSBjcmVhdGVFbGVtZW50KCdzY3JpcHQnLCBudWxsLCBkb2N1bWVudC5ib2R5KTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICB3aW5kb3dbY2JdID0gZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgIGRlbGV0ZSB3aW5kb3dbY2JdO1xuICAgICAgcmVzb2x2ZShqc29uKTtcbiAgICB9O1xuXG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcbiAgfSk7XG59O1xuXG52YXIgYWRkQ2xhc3NOYW1lID0gZXhwb3J0cy5hZGRDbGFzc05hbWUgPSBmdW5jdGlvbiBhZGRDbGFzc05hbWUoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50ICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH1cbn07XG5cbnZhciByZW1vdmVDbGFzc05hbWUgPSBleHBvcnRzLnJlbW92ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uIHJlbW92ZUNsYXNzTmFtZShlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL2RvbVV0aWxzLmpzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgRU5URVJfS0VZID0gZXhwb3J0cy5FTlRFUl9LRVkgPSAxMztcbnZhciBFU0NBUEVfS0VZID0gZXhwb3J0cy5FU0NBUEVfS0VZID0gMjc7XG52YXIgQVJST1dfRE9XTl9LRVkgPSBleHBvcnRzLkFSUk9XX0RPV05fS0VZID0gNDA7XG52YXIgQVJST1dfVVBfS0VZID0gZXhwb3J0cy5BUlJPV19VUF9LRVkgPSAzODtcbnZhciBBUlJPV19MRUZUX0tFWSA9IGV4cG9ydHMuQVJST1dfTEVGVF9LRVkgPSAzNztcbnZhciBBUlJPV19SSUdIVF9LRVkgPSBleHBvcnRzLkFSUk9XX1JJR0hUX0tFWSA9IDM5O1xuXG52YXIgU1BFQ0lBTF9LRVlTID0gZXhwb3J0cy5TUEVDSUFMX0tFWVMgPSBbRU5URVJfS0VZLCBFU0NBUEVfS0VZLCBBUlJPV19ET1dOX0tFWSwgQVJST1dfVVBfS0VZLCBBUlJPV19MRUZUX0tFWSwgQVJST1dfUklHSFRfS0VZXTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9jb25zdGFudHMuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfZG9tVXRpbHMgPSByZXF1aXJlKCcuL2RvbVV0aWxzJyk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBjeCA9IGZ1bmN0aW9uIGN4KCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgY2xhc3NuYW1lcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGNsYXNzbmFtZXNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gY2xhc3NuYW1lcy5qb2luKCcgJykudHJpbSgpO1xufTtcblxudmFyIFJlc3VsdExpc3QgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlc3VsdExpc3QoKSB7XG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICBfcmVmJGhhbmRsZUNsaWNrID0gX3JlZi5oYW5kbGVDbGljayxcbiAgICAgICAgaGFuZGxlQ2xpY2sgPSBfcmVmJGhhbmRsZUNsaWNrID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7fSA6IF9yZWYkaGFuZGxlQ2xpY2ssXG4gICAgICAgIF9yZWYkY2xhc3NOYW1lcyA9IF9yZWYuY2xhc3NOYW1lcyxcbiAgICAgICAgY2xhc3NOYW1lcyA9IF9yZWYkY2xhc3NOYW1lcyA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGNsYXNzTmFtZXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVzdWx0TGlzdCk7XG5cbiAgICBfaW5pdGlhbGlzZVByb3BzLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnByb3BzID0geyBoYW5kbGVDbGljazogaGFuZGxlQ2xpY2ssIGNsYXNzTmFtZXM6IGNsYXNzTmFtZXMgfTtcbiAgICB0aGlzLnNlbGVjdGVkID0gLTE7XG5cbiAgICB2YXIgY29udGFpbmVyID0gKDAsIF9kb21VdGlscy5jcmVhdGVFbGVtZW50KSgnZGl2JywgY3goJ3Jlc3VsdHMnLCBjbGFzc05hbWVzLmNvbnRhaW5lcikpO1xuICAgIHZhciByZXN1bHRJdGVtID0gKDAsIF9kb21VdGlscy5jcmVhdGVFbGVtZW50KSgnZGl2JywgY3goY2xhc3NOYW1lcy5pdGVtKSk7XG5cbiAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuICAgIHRoaXMuZWxlbWVudHMgPSB7IGNvbnRhaW5lcjogY29udGFpbmVyLCByZXN1bHRJdGVtOiByZXN1bHRJdGVtIH07XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUmVzdWx0TGlzdCwgW3tcbiAgICBrZXk6ICdyZW5kZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gICAgICB2YXIgX2VsZW1lbnRzID0gdGhpcy5lbGVtZW50cyxcbiAgICAgICAgICBjb250YWluZXIgPSBfZWxlbWVudHMuY29udGFpbmVyLFxuICAgICAgICAgIHJlc3VsdEl0ZW0gPSBfZWxlbWVudHMucmVzdWx0SXRlbTtcblxuICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCwgaWR4KSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHJlc3VsdEl0ZW0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEta2V5JywgaWR4KTtcbiAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gcmVzdWx0LmxhYmVsO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgKDAsIF9kb21VdGlscy5hZGRDbGFzc05hbWUpKGNvbnRhaW5lciwgJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NlbGVjdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdChpbmRleCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudHMuY29udGFpbmVyO1xuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uZnVzaW5nLWFycm93XG5cbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwgaWR4KSB7XG4gICAgICAgIHJldHVybiBpZHggPT09IGluZGV4ID8gKDAsIF9kb21VdGlscy5hZGRDbGFzc05hbWUpKGNoaWxkLCAnYWN0aXZlJykgOiAoMCwgX2RvbVV0aWxzLnJlbW92ZUNsYXNzTmFtZSkoY2hpbGQsICdhY3RpdmUnKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkID0gaW5kZXg7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRzW2luZGV4XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdjb3VudCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0cyA/IHRoaXMucmVzdWx0cy5sZW5ndGggOiAwO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2NsZWFyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50cy5jb250YWluZXI7XG5cbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSAtMTtcblxuICAgICAgd2hpbGUgKGNvbnRhaW5lci5sYXN0Q2hpbGQpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5sYXN0Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICAoMCwgX2RvbVV0aWxzLnJlbW92ZUNsYXNzTmFtZSkoY29udGFpbmVyLCAnYWN0aXZlJyk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlc3VsdExpc3Q7XG59KCk7XG5cbnZhciBfaW5pdGlhbGlzZVByb3BzID0gZnVuY3Rpb24gX2luaXRpYWxpc2VQcm9wcygpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB0aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9yZWYyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgdGFyZ2V0ID0gX3JlZjIudGFyZ2V0O1xuXG4gICAgdmFyIGhhbmRsZUNsaWNrID0gX3RoaXMucHJvcHMuaGFuZGxlQ2xpY2s7XG4gICAgdmFyIGNvbnRhaW5lciA9IF90aGlzLmVsZW1lbnRzLmNvbnRhaW5lcjtcblxuXG4gICAgaWYgKHRhcmdldC5wYXJlbnROb2RlICE9PSBjb250YWluZXIgfHwgIXRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEta2V5JykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaWR4ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcbiAgICB2YXIgcmVzdWx0ID0gX3RoaXMucmVzdWx0c1tpZHhdO1xuICAgIGhhbmRsZUNsaWNrKHsgcmVzdWx0OiByZXN1bHQgfSk7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBSZXN1bHRMaXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3Jlc3VsdExpc3QuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbm9kZW50UnVudGltZSA9IHJlcXVpcmUoJ25vZGVudC1ydW50aW1lJyk7XG5cbnZhciBfbm9kZW50UnVudGltZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlbnRSdW50aW1lKTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9wcm92aWRlciA9IHJlcXVpcmUoJy4vcHJvdmlkZXInKTtcblxudmFyIF9wcm92aWRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm92aWRlcik7XG5cbnZhciBfZG9tVXRpbHMgPSByZXF1aXJlKCcuLi9kb21VdGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBQcm92aWRlciA9IGZ1bmN0aW9uIChfQmFzZVByb3ZpZGVyKSB7XG4gIF9pbmhlcml0cyhQcm92aWRlciwgX0Jhc2VQcm92aWRlcik7XG5cbiAgZnVuY3Rpb24gUHJvdmlkZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFByb3ZpZGVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUHJvdmlkZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQcm92aWRlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFByb3ZpZGVyLCBbe1xuICAgIGtleTogJ2VuZHBvaW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5kcG9pbnQoKSB7XG4gICAgICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgICAgcXVlcnkgPSBfcmVmLnF1ZXJ5LFxuICAgICAgICAgIHByb3RvY29sID0gX3JlZi5wcm90b2NvbCxcbiAgICAgICAgICBqc29ucCA9IF9yZWYuanNvbnA7XG5cbiAgICAgIHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zO1xuXG5cbiAgICAgIHZhciBwYXJhbVN0cmluZyA9IHRoaXMuZ2V0UGFyYW1TdHJpbmcoX2V4dGVuZHMoe30sIHBhcmFtcywge1xuICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgIGpzb25wOiBqc29ucFxuICAgICAgfSkpO1xuXG4gICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL3YxL0xvY2F0aW9ucz8nICsgcGFyYW1TdHJpbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncGFyc2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJzZShfcmVmMikge1xuICAgICAgdmFyIGRhdGEgPSBfcmVmMi5kYXRhO1xuXG4gICAgICBpZiAoZGF0YS5yZXNvdXJjZVNldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGEucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlcy5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiByLnBvaW50LmNvb3JkaW5hdGVzWzFdLFxuICAgICAgICAgIHk6IHIucG9pbnQuY29vcmRpbmF0ZXNbMF0sXG4gICAgICAgICAgbGFiZWw6IHIuYWRkcmVzcy5mb3JtYXR0ZWRBZGRyZXNzLFxuICAgICAgICAgIGJvdW5kczogW1tyLmJib3hbMF0sIHIuYmJveFsxXV0sIC8vIHMsIHdcbiAgICAgICAgICBbci5iYm94WzJdLCByLmJib3hbM11dXSxcbiAgICAgICAgICByYXc6IHJcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NlYXJjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlYXJjaChfcmVmMykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uICgkcmV0dXJuLCAkZXJyb3IpIHtcbiAgICAgICAgdmFyIHF1ZXJ5LCBwcm90b2NvbCwganNvbnAsIHVybCwganNvbjtcbiAgICAgICAgcXVlcnkgPSBfcmVmMy5xdWVyeTtcblxuICAgICAgICBwcm90b2NvbCA9IH5sb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKCdodHRwJykgPyBsb2NhdGlvbi5wcm90b2NvbCA6ICdodHRwczonO1xuXG4gICAgICAgIGpzb25wID0gJ0JJTkdfSlNPTlBfQ0JfJyArIERhdGUubm93KCk7XG4gICAgICAgIHVybCA9IHRoaXMuZW5kcG9pbnQoeyBxdWVyeTogcXVlcnksIHByb3RvY29sOiBwcm90b2NvbCwganNvbnA6IGpzb25wIH0pO1xuXG4gICAgICAgIHJldHVybiAoMCwgX2RvbVV0aWxzLmNyZWF0ZVNjcmlwdEVsZW1lbnQpKHVybCwganNvbnApLnRoZW4oZnVuY3Rpb24gKCRhd2FpdF8xKSB7XG4gICAgICAgICAganNvbiA9ICRhd2FpdF8xO1xuICAgICAgICAgIHJldHVybiAkcmV0dXJuKHRoaXMucGFyc2UoeyBkYXRhOiBqc29uIH0pKTtcbiAgICAgICAgfS4kYXN5bmNiaW5kKHRoaXMsICRlcnJvciksICRlcnJvcik7XG4gICAgICB9LiRhc3luY2JpbmQodGhpcykpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQcm92aWRlcjtcbn0oX3Byb3ZpZGVyMi5kZWZhdWx0KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUHJvdmlkZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9sZWFmbGV0LWdlb3NlYXJjaC9saWIvcHJvdmlkZXJzL2JpbmdQcm92aWRlci5qcyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9ub2RlbnRSdW50aW1lID0gcmVxdWlyZSgnbm9kZW50LXJ1bnRpbWUnKTtcblxudmFyIF9ub2RlbnRSdW50aW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVudFJ1bnRpbWUpO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgUHJvdmlkZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFByb3ZpZGVyKCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQcm92aWRlcik7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFByb3ZpZGVyLCBbe1xuICAgIGtleTogJ2dldFBhcmFtU3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UGFyYW1TdHJpbmcocGFyYW1zKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tleV0pO1xuICAgICAgfSkuam9pbignJicpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NlYXJjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlYXJjaChfcmVmKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCRyZXR1cm4sICRlcnJvcikge1xuICAgICAgICB2YXIgcXVlcnksIHByb3RvY29sLCB1cmwsIHJlcXVlc3QsIGpzb247XG4gICAgICAgIHF1ZXJ5ID0gX3JlZi5xdWVyeTtcblxuICAgICAgICBwcm90b2NvbCA9IH5sb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKCdodHRwJykgPyBsb2NhdGlvbi5wcm90b2NvbCA6ICdodHRwczonO1xuICAgICAgICB1cmwgPSB0aGlzLmVuZHBvaW50KHsgcXVlcnk6IHF1ZXJ5LCBwcm90b2NvbDogcHJvdG9jb2wgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCkudGhlbihmdW5jdGlvbiAoJGF3YWl0XzEpIHtcbiAgICAgICAgICByZXF1ZXN0ID0gJGF3YWl0XzE7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3QuanNvbigpLnRoZW4oZnVuY3Rpb24gKCRhd2FpdF8yKSB7XG4gICAgICAgICAgICBqc29uID0gJGF3YWl0XzI7XG4gICAgICAgICAgICByZXR1cm4gJHJldHVybih0aGlzLnBhcnNlKHsgZGF0YToganNvbiB9KSk7XG4gICAgICAgICAgfS4kYXN5bmNiaW5kKHRoaXMsICRlcnJvciksICRlcnJvcik7XG4gICAgICAgIH0uJGFzeW5jYmluZCh0aGlzLCAkZXJyb3IpLCAkZXJyb3IpO1xuICAgICAgfS4kYXN5bmNiaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUHJvdmlkZXI7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFByb3ZpZGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3Byb3ZpZGVycy9wcm92aWRlci5qcyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9wcm92aWRlciA9IHJlcXVpcmUoJy4vcHJvdmlkZXInKTtcblxudmFyIF9wcm92aWRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm92aWRlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIFByb3ZpZGVyID0gZnVuY3Rpb24gKF9CYXNlUHJvdmlkZXIpIHtcbiAgX2luaGVyaXRzKFByb3ZpZGVyLCBfQmFzZVByb3ZpZGVyKTtcblxuICBmdW5jdGlvbiBQcm92aWRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJvdmlkZXIpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChQcm92aWRlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFByb3ZpZGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUHJvdmlkZXIsIFt7XG4gICAga2V5OiAnZW5kcG9pbnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmRwb2ludCgpIHtcbiAgICAgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgICBxdWVyeSA9IF9yZWYucXVlcnksXG4gICAgICAgICAgcHJvdG9jb2wgPSBfcmVmLnByb3RvY29sO1xuXG4gICAgICB2YXIgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcztcblxuXG4gICAgICB2YXIgcGFyYW1TdHJpbmcgPSB0aGlzLmdldFBhcmFtU3RyaW5nKF9leHRlbmRzKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgZjogJ2pzb24nLFxuICAgICAgICB0ZXh0OiBxdWVyeVxuICAgICAgfSkpO1xuXG4gICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy9nZW9jb2RlLmFyY2dpcy5jb20vYXJjZ2lzL3Jlc3Qvc2VydmljZXMvV29ybGQvR2VvY29kZVNlcnZlci9maW5kPycgKyBwYXJhbVN0cmluZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdwYXJzZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhcnNlKF9yZWYyKSB7XG4gICAgICB2YXIgZGF0YSA9IF9yZWYyLmRhdGE7XG5cbiAgICAgIHJldHVybiBkYXRhLmxvY2F0aW9ucy5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiByLmZlYXR1cmUuZ2VvbWV0cnkueCxcbiAgICAgICAgICB5OiByLmZlYXR1cmUuZ2VvbWV0cnkueSxcbiAgICAgICAgICBsYWJlbDogci5uYW1lLFxuICAgICAgICAgIGJvdW5kczogW1tyLmV4dGVudC55bWluLCByLmV4dGVudC54bWluXSwgLy8gcywgd1xuICAgICAgICAgIFtyLmV4dGVudC55bWF4LCByLmV4dGVudC54bWF4XV0sXG4gICAgICAgICAgcmF3OiByXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUHJvdmlkZXI7XG59KF9wcm92aWRlcjIuZGVmYXVsdCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFByb3ZpZGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbGVhZmxldC1nZW9zZWFyY2gvbGliL3Byb3ZpZGVycy9lc3JpUHJvdmlkZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVyJyk7XG5cbnZhciBfcHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvdmlkZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBQcm92aWRlciA9IGZ1bmN0aW9uIChfQmFzZVByb3ZpZGVyKSB7XG4gIF9pbmhlcml0cyhQcm92aWRlciwgX0Jhc2VQcm92aWRlcik7XG5cbiAgZnVuY3Rpb24gUHJvdmlkZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFByb3ZpZGVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUHJvdmlkZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQcm92aWRlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFByb3ZpZGVyLCBbe1xuICAgIGtleTogJ2VuZHBvaW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5kcG9pbnQoKSB7XG4gICAgICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgICAgcXVlcnkgPSBfcmVmLnF1ZXJ5LFxuICAgICAgICAgIHByb3RvY29sID0gX3JlZi5wcm90b2NvbDtcblxuICAgICAgdmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG5cblxuICAgICAgdmFyIHBhcmFtU3RyaW5nID0gdGhpcy5nZXRQYXJhbVN0cmluZyhfZXh0ZW5kcyh7fSwgcGFyYW1zLCB7XG4gICAgICAgIGFkZHJlc3M6IHF1ZXJ5XG4gICAgICB9KSk7XG5cbiAgICAgIC8vIGdvb2dsZSByZXF1aXJlcyBhIHNlY3VyZSBjb25uZWN0aW9uIHdoZW4gdXNpbmcgYXBpIGtleXNcbiAgICAgIHZhciBwcm90byA9IHBhcmFtcyAmJiBwYXJhbXMua2V5ID8gJ2h0dHBzOicgOiBwcm90b2NvbDtcbiAgICAgIHJldHVybiBwcm90byArICcvL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uPycgKyBwYXJhbVN0cmluZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdwYXJzZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhcnNlKF9yZWYyKSB7XG4gICAgICB2YXIgZGF0YSA9IF9yZWYyLmRhdGE7XG5cbiAgICAgIHJldHVybiBkYXRhLnJlc3VsdHMubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogci5nZW9tZXRyeS5sb2NhdGlvbi5sbmcsXG4gICAgICAgICAgeTogci5nZW9tZXRyeS5sb2NhdGlvbi5sYXQsXG4gICAgICAgICAgbGFiZWw6IHIuZm9ybWF0dGVkX2FkZHJlc3MsXG4gICAgICAgICAgYm91bmRzOiBbW3IuZ2VvbWV0cnkudmlld3BvcnQuc291dGh3ZXN0LmxhdCwgci5nZW9tZXRyeS52aWV3cG9ydC5zb3V0aHdlc3QubG5nXSwgLy8gcywgd1xuICAgICAgICAgIFtyLmdlb21ldHJ5LnZpZXdwb3J0Lm5vcnRoZWFzdC5sYXQsIHIuZ2VvbWV0cnkudmlld3BvcnQubm9ydGhlYXN0LmxuZ11dLFxuICAgICAgICAgIHJhdzogclxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFByb3ZpZGVyO1xufShfcHJvdmlkZXIyLmRlZmF1bHQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQcm92aWRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvZ29vZ2xlUHJvdmlkZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVyJyk7XG5cbnZhciBfcHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvdmlkZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBQcm92aWRlciA9IGZ1bmN0aW9uIChfQmFzZVByb3ZpZGVyKSB7XG4gIF9pbmhlcml0cyhQcm92aWRlciwgX0Jhc2VQcm92aWRlcik7XG5cbiAgZnVuY3Rpb24gUHJvdmlkZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFByb3ZpZGVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUHJvdmlkZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQcm92aWRlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFByb3ZpZGVyLCBbe1xuICAgIGtleTogJ2VuZHBvaW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5kcG9pbnQoKSB7XG4gICAgICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgICAgcXVlcnkgPSBfcmVmLnF1ZXJ5LFxuICAgICAgICAgIHByb3RvY29sID0gX3JlZi5wcm90b2NvbDtcblxuICAgICAgdmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG5cblxuICAgICAgdmFyIHBhcmFtU3RyaW5nID0gdGhpcy5nZXRQYXJhbVN0cmluZyhfZXh0ZW5kcyh7fSwgcGFyYW1zLCB7XG4gICAgICAgIGZvcm1hdDogJ2pzb24nLFxuICAgICAgICBxOiBxdWVyeVxuICAgICAgfSkpO1xuXG4gICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoPycgKyBwYXJhbVN0cmluZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdwYXJzZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhcnNlKF9yZWYyKSB7XG4gICAgICB2YXIgZGF0YSA9IF9yZWYyLmRhdGE7XG5cbiAgICAgIHJldHVybiBkYXRhLm1hcChmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHIubG9uLFxuICAgICAgICAgIHk6IHIubGF0LFxuICAgICAgICAgIGxhYmVsOiByLmRpc3BsYXlfbmFtZSxcbiAgICAgICAgICBib3VuZHM6IFtbcGFyc2VGbG9hdChyLmJvdW5kaW5nYm94WzBdKSwgcGFyc2VGbG9hdChyLmJvdW5kaW5nYm94WzJdKV0sIC8vIHMsIHdcbiAgICAgICAgICBbcGFyc2VGbG9hdChyLmJvdW5kaW5nYm94WzFdKSwgcGFyc2VGbG9hdChyLmJvdW5kaW5nYm94WzNdKV1dLFxuICAgICAgICAgIHJhdzogclxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFByb3ZpZGVyO1xufShfcHJvdmlkZXIyLmRlZmF1bHQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQcm92aWRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xlYWZsZXQtZ2Vvc2VhcmNoL2xpYi9wcm92aWRlcnMvb3BlblN0cmVldE1hcFByb3ZpZGVyLmpzIiwiaW1wb3J0IHt0b2dnbGVMYXllcn0gZnJvbSBcIi4vbGF5ZXJcIjtcbmltcG9ydCB7bWFrZU9wYWNpdHlTbGlkZXJ9IGZyb20gXCIuL29wYWNpdHlTbGlkZXJcIlxuaW1wb3J0IHtzZXRPcGFjaXR5U2xpZGVyUG9zaXRpb259IGZyb20gXCIuL29wYWNpdHlTbGlkZXJcIlxuaW1wb3J0IHt1cGRhdGVTaGFyZVVybH0gZnJvbSBcIi4vc2hhcmVcIjtcblxudmFyIGxheWVyR3JvdXBMYXlvdXQgPSBbXVxudmFyIGxheWVyR3JvdXBzXG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRBY3RpdmVMYXllckdyb3VwcyAoKSB7XG5cdHJldHVybiBsYXllckdyb3VwTGF5b3V0LmZpbHRlcihsYXllckdyb3VwID0+IHtcblx0XHRyZXR1cm4gbGF5ZXJHcm91cC5hY3RpdmVcblx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UGFuZWxTdGF0ZSAoKSB7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExheWVyR3JvdXBzICgpIHtcblx0cmV0dXJuIGxheWVyR3JvdXBzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXR1cFBhbmVsIChsYXllcnMsIGxheW91dCkge1xuXHRsYXllckdyb3VwTGF5b3V0ID0gbGF5b3V0WydsYXllci1ncm91cHMtb3JkZXInXVxuXHRsYXllckdyb3VwcyA9IG1ha2VMYXllckdyb3VwcyhsYXlvdXRbJ2xheWVyLWdyb3Vwcy1vcmRlciddKTtcblx0bWFrZUxheWVyRWxlbXMobGF5ZXJHcm91cHMsIGxheWVycyk7XG5cdG1ha2VQYW5lbERyYWdnYWJsZSgpXG5cdHNldFBhbmVsU2Nyb2xsSGFuZGxlcigpXG59XG5cbmZ1bmN0aW9uIGJyb3dzZXJJc0ludGVybmV0RXhwbG9yZXIoKSB7XG5cdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG5cdHJldHVybiB1YS5pbmRleE9mKCdNU0lFJykgPiAtMSB8fCB1YS5pbmRleE9mKCdydjoxMS4wJykgPiAtMVxufVxuXG5mdW5jdGlvbiBzZXRQYW5lbFNjcm9sbEhhbmRsZXIoKSB7XG5cdHZhciBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyaWdodC1wYW5lbCcpXG5cdHBhbmVsLm9uc2Nyb2xsID0gdXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodFxufVxuXG5mdW5jdGlvbiBtYWtlUGFuZWxEcmFnZ2FibGUoKSB7XG5cdGlmIChicm93c2VySXNJbnRlcm5ldEV4cGxvcmVyKCkpIHJldHVyblxuXG5cdHZhciBvdmVybGF5ID0gZDMuc2VsZWN0KCcjcmlnaHQtcGFuZWwtZHJhZy1vdmVybGF5JylcblxuXHRvdmVybGF5LnN0eWxlKCdjdXJzb3InLCAnZXctcmVzaXplJylcblxuXHRvdmVybGF5LmNhbGwoZDMuZHJhZygpXG5cdFx0Lm9uKCdkcmFnJywgZnVuY3Rpb24gKCkge1xuXHRcdHBhbmVsRHJhZ0V2ZW50SGFuZGxlci5jYWxsKHRoaXMpXG5cdH0pKTtcbn1cblxuZnVuY3Rpb24gcGFuZWxEcmFnRXZlbnRIYW5kbGVyKCkge1xuXHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KClcblx0dXBkYXRlUGFuZWxXaWR0aCgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0ICgpIHtcblx0dmFyIHBhbmVsID0gZDMuc2VsZWN0KCcjcmlnaHQtcGFuZWwnKVxuXHR2YXIgcGFuZWxPZmZzZXRIZWlnaHQgPSBwYW5lbC5wcm9wZXJ0eSgnb2Zmc2V0SGVpZ2h0Jylcblx0dmFyIHBhbmVsRHJhZ092ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmlnaHQtcGFuZWwtZHJhZy1vdmVybGF5Jylcblx0dmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyaWdodC1wYW5lbC1oZWFkZXInKVxuXG5cdHZhciBuZXdIZWlnaHRcblxuXHRpZiAocGFuZWwuY2xhc3NlZCgnZ3JhcGhzLWFjdGl2ZScpKSB7XG5cdFx0dmFyIGdyYXBoTGlzdEV4dHJhU3BhY2UgPSA3MDBcblx0XHR2YXIgZ3JhcGhMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoLWxpc3QnKVxuXHRcdG5ld0hlaWdodCA9IGhlYWRlci5zY3JvbGxIZWlnaHQgKyBncmFwaExpc3Quc2Nyb2xsSGVpZ2h0ICsgZ3JhcGhMaXN0RXh0cmFTcGFjZVxuXHR9XG5cdGVsc2UgeyAvLyBwYW5lbC5jbGFzc2VkKCdsYXllcnMtYWN0aXZlJylcblx0XHR2YXIgbGF5ZXJMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xheWVyLWxpc3QnKVxuXHRcdG5ld0hlaWdodCA9IGhlYWRlci5zY3JvbGxIZWlnaHQgKyBsYXllckxpc3Quc2Nyb2xsSGVpZ2h0XG5cdH1cblx0bmV3SGVpZ2h0ID0gbmV3SGVpZ2h0ID4gcGFuZWxPZmZzZXRIZWlnaHQgPyBgJHtuZXdIZWlnaHR9YCsncHgnIDogbnVsbFxuXHRwYW5lbERyYWdPdmVybGF5LnN0eWxlLmhlaWdodCA9IG5ld0hlaWdodFxufVxuXG5mdW5jdGlvbiB1cGRhdGVQYW5lbFdpZHRoKCkge1xuXHR2YXIgcGFuZWwgPSBkMy5zZWxlY3QoJyNyaWdodC1wYW5lbCcpXG5cdHZhciBwYW5lbE1pbldpZHRoID0gK3BhbmVsLnN0eWxlKCdtaW4td2lkdGgnKS5zbGljZSgwLCAtMilcblx0dmFyIHBhbmVsQ2xpZW50V2lkdGggPSBwYW5lbC5wcm9wZXJ0eSgnY2xpZW50V2lkdGgnKVxuXG5cdHZhciB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKVxuXHR2YXIgd3JhcHBlcldpZHRoID0gd3JhcHBlci5jbGllbnRXaWR0aFxuXG5cdHZhciBtYXBXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC13cmFwcGVyJylcblxuXHR2YXIgbW91c2VYID0gZDMuZXZlbnQuc291cmNlRXZlbnQueFxuXHR2YXIgeERlbHRhID0gKHdyYXBwZXJXaWR0aCAtIG1vdXNlWCkgLSBwYW5lbENsaWVudFdpZHRoXG5cblx0dmFyIG5ld1BhbmVsV2lkdGggPSBwYW5lbENsaWVudFdpZHRoICsgeERlbHRhXG5cdG5ld1BhbmVsV2lkdGggPSBuZXdQYW5lbFdpZHRoIDwgcGFuZWxNaW5XaWR0aCA/XG5cdFx0cGFuZWxNaW5XaWR0aFxuXHQ6ICAgbmV3UGFuZWxXaWR0aCA+IHdyYXBwZXJXaWR0aCA/XG5cdFx0d3JhcHBlcldpZHRoXG5cdDogICBuZXdQYW5lbFdpZHRoXG5cdG1hcFdyYXBwZXIuc3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7bmV3UGFuZWxXaWR0aH1gKydweCdcblx0cGFuZWwuc3R5bGUoJ3dpZHRoJywgYCR7bmV3UGFuZWxXaWR0aH1gKydweCcpXG59XG5cbmZ1bmN0aW9uIG1ha2VMYXllckdyb3VwcyAobGF5b3V0KSB7XG5cdHJldHVybiBkMy5zZWxlY3QoJyNsYXllci1saXN0Jylcblx0XHQuc2VsZWN0QWxsKCcubGF5ZXItZ3JvdXAtd3JhcHBlcicpXG5cdFx0LmRhdGEobGF5b3V0KVxuXHRcdC5lbnRlcigpXG5cdFx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xheWVyLWdyb3VwLXdyYXBwZXInKVxuXHRcdFx0LmF0dHIoJ2lkJywgbGF5ZXJHcm91cCA9PiBsYXllckdyb3VwLmlkKVxuXHRcdFx0LmNsYXNzZWQoJ2FjdGl2ZScsIGxheWVyR3JvdXAgPT4gbGF5ZXJHcm91cC5hY3RpdmUpXG5cdFx0XHQuZWFjaChmdW5jdGlvbiAobGF5ZXJHcm91cCkge1xuXHRcdFx0XHRkMy5zZWxlY3QodGhpcykuYXBwZW5kKCdkaXYnKVxuXHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdsYXllci1ncm91cC1idG4gYnRuJylcblx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGxheWVyR3JvdXApIHtcblxuXHRcdFx0XHRcdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgdG9nZ2xlIHRoZSBsYXllciBsaXN0IGFjY29yZGlhbnNcblx0XHRcdFx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0XHRcdFx0ICBldmVudENhdGVnb3J5OiAnbGF5ZXIgbGlzdCcsXG5cdFx0XHRcdFx0XHQgIGV2ZW50QWN0aW9uOiAndG9nZ2xlICcgKyAhbGF5ZXJHcm91cC5hY3RpdmUsXG5cdFx0XHRcdFx0XHQgIGV2ZW50TGFiZWw6IGxheWVyR3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdCAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0bGF5ZXJHcm91cC5hY3RpdmUgPSAhbGF5ZXJHcm91cC5hY3RpdmU7XG5cdFx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKS5jbGFzc2VkKCdhY3RpdmUnLCAoKSA9PiBsYXllckdyb3VwLmFjdGl2ZSk7XG5cdFx0XHRcdFx0XHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KClcblx0XHRcdFx0XHRcdHVwZGF0ZVNoYXJlVXJsKClcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50ZXh0KGxheWVyR3JvdXAubmFtZSlcblx0XHRcdH0pXG5cdFx0XHQuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdsYXllci1ncm91cCcpO1xufVxuXG5mdW5jdGlvbiBtYWtlTGF5ZXJFbGVtcyAobGF5ZXJHcm91cHMsIGxheWVycykge1xuXHRsYXllckdyb3Vwcy5zZWxlY3RBbGwoJy5sYXllci1zZWxlY3QnKVxuXHRcdC5kYXRhKGxheWVyR3JvdXAgPT4gbGF5ZXJzW2xheWVyR3JvdXAuaWRdKVxuXHRcdC5lbnRlcigpLmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCAnbGF5ZXItc2VsZWN0Jylcblx0XHQuZWFjaChmdW5jdGlvbiAobGF5ZXIpIHtcblx0XHRcdHZhciBncm91cE5hbWUgPSB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5pZDtcblx0XHRcdHZhciBsYXllckRpdiA9IGQzLnNlbGVjdCh0aGlzKVxuXHRcdFx0bGF5ZXIubGF5ZXJEaXYgPSBsYXllckRpdlxuXHRcdFx0bWFrZUNoZWNrYm94KGxheWVyLCBsYXllckRpdik7XG5cdFx0XHRtYWtlTGFiZWwobGF5ZXIsIGxheWVyRGl2KTtcblx0XHRcdG1ha2VEZXNjcmlwdGlvbihsYXllciwgbGF5ZXJEaXYpO1xuXHRcdFx0bGF5ZXJEaXYubm9kZSgpLmFwcGVuZENoaWxkKG1ha2VMYXllclRvb2xzKGxheWVyKSk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VDaGVja2JveCAobGF5ZXIsIGxheWVyRGl2KSB7XG5cdGxheWVyRGl2LmFwcGVuZCgnaW5wdXQnKVxuXHRcdC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94Jylcblx0XHQuYXR0cignaWQnLCBsYXllciA9PiBsYXllci5pZClcblx0XHQuYXR0cignY2hlY2tlZCcsIChsYXllcikgPT4ge1xuXHRcdFx0cmV0dXJuIGxheWVyLmFjdGl2ZSA/ICdjaGVja2VkJyA6IG51bGw7XG5cdFx0fSlcblx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24obGF5ZXIpIHtcblx0XHRcdHRvZ2dsZUxheWVyKGxheWVyKVxuXHRcdFx0dG9nZ2xlTGF5ZXJUb29sc1VJKGxheWVyKVxuXHRcdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlTGF5ZXJUb29sc1VJIChsYXllcikge1xuXHRsYXllci5sYXllckRpdi5zZWxlY3QoJy5sYXllci10b29scy13cmFwcGVyJylcblx0XHQuY2xhc3NlZCgnYWN0aXZlJywgbGF5ZXIuYWN0aXZlKTtcblx0aWYgKGxheWVyLmFjdGl2ZSkge1xuXHRcdHZhciBzbGlkZXJIYW5kbGUgPSBsYXllci5sYXllckRpdi5zZWxlY3QoJy5vcGFjaXR5LXNsaWRlci1oYW5kbGUnKS5ub2RlKClcblx0XHRzZXRPcGFjaXR5U2xpZGVyUG9zaXRpb24obGF5ZXIsIHNsaWRlckhhbmRsZSwgbGF5ZXIub3BhY2l0aXkpXG5cdH0gICAgXG59XG5cbmZ1bmN0aW9uIG1ha2VMYWJlbChsYXllciwgbGF5ZXJEaXYpIHtcblx0bGF5ZXJEaXZcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xheWVyLWxhYmVsLXdyYXBwZXInKVxuXHRcdC5hcHBlbmQoJ2xhYmVsJylcblx0XHRcdC5hdHRyKCdmb3InLCBsYXllciA9PiBsYXllci5pZClcblx0XHRcdC5hdHRyKCdjbGFzcycsICdsYXllci1sYWJlbCcpXG5cdFx0XHQuaHRtbChsYXllciA9PiBsYXllci5uYW1lKTtcbn1cblxuZnVuY3Rpb24gbWFrZURlc2NyaXB0aW9uIChsYXllciwgbGF5ZXJEaXYpIHtcblx0aWYgKGxheWVyLmluZm8gJiYgbGF5ZXIuaW5mbyAhPT0gJycpIHtcblx0XHRsYXllckRpdi5hcHBlbmQoJ2RpdicpXG5cdFx0XHQuYXR0cignY2xhc3MnLCAnbGF5ZXItaW5mby1idG4td3JhcHBlcicpXG5cdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKVxuXHRcdFx0XHRcdC5zZWxlY3QoJy5sYXllci1pbmZvLXdyYXBwZXInKVxuXHRcdFx0XHRcdC5jbGFzc2VkKCdhY3RpdmUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0ICBcblx0XHRcdFx0XHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGNsaWNrIG9uIGxheWVyIGluZm9cblx0XHRcdFx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0XHRcdFx0ICBldmVudENhdGVnb3J5OiAnbGF5ZXIgaW5mbycsXG5cdFx0XHRcdFx0XHQgIGV2ZW50QWN0aW9uOiAnY2xpY2tlZCcsXG5cdFx0XHRcdFx0XHQgIGV2ZW50TGFiZWw6IGxheWVyLm5hbWUgKyBcIiBcIiArICFkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnYWN0aXZlJyksXG5cdFx0XHRcdFx0XHQgIG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRcdFx0cmV0dXJuICFkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdFx0XHQuYXBwZW5kKCdpbWcnKVxuXHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGF5ZXItaW5mby1pY29uJylcblx0XHRcdFx0LmF0dHIoJ3NyYycsICdpbWdzL21vcmUtaW5mby1pY29uLTY0eDY0LnBuZycpXG5cdFx0XHRcdC5hdHRyKFwiYWx0XCIsIFwiUmVhZCBtb3JlIGFib3V0IHRoZSBcIiArIGxheWVyLm5hbWUgKyBcIiBsYXllclwiKVxuXHRcdFx0XHQuYXR0cihcInRpdGxlXCIsIFwiUmVhZCBtb3JlIGFib3V0IHRoZSBcIiArIGxheWVyLm5hbWUgKyBcIiBsYXllclwiKVxuXG5cdFx0bGF5ZXJEaXYuYXBwZW5kKCdkaXYnKVxuXHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xheWVyLWluZm8td3JhcHBlcicpXG5cdFx0XHQudGV4dChsYXllciA9PiBsYXllci5pbmZvKTtcblx0fVxufVxuXG5mdW5jdGlvbiBtYWtlTGF5ZXJUb29scyhsYXllciwgbGF5ZXJEaXYpIHtcblx0dmFyIGxheWVyVG9vbHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRsYXllclRvb2xzRGl2LmNsYXNzTGlzdC5hZGQoJ2xheWVyLXRvb2xzLXdyYXBwZXInKVxuXHRpZiAobGF5ZXIuYWN0aXZlKSBsYXllclRvb2xzRGl2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cblx0dmFyIG9wYWNpdHlTbGlkZXIgPSBtYWtlT3BhY2l0eVNsaWRlcihsYXllcik7XG5cdHZhciBsZWdlbmQgPSBtYWtlTGVnZW5kKGxheWVyKTtcblxuXHRsYXllclRvb2xzRGl2LmFwcGVuZENoaWxkKGxlZ2VuZClcblx0bGF5ZXJUb29sc0Rpdi5hcHBlbmRDaGlsZChvcGFjaXR5U2xpZGVyKVxuXG5cdHJldHVybiBsYXllclRvb2xzRGl2XG59XG5cbmZ1bmN0aW9uIG1ha2VMZWdlbmQgKGxheWVyLCBsYXllclRvb2xzV3JhcHBlcikge1xuXHR2YXIgbGVnZW5kV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdHZhciBsZWdlbmRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXHRsZWdlbmRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2xlZ2VuZC13cmFwcGVyJylcblx0bGVnZW5kSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgbGF5ZXIubGVnZW5kKVxuXHRsZWdlbmRXcmFwcGVyLmFwcGVuZENoaWxkKGxlZ2VuZEltZylcblx0cmV0dXJuIGxlZ2VuZFdyYXBwZXJcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3BhbmVsLmpzIiwiaW1wb3J0IHtHZXRNYXB9IGZyb20gXCIuL21hcFwiO1xuaW1wb3J0IHt1cGRhdGVTaGFyZVVybH0gZnJvbSBcIi4vc2hhcmVcIjtcbmltcG9ydCB7dG9nZ2xlTGF5ZXJUb29sc1VJfSBmcm9tIFwiLi9wYW5lbFwiO1xuLyoqXG4gKiBOZWVkZWQgZm9yIHRoZSBzaGFyZSB1cmwgc2luY2UgTGVhZmxldCBkb2VzIG5vdCBoYXZlIGEgZGVmYXVsdCB3YXkgdG8gc3VyZmFjZVxuICogdGhlIG9yZGVyIG9mIGxheWVycyBpbiB0aGUgbWFwXG4gKi9cbnZhciBfY3VycmVudF9sYXllcnMgPSBbXTtcbnZhciBfY3VycmVudF9sYXllcnNfb2JqZWN0cyA9IFtdO1xuXG4vKipcbiAqIE5vdGU6IGxheWVyIGlzIG5vdCB0aGUgbGVhZmxldCBjb25jZXB0IG9mIGEgbGF5ZXIsIGJ1dCByYXRoZXIgdGhlIGludGVybmFsXG4gKiAgICAgICBvYmplY3Qgd2hpY2ggdHJhY2tzIHRoZW0uIGxheWVyLm1hcExheWVyIGlzIHRoZSBwb2ludGVyIHRvIHRoZVxuICogICAgICAgbGVhZmxldCBsYXllci5cbiAqL1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRDdXJyZW50TGF5ZXJzICgpIHtcblx0cmV0dXJuIF9jdXJyZW50X2xheWVycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR1cm5PZmZOb25CYXNlTGF5ZXJzICgpIHtcblx0d2hpbGUgKF9jdXJyZW50X2xheWVyc19vYmplY3RzLmxlbmd0aCkge1xuXHRcdHZhciBsYXllciA9IF9jdXJyZW50X2xheWVyc19vYmplY3RzLnBvcCgpXG5cdFx0bGF5ZXIuYWN0aXZlID0gZmFsc2Vcblx0XHRkaXNhYmxlTGF5ZXIobGF5ZXIpXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXIuaWQpLmNoZWNrZWQgPSBmYWxzZVxuXHRcdHRvZ2dsZUxheWVyVG9vbHNVSShsYXllcilcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlRGVmYXVsdExheWVycyAobGF5ZXJzLCBkZWZhdWx0TGF5ZXJzKSB7XG5cdHZhciBpLCBqLCBwcm9wLCBsYXllcmdyb3VwO1xuXHR2YXIgZGVmYXVsdExheWVyO1xuXHR2YXIgZm91bmRMYXllcjtcblxuXHRpZiAoIWRlZmF1bHRMYXllcnMgfHwgZGVmYXVsdExheWVycy5sZW5ndGggPT09IDApIHJldHVybjtcblxuXHRmb3IgKGkgPSAwOyBpIDwgZGVmYXVsdExheWVycy5sZW5ndGg7IGkrKykge1xuXHRcdGZvdW5kTGF5ZXIgPSBmYWxzZTtcblx0XHRkZWZhdWx0TGF5ZXIgPSBkZWZhdWx0TGF5ZXJzW2ldO1xuXHRcdGZvciAocHJvcCBpbiBsYXllcnMpIHtcblx0XHRcdGlmICghbGF5ZXJzLmhhc093blByb3BlcnR5KHByb3ApKSByZXR1cm47XG5cdFx0XHRsYXllcmdyb3VwID0gbGF5ZXJzW3Byb3BdO1xuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGxheWVyZ3JvdXAubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0aWYgKGxheWVyZ3JvdXBbal0uaWQgPT09IGRlZmF1bHRMYXllcikge1xuXHRcdFx0XHRcdGVuYWJsZUxheWVyKGxheWVyZ3JvdXBbal0pO1xuXHRcdFx0XHRcdGZvdW5kTGF5ZXIgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZm91bmRMYXllcikgYnJlYWs7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVMYXllciAobGF5ZXIpIHtcblx0aWYgKCFsYXllci5hY3RpdmUpIHtcblx0XHRlbmFibGVMYXllcihsYXllcik7XG5cblx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyB0b2dnbGUgdGhlIGxheWVyIG9uXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ICBldmVudENhdGVnb3J5OiAnbGF5ZXInLFxuXHRcdCAgZXZlbnRBY3Rpb246ICd0b2dnbGUgb24nLFxuXHRcdCAgZXZlbnRMYWJlbDogbGF5ZXIubmFtZSxcblx0XHQgIG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXG5cdH0gZWxzZSB7XG5cdFx0ZGlzYWJsZUxheWVyKGxheWVyKTtcblxuXHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIHRvZ2dsZSB0aGUgbGF5ZXIgb2ZmXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ICBldmVudENhdGVnb3J5OiAnbGF5ZXInLFxuXHRcdCAgZXZlbnRBY3Rpb246ICd0b2dnbGUgb2ZmJyxcblx0XHQgIGV2ZW50TGFiZWw6IGxheWVyLm5hbWUsXG5cdFx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHR9KTtcblxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVMYXllciAobGF5ZXIpIHtcblx0dmFyIG1hcCA9IEdldE1hcCgpO1xuXG5cdGxheWVyLmFjdGl2ZSA9IHRydWU7XG5cdGxheWVyLm1hcExheWVyID0gbGF5ZXIubWFwTGF5ZXIgfHwgbWFrZVdtc1RpbGVMYXllcihsYXllcik7XG5cdG1hcC5hZGRMYXllcihsYXllci5tYXBMYXllcik7XG5cdGFkZExheWVyVG9JbnRlcm5hbFRyYWNrZXIobGF5ZXIpO1xuXHRtb3ZlT3ZlcmxheUxheWVyc1RvVG9wKCk7XG5cdHVwZGF0ZVNoYXJlVXJsKCk7XG59XG5cbmZ1bmN0aW9uIG1vdmVPdmVybGF5TGF5ZXJzVG9Ub3AgKCkge1xuXHR2YXIgbGF5ZXI7XG5cdHZhciBpLCBsO1xuXG5cdGZvciAoaSA9IDAsIGwgPSBfY3VycmVudF9sYXllcnNfb2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRsYXllciA9IF9jdXJyZW50X2xheWVyc19vYmplY3RzW2ldO1xuXHRcdGlmIChsYXllci50eXBlID09PSBcIm92ZXJsYXlcIikgbGF5ZXIubWFwTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkTGF5ZXJUb0ludGVybmFsVHJhY2tlciAobGF5ZXIpIHtcblx0X2N1cnJlbnRfbGF5ZXJzLnB1c2gobGF5ZXIuaWQpO1xuXHRfY3VycmVudF9sYXllcnNfb2JqZWN0cy5wdXNoKGxheWVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVMYXllciAobGF5ZXIpIHtcblx0dmFyIG1hcCA9IEdldE1hcCgpO1xuXG5cdGxheWVyLmFjdGl2ZSA9IGZhbHNlO1xuXHRpZiAobGF5ZXIubWFwTGF5ZXIgJiYgbWFwLmhhc0xheWVyKGxheWVyLm1hcExheWVyKSkge1xuXHRcdG1hcC5yZW1vdmVMYXllcihsYXllci5tYXBMYXllcik7XG5cdH1cblx0cmVtb3ZlTGF5ZXJGcm9tSW50ZXJuYWxUcmFja2VyKGxheWVyKTtcblx0dXBkYXRlU2hhcmVVcmwoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTGF5ZXJGcm9tSW50ZXJuYWxUcmFja2VyIChsYXllcikge1xuXHR2YXIgbG9jID0gX2N1cnJlbnRfbGF5ZXJzLmluZGV4T2YobGF5ZXIuaWQpO1xuXHRpZiAobG9jID09PSAtMSkgcmV0dXJuO1xuXHRfY3VycmVudF9sYXllcnMuc3BsaWNlKGxvYywgMSk7XG5cdF9jdXJyZW50X2xheWVyc19vYmplY3RzLnNwbGljZShsb2MsIDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGF5ZXJPcGFjaXR5IChsYXllciwgbmV3T3BhY2l0eSkge1xuXHRsYXllci5vcGFjaXR5ID0gbmV3T3BhY2l0eVxuXHRsYXllci5tYXBMYXllci5zZXRPcGFjaXR5KG5ld09wYWNpdHkpXG59XG5cbmZ1bmN0aW9uIG1ha2VXbXNUaWxlTGF5ZXIgKGxheWVyKSB7XG5cdHJldHVybiBMLnRpbGVMYXllci53bXMobGF5ZXIudXJsLCB7XG5cdFx0bGF5ZXJzOiBsYXllci5pZCxcblx0XHR0cmFuc3BhcmVudDogbGF5ZXIudHJhbnNwYXJlbnQgfHwgdHJ1ZSxcblx0XHR2ZXJzaW9uOiBsYXllci52ZXJzaW9uIHx8ICcxLjMuMCcsXG5cdFx0Y3JzOiBsYXllci5jcnMgfHwgTC5DUlMuRVBTRzkwMDkxMyxcblx0XHRmb3JtYXQ6IGxheWVyLmZvcm1hdCB8fCAnaW1hZ2UvcG5nJyxcblx0XHRvcGFjaXR5OiBsYXllci5vcGFjaXR5IHx8IC43NSxcblx0XHR0aWxlU2l6ZTogbGF5ZXIudGlsZVNpemUgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIikuY2xpZW50V2lkdGhcblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9sYXllci5qcyIsImltcG9ydCB7cmVtb3ZlQWxsUG9pbnRzT2ZJbnRlcmVzdH0gZnJvbSAnLi9wb2knXG5pbXBvcnQge3R1cm5PZmZOb25CYXNlTGF5ZXJzfSBmcm9tICcuL2xheWVyJ1xuaW1wb3J0IHtyZW1vdmVBbGxHcmFwaHN9IGZyb20gJy4vZ3JhcGgnXG5pbXBvcnQge3Jlc2V0UGFuZWxTdGF0ZX0gZnJvbSAnLi9wYW5lbCdcbmltcG9ydCB7dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodH0gZnJvbSAgJy4vcGFuZWwnXG5pbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tICcuL3NoYXJlJ1xuXG52YXIgbWFwO1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNYXAgKCkge1xuXHRyZW1vdmVBbGxQb2ludHNPZkludGVyZXN0KClcblx0cmVtb3ZlQWxsR3JhcGhzKClcblx0dHVybk9mZk5vbkJhc2VMYXllcnMoKVxuXHRyZXNldFBhbmVsU3RhdGUoKVxuXHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KClcblx0dXBkYXRlU2hhcmVVcmwoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlTWFwIChtYXBDb25maWcpIHtcblx0dmFyIGlkID0gbWFwQ29uZmlnLmlkIHx8IFwibWFwXCI7XG5cdHZhciBvcHRpb25zID0gbWFwQ29uZmlnLm9wdGlvbnMgfHwge1wic2Nyb2xsV2hlZWxab29tXCIgOiBmYWxzZX07XG5cdHZhciBpbml0aWFsQ2VudGVyID0gbWFwQ29uZmlnLmNlbnRlciB8fCBbXCIzOC41XCIsIFwiLTgxXCJdO1xuXHR2YXIgaW5pdGlhbFpvb20gPSBtYXBDb25maWcuem9vbSB8fCA2O1xuXG5cdG1hcCA9IEwubWFwKGlkLCBvcHRpb25zKS5zZXRWaWV3KGluaXRpYWxDZW50ZXIsIGluaXRpYWxab29tKTtcblx0TC5jb250cm9sLmF0dHJpYnV0aW9uKCkuYWRkVG8obWFwKVxuXG5cdHZhciBsZWFmbGV0Wm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxlYWZsZXQtY29udHJvbC16b29tLWluXCIpWzBdO1xuXG5cdGxlYWZsZXRab29tSW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZm9yIHNlYWNyY2ggYnkgYWRkcmVzc1xuXHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0XHRldmVudEFjdGlvbjogJ2NsaWNrIGJ1dHRvbicsXG5cdFx0XHRldmVudExhYmVsOiAnem9vbSBpbicsXG5cdFx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHR9KTtcblx0fSlcblxuXHR2YXIgbGVhZmxldFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGVhZmxldC1jb250cm9sLXpvb20tb3V0XCIpWzBdO1xuXG5cdGxlYWZsZXRab29tT3V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciBzZWFjcmNoIGJ5IGFkZHJlc3Ncblx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdtYXAnLFxuXHRcdFx0ZXZlbnRBY3Rpb246ICdjbGljayBidXR0b24nLFxuXHRcdFx0ZXZlbnRMYWJlbDogJ3pvb20gb3V0Jyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXHR9KVxuXG5cdG1hcC5vbihcImRyYWdlbmRcIiwgZnVuY3Rpb24oZSl7XG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZm9yIGRyYWcgKHBhbikgZW5kXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRldmVudENhdGVnb3J5OiAnbWFwJyxcblx0XHRcdGV2ZW50QWN0aW9uOiAnZHJhZycsXG5cdFx0XHRldmVudExhYmVsOiBKU09OLnN0cmluZ2lmeShtYXAuZ2V0Qm91bmRzKCkpLFxuXHRcdFx0bm9uSW50ZXJhY3Rpb246IHRydWVcblx0XHR9KTtcblx0fSlcblxuXHRtYXAub24oXCJ6b29tZW5kXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciB6b29tIGVuZFxuXHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0XHRldmVudEFjdGlvbjogJ3pvb20nLFxuXHRcdFx0ZXZlbnRMYWJlbDogSlNPTi5zdHJpbmdpZnkobWFwLmdldEJvdW5kcygpKSxcblx0XHRcdG5vbkludGVyYWN0aW9uOiB0cnVlXG5cdFx0fSk7XG5cdH0pXG5cdHJldHVybiBtYXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRNYXAgKCkge1xuXHRyZXR1cm4gbWFwO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvbWFwLmpzIiwiaW1wb3J0IHtjcmVhdGVHcmFwaERpdn0gZnJvbSAnLi9ncmFwaCc7XG5pbXBvcnQge2NyZWF0ZU1hcmtlciwgZ2V0SWNvbn0gZnJvbSAnLi9tYXJrZXInO1xuaW1wb3J0IHt1cGRhdGVTaGFyZVVybH0gZnJvbSAnLi9zaGFyZSc7XG5pbXBvcnQge0dldE1hcH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHtHZXRBY3RpdmVUYWIsIEhhbmRsZVRhYkNoYW5nZX0gZnJvbSAnLi90YWJzJztcbmltcG9ydCB7dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodH0gZnJvbSAnLi9wYW5lbCc7XG5cbnZhciBfcG9pbnRzX29mX2ludGVyZXN0ID0gW11cblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmRHcmFwaEV2ZW50cyAobWFwKSB7XG5cdG1hcC5vbihcImNsaWNrXCIsIGhhbmRsZU1hcENsaWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbFBvaW50c09mSW50ZXJlc3QgKCkge1xuXHR2YXIgbWFwID0gR2V0TWFwKClcblx0X3BvaW50c19vZl9pbnRlcmVzdC5mb3JFYWNoKHBvaSA9PiB7XG5cdFx0bWFwLnJlbW92ZUxheWVyKHBvaS5tYXJrZXIpXG5cdH0pXG5cdF9wb2ludHNfb2ZfaW50ZXJlc3QgPSBbXVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXBDbGljayAoZSkge1xuXHR2YXIgbWFwID0gdGhpcztcblx0dmFyIGxhdCA9IGUubGF0bG5nLmxhdDtcblx0dmFyIGxuZyA9IGUubGF0bG5nLmxuZztcblxuXHR2YXIgcG9pID0gY3JlYXRlUE9JKGxhdCwgbG5nLCBudWxsKTtcblx0QWRkUG9pbnRPZkludGVyZXN0VG9UcmFja2VyKHBvaSk7XG5cdFNldHVwUG9pbnRPZkludGVyZXN0VUkobWFwLCBwb2kpO1xuXHR1cGRhdGVTaGFyZVVybCgpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGV2ZW50IGNsaWNrIG9uIG1hcFxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRldmVudENhdGVnb3J5OiAnbWFwJyxcblx0XHRldmVudEFjdGlvbjogJ2NsaWNrJyxcblx0XHRldmVudExhYmVsOiBKU09OLnN0cmluZ2lmeSh7XCJhY3Rpb25cIjpcImFkZCBtYXAgbWFya2VyXCIsXCJsYXRcIjpsYXQsXCJsb25nXCI6bG5nfSksXG5cdFx0bm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHcmFwaFJlbW92ZXIgKG1hcCwgZGl2LCBtYXJrZXIsIHBvaSkge1xuXHR2YXIgZWxlbSA9IGNyZWF0ZUdyYXBoUmVtb3ZlckVsZW0oKTtcblx0ZGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmFwaC1lbGVtLWhlYWRlclwiKVswXS5hcHBlbmRDaGlsZChlbGVtKTtcblx0ZDMuc2VsZWN0KGVsZW0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgcmVtb3ZlIGdyYXBoXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRldmVudENhdGVnb3J5OiAnZ3JhcGgnLFxuXHRcdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0XHRldmVudExhYmVsOiAncmVtb3ZlJyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXG5cdFx0UmVtb3ZlUG9pbnRPZkludGVyZXN0RnJvbVRyYWNrZXIocG9pKVxuXHRcdFJlbW92ZVBvaW50T2ZJbnRlcmVzdFVJKG1hcCwgZGl2LCBtYXJrZXIpXG5cdFx0dXBkYXRlUGFuZWxEcmFnT3ZlcmxheUhlaWdodCgpXG5cdFx0dXBkYXRlU2hhcmVVcmwoKVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR3JhcGhSZW1vdmVyRWxlbSAoKSB7XG5cdHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0ZWxlbS5jbGFzc05hbWUgPSBcInJlbW92ZS1ncmFwaFwiO1xuXHRlbGVtLmlubmVyVGV4dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoXCIxMDAwNVwiKTtcblx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIlJlbW92ZSBncmFwaFwiKTtcblx0cmV0dXJuIGVsZW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRBbGxQb2ludHNPZkludGVyZXN0ICgpIHtcblx0cmV0dXJuIF9wb2ludHNfb2ZfaW50ZXJlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQT0kgKGxhdCwgbG5nLCBwbG90cykge1xuXHRyZXR1cm4ge1xuXHRcdGxhdDogbGF0LFxuXHRcdGxuZzogbG5nLFxuXHRcdHBsb3RzOiBwbG90cyB8fCBbXCJiYXNlbGluZVwiLCBcIjIwMTVcIiwgXCJ0aHJlc2hvbGRzXCJdXG5cdH1cbn1cblxuZnVuY3Rpb24gQWRkUG9pbnRPZkludGVyZXN0VG9UcmFja2VyIChwb2kpIHtcblx0X3BvaW50c19vZl9pbnRlcmVzdC5wdXNoKHBvaSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXR1cFBvaW50c09mSW50ZXJlc3QgKG1hcCwgbmV3UG9pcykge1xuXHRBZGRNdWx0aXBsZVBvaW50c09mSW50ZXJlc3QobmV3UG9pcylcblx0dmFyIHBvaXMgPSBHZXRBbGxQb2ludHNPZkludGVyZXN0KClcblx0dmFyIG1hcCA9IEdldE1hcCgpXG5cdHBvaXMuZm9yRWFjaChwb2kgPT4ge1xuXHRcdFNldHVwUG9pbnRPZkludGVyZXN0VUkobWFwLCBwb2kpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIEFkZE11bHRpcGxlUG9pbnRzT2ZJbnRlcmVzdCAocG9pcykge1xuXHRBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShfcG9pbnRzX29mX2ludGVyZXN0LCBwb2lzKTtcbn1cblxuZnVuY3Rpb24gUmVtb3ZlUG9pbnRPZkludGVyZXN0RnJvbVRyYWNrZXIocG9pVG9SZW1vdmUpIHtcblx0X3BvaW50c19vZl9pbnRlcmVzdCA9IF9wb2ludHNfb2ZfaW50ZXJlc3QuZmlsdGVyKHBvaSA9PiB7XG5cdFx0cmV0dXJuICEocG9pID09PSBwb2lUb1JlbW92ZSlcblx0fSk7XG59XG5cbmZ1bmN0aW9uIFNldHVwUG9pbnRPZkludGVyZXN0VUkgKG1hcCwgcG9pKSB7XG5cdHZhciBkaXYgPSBjcmVhdGVHcmFwaERpdihwb2kpO1xuXHR2YXIgbWFya2VyID0gY3JlYXRlTWFya2VyKHBvaS5sYXQsIHBvaS5sbmcpO1xuXHRwb2kuZ3JhcGhEaXYgPSBkaXZcblx0cG9pLm1hcmtlciA9IG1hcmtlclxuXHRtYXJrZXIuYWRkVG8obWFwKVxuXHRjcmVhdGVHcmFwaFJlbW92ZXIobWFwLCBkaXYsIG1hcmtlciwgcG9pKTtcblxuXHRkMy5zZWxlY3QoZGl2KS5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRtYXJrZXIuc2V0SWNvbihnZXRJY29uKCdob3ZlcicpKTtcblx0fSlcblx0ZDMuc2VsZWN0KGRpdikub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRtYXJrZXIuc2V0SWNvbihnZXRJY29uKCdncmFwaCcpKTtcblx0fSlcblx0bWFya2VyLm9uKCdjbGljayBkYmxjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0aGFuZGxlTWFya2VyTW91c2VFdmVudChlLCBwb2kpXG5cdH0pXG5cdG1hcmtlci5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHtcblx0XHRtYXJrZXIuc2V0SWNvbihnZXRJY29uKCdob3ZlcicpKVxuXHR9KVxuXHRtYXJrZXIub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRtYXJrZXIuc2V0SWNvbihnZXRJY29uKCdncmFwaCcpKVxuXHRcdHBvaS5ncmFwaERpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYW4tdG8tbWFya2VyLWJ0bicpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuXHR9KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXJrZXJNb3VzZUV2ZW50IChlLCBwb2kpIHtcblx0ZS5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdEhhbmRsZVRhYkNoYW5nZSgnZ3JhcGhzLWFjdGl2ZScpXG5cdHNjcm9sbFRvUG9pbnRPZkludGVyZXN0R3JhcGgocG9pKVxuXHR0cmlnZ2VyR3JhcGhBbmltYXRpb24ocG9pKVxufVxuXG5mdW5jdGlvbiB0cmlnZ2VyR3JhcGhBbmltYXRpb24gKHBvaSkge1xuXHRwb2kuZ3JhcGhEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFuLXRvLW1hcmtlci1idG4nKVswXS5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbn1cblxuZnVuY3Rpb24gc2Nyb2xsVG9Qb2ludE9mSW50ZXJlc3RHcmFwaCAocG9pKSB7XG5cdHZhciByaWdodFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JpZ2h0LXBhbmVsJyk7XG5cdHJpZ2h0UGFuZWwuc2Nyb2xsVG9wID0gcG9pLmdyYXBoRGl2Lm9mZnNldFRvcDtcbn1cblxuZnVuY3Rpb24gUmVtb3ZlUG9pbnRPZkludGVyZXN0VUkgKG1hcCwgZGl2LCBtYXJrZXIpIHtcblx0dmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGgtbGlzdCcpO1xuXHRsaXN0LnJlbW92ZUNoaWxkKGRpdik7XG5cdG1hcC5yZW1vdmVMYXllcihtYXJrZXIpO1xuXHR1cGRhdGVTaGFyZVVybCgpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9wb2kuanMiLCJpbXBvcnQge3VwZGF0ZVBhbmVsRHJhZ092ZXJsYXlIZWlnaHR9IGZyb20gJy4vcGFuZWwnXG5pbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tICcuL3NoYXJlJ1xuaW1wb3J0IHtHZXRNYXB9IGZyb20gJy4vbWFwJ1xuaW1wb3J0IHtHZXRBamF4T2JqZWN0fSBmcm9tICcuL3BhcnNlcidcblxudmFyIHRpcCA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gU2V0dXBHcmFwaHMgKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIuZ3JhcGgtdHlwZS1idG5cIikub24oXCJjbGlja1wiLCBoYW5kbGVHcmFwaFR5cGVCdG5DbGljayk7XG5cdGV4dGVuZERhdGVNb2R1bGUoKTtcblx0dGlwID0gZDMudGlwKCkuYXR0cignY2xhc3MnLCAnZDMtdGlwJykuaHRtbChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZDsgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBbGxHcmFwaHMoKSB7XG5cdHZhciBncmFwaExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGgtbGlzdCcpXG5cdHdoaWxlIChncmFwaExpc3QuZmlyc3RDaGlsZCkge1xuXHRcdGdyYXBoTGlzdC5yZW1vdmVDaGlsZChncmFwaExpc3QuZmlyc3RDaGlsZClcblx0fVxufVxuXG5mdW5jdGlvbiBleHRlbmREYXRlTW9kdWxlICgpIHtcblx0RGF0ZS5wcm90b3R5cGUuaXNMZWFwWWVhciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB5ZWFyID0gdGhpcy5nZXRGdWxsWWVhcigpO1xuXHRcdGlmICgoeWVhciAmIDMpICE9IDApIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gKCh5ZWFyICUgMTAwKSAhPSAwIHx8ICh5ZWFyICUgNDAwKSA9PSAwKTtcblx0fTtcblxuXHQvLyBHZXQgRGF5IG9mIFllYXJcblx0RGF0ZS5wcm90b3R5cGUuZ2V0RE9ZID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRheUNvdW50ID0gWzAsIDMxLCA1OSwgOTAsIDEyMCwgMTUxLCAxODEsIDIxMiwgMjQzLCAyNzMsIDMwNCwgMzM0XTtcblx0XHR2YXIgbW4gPSB0aGlzLmdldE1vbnRoKCk7XG5cdFx0dmFyIGRuID0gdGhpcy5nZXREYXRlKCk7XG5cdFx0dmFyIGRheU9mWWVhciA9IGRheUNvdW50W21uXSArIGRuO1xuXHRcdGlmIChtbiA+IDEgJiYgdGhpcy5pc0xlYXBZZWFyKCkpIGRheU9mWWVhcisrO1xuXHRcdHJldHVybiBkYXlPZlllYXI7XG5cdH07XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gR1JBUEggREFUQSBQUk9DRVNTSU5HIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gaGFuZGxlR3JhcGhEYXRhUmVzcG9uc2UgKGRpdiwgcG9pLCByZXNwb25zZSkge1xuXHRyZXNwb25zZSA9IHJlc3BvbnNlLnJlcGxhY2UoL1xcW3xcXF18XFwnL2csIFwiXCIpLnNwbGl0KFwiLCBcIik7XG5cdGRyYXdHcmFwaChyZXNwb25zZSwgZGl2LCBwb2kpO1xuXHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KClcbn1cblxuZnVuY3Rpb24gZ2V0RGF0YShwb2ksIGRpdikge1xuXHR2YXIgdXJsID0gXCJodHRwczovL2ZjYXYtbmR2aS5uZW1hYy5vcmcvbGFuZGRhdF9wcm9kdWN0LmNnaT9hcmdzPVwiICsgcG9pLmxuZyArIFwiLFwiICsgcG9pLmxhdDtcblx0dmFyIG9SZXEgPSBHZXRBamF4T2JqZWN0KGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdGhhbmRsZUdyYXBoRGF0YVJlc3BvbnNlKGRpdiwgcG9pLCByZXNwb25zZSlcblx0fSlcblxuXHRvUmVxLm9wZW4oXCJHRVRcIiwgdXJsKTtcblx0b1JlcS5zZW5kKClcbn1cblxuZnVuY3Rpb24gc3BsaXREYXRhKGRhdGEpIHtcblx0dmFyIGk7XG5cdGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0ZGF0YVtpXSA9IGRhdGFbaV0uc3BsaXQoXCIsXCIpO1xuXHR9XG5cdHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiByZXByb2Nlc3NEYXRhIChvcmlnZGF0YSkge1xuXHR2YXIgZXhwZWN0ZWRZZWFyTGVuZ3RoID0gNDY7XG5cdHZhciBkYXRhID0ge307XG5cdHZhciBwb2ludDtcblx0dmFyIGtleTtcblx0dmFyIGksIGo7XG5cblx0ZGF0YVtcImtleXNcIl0gPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IG9yaWdkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0cG9pbnQgPSBvcmlnZGF0YVtpXTtcblx0XHRrZXkgPSBwb2ludFswXS5zdWJzdHJpbmcoMCw0KTtcblx0XHRpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0ZGF0YVtrZXldID0gW107XG5cdFx0XHRkYXRhW1wia2V5c1wiXS5wdXNoKGtleSk7XG5cdFx0fVxuXHRcdGRhdGFba2V5XS5wdXNoKHBvaW50KTtcblx0fVxuXG5cdHZhciBrZXlzVG9CZURlbGV0ZWQgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IGRhdGEua2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdGtleSA9IGRhdGEua2V5c1tpXTtcblx0XHRpZiAoZGF0YVtrZXldLmxlbmd0aCAhPT0gZXhwZWN0ZWRZZWFyTGVuZ3RoKSB7XG5cdFx0XHRrZXlzVG9CZURlbGV0ZWQucHVzaChrZXkpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAoaSA9IDA7IGkgPCBrZXlzVG9CZURlbGV0ZWQubGVuZ3RoOyBpKyspIHtcblx0XHRrZXkgPSBrZXlzVG9CZURlbGV0ZWRbaV07XG5cdFx0ZGVsZXRlIGRhdGFba2V5XTtcblx0XHRkYXRhLmtleXMuc3BsaWNlKGRhdGEua2V5cy5pbmRleE9mKGtleSksIDEpO1xuXHR9XG5cblx0dmFyIGRhdGFGb3JCYXNlbGluZTtcblx0dmFyIG1lYW47XG5cdGRhdGFbXCJiYXNlbGluZVwiXSA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgZXhwZWN0ZWRZZWFyTGVuZ3RoOyBpKyspIHtcblx0XHRkYXRhRm9yQmFzZWxpbmUgPSBbXTtcblx0XHRmb3IgKGogPSBpOyBqIDwgb3JpZ2RhdGEubGVuZ3RoOyBqICs9IGV4cGVjdGVkWWVhckxlbmd0aCkge1xuXHRcdFx0ZGF0YUZvckJhc2VsaW5lLnB1c2gocGFyc2VJbnQob3JpZ2RhdGFbal1bMV0sIDEwKSk7XG5cdFx0fVxuXG5cdFx0bWVhbiA9IGNvbXB1dGVBdmVyYWdlKGRhdGFGb3JCYXNlbGluZSk7XG5cdFx0ZGF0YVtcImJhc2VsaW5lXCJdLnB1c2gobWVhbik7XG5cdH1cblxuXHRyZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZUF2ZXJhZ2UgKGFycikge1xuXHR2YXIgc3VtID0gMCwgaSwgbDtcblxuXHRmb3IgKGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdHN1bSArPSBhcnJbaV07XG5cdH1cblxuXHRyZXR1cm4gKHN1bSAvIGwpLnRvU3RyaW5nKCk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gR1JBUEggSU5URVJGQUNFIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBoYW5kbGVHcmFwaFR5cGVCdG5DbGljayAoKSB7XG5cdHZhciB0eXBlID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpO1xuXHR2YXIgYWN0aXZlVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmFwaC10eXBlLWJ0biBhY3RpdmVcIilbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKTtcblxuXHRpZiAodHlwZSA9PT0gYWN0aXZlVHlwZSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGNsaWNrIG9uIGdyYXBoIHR5cGVcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdCAgZXZlbnRDYXRlZ29yeTogJ2dyYXBoIHR5cGUnLFxuXHQgIGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuXHQgIGV2ZW50TGFiZWw6IHR5cGUsXG5cdCAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xuXG5cdEhhbmRsZUdyYXBoVGFiQ2hhbmdlKHR5cGUsIGFjdGl2ZVR5cGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZGxlR3JhcGhUYWJDaGFuZ2UgKGdyYXBoVHlwZSkge1xuXHRpZiAoIWlzR3JhcGhMaXN0RW1wdHkoKSkge1xuXHRcdHZhciBvbGRBY3RpdmVHcmFwaEVsZW1IZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdncmFwaC1lbGVtJylbMF0uc2Nyb2xsSGVpZ2h0XG5cdFx0dmFyIG9sZEFjdGl2ZUdyYXBoSW5mb0hlaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dyYXBoLXR5cGUtaW5mbyBhY3RpdmUnKVswXS5zY3JvbGxIZWlnaHRcblx0XHR2YXIgcmlnaHRQYW5lbFNjcm9sbFRvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyaWdodC1wYW5lbCcpLnNjcm9sbFRvcFxuXHR9XG5cdGRpc2FibGVBY3RpdmVHcmFwaFRhYigpO1xuXHRlbmFibGVHcmFwaFRhYihncmFwaFR5cGUpO1xuXHRpZiAoIWlzR3JhcGhMaXN0RW1wdHkoKSkgYWRqdXN0U2Nyb2xsUG9zaXRpb24ob2xkQWN0aXZlR3JhcGhJbmZvSGVpZ2h0LCBvbGRBY3RpdmVHcmFwaEVsZW1IZWlnaHQsIHJpZ2h0UGFuZWxTY3JvbGxUb3ApXG5cdHVwZGF0ZVNoYXJlVXJsKCk7XG59XG5cbmZ1bmN0aW9uIGlzR3JhcGhMaXN0RW1wdHkoKSB7XG5cdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdncmFwaC1lbGVtJylbMF0gPT09IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBhZGp1c3RTY3JvbGxQb3NpdGlvbihvbGRHcmFwaEluZm9IZWlnaHQsIG9sZEdyYXBoRWxlbUhlaWdodCwgb2xkUmlnaHRQYW5lbFNjcm9sbFRvcCkge1xuXHR2YXIgbmV3R3JhcGhJbmZvSGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ3JhcGgtdHlwZS1pbmZvIGFjdGl2ZScpWzBdLnNjcm9sbEhlaWdodFxuXHR2YXIgbmV3R3JhcGhFbGVtSGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ3JhcGgtZWxlbScpWzBdLnNjcm9sbEhlaWdodFxuXG5cdHZhciBuZXdHcmFwaEVsZW1IZWlnaHRTY2FsZSA9IChuZXdHcmFwaEVsZW1IZWlnaHQgLyBvbGRHcmFwaEVsZW1IZWlnaHQpXG5cdHZhciBuZXdSaWdodFBhbmVsU2Nyb2xsVG9wID0gbmV3R3JhcGhJbmZvSGVpZ2h0ICsgKFxuXHRcdChvbGRSaWdodFBhbmVsU2Nyb2xsVG9wIC0gb2xkR3JhcGhJbmZvSGVpZ2h0KSAqIG5ld0dyYXBoRWxlbUhlaWdodFNjYWxlXG5cdClcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmlnaHQtcGFuZWwnKS5zY3JvbGxUb3AgPSBuZXdSaWdodFBhbmVsU2Nyb2xsVG9wXG59XG5cbmZ1bmN0aW9uIGRpc2FibGVBY3RpdmVHcmFwaFRhYiAoKSB7XG5cdHZhciBhY3RpdmVFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyYXBoLXR5cGUtYnRuIGFjdGl2ZVwiKVswXTtcblx0dmFyIGFjdGl2ZUNsYXNzID0gXCJncmFwaC1cIiArIGFjdGl2ZUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpO1xuXG5cdGFjdGl2ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaC1saXN0XCIpLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBlbmFibGVHcmFwaFRhYiAoZ3JhcGhUeXBlKSB7XG5cdGQzLnNlbGVjdChcIi5ncmFwaC10eXBlLWJ0bltkYXRhLXR5cGU9J1wiICsgZ3JhcGhUeXBlICsgXCInXVwiKS5jbGFzc2VkKFwiYWN0aXZlXCIsIHRydWUpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXBoLWxpc3RcIikuY2xhc3NMaXN0LmFkZChcImdyYXBoLVwiICsgZ3JhcGhUeXBlKTtcblx0ZDMuc2VsZWN0QWxsKCcuZ3JhcGgtdHlwZS1pbmZvJylcblx0LmNsYXNzZWQoJ2FjdGl2ZScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZ3JhcGhUeXBlID09PSB0aGlzLmlkLnNwbGl0KCctJylbMF1cblx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUdyYXBoRGl2IChwb2kpIHtcblx0dmFyIGRlY2ltYWxQbGFjZXMgPSAzXG5cdHZhciBsYXRTaG9ydCA9IHJvdW5kRmxvYXQocG9pLmxhdCwgZGVjaW1hbFBsYWNlcylcblx0dmFyIGxuZ1Nob3J0ID0gcm91bmRGbG9hdChwb2kubG5nLCBkZWNpbWFsUGxhY2VzKVxuXHR2YXIgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHZhciBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR3cmFwcGVyLmFwcGVuZENoaWxkKGhlYWRlcilcblx0dmFyIHpvb21Ub01hcmtlckJ1dHRvbiA9IG1ha2Vab29tVG9NYXBNYXJrZXJCdXR0b24ocG9pKVxuXHR2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTGF0OiBcIiArIGxhdFNob3J0ICsgXCIsIExvbmc6IFwiICsgbG5nU2hvcnQpO1xuXHR2YXIgY29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGNvbnRlbnREaXYuY2xhc3NOYW1lID0gXCJncmFwaC1sYXQtbG9uXCI7XG5cdGNvbnRlbnREaXYuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cblx0aGVhZGVyLmFwcGVuZENoaWxkKHpvb21Ub01hcmtlckJ1dHRvbilcblx0aGVhZGVyLmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuXG5cdHZhciBsb2FkaW5nRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0bG9hZGluZ0Rpdi5jbGFzc0xpc3QuYWRkKFwiZ3JhcGgtbG9hZGluZy1kaXZcIik7XG5cdHdyYXBwZXIuYXBwZW5kQ2hpbGQobG9hZGluZ0Rpdik7XG5cblx0d3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiZ3JhcGgtZWxlbVwiKTtcblx0d3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiZ3JhcGgtbG9hZGluZ1wiKTtcblx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJncmFwaC1lbGVtLWhlYWRlclwiKTtcblxuXHR2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JhcGgtbGlzdFwiKTtcblx0bGlzdC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblx0Z2V0RGF0YShwb2ksIHdyYXBwZXIpO1xuXHRyZXR1cm4gd3JhcHBlcjtcbn1cblxuZnVuY3Rpb24gbWFrZVpvb21Ub01hcE1hcmtlckJ1dHRvbihwb2kpIHtcblx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcblx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpXG5cdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYW4tdG8tbWFya2VyLWJ0bicpXG5cdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU2hvdyBPbiBNYXBcIlxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uIChwb2ksIGUpIHtcblx0XHR2YXIgbWFwID0gR2V0TWFwKClcblx0XHRtYXAucGFuVG8oW3BvaS5sYXQsIHBvaS5sbmddKVxuXG5cdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgY2xpY2sgb24gc2hvdyBvbiBtYXBcblx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHQgIGV2ZW50Q2F0ZWdvcnk6ICdncmFwaCcsXG5cdFx0ICBldmVudEFjdGlvbjogJ2NsaWNrJyxcblx0XHQgIGV2ZW50TGFiZWw6ICd7XCJzaG93IG9uIG1hcFwiOntcImxhdFwiOicgKyBwb2kubGF0ICsgJyxcImxvbmdcIjonKyAgcG9pLmxuZysgJ319Jyxcblx0XHQgIG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdH0pO1xuXG5cdH0uYmluZChidXR0b24sIHBvaSlcblx0cmV0dXJuIGJ1dHRvblxufVxuXG5mdW5jdGlvbiBkcmF3R3JhcGgoZGF0YSwgZGl2LCBwb2kpIHtcblx0ZGF0YSA9IHNwbGl0RGF0YShkYXRhKTtcblx0dmFyIHJlcHJvY2Vzc2VkRGF0YSA9IHJlcHJvY2Vzc0RhdGEoZGF0YSk7XG5cdG1ha2VVcERvd25MaW5lR3JhcGgoZGF0YSwgZGl2KTtcblx0bWFrZVVwRG93bk92ZXJsYXBpbmdMaW5lR3JhcGhXaXRoQ2hlY2tib3hlcyhyZXByb2Nlc3NlZERhdGEsIGRpdiwgcG9pKTtcblx0ZHJhd1VwRG93blBvbGFyV2l0aENoZWNrYm94ZXNBbmRUaHJlc2hvbGRzKHJlcHJvY2Vzc2VkRGF0YSwgZGl2LCBwb2kpO1xuXHRkaXYuY2xhc3NMaXN0LnJlbW92ZShcImdyYXBoLWxvYWRpbmdcIik7XG59XG5cbmZ1bmN0aW9uIHJvdW5kRmxvYXQobnVtYmVyLCBkZWNpbWFsUGxhY2VzKSB7XG5cdHJldHVybiBNYXRoLnJvdW5kKG51bWJlciAqIE1hdGgucG93KDEwLCBkZWNpbWFsUGxhY2VzKSkgLyAoTWF0aC5wb3coMTAsIGRlY2ltYWxQbGFjZXMpKVxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8gVElNRVNFUklFUyBMSU5FIEdSQVBIIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIG1ha2VVcERvd25MaW5lR3JhcGggKGRhdGEsIGRpdikge1xuXHQvLyBTZXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNhbnZhcyAvIGdyYXBoXG5cdHZhciBtYXJnaW4gPSB7dG9wOiAzMCwgcmlnaHQ6IDIwLCBib3R0b206IDMwLCBsZWZ0OiAyOX0sXG5cdHdpZHRoID0gNTgwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG5cdGhlaWdodCA9IDI3MCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuXG5cdC8vIFNldCB0aGUgcmFuZ2VzXG5cdHZhciB4ID0gZDMuc2NhbGVUaW1lKCkucmFuZ2UoWzAsIHdpZHRoXSlcblx0XHQuZG9tYWluKFtcblx0XHRcdHBhcnNlRGF0ZShkYXRhWzBdWzBdKSxcblx0XHRcdHBhcnNlRGF0ZShkYXRhW2RhdGEubGVuZ3RoLTFdWzBdKVxuXHRcdF0pO1xuXHR2YXIgeSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW2hlaWdodCwgMF0pXG5cdFx0LmRvbWFpbihbMCwgMTAwXSk7XG5cblx0Ly8gRGVmaW5lIHRoZSBheGVzXG5cdHZhciB4QXhpcyA9IGQzLmF4aXNCb3R0b20oeClcblx0XHQudGlja3MoMTYpXG5cdFx0LnRpY2tGb3JtYXQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdHJldHVybiBkLmdldEZ1bGxZZWFyKCk7XG5cdFx0fSk7XG5cblx0dmFyIHlBeGlzID0gZDMuYXhpc0xlZnQoeSlcblx0XHQudGlja3MoNik7XG5cblx0Ly8gRGVmaW5lIHRoZSBsaW5lXG5cdHZhciB2YWx1ZWxpbmUgPSBkMy5saW5lKClcblx0XHQueChmdW5jdGlvbihkKSB7IHJldHVybiB4KHBhcnNlRGF0ZShkWzBdKSk7IH0pXG5cdFx0LnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geShkWzFdKTsgfSk7XG5cblx0dmFyIHdyYXBwZXIgPSBkMy5zZWxlY3QoZGl2KVxuXHRcdC5hcHBlbmQoXCJkaXZcIilcblx0XHQuY2xhc3NlZChcInRpbWVzZXJpZXMtZ3JhcGhcIiwgdHJ1ZSk7XG5cblx0Ly8gQWRkcyB0aGUgc3ZnIGNhbnZhc1xuXHR2YXIgc3ZnID0gd3JhcHBlci5hcHBlbmQoXCJzdmdcIilcblx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblx0XHQuYXR0cigndmlld0JveCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciB3ID0gd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodFxuXHRcdFx0dmFyIGggPSBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbVxuXHRcdFx0cmV0dXJuICcwIDAgJyArIHcgKyAnICcgKyBoXG5cdFx0fSlcblx0XHQuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpXG5cdFx0LmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG5cblx0c3ZnLmNhbGwodGlwKTtcblxuXHQvLyBBZGQgdGhlIHZhbHVlbGluZSBwYXRoLlxuXHRkcmF3TGluZWFyUGF0aChkYXRhLCB2YWx1ZWxpbmUsIHN2Zyk7XG5cblx0Ly8gQWRkIHRoZSBYIEF4aXNcblx0c3ZnLmFwcGVuZChcImdcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwieCBheGlzXCIpXG5cdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIGhlaWdodCArIFwiKVwiKVxuXHRcdC5jYWxsKHhBeGlzKTtcblxuXHQvLyBBZGQgdGhlIFkgQXhpc1xuXHRzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ5IGF4aXNcIilcblx0XHQuY2FsbCh5QXhpcyk7XG5cdC8qKlxuXHQgKiBUaGlzIGJsb2NrIG9mIGNvZGUgZHJhd3MgdGhlIHBvaW50IGF0IGVhY2ggZGF0YSBwb2ludFxuXHQgKi9cblx0ZHJhd0xpbmVhclBvaW50cyhkYXRhLCB2YWx1ZWxpbmUsIHN2Zyk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vIE9WRVJMQVBQSU5HIFRJTUVTRVJJRVMgTElORSBHUkFQSCAvLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIG1ha2VVcERvd25PdmVybGFwaW5nTGluZUdyYXBoV2l0aENoZWNrYm94ZXMgKGRhdGEsIGRpdiwgcG9pKSB7XG5cdHZhciBjaGFydHMgPSB7fTtcblxuXHQvLyBTZXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNhbnZhcyAvIGdyYXBoXG5cdHZhciBtYXJnaW4gPSB7dG9wOiAzMCwgcmlnaHQ6IDIwLCBib3R0b206IDMwLCBsZWZ0OiAyOX0sXG5cdFx0d2lkdGggPSA1MDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcblx0XHRoZWlnaHQgPSAyNzAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblxuXHR2YXIgYXZlcmFnZXMgPSBkYXRhLmJhc2VsaW5lO1xuXG5cdHZhciB4ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgd2lkdGhdKVxuXHRcdC5kb21haW4oWzAsIDM2NV0pO1xuXHR2YXIgeSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW2hlaWdodCwgMF0pXG5cdFx0LmRvbWFpbihbMCwgMTAwXSk7XG5cblx0Ly8gRGVmaW5lIHRoZSBheGVzXG5cdGZ1bmN0aW9uIGZvcm1hdE1vbnRoVGljayAoZCkge1xuXHRcdHJldHVybiAoTU9OVEhfTEFCRUxTWyhkLTE1KS8zMF0pO1xuXHR9XG5cdHZhciB4QXhpcyA9IGQzLmF4aXNCb3R0b20oeClcblx0XHQudGlja3MoMTEpXG5cdFx0LnRpY2tWYWx1ZXMoWzE1LCA0NSwgNzUsIDEwNSwgMTM1LCAxNjUsIDE5NSwgMjI1LCAyNTUsIDI4NSwgMzE1LCAzNDVdKVxuXHRcdC50aWNrRm9ybWF0KGZvcm1hdE1vbnRoVGljayk7XG5cblx0dmFyIHlBeGlzID0gZDMuYXhpc0xlZnQoeSlcblx0XHQudGlja3MoNik7XG5cblx0Ly8gRGVmaW5lIHRoZSBsaW5lXG5cdHZhciB2YWx1ZWxpbmUgPSBkMy5saW5lKClcblx0XHQueChmdW5jdGlvbihkLCBpKSB7IHJldHVybiAoQXJyYXkuaXNBcnJheShkKSA/IHgocGFyc2VKdWxpYW5EYXkoZFswXSkpIDogeCgoaSAqIDgpICsgMyApKTsgfSlcblx0XHQueShmdW5jdGlvbihkKSB7IHJldHVybiAoQXJyYXkuaXNBcnJheShkKSA/IHkoZFsxXSkgOiB5KGQpKTsgfSk7XG5cblx0dmFyIHdyYXBwZXIgPSBkMy5zZWxlY3QoZGl2KS5hcHBlbmQoXCJkaXZcIikuY2xhc3NlZChcIm92ZXJsYXBwaW5nLWdyYXBoXCIsIHRydWUpO1xuXG5cdC8vIEFkZHMgdGhlIHN2ZyBjYW52YXNcblx0dmFyIHN2ZyA9IHdyYXBwZXJcblx0XHQuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHQuYXR0cigndmlld0JveCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHcgPSB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0XG5cdFx0XHRcdHZhciBoID0gaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b21cblx0XHRcdFx0cmV0dXJuICcwIDAgJyArIHcgKyAnICcgKyBoXG5cdFx0XHR9KVxuXHRcdFx0LmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKVxuXHRcdFx0Ly8uYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHQvLy5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKVxuXHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLFxuXHRcdFx0XHQgIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG5cblx0c3ZnLmNhbGwodGlwKTtcblxuXHQvLyBBZGQgdGhlIFggQXhpc1xuXHRzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgaGVpZ2h0ICsgXCIpXCIpXG5cdFx0LmNhbGwoeEF4aXMpO1xuXG5cdC8vIEFkZCB0aGUgWSBBeGlzXG5cdHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInkgYXhpc1wiKVxuXHRcdC5jYWxsKHlBeGlzKTtcblxuXHR2YXIgcGxvdCwgaSwgbDtcblx0Zm9yIChpID0gMCwgbCA9IHBvaS5wbG90cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRwbG90ID0gcG9pLnBsb3RzW2ldO1xuXHRcdGlmIChwbG90ID09PSBcInRocmVzaG9sZHNcIikgY29udGludWU7XG5cdFx0Y2hhcnRzW3Bsb3RdID0ge1xuXHRcdFx0XCJwYXRoXCIgOiBkcmF3TGluZWFyUGF0aChkYXRhW3Bsb3RdLCB2YWx1ZWxpbmUsIHN2Zylcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBibG9jayBvZiBjb2RlIGRyYXdzIHRoZSBwb2ludCBhdCBlYWNoIGRhdGEgcG9pbnRcblx0ICovXG5cdGZvciAoaSA9IDAsIGwgPSBwb2kucGxvdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0cGxvdCA9IHBvaS5wbG90c1tpXTtcblx0XHRpZiAocGxvdCA9PT0gXCJ0aHJlc2hvbGRzXCIpIGNvbnRpbnVlO1xuXHRcdGNoYXJ0c1twbG90XS5wb2ludHMgPSBkcmF3TGluZWFyUG9pbnRzKGRhdGFbcGxvdF0sIHZhbHVlbGluZSwgc3ZnKTtcblx0fVxuXG5cdHZhciBpbnB1dHdyYXBwZXIgPSB3cmFwcGVyLmFwcGVuZChcImRpdlwiKS5jbGFzc2VkKFwiaW5wdXQtd3JhcHBlclwiLCB0cnVlKTtcblxuXHRkYXRhLmtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0Y3JlYXRlQ2hlY2tib3goaW5wdXR3cmFwcGVyLCBrZXksIFwib3ZlcmxhcHBpbmdcIiwgcG9pLCBjaGFydHMsIGRhdGEsIHZhbHVlbGluZSwgc3ZnLCBhdmVyYWdlcyk7XG5cdH0pO1xuXG5cdGNyZWF0ZUNoZWNrYm94KGlucHV0d3JhcHBlciwgXCJiYXNlbGluZVwiLCBcIm92ZXJsYXBwaW5nXCIsIHBvaSwgY2hhcnRzLCBkYXRhLCB2YWx1ZWxpbmUsIHN2ZywgYXZlcmFnZXMpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFBPTEFSIEdSQVBIIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGRyYXdVcERvd25Qb2xhcldpdGhDaGVja2JveGVzQW5kVGhyZXNob2xkcyAoZGF0YSwgZGl2LCBwb2kpIHtcblx0dmFyIHdpZHRoID0gNDkwLFxuXHRcdGhlaWdodCA9IDQ5MCxcblx0XHRyYWRpdXMgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDIgLSAzMDtcblxuXHR2YXIgYXZlcmFnZXMgPSBkYXRhW1wiYmFzZWxpbmVcIl07XG5cdHZhciBjZW50ZXIgPSBmaW5kUG9sYXJDZW50ZXIoZGF0YSk7XG5cdHZhciB0aHJlc2hvbGRzID0gZmluZFBvbGFyVGhyZXNob2xkcyhhdmVyYWdlcywgY2VudGVyWzFdWzBdKTtcblxuXHQvKipcblx0ICogU2V0cyB1cCBzY2FsaW5nIG9mIGRhdGEuIFdlIGtub3cgdGhhdCB0aGUgbmR2aSB2YWx1ZXMgZmFsbCBiZXR3ZWVuXG5cdCAqIDAgJiAxMDAgc28gd2Ugc2V0IG91ciBkb21haW4gdG8gdGhhdC4gVGhlIHJhbmdlIGNvbnRyb2xzIHdoZXJlIHRoZVxuXHQgKiBwb2ludHMgd2lsbCBsaWUgaW4gb3VyIGdyYXBoLCBzbyB3ZSBzZXQgdGhlbSB0byBiZSBiZXR3ZWVuIDAgYW5kIHRoZVxuXHQgKiByYWRpdXMuXG5cdCAqL1xuXHR2YXIgciA9IGQzLnNjYWxlTGluZWFyKClcblx0XHQuZG9tYWluKFswLCAxMDBdKVxuXHRcdC5yYW5nZShbMCwgcmFkaXVzXSk7XG5cblx0LyoqXG5cdCAqIGZ1bmN0aW9uIHdoaWNoIHdpbGwgZHJhdyBlYWNoIHBvaW50LiBUbyBjb21wdXRlIHRoZSBkaXN0YW5jZSBmcm9tIHRoZVxuXHQgKiBjZW50ZXIgZWFjaCBwb2ludCBpcyB3ZSBwYXNzIHRoZSBkYXRhcG9pbnQgdG8gdGhlIGZ1bmN0aW9uIGRlZmluZWQgYWJvdmUuXG5cdCAqIFRvIGRldGVybWluZSB0aGUgYW5nbGUgZnJvbSB0aGUgb3JpZ2luIHdlIG5lZWQgdG8gY29udmVydCB0aGUgZGF5IHRvXG5cdCAqIHJhZGlhbnMsIHNvIHdlIGNvbnZlcnQgdGhlIGRheSB0byBhIG51bWJlciBiZXR3ZWVuIDAgJiAxIGFuZCB0aGVuIG11bHRpcGx5XG5cdCAqIGl0IGJ5IDIgcGkuXG5cdCAqL1xuXHR2YXIgbGluZSA9IGQzLnJhZGlhbExpbmUoKVxuXHRcdC5yYWRpdXMoZnVuY3Rpb24oZCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShkKSA/IHIoZFsxXSkgOiByKGQpOyB9KVxuXHRcdC5hbmdsZShmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHR2YXIgZGF5ID0gQXJyYXkuaXNBcnJheShkKSA/IHBhcnNlSnVsaWFuRGF5KGRbMF0pIDogKGkgKiA4KSArIDM7XG5cdFx0XHRyZXR1cm4gKCgoKGRheSAtIDEpJTM2NSkvMzY1KSAqICgyKk1hdGguUEkpKTtcblx0XHR9KTtcblxuXHQvKipcblx0ICogU2V0cyB1cCB0aGUgY2FudmFzIHdoZXJlIHRoZSBjaXJjbGUgd2lsbCBiZSBkcmF3bi5cblx0ICovXG5cdHZhciB3cmFwcGVyID0gZDMuc2VsZWN0KGRpdikuYXBwZW5kKFwiZGl2XCIpLmNsYXNzZWQoXCJwb2xhci1ncmFwaFwiLCB0cnVlKTtcblx0dmFyIHN2ZyA9IHdyYXBwZXIuYXBwZW5kKFwic3ZnXCIpXG5cdFx0Ly8uYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuXHRcdC8vLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxuXHRcdC5hdHRyKCd2aWV3Qm94JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuICcwIDAgJysgd2lkdGggKyAnICcgKyBoZWlnaHRcblx0XHR9KVxuXHRcdC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJylcblx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgd2lkdGggLyAyICsgXCIsXCIgKyBoZWlnaHQgLyAyICsgXCIpXCIpO1xuXG5cdHN2Zy5jYWxsKHRpcCk7XG5cblx0LyoqXG5cdCAqIFRoaXMgYmxvY2sgb2YgY29kZSBkcmF3cyB0aGUgYmlnIGNpcmNsZXMgb2YgdGhlIGdyYXBoICYgdGhlaXIgbGFiZWxzXG5cdCAqL1xuXHR2YXIgZ3IgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJyIGF4aXNcIilcblx0XHQuc2VsZWN0QWxsKFwiZ1wiKVxuXHRcdC5kYXRhKHIudGlja3MoNSkuc2xpY2UoMSkpXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiZ1wiKTtcblxuXHRnci5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHQuYXR0cihcInJcIiwgcik7XG5cblx0Z3IuYXBwZW5kKFwidGV4dFwiKVxuXHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiAtcihkKSAtIDQ7IH0pXG5cdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJyb3RhdGUoMTUpXCIpXG5cdFx0LnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHQudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcblxuXHQvKipcblx0ICogVGhpcyBibG9jayBvZiBjb2RlIGRyYXdzIHRoZSBsYWJlbHMgZm9yIGVhY2ggbW9udGggYW5kIHRoZSBsaW5lc1xuXHQgKiB0aGF0IGdvIG91dCB0byB0aGVtLlxuXHQgKi9cblx0dmFyIGdhX2EgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJhIGF4aXNcIilcblx0XHQuc2VsZWN0QWxsKFwiZ1wiKVxuXHRcdC5kYXRhKGQzLnJhbmdlKDAsIDM2MCwgMzApKVxuXHRcdC5lbnRlcigpLmFwcGVuZChcImdcIilcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwicm90YXRlKFwiICsgKGQgLSA5MCkgKyBcIilcIjsgfSk7XG5cblx0Z2FfYS5hcHBlbmQoXCJsaW5lXCIpXG5cdFx0LmF0dHIoXCJ4MlwiLCByYWRpdXMpO1xuXG5cdGdhX2EuYXBwZW5kKFwidGV4dFwiKVxuXHRcdC5hdHRyKFwieFwiLCByYWRpdXMgKyA2KVxuXHRcdC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuXHRcdC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQgPCAzNjAgJiYgZCA+IDE4MCA/IFwiZW5kXCIgOiBudWxsOyB9KVxuXHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQgPCAzNjAgJiYgZCA+IDE4MCA/IFwicm90YXRlKDE4MCBcIiArIChyYWRpdXMgKyA2KSArIFwiLDApXCIgOiBudWxsOyB9KVxuXHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIE1PTlRIX0xBQkVMU1tkLzMwXTsgfSk7XG5cblx0LyoqXG5cdCAqIERyYXdzIHRoZSB0aHJlc2hvbGQgbGluZXNcblx0ICovXG5cdHZhciB0aHJlc2hvbGRFbGVtID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHQuc2VsZWN0QWxsKFwiZ1wiKVxuXHRcdC5kYXRhKHRocmVzaG9sZHMpXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJyb3RhdGUoXCIgKyAoZC5kYXRhWzFdWzBdIC0gOTApICsgXCIpXCI7IH0pO1xuXG5cdHRocmVzaG9sZEVsZW0uYXBwZW5kKFwibGluZVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXG5cdFx0LmF0dHIoXCJ4MlwiLCByYWRpdXMpO1xuXG5cdHRocmVzaG9sZEVsZW0uYXBwZW5kKFwidGV4dFwiKVxuXHRcdC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkgeyB2YXIgZGF5ID0gZC5kYXRhWzFdWzBdOyByZXR1cm4gZGF5IDwgMzYwICYmIGRheSA+IDE4MCA/IHJhZGl1cyArIDMwIDogcmFkaXVzIC0gMzB9KVxuXHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gKCgoKGQuZGF0YVsxXVswXSklMzY1KS8zNjUpICogKDIqTWF0aC5QSSkpICsgNjsgfSlcblx0XHQuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcblx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbihkKSB7IHZhciBkYXkgPSBkLmRhdGFbMV1bMF07IHJldHVybiBkYXkgPCAzNjAgJiYgZGF5ID4gMTgwID8gXCJtaWRkbGVcIiA6IG51bGw7IH0pXG5cdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyB2YXIgZGF5ID0gZC5kYXRhWzFdWzBdOyByZXR1cm4gZGF5IDwgMzYwICYmIGRheSA+IDE4MCA/IFwicm90YXRlKDE4MCBcIiArIChyYWRpdXMgKyA2KSArIFwiLDApXCIgOiBudWxsOyB9KVxuXHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGFiZWw7IH0pO1xuXG5cdHRocmVzaG9sZEVsZW0uc3R5bGUoXCJvcGFjaXR5XCIsIChwb2kucGxvdHMuaW5kZXhPZihcInRocmVzaG9sZHNcIikgIT09IC0xKSA/IDEgOiAwKTtcblxuXHQvKipcblx0ICogRHJhd3MgdGhlIGxpbmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgZGF0YVxuXHQgKi9cblx0dmFyIGNlbnRlckRheSA9IGNlbnRlclsxXVswXTtcblx0dmFyIGNlbnRlckRheU9wcG9zaXRlID0gKGNlbnRlckRheSArICgzNjUvMikpICUgMzY1O1xuXHR2YXIgY2VudGVyRGF5RGF0YSA9IFtjZW50ZXJEYXksIDEwMF07XG5cdHZhciBjZW50ZXJEYXlPcHBvc2l0ZURhdGEgPSBbY2VudGVyRGF5T3Bwb3NpdGUsIDEwMF07XG5cdHZhciBncm93aW5nU2Vhc29uRGF0YSA9IFtjZW50ZXJEYXlEYXRhLCBjZW50ZXJEYXlPcHBvc2l0ZURhdGFdXG5cblx0ZHJhd1BvbGFyUGF0aChncm93aW5nU2Vhc29uRGF0YSwgbGluZSwgc3ZnKVxuXHRcdC5jbGFzc2VkKFwiZ3Jvd2luZy1zZWFzb24tbGluZVwiLCBcInRydWVcIik7XG5cblx0ZHJhd1BvbGFyUGF0aChjZW50ZXIsIGxpbmUsIHN2Zylcblx0XHQuY2xhc3NlZChcImNlbnRlci1saW5lXCIsIFwidHJ1ZVwiKTtcblxuXHRzdmcuc2VsZWN0QWxsKFwicG9pbnRcIilcblx0XHQuZGF0YShbY2VudGVyWzFdXSlcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwiY2VudGVyXCIpXG5cdFx0LmF0dHIoXCJyXCIsIDQpXG5cdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0dmFyIGNvb3JzID0gbGluZShbZF0pLnNsaWNlKDEpLnNsaWNlKDAsIC0xKTtcblx0XHRcdHJldHVybiBcInRyYW5zbGF0ZShcIiArIGNvb3JzICsgXCIpXCJcblx0XHR9KVxuXHRcdC5hdHRyKFwic3Ryb2tlXCIsIFwiIzAwMFwiKVxuXHRcdC5hdHRyKFwiZmlsbFwiLCBcIiNlYTBjNDhcIilcblx0XHQub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0dGlwLnNob3coXCJDZW50ZXI6IFwiICArIFN0cmluZyhkWzFdKS5zdWJzdHJpbmcoMCwgNykpO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJyXCIsIDUpXG5cdFx0fSlcblx0XHQub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0dGlwLmhpZGUoKTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKFwiclwiLCA0KVxuXHRcdH0pO1xuXG5cdHZhciBjaGFydHMgPSB7fTtcblxuXHQvKipcblx0ICogVGhpcyBibG9jayBvZiBjb2RlIGRyYXdzIHRoZSBsaW5lIHRoYXQgdGhlIGRhdGEgZm9sbG93c1xuXHQgKi9cblx0dmFyIHBsb3QsIGksIGw7XG5cdGZvciAoaSA9IDAsIGwgPSBwb2kucGxvdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0cGxvdCA9IHBvaS5wbG90c1tpXTtcblx0XHRpZiAocGxvdCA9PT0gXCJ0aHJlc2hvbGRzXCIpIGNvbnRpbnVlO1xuXHRcdGNoYXJ0c1twbG90XSA9IHtcblx0XHRcdFwicGF0aFwiIDogZHJhd1BvbGFyUGF0aChkYXRhW3Bsb3RdLCBsaW5lLCBzdmcpXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgYmxvY2sgb2YgY29kZSBkcmF3cyB0aGUgcG9pbnQgYXQgZWFjaCBkYXRhIHBvaW50XG5cdCAqL1xuXHRmb3IgKGkgPSAwLCBsID0gcG9pLnBsb3RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdHBsb3QgPSBwb2kucGxvdHNbaV07XG5cdFx0aWYgKHBsb3QgPT09IFwidGhyZXNob2xkc1wiKSBjb250aW51ZTtcblx0XHRjaGFydHNbcGxvdF0ucG9pbnRzID0gZHJhd0xpbmVhclBvaW50cyhkYXRhW3Bsb3RdLCBsaW5lLCBzdmcpO1xuXHR9XG5cblx0dmFyIGlucHV0d3JhcHBlciA9IHdyYXBwZXIuYXBwZW5kKFwiZGl2XCIpLmNsYXNzZWQoXCJpbnB1dC13cmFwcGVyXCIsIHRydWUpO1xuXG5cdGRhdGEua2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRjcmVhdGVDaGVja2JveChpbnB1dHdyYXBwZXIsIGtleSwgXCJwb2xhclwiLCBwb2ksIGNoYXJ0cywgZGF0YSwgbGluZSwgc3ZnLCBhdmVyYWdlcyk7XG5cdH0pO1xuXG5cdGNyZWF0ZUNoZWNrYm94KGlucHV0d3JhcHBlciwgXCJiYXNlbGluZVwiLCBcInBvbGFyXCIsIHBvaSwgY2hhcnRzLCBkYXRhLCBsaW5lLCBzdmcsIGF2ZXJhZ2VzKTtcblxuXHR2YXIgdGhyZXNob2xkQ2hlY2tib3g9IGlucHV0d3JhcHBlci5hcHBlbmQoXCJkaXZcIilcblx0XHQuY2xhc3NlZChcInRocmVzaG9sZC1jaGVja2JveFwiLCB0cnVlKTtcblxuXHR0aHJlc2hvbGRDaGVja2JveC5hcHBlbmQoXCJpbnB1dFwiKVxuXHRcdC5hdHRyKFwidHlwZVwiLCBcImNoZWNrYm94XCIpXG5cdFx0LmF0dHIoXCJpZFwiLCBcInRocmVzaG9sZC1jaGVja2JveC1cIiArIHBvaS5sYXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSArIFwiLVwiICsgcG9pLmxuZy50b1N0cmluZygpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKVxuXHRcdC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgcG9pLnBsb3RzLmluZGV4T2YoXCJ0aHJlc2hvbGRzXCIpICE9PSAtMSlcblx0XHQub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdHRocmVzaG9sZEVsZW0uc3R5bGUoXCJvcGFjaXR5XCIsICh0aGlzLmNoZWNrZWQpID8gMSA6IDApO1xuXHRcdFx0dmFyIG9mZm9uID0gdGhpcy5jaGVja2VkID8gJ29mZicgOiAnb24nO1xuXG5cdFx0XHRpZiAodGhpcy5jaGVja2VkKSB7XG5cdFx0XHRcdGFkZEtleVRvUE9JKHBvaSwgXCJ0aHJlc2hvbGRzXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVtb3ZlS2V5RnJvbVBPSShwb2ksIFwidGhyZXNob2xkc1wiKTtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlU2hhcmVVcmwoKTtcblx0XHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGdyYXBoIHRocmVzaG9sZCBjbGljayBvZmZcblx0XHRcdGRpc3BhdGNoR3JhcGhDaGVja2JveENsaWNrKCd0aHJlc2hvbGQgcG9sYXIgdGltZXNlcmllcyAnICsgb2Zmb24pO1xuXHRcdH0pO1xuXG5cdHRocmVzaG9sZENoZWNrYm94LmFwcGVuZChcImxhYmVsXCIpXG5cdFx0LnRleHQoXCJUaHJlc2hvbGRzXCIpXG5cdFx0LmF0dHIoXCJmb3JcIiwgXCJ0aHJlc2hvbGQtY2hlY2tib3gtXCIgKyBwb2kubGF0LnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIikgKyBcIi1cIiArIHBvaS5sbmcudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XG59XG5cbi8qIFBPTEFSIEdSQVBIIEhFTFBFUlMgKi9cblxuZnVuY3Rpb24gZmluZFBvbGFyQ2VudGVyIChkYXRhKSB7XG5cdHZhciBpLCBqLCBsZW5ndGgsIGFycjtcblx0dmFyIHRvdGFsU3VtID0gMDtcblx0dmFyIGluY29tcGxldGVZZWFycyA9IDA7XG5cdHZhciBzdW07XG5cdGxlbmd0aCA9IDQ2O1xuXG5cdGZvciAoaSA9IDA7IGkgPCBkYXRhLmtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRhcnIgPSBkYXRhW2RhdGEua2V5c1tpXV07XG5cdFx0aWYgKGFyci5sZW5ndGggIT09IGxlbmd0aCkge1xuXHRcdFx0aW5jb21wbGV0ZVllYXJzKys7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0c3VtID0gMDtcblx0XHRmb3IgKGogPSAwOyBqIDwgbGVuZ3RoLzI7IGorKykge1xuXHRcdFx0c3VtICs9IChhcnJbal1bMV0gLSBhcnJbaisyM11bMV0pO1xuXHRcdH1cblx0XHRzdW0gPSBzdW0gLyAyMztcblx0XHR0b3RhbFN1bSArPSBzdW07XG5cdH1cblx0dG90YWxTdW0gPSBNYXRoLmFicyh0b3RhbFN1bSkgLyAoZGF0YS5rZXlzLmxlbmd0aCAtIGluY29tcGxldGVZZWFycyk7XG5cblx0dmFyIGFyZWFEaWZmID0gMTAwMDAwMDtcblx0dmFyIGNoZWNrRGlmZjtcblx0dmFyIGFyZWFJbmRleCA9IDA7XG5cdHZhciBsZWZ0QXJlYSwgcmlnaHRBcmVhO1xuXHR2YXIgYXZncyA9IGRhdGEuYmFzZWxpbmU7XG5cdHZhciBrLCBjb3VudGVyO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBsZW5ndGgvMjsgaSsrKSB7XG5cdFx0bGVmdEFyZWEgPSAwO1xuXHRcdHJpZ2h0QXJlYSA9IDA7XG5cdFx0Zm9yIChjb3VudGVyID0gMDsgY291bnRlciA8IGxlbmd0aC8yOyBjb3VudGVyKyspIHtcblx0XHRcdGogPSAoaSArIGNvdW50ZXIpICUgNDY7XG5cdFx0XHRrID0gKGogKyAyMykgJSA0NjtcblxuXHRcdFx0bGVmdEFyZWEgKz0gcGFyc2VJbnQoYXZnc1tqXSwgMTApO1xuXHRcdFx0cmlnaHRBcmVhICs9IHBhcnNlSW50KGF2Z3Nba10sMTApO1xuXHRcdH1cblx0XHRjaGVja0RpZmYgPSBNYXRoLmFicyhsZWZ0QXJlYSAtIHJpZ2h0QXJlYSk7XG5cdFx0aWYgKGNoZWNrRGlmZiA8IGFyZWFEaWZmKSB7XG5cdFx0XHRhcmVhRGlmZiA9IGNoZWNrRGlmZjtcblx0XHRcdGFyZWFJbmRleCA9IGk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGZpcnN0UmFkaXVzID0gcGFyc2VJbnQoYXZnc1thcmVhSW5kZXhdLCAxMCk7XG5cdHZhciBzZWNvbmRSYWRpdXMgPSBwYXJzZUludCgtYXZnc1thcmVhSW5kZXggKyAyM10sIDEwKTtcblxuXHR2YXIgbWlkcG9pbnQgPSAoZmlyc3RSYWRpdXMgKyBzZWNvbmRSYWRpdXMpIC8gMjtcblx0dmFyIGZpcnN0RGlmZiA9IE1hdGguYWJzKHRvdGFsU3VtIC0gbWlkcG9pbnQpO1xuXHR2YXIgc2Vjb25kRGlmZiA9IE1hdGguYWJzKC10b3RhbFN1bSAtIG1pZHBvaW50KTtcblx0aWYgKHNlY29uZERpZmYgPCBmaXJzdERpZmYpIHtcblx0XHRhcmVhSW5kZXggPSBhcmVhSW5kZXggKyAyMztcblx0fVxuXG5cdHZhciBjaXJjbGVjZW50ZXIgPSBbMCwgMF07XG5cdHZhciBkYXRhY2VudGVyID0gWyhhcmVhSW5kZXggKiA4KSArIDMsIHRvdGFsU3VtXTtcblxuXHRyZXR1cm4oW2NpcmNsZWNlbnRlciwgZGF0YWNlbnRlcl0pO1xufVxuXG4vKipcbiAqIHN0YXJ0RGF5IGlzIGFjdHVhbGx5IHRoZSBzZWFzb25hbGl0eSBpbmRleCwgaXQgc2hvdWxkIGJlIGZsaXBwZWRcbiAqL1xuZnVuY3Rpb24gZmluZFBvbGFyVGhyZXNob2xkcyAoZGF0YSwgc3RhcnREYXkpIHtcblx0dmFyIHN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKChzdGFydERheSAtIDMpIC8gOCk7XG5cdHN0YXJ0SW5kZXggKz0gKHN0YXJ0SW5kZXggPiAyMikgPyAoLTIzKSA6IDIzO1xuXHR2YXIgaSwgaiwgbGVuZ3RoLCBhcnI7XG5cdHZhciB0b3RhbFN1bSA9IDA7XG5cdHZhciBzdW07XG5cdGxlbmd0aCA9IDQ2O1xuXG5cdGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdGogPSAoc3RhcnRJbmRleCArIGkpICUgbGVuZ3RoO1xuXHRcdHRvdGFsU3VtICs9IHBhcnNlSW50KGRhdGFbal0sIDEwKTtcblx0fVxuXG5cdHZhciBmaWZ0ZWVuVGhyZXNob2xkID0gdG90YWxTdW0gKiAuMTU7XG5cdHZhciBlaWdodHlUaHJlc2hvbGQgPSB0b3RhbFN1bSAqIC44MDtcblx0dmFyIGZpZnRlZW5JbmRleEZvdW5kID0gZmFsc2UsXG5cdFx0ZWlnaHR5SW5kZXhGb3VuZCA9IGZhbHNlO1xuXHR2YXIgZmlmdGVlbkluZGV4LCBlaWdodHlJbmRleDtcblxuXHR0b3RhbFN1bSA9IDA7XG5cdGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdGogPSAoc3RhcnRJbmRleCArIGkpICUgbGVuZ3RoO1xuXHRcdHRvdGFsU3VtICs9IHBhcnNlSW50KGRhdGFbal0sIDEwKTtcblx0XHRpZiAoIWZpZnRlZW5JbmRleEZvdW5kICYmIHRvdGFsU3VtID4gZmlmdGVlblRocmVzaG9sZCkge1xuXHRcdFx0ZmlmdGVlbkluZGV4ID0gajtcblx0XHRcdGZpZnRlZW5JbmRleEZvdW5kID0gdHJ1ZTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAoIWVpZ2h0eUluZGV4Rm91bmQgJiYgdG90YWxTdW0gPiBlaWdodHlUaHJlc2hvbGQpIHtcblx0XHRcdGVpZ2h0eUluZGV4ID0gajtcblx0XHRcdGVpZ2h0eUluZGV4Rm91bmQgPSB0cnVlO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGNpcmNsZUNlbnRlciA9IFswLCAwXTtcblxuXHR2YXIgZmlmdGVlbkVuZCA9IFsoZmlmdGVlbkluZGV4ICogOCkgKyAzLCAxMDBdO1xuXHR2YXIgZWlnaHR5RW5kID0gWyhlaWdodHlJbmRleCAqIDgpICsgMywgMTAwXTtcblxuXHRyZXR1cm4gW1xuXHRcdHtcblx0XHRcdFwibGFiZWxcIiA6IFwiMTUlXCIsXG5cdFx0XHRcImRhdGFcIiA6IFtjaXJjbGVDZW50ZXIsIGZpZnRlZW5FbmRdXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImxhYmVsXCIgOiBcIjgwJVwiLFxuXHRcdFx0XCJkYXRhXCIgOiBbY2lyY2xlQ2VudGVyLCBlaWdodHlFbmRdXG5cdFx0fVxuXHRdO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gR1JBUEggSEVMUEVSUyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBkcmF3TGluZWFyUGF0aChkYXRhLCBsaW5lLCBzdmcpIHtcblx0cmV0dXJuIHN2Zy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcblx0XHQuYXR0cihcImRcIiwgbGluZShkYXRhKSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdQb2xhclBhdGgoZGF0YSwgbGluZSwgc3ZnKSB7XG5cdHJldHVybiBzdmcuYXBwZW5kKFwicGF0aFwiKVxuXHRcdC5kYXR1bShkYXRhKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXG5cdFx0LmF0dHIoXCJkXCIsIGxpbmUpO1xufVxuXG5mdW5jdGlvbiBkcmF3TGluZWFyUG9pbnRzKGRhdGEsIGxpbmUsIHN2Zykge1xuXHRyZXR1cm4gc3ZnLnNlbGVjdEFsbChcInBvaW50XCIpXG5cdFx0LmRhdGEoZGF0YSlcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHQuYXR0cihcInJcIiwgMilcblx0XHQuYXR0cihcImNsYXNzXCIsIFwicG9pbnRcIilcblx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHR2YXIgcG9pbnQgPSBBcnJheS5pc0FycmF5KGQpID8gZCA6IFsoaSo4KSArIDMsIGRdO1xuXHRcdFx0dmFyIGNvb3JzID0gbGluZShbcG9pbnRdKS5zbGljZSgxKS5zbGljZSgwLCAtMSk7XG5cdFx0XHRyZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBjb29ycyArIFwiKVwiXG5cdFx0fSlcblx0XHQvLy5hdHRyKFwiclwiLCAzKVxuXHRcdC5hdHRyKFwic3Ryb2tlXCIsIFwiIzAwMFwiKVxuXHRcdC5hdHRyKFwiZmlsbFwiLGZ1bmN0aW9uKGQsaSl7XG5cdFx0XHR2YXIgdmFsID0gQXJyYXkuaXNBcnJheShkKSA/IGRbMF0uc3Vic3RyaW5nKDAsIDQpIDogMDtcblx0XHRcdHJldHVybiBwdWxsRGlzdGluY3RDb2xvcih2YWwpXG5cdFx0fSlcblx0XHQub24oXCJtb3VzZW92ZXJcIiwgaGFuZGxlUG9pbnRNb3VzZW92ZXIpXG5cdFx0Lm9uKFwibW91c2VvdXRcIiwgaGFuZGxlUG9pbnRNb3VzZW91dCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBvaW50TW91c2VvdmVyKGQpIHtcblx0dmFyIHRpcFN0cmluZyA9IEFycmF5LmlzQXJyYXkoZCkgPyBmb3JtYXREYXRlKGRbMF0pICsgXCI6IFwiICArIGRbMV0gOiBcIkF2ZXJhZ2U6IFwiICArIGQ7XG5cdHRpcC5zaG93KHRpcFN0cmluZyk7XG5cdHRoaXMuc2V0QXR0cmlidXRlKFwiclwiLCBcIjRcIik7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBvaW50TW91c2VvdXQoZCkge1xuXHR0aXAuaGlkZSgpO1xuXHR0aGlzLnNldEF0dHJpYnV0ZShcInJcIiwgXCIyXCIpO1xuXG5cdHZhciBhY3RpdmVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyYXBoLXR5cGUtYnRuIGFjdGl2ZVwiKVswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIHRvb2wgdGlwIG9uIGdyYXBoIGRvIHRoaXMgb24gdGhlIG1vdXNlb3V0IHNvIG1vdXNlb3ZlciBkb3NlIG5vdCBkbyBhIGxvdCBvZiBldmVudHMuLi4uXG5cdC8vIHdlIG1pc3MgYSBmZXcgYnV0IHRoYXQgaXMgYmV0dGVyIHRoYW4gb3ZlciBjb3VudGluZy5cblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdCAgZXZlbnRDYXRlZ29yeTogJ2dyYXBoJyxcblx0ICBldmVudEFjdGlvbjogJ2hvdmVyJyxcblx0ICBldmVudExhYmVsOiBhY3RpdmVUeXBlICsgJyB0b29sIHRpcCcsXG5cdCAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDaGVja2JveCh3cmFwcGVyLCBrZXksIHR5cGUsIHBvaSwgY2hhcnRzLCBkYXRhLCBsaW5lLCBzdmcsIGF2ZXJhZ2VzKSB7XG5cdHZhciBjaGVja2JveFdyYXBwZXIgPSB3cmFwcGVyLmFwcGVuZChcImRpdlwiKTtcblx0dmFyIGxhdCA9IHBvaS5sYXQ7XG5cdHZhciBsbmcgPSBwb2kubG5nO1xuXG5cdGNoZWNrYm94V3JhcHBlci5hcHBlbmQoXCJpbnB1dFwiKVxuXHRcdC5hdHRyKFwidHlwZVwiLCBcImNoZWNrYm94XCIpXG5cdFx0LmF0dHIoXCJpZFwiLCB0eXBlICsgXCItXCIgKyBrZXkgKyBsYXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSArIFwiLVwiICsgbG5nLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIikpXG5cdFx0LmF0dHIoXCJkYXRhLWxpbmtcIiwga2V5ICsgbGF0LnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIikgKyBcIi1cIiArIGxuZy50b1N0cmluZygpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKVxuXHRcdC5hdHRyKFwidmFsdWVcIiwga2V5KVxuXHRcdC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgKHBvaS5wbG90cy5pbmRleE9mKGtleSkgIT09IC0xKSA/IHRydWUgOiBmYWxzZSlcblx0XHQub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBuZXdZZWFyID0gdGhpcy52YWx1ZTtcblx0XHRcdGlmICghdGhpcy5jaGVja2VkKSB7XG5cdFx0XHRcdGhhbmRsZUNoZWNrYm94RGlzYWJsZShjaGFydHMsIG5ld1llYXIpO1xuXHRcdFx0XHRyZW1vdmVLZXlGcm9tUE9JKHBvaSwga2V5KTtcblx0XHRcdFx0Ly9zZW5kIGdvb2dsZSBhbmFseXRpY3MgZ3JhcGggeWVhciBjbGljayBvZmZcblx0XHRcdFx0ZGlzcGF0Y2hHcmFwaENoZWNrYm94Q2xpY2sobmV3WWVhciArICcgJyArIHR5cGUgKyAnIHRpbWVzZXJpZXMgb2ZmJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoYW5kbGVDaGVja2JveEVuYWJsZShjaGFydHMsIG5ld1llYXIsIGRhdGEsIGxpbmUsIHN2ZywgYXZlcmFnZXMpO1xuXHRcdFx0XHRhZGRLZXlUb1BPSShwb2ksIGtleSk7XG5cdFx0XHRcdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGdyYXBoIHllYXIgY2xpY2sgb25cblx0XHRcdFx0ZGlzcGF0Y2hHcmFwaENoZWNrYm94Q2xpY2sobmV3WWVhciArICcgJyArIHR5cGUgKyAnIHRpbWVzZXJpZXMgb24nKTtcblx0XHRcdH1cblx0XHRcdGhhbmRsZUNoZWNrYm94U3luYyhrZXkgKyBsYXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSArIFwiLVwiICsgbG5nLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIiksIHRoaXMuY2hlY2tlZCk7XG5cdFx0XHR1cGRhdGVTaGFyZVVybCgpO1xuXHRcdH0pO1xuXG5cdGNoZWNrYm94V3JhcHBlci5hcHBlbmQoXCJsYWJlbFwiKVxuXHRcdC50ZXh0KGtleSAhPT0gXCJiYXNlbGluZVwiID8ga2V5IDogXCJCYXNlbGluZVwiKVxuXHRcdC5hdHRyKFwiZm9yXCIsIHR5cGUgKyBcIi1cIiArIGtleSArIGxhdC50b1N0cmluZygpLnJlcGxhY2UoXCIuXCIsIFwiXCIpICsgXCItXCIgKyBsbmcudG9TdHJpbmcoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XG5cblx0Y2hlY2tib3hXcmFwcGVyLmFwcGVuZChcImRpdlwiKVxuXHRcdC5zdHlsZShcImJhY2tncm91bmRcIiwgcHVsbERpc3RpbmN0Q29sb3Ioa2V5ICE9PSBcImJhc2VsaW5lXCIgPyBrZXkgOiAwKSlcblx0XHQuY2xhc3NlZChcImdyYXBoLXBpcC1leGFtcGxlXCIsIHRydWUpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDaGVja2JveERpc2FibGUgKGNoYXJ0cywgbmV3WWVhcikge1xuXHRjaGFydHNbbmV3WWVhcl0ucGF0aC5yZW1vdmUoKTtcblx0Y2hhcnRzW25ld1llYXJdLnBvaW50cy5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2hlY2tib3hFbmFibGUgKGNoYXJ0cywgbmV3WWVhciwgZGF0YSwgbGluZSwgc3ZnKSB7XG5cdGlmICghY2hhcnRzLmhhc093blByb3BlcnR5KG5ld1llYXIpKSB7XG5cdFx0Y2hhcnRzW25ld1llYXJdID0ge307XG5cdH1cblx0Y2hhcnRzW25ld1llYXJdLnBhdGggPSBkcmF3TGluZWFyUGF0aChkYXRhW25ld1llYXJdLCBsaW5lLCBzdmcpO1xuXHRjaGFydHNbbmV3WWVhcl0ucG9pbnRzID0gZHJhd0xpbmVhclBvaW50cyhkYXRhW25ld1llYXJdLCBsaW5lLCBzdmcpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDaGVja2JveFN5bmMgKGtleSwgY2hlY2tlZFN0YXR1cywgd3JhcHBlcikge1xuXHRkMy5zZWxlY3RBbGwoXCJpbnB1dFtkYXRhLWxpbms9J1wiICsga2V5ICsgXCInXVwiKS5lYWNoKGZ1bmN0aW9uIChwLCBqKSB7XG5cdFx0dmFyIGVsZW0gPSBkMy5zZWxlY3QodGhpcyk7XG5cdFx0aWYgKGVsZW0ucHJvcGVydHkoXCJjaGVja2VkXCIpICE9PSBjaGVja2VkU3RhdHVzKSB7XG5cdFx0XHRlbGVtLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBjaGVja2VkU3RhdHVzKTtcblx0XHRcdGVsZW0uZGlzcGF0Y2goXCJjaGFuZ2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlS2V5RnJvbVBPSSAocG9pLCBrZXkpIHtcblx0dmFyIGluZGV4ID0gcG9pLnBsb3RzLmluZGV4T2Yoa2V5KTtcblx0aWYgKGluZGV4ID09PSAtMSkgcmV0dXJuO1xuXHRwb2kucGxvdHMuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuZnVuY3Rpb24gYWRkS2V5VG9QT0kgKHBvaSwga2V5KSB7XG5cdGlmIChwb2kucGxvdHMuaW5kZXhPZihrZXkpICE9PSAtMSkgcmV0dXJuO1xuXHRwb2kucGxvdHMucHVzaChrZXkpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEdyYXBoQ2hlY2tib3hDbGljayAobGFiZWwpIHtcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ2dyYXBoJyxcblx0XHRldmVudEFjdGlvbjogJ2NsaWNrJyxcblx0XHRldmVudExhYmVsOiAgbGFiZWwsXG5cdFx0bm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwdWxsRGlzdGluY3RDb2xvciAoeWVhcikge1xuXHR2YXIgY29sb3JSYW1wID0gW1xuXHRcdFwiI2ZmZTQ3NlwiLFxuXHRcdFwiIzAzNjU5M1wiLFxuXHRcdFwiIzExNmM5MVwiLFxuXHRcdFwiIzFlNzM5MFwiLFxuXHRcdFwiIzJjN2I4ZVwiLFxuXHRcdFwiIzM5ODI4Y1wiLFxuXHRcdFwiIzRjOGM4YVwiLFxuXHRcdFwiIzVlOTU4OVwiLFxuXHRcdFwiIzcxOWY4N1wiLFxuXHRcdFwiIzgzYTg4NlwiLFxuXHRcdFwiIzk1YjE4M1wiLFxuXHRcdFwiI2E2YmE4MFwiLFxuXHRcdFwiI2I4YzM3Y1wiLFxuXHRcdFwiI2NhY2M3OVwiLFxuXHRcdFwiI2Q2ZDI3OVwiLFxuXHRcdFwiI2UyZDc3OVwiLFxuXHRcdFwiI2VmZGQ3OFwiLFxuXHRcdFwiI2ZiZTM3OFwiXG5cdF07XG5cblx0cmV0dXJuICh5ZWFyID09PSAwKSA/IFwiI2ZmZlwiIDogY29sb3JSYW1wW3BhcnNlSW50KHllYXIsIDEwKSAlIGNvbG9yUmFtcC5sZW5ndGhdO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIERBVEUgSEVMUEVSUyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gcGFyc2VEYXRlIChkYXRlKSB7XG5cdGRhdGUgPSBkYXRlLnRvU3RyaW5nKCk7XG5cdHZhciB5ZWFyID0gZGF0ZS5zdWJzdHJpbmcoMCwgNCk7XG5cdHZhciBtb250aCA9IHBhcnNlSW50KGRhdGUuc3Vic3RyaW5nKDQsIDYpLCAxMCkgLSAxO1xuXHR2YXIgZGF5ID0gZGF0ZS5zdWJzdHJpbmcoNiwgOCk7XG5cblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXkpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUp1bGlhbkRheSAoZGF0ZSkge1xuXHRpZiAodHlwZW9mKGRhdGUpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0ZGF0ZSA9IHBhcnNlRGF0ZShkYXRlKTtcblx0XHRyZXR1cm4gZGF0ZS5nZXRET1koKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZGF0ZTtcblx0fVxufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRlIChkYXRlKSB7XG5cdGlmIChkYXRlID09PSBcIkF2ZXJhZ2VcIikgeyByZXR1cm4gZGF0ZTsgfVxuXG5cdGRhdGUgPSBwYXJzZURhdGUoZGF0ZSk7XG5cdHJldHVybiBmb3JtYXRNb250aChkYXRlLmdldE1vbnRoKCkpICsgXCIgXCIgKyBvcmRpbmFsX3N1ZmZpeF9vZihkYXRlLmdldERhdGUoKSkgKyBcIiwgXCIgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1vbnRoIChtb250aCkge1xuXHRyZXR1cm4gRk9STUFUVEVEX01PTlRIX0xBQkVMU1ttb250aF07XG59XG5cbmZ1bmN0aW9uIG9yZGluYWxfc3VmZml4X29mKGRheSkge1xuXHR2YXIgaiA9IGRheSAlIDEwLFxuXHRcdGsgPSBkYXkgJSAxMDA7XG5cdGlmIChqID09PSAxICYmIGsgIT09IDExKSB7XG5cdFx0cmV0dXJuIGRheSArIFwic3RcIjtcblx0fVxuXHRpZiAoaiA9PT0gMiAmJiBrICE9PSAxMikge1xuXHRcdHJldHVybiBkYXkgKyBcIm5kXCI7XG5cdH1cblx0aWYgKGogPT09IDMgJiYgayAhPT0gMTMpIHtcblx0XHRyZXR1cm4gZGF5ICsgXCJyZFwiO1xuXHR9XG5cdHJldHVybiBkYXkgKyBcInRoXCI7XG59XG5cbnZhciBNT05USF9MQUJFTFMgPSB7XG5cdDA6IFwiSmFuXCIsXG5cdDE6IFwiRmViXCIsXG5cdDI6IFwiTWFyXCIsXG5cdDM6IFwiQXByXCIsXG5cdDQ6IFwiTWF5XCIsXG5cdDU6IFwiSnVuXCIsXG5cdDY6IFwiSnVsXCIsXG5cdDc6IFwiQXVnXCIsXG5cdDg6IFwiU2VwXCIsXG5cdDk6IFwiT2N0XCIsXG5cdDEwOiBcIk5vdlwiLFxuXHQxMTogXCJEZWNcIlxufTtcblxudmFyIEZPUk1BVFRFRF9NT05USF9MQUJFTFMgPSB7XG5cdDA6IFwiSmFuLlwiLFxuXHQxOiBcIkZlYi5cIixcblx0MjogXCJNYXIuXCIsXG5cdDM6IFwiQXByLlwiLFxuXHQ0OiBcIk1heVwiLFxuXHQ1OiBcIkp1bi5cIixcblx0NjogXCJKdWwuXCIsXG5cdDc6IFwiQXVnLlwiLFxuXHQ4OiBcIlNlcC5cIixcblx0OTogXCJPY3QuXCIsXG5cdDEwOiBcIk5vdi5cIixcblx0MTE6IFwiRGVjLlwiXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZ3JhcGguanMiLCJpbXBvcnQge0dldE1hcH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHtCQVNFX0xBWUVSX1RZUEV9IGZyb20gJy4vYmFzZWxheWVyJztcbmltcG9ydCB7R2V0Q3VycmVudExheWVyc30gZnJvbSAnLi9sYXllcic7XG5pbXBvcnQge0dldEFsbFBvaW50c09mSW50ZXJlc3QsIGNyZWF0ZVBPSX0gZnJvbSAnLi9wb2knO1xuaW1wb3J0IHtHZXRBY3RpdmVMYXllckdyb3Vwc30gZnJvbSAnLi9wYW5lbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCaW5kVXBkYXRlU2hhcmVVcmwgKG1hcCkge1xuXHRtYXAub24oXCJtb3ZlZW5kXCIsIHVwZGF0ZVNoYXJlVXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVNoYXJlVXJsIChlKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHR2YXIgcGFyYW1zID0gW1xuXHRcdG1ha2VDZW50ZXJTdHJpbmcobWFwKSxcblx0XHRtYWtlWm9vbVN0cmluZyhtYXApLFxuXHRcdG1ha2VMYXllclN0cmluZyhtYXApLFxuXHRcdG1ha2VMYXllckdyb3Vwc1N0cmluZygpLFxuXHRcdG1ha2VCYXNlTGF5ZXJTdHJpbmcobWFwKSxcblx0XHRtYWtlUG9pbnRzT2ZJbnRlcmVzdFN0cmluZygpLFxuXHRcdG1ha2VBY3RpdmVUYWJTdHJpbmcoKSxcblx0XHRtYWtlQWN0aXZlR3JhcGhUYWJTdHJpbmcoKVxuXHRdO1xuXG5cdHNldFNoYXJlVXJsKG1ha2VTaGFyZVVybChwYXJhbXMpKTtcblx0c2V0Q29weUxpbmtVcmwoKTtcblx0c2V0U29jaWFsVXJscygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkU2hhcmVTZXR0aW5nc1RvQ29uZmlnIChjb25maWcpIHtcblx0dmFyIHNoYXJlID0gcGFyc2VTaGFyZVVybCgpO1xuXHRpZiAoIXNoYXJlKSByZXR1cm47XG5cdGlmIChzaGFyZS5jZW50ZXIpIGNvbmZpZy5tYXAuY2VudGVyID0gc2hhcmUuY2VudGVyO1xuXHRpZiAoc2hhcmUuem9vbSkgY29uZmlnLm1hcC56b29tID0gc2hhcmUuem9vbTtcblx0aWYgKHNoYXJlLmxheWVycykgYWRkTGF5ZXJTZXR0aW5nc1RvQ29uZmlnKHNoYXJlLmxheWVycywgY29uZmlnKTtcblx0aWYgKHNoYXJlLmJhc2VsYXllcnMpIGFkZEJhc2VMYXllclNldHRpbmdzVG9Db25maWcoc2hhcmUuYmFzZWxheWVycywgY29uZmlnKTtcblx0aWYgKHNoYXJlLnBvaXMpIGFkZFBvaW50c09mSW50ZXJlc3RUb0NvbmZpZyhzaGFyZS5wb2lzLCBjb25maWcpXG5cdGlmIChzaGFyZS50YWIpIGNvbmZpZy50YWIgPSBzaGFyZS50YWI7XG5cdGlmIChzaGFyZS5ncmFwaCkgY29uZmlnLmdyYXBoID0gc2hhcmUuZ3JhcGg7XG5cdGlmIChzaGFyZS5sYXllckdyb3VwcykgY29uZmlnLmxheWVyR3JvdXBzID0gYWRkTGF5ZXJHcm91cFNldHRpbmdzVG9Db25maWcoc2hhcmUubGF5ZXJHcm91cHMsIGNvbmZpZylcbn1cblxuZnVuY3Rpb24gbWFrZVNoYXJlVXJsIChwYXJhbXMpIHtcblx0cmV0dXJuIFwiP1wiICsgcGFyYW1zLmZpbHRlcihmdW5jdGlvbiAocCkgeyByZXR1cm4gcCAhPT0gdW5kZWZpbmVkIH0pLmpvaW4oXCImXCIpO1xufVxuXG5mdW5jdGlvbiBzZXRTaGFyZVVybCAodXJsKSB7XG5cdGlmICh3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcblx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIFwiXCIsIHVybCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Q29weUxpbmtVcmwgKCkge1xuXHR2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hhcmV1cmwtbGluay11cmxcIikuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmRDb3B5TGlua0V2ZW50cyAoKSB7XG5cdGQzLnNlbGVjdChkb2N1bWVudCkub24oXCJjbGlja1wiLCBoYW5kbGVCb2R5Q2xpY2spO1xuXHRkMy5zZWxlY3QoXCIuc2hhcmV1cmwtbGluayBhXCIpLm9uKFwiY2xpY2tcIiwgaGFuZGxlU2hhcmVMaW5rQnV0dG9uQ2xpY2spO1xuXHRkMy5zZWxlY3QoXCIuc2hhcmV1cmwtbGluay11cmxcIikub24oXCJjbGlja1wiLCBoYW5kbGVTaGFyZUxpbmtVcmxDbGljayk7XG5cdGQzLnNlbGVjdChcIi5zaGFyZXVybC1saW5rLXBvcHVwLXJlbW92ZXJcIikub24oXCJjbGlja1wiLCBoYW5kbGVTaGFyZUxpbmtDbG9zZUJ1dHRvbkNsaWNrKTtcbn1cblxuLyoqXG4gKiBTaG91bGQgY2xvc2UgdGhlIGNvcHkgbGluayBwb3B1cCBpZiBpdCBpcyBhY3RpdmUgYW5kIGlmIHlvdSBjbGljayBvbiBhbnkgZWxlbWVudFxuICogdGhhdCBpcyBub3QgdGhlIHBvcHVwIG9yIGl0cyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gaGFuZGxlQm9keUNsaWNrICgpIHtcblx0dmFyIGV2ZW50ID0gZDMuZXZlbnQ7XG5cdHZhciBub2RlUGF0aCA9IFtdXG5cdG5vZGVQYXRoID0gZ2V0RG9tUGF0aChldmVudC50YXJnZXQpXG5cblx0dmFyIHRvQ2xvc2VQb3B1cCA9IHRydWU7XG5cdHZhciBpLCBsO1xuXG5cdGZvciAoaSA9IDAsIGwgPSBub2RlUGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKG5vZGVQYXRoW2ldLmNsYXNzTGlzdC5jb250YWlucygnc2hhcmV1cmwtbGluay1wb3B1cCcpIHx8XG5cdFx0XHRcdFx0bm9kZVBhdGhbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzaGFyZXVybC1saW5rJykpIHtcblx0XHRcdFx0dG9DbG9zZVBvcHVwID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fSAgICAgICAgICAgIFxuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Ly8gY2xpY2tpbmcgc3ZnIHRocm93cyBhbiBlcnJvciBpbiBJRVxuXHRcdH1cblx0fVxuXG5cdGlmICh0b0Nsb3NlUG9wdXApIHtcblx0XHR2YXIgc2hhcmVQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NoYXJldXJsLWxpbmstcG9wdXAnKS5pdGVtKDApXG5cdFx0aGFuZGxlQ29weUxpbmtDbG9zZShzaGFyZVBvcHVwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXREb21QYXRoKG5vZGUpIHtcblx0dmFyIHBhdGggPSBbXVxuXHR3aGlsZSAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpIHtcblx0XHRwYXRoLnB1c2gobm9kZSlcblx0XHRub2RlID0gbm9kZS5wYXJlbnROb2RlXG5cdH1cblx0cmV0dXJuIHBhdGhcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2hhcmVMaW5rQnV0dG9uQ2xpY2sgKCkge1xuXHR2YXIgc2hhcmVQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXVybC1saW5rLXBvcHVwXCIpLml0ZW0oMClcblx0aWYgKGQzLnNlbGVjdChzaGFyZVBvcHVwKS5jbGFzc2VkKFwiYWN0aXZlXCIpKSB7XG5cdFx0aGFuZGxlQ29weUxpbmtDbG9zZShzaGFyZVBvcHVwKVxuXHR9IGVsc2Uge1xuXHRcdGhhbmRsZUNvcHlMaW5rT3BlbihzaGFyZVBvcHVwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVTaGFyZUxpbmtDbG9zZUJ1dHRvbkNsaWNrICgpIHtcblx0dmFyIHNoYXJlUG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2hhcmV1cmwtbGluay1wb3B1cFwiKS5pdGVtKDApXG5cdGhhbmRsZUNvcHlMaW5rQ2xvc2Uoc2hhcmVQb3B1cCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNoYXJlTGlua1VybENsaWNrICgpIHtcblx0c2VsZWN0Q29weUxpbmtVcmwoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ29weUxpbmtPcGVuIChzaGFyZVBvcHVwKSB7XG5cdHNoYXJlUG9wdXAuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKVxuXHRzZWxlY3RDb3B5TGlua1VybCgpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGV2ZW50IGNsaWNrIG9uIHNoYXJlIHVybFxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0ICBldmVudENhdGVnb3J5OiAnc2hhcmV1cmwnLFxuXHQgIGV2ZW50QWN0aW9uOiAnb3BlbicsXG5cdCAgZXZlbnRMYWJlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGFyZXVybC1saW5rLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSxcblx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG5cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ29weUxpbmtDbG9zZSAoc2hhcmVQb3B1cCkge1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGV2ZW50IGNsaWNrIG9uIHNoYXJlIHVybCBjbG9zZVxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0ICBldmVudENhdGVnb3J5OiAnc2hhcmV1cmwnLFxuXHQgIGV2ZW50QWN0aW9uOiAnY2xvc2UnLFxuXHQgIGV2ZW50TGFiZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hhcmV1cmwtbGluay11cmxcIikuZ2V0QXR0cmlidXRlKFwidmFsdWVcIiksXG5cdCAgbm9uSW50ZXJhY3Rpb246IGZhbHNlXG5cdH0pO1xuXG5cdHNoYXJlUG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxufVxuXG5mdW5jdGlvbiBzZWxlY3RDb3B5TGlua1VybCAoKSB7XG5cdHZhciBzaGFyZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGFyZXVybC1saW5rLXVybFwiKTtcblx0c2hhcmVJbnB1dC5mb2N1cygpO1xuXHRzaGFyZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKDAsIHNoYXJlSW5wdXQudmFsdWUubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gc2V0U29jaWFsVXJscyAoKSB7XG5cdHZhciB1cmwgPSBtYW5nbGVQYXJhbVN0cmluZyh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdHZhciBzb2NpYWxMaW5rcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXVybC1zb2NpYWxcIik7XG5cdHZhciBzb2NpYWxMaW5rO1xuXHR2YXIgbmV3VXJsO1xuXHR2YXIgaSwgbDtcblxuXHRmb3IgKGkgPSAwLCBsID0gc29jaWFsTGlua3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0c29jaWFsTGluayA9IHNvY2lhbExpbmtzW2ldO1xuXG5cdFx0bmV3VXJsID0gc29jaWFsTGluay5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJhc2V1cmxcIikgKyB1cmw7XG5cdFx0c29jaWFsTGluay5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIG5ld1VybCk7XG5cblx0XHQvL3NlbmQgZ29vZ2xlIGFuYWx5dGljcyBldmVudCBmb3Igc29jaWFsIHVybHNcblx0XHRzb2NpYWxMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblx0XHQgIGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0ZXZlbnRDYXRlZ29yeTogJ3NoYXJldXJsJyxcblx0XHRcdGV2ZW50QWN0aW9uOiB0aGlzLmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiksXG5cdFx0XHRldmVudExhYmVsOiB0aGlzLmhyZWYsXG5cdFx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0XHQgIH0pO1xuXG5cdFx0fSk7XG5cblx0fVxufVxuXG5mdW5jdGlvbiBtYWtlQ2VudGVyU3RyaW5nIChtYXApIHtcblx0dmFyIGNlbnRlciA9IG1hcC5nZXRDZW50ZXIoKTtcblx0cmV0dXJuIFwiY2VudGVyPVwiICsgY2VudGVyLmxhdC50b1N0cmluZygpICsgXCIsXCIgKyBjZW50ZXIubG5nLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIG1ha2Vab29tU3RyaW5nIChtYXApIHtcblx0cmV0dXJuIFwiem9vbT1cIiArIG1hcC5nZXRab29tKCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VMYXllclN0cmluZyAobWFwKSB7XG5cdHZhciBsYXllcnMgPSBbXTtcblx0dmFyIG9wYWNpdHlWYWxzID0ge307XG5cdHZhciBjdXJyZW50TGF5ZXJzID0gR2V0Q3VycmVudExheWVycygpO1xuXG5cdG1hcC5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBsYXllci5vcHRpb25zO1xuXHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMubGF5ZXJzKSB7XG5cdFx0XHRvcGFjaXR5VmFsc1tvcHRpb25zLmxheWVyc10gPSBvcHRpb25zLmhhc093blByb3BlcnR5KFwib3BhY2l0eVwiKSA/IG9wdGlvbnMub3BhY2l0eSA6IFwiMVwiO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIGN1cnJlbnRMYXllcjtcblx0dmFyIGk7XG5cdGZvciAoaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y3VycmVudExheWVyID0gY3VycmVudExheWVyc1tpXTtcblx0XHRsYXllcnMucHVzaChjdXJyZW50TGF5ZXIpO1xuXHRcdGxheWVycy5wdXNoKG9wYWNpdHlWYWxzW2N1cnJlbnRMYXllcl0pO1xuXHR9XG5cdHJldHVybiBcImxheWVycz1cIiArIGxheWVycy5qb2luKFwiLFwiKTtcbn1cblxuZnVuY3Rpb24gbWFrZUJhc2VMYXllclN0cmluZyAobWFwKSB7XG5cdHZhciBsYXllcnMgPSBbXTtcblx0bWFwLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcblx0XHRpZiAobGF5ZXIub3B0aW9ucyAmJiBsYXllci5vcHRpb25zLnR5cGUgPT09IEJBU0VfTEFZRVJfVFlQRSkge1xuXHRcdFx0bGF5ZXJzLnB1c2gobGF5ZXIub3B0aW9ucy5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIFwiYmFzZWxheWVycz1cIiArIGxheWVycy5qb2luKFwiLFwiKTtcbn1cblxuZnVuY3Rpb24gbWFrZUxheWVyR3JvdXBzU3RyaW5nICgpIHtcblx0dmFyIGFjdGl2ZUxheWVyR3JvdXBzID0gR2V0QWN0aXZlTGF5ZXJHcm91cHMoKVxuXHRyZXR1cm4gXCJsYXllckdyb3Vwcz1cIithY3RpdmVMYXllckdyb3Vwcy5tYXAoZCA9PiBkLmlkKS5qb2luKCcsJylcbn1cblxuZnVuY3Rpb24gbWFrZVBvaW50c09mSW50ZXJlc3RTdHJpbmcgKCkge1xuXHR2YXIgcG9pcyA9IEdldEFsbFBvaW50c09mSW50ZXJlc3QoKVxuXHRpZiAoIXBvaXMubGVuZ3RoKSByZXR1cm47XG5cdHZhciBwb2lTdHJpbmcgPSBcInBvaXM9XCI7XG5cdHBvaXMuZm9yRWFjaChwb2kgPT4ge1xuXHRcdHBvaVN0cmluZyArPSBwb2kubGF0ICsgJywnICsgcG9pLmxuZztcblx0XHRpZiAocG9pLnBsb3RzICYmIHBvaS5wbG90cy5sZW5ndGgpIHtcblx0XHRcdHBvaVN0cmluZyArPSAnLCcgKyBwb2kucGxvdHMuam9pbignLCcpO1xuXHRcdH1cblx0XHRwb2lTdHJpbmcgKz0gJzsnO1xuXHR9KVxuXHRyZXR1cm4gcG9pU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBtYWtlQWN0aXZlVGFiU3RyaW5nICgpIHtcblx0cmV0dXJuIFwidGFiPVwiICsgZDMuc2VsZWN0KFwiLnBhbmVsLXRvcC1idG4uYWN0aXZlXCIpLmF0dHIoXCJkYXRhLWFjdGl2ZVwiKTtcbn1cblxuZnVuY3Rpb24gbWFrZUFjdGl2ZUdyYXBoVGFiU3RyaW5nICgpIHtcblx0cmV0dXJuIFwiZ3JhcGg9XCIgKyBkMy5zZWxlY3QoXCIuZ3JhcGgtdHlwZS1idG4uYWN0aXZlXCIpLmF0dHIoXCJkYXRhLXR5cGVcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2hhcmVVcmwgKCkge1xuXHR2YXIgcGFyYW1zID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcblx0aWYgKHBhcmFtcyA9PT0gXCJcIikgcmV0dXJuO1xuXG5cdHBhcmFtcyA9IGdldFBhcmFtc0FycmF5KHBhcmFtcyk7XG5cdHBhcmFtcyA9IG1ha2VLZXllZFBhcmFtc09iamVjdChwYXJhbXMpO1xuXG5cdGZvcm1hdFBhcmFtcyhwYXJhbXMpO1xuXHRyZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJhbXNBcnJheSAocGFyYW1zKSB7XG5cdHBhcmFtcyA9IHBhcmFtcy5zdWJzdHJpbmcoMSk7XG5cdHBhcmFtcyA9IHVubWFuZ2xlUGFyYW1TdHJpbmcocGFyYW1zKTtcblx0cmV0dXJuIHBhcmFtcy5zcGxpdChcIiZcIik7XG59XG5cbmZ1bmN0aW9uIG1hbmdsZVBhcmFtU3RyaW5nICh1cmwpIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKC9cXDovZywgXCIlM0FcIilcblx0XHQucmVwbGFjZSgvXFw7L2csIFwiJTNCXCIpXG5cdFx0LnJlcGxhY2UoL1xcLy9nLCBcIiUyRlwiKVxuXHRcdC5yZXBsYWNlKC9cXCwvZywgXCIlMkNcIilcblx0XHQucmVwbGFjZSgvXFwmL2csIFwiJTI2XCIpO1xufVxuXG5mdW5jdGlvbiB1bm1hbmdsZVBhcmFtU3RyaW5nIChwYXJhbXMpIHtcblx0cmV0dXJuIHBhcmFtcy5yZXBsYWNlKC9cXCUyW2N8Q10vZywgXCIsXCIpLnJlcGxhY2UoL1xcJTNbYnxCXS9nLCBcIjtcIilcbn1cblxuZnVuY3Rpb24gbWFrZUtleWVkUGFyYW1zT2JqZWN0IChwYXJhbXNBcnIpIHtcblx0dmFyIHBhcnNlZFBhcmFtcyA9IHt9O1xuXHR2YXIgcGFyYW1QYWlyO1xuXHR2YXIgaTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgcGFyYW1zQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0cGFyYW1QYWlyID0gcGFyYW1zQXJyW2ldLnNwbGl0KFwiPVwiKTtcblx0XHRwYXJzZWRQYXJhbXNbcGFyYW1QYWlyWzBdXSA9IHBhcmFtUGFpclsxXVxuXHR9XG5cblx0cmV0dXJuIHBhcnNlZFBhcmFtcztcbn1cblxuZnVuY3Rpb24gZm9ybWF0UGFyYW1zIChwYXJhbXMpIHtcblx0aWYgKHBhcmFtcy5jZW50ZXIpIHBhcmFtcy5jZW50ZXIgPSBmb3JtYXRDZW50ZXJQYXJhbShwYXJhbXMuY2VudGVyKTtcblx0aWYgKHBhcmFtcy5sYXllcnMpIHBhcmFtcy5sYXllcnMgPSBmb3JtYXRMYXllclBhcmFtKHBhcmFtcy5sYXllcnMpO1xuXHRpZiAocGFyYW1zLmJhc2VsYXllcnMpIHBhcmFtcy5iYXNlbGF5ZXJzID0gZm9ybWF0QmFzZUxheWVyUGFyYW0ocGFyYW1zLmJhc2VsYXllcnMpO1xuXHRpZiAocGFyYW1zLnBvaXMpIHBhcmFtcy5wb2lzID0gZm9ybWF0UG9pbnRzT2ZJbnRlcmVzdFBhcmFtKHBhcmFtcy5wb2lzKVxuXHRpZiAocGFyYW1zLmxheWVyR3JvdXBzKSBwYXJhbXMubGF5ZXJHcm91cHMgPSBmb3JtYXRMYXllckdyb3Vwc1BhcmFtKHBhcmFtcy5sYXllckdyb3Vwcylcbn1cblxuZnVuY3Rpb24gZm9ybWF0Q2VudGVyUGFyYW0gKGNlbnRlcikge1xuXHRyZXR1cm4gY2VudGVyLnNwbGl0KFwiLFwiKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGF5ZXJQYXJhbSAobGF5ZXJzKSB7XG5cdHZhciBmb3JtYXR0ZWRMYXllcnMgPSB7XG5cdFx0XCJlbmFibGVkTGF5ZXJzXCI6IFtdLFxuXHRcdFwib3BhY2l0eVZhbHNcIjoge31cblx0fTtcblx0dmFyIGxheWVySWQ7XG5cdHZhciBpO1xuXG5cdGxheWVycyA9IGxheWVycy5zcGxpdChcIixcIik7XG5cdGZvciAoaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpID0gaSArIDIpIHtcblx0XHRsYXllcklkID0gbGF5ZXJzW2ldO1xuXHRcdGZvcm1hdHRlZExheWVycy5lbmFibGVkTGF5ZXJzLnB1c2gobGF5ZXJJZCk7XG5cdFx0Zm9ybWF0dGVkTGF5ZXJzLm9wYWNpdHlWYWxzW2xheWVySWRdID0gbGF5ZXJzW2krMV07XG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0dGVkTGF5ZXJzO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRCYXNlTGF5ZXJQYXJhbSAoYmFzZWxheWVycykge1xuXHRyZXR1cm4gYmFzZWxheWVycy5zcGxpdChcIixcIik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBvaW50c09mSW50ZXJlc3RQYXJhbSAocG9pcykge1xuXHRyZXR1cm4gcG9pcy5zcGxpdCgnOycpXG5cdFx0LmZpbHRlcigoc3RyKSA9PiBzdHIgIT09ICcnKVxuXHRcdC5tYXAoKHBvaSkgPT4ge1xuXHRcdFx0cG9pID0gcG9pLnNwbGl0KCcsJyk7XG5cdFx0XHRpZiAocG9pLmxlbmd0aCA+IDIpIHtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVBPSShwb2lbMF0sIHBvaVsxXSwgcG9pLnNwbGljZSgyKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY3JlYXRlUE9JKHBvaVswXSwgcG9pWzFdLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGF5ZXJHcm91cHNQYXJhbSAobGF5ZXJHcm91cFNldHRpbmdzKSB7XG5cdHJldHVybiBsYXllckdyb3VwU2V0dGluZ3Muc3BsaXQoJywnKVxufVxuXG5mdW5jdGlvbiBhZGRMYXllckdyb3VwU2V0dGluZ3NUb0NvbmZpZyhhY3RpdmVMYXllckdyb3VwSWRzLCBjb25maWcpIHtcblx0Y29uZmlnLmxheW91dFsnbGF5ZXItZ3JvdXBzLW9yZGVyJ10uZm9yRWFjaChsYXllckdyb3VwID0+IHtcblx0XHQvLyBzZXQgbGF5ZXIgZ3JvdXAgdG8gYWN0aXZlIGlmIGl0cyBpZCBhcHBlYXJzIGluIHRoZSBzaGFyZSB1cmwgc2V0dGluZ3Ncblx0XHRsYXllckdyb3VwLmFjdGl2ZSA9IGFjdGl2ZUxheWVyR3JvdXBJZHMuZmlsdGVyKGlkID0+IHtcblx0XHRcdHJldHVybiBpZCA9PT0gbGF5ZXJHcm91cC5pZFxuXHRcdH0pLmxlbmd0aCA+IDBcblx0fSlcbn1cblxuZnVuY3Rpb24gYWRkTGF5ZXJTZXR0aW5nc1RvQ29uZmlnIChzaGFyZUxheWVyU2V0dGluZ3MsIGNvbmZpZykge1xuXHR2YXIgZW5hYmxlZExheWVycyA9IHNoYXJlTGF5ZXJTZXR0aW5ncy5lbmFibGVkTGF5ZXJzO1xuXHRjb25maWdbXCJhY3RpdmUtbGF5ZXJzXCJdID0gZW5hYmxlZExheWVycztcblxuXHR2YXIgaSwgaiwgcHJvcCwgbGF5ZXJncm91cDtcblx0dmFyIGVuYWJsZWRMYXllcjtcblx0dmFyIGZvdW5kTGF5ZXI7XG5cdHZhciBsYXllcnMgPSBjb25maWcubGF5ZXJzO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBlbmFibGVkTGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Zm91bmRMYXllciA9IGZhbHNlO1xuXHRcdGVuYWJsZWRMYXllciA9IGVuYWJsZWRMYXllcnNbaV07XG5cdFx0Zm9yIChwcm9wIGluIGxheWVycykge1xuXHRcdFx0aWYgKCFsYXllcnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHJldHVybjtcblx0XHRcdGxheWVyZ3JvdXAgPSBsYXllcnNbcHJvcF07XG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgbGF5ZXJncm91cC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRpZiAobGF5ZXJncm91cFtqXS5pZCA9PT0gZW5hYmxlZExheWVyKSB7XG5cdFx0XHRcdFx0bGF5ZXJncm91cFtqXS5vcGFjaXR5ID0gc2hhcmVMYXllclNldHRpbmdzLm9wYWNpdHlWYWxzW2VuYWJsZWRMYXllcl07XG5cdFx0XHRcdFx0Zm91bmRMYXllciA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChmb3VuZExheWVyKSBicmVhaztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkQmFzZUxheWVyU2V0dGluZ3NUb0NvbmZpZyAoc2hhcmVCYXNlTGF5ZXJTZXR0aW5ncywgY29uZmlnKSB7XG5cdHZhciBiYXNlbGF5ZXJzID0gY29uZmlnLmJhc2VsYXllcnM7XG5cdHZhciBiYXNlbGF5ZXI7XG5cdHZhciBpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBiYXNlbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YmFzZWxheWVyID0gYmFzZWxheWVyc1tpXTtcblx0XHRiYXNlbGF5ZXIuYWN0aXZlID0gKHNoYXJlQmFzZUxheWVyU2V0dGluZ3MuaW5kZXhPZihiYXNlbGF5ZXIuaWQpICE9PSAtMSkgPyB0cnVlIDogZmFsc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkUG9pbnRzT2ZJbnRlcmVzdFRvQ29uZmlnKHBvaXMsIGNvbmZpZykge1xuXHRjb25maWdbXCJwb2lzXCJdID0gcG9pc1xufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9zaGFyZS5qcyIsImltcG9ydCB7R2V0TWFwfSBmcm9tIFwiLi9tYXBcIjtcbmltcG9ydCB7dXBkYXRlU2hhcmVVcmx9IGZyb20gXCIuL3NoYXJlXCI7XG5cbmV4cG9ydCBjb25zdCBCQVNFX0xBWUVSX1RZUEUgPSBcImJhc2VsYXllclwiO1xuXG52YXIgX2Jhc2VsYXllcnM7XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVCYXNlTGF5ZXJzIChtYXAsIGxheWVyQ29uZmlnKSB7XG5cdGxheWVyQ29uZmlnID0gbGF5ZXJDb25maWcgfHxcblx0XHRbe1xuXHRcdFx0XCJpZFwiIDogXCJjYXJ0by1saWdodC1kZWZhdWx0XCIsXG5cdFx0XHRcInVybFwiIDogXCJodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9hbGwve3p9L3t4fS97eX0ucG5nXCIsXG5cdFx0XHRcImF0dHJpYnV0aW9uXCIgOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL2NhcnRvLmNvbS9hdHRyaWJ1dGlvbnNcIj5DQVJUTzwvYT4nXG5cdFx0fV07XG5cblx0X2Jhc2VsYXllcnMgPSBsYXllckNvbmZpZztcblx0dmFyIGk7XG5cdHZhciBiYXNlTGF5ZXI7XG5cdHZhciBjb25maWc7XG5cblx0Zm9yIChpID0gMDsgaSA8IGxheWVyQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uZmlnID0gbGF5ZXJDb25maWdbaV07XG5cblx0XHRpZiAoIWNvbmZpZy5hY3RpdmUpIGNvbnRpbnVlO1xuXHRcdGJhc2VMYXllciA9IGNyZWF0ZUJhc2VMYXllcihjb25maWcpO1xuXHRcdGNvbmZpZy5sYXllciA9IGJhc2VMYXllcjtcblx0XHRiYXNlTGF5ZXIuYWRkVG8obWFwKTtcblx0fVxuXG5cdGNyZWF0ZUJhc2VMYXllclVJKGxheWVyQ29uZmlnKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVCYXNlTGF5ZXJVSSAoY29uZmlnKSB7XG5cdHZhciBiYXNlVUkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRiYXNlVUkuY2xhc3NOYW1lID0gXCJiYXNlbGF5ZXItdWlcIjtcblx0dmFyIGJhc2VXcmFwcGVyO1xuXHR2YXIgYmFzZUltZztcblx0dmFyIGJhc2VMYWJlbDtcblxuXHR2YXIgbGF5ZXI7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gY29uZmlnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGxheWVyID0gY29uZmlnW2ldO1xuXHRcdGlmICghbGF5ZXIuaGFzT3duUHJvcGVydHkoXCJpbWFnZVwiKSkgY29udGludWU7XG5cblx0XHRiYXNlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0YmFzZVdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZGF0YS1sYXllclwiLCBsYXllci5pZCk7XG5cdFx0YmFzZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdFx0YmFzZUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgbGF5ZXIuaW1hZ2UpO1xuXHRcdGJhc2VJbWcuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGxheWVyLmxhYmVsKTtcblx0XHRiYXNlSW1nLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxheWVyLmxhYmVsKTtcblx0XHRiYXNlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGJhc2VMYWJlbC50ZXh0Q29udGVudCA9IGxheWVyLmxhYmVsO1xuXHRcdGJhc2VXcmFwcGVyLmFwcGVuZENoaWxkKGJhc2VJbWcpO1xuXHRcdGJhc2VXcmFwcGVyLmFwcGVuZENoaWxkKGJhc2VMYWJlbCk7XG5cdFx0YmFzZVdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUJhc2VDbGljaylcblxuXHRcdGQzLnNlbGVjdChiYXNlV3JhcHBlcilcblx0XHRcdC5jbGFzc2VkKFwiYmFzZS1zZWxlY3RvclwiLCB0cnVlKVxuXHRcdFx0LmNsYXNzZWQoXCJhY3RpdmVcIiwgbGF5ZXIuYWN0aXZlKTtcblxuXHRcdGJhc2VVSS5hcHBlbmRDaGlsZChiYXNlV3JhcHBlcik7XG5cdH1cblxuXHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGVhZmxldC1ib3R0b20gbGVhZmxldC1sZWZ0XCIpWzBdLmFwcGVuZENoaWxkKGJhc2VVSSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJhc2VDbGljayAoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR2YXIgbGF5ZXJpZCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1sYXllclwiKTtcblx0dG9nZ2xlQWN0aXZlQmFzZVVJKHRoaXMpO1xuXHRyZW1vdmVDdXJyZW50QmFzZUxheWVyKCk7XG5cdGFkZE5ld0Jhc2VMYXllclRvTWFwKGxheWVyaWQpO1xuXG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciBjaGFuZ2VpbmcgYmFzZSBsYXllclxuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0ICBldmVudENhdGVnb3J5OiAnbWFwJyxcblx0ICBldmVudEFjdGlvbjogJ2NoYW5nZSBiYXNlIGxheWVyJyxcblx0ICBldmVudExhYmVsOiBsYXllcmlkLFxuXHQgIG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHR9KTtcblxuXHR1cGRhdGVTaGFyZVVybCgpO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVBY3RpdmVCYXNlVUkgKGJhc2VVSUVsZW0pIHtcblx0ZDMuc2VsZWN0KFwiLmJhc2Utc2VsZWN0b3IuYWN0aXZlXCIpLmNsYXNzZWQoXCJhY3RpdmVcIiwgZmFsc2UpO1xuXHRkMy5zZWxlY3QoYmFzZVVJRWxlbSkuY2xhc3NlZChcImFjdGl2ZVwiLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ3VycmVudEJhc2VMYXllciAoKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHRtYXAuZWFjaExheWVyKGZ1bmN0aW9uIChsYXllcikge1xuXHRcdGlmIChsYXllci5vcHRpb25zLnR5cGUgIT09IEJBU0VfTEFZRVJfVFlQRSkgcmV0dXJuO1xuXHRcdG1hcC5yZW1vdmVMYXllcihsYXllcik7XG5cdH0pXG59XG5cbmZ1bmN0aW9uIGFkZE5ld0Jhc2VMYXllclRvTWFwIChsYXllcmlkKSB7XG5cdHZhciBtYXAgPSBHZXRNYXAoKTtcblxuXHR2YXIgbGF5ZXI7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gX2Jhc2VsYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0bGF5ZXIgPSBfYmFzZWxheWVyc1tpXTtcblx0XHRpZiAobGF5ZXIuaWQgIT09IGxheWVyaWQpIGNvbnRpbnVlO1xuXHRcdGlmICghbGF5ZXIubGF5ZXIpIGxheWVyLmxheWVyID0gY3JlYXRlQmFzZUxheWVyKGxheWVyKTtcblx0XHRsYXllci5sYXllci5hZGRUbyhtYXApO1xuXHRcdGxheWVyLmxheWVyLmJyaW5nVG9CYWNrKCk7XG5cdFx0YnJlYWs7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQmFzZUxheWVyIChsYXllckNvbmZpZykge1xuXHRyZXR1cm4gTC50aWxlTGF5ZXIoXG5cdFx0bGF5ZXJDb25maWcudXJsLFxuXHRcdG1ha2VCYXNlTGF5ZXJPcHRpb25zKGxheWVyQ29uZmlnKVxuXHQpO1xufVxuXG5mdW5jdGlvbiBtYWtlQmFzZUxheWVyT3B0aW9ucyAoY29uZmlnKSB7XG5cdHZhciBvcHRpb25zID0ge307XG5cdGlmIChjb25maWcuaWQpIG9wdGlvbnMuaWQgPSBjb25maWcuaWQ7XG5cdGlmIChjb25maWcuYXR0cmlidXRpb24pIG9wdGlvbnMuYXR0cmlidXRpb24gPSBjb25maWcuYXR0cmlidXRpb247XG5cdGlmIChjb25maWcuc3ViZG9tYWlucykgb3B0aW9ucy5zdWJkb21haW5zID0gY29uZmlnLnN1YmRvbWFpbnM7XG5cdG9wdGlvbnMudHlwZSA9IEJBU0VfTEFZRVJfVFlQRTtcblxuXHRyZXR1cm4gb3B0aW9ucztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2Jhc2VsYXllci5qcyIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXJrZXIgKGxhdCwgbG5nKSB7XG5cdHJldHVybiBMLm1hcmtlcihbbGF0LCBsbmddLCB7aWNvbjogZ3JhcGhJY29ufSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJY29uICh0eXBlKSB7XG5cdHJldHVybiB0eXBlID09PSAnaG92ZXInID8gaG92ZXJJY29uIDogZ3JhcGhJY29uO1xufVxuXG52YXIgYmFzZUljb24gPSBMLkljb24uZXh0ZW5kKHt9KTtcblxudmFyIGdyYXBoSWNvbiA9IG5ldyBiYXNlSWNvbih7XG5cdGljb25Vcmw6ICdpbWdzL2JsdWVfaWNvbi5wbmcnLFxuXHRzaGFkb3dVcmw6ICdpbWdzL21hcmtlcl9zaGFkb3cucG5nJyxcblx0aWNvblNpemU6IFsyNSwgNDFdLFxuXHRpY29uQW5jaG9yOiBbMTIsIDQxXSxcblx0cG9wdXBBbmNob3I6IFsxLCAtMzRdLFxuXHRzaGFkb3dTaXplOiBbNDEsIDQxXVxufSk7XG5cbnZhciBob3Zlckljb24gPSBuZXcgYmFzZUljb24oe1xuXHRpY29uVXJsOiAnaW1ncy9vcmFuZ2VfaWNvbi5wbmcnLFxuXHRzaGFkb3dVcmw6ICdpbWdzL21hcmtlcl9zaGFkb3cucG5nJyxcblx0aWNvblNpemU6IFsyNSwgNDFdLFxuXHRpY29uQW5jaG9yOiBbMTIsIDQxXSxcblx0cG9wdXBBbmNob3I6IFsxLCAtMzRdLFxuXHRzaGFkb3dTaXplOiBbNDEsIDQxXVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9tYXJrZXIuanMiLCJpbXBvcnQge3VwZGF0ZVBhbmVsRHJhZ092ZXJsYXlIZWlnaHR9IGZyb20gXCIuL3BhbmVsXCI7XG5pbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tIFwiLi9zaGFyZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gQmluZFRhYkV2ZW50cyAoKSB7XG5cdGQzLnNlbGVjdEFsbChcIi5wYW5lbC10b3AtYnRuXCIpLm9uKFwiY2xpY2tcIiwgaGFuZGxlVGFiSGVhZGVyQnRuQ2xpY2spO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gR2V0QWN0aXZlVGFiICgpIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYW5lbC10b3AtYnRuIGFjdGl2ZVwiKVswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVGFiSGVhZGVyQnRuQ2xpY2sgKCkge1xuXHQvLyBJZiB0aGUgc2VjdGlvbiBpcyBhbHJlYWR5IGFjdGl2ZSwgZG8gbm90aGluZ1xuXHRpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHJldHVybjtcblx0XG5cdC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGNsaWNrIG9uIGdyYXBoIHR5cGVcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdCAgZXZlbnRDYXRlZ29yeTogJ3RhYicsXG5cdCAgZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdCAgZXZlbnRMYWJlbDogdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiKSxcblx0ICBub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG5cblx0SGFuZGxlVGFiQ2hhbmdlKHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1hY3RpdmVcIikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZGxlVGFiQ2hhbmdlIChuZXdDbGFzcykge1xuXHRkaXNhYmxlQWN0aXZlVGFiKCk7XG5cdGVuYWJsZVRhYihuZXdDbGFzcyk7XG5cdHVwZGF0ZVNoYXJlVXJsKCk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZVRhYiAobmV3Q2xhc3MpIHtcblx0ZDMuc2VsZWN0KFwiLnBhbmVsLXRvcC1idG5bZGF0YS1hY3RpdmU9J1wiICsgbmV3Q2xhc3MgKyBcIiddXCIpLmNsYXNzZWQoXCJhY3RpdmVcIiwgdHJ1ZSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXAtd3JhcHBlclwiKS5jbGFzc0xpc3QuYWRkKG5ld0NsYXNzKVxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmVsXCIpLmNsYXNzTGlzdC5hZGQobmV3Q2xhc3MpXG5cblx0ZDMuc2VsZWN0KFwiLnBhbmVsLXNlY3Rpb24td3JhcHBlcltkYXRhLWFjdGl2ZT0nXCIgKyBuZXdDbGFzcyArIFwiJ11cIikuY2xhc3NlZChcImFjdGl2ZVwiLCB0cnVlKTtcblxuXHR0b2dnbGVNYXBQYWRkaW5nKCk7XG5cdHJlc2V0UGFuZWxXaWR0aCgpO1xuXHR1cGRhdGVQYW5lbERyYWdPdmVybGF5SGVpZ2h0KCk7XG59XG5cbmZ1bmN0aW9uIGRpc2FibGVBY3RpdmVUYWIgKCkge1xuXHR2YXIgYWN0aXZlQ2xhc3MgPSBkMy5zZWxlY3QoXCIucGFuZWwtdG9wLWJ0bi5hY3RpdmVcIikuYXR0cihcImRhdGEtYWN0aXZlXCIpO1xuXG5cdGQzLnNlbGVjdEFsbCgnI21hcC13cmFwcGVyLCAjcmlnaHQtcGFuZWwnKVxuXHRcdC5jbGFzc2VkKGFjdGl2ZUNsYXNzLCBmYWxzZSk7XG5cblx0ZDMuc2VsZWN0QWxsKCcucGFuZWwtdG9wLWJ0bi5hY3RpdmUsIC5wYW5lbC1zZWN0aW9uLXdyYXBwZXIuYWN0aXZlJylcblx0XHQuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVNYXBQYWRkaW5nICgpIHtcblx0dmFyIHBhZGRpbmdSaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZWxcIikub2Zmc2V0V2lkdGg7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwLXdyYXBwZXJcIikuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1JpZ2h0ICsgXCJweFwiO1xufVxuXG4vKipcbiAqIFNpbmNlIHRoZSBwYW5lbCBoYXMgY2hpbGQgZWxlbWVudHMgd2l0aCBwb3NpdGlvbiBmaXhlZCBhbmQgd2lkdGggaW5oZXJpdFxuICogd2UgbmVlZCB0byBjbGVhciB0aGUgaW5saW5lIHdpZHRoIHByb3BlcnR5IGlmIGFuZCBvbmx5IGlmIHRoZSBpbmxpbmVcbiAqIHdpZHRoIGlzIGxlc3MgdGhhbiB0aGUgbWluIHdpZHRoXG4gKi9cbmZ1bmN0aW9uIHJlc2V0UGFuZWxXaWR0aCAoKSB7XG5cdHZhciBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZWxcIik7XG5cdHZhciB3aWR0aCA9IHBhbmVsLnN0eWxlLndpZHRoO1xuXHRpZiAoIXdpZHRoKSByZXR1cm47XG5cblx0dmFyIHBhbmVsTWluV2lkdGggPSBkMy5zZWxlY3QocGFuZWwpLnN0eWxlKCdtaW4td2lkdGgnKS5zbGljZSgwLCAtMik7XG5cdGlmIChwYXJzZUludCh3aWR0aC5zbGljZSgwLCAtMiksIDEwKSA+IHBhcnNlSW50KHBhbmVsTWluV2lkdGgsIDEwKSkgcmV0dXJuO1xuXG5cdHBhbmVsLnN0eWxlLndpZHRoID0gXCJcIjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3RhYnMuanMiLCJpbXBvcnQge3VwZGF0ZVNoYXJlVXJsfSBmcm9tICcuL3NoYXJlJ1xuaW1wb3J0IHt1cGRhdGVMYXllck9wYWNpdHl9IGZyb20gXCIuL2xheWVyXCI7XG5cbi8vIHNldCBpdCBtYW51YWxseSBmb3Igbm93XG5jb25zdCBPUEFDSVRZX1JBTkdFX01BWCA9IDkwXG5cbnZhciBvcGFjaXR5U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG5cdC5kb21haW4oWzEsIDBdKVxuXHQucmFuZ2UoWzAsIE9QQUNJVFlfUkFOR0VfTUFYXSlcblx0LmNsYW1wKHRydWUpXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRPcGFjaXR5U2xpZGVyUG9zaXRpb24gKGxheWVyLCBzbGlkZXJIYW5kbGUsIG9wYWNpdHkpIHtcblx0b3BhY2l0eSA9IG9wYWNpdHkgfHwgbGF5ZXIub3BhY2l0eVxuXHRzbGlkZXJIYW5kbGUuc3R5bGUudG9wID0gJycrb3BhY2l0eVNjYWxlKG9wYWNpdHkpKydweCdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPcGFjaXR5U2xpZGVyIChsYXllcikge1xuXHR2YXIgbGF5ZXJPcGFjaXR5ID0gbGF5ZXIub3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gbGF5ZXIub3BhY2l0eSA6IDFcblx0dmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgc2xpZGVyVHJhY2tPdmVybGF5ID0gbWFrZVNsaWRlclRyYWNrKGxheWVyLCBsYXllck9wYWNpdHkpXG5cdHZhciBpY29uV3JhcHBlckNsb3NlZCA9IG1ha2VPcGFjaXR5SWNvbldyYXBwZXIoJ2Nsb3NlZCcsIGxheWVyLCBzbGlkZXJUcmFja092ZXJsYXkpXG5cblx0d3JhcHBlci5jbGFzc0xpc3QuYWRkKCdvcGFjaXR5LXNsaWRlci13cmFwcGVyJylcblx0d3JhcHBlci5hcHBlbmRDaGlsZChzbGlkZXJUcmFja092ZXJsYXkpXG5cdHdyYXBwZXIuYXBwZW5kQ2hpbGQoaWNvbldyYXBwZXJDbG9zZWQpXG5cdHJldHVybiB3cmFwcGVyXG59XG5cbmZ1bmN0aW9uIG1ha2VPcGFjaXR5SWNvbldyYXBwZXIoc3RhdGUsIGxheWVyLCBzbGlkZXJUcmFja092ZXJsYXkpIHtcblx0dmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cdHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnb3BhY2l0eS1pY29uLXdyYXBwZXInKVxuXHRpY29uLmNsYXNzTGlzdC5hZGQoJ29wYWNpdHktaWNvbicpXG5cdGljb24uY2xhc3NMaXN0LmFkZChzdGF0ZSlcblx0aWNvbi5zZXRBdHRyaWJ1dGUoJ3NyYycsICdpbWdzL29wYWNpdHktaWNvbi0nK3N0YXRlKyctNjR4NjQucG5nJylcblx0aWNvbi5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdVc2UgdGhpcyBzbGlkZXIgdG8gYWRqdXN0IHRyYW5zcGFyZW5jeSBmb3IgdGhlICcgKyBsYXllci5uYW1lICsgJyBsYXllcicpXG5cdGljb24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdVc2UgdGhpcyBzbGlkZXIgdG8gYWRqdXN0IHRyYW5zcGFyZW5jeSBmb3IgdGhlICcgKyBsYXllci5uYW1lICsgJyBsYXllcicpXG5cdHdyYXBwZXIuYXBwZW5kQ2hpbGQoaWNvbilcblx0d3JhcHBlci5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgc2xpZGVySGFuZGxlID0gc2xpZGVyVHJhY2tPdmVybGF5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ29wYWNpdHktc2xpZGVyLWhhbmRsZScpWzBdXG5cdFx0dXBkYXRlTGF5ZXJPcGFjaXR5KGxheWVyLCAwKVxuXHRcdHNldE9wYWNpdHlTbGlkZXJQb3NpdGlvbihsYXllciwgc2xpZGVySGFuZGxlLCAwKVxuXHR9XG5cdHJldHVybiB3cmFwcGVyXG59XG5cbmZ1bmN0aW9uIG1ha2VTbGlkZXJUcmFjayhsYXllciwgbGF5ZXJPcGFjaXR5KSB7XG5cblx0dmFyIG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgdHJhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHR2YXIgc2xpZGVySGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuXHRvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ29wYWNpdHktc2xpZGVyLXRyYWNrLW92ZXJsYXknKVxuXHR0cmFjay5jbGFzc0xpc3QuYWRkKCdvcGFjaXR5LXNsaWRlci10cmFjaycpXG5cdHNsaWRlckhhbmRsZS5jbGFzc0xpc3QuYWRkKCdvcGFjaXR5LXNsaWRlci1oYW5kbGUnKVxuXG5cdG92ZXJsYXkuYXBwZW5kQ2hpbGQodHJhY2spXG5cdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc2xpZGVySGFuZGxlKVxuXG5cdGlmIChsYXllci5hY3RpdmUpIHNldE9wYWNpdHlTbGlkZXJQb3NpdGlvbihsYXllciwgc2xpZGVySGFuZGxlKVxuXHRzZXREcmFnRXZlbnRMaXN0ZW5lcihvdmVybGF5LCBsYXllciwgbGF5ZXJPcGFjaXR5KVxuXG5cdHJldHVybiBvdmVybGF5XG59XG5cbmZ1bmN0aW9uIHNldERyYWdFdmVudExpc3RlbmVyKG92ZXJsYXksIGxheWVyLCBsYXllck9wYWNpdHkpIHtcblx0ZDMuc2VsZWN0KG92ZXJsYXkpLmNhbGwoZDMuZHJhZygpXG5cdFx0Lm9uKCdzdGFydCBkcmFnJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHNsaWRlckhhbmRsZSA9IG92ZXJsYXkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3BhY2l0eS1zbGlkZXItaGFuZGxlJylbMF1cblx0XHRcdHZhciBuZXdPcGFjaXR5ID0gY2FsY09wYWNpdHlGcm9tTW91c2VQb3Mob3ZlcmxheSlcblx0XHRcdHVwZGF0ZUxheWVyT3BhY2l0eShsYXllciwgbmV3T3BhY2l0eSlcblx0XHRcdHNldE9wYWNpdHlTbGlkZXJQb3NpdGlvbihsYXllciwgc2xpZGVySGFuZGxlLCBuZXdPcGFjaXR5KVxuXHRcdH0pXG5cdFx0Lm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG5cblx0XHQgIHZhciBuZXdPcGFjaXR5ID0gY2FsY09wYWNpdHlGcm9tTW91c2VQb3Mob3ZlcmxheSlcblxuXHRcdCAgLy9zZW5kIGdvb2dsZSBhbmFseXRpY3Mgb3BhY2l0eSBzbGlkZXIgY2hhbmdlXG5cdFx0ICBnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdvcGFjaXR5IHNsaWRlcicsXG5cdFx0XHRldmVudEFjdGlvbjogJ2NoYW5nZScsXG5cdFx0XHRldmVudExhYmVsOiAne1wiJyArIGxheWVyLm5hbWUgKyAnXCI6IFwiJyArIG5ld09wYWNpdHkgKyAnXCJ9Jyxcblx0XHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHRcdCAgfSk7XG5cblx0XHRcdHVwZGF0ZVNoYXJlVXJsKClcblx0XHR9KVxuXHQpXG59XG5cbmZ1bmN0aW9uIGNhbGNPcGFjaXR5RnJvbU1vdXNlUG9zKG92ZXJsYXkpIHtcblx0dmFyIHlQb3MgPSBkMy5tb3VzZShvdmVybGF5KVsxXVxuXHR2YXIgbmV3T3BhY2l0eSA9IG9wYWNpdHlTY2FsZS5pbnZlcnQoeVBvcylcblx0cmV0dXJuIG5ld09wYWNpdHlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL29wYWNpdHlTbGlkZXIuanMiLCIvKlxuICBcImxvZ29cIjoge1xuXHRcImltYWdlXCI6IFwiaW1ncy9sYW5kYXRfbG9nb19ibHVlLnBuZ1wiLFxuXHRcImFsdFwiOiBcIkxvZ28gZm9yIHRoZSBMYW5EYXQgcHJvamVjdFwiLFxuXHRcImxpbmtcIjogXCJodHRwczovL2xhbmRhdC1kZXYubmVtYWMub3JnXCIsXG5cdFwibG9jYXRpb25cIjogW1wiYm90dG9tXCIsIFwicmlnaHRcIl1cbiAgfSxcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENyZWF0ZUxvZ28gKGxvZ29kYXRhKSB7XG5cdGlmICghbG9nb2RhdGEuaW1hZ2UpIHJldHVybjtcblxuXHR2YXIgbG9nb1dyYXBwZXIgPSBjcmVhdGVMb2dvV3JhcHBlcigpO1xuXHR2YXIgbG9nb0ltYWdlID0gY3JlYXRlTG9nb0ltYWdlKGxvZ29kYXRhKTtcblx0dmFyIGxvZ29MaW5rID0gbG9nb2RhdGEubGluayA/IGNyZWF0ZUxvZ29MaW5rKGxvZ29kYXRhLmxpbmspIDogbnVsbDtcblxuXHRpZiAobG9nb0xpbmspIHtcblx0XHRsb2dvTGluay5hcHBlbmRDaGlsZChsb2dvSW1hZ2UpO1xuXHRcdGxvZ29XcmFwcGVyLmFwcGVuZENoaWxkKGxvZ29MaW5rKTtcblx0fSBlbHNlIHtcblx0XHRsb2dvV3JhcHBlci5hcHBlbmRDaGlsZChsb2dvSW1hZ2UpO1xuXHR9XG5cblx0dmFyIGluc2VydEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGxvZ29kYXRhLmxvY2F0aW9uKVswXTtcblx0dmFyIGV4aXN0aW5nQ2hpbGQgPSBpbnNlcnRFbGVtZW50LmZpcnN0Q2hpbGQ7XG5cdGluc2VydEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGxvZ29XcmFwcGVyLCBleGlzdGluZ0NoaWxkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9nb1dyYXBwZXIgKCkge1xuXHR2YXIgbG9nb1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRkMy5zZWxlY3QobG9nb1dyYXBwZXIpLmNsYXNzZWQoXCJwcm9qZWN0LWxvZ29cIiwgdHJ1ZSk7XG5cdHJldHVybiBsb2dvV3JhcHBlcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9nb0ltYWdlIChsb2dvZGF0YSkge1xuXHR2YXIgbG9nb0ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0bG9nb0ltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBsb2dvZGF0YS5pbWFnZSk7XG5cdGlmIChsb2dvZGF0YS5sYWJlbCkge1xuXHRcdGxvZ29JbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgbG9nb2RhdGEubGFiZWwpO1xuXHRcdGxvZ29JbWFnZS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsb2dvZGF0YS5sYWJlbCk7XG5cdH1cblx0cmV0dXJuIGxvZ29JbWFnZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9nb0xpbmsgKGxpbmspIHtcblx0dmFyIGxvZ29MaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdGxvZ29MaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgbGluayk7XG5cdGxvZ29MaW5rLnNldEF0dHJpYnV0ZShcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcblxuXHRsb2dvTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuXHQgIC8vc2VuZCBnb29nbGUgYW5hbHl0aWNzIGZvciBjbGlja2luZyBsb2dvXG5cdCAgZ2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ21hcCcsXG5cdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0ZXZlbnRMYWJlbDogJ2xhbmRhdCBsb2dvJyxcblx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0ICB9KTtcblx0fSk7XG5cblx0cmV0dXJuIGxvZ29MaW5rO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvbG9nby5qcyIsImltcG9ydCB7Y2xlYXJNYXB9IGZyb20gJy4vbWFwJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCaW5kTW9iaWxlTWVudUV2ZW50cyAoKSB7XG5cdGQzLnNlbGVjdChcIiNtb2JpbGUtdG9nZ2xlLXBhbmVsLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZU1vYmlsZVRvZ2dsZVBhbmVsQnRuQ2xpY2spXG5cdGQzLnNlbGVjdEFsbChcIiNtb2JpbGUtY2xlYXItbWFwLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZU1vYmlsZUNsZWFyTWFwQnRuQ2xpY2spXG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1vYmlsZUNsZWFyTWFwQnRuQ2xpY2soKSB7XG5cdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdGNsZWFyTWFwKClcblx0ZGlzcGF0Y2hNb2JpbGVDbGVhck1hcEJ0bkNsaWNrQW5hbHl0aWNzKClcbn1cblxuZnVuY3Rpb24gaGFuZGxlTW9iaWxlVG9nZ2xlUGFuZWxCdG5DbGljayAoKSB7XG5cdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdHZhciB3cmFwcGVyID0gZDMuc2VsZWN0KFwiI3dyYXBwZXJcIik7XG5cdHZhciBzdGF0dXMgPSB3cmFwcGVyLmNsYXNzZWQoXCJtb2JpbGUtbWVudS1oaWRkZW5cIik7XG5cdHdyYXBwZXIuY2xhc3NlZChcIm1vYmlsZS1tZW51LWhpZGRlblwiLCAhc3RhdHVzKTtcblx0ZGlzcGF0Y2hNb2JpbGVUb2dnbGVQYW5lbEJ0bkNsaWNrQW5hbHl0aWNzKCFzdGF0dXMgPyBcIm9wZW5pbmdcIiA6IFwiY2xvc2luZ1wiKTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hNb2JpbGVDbGVhck1hcEJ0bkNsaWNrQW5hbHl0aWNzICgpIHtcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ21vYmlsZSBjbGVhcm1hcCcsXG5cdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0ZXZlbnRMYWJlbDogJ01vYmlsZSBDbGVhciBNYXAnLFxuXHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHR9KVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE1vYmlsZVRvZ2dsZVBhbmVsQnRuQ2xpY2tBbmFseXRpY3MgKHN0YXR1cykge1xuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRldmVudENhdGVnb3J5OiAnbW9iaWxlIG1lbnUnLFxuXHRcdGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuXHRcdGV2ZW50TGFiZWw6ICdNb2JpbGUgUGFuZWwgVG9nZ2xlJyArIHN0YXR1cyxcblx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9tb2JpbGUuanMiLCJpbXBvcnQge0dldE1hcCwgY2xlYXJNYXB9IGZyb20gXCIuL21hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCaW5kRGVza3RvcE1lbnVFdmVudHMgKCkge1xuXHRkMy5zZWxlY3QoXCIjdG9nZ2xlLXBhbmVsLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZURlc2t0b3BUb2dnbGVQYW5lbEJ0bkNsaWNrKVxuXHRkMy5zZWxlY3RBbGwoXCIjY2xlYXItbWFwLWJ1dHRvblwiKVxuXHRcdC5vbihcImNsaWNrXCIsIGhhbmRsZURlc2t0b3BDbGVhck1hcEJ0bkNsaWNrKVxufVxuXG5mdW5jdGlvbiBoYW5kbGVEZXNrdG9wQ2xlYXJNYXBCdG5DbGljayhlKSB7XG5cdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdGNsZWFyTWFwKClcblx0Ly8gUXVpY2sgYW5kIGRpcnR5IHNvbHV0aW9uIC0tIGNyZWF0ZXMgYSBuZXcgc2Vzc2lvbiBmb3IgZ29vZ2xlIGFuYWx5dGljcz9cblx0Ly92YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKVswXVxuXHQvL3dpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsXG5cdGRpc3BhdGNoRGVza3RvcENsZWFyTWFwQnRuQ2xpY2tBbmFseXRpY3MoKVxufVxuXG5mdW5jdGlvbiBoYW5kbGVEZXNrdG9wVG9nZ2xlUGFuZWxCdG5DbGljayAoZSkge1xuXHRkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHR2YXIgd3JhcHBlciA9IGQzLnNlbGVjdChcIiN3cmFwcGVyXCIpO1xuXHR2YXIgc3RhdHVzID0gd3JhcHBlci5jbGFzc2VkKFwicGFuZWwtYWN0aXZlXCIpO1xuXHR3cmFwcGVyLmNsYXNzZWQoXCJwYW5lbC1hY3RpdmVcIiwgIXN0YXR1cyk7XG5cdHdyYXBwZXIuY2xhc3NlZChcInBhbmVsLWluYWN0aXZlXCIsIHN0YXR1cyk7XG5cdChHZXRNYXAoKSkuaW52YWxpZGF0ZVNpemUoe3BhbjogZmFsc2V9KTtcblx0ZGlzcGF0Y2hEZXNrdG9wVG9nZ2xlUGFuZWxCdG5DbGlja0FuYWx5dGljcyghc3RhdHVzID8gXCJPcGVuXCIgOiBcIkNsb3NlXCIpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaERlc2t0b3BDbGVhck1hcEJ0bkNsaWNrQW5hbHl0aWNzICgpIHtcblx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0ZXZlbnRDYXRlZ29yeTogJ2Rlc2t0b3AnLFxuXHRcdGV2ZW50QWN0aW9uOiAnY2xpY2snLFxuXHRcdGV2ZW50TGFiZWw6ICdDbGVhciBNYXAgQnRuJyxcblx0XHRub25JbnRlcmFjdGlvbjogZmFsc2Vcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRGVza3RvcFRvZ2dsZVBhbmVsQnRuQ2xpY2tBbmFseXRpY3MgKHN0YXR1cykge1xuXHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRldmVudENhdGVnb3J5OiAnZGVza3RvcCcsXG5cdFx0ZXZlbnRBY3Rpb246ICdjbGljaycsXG5cdFx0ZXZlbnRMYWJlbDogJ1BhbmVsIFRvZ2dsZSAnICsgc3RhdHVzLFxuXHRcdG5vbkludGVyYWN0aW9uOiBmYWxzZVxuXHR9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3BhbmVsVG9nZ2xlLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Nzcy9zYXNzL2xhbmRhdC5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9