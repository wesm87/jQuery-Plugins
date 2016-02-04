$ = window.jQuery || window.$

$.fn.collapsible = ->

	this.each =>

		closeButton  = this.find( '[data-action="close"]' )
		collapsibles = this.find( '.collapsible' )
		titles       = collapsibles.find( '.title' )

		collapsibles
			.filter( '.open' )
			.find( '.details' )
			.show()

		titles.click( ( event ) ->

			header = $( event.currentTarget )
			parent = header.parent()
			open   = collapsibles.filter( '.open' )

			event.preventDefault()

			if parent.hasClass( 'open' )
				parent.find( '.details' ).slideUp()
				parent.removeClass( 'open' )
				return false

			open.find( '.details' ).slideUp()
			open.removeClass( 'open' )

			parent.find( '.details' ).slideDown()
			parent.addClass( 'open' )
		)

		if closeButton.length

			closeButton.click( ( event ) ->
				event.preventDefault()
				this.hide()
			)
