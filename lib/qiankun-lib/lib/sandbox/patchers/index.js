"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = void 0;
exports.patchAtBootstrapping = patchAtBootstrapping;
exports.patchAtMounting = patchAtMounting;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _interfaces = require("../../interfaces");
var css = _interopRequireWildcard(require("./css"));
exports.css = css;
var _dynamicAppend = require("./dynamicAppend");
var _historyListener = _interopRequireDefault(require("./historyListener"));
var _interval = _interopRequireDefault(require("./interval"));
var _windowListener = _interopRequireDefault(require("./windowListener"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * @author Kuitos
 * @since 2019-04-11
 */

function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox, _patchersInSandbox$sa;
  var basePatchers = [function () {
    return (0, _interval.default)(sandbox.proxy);
  }, function () {
    return (0, _windowListener.default)(sandbox.proxy);
  }, function () {
    return (0, _historyListener.default)();
  }];
  var patchersInSandbox = (_patchersInSandbox = {}, (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter, speedySandBox);
  }])), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Snapshot, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), _patchersInSandbox);
  return (_patchersInSandbox$sa = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa === void 0 ? void 0 : _patchersInSandbox$sa.map(function (patch) {
    return patch();
  });
}
function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox2, _patchersInSandbox$sa2;
  var patchersInSandbox = (_patchersInSandbox2 = {}, (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.LegacyProxy, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Proxy, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter, speedySandBox);
  }]), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Snapshot, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), _patchersInSandbox2);
  return (_patchersInSandbox$sa2 = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa2 === void 0 ? void 0 : _patchersInSandbox$sa2.map(function (patch) {
    return patch();
  });
}