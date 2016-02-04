(function() {
  var $;

  $ = window.jQuery || window.$;

  $.fn.collapsible = function() {
    return this.each((function(_this) {
      return function() {
        var closeButton, collapsibles, titles;
        closeButton = _this.find('[data-action="close"]');
        collapsibles = _this.find('.collapsible');
        titles = collapsibles.find('.title');
        collapsibles.filter('.open').find('.details').show();
        titles.click(function(event) {
          var header, open, parent;
          header = $(event.currentTarget);
          parent = header.parent();
          open = collapsibles.filter('.open');
          event.preventDefault();
          if (parent.hasClass('open')) {
            parent.find('.details').slideUp();
            parent.removeClass('open');
            return false;
          }
          open.find('.details').slideUp();
          open.removeClass('open');
          parent.find('.details').slideDown();
          return parent.addClass('open');
        });
        if (closeButton.length) {
          return closeButton.click(function(event) {
            event.preventDefault();
            return this.hide();
          });
        }
      };
    })(this));
  };

}).call(this);
