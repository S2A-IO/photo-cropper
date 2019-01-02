# photo-cropper
Crop Photo feature for S2A

- [Installation](#installation)
- [Usage Example](#usage-example)

## Installation
  ```
npm install git://github.com/S2A-IO/photo-cropper --save
  ```
photo-cropper has the peerDependencies of cropperjs we have to install it.
```
npm install cropperjs --save
```
## Usage Example
Load the required image to crop and initialize it.

| Field    | Description      | Required       |
|----------|-------------|----------------|
| img   | Image to initialize image.  | **YES** |
| ratio      | Aspect ratio for selector ( optional and default value is 1 ). | **YES** |

  ```
CropImage.init( image, ratio);
  ```
Call the crop image function to crop the image.
  ```
  var cropper = CropImage.crop();
  ```
After cropping the image save it in a variable.
  ```
  var canvas = cropper.getCroppedCanvas();
  var dataURL = canvas.toDataURL();
  var image = dataURL;
  ```
After saving the image, reset the constructor.
  ```
CropImage.reset();
  ```
