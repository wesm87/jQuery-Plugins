$ = window.jQuery || window.$

# ----------------------------------------------------
# Constants
# ----------------------------------------------------

DEBUG_LEVEL =
	NONE:    0
	ERROR:   1
	WARNING: 2
	MESSAGE: 3




# ----------------------------------------------------
# Begin script
# ----------------------------------------------------

log = ( message, debugLevel ) ->

	# If no level is specified, assume it's a message
	level = debugLevel ? DEBUG_LEVEL.MESSAGE

	if level <= settings.debugLevel
		console.log( message ) if window.console


$.fn.preloadImages = ( options ) ->

	###
	# Settings
	###

	defaults =

		debugLevel: DEBUG_LEVEL.WARNING

		delay: 0 # how long to wait (in ms) between loading each image

		onFirstImageLoad: ->

			$( document ).trigger( 'firstImageLoaded' )
			console.log( 'First image loaded' )

		onEachImageLoad: ->

			currentImage = $( this )
			id = currentImage.data( 'id' )

			currentImage.data( 'loaded', 'true' )

			if ( id ) then console.log( "Image #{id} loaded" )

		onLoadingComplete: -> console.log( 'All images loaded' )

	settings = $.extend( {}, defaults, options )

	###
	# Preload images
	###
	return this.each ->

		images = $( this ).find( 'img' )
		prevId = 0
		firstImageLoaded = false
		t = null

		images.bind( 'show', ->

			img  = $( this )
			src  = img.data( 'src' )
			id   = parseInt( img.data( 'id' ), 10 )
			next = $( images[ id ] )

			if src
				if id
					if img.data( 'loaded' )

						console.log( "Image #{id} already loaded, skipping image" )

						showImage( next, id )

					else

						img.load( ->

							showImage( next, id )
							settings.onEachImageLoad.call( this )

							if ! firstImageLoaded
								firstImageLoaded = true
								settings.onFirstImageLoad.call( this )

							if ! next.length
								settings.onLoadingComplete.call( this )

						)

						img.attr( 'src', src )
				else
					console.log( 'No data-id attribute found, skipping image', DEBUG_LEVEL.ERROR )
			else
				console.log( 'No data-src attribute found, skipping image', DEBUG_LEVEL.ERROR )
				showImage( next, id )
		)

		showImage = ( img, id ) ->

			if t then clearTimeout( t )

			callback = ->
				if id == prevId + 1
					prevId = id
				else
					img = $( images[ prevId ] )

				img.trigger( 'show' )

			t = setTimeout( callback, settings.delay )

		images.first().trigger( 'show' )
