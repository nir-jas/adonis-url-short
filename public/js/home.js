/*
*	TypeWatch 3
*
*	Examples/Docs: github.com/dennyferra/TypeWatch
*  
*  Dual licensed under the MIT and GPL licenses:
*  http://www.opensource.org/licenses/mit-license.php
*  http://www.gnu.org/licenses/gpl.html
*/

!function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
}(this, function($) {
    'use strict';
	$.fn.typeWatch = function(o) {
		// The default input types that are supported
		var _supportedInputTypes =
			['TEXT', 'TEXTAREA', 'PASSWORD', 'TEL', 'SEARCH', 'URL', 'EMAIL', 'DATETIME', 'DATE', 'MONTH', 'WEEK', 'TIME', 'DATETIME-LOCAL', 'NUMBER', 'RANGE', 'DIV'];

		// Options
		var options = $.extend({
			wait: 750,
			callback: function() { },
			highlight: true,
			captureLength: 2,
			allowSubmit: false,
			inputTypes: _supportedInputTypes
		}, o);

		function checkElement(timer, override) {
			var value = timer.type === 'DIV' 
				? jQuery(timer.el).html()
				: jQuery(timer.el).val();

			// If has capture length and has changed value
			// Or override and has capture length or allowSubmit option is true
			// Or capture length is zero and changed value
			if ((value.length >= options.captureLength && value != timer.text)
				|| (override && (value.length >= options.captureLength || options.allowSubmit))
				|| (value.length == 0 && timer.text))
			{
				timer.text = value;
				timer.cb.call(timer.el, value);
			}
		};

		function watchElement(elem) {
			var elementType = (elem.type || elem.nodeName).toUpperCase();
			if (jQuery.inArray(elementType, options.inputTypes) >= 0) {
				
				// Allocate timer element
				var timer = {
					timer: null,
					text: (elementType === 'DIV') ? jQuery(elem).html() : jQuery(elem).val(),
					cb: options.callback,
					el: elem,
					type: elementType,
					wait: options.wait
				};

				// Set focus action (highlight)
				if (options.highlight && elementType !== 'DIV')
					jQuery(elem).focus(function() { this.select(); });

				// Key watcher / clear and reset the timer
				var startWatch = function(evt) {
					var timerWait = timer.wait;
					var overrideBool = false;
					var evtElementType = elementType;

					// If enter key is pressed and not a TEXTAREA or DIV
					if (typeof evt.keyCode != 'undefined' && evt.keyCode == 13
						&& evtElementType !== 'TEXTAREA' && elementType !== 'DIV')
					{
						console.log('OVERRIDE');
						timerWait = 1;
						overrideBool = true;
					}

					var timerCallbackFx = function() {
						checkElement(timer, overrideBool)
					}

					// Clear timer
					clearTimeout(timer.timer);
					timer.timer = setTimeout(timerCallbackFx, timerWait);
				};

				jQuery(elem).on('keydown paste cut input', startWatch);
			}
		};

		// Watch each element
		return this.each(function() {
			watchElement(this);
		});
	};
});

$(function () {
	var twOptions = {
        callback: function (value) {
			$('#link-availability-status').html("")

			if (value.length>0) {
				$('#link-availability-status').html('<span><i class="fa fa-spinner"></i> Loading..</span>');
				$.ajax({
					url: "/api/custom_link/check_availability",
					type: 'POST',
					data: {
						'url_key': $('#custom_url_key').val()
					},
					dataType: "json"
				})
            	.done(function(data) {
						$("#link-availability-status")
							.removeClass("text-danger")
							.addClass("text-success");
						$("#link-availability-status").html(data.data.success);
				}).fail(function (jqXHR, textStatus) {
					if (jqXHR.responseJSON.data && jqXHR.responseJSON.data.errors) {
						$("#link-availability-status")
							.removeClass("text-success")
							.addClass("text-danger");
						$("#link-availability-status").html(jqXHR.responseJSON.data.errors[0].message);
					} else {
						$("#link-availability-status").html("Hmm. We're having trouble connecting to the server.");
					}
				});
			}

        },
        wait: 500,
        captureLength: 1,
        highlight: true,
        allowSubmit: false
    };

    // Add TypeWatch to check when users type
    $('#custom_url_key').typeWatch(twOptions);
})
