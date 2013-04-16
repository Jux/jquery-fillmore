/**
 * @class $.FillmoreCss3Cover
 * @extends $.FillmoreCss3
 * 
 * CSS3 background-size:cover implementation of Fillmore. Used when CSS3 is available.
 */
/*global jQuery */
(function( $ ) {
  
  /**
   * Creates a new FillmoreCss3Cover instance.
   * 
   * @constructor
   * @param {HTMLElement/jquery} containerEl The container element where a fillmore'd image should be placed.
   */
  $.FillmoreCss3Cover = function( containerEl ) {
    $.FillmoreCss3.apply( this, arguments );
  };
  
  
  $.extend( $.FillmoreCss3Cover.prototype, $.FillmoreCss3.prototype, {
    
    /**
     * Extension of {@link $.Fillmore#createFillmoreEl createFillmoreEl} from the superclass, to 
     * apply the necessary CSS properties needed for the CSS3 implementation.
     *
     * @protected
     * @method createFillmoreEl
     * @return {jQuery}
     */
    createFillmoreEl : function() {
      $.FillmoreCss3.prototype.createFillmoreEl.apply( this, arguments );

      this.$fillmoreEl.css( 'background-size', 'cover' );
    }
    
  } );
  
})( jQuery );
