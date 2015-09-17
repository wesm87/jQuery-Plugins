;(function( $ ) {

$.fn.collapsible = function() {
    this.each(function() {
        var self = $( this );
        var closeButton = self.find( '[data-action="close"]' );
        var collapsibles = self.find( '.collapsible' );
        var titles = collapsibles.find( '.title' );

        collapsibles.filter( '.open' ).find( '.details' ).show();

        titles.click(function( event ) {
			var header = $( this );
            var parent = header.parent();
			var open = collapsibles.filter( '.open' );

            event.preventDefault();

            if ( parent.hasClass( 'open' ) ) {
                parent.find( '.details' ).slideUp();
                parent.removeClass( 'open' );
                return false;
            }

            open.find( '.details' ).slideUp();
            open.removeClass( 'open' );

            parent.find( '.details' ).slideDown();
            parent.addClass( 'open' );
        });

        if ( closeButton.length ) {
            closeButton.click(function( event ) {
                event.preventDefault();
                self.hide();
            });
        }
    });
};

})( jQuery );
