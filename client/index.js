"use strict";
/**
 * This class is use to crop images. It have ability to crop images in three ways:
 * 1- Crop images in square dimensions ( for square cropping give 1 in ratio argument ).
 * 2- Crop images in free shape dimensions ( for free shape cropping give -1 in ratio argument ).
 * 3- Crop images in same as given aspect ratio ( for other cropping give any value in ratio argument ).
 */
const fabric = require('fabric').fabric;

class CropImage {

  /**
   * Initialize canvas, image and selector with given canvas id and image source.
   *
   * @param {string} img                  Image to initialize image.
   * @param {string} convasId             Canvas id to initialize canvas.
   * @param {object} options              Options to set.
   *
   * @returns {undefined} None.
   */
  constructor( img, canvasId, options ) {
    this.options = {
      ratio: 1,
      format: 'png',
      backgroundColor: '#333',
      hoverCursor: 'crosshair',
      fill: 'rgba( 0, 0, 0, 0.3 )',
      stroke: '#ccc'
    };

    // merge default options and user given options.
    this.options = Object.assign( this.options, options );

    this.initImage( img.src, canvasId );
  }

  /**
   * Initialize canvas, image and selector with given canvas id and image source.
   * This can call statically, make a CropImage class object and set it to static variable instance for further use.
   *
   * @param {string} img                  Image to initialize image.
   * @param {string} convasId             Canvas id to initialize canvas.
   * @param {number} ratio                Aspect ratio for selector ( optional and default value is 1 ).
   *
   * @returns {undefined} None.
   */
  static init( img, canvasId, options ) {
    CropImage.instance = new CropImage( img, canvasId, options );
  }

  /**
   * Crop the image on current instance.
   *
   * @returns {undefined} None.
   */
  static crop() {
    CropImage.instance.crop();
  }

  /**
   * Save the image on current instance.
   *
   * @returns {string} img.
   */
  static save() {
    return CropImage.instance.save();
  }

  /**
   * Reset all resources.
   *
   * @returns {undefined} none.
   */
  static reset() {
    CropImage.instance.reset();
    CropImage.instance = null;
  }

