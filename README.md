# photo-cropper
Crop Photo feature for S2A

- [Installation](#installation)
- [Usage Example](#usage-example)

## Installation
  ```
npm install git://github.com/S2A-IO/photo-cropper --save
  ```
## Usage Example
Load the required image to crop and initialize it.

| Field    | Description      | Required       |
|----------|-------------|----------------|
| img   | Image to initialize image.  | **YES** |
| canvas      | Canvas id to initialize canvas. | **YES** |
| ratio      | Aspect ratio for selector ( optional and default value is 1 ). | **YES** |

  ```
  CropImage.init( img, "canvas", {
    ratio: 1
  });
  ```
Call the crop image function to crop the image.
  ```
CropImage.crop();
  ```
After cropping the image save it in a variable.
  ```
var finalImage = CropImage.save();
  ```
After saving the image, reset the constructor.
  ```
CropImage.reset();
  ```
