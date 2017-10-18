/**
 * October 2017
 * @author Vladimir Kuzmov <me@vkuzmov.com>
 */

$(function(){

	$.extend(nemesis, {
		/**
		 * Calculate percents of number
		 * Example: percents(10, 56.30) = 5.63
		 *
		 * @param  Float|Integer  percents
		 * @param  Float|Integer  num
		 * @author Vladimir Kuzmov <me@vkuzmov.com>
		 * @return Float
		 */
		percents: function(percents, num) {
			return percents / 100 * num;
		},

		/**
		 * Fix triangles
		 *
		 * @param  object self
		 * @return void
		 * @author Vladimir Kuzmov <me@vkuzmov.com>
		 */
		triangles: function(self) {
			var originalHeight = 75,
				percentage = (self.width() / 1440) * 100,
				newHeight = Math.floor(this.percents(percentage, originalHeight)),
				newTop = newHeight;

			if (navigator.userAgent.toLowerCase().includes('firefox')) {
				newTop -= 1;
			}

			$('.triangle:not(.small):not(.down)').css({top: -newTop+'px', height: newHeight+'px'});
			$('.triangle:not(.small)').css({bottom: -newTop+'px', height: newHeight+'px'});
		},

		/**
		 * Init dropdowns.
		 *
		 * @return void
		 * @author Vladimir Kuzmov <me@vkuzmov.com>
		 */
		initDropdowns: function() {
			if ($('.custom-dropdown').length) {
				$('.custom-dropdown').select2({
					minimumResultsForSearch: Infinity
				});
			}
		},

		/**
		 * SVG Helper for class attribute
		 * @author Vladimir Kuzmov
		 * @type {Object}
		 */
		svgHelper: {
			/**
			 * Check if SVG element has a certain class.
			 *
			 * @param  {object}  svg
			 * @param  {string}  className
			 * @return {Boolean}
			 * @author Vladimir Kuzmov <me@vkuzmov.com>
			 */
			hasClass: function(svg, className) {
				var classAttr = svg.attr('class')
				if (classAttr == undefined) {
					return false;
				}
				return classAttr.search(className) != -1;
			},

			/**
			 * Add class to SVG element if it doesn't have it yet.
			 *
			 * @param  {object} svg
			 * @param  {string} className
			 * @return {void}
			 * @author Vladimir Kuzmov <me@vkuzmov.com>
			 */
			addClass: function(svg, className) {
				var newClass = svg.attr('class'),
					hasClass = nemesis.svgHelper.hasClass(svg, className);

				if ( ! hasClass) {
					newClass = newClass + ' ' + className;
					svg.attr('class', newClass);
				}
			},

			/**
			 * Remove class from SVG element if present.
			 *
			 * @param  {object} svg
			 * @param  {string} className
			 * @return {void}
			 * @author Vladimir Kuzmov <me@vkuzmov.com>
			 */
			removeClass: function(svg, className) {
				var newClass = svg.attr('class'),
					hasClass = nemesis.svgHelper.hasClass(svg, className);

				if (hasClass) {
					newClass = newClass.replace(className, '').trim();
					svg.attr('class', newClass);
				}
			},

			/**
			 * Toggle class to SVG element.
			 *
			 * @param  {object} svg
			 * @param  {string} className
			 * @return {void}
			 * @author Vladimir Kuzmov <me@vkuzmov.com>
			 */
			toggleClass: function(svg, className) {
				var hasClass = nemesis.svgHelper.hasClass(svg, className);

				if (hasClass) {
					this.removeClass(svg, className);
				}
				else {
					this.addClass(svg, className);
				}
			}
		},

		/**
		 * Calculate max-height of shell-body
		 * Settings for my current resolution:
		 * 210 / 330 * 100 = 63.636363636
		 *
		 * @return {void}
		 * @author Vladimir Kuzmov <me@vkuzmov.com>
		 */
		setShellBodyHeight: function() {
			var previewHeight = $('header .module-setup .preview').height(),
				shellBodyHeight = Math.floor(this.percents(63.636363636, previewHeight));

			$('header .module-setup .preview .shell-body').css({
				'max-height': shellBodyHeight+'px'
			});
		},

		/**
		 * Init header composition.
		 *
		 * @return void
		 * @author Vladimir Kuzmov <me@vkuzmov.com>
		 */
		initComposition: function() {
			xhr = new XMLHttpRequest();
			xhr.open('GET', 'img/header-illustration.svg', false);
			// Following line is just to be on the safe side;
			// not needed if your server delivers SVG with correct MIME type
			xhr.overrideMimeType('image/svg+xml');
			xhr.send('');
			document.getElementById('header-composition')
				.appendChild(xhr.responseXML.documentElement);

			// Simulate click on main asset when clicking on icon
			$('#header-composition .icon').on('click', function() {
				$('.main.asset[data-asset="' + $(this).data('asset') + '"]')
					.trigger('click');
			});

			// Handle click on asset
			$('#header-composition .main').on('click', function() {
				var self = $(this),
					isActive = nemesis.svgHelper.hasClass(self, 'active'),
					assetNum = self.data('asset');


                var currentVals = $("#projectType").val().split(",");

				if (isActive) {
					$("#projectType").val(currentVals.push(self.data('command')).join());
				}
				else {
				    $("#projectType").val(currentVals.splice($.inArray(self.data('command'), currentVals),1).join());
				}

				changeMetadata('');

				$.each($('[data-asset="' + assetNum + '"]'), function(i, obj) {
					nemesis.svgHelper.toggleClass($(obj), 'active');
				});

				if (assetNum == '7' || assetNum == '8') {
					var active7 = nemesis.svgHelper.hasClass($('[data-asset="7"]'), 'active'),
						active8 = nemesis.svgHelper.hasClass($('[data-asset="8"]'), 'active');

					if (active7 && !active8) {
						$.each($('.multiple.asset[data-asset="7"]'), function(i, obj) {
							nemesis.svgHelper.removeClass($(obj), 'hidden');
						});
						$.each($('.multiple.asset[data-asset="8"]'), function(i, obj) {
							nemesis.svgHelper.addClass($(obj), 'hidden');
						});
					}
					else if (active7 && active8) {
						$.each($('.multiple.asset[data-asset="7"]'), function(i, obj) {
							nemesis.svgHelper.addClass($(obj), 'hidden');
						});
						$.each($('.multiple.asset[data-asset="8"]'), function(i, obj) {
							nemesis.svgHelper.removeClass($(obj), 'hidden');
						});
					}
					else if (!active7 && active8) {
						$.each($('.multiple.asset[data-asset="7"]'), function(i, obj) {
							nemesis.svgHelper.addClass($(obj), 'hidden');
						});
						$.each($('.multiple.asset[data-asset="8"]'), function(i, obj) {
							nemesis.svgHelper.removeClass($(obj), 'hidden');
						});
					}
				}
			});

			// Switch On and Off
			$('.module-setup .switch').on('click', function(e) {
				var self = $(this);

				// Enable all modules
				if (self.hasClass('off')) {
					$.each($('#header-composition .main.asset:not(.active)'), function(i, obj) {
						$(obj).trigger('click');
					});
				}

				// Disable all modules
				else {
					$.each($('#header-composition .main.asset.active'), function(i, obj) {
						$(obj).trigger('click');
					});
				}

				self.toggleClass('off').toggleClass('on')
			});

			nemesis.setShellBodyHeight();
		},

		/**
		 * Init components.
		 *
		 * @return void
		 * @author Vladimir Kuzmov <me@vkuzmov.com>
		 */
		init: function() {
			nemesis.triangles($(window));
			nemesis.initDropdowns();
			nemesis.initComposition();
		}
	});

	nemesis.init();

	$(window).resize(function() {
		nemesis.triangles($(this));
		nemesis.setShellBodyHeight();
	});

});
