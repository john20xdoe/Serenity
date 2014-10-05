﻿(function() {
	'use strict';
	var $asm = {};
	global.Serenity = global.Serenity || {};
	ss.initAssembly($asm, 'Serenity.Script.Core');
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Q
	var $Q = function() {
	};
	$Q.__typeName = 'Q';
	$Q.$blockUIWithCheck = function(options) {
		if ($Q.$blockUICount > 0) {
			$Q.$blockUICount++;
			return;
		}
		$.blockUI(options);
		$Q.$blockUICount++;
	};
	$Q.blockUI = function(options) {
		options = $.extend({ baseZ: 2000, message: '', overlayCSS: { opacity: '0.0', zIndex: 2000, cursor: 'wait' }, fadeOut: 0 }, options);
		if (options.useTimeout) {
			window.setTimeout(function() {
				$Q.$blockUIWithCheck(options);
			}, 0);
		}
		else {
			$Q.$blockUIWithCheck(options);
		}
	};
	$Q.blockUndo = function() {
		if ($Q.$blockUICount > 1) {
			$Q.$blockUICount--;
			return;
		}
		$Q.$blockUICount--;
		$.unblockUI({ fadeOut: 0 });
	};
	$Q.formatDate = function(date, format) {
		if (ss.staticEquals(date, null)) {
			return '';
		}
		if (ss.isNullOrUndefined(format)) {
			format = $Q$Culture.dateFormat;
		}
		var pad = function(i) {
			return ss.padLeftString(i.toString(), 2, 48);
		};
		return format.replace(new RegExp('dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|fff|zz?z?|\\/', 'g'), function(fmt) {
			switch (fmt) {
				case '/': {
					return $Q$Culture.dateSeparator;
				}
				case 'hh': {
					return pad(((date.getHours() < 13) ? date.getHours() : (date.getHours() - 12)));
				}
				case 'h': {
					return ((date.getHours() < 13) ? date.getHours() : (date.getHours() - 12));
				}
				case 'HH': {
					return pad(date.getHours());
				}
				case 'H': {
					return date.getHours();
				}
				case 'mm': {
					return pad(date.getMinutes());
				}
				case 'm': {
					return date.getMinutes();
				}
				case 'ss': {
					return pad(date.getSeconds());
				}
				case 's': {
					return date.getSeconds();
				}
				case 'yyyy': {
					return date.getFullYear();
				}
				case 'yy': {
					return date.getFullYear().toString().substr(2, 4);
				}
				case 'dddd': {
					return ss.cast(date.GetDayName(), String);
				}
				case 'ddd': {
					return ss.cast(date.GetDayName(true), String);
				}
				case 'dd': {
					return pad(date.getDate());
				}
				case 'd': {
					return date.getDate().toString();
				}
				case 'MM': {
					return pad(date.getMonth() + 1);
				}
				case 'M': {
					return date.getMonth() + 1;
				}
				case 't': {
					return ((date.getHours() < 12) ? 'A' : 'P');
				}
				case 'tt': {
					return ((date.getHours() < 12) ? 'AM' : 'PM');
				}
				case 'fff': {
					return ss.padLeftString(date.getMilliseconds().toString(), 3, 48);
				}
				case 'zzz':
				case 'zz':
				case 'z': {
					return '';
				}
				default: {
					return fmt;
				}
			}
		});
	};
	$Q.parseDate = function(value) {
		return Q$Externals.parseDate(value);
	};
	$Q.parseISODateTime = function(value) {
		return Q$Externals.parseISODateTime(value);
	};
	$Q.alert = function(message, options) {
		Q$Externals.alertDialog(message, options);
	};
	$Q.warning = function(message, options) {
		Q$Externals.alertDialog(message, $.extend({ title: $Texts$Dialogs.WarningTitle.get(), dialogClass: 's-MessageDialog s-WarningDialog' }, options));
	};
	$Q.confirm = function(message, onYes, options) {
		Q$Externals.confirmDialog(message, onYes, options);
	};
	$Q.information = function(message, onOk, options) {
		Q$Externals.confirmDialog(message, onOk, $.extend({ title: $Texts$Dialogs.InformationTitle.get(), yesButton: $Texts$Dialogs.OkButton.get(), noButton: null, dialogClass: 's-MessageDialog s-InformationDialog' }, options));
	};
	$Q.tryCatch = function(fail, callback) {
		if (ss.staticEquals(fail, null)) {
			return callback;
		}
		return function() {
			try {
				callback();
			}
			catch ($t1) {
				var ex = ss.Exception.wrap($t1);
				fail(ex);
			}
		};
	};
	$Q.htmlEncode = function(value) {
		var text = (ss.isNullOrUndefined(value) ? '' : value.toString());
		if ((new RegExp('[><&]', 'g')).test(text)) {
			return text.replace(new RegExp('[><&]', 'g'), $Q.$htmlEncodeReplacer);
		}
		return text;
	};
	$Q.newBodyDiv = function() {
		return $('<div/>').appendTo(document.body);
	};
	$Q.$htmlEncodeReplacer = function(a) {
		switch (a) {
			case '&': {
				return '&amp;';
			}
			case '>': {
				return '&gt;';
			}
			case '<': {
				return '&lt;';
			}
		}
		return a;
	};
	$Q.clearOptions = function(select) {
		select.html('');
	};
	$Q.addEmptyOption = function(select) {
		$Q.addOption(select, '', '--seçiniz--');
	};
	$Q.addOption = function(select, key, text) {
		$('<option/>').val(key).text(text).appendTo(select);
	};
	$Q.findElementWithRelativeId = function(element, relativeId) {
		var elementId = element.attr('id');
		if ($Q.isEmptyOrNull(elementId)) {
			return $('#' + relativeId);
		}
		var result = $(elementId + relativeId);
		if (result.length > 0) {
			return result;
		}
		result = $(elementId + '_' + relativeId);
		if (result.length > 0) {
			return result;
		}
		while (true) {
			var idx = elementId.lastIndexOf(String.fromCharCode(95));
			if (idx <= 0) {
				return $('#' + relativeId);
			}
			elementId = elementId.substr(0, idx);
			result = $('#' + elementId + '_' + relativeId);
			if (result.length > 0) {
				return result;
			}
		}
	};
	$Q.outerHtml = function(element) {
		return $('<i/>').append(element.eq(0).clone()).html();
	};
	$Q.layoutFillHeightValue = function(element) {
		var h = 0;
		element.parent().children().not(element).each(function(i, e) {
			var q = $(e);
			if (q.is(':visible')) {
				h += q.outerHeight(true);
			}
		});
		h = element.parent().height() - h;
		h = h - (element.outerHeight(true) - element.height());
		return h;
	};
	$Q.layoutFillHeight = function(element) {
		var h = $Q.layoutFillHeightValue(element);
		var n = h + 'px';
		if (!ss.referenceEquals(element.css('height'), n)) {
			element.css('height', n);
		}
	};
	$Q.initFullHeightGridPage = function(gridDiv) {
		$('body').addClass('full-height-page');
		var layout = function() {
			if (gridDiv.parent().hasClass('page-content')) {
				gridDiv.css('height', '1px').css('overflow', 'hidden');
			}
			$Q.layoutFillHeight(gridDiv);
			gridDiv.triggerHandler('layout');
		};
		if ($('body').hasClass('has-layout-event')) {
			$('body').bind('layout', layout);
		}
		else if (!!ss.isValue(window.window.Metronic)) {
			window.window.Metronic.addResizeHandler(layout);
		}
		else {
			$(window).resize(layout);
		}
		layout(null);
	};
	$Q.addFullHeightResizeHandler = function(handler) {
		$('body').addClass('full-height-page');
		var layout = function() {
			var avail;
			try {
				avail = parseInt(ss.coalesce($('.page-content').css('min-height'), '0')) - parseInt(ss.coalesce($('.page-content').css('padding-top'), '0')) - parseInt(ss.coalesce($('.page-content').css('padding-bottom'), '0'));
			}
			catch ($t1) {
				avail = 100;
			}
			handler(avail);
		};
		if (!!ss.isValue(window.window.Metronic)) {
			window.window.Metronic.addResizeHandler(layout);
		}
		else {
			$(window).resize(layout);
		}
		layout(null);
	};
	$Q.triggerLayoutOnShow = function(element) {
		$Serenity_LazyLoadHelper.executeEverytimeWhenShown(element, function() {
			element.triggerHandler('layout');
		}, true);
	};
	$Q.autoFullHeight = function(element) {
		element.css('height', '100%');
		$Q.triggerLayoutOnShow(element);
	};
	$Q.notifyWarning = function(message) {
		toastr.warning(message, '', $Q.$getToastrOptions());
	};
	$Q.notifySuccess = function(message) {
		toastr.success(message, '', $Q.$getToastrOptions());
	};
	$Q.notifyInfo = function(message) {
		toastr.info(message, '', $Q.$getToastrOptions());
	};
	$Q.notifyError = function(message) {
		toastr.error(message, '', $Q.$getToastrOptions());
	};
	$Q.$getToastrOptions = function() {
		var dialog = $(window.document.body).children('.ui-dialog').last();
		var toastrDiv = $('#toast-container');
		var options = { timeOut: 3000, showDuration: 250, hideDuration: 500, extendedTimeOut: 500 };
		if (dialog.length > 0) {
			if (!toastrDiv.hasClass('dialog-toast') && toastrDiv.length > 0) {
				toastrDiv.remove();
			}
			options.target = dialog;
			options.positionClass = 'toast-top-full-width dialog-toast';
		}
		else {
			toastrDiv.removeClass('dialog-toast');
			if (toastrDiv.hasClass('dialog-toast') && toastrDiv.length > 0) {
				toastrDiv.remove();
			}
			options.positionClass = 'toast-top-full-width';
		}
		return options;
	};
	$Q.formatNumber = function(number, format) {
		if (!ss.isValue(number)) {
			return '';
		}
		return Q$Externals.formatNumber(number, format, $Q$Culture.decimalSeparator, $Q$Culture.get_groupSeperator());
	};
	$Q.parseDecimal = function(value) {
		if (ss.isNullOrUndefined(value) || $Q.isTrimmedEmpty(value)) {
			return null;
		}
		return Q$Externals.parseDecimal(value);
	};
	$Q.getRemoteData = function(key) {
		return $Q$ScriptData.ensure('RemoteData.' + key);
	};
	$Q.getRemoteData$1 = function(key, complete, fail) {
		$Q$ScriptData.ensure$1('RemoteData.' + key, complete, fail);
	};
	$Q.getLookup = function(key) {
		return $Q$ScriptData.ensure('Lookup.' + key);
	};
	$Q.getLookup$1 = function(key, complete, fail) {
		$Q$ScriptData.ensure$1('Lookup.' + key, complete, fail);
	};
	$Q.reloadLookup = function(key) {
		$Q$ScriptData.reload('Lookup.' + key);
	};
	$Q.reloadLookup$1 = function(key, complete, fail) {
		$Q$ScriptData.reload$1('Lookup.' + key, function(o) {
			complete();
		}, fail);
	};
	$Q.getColumns = function(key) {
		return $Q$ScriptData.ensure('Columns.' + key);
	};
	$Q.getColumns$1 = function(key, complete, fail) {
		$Q$ScriptData.ensure$1('Columns.' + key, complete, fail);
	};
	$Q.getForm = function(key) {
		return $Q$ScriptData.ensure('Form.' + key);
	};
	$Q.getForm$1 = function(key, complete, fail) {
		$Q$ScriptData.ensure$1('Form.' + key, complete, fail);
	};
	$Q.getTemplate = function(key) {
		return $Q$ScriptData.ensure('Template.' + key);
	};
	$Q.getTemplate$1 = function(key, complete, fail) {
		$Q$ScriptData.ensure$1('Template.' + key, complete, fail);
	};
	$Q.canLoadScriptData = function(name) {
		return $Q$ScriptData.canLoad(name);
	};
	$Q.serviceCall = function(options) {
		var handleError = function(response) {
			if (!ss.staticEquals($Q$Config.notLoggedInHandler, null) && ss.isValue(response) && ss.isValue(response.Error) && response.Error.Code === 'NotLoggedIn' && $Q$Config.notLoggedInHandler(options, response)) {
				return;
			}
			if (!ss.staticEquals(options.onError, null)) {
				options.onError(response);
			}
			else {
				$Q$ErrorHandling.showServiceError(response.Error);
			}
		};
		options = $.extend({
			dataType: 'json',
			contentType: 'application/json',
			type: 'POST',
			cache: false,
			blockUI: true,
			url: ((ss.isValue(options.service) && !ss.startsWithString(options.service, String.fromCharCode(126)) && !ss.startsWithString(options.service, String.fromCharCode(47))) ? $Q.resolveUrl('~/services/' + options.service) : $Q.resolveUrl(options.service)),
			data: $.toJSON(options.request),
			success: function(data, textStatus, request) {
				var response1 = data;
				try {
					if (ss.isNullOrUndefined(response1.Error)) {
						if (!ss.staticEquals(options.onSuccess, null)) {
							options.onSuccess(response1);
						}
					}
					else {
					}
				}
				finally {
					if (options.blockUI) {
						$Q.blockUndo();
					}
					if (!ss.staticEquals(options.onCleanup, null)) {
						options.onCleanup();
					}
				}
			},
			error: function(xhr, status, ev) {
				try {
					if (xhr.status === 403) {
						var l = null;
						try {
							l = xhr.getResponseHeader('Location');
						}
						catch ($t1) {
							l = null;
						}
						if (ss.isValue(l)) {
							window.top.location.href = l;
							return;
						}
					}
					if (ss.coalesce(xhr.getResponseHeader('content-type'), '').toLowerCase().indexOf('application/json') >= 0) {
						var json = $.parseJSON(xhr.responseText);
						if (ss.isValue(json) && ss.isValue(json.Error)) {
							handleError(json);
							return;
						}
					}
					var html = xhr.responseText;
					Q$Externals.iframeDialog({ html: html });
				}
				finally {
					if (options.blockUI) {
						$Q.blockUndo();
					}
					if (!ss.staticEquals(options.onCleanup, null)) {
						options.onCleanup();
					}
				}
			}
		}, options);
		if (options.blockUI) {
			$Q.blockUI(null);
		}
		return $.ajax(options);
	};
	$Q.serviceRequest = function(service, request, onSuccess, options) {
		$Q.serviceCall($.extend({ service: service, request: request, onSuccess: onSuccess }, options));
	};
	$Q.trim = function(text) {
		return ss.coalesce(text, '').replace(new RegExp('^\\s+|\\s+$', 'g'), '');
	};
	$Q.isEmptyOrNull = function(str) {
		return ss.isNullOrUndefined(str) || str.length === 0;
	};
	$Q.isTrimmedEmpty = function(str) {
		return ss.isNullOrUndefined($Q.trimToNull(str));
	};
	$Q.trimToNull = function(str) {
		if (ss.isNullOrUndefined(str) || str.length === 0) {
			return null;
		}
		else {
			str = str.trim();
			if (str.length === 0) {
				return null;
			}
			else {
				return str;
			}
		}
	};
	$Q.trimToEmpty = function(str) {
		if (ss.isNullOrUndefined(str) || str.length === 0) {
			return '';
		}
		else {
			return str.trim();
		}
	};
	$Q.toSingleLine = function(str) {
		return ss.replaceAllString(ss.replaceAllString($Q.trimToEmpty(str), '\r\n', ' '), '\n', ' ').trim();
	};
	$Q.text = function(key) {
		var $t1 = $Q$LT.$table[key];
		if (ss.isNullOrUndefined($t1)) {
			$t1 = ss.coalesce(key, '');
		}
		return $t1;
	};
	$Q.tryGetText = function(key) {
		return $Q$LT.$table[key];
	};
	$Q.resolveUrl = function(url) {
		if (ss.isValue(url) && url.length > 0 && url.substr(0, 2) === '~/') {
			return $Q$Config.applicationPath + url.substr(2);
		}
		else {
			return url;
		}
	};
	$Q.autoOpenByQuery = function(key, autoOpen) {
		var query = Q$Externals.parseQueryString();
		var value = query[key];
		if (ss.isValue(value)) {
			autoOpen(value);
		}
	};
	$Q.autoOpenByQueryID = function(key, autoOpen) {
		$Q.autoOpenByQuery(key, function(value) {
			var id = $Serenity_IdExtensions.convertToId(value);
			if (ss.isNullOrUndefined(id) || isNaN(id)) {
				return;
			}
			autoOpen(ss.unbox(id));
		});
	};
	global.Q = $Q;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Q.Config
	var $Q$Config = function() {
	};
	$Q$Config.__typeName = 'Q$Config';
	global.Q$Config = $Q$Config;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Q.Culture
	var $Q$Culture = function() {
	};
	$Q$Culture.__typeName = 'Q$Culture';
	$Q$Culture.get_groupSeperator = function() {
		return (($Q$Culture.decimalSeparator === ',') ? '.' : ',');
	};
	global.Q$Culture = $Q$Culture;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Q.ErrorHandling
	var $Q$ErrorHandling = function() {
	};
	$Q$ErrorHandling.__typeName = 'Q$ErrorHandling';
	$Q$ErrorHandling.showServiceError = function(error) {
		if (ss.isNullOrUndefined(error)) {
			throw new ss.Exception('error is null!');
		}
		var $t2;
		if (ss.isNullOrUndefined(error)) {
			$t2 = '??ERROR??';
		}
		else {
			var $t1 = error.Message;
			if (ss.isNullOrUndefined($t1)) {
				$t1 = error.Code;
			}
			$t2 = $t1;
		}
		$Q.alert($t2);
	};
	global.Q$ErrorHandling = $Q$ErrorHandling;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Lookup
	var $Q$Lookup = function(options, items) {
		this.$items = null;
		this.$itemById = null;
		this.$options = null;
		this.$items = [];
		this.$itemById = {};
		this.$options = options || {};
		if (ss.isValue(items)) {
			this.update(items);
		}
	};
	$Q$Lookup.__typeName = 'Q$Lookup';
	global.Q$Lookup = $Q$Lookup;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.LocalText
	var $Q$LT = function(key) {
		this.$key = null;
		this.$key = key;
	};
	$Q$LT.__typeName = 'Q$LT';
	$Q$LT.add = function(obj, prefix) {
		if (!ss.isValue(obj)) {
			return;
		}
		prefix = ss.coalesce(prefix, '');
		var $t1 = ss.getEnumerator(Object.keys(obj));
		try {
			while ($t1.moveNext()) {
				var k = $t1.current();
				var actual = prefix + k;
				var o = obj[k];
				if (typeof(o) === 'object') {
					$Q$LT.add(o, actual + '.');
				}
				else {
					$Q$LT.$table[actual] = o;
				}
			}
		}
		finally {
			$t1.dispose();
		}
	};
	$Q$LT.initializeTextClass = function(type, prefix) {
		var t = type;
		var $t1 = ss.arrayClone(Object.keys(type));
		for (var $t2 = 0; $t2 < $t1.length; $t2++) {
			var member = $t1[$t2];
			var value = t[member];
			if (ss.isInstanceOfType(value, $Q$LT)) {
				var lt = value;
				var key = prefix + member;
				$Q$LT.$table[key] = lt.$key;
				t[member] = new $Q$LT(key);
			}
		}
	};
	$Q$LT.getDefault = function(key, defaultText) {
		var $t2 = $Q$LT.$table[key];
		if (ss.isNullOrUndefined($t2)) {
			var $t1 = defaultText;
			if (ss.isNullOrUndefined($t1)) {
				$t1 = ss.coalesce(key, '');
			}
			$t2 = $t1;
		}
		return $t2;
	};
	global.Q$LT = $Q$LT;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Q.ScriptData
	var $Q$ScriptData = function() {
	};
	$Q$ScriptData.__typeName = 'Q$ScriptData';
	$Q$ScriptData.bindToChange = function(name, regClass, onChange) {
		$(document.body).bind('scriptdatachange.' + regClass, function(e, s) {
			if (ss.referenceEquals(s, name)) {
				onChange();
			}
		});
	};
	$Q$ScriptData.triggerChange = function(name) {
		$(document.body).triggerHandler('scriptdatachange', [name]);
	};
	$Q$ScriptData.unbindFromChange = function(regClass) {
		$(document.body).unbind('scriptdatachange.' + regClass);
	};
	$Q$ScriptData.$syncLoadScript = function(url) {
		$.ajax({ async: false, cache: true, type: 'GET', url: url, data: null, dataType: 'script' });
	};
	$Q$ScriptData.$loadScript = function(url, complete, fail) {
		$Q.tryCatch(fail, function() {
			$Q.blockUI(null);
			$.ajax({ async: true, cache: true, type: 'GET', url: url, data: null, dataType: 'script' }).always(function() {
				$Q.blockUndo();
			}).done(function(response) {
				complete(response);
			}).fail(function(response1) {
				fail(response1);
			});
		})();
	};
	$Q$ScriptData.$loadScriptData = function(name) {
		if (!ss.keyExists($Q$ScriptData.$registered, name)) {
			throw new ss.Exception(ss.formatString('Script data {0} is not found in registered script list!', name));
		}
		name = name + '.js?' + $Q$ScriptData.$registered[name];
		$Q$ScriptData.$syncLoadScript($Q.resolveUrl('~/DynJS.axd/') + name);
	};
	$Q$ScriptData.$loadScriptData$1 = function(name, complete, fail) {
		$Q.tryCatch(fail, function() {
			if (!ss.keyExists($Q$ScriptData.$registered, name)) {
				throw new ss.Exception(ss.formatString('Script data {0} is not found in registered script list!', name));
			}
			name = name + '.js?' + $Q$ScriptData.$registered[name];
			$Q$ScriptData.$loadScript($Q.resolveUrl('~/DynJS.axd/') + name, complete, fail);
		})();
	};
	$Q$ScriptData.ensure = function(name) {
		var data = $Q$ScriptData.$loadedData[name];
		if (!ss.isValue(data)) {
			$Q$ScriptData.$loadScriptData(name);
		}
		data = $Q$ScriptData.$loadedData[name];
		if (!ss.isValue(data)) {
			throw new ss.NotSupportedException(ss.formatString("Can't load script data: {0}!", name));
		}
		return data;
	};
	$Q$ScriptData.ensure$1 = function(name, complete, fail) {
		$Q.tryCatch(fail, function() {
			var data = $Q$ScriptData.$loadedData[name];
			if (!ss.isValue(data)) {
				$Q$ScriptData.$loadScriptData$1(name, $Q.tryCatch(fail, function() {
					data = $Q$ScriptData.$loadedData[name];
					if (!ss.isValue(data)) {
						throw new ss.NotSupportedException(ss.formatString("Can't load script data: {0}!", name));
					}
					complete(data);
				}), fail);
				return;
			}
			complete(data);
		})();
	};
	$Q$ScriptData.reload = function(name) {
		if (!ss.keyExists($Q$ScriptData.$registered, name)) {
			throw new ss.NotSupportedException(ss.formatString('Script data {0} is not found in registered script list!'));
		}
		$Q$ScriptData.$registered[name] = (new Date()).getTime().toString();
		$Q$ScriptData.$loadScriptData(name);
		var data = $Q$ScriptData.$loadedData[name];
		return data;
	};
	$Q$ScriptData.reload$1 = function(name, complete, fail) {
		$Q.tryCatch(fail, function() {
			if (!ss.keyExists($Q$ScriptData.$registered, name)) {
				throw new ss.NotSupportedException(ss.formatString('Script data {0} is not found in registered script list!'));
			}
			$Q$ScriptData.$registered[name] = (new Date()).getTime().toString();
			$Q$ScriptData.$loadScriptData$1(name, $Q.tryCatch(fail, function() {
				complete($Q$ScriptData.$loadedData[name]);
			}), fail);
		})();
	};
	$Q$ScriptData.canLoad = function(name) {
		var data = $Q$ScriptData.$loadedData[name];
		if (ss.isValue(data) || ss.keyExists($Q$ScriptData.$registered, name)) {
			return true;
		}
		return false;
	};
	$Q$ScriptData.setRegisteredScripts = function(scripts) {
		ss.clearKeys($Q$ScriptData.$registered);
		var $t1 = new ss.ObjectEnumerator(scripts);
		try {
			while ($t1.moveNext()) {
				var k = $t1.current();
				$Q$ScriptData.$registered[k.key] = k.value.toString();
			}
		}
		finally {
			$t1.dispose();
		}
	};
	$Q$ScriptData.set = function(name, value) {
		$Q$ScriptData.$loadedData[name] = value;
		$Q$ScriptData.triggerChange(name);
	};
	global.Q$ScriptData = $Q$ScriptData;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts
	var $Texts = function() {
	};
	$Texts.__typeName = 'Texts';
	global.Texts = $Texts;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Controls
	var $Texts$Controls = function() {
	};
	$Texts$Controls.__typeName = 'Texts$Controls';
	global.Texts$Controls = $Texts$Controls;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Controls.EntityDialog
	var $Texts$Controls$EntityDialog = function() {
	};
	$Texts$Controls$EntityDialog.__typeName = 'Texts$Controls$EntityDialog';
	global.Texts$Controls$EntityDialog = $Texts$Controls$EntityDialog;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Controls.EntityGrid
	var $Texts$Controls$EntityGrid = function() {
	};
	$Texts$Controls$EntityGrid.__typeName = 'Texts$Controls$EntityGrid';
	global.Texts$Controls$EntityGrid = $Texts$Controls$EntityGrid;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Controls.Pager
	var $Texts$Controls$Pager = function() {
	};
	$Texts$Controls$Pager.__typeName = 'Texts$Controls$Pager';
	global.Texts$Controls$Pager = $Texts$Controls$Pager;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Controls.PropertyGrid
	var $Texts$Controls$PropertyGrid = function() {
	};
	$Texts$Controls$PropertyGrid.__typeName = 'Texts$Controls$PropertyGrid';
	global.Texts$Controls$PropertyGrid = $Texts$Controls$PropertyGrid;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Controls.QuickSearch
	var $Texts$Controls$QuickSearch = function() {
	};
	$Texts$Controls$QuickSearch.__typeName = 'Texts$Controls$QuickSearch';
	global.Texts$Controls$QuickSearch = $Texts$Controls$QuickSearch;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.Texts.Dialogs
	var $Texts$Dialogs = function() {
	};
	$Texts$Dialogs.__typeName = 'Texts$Dialogs';
	global.Texts$Dialogs = $Texts$Dialogs;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.CriteriaUtil
	var $Serenity_Criteria = function() {
	};
	$Serenity_Criteria.__typeName = 'Serenity.Criteria';
	$Serenity_Criteria.isEmpty = function(criteria) {
		var array = criteria;
		return array.length === 0 || array.length === 1 && ss.isInstanceOfType(array[0], String) && ss.cast(array[0], String).length === 0;
	};
	$Serenity_Criteria.join = function(criteria1, op, criteria2) {
		if (ss.referenceEquals(null, criteria1)) {
			throw new ss.ArgumentNullException('criteria1');
		}
		if (ss.referenceEquals(null, criteria2)) {
			throw new ss.ArgumentNullException('criteria2');
		}
		if (Serenity.Criteria.isEmpty(criteria1)) {
			return criteria2;
		}
		if (Serenity.Criteria.isEmpty(criteria2)) {
			return criteria1;
		}
		return [criteria1, op, criteria2];
	};
	$Serenity_Criteria.paren = function(criteria) {
		if (!Serenity.Criteria.isEmpty(criteria)) {
			return ['()', criteria];
		}
		return criteria;
	};
	global.Serenity.Criteria = $Serenity_Criteria;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.DialogTypeAttribute
	var $Serenity_DialogTypeAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_DialogTypeAttribute.__typeName = 'Serenity.DialogTypeAttribute';
	global.Serenity.DialogTypeAttribute = $Serenity_DialogTypeAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.EditorAttribute
	var $Serenity_EditorAttribute = function() {
	};
	$Serenity_EditorAttribute.__typeName = 'Serenity.EditorAttribute';
	global.Serenity.EditorAttribute = $Serenity_EditorAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.ElementAttribute
	var $Serenity_ElementAttribute = function(html) {
		this.$html = null;
		this.$html = html;
	};
	$Serenity_ElementAttribute.__typeName = 'Serenity.ElementAttribute';
	global.Serenity.ElementAttribute = $Serenity_ElementAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.EntityTypeAttribute
	var $Serenity_EntityTypeAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_EntityTypeAttribute.__typeName = 'Serenity.EntityTypeAttribute';
	global.Serenity.EntityTypeAttribute = $Serenity_EntityTypeAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.FormKeyAttribute
	var $Serenity_FormKeyAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_FormKeyAttribute.__typeName = 'Serenity.FormKeyAttribute';
	global.Serenity.FormKeyAttribute = $Serenity_FormKeyAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.IdExtensions
	var $Serenity_IdExtensions = function() {
	};
	$Serenity_IdExtensions.__typeName = 'Serenity.IdExtensions';
	$Serenity_IdExtensions.convertToId = function(value) {
		return Q$Externals.toId(value);
	};
	$Serenity_IdExtensions.isPositiveId = function(id) {
		if (!ss.isValue(id)) {
			return false;
		}
		else if (typeof(id) === 'string') {
			var idStr = id;
			if (ss.startsWithString(idStr, '-')) {
				return false;
			}
			return idStr.length > 0;
		}
		else if (typeof(id) === 'number') {
			return id > 0;
		}
		else {
			return true;
		}
	};
	$Serenity_IdExtensions.isNegativeId = function(id) {
		if (!ss.isValue(id)) {
			return false;
		}
		else if (typeof(id) === 'string') {
			var idStr = id;
			if (ss.startsWithString(idStr, '-')) {
				return true;
			}
			return false;
		}
		else if (typeof(id) === 'number') {
			return id < 0;
		}
		else {
			return false;
		}
	};
	global.Serenity.IdExtensions = $Serenity_IdExtensions;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.IdPropertyAttribute
	var $Serenity_IdPropertyAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_IdPropertyAttribute.__typeName = 'Serenity.IdPropertyAttribute';
	global.Serenity.IdPropertyAttribute = $Serenity_IdPropertyAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.IsActivePropertyAttribute
	var $Serenity_IsActivePropertyAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_IsActivePropertyAttribute.__typeName = 'Serenity.IsActivePropertyAttribute';
	global.Serenity.IsActivePropertyAttribute = $Serenity_IsActivePropertyAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.ItemNameAttribute
	var $Serenity_ItemNameAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_ItemNameAttribute.__typeName = 'Serenity.ItemNameAttribute';
	global.Serenity.ItemNameAttribute = $Serenity_ItemNameAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.LazyLoadHelper
	var $Serenity_LazyLoadHelper = function() {
	};
	$Serenity_LazyLoadHelper.__typeName = 'Serenity.LazyLoadHelper';
	$Serenity_LazyLoadHelper.executeOnceWhenShown = function(element, callback) {
		$Serenity_LazyLoadHelper.$autoIncrement++;
		var eventClass = 'ExecuteOnceWhenShown' + $Serenity_LazyLoadHelper.$autoIncrement;
		var executed = false;
		if (element.is(':visible')) {
			callback();
		}
		else {
			var uiTabs = element.closest('.ui-tabs');
			if (uiTabs.length > 0) {
				uiTabs.bind('tabsshow.' + eventClass, function(e) {
					if (element.is(':visible')) {
						uiTabs.unbind('tabsshow.' + eventClass);
						if (!executed) {
							executed = true;
							element.unbind('shown.' + eventClass);
							callback();
						}
					}
				});
			}
			var dialog;
			if (element.hasClass('ui-dialog')) {
				dialog = element.children('.ui-dialog-content');
			}
			else {
				dialog = element.closest('.ui-dialog-content');
			}
			if (dialog.length > 0) {
				dialog.bind('dialogopen.' + eventClass, function() {
					dialog.unbind('dialogopen.' + eventClass);
					if (element.is(':visible') && !executed) {
						executed = true;
						element.unbind('shown.' + eventClass);
						callback();
					}
				});
			}
			element.bind('shown.' + eventClass, function() {
				if (element.is(':visible')) {
					element.unbind('shown.' + eventClass);
					if (!executed) {
						executed = true;
						callback();
					}
				}
			});
		}
	};
	$Serenity_LazyLoadHelper.executeEverytimeWhenShown = function(element, callback, callNowIfVisible) {
		$Serenity_LazyLoadHelper.$autoIncrement++;
		var eventClass = 'ExecuteEverytimeWhenShown' + $Serenity_LazyLoadHelper.$autoIncrement;
		var wasVisible = element.is(':visible');
		if (wasVisible && callNowIfVisible) {
			callback();
		}
		var check = function(e) {
			if (element.is(':visible')) {
				if (!wasVisible) {
					wasVisible = true;
					callback();
				}
			}
			else {
				wasVisible = false;
			}
		};
		var uiTabs = element.closest('.ui-tabs');
		if (uiTabs.length > 0) {
			uiTabs.bind('tabsactivate.' + eventClass, check);
		}
		var dialog = element.closest('.ui-dialog-content');
		if (dialog.length > 0) {
			dialog.bind('dialogopen.' + eventClass, check);
		}
		element.bind('shown.' + eventClass, check);
	};
	global.Serenity.LazyLoadHelper = $Serenity_LazyLoadHelper;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.LocalTextPrefixAttribute
	var $Serenity_LocalTextPrefixAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_LocalTextPrefixAttribute.__typeName = 'Serenity.LocalTextPrefixAttribute';
	global.Serenity.LocalTextPrefixAttribute = $Serenity_LocalTextPrefixAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.NamePropertyAttribute
	var $Serenity_NamePropertyAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_NamePropertyAttribute.__typeName = 'Serenity.NamePropertyAttribute';
	global.Serenity.NamePropertyAttribute = $Serenity_NamePropertyAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.OptionsTypeAttribute
	var $Serenity_OptionsTypeAttribute = function(optionsType) {
		this.$2$OptionsTypeField = null;
		this.set_optionsType(optionsType);
	};
	$Serenity_OptionsTypeAttribute.__typeName = 'Serenity.OptionsTypeAttribute';
	global.Serenity.OptionsTypeAttribute = $Serenity_OptionsTypeAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.ScriptContext
	var $Serenity_ScriptContext = function() {
	};
	$Serenity_ScriptContext.__typeName = 'Serenity.ScriptContext';
	global.Serenity.ScriptContext = $Serenity_ScriptContext;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.ServiceAttribute
	var $Serenity_ServiceAttribute = function(value) {
		this.$2$ValueField = null;
		this.set_value(value);
	};
	$Serenity_ServiceAttribute.__typeName = 'Serenity.ServiceAttribute';
	global.Serenity.ServiceAttribute = $Serenity_ServiceAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.SlickFormatting
	var $Serenity_SlickFormatting = function() {
	};
	$Serenity_SlickFormatting.__typeName = 'Serenity.SlickFormatting';
	$Serenity_SlickFormatting.getEnumText = function(TEnum) {
		return function(value) {
			var key = ss.Enum.toString(TEnum, value);
			return $Serenity_SlickFormatting.getEnumText$1(ss.getTypeName(TEnum), key);
		};
	};
	$Serenity_SlickFormatting.getEnumText$1 = function(enumKey, enumValue) {
		if (ss.isValue(enumValue)) {
			return $Q.htmlEncode($Q.text('Enums.' + enumKey + '.' + enumValue));
		}
		else {
			return '';
		}
	};
	$Serenity_SlickFormatting.enum$1 = function(enumKey) {
		return function(ctx) {
			if (ss.isValue(ctx.value)) {
				return $Q.htmlEncode($Q.text('Enums.' + enumKey + '.' + ctx.value));
			}
			else {
				return '';
			}
		};
	};
	$Serenity_SlickFormatting.treeToggle = function(TEntity) {
		return function(getView, getId, formatter) {
			return function(ctx) {
				var text = formatter(ctx);
				var view = getView();
				var indent = ss.coalesce(ctx.item._indent, 0);
				var spacer = '<span class="s-TreeIndent" style="width:' + 15 * indent + 'px"></span>';
				var id = getId(ss.cast(ctx.item, TEntity));
				var idx = view.getIdxById(id);
				var next = view.getItemByIdx(idx + 1);
				if (!!ss.isValue(next)) {
					var nextIndent = ss.coalesce(next._indent, 0);
					if (nextIndent > indent) {
						if (!!!!ctx.item._collapsed) {
							return spacer + '<span class="s-TreeToggle s-TreeExpand"></span>' + text;
						}
						else {
							return spacer + '<span class="s-TreeToggle s-TreeCollapse"></span>' + text;
						}
					}
				}
				return spacer + '<span class="s-TreeToggle"></span>' + text;
			};
		};
	};
	$Serenity_SlickFormatting.$formatDate = function(value, format) {
		if (!ss.isValue(value)) {
			return '';
		}
		var date;
		if (typeof(value) === 'date') {
			date = value;
		}
		else if (typeof(value) === 'string') {
			date = Q$Externals.parseISODateTime(value);
			if (ss.staticEquals(date, null)) {
				return $Q.htmlEncode(value);
			}
		}
		else {
			return value.toString();
		}
		return $Q.htmlEncode($Q.formatDate(date, format));
	};
	$Serenity_SlickFormatting.date = function(format) {
		var $t1 = format;
		if (ss.isNullOrUndefined($t1)) {
			$t1 = $Q$Culture.dateFormat;
		}
		format = $t1;
		return function(ctx) {
			return $Q.htmlEncode($Serenity_SlickFormatting.$formatDate(ctx.value, format));
		};
	};
	$Serenity_SlickFormatting.dateTime = function(format) {
		var $t1 = format;
		if (ss.isNullOrUndefined($t1)) {
			$t1 = $Q$Culture.dateTimeFormat;
		}
		format = $t1;
		return function(ctx) {
			return $Q.htmlEncode($Serenity_SlickFormatting.$formatDate(ctx.value, format));
		};
	};
	$Serenity_SlickFormatting.checkBox = function() {
		return function(ctx) {
			return '<span class="check-box no-float ' + (!!ctx.value ? ' checked' : '') + '"></span>';
		};
	};
	$Serenity_SlickFormatting.number = function(format) {
		return function(ctx) {
			var value = ctx.value;
			if (!ss.isValue(ctx.value) || isNaN(value)) {
				return '';
			}
			if (typeof(value) === 'number') {
				return $Q.htmlEncode($Q.formatNumber(value, format));
			}
			var dbl = $Q.parseDecimal(value.toString());
			if (ss.isNullOrUndefined(dbl)) {
				return '';
			}
			return $Q.htmlEncode(value.toString());
		};
	};
	$Serenity_SlickFormatting.getItemType$1 = function(link) {
		return $Serenity_SlickFormatting.getItemType(link.attr('href'));
	};
	$Serenity_SlickFormatting.getItemType = function(href) {
		if ($Q.isEmptyOrNull(href)) {
			return null;
		}
		if (ss.startsWithString(href, '#')) {
			href = href.substr(1);
		}
		var idx = href.lastIndexOf(String.fromCharCode(47));
		if (idx >= 0) {
			href = href.substr(0, idx);
		}
		return href;
	};
	$Serenity_SlickFormatting.getItemId$1 = function(link) {
		return $Serenity_SlickFormatting.getItemId(link.attr('href'));
	};
	$Serenity_SlickFormatting.getItemId = function(href) {
		if ($Q.isEmptyOrNull(href)) {
			return null;
		}
		if (ss.startsWithString(href, '#')) {
			href = href.substr(1);
		}
		var idx = href.lastIndexOf(String.fromCharCode(47));
		if (idx >= 0) {
			href = href.substr(idx + 1);
		}
		return href;
	};
	$Serenity_SlickFormatting.itemLinkText = function(itemType, id, text, extraClass) {
		return '<a' + (ss.isValue(id) ? (' href="#' + itemType + '/' + id + '"') : '') + ' class="s-' + itemType + 'Link' + ($Q.isEmptyOrNull(extraClass) ? '' : (' ' + extraClass)) + '">' + $Q.htmlEncode(ss.coalesce(text, '')) + '</a>';
	};
	$Serenity_SlickFormatting.itemLink = function(itemType, idField, getText, cssClass) {
		return function(ctx) {
			return ss.cast($Serenity_SlickFormatting.itemLinkText(itemType, ctx.item[idField], (ss.staticEquals(getText, null) ? ctx.value : getText(ctx)), (ss.staticEquals(cssClass, null) ? '' : cssClass(ctx))), String);
		};
	};
	global.Serenity.SlickFormatting = $Serenity_SlickFormatting;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.SlickHelper
	var $Serenity_SlickHelper = function() {
	};
	$Serenity_SlickHelper.__typeName = 'Serenity.SlickHelper';
	$Serenity_SlickHelper.setDefaults = function(columns, localTextPrefix) {
		var $t1 = ss.getEnumerator(columns);
		try {
			while ($t1.moveNext()) {
				var col = $t1.current();
				col.sortable = (ss.isValue(col.sortable) ? col.sortable : true);
				var $t2 = col.id;
				if (ss.isNullOrUndefined($t2)) {
					$t2 = col.field;
				}
				col.id = $t2;
				if (ss.isValue(localTextPrefix) && ss.isValue(col.id) && (ss.isNullOrUndefined(col.name) || ss.startsWithString(col.name, '~'))) {
					var key = (ss.isValue(col.name) ? col.name.substr(1) : col.id);
					col.name = $Q.text(localTextPrefix + key);
				}
				if (ss.staticEquals(col.formatter, null) && !ss.staticEquals(col.format, null)) {
					col.formatter = $Serenity_SlickHelper.convertToFormatter(col.format);
				}
				else if (ss.staticEquals(col.formatter, null)) {
					col.formatter = function(row, cell, value, column, item) {
						return $Q.htmlEncode(value);
					};
				}
			}
		}
		finally {
			$t1.dispose();
		}
		return columns;
	};
	$Serenity_SlickHelper.convertToFormatter = function(format) {
		if (ss.staticEquals(format, null)) {
			return null;
		}
		else {
			return function(row, cell, value, column, item) {
				return format({ row: row, cell: cell, value: value, column: column, item: item });
			};
		}
	};
	global.Serenity.SlickHelper = $Serenity_SlickHelper;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.SlickTreeHelper
	var $Serenity_SlickTreeHelper = function() {
	};
	$Serenity_SlickTreeHelper.__typeName = 'Serenity.SlickTreeHelper';
	$Serenity_SlickTreeHelper.filterCustom = function(item, getParent) {
		var parent = getParent(item);
		var loop = 0;
		while (ss.isValue(parent)) {
			if (!!parent._collapsed) {
				return false;
			}
			parent = getParent(parent);
			if (loop++ > 1000) {
				throw new ss.InvalidOperationException('Possible infinite loop, check parents has no circular reference!');
			}
		}
		return true;
	};
	$Serenity_SlickTreeHelper.filterById = function(item, view, getParentId) {
		return $Serenity_SlickTreeHelper.filterCustom(item, function(x) {
			var parentId = getParentId(x);
			if (ss.isNullOrUndefined(parentId)) {
				return null;
			}
			return view.getItemById(parentId);
		});
	};
	$Serenity_SlickTreeHelper.setCollapsed = function(items, collapsed) {
		if (ss.isValue(items)) {
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					item._collapsed = collapsed;
				}
			}
			finally {
				$t1.dispose();
			}
		}
	};
	$Serenity_SlickTreeHelper.setCollapsedFlag = function(item, collapsed) {
		item._collapsed = collapsed;
	};
	$Serenity_SlickTreeHelper.setIndents = function(items, getId, getParentId, setCollapsed) {
		var depth = 0;
		var depths = {};
		for (var line = 0; line < ss.count(items); line++) {
			var item = ss.getItem(items, line);
			if (line > 0) {
				var parentId = getParentId(item);
				if (ss.isValue(parentId) && ss.referenceEquals(parentId, getId(ss.getItem(items, line - 1)))) {
					depth += 1;
				}
				else if (ss.isNullOrUndefined(parentId)) {
					depth = 0;
				}
				else if (!ss.referenceEquals(parentId, getParentId(ss.getItem(items, line - 1)))) {
					if (ss.keyExists(depths, parentId)) {
						depth = depths[parentId] + 1;
					}
					else {
						depth = 0;
					}
				}
			}
			depths[getId(item)] = depth;
			item._indent = depth;
			if (ss.isValue(setCollapsed)) {
				item._collapsed = ss.unbox(setCollapsed);
			}
		}
	};
	$Serenity_SlickTreeHelper.toggleClick = function(TEntity) {
		return function(e, row, cell, view, getId) {
			var target = $(e.target);
			if (!target.hasClass('s-TreeToggle')) {
				return;
			}
			if (target.hasClass('s-TreeCollapse') || target.hasClass('s-TreeExpand')) {
				var item = view.rows[row];
				if (!!ss.isValue(item)) {
					if (!!!item._collapsed) {
						item._collapsed = true;
					}
					else {
						item._collapsed = false;
					}
					view.updateItem(getId(ss.cast(item, TEntity)), item);
				}
				if (e.shiftKey) {
					view.beginUpdate();
					try {
						$Serenity_SlickTreeHelper.setCollapsed(view.getItems(), !!item._collapsed);
						view.setItems(view.getItems(), true);
					}
					finally {
						view.endUpdate();
					}
				}
			}
		};
	};
	global.Serenity.SlickTreeHelper = $Serenity_SlickTreeHelper;
	////////////////////////////////////////////////////////////////////////////////
	// Serenity.TabsExtensions
	var $Serenity_TabsExtensions = function() {
	};
	$Serenity_TabsExtensions.__typeName = 'Serenity.TabsExtensions';
	$Serenity_TabsExtensions.setDisabled = function(tabs, tabKey, isDisabled) {
		if (ss.isNullOrUndefined(tabs)) {
			return;
		}
		var indexByKey = $Serenity_TabsExtensions.indexByKey(tabs);
		if (ss.isNullOrUndefined(indexByKey)) {
			return;
		}
		var index = indexByKey[tabKey];
		if (ss.isNullOrUndefined(index)) {
			return;
		}
		if (ss.unbox(index) === tabs.tabs('option', 'active')) {
			tabs.tabs('option', 'active', 0);
		}
		if (isDisabled) {
			tabs.tabs('disable', ss.unbox(index));
		}
		else {
			tabs.tabs('enable', ss.unbox(index));
		}
	};
	$Serenity_TabsExtensions.activeTabKey = function(tabs) {
		var href = tabs.children('ul').children('li').eq(tabs.tabs('option', 'active')).children('a').attr('href').toString();
		var prefix = '_Tab';
		var lastIndex = href.lastIndexOf(prefix);
		if (lastIndex >= 0) {
			href = href.substr(lastIndex + prefix.length);
		}
		return href;
	};
	$Serenity_TabsExtensions.indexByKey = function(tabs) {
		var indexByKey = tabs.data('indexByKey');
		if (ss.isNullOrUndefined(indexByKey)) {
			indexByKey = {};
			tabs.children('ul').children('li').children('a').each(function(index, el) {
				var href = el.getAttribute('href').toString();
				var prefix = '_Tab';
				var lastIndex = href.lastIndexOf(prefix);
				if (lastIndex >= 0) {
					href = href.substr(lastIndex + prefix.length);
				}
				indexByKey[href] = index;
			});
			tabs.data('indexByKey', indexByKey);
		}
		return indexByKey;
	};
	global.Serenity.TabsExtensions = $Serenity_TabsExtensions;
	ss.initClass($Q, $asm, {});
	ss.initClass($Q$Config, $asm, {});
	ss.initClass($Q$Culture, $asm, {});
	ss.initClass($Q$ErrorHandling, $asm, {});
	ss.initClass($Q$Lookup, $asm, {
		update: function(newItems) {
			this.$items = [];
			this.$itemById = {};
			if (ss.isValue(newItems)) {
				ss.arrayAddRange(this.$items, newItems);
			}
			var idField = this.$options.idField;
			if (!$Q.isEmptyOrNull(idField)) {
				for (var i = 0; i < this.$items.length; i++) {
					var r = this.$items[i];
					var v = r[idField];
					// ?? Type.GetProperty(r, idField);
					if (ss.isValue(v)) {
						this.$itemById[v] = r;
					}
				}
			}
		},
		get_idField: function() {
			return this.$options.idField;
		},
		get_parentIdField: function() {
			return this.$options.parentIdField;
		},
		get_textField: function() {
			return this.$options.textField;
		},
		get_textFormatter: function() {
			return this.$options.textFormatter;
		},
		get_itemById: function() {
			return this.$itemById;
		},
		get_items: function() {
			return this.$items;
		}
	});
	ss.initClass($Q$LT, $asm, {
		get: function() {
			var $t1 = $Q$LT.$table[this.$key];
			if (ss.isNullOrUndefined($t1)) {
				$t1 = ss.coalesce(this.$key, '');
			}
			return $t1;
		},
		toString: function() {
			var $t1 = $Q$LT.$table[this.$key];
			if (ss.isNullOrUndefined($t1)) {
				$t1 = ss.coalesce(this.$key, '');
			}
			return $t1;
		}
	});
	ss.initClass($Q$ScriptData, $asm, {});
	ss.initClass($Texts, $asm, {});
	ss.initClass($Texts$Controls, $asm, {});
	ss.initClass($Texts$Controls$EntityDialog, $asm, {});
	ss.initClass($Texts$Controls$EntityGrid, $asm, {});
	ss.initClass($Texts$Controls$Pager, $asm, {});
	ss.initClass($Texts$Controls$PropertyGrid, $asm, {});
	ss.initClass($Texts$Controls$QuickSearch, $asm, {});
	ss.initClass($Texts$Dialogs, $asm, {});
	ss.initClass($Serenity_Criteria, $asm, {});
	ss.initClass($Serenity_DialogTypeAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_EditorAttribute, $asm, {});
	ss.initClass($Serenity_ElementAttribute, $asm, {
		get_html: function() {
			return this.$html;
		}
	});
	ss.initClass($Serenity_EntityTypeAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_FormKeyAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_IdExtensions, $asm, {});
	ss.initClass($Serenity_IdPropertyAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_IsActivePropertyAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_ItemNameAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_LazyLoadHelper, $asm, {});
	ss.initClass($Serenity_LocalTextPrefixAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_NamePropertyAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_OptionsTypeAttribute, $asm, {
		get_optionsType: function() {
			return this.$2$OptionsTypeField;
		},
		set_optionsType: function(value) {
			this.$2$OptionsTypeField = value;
		}
	});
	ss.initClass($Serenity_ScriptContext, $asm, {});
	ss.initClass($Serenity_ServiceAttribute, $asm, {
		get_value: function() {
			return this.$2$ValueField;
		},
		set_value: function(value) {
			this.$2$ValueField = value;
		}
	});
	ss.initClass($Serenity_SlickFormatting, $asm, {});
	ss.initClass($Serenity_SlickHelper, $asm, {});
	ss.initClass($Serenity_SlickTreeHelper, $asm, {});
	ss.initClass($Serenity_TabsExtensions, $asm, {});
	$Q$Culture.decimalSeparator = '.';
	$Q$Culture.dateSeparator = '/';
	$Q$Culture.dateOrder = 'dmy';
	$Q$Culture.dateFormat = 'dd/MM/yyyy';
	$Q$Culture.dateTimeFormat = 'dd/MM/yyyy HH:mm:ss';
	$Q$LT.$table = {};
	$Q$LT.empty = new $Q$LT('');
	$Texts$Dialogs.OkButton = new Q$LT('OK');
	$Texts$Dialogs.YesButton = new Q$LT('Yes');
	$Texts$Dialogs.NoButton = new Q$LT('No');
	$Texts$Dialogs.CancelButton = new Q$LT('Cancel');
	$Texts$Dialogs.AlertTitle = new Q$LT('Alert');
	$Texts$Dialogs.ConfirmationTitle = new Q$LT('Confirm');
	$Texts$Dialogs.InformationTitle = new Q$LT('Information');
	$Texts$Dialogs.WarningTitle = new Q$LT('Warning');
	$Q$LT.initializeTextClass($Texts$Dialogs, 'Dialogs.');
	$Serenity_LazyLoadHelper.$autoIncrement = 0;
	$Q$Config.applicationPath = '/';
	$Q$Config.emailAllowOnlyAscii = false;
	$Q$Config.rootNamespaces = null;
	$Q$Config.notLoggedInHandler = null;
	var pathLink = $('link#ApplicationPath');
	if (pathLink.length > 0) {
		$Q$Config.applicationPath = pathLink.attr('href');
	}
	$Q$Config.rootNamespaces = [];
	ss.add($Q$Config.rootNamespaces, 'Serenity');
	$Q$Config.emailAllowOnlyAscii = true;
	$Q$ScriptData.$registered = {};
	$Q$ScriptData.$loadedData = {};
	$Q.$blockUICount = 0;
	$Texts$Controls$EntityDialog.DeleteConfirmation = new Q$LT('Delete record?');
	$Texts$Controls$EntityDialog.UndeleteButton = new Q$LT('Undelete');
	$Texts$Controls$EntityDialog.UndeleteConfirmation = new Q$LT('Undelete record?');
	$Texts$Controls$EntityDialog.CloneButton = new Q$LT('Clone');
	$Texts$Controls$EntityDialog.SaveSuccessMessage = new Q$LT('Save success');
	$Texts$Controls$EntityDialog.SaveButton = new Q$LT('Save');
	$Texts$Controls$EntityDialog.UpdateButton = new Q$LT('Update');
	$Texts$Controls$EntityDialog.ApplyChangesButton = new Q$LT('Apply Changes');
	$Texts$Controls$EntityDialog.DeleteButton = new Q$LT('Delete');
	$Texts$Controls$EntityDialog.NewRecordTitle = new Q$LT('New {0}');
	$Texts$Controls$EntityDialog.EditRecordTitle = new Q$LT('Edit {0}{1}');
	$Q$LT.initializeTextClass($Texts$Controls$EntityDialog, 'Controls.EntityDialog.');
	$Texts$Controls$EntityGrid.NewButton = new Q$LT('New {0}');
	$Texts$Controls$EntityGrid.RefreshButton = new Q$LT('Refresh');
	$Texts$Controls$EntityGrid.IncludeDeletedToggle = new Q$LT('display inactive records');
	$Q$LT.initializeTextClass($Texts$Controls$EntityGrid, 'Controls.EntityGrid.');
	$Texts$Controls$Pager.Page = new Q$LT('Page');
	$Texts$Controls$Pager.PageStatus = new Q$LT('Showing {from} to {to} of {total} total records');
	$Texts$Controls$Pager.NoRowStatus = new Q$LT('No records');
	$Texts$Controls$Pager.LoadingStatus = new Q$LT('Please wait, loading data...');
	$Texts$Controls$Pager.DefaultLoadError = new Q$LT('An error occured while loading data!');
	$Q$LT.initializeTextClass($Texts$Controls$Pager, 'Controls.Pager.');
	$Texts$Controls$PropertyGrid.DefaultCategory = new Q$LT('Properties');
	$Texts$Controls$PropertyGrid.RequiredHint = new Q$LT('this field is required');
	$Q$LT.initializeTextClass($Texts$Controls$PropertyGrid, 'Controls.PropertyGrid.');
	$Texts$Controls$QuickSearch.Placeholder = new Q$LT('search...');
	$Texts$Controls$QuickSearch.Hint = new Q$LT('enter the text to search for...');
	$Texts$Controls$QuickSearch.FieldSelection = new Q$LT('select the field to search on');
	$Q$LT.initializeTextClass($Texts$Controls$QuickSearch, 'Controls.QuickSearch.');
})();