  /**
   * Initialize canvas from given canvas id.
   *
   * @param {string} id                  Canvas id to initialize canvas.
   *
   * @returns {undefined} None.
   */
  initCanvas( id, img ) {
    // Set 'this' in 'me' variable to access the scope inside functions.
    let me = this;
    // fabric.Canvas serves as a wrapper around <canvas> element, and is
    // responsible for managing all of the fabric objects on that particular canvas.
    // It takes an id of an element, and returns an instance of fabric.Canvas.
    this.canvas = new fabric.Canvas( id, {
      selection: false,
      hoverCursor: this.options.hoverCursor
    });
    this.canvas.backgroundColor = this.options.backgroundColor;
    let ctx = this.canvas.getContext("2d");
    let orientation = EXIF.getTag( img, 'Orientation' );

    switch ( orientation ) {
      case 2: ctx.transform(-1, 0, 0, 1, img.width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, img.width, img.height ); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, img.height ); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, img.height , 0); break;
      case 7: ctx.transform(0, -1, -1, 0, img.height , img.width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, img.width); break;
      default: break;
    }

    ctx.drawImage( img, 0, 0);
    // Render canvas instance.
    this.canvas.renderAll();
  }

  /**
   * Initialize image from given image source.
   *
   * @param {Object} src                  Image source to initialize image.
   *
   * @returns {undefined} None.
   */
  initImage( src, canvasId ) {
    let me = this;
    // Loads image element from given source and passes it to a callback.
    fabric.util.loadImage( src, function( img ) {
      me.initCanvas( canvasId, img );
      let scaleX = me.canvas.width / img.width;
      let scaleY = me.canvas.height / img.height;
      let top = 0, left = 0;

      if ( scaleX < scaleY ) {
        me.scale = scaleX;
        top = ( me.canvas.height - ( img.height * scaleX ) ) / 2;
      } else {
        me.scale = scaleY;
        left = ( me.canvas.width - ( img.width * scaleY ) ) / 2;
      }

      // Create fabric.Image instance
      me.imgInstance = new fabric.Image( img, {
        top: top,
        left: left,
        selectable: false,
        scaleX: me.scale,
        scaleY: me.scale
      });

      me.imgInstance.hasRotatingPoint = false;

      // Add image instance in canvas
      me.canvas.add( me.imgInstance );

      me.initSelector( me.imgInstance );
      me.canvas.renderAll();
      me.registerCropEvent();
    });
  }

  /**
   * Initialize selector which is a rectangular.
   *
   *
   * @returns {undefined} None.
   */
  initSelector( img ) {

    let height = img.height * img.scaleY;
    let width = img.width * img.scaleX;
    let top = img.top;
    let left = img.left;

    if ( this.options.ratio >= 0 ) {

      if ( img.height > img.width ) top = ( ( img.height * img.scaleY ) - ( img.width * img.scaleX ) ) / 2;
      else if ( img.width > img.height ) left = ( ( img.width * img.scaleX ) - ( img.height * img.scaleY ) ) / 2;

      if ( this.options.ratio == 1 ) {

        if ( img.height > img.width ) {
          height = img.width * img.scaleX;
          width = img.width * img.scaleX;
        } else if ( img.width > img.height ) {
          height = img.height * img.scaleY;
          width = img.height * img.scaleY;
        }
      } else if ( this.options.ratio > 1 ) {

        height = img.height * img.scaleY;
        width = ( img.width * img.scaleX ) / this.options.ratio;

      } else if ( this.options.ratio < 1 ) {

        height = ( img.height * img.scaleY ) * this.options.ratio;
        width = img.width * img.scaleX;
      }
    }

    // Create a rectangle object
    this.rect = new fabric.Rect({
      fill: this.options.fill,
      originX: 'left',
      originY: 'top',
      top: top,
      left: left,
      width: width,
      height: height,
      opacity: 1,
      visible: true,
      selectable: false,
      stroke: this.options.stroke,
      strokeDashArray: [2, 2]
    });

    this.canvas.add( this.rect );
    this.canvas.bringToFront( this.rect );
  }

  /**
   * Initialize move events for crop.
   *
   *
   * @returns {undefined} None.
   */
  registerCropEvent() {
    let me = this;

    // Start drawing rectangular when mouse down event is meet and bring this rectangular to front.
    this.canvas.on( "mouse:down", function( event ) {
      let pointer = me.canvas.getPointer( event.e );

      me.origX = pointer.x;
      me.origY = pointer.y;
      me.rect.left = me.origX;
      me.rect.top = me.origY;
      me.rect.width = pointer.x - me.origX;
      me.rect.height = pointer.y - me.origY;
      me.rect.visible = true;
      me.isDown = true;
    });

    // When mouse move event encountered check mouse down event is going on or not,
    // if true get canvas pointer values and set rectangular top, left, width and height.
    this.canvas.on( "mouse:move", function( event ) {
      if ( me.isDown ) {
        let pointer = me.canvas.getPointer( event.e );

        if ( me.origX > pointer.x ) {
          me.rect.set( {
            left: Math.abs( pointer.x )
          });
        }

        if ( me.origY > pointer.y ) {
          me.rect.set( {
            top: Math.abs( pointer.y )
          });
        }

        let width;
        let height;

        switch ( me.options.ratio ) {
          case -1:
            width = Math.abs( me.origX - pointer.x );
            height = Math.abs( me.origY - pointer.y );
            break;
          case 1:
            width = Math.abs( me.origX - pointer.x );
            height = Math.abs( me.origX - pointer.x ) / me.options.ratio;
            break;
          default:
            width = Math.abs( me.origY - pointer.y ) * me.options.ratio;
            height = Math.abs( me.origY - pointer.y );
        }

        me.rect.set( {
          width: width
        });

        me.rect.set( {
          height: height
        });

        me.canvas.renderAll();
      }
    });

    // Stop drawing rectangular when mouse up event encountered.
    this.canvas.on( "mouse:up", function( event ) {
      me.isDown = false;
    });
  }

  /**
   * Save cropped image with new attributes.
   *
   * @returns {data URI}.
   */
  save() {
    if ( this.rect.width <= 0 || this.rect.height <= 0 ) {
      let options = {
        format: this.options.format,
        left: this.imgInstance.left,
        top: this.imgInstance.top,
        width: this.imgInstance.width * this.scale,
        height: this.imgInstance.height * this.scale
      };

      return this.canvas.toDataURL( options );
    }

    this.rect.visible = false;

    let left = ( this.rect.left - this.imgInstance.left );
    let top = ( this.rect.top - this.imgInstance.top );

    // extra top and left showing in image padding
    left += ( this.canvas.width - ( this.imgInstance.width * this.scale ) ) / 2;
    top += ( this.canvas.height - ( this.imgInstance.height * this.scale ) ) / 2;

    let width = this.rect.width;
    let height = this.rect.height;

    if ( this.rect.top < this.imgInstance.top ) {
      top = this.imgInstance.top;
      height -= ( this.imgInstance.top - this.rect.top );
    }

    if ( this.rect.left < this.imgInstance.left ) {
      left = this.imgInstance.left;
      width -= ( this.imgInstance.left - this.rect.left );
    }

    let options = {
      format: this.options.format,
      left: left,
      top: top,
      width: width,
      height: height
    };

    let img = this.canvas.toDataURL( options );

    return img;
  }

  /**
   * Reset all resources.
   *
   * @returns {undefined} None.
   */
  reset() {
    this.canvas.remove( this.imgInstance );
    this.canvas.remove( this.rect );
    this.rect.remove();
    this.imgInstance.remove();
    delete this.canvas;
    delete this.rect;
    delete this.imgInstance;
  }

  /**
   * Crop image .
   *
   * @returns {undefined} None.
   */
  crop() {
    if ( this.rect.width <= 0 || this.rect.height <= 0 )
      return;

    let left = ( this.rect.left - this.imgInstance.left ) / this.scale;
    let top = ( this.rect.top - this.imgInstance.top ) / this.scale;

    // move x & y origin to top left from center
    left -= this.imgInstance.width / 2;
    top -= this.imgInstance.height / 2;

    let width = this.rect.width / this.scale;
    let height = this.rect.height / this.scale;

    // This method do the trick and crop image with new dimensions.
    this.imgInstance.clipTo = function( ctx ) {
      ctx.rect( left, top, width, height );
    };

    this.canvas.renderAll();
  }
}
module.exports = CropImage;
