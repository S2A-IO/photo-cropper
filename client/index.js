/**
 * This is a singleton class is use to create only one itemInstance.
 */
import Cropper from './../../../cropperjs/src/index';
var image = null;

/**
 * @class
 *
 * CropImage class to to manage crop image functionality.
 */
class CropImage {

  /**
   *
   * @constructor
   */
  constructor( image, changeAspectRatio) {
    this.photoCropper = '';
    changeAspectRatio = changeAspectRatio != undefined ? changeAspectRatio : 0;
    if ( image ) {
      var customAspectRatio = 0;
      var cropper = new Cropper(image, {
        dragMode: 'move',
        viewMode: 3,
        ready: function (event) {
          /*Zoom the image to its quater size*/
          var imageWidth = cropper.getImageData().naturalWidth;
          var imageHeight = cropper.getImageData().naturalHeight;
          var imageAspect = cropper.getImageData().aspectRatio;
          cropper.setCropBoxData({
            width: imageWidth,
            height: imageHeight
          });
          cropper.zoomTo(0.067);
        },
        crop: function (event) {
          let data = JSON.stringify(cropper.getData());
          let cropBoxData = JSON.stringify(cropper.getCropBoxData());
        },

        zoom: function (event) {
          /* Keep the image in its natural size*/
          if (event.detail.oldRatio === 1) {
            event.preventDefault();
          }
        },
        aspectRatio : changeAspectRatio,
      });
      this.photoCropper = cropper;
    }
  }

  /**
   * set ImagesResponse object from a JavaScript object and set.
   *
   * @param {object} obj     ImagesResponse name object
   */
  static init( image , changeAspectRatio ) {
    CropImage.instance = new CropImage( image, changeAspectRatio );
  }

  /**
   * Crop the image on current instance.
   *
   * @returns {undefined} None.
   */
  static crop() {
    return CropImage.instance.getCropImage();
  }

  /**
   * get ImagesResponse object from a JavaScript object and get.
   *
   * @returns {object}    name  of ImagesResponse
   */
  getCropImage() {
    return this.photoCropper;
  }

  /**
   * This is a singleton class is use to create only one instance.
   *
   * @returns {Images}          instance
   */
  static getInstance() {
    if ( this.image == null ) this.image = new CropImage();
    return this.image;
  }

  /**
   * This is a singleton class is use to create only one instance.
   *
   * @returns {Images}          instance
   */
  static reset() {
    if ( this.image != null ) this.image = null;
  }
}
export { CropImage };
