(function() {
  var $, DEBUG_LEVEL, log;

  $ = window.jQuery || window.$;

  DEBUG_LEVEL = {
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    MESSAGE: 3
  };

  log = function(message, debugLevel) {
    var level;
    level = debugLevel != null ? debugLevel : DEBUG_LEVEL.MESSAGE;
    if (level <= settings.debugLevel) {
      if (window.console) {
        return console.log(message);
      }
    }
  };

  $.fn.preloadImages = function(options) {

    /*
    	 * Settings
     */
    var defaults, settings;
    defaults = {
      debugLevel: DEBUG_LEVEL.WARNING,
      delay: 0,
      onFirstImageLoad: function() {
        $(document).trigger('firstImageLoaded');
        return console.log('First image loaded');
      },
      onEachImageLoad: function() {
        var currentImage, id;
        currentImage = $(this);
        id = currentImage.data('id');
        currentImage.data('loaded', 'true');
        if (id) {
          return console.log("Image " + id + " loaded");
        }
      },
      onLoadingComplete: function() {
        return console.log('All images loaded');
      }
    };
    settings = $.extend({}, defaults, options);

    /*
    	 * Preload images
     */
    return this.each(function() {
      var firstImageLoaded, images, prevId, showImage, t;
      images = $(this).find('img');
      prevId = 0;
      firstImageLoaded = false;
      t = null;
      images.bind('show', function() {
        var id, img, next, src;
        img = $(this);
        src = img.data('src');
        id = parseInt(img.data('id'), 10);
        next = $(images[id]);
        if (src) {
          if (id) {
            if (img.data('loaded')) {
              console.log("Image " + id + " already loaded, skipping image");
              return showImage(next, id);
            } else {
              img.load(function() {
                showImage(next, id);
                settings.onEachImageLoad.call(this);
                if (!firstImageLoaded) {
                  firstImageLoaded = true;
                  settings.onFirstImageLoad.call(this);
                }
                if (!next.length) {
                  return settings.onLoadingComplete.call(this);
                }
              });
              return img.attr('src', src);
            }
          } else {
            return console.log('No data-id attribute found, skipping image', DEBUG_LEVEL.ERROR);
          }
        } else {
          console.log('No data-src attribute found, skipping image', DEBUG_LEVEL.ERROR);
          return showImage(next, id);
        }
      });
      showImage = function(img, id) {
        var callback;
        if (t) {
          clearTimeout(t);
        }
        callback = function() {
          if (id === prevId + 1) {
            prevId = id;
          } else {
            img = $(images[prevId]);
          }
          return img.trigger('show');
        };
        return t = setTimeout(callback, settings.delay);
      };
      return images.first().trigger('show');
    });
  };

}).call(this);
