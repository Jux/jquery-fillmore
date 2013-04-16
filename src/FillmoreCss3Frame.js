/**
 * @class $.FillmoreCss3Frame
 * @extends $.FillmoreCss3
 * 
 * CSS3 background-size:contain implementation of Fillmore. Used when CSS3 is available.
 */
/*global jQuery */
(function( $ ) {
  
  /**
   * Creates a new FillmoreCss3Frame instance.
   * 
   * @constructor
   * @param {HTMLElement/jquery} containerEl The container element where a fillmore'd image should be placed.
   */
  $.FillmoreCss3Frame = function( containerEl ) {
    $.FillmoreCss3.apply( this, arguments );
  };
  
  
  $.extend( $.FillmoreCss3Frame.prototype, $.FillmoreCss3.prototype, {
    
    /**
     * Method that is called when the image is loaded, to apply the image to the background
     * of the {@link #$fillmoreEl}.
     *
     * @protected
     * @method onImageLoad
     * @param {jQuery.Event} evt
     */
    onImageLoad : function( evt ) {
      $.FillmoreCss3.prototype.onImageLoad.apply( this, arguments );

      var imgSize = this.getImageSize(),
        $fillmoreEl = this.$fillmoreEl;

      if ( $fillmoreEl.width() < imgSize.width || $fillmoreEl.height() < imgSize.height ) {
        // image is larger than the container
        $fillmoreEl.css( 'background-size', 'contain' );
      }
    }
    
  } );
  
})( jQuery );
