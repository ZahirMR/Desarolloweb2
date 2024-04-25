/*!
 * imagesLoaded v3.0.2
 * JavaScript está todo como "¿Tus imágenes ya están listas o qué?"
 */

( function( window ) {

  'use strict';
  
  var $ = window.jQuery;
  var console = window.console;
  var hasConsole = typeof console !== 'undefined';
  
  // -------------------------- helpers -------------------------- //
  
  // extender objetos
  function extend( a, b ) {
    for ( var prop in b ) {
      a[ prop ] = b[ prop ];
    }
    return a;
  }
  
  var objToString = Object.prototype.toString;
  function isArray( obj ) {
    return objToString.call( obj ) === '[object Array]';
  }
  
  // convertir elemento o nodeList en un array
  function makeArray( obj ) {
    var ary = [];
    if ( isArray( obj ) ) {
      // usar objeto si ya es un array
      ary = obj;
    } else if ( typeof obj.length === 'number' ) {
      // convertir nodeList a array
      for ( var i=0, len = obj.length; i < len; i++ ) {
        ary.push( obj[i] );
      }
    } else {
      // array de un solo índice
      ary.push( obj );
    }
    return ary;
  }
  
  // --------------------------  -------------------------- //
  
  function defineImagesLoaded( EventEmitter, eventie ) {
  
    /**
     * @param {Array, Element, NodeList, String} elem
     * @param {Object or Function} options - si es una función, úsala como devolución de llamada
     * @param {Function} onAlways - función de devolución de llamada
     */
    function ImagesLoaded( elem, options, onAlways ) {
      // forzar ImagesLoaded() sin new, para ser new ImagesLoaded()
      if ( !( this instanceof ImagesLoaded ) ) {
        return new ImagesLoaded( elem, options );
      }
      // usar elem como cadena de selector
      if ( typeof elem === 'string' ) {
        elem = document.querySelectorAll( elem );
      }
  
      this.elements = makeArray( elem );
      this.options = extend( {}, this.options );
  
      if ( typeof options === 'function' ) {
        onAlways = options;
      } else {
        extend( this.options, options );
      }
  
      if ( onAlways ) {
        this.on( 'always', onAlways );
      }
  
      this.getImages();
  
      if ( $ ) {
        // agregar objeto diferido de jQuery
        this.jqDeferred = new $.Deferred();
      }
  
      // HACK verificar async para permitir tiempo para enlazar oyentes
      var _this = this;
      setTimeout( function() {
        _this.check();
      });
    }
  
    ImagesLoaded.prototype = new EventEmitter();
  
    ImagesLoaded.prototype.options = {};
  
    ImagesLoaded.prototype.getImages = function() {
      this.images = [];
  
      // filtrar y encontrar elementos si tenemos un selector de elementos
      for ( var i=0, len = this.elements.length; i < len; i++ ) {
        var elem = this.elements[i];
        // filtrar hermanos
        if ( elem.nodeName === 'IMG' ) {
          this.addImage( elem );
        }
        // encontrar hijos
        var childElems = elem.querySelectorAll('img');
        // concatenar childElems al array de filterFound
        for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
          var img = childElems[j];
          this.addImage( img );
        }
      }
    };
  
    /**
     * @param {Image} img
     */
    ImagesLoaded.prototype.addImage = function( img ) {
      var loadingImage = new LoadingImage( img );
      this.images.push( loadingImage );
    };
  
    ImagesLoaded.prototype.check = function() {
      var _this = this;
      var checkedCount = 0;
      var length = this.images.length;
      this.hasAnyBroken = false;
      // completar si no hay imágenes
      if ( !length ) {
        this.complete();
        return;
      }
  
      function onConfirm( image, message ) {
        if ( _this.options.debug && hasConsole ) {
          console.log( 'confirm', image, message );
        }
  
        _this.progress( image );
        checkedCount++;
        if ( checkedCount === length ) {
          _this.complete();
        }
        return true; // enlazar una vez
      }
  
      for ( var i=0; i < length; i++ ) {
        var loadingImage = this.images[i];
        loadingImage.on( 'confirm', onConfirm );
        loadingImage.check();
      }
    };
  
    ImagesLoaded.prototype.progress = function( image ) {
      this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
      this.emit( 'progress', this, image );
      if ( this.jqDeferred ) {
        this.jqDeferred.notify( this, image );
      }
    };
  
    ImagesLoaded.prototype.complete = function() {
      var eventName = this.hasAnyBroken ? 'fail' : 'done';
      this.isComplete = true;
      this.emit( eventName, this );
      this.emit( 'always', this );
      if ( this.jqDeferred ) {
        var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
        this.jqDeferred[ jqMethod ]( this );
      }
    };
  
    // -------------------------- jquery -------------------------- //
  
    if ( $ ) {
      $.fn.imagesLoaded = function( options, callback ) {
        var instance = new ImagesLoaded( this, options, callback );
        return instance.jqDeferred.promise( $(this) );
      };
    }
  
  
    // --------------------------  -------------------------- //
  
    var cache = {};
  
    function LoadingImage( img ) {
      this.img = img;
    }
  
    LoadingImage.prototype = new EventEmitter();
  
    LoadingImage.prototype.check = function() {
      // primero verifica en caché cualquier imagen anterior que tenga la misma src
      var cached = cache[ this.img.src ];
      if ( cached ) {
        this.useCached( cached );
        return;
      }
      // agregar esto a la caché
      cache[ this.img.src ] = this;
  
      // Si complete es true y el navegador admite tamaños naturales,
      // intenta verificar manualmente el estado de la imagen.
      if ( this.img.complete && this.img.naturalWidth !== undefined ) {
        // informar basado en naturalWidth
        this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
        return;
      }
  
      // Si ninguno de los controles anteriores coincidió, simula la carga en un elemento separado.
      var proxyImage = this.proxyImage = new Image();
      eventie.bind( proxyImage, 'load', this );
      eventie.bind( proxyImage, 'error', this );
      proxyImage.src = this.img.src;
    };
  
    LoadingImage.prototype.useCached = function( cached ) {
      if ( cached.isConfirmed ) {
        this.confirm( cached.isLoaded, 'cached was confirmed' );
      } else {
        var _this = this;
        cached.on( 'confirm', function( image ) {
          _this.confirm( image.isLoaded, 'cache emitted confirmed' );
          return true; // enlazar una vez
        });
      }
    };
  
    LoadingImage.prototype.confirm = function( isLoaded, message ) {
      this.isConfirmed = true;
      this.isLoaded = isLoaded;
      this.emit( 'confirm', this, message );
    };
  
    // activar manejador especificado para el tipo de evento
    LoadingImage.prototype.handleEvent = function( event ) {
      var method = 'on' + event.type;
      if ( this[ method ] ) {
        this[ method ]( event );
      }
    };
  
    LoadingImage.prototype.onload = function() {
      this.confirm( true, 'onload' );
      this.unbindProxyEvents();
    };
  
    LoadingImage.prototype.onerror = function() {
      this.confirm( false, 'onerror' );
      this.unbindProxyEvents();
    };
  
    LoadingImage.prototype.unbindProxyEvents = function() {
      eventie.unbind( this.proxyImage, 'load', this );
      eventie.unbind( this.proxyImage, 'error', this );
    };
  
    // -----  ----- //
  
    return ImagesLoaded;
  }
  
  // -------------------------- transport -------------------------- //
  
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
        'eventEmitter',
        'eventie'
      ],
      defineImagesLoaded );
  } else {
    // global del navegador
    window.imagesLoaded = defineImagesLoaded(
      window.EventEmitter,
      window.eventie
    );
  }
  
  })( window );
  