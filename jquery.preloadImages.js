;(function( $ ) {

var DEBUG_LEVEL = {
	NONE:    0,
	ERROR:   1,
	WARNING: 2,
	MESSAGE: 3
};

$.fn.preloadImages = function( options ) {

	// Settings
	var settings;
	var defaults = {

		// Controls which types of messages are logged
		debugLevel: DEBUG_LEVEL.WARNING,

		// How long to wait (in ms) between loading each image
		delay: 0,

		// Callback that's fired when the first image is loaded
		onFirstImageLoad: function() {
			$( document ).trigger( 'firstImageLoaded' );
			log( 'First image loaded' );
		},

		// Callback that's fired when any image is loaded
		onEachImageLoad: function() {
			var currentImage = $( this );
			var id = currentImage.data( 'id' );

			currentImage.data( 'loaded', 'true' );
			if ( id ) {
				log( 'Image ' + id + ' loaded' );
			}
		},

		// Callback that's fired when all images have finished loading
		onLoadingComplete: function() {
			log( 'All images loaded' );
		}

	};
	settings = $.extend( {}, defaults, options );

	// Preload images
	return this.each(function() {
		var self = $( this );
		var images = self.find( 'img' );
		var prevId = 0;
		var firstImageLoaded = false;
		var t = null;

		images.bind( 'show', function() {
			var img = $( this );
			var src = img.data( 'src' );
			var id = parseInt( img.data( 'id' ) );
			var nextImg = $( images[ id ] );

			if ( src ) {
				if ( id ) {
					if ( img.data( 'loaded' ) ) {
						log( 'Image ' + id + ' already loaded, skipping image' );
						showImage( nextImg, id );
					} else {
						img.load(function() {
							showImage( nextImg, id );
							settings.onEachImageLoad.call( this );

							if ( ! firstImageLoaded ) {
								firstImageLoaded = true;
								settings.onFirstImageLoad.call( this );
							}

							if ( ! nextImg.length ) {
								settings.onLoadingComplete.call( this );
							}
						});
						img.attr( 'src', src );
					}
				} else {
					log( 'No data-id attribute found, skipping image', DEBUG_LEVEL.ERROR );
				}
			} else {
				log( 'No data-src attribute found, skipping image', DEBUG_LEVEL.ERROR );
				showImage( nextImg, id );
			}
		});

		function showImage( img, id ) {
			var show = function() {
				if ( id === prevId + 1 ) {
					prevId = id;
				} else {
					img = $( images[prevId] );
				}
				img.trigger( 'show' );
			};
			if ( t ) {
				clearTimeout( t );
			}
			t = setTimeout( show, settings.delay );
		}

		images.first().trigger( 'show' );
	});

	function log( message, debugLevel ) {
		var level = ( debugLevel ) ? debugLevel : DEBUG_LEVEL.MESSAGE;
		if ( level <= settings.debugLevel ) {
			if ( window.console ) {
				console.log( message );
			}
		}
	}
};

})( jQuery );
