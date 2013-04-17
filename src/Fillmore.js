/**
 * @abstract
 * @class $.Fillmore
 * 
 * Main Fillmore class, which gives a single element a fillmore'd background.
 */
/*global window, jQuery */
(function( $ ) {
	
	/**
	 * Creates a new Fillmore instance.
	 * 
	 * @constructor
	 * @param {HTMLElement/jquery} containerEl The container element where a fillmore'd image should be placed.
	 */
	$.Fillmore = function( containerEl ) {
		this.init( containerEl );
	};
	
	
	// Static properties
	
	/**
	 * @static
	 * @property {Object} defaultSettings
	 * 
	 * The default settings used when not overridden by the user.
	 */
	$.Fillmore.defaultSettings = {
		src      : null, // The src for the image
		mode     : 'cover',
		focusX   : 50,   // Focus position from left - Number between 1 and 100
		focusY   : 50,   // Focus position from top - Number between 1 and 100
		speed    : 0,    // fadeIn speed for background after image loads (e.g. "fast" or 500)
		
		onImageLoad    : undefined,
		onImageVisible : undefined,
		callback       : undefined
	};
	
	
	// Use a tiny custom built Modernizr to determine a few features for the 'useCss3' property (below)
	// Creates Modernizr as a local variable.
	/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
	 * Build: http://modernizr.com/download/#-backgroundsize-testprop-testallprops-domprefixes
	 */
	var Modernizr=function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(prefixes.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b){for(var d in a){var e=a[d];if(!z(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}function C(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return y(b,"string")||y(b,"undefined")?A(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),B(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={},p={},q={},r=[],s=r.slice,t,u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e}),o.backgroundsize=function(){return C("backgroundSize")};for(var D in o)v(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)v(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},w(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return A([a])},e.testAllProps=C,e}(this,this.document);

	/**
	 * @static
	 * @property {Boolean} useCss3
	 * 
	 * A flag for whether or not we can use the CSS3 background-size:cover implementation. 
	 * 
	 * Note: iOS4's background-size:cover implementation is broken, so we can't use it in that case, even if the
	 * browser supposedly supports it
	 */
	$.Fillmore.useCss3 = Modernizr.backgroundsize && !/i(Phone|Pod|Pad).*OS 4_/.test(window.navigator.userAgent);
	
	
	// Instance properties/methods
	$.extend( $.Fillmore.prototype, {
	
		/**
		 * @protected
		 * @property {Object} settings
		 * 
		 * The configured settings (options) for the instance. This is initialized
		 * to just the default settings, and is updated via the {@link #updateSettings} method.
		 */
		
		/**
		 * @protected
		 * @property {jQuery} $containerEl
		 * 
		 * The container element that is having a fillmore'd image applied to it.
		 */
		
		/**
		 * @private
		 * @property {jQuery} $containerSizingEl
		 * 
		 * The element to use to size the fillmore'd element. This is in most cases the {@link #$containerEl} itself, but
		 * in the case that the document body is being used, it becomes either the document object (for iOS), or the window
		 * object for all other OS's.
		 */
	
		/**
		 * @protected
		 * @property {jQuery} $fillmoreEl
		 * 
		 * The element which will hold the fillmore'd image.
		 */
	
		/**
		 * @protected
		 * @property {String} fillmoreElPosition
		 * 
		 * CSS position for the fillmoreEl.
		 */
		fillmoreElPosition : 'absolute',
	
		/**
		 * @protected
		 * @property {Boolean} imageLoaded
		 * 
		 * Flag to determine if the image is fully loaded.
		 */
		imageLoaded : false,
	
		/**
		 * @protected
		 * @property {Boolean} imageVisible
		 * 
		 * Flag to determine if the image is fully loaded, **and** has been faded in.
		 */
		imageVisible : false,
		
		
		// -----------------------------
		
		
		/**
		 * Initializes the special Fillmore element, which is nested inside the containerEl and acts as
		 * the container of the image.
		 * 
		 * This method modifies certain CSS properties of the container element if it needs to. This includes:
		 * 
		 * - `position` : to give the container element a positioning context if it doesn't have one
		 * - `z-index` : to give the container element a stacking context if it doesn't have one
		 * - `background` : to make the background of the container element transparent, if it's not already.
		 * 
		 * Note that the above properties are applied for both the CSS3 and ImageStretch implementations, even though
		 * the CSS3 implementation doesn't need the `position` and `z-index` to be set. It is done this way so that you
		 * expect it and can work around it if need be, because users that are using older browsers will need those properties 
		 * applied (although it is unlikely that you will need to do anything in most cases).
		 *
		 * @method init
		 * @property {HTMLElement/jquery} containerEl The container element where a fillmore'd image should be placed.
		 */
		init : function( containerEl ) {
			// Start with the default settings (need a copy)
			this.settings = $.extend( {}, $.Fillmore.defaultSettings );

			var $containerEl = this.$containerEl = $( containerEl );
	
			// Make sure the container element has a transparent background, so we can see the stretched image
			$containerEl.css( 'background', 'transparent' );
			
			if( $containerEl.is( 'body' ) ) {
				this.fillmoreElPosition = 'fixed';
				
			} else {
				// Make sure we cut the image off at the end of the container element
				this.originalContainerOverflow = $containerEl.css( 'overflow' );
				$containerEl.css( 'overflow', 'hidden' );
				
				// Make sure the container element has a positioning context, so we can position the $fillmoreEl inside it. Must be absolute/relative/fixed.
				// It doesn't need a positioning context if the element is the document body however, as that already has a positioning context.
				if( $containerEl.css( 'position' ) === 'static' ) {  // computed style is 'static', i.e. no positioning context
					$containerEl.css( 'position', 'relative' );
					this.containerPositionModified = true;
				}
				
				// If the element doesn't have a z-index value, we need to give it one to create a stacking context.
				if( $containerEl.css( 'z-index' ) === 'auto' ) {
					$containerEl.css( 'z-index', 0 );
					this.containerZIndexModified = true;  // Flag to tell the destroy() method that we modified the zIndex style, to reset it
				}
			}
			
			// Find the element that we should size off of. This is different than the actual $containerEl only if the
			// $containerEl is the document body
			if( this.$containerEl.is( 'body' ) ) {
				this.$containerSizingEl = ( 'onorientationchange' in window ) ? $( document ) : $( window ); // hack to acccount for iOS position:fixed shortcomings
			} else {
				this.$containerSizingEl = this.$containerEl;
			}
			
			this.createFillmoreEl();
		},
		
		
		/**
		 * Creates the fillmoreEl, which acts as the outer container of the image.
		 *
		 * @protected
		 * @method createFillmoreEl
		 * @return {jQuery}
		 */
		createFillmoreEl : function() {
			// The div element that will be placed inside the container, with the image placed inside of it
			this.$fillmoreEl = $( '<div class="fillmoreInner" style="left: 0; top: 0; position: ' + this.fillmoreElPosition + '; overflow: hidden; z-index: -999999; margin: 0; padding: 0; height: 100%; width: 100%;" />' )
				.appendTo( this.$containerEl );
		},
		
		
		/**
		 * Updates the settings of the instance with any new settings supplied.
		 *
		 * @method updateSettings
		 * @property {Object} settings An object (hash) of settings. See the readme file for settings.
		 */
		updateSettings : function( settings ) {
			this.settings = $.extend( this.settings, settings );
		},
		
		
		
		/**
		 * Retrieves the src of the image that is currently being shown (or is loading).
		 * 
		 * @method getSrc
		 * @return {String} The src of the image currently being shown (or is loading), or null if there is none.
		 */
		getSrc : function() {
			return this.settings.src;
		},
		
	
		/**
		 * Abstract method to retrieve the element that has the image attached.
		 *
		 * @abstract
		 * @protected
		 * @method getImageEl
		 * @return {jQuery} The image element, wrapped in a jQuery object (wrapped set)
		 */
		getImageEl : function() {
			throw new Error( "getImageEl() must be implemented in subclass" );
		},
	
		
		/**
		 * Retrieves the size of the loaded image, once it has loaded. If this method is called
		 * before the image has loaded, the method will return null.
		 * 
		 * @method getImageSize
		 * @return {Object} An object (hashmap) with properties `width` and `height`, or null if the
		 *   image is not yet loaded.
		 */
		getImageSize : function() {
			if( !this.imageLoaded ) {
				return null;
				
			} else {
				var $image = this.getImageEl(),
					imgEl = $image[ 0 ];

				return {
					width: imgEl.width || $image.width(),
					height: imgEl.height || $image.height()
				};	
			}
		},


		/**
		 * Calculates the stretched size and offset of where the top/left of the image should be in relation to the top/left of the viewable 
		 * area. Because the image is "stretched" behind the viewable area, its top/left position usually exists above and to the left
		 * of the viewable area itself. Offsets are returned as positive numbers (even though they will most likely be used to apply
		 * negative offsets to the image).
		 * 
		 * This method returns the stretched size and offsets based on the image's original size, the viewable area size 
		 * (i.e. the {@link #$containerEl containerEl's} size), and the focusX and focusY points (settings).
		 * 
		 * @protected
		 * @method calculateStretchedSizeAndOffsets
		 * @return {Object} Unless the image is not loaded (in which case, this method returns null), returns an object with the 
		 *   following properties:
		 * @return {Number} return.offsetLeft The number of pixels from the left side of the image to the left side of the viewable area.
		 *   Will be 0 if the left side of the stretched image is to be flush with the left side of the container, or a positive number
		 *   for how far away it should be.
		 * @return {Number} return.offsetTop The number of pixels from the top of the image to the top of the viewable area.
		 *   Will be 0 if the top of the stretched image is to be flush with the top of the container, or a positive number
		 *   for how far away it should be.
		 * @return {Number} return.stretchedWidth The width that the background image should be, to stretch over the container.
		 * @return {Number} return.stretchedHeight The height that the background image should be, to stretch over the container.
		 */
		calculateStretchedSizeAndOffsets : function() {
			var $image = this.getImageEl();
			
			// Store the ratio of the image's width to height. This is for the offsets calculation.
			$image.css( { width: "auto", height: "auto" } );  // make sure the image element doesn't have any explicit width/height for the measurement (which may be added if it has been resized before)
			
			var imgSize = this.getImageSize(),
				imgWidth = imgSize.width,
				imgHeight = imgSize.height,
				imgRatio = imgWidth / imgHeight,
				settings = this.settings,
				$containerSizingEl = this.$containerSizingEl,

				offsetLeft = 0,
				offsetTop = 0,
				containerWidth, containerHeight, stretchedWidth, stretchedHeight;

			if ( settings.mode === 'frame' ) {
				containerHeight = $containerSizingEl.height();
				containerWidth = $containerSizingEl.width();

				if ( imgWidth > containerWidth || imgHeight > containerHeight ) {
					// scale down - equivalent of 'background-size: contain'
					// see http://stackoverflow.com/a/10297552/358804
					var containerRatio = containerWidth / containerHeight;
					if ( containerRatio > imgRatio ) {
						stretchedHeight = containerHeight;
						stretchedWidth = ( containerHeight / imgHeight ) * imgWidth;
					} else {
						stretchedWidth = containerWidth;
						stretchedHeight = ( containerWidth / imgWidth ) * imgHeight;
					}
				} else {
					// fits within the container - use natural image size
					stretchedWidth = imgWidth;
					stretchedHeight = imgHeight;
				}

				// center the image
				// TODO consolidate w/ logic below
				if ( stretchedWidth < containerWidth ) {
					offsetLeft = ( containerWidth - stretchedWidth ) / 2;
				}
				if ( stretchedHeight < containerHeight ) {
					offsetTop = ( containerHeight - stretchedHeight ) / 2;
				}

			} else { // 'cover'
				containerHeight = $containerSizingEl.outerHeight() || $containerSizingEl.height();  // outerHeight() for regular elements, and height() for window (which returns null for outerHeight())
				containerWidth = $containerSizingEl.outerWidth() || $containerSizingEl.width();	    // outerWidth() for regular elements, and width() for window (which returns null for outerWidth())

				stretchedWidth = containerWidth;
				stretchedHeight = stretchedWidth / imgRatio;

				// Make adjustments based on image ratio
				// Note: Offset code inspired by Peter Baker (http://ptrbkr.com/). Thanks, Peter!
				if( stretchedHeight >= containerHeight ) {
					offsetTop = ( stretchedHeight - containerHeight ) * this.settings.focusY / 100;
				} else {
					stretchedHeight = containerHeight;
					stretchedWidth = stretchedHeight * imgRatio;
					offsetLeft = ( stretchedWidth - containerWidth ) * this.settings.focusX / 100;
				}	
			}
			
			return {
				offsetLeft      : offsetLeft,
				offsetTop       : offsetTop,
				stretchedWidth  : stretchedWidth,
				stretchedHeight : stretchedHeight
			};
		},
		
		
		/**
		 * Retrives the area of the image that is currently "viewable". Returns the top/left
		 * offset from the image to the top/left of the viewable area, and returns the height/width
		 * of the viewable area as well.
		 * 
		 * @method getViewableImageArea
		 * @return {Object} An object (hashmap) with the following properties (unless the image is not currently loaded, in which case this method returns null):
		 * @return {Number} return.width The number of pixels that represent the width of the viewable area.
		 * @return {Number} return.height The number of pixels that represent the height of the viewable area.
		 * @return {Number} return.offsetLeft The number of pixels from the left side of the image to the left side of the viewable area.
		 * @return {Number} return.offsetTop The number of pixels from the top of the image to the top of the viewable area.
		 * @return {Number} return.stretchedWidth The width that the background image has been stretched to be, to stretch over the container.
		 * @return {Number} return.stretchedHeight The height that the background image has been stretched to be, to stretch over the container.
		 */
		getViewableImageArea : function() {
			if( !this.imageLoaded ) {
				return null;
				
			} else {
				var $containerEl = this.$containerEl,
				    imageSizeAndOffsets = this.calculateStretchedSizeAndOffsets();
				
				return {
					width           : $containerEl.innerWidth(),
					height          : $containerEl.innerHeight(),
					offsetLeft      : imageSizeAndOffsets.offsetLeft,
					offsetTop       : imageSizeAndOffsets.offsetTop,
					stretchedWidth  : imageSizeAndOffsets.stretchedWidth,
					stretchedHeight : imageSizeAndOffsets.stretchedHeight
				};
			}
		},
	
	
		/**
		 * Method to initialize the Fillmore plugin on an element.
		 *
		 * @method showImage
		 * @param {String} src The src for the image to show.
		 */
		showImage : function( src ) {
			this.imageLoaded = false;
			this.imageVisible = false;
			
			// Call hook method for subclasses
			this.loadImage( src );
		},
		
		
		/**
		 * Implementation-specific image loading method, which must be implemented in a subclass.
		 * This method should load the image how it wants, and then call the {@link #onImageLoad}
		 * method when the image has finished loading (or has failed to load). 
		 * 
		 * @abstract
		 * @protected
		 * @method loadImage
		 */
		loadImage : function() {
			throw new Error( "loadImage() must be implemented in subclass" );
		},
		
	
		/**
		 * Deprecated, use {@link #imageIsVisible} instead. This method is simply an alias to {@link #imageIsVisible}
		 * at this time.
		 * 
		 * @deprecated 1.3 Replaced by {@link #imageIsVisible}.
		 * @method isLoaded
		 * @return {Boolean} True if the image is fully loaded and faded in. False otherwise.
		 */
		isLoaded : function() {
			return this.imageIsVisible();
		},
		
		
		/**
		 * Determines if the image is currently loaded. This relates to the last image that was
		 * requested to be loaded. So if there is an old image loaded, and a new one is requested
		 * by calling fillmore again but has not yet been downloaded by the browser, this will return
		 * false until the new image comes in.
		 * 
		 * @method imageIsLoaded
		 * @return {Boolean} True if the latest image requested is loaded, false otherwise.
		 */
		imageIsLoaded : function() {
			return this.imageLoaded;
		},
		
		
		/**
		 * Determines if the image is loaded, *and* visible (i.e. has been faded in).
		 * 
		 * @method imageIsVisible
		 * @return {Boolean} True if the image is both loaded, *and* visible. False otherwise.
		 */
		imageIsVisible : function() {
			return this.imageVisible;
		},
	
	
		/**
		 * Resizes the background image to the proper size, and fixes its position based on the container size.
		 * 
		 * @abstract
		 * @method resize
		 */
		resize : function() {
			throw new Error( "resize() must be implemented in subclass" );
		},
		
		
		// ---------------------------
		
		
		/**
		 * Method that is called when the image is loaded.
		 *
		 * @protected
		 * @method onImageLoad
		 * @param {jQuery.Event} evt
		 */
		onImageLoad : function( evt ) {			
			this.imageLoaded = true;
			
			// Call the onImageLoad callback, if there is one
			var onImageLoad = this.settings.onImageLoad;
			if( typeof onImageLoad === 'function' ) {
				onImageLoad();
			}
			
			if( this.settings.speed ) {
				this.$fillmoreEl
					.hide()
					.fadeIn( this.settings.speed, $.proxy( this.onImageVisible, this ) );
					
				// Reset the 'speed' now, so it only affects the initial load, and not changes to other settings (ex: the focus settings)
				this.settings.speed = 0;
				
			} else {
				// No fade in "speed", the image is visible
				this.onImageVisible();
			}
		},
		
		
		/**
		 * Method that is called when the image becomes fully visible.
		 *
		 * @private
		 * @method onImageVisible
		 * @param {Function} callback (optional) A callback to call when the image has loaded and faded in.
		 *   This is called before the {@link #settings} `onImageVisible` callback is called.
		 */
		onImageVisible : function( callback ) {
			this.imageVisible = true;
			
			var settings = this.settings,
			    onImageVisible = settings.onImageVisible || settings.callback;  // 'callback' is legacy
			    
			if( typeof onImageVisible === "function" ) {
				onImageVisible();
			}
		},
		
		
		// ------------------------------
		
		
		/**
		 * Remove Fillmore from the target element.
		 *
		 * @abstract
		 * @method destroy
		 */
		destroy : function() {
			// Restore the original position and z-index styles, if Fillmore modified them
			if( this.containerPositionModified ) {				
				this.$containerEl.css( 'position', '' );
			}
			if( this.containerZIndexModified ) {
				this.$containerEl.css( 'z-index', '' );
			}
			
			// Restore the original overflow style
			this.$containerEl.css( 'overflow', this.originalContainerOverflow );
			
			// Remove the fillmore element. The child image element will be removed as well.
			this.$fillmoreEl.remove();
		}
	
	} );
	
})( jQuery );
