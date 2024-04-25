/*!
 * classie - funciones auxiliares para manejar clases
 * de bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'mi-clase' ) -> true/false
 * classie.add( elem, 'mi-nueva-clase' )
 * classie.remove( elem, 'mi-clase-no-deseada' )
 * classie.toggle( elem, 'mi-clase' )
 */

/*jshint browser: true, strict: true, undef: true */

( function( window ) {

  'use strict';
  
  // Funciones auxiliares de clase de bonzo https://github.com/ded/bonzo
  
  function classReg( nombreClase ) {
    return new RegExp("(^|\\s+)" + nombreClase + "(\\s+|$)");
  }
  
  // Soporte para classList para gestión de clases
  // aunque para ser justos, la API es deficiente porque no acepta múltiples clases a la vez
  var tieneClase, agregarClase, eliminarClase;
  
  if ( 'classList' in document.documentElement ) {
    tieneClase = function( elem, c ) {
      return elem.classList.contains( c );
    };
    agregarClase = function( elem, c ) {
      elem.classList.add( c );
    };
    eliminarClase = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    tieneClase = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    agregarClase = function( elem, c ) {
      if ( !tieneClase( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    eliminarClase = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }
  
  function toggleClass( elem, c ) {
    var fn = tieneClase( elem, c ) ? eliminarClase : agregarClase;
    fn( elem, c );
  }
  
  window.classie = {
    // nombres completos
    tieneClase: tieneClase,
    agregarClase: agregarClase,
    eliminarClase: eliminarClase,
    toggleClass: toggleClass,
    // nombres cortos
    has: tieneClase,
    add: agregarClase,
    remove: eliminarClase,
    toggle: toggleClass
  };
  
  })( window );
  