# photo-cropper
Crop Photo feature for S2A

- [Installation](#installation)
- [Usage Example](#usage-example)

## Installation
  ```
npm install git://github.com/S2A-IO/photo-cropper --save
  ```
## Usage Example

Load the required image to crop and initilized it.
  ```
  CropImage.init( img, "canvas", {
    ratio: 1
  });
  ```
Calling th crop image function to crop the image.
  ```
CropImage.crop();
  ```
After croping the image save it in a variable.
  ```
var finalImage = CropImage.save();
  ```
After saving the image , resetting the constructor.
  ```
CropImage.reset();
  ```
