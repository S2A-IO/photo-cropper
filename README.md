# photo-cropper
Crop Photo feature for S2A

// Installation
npm install git://github.com/S2A-IO/photo-cropper --save

//Load the required image to crop and initilized it.
// finalImage is the buffer of read file.
loadImage( finalImage, function callback( img ) {
  var ratio = it.url.ratio ? it.url.ratio : 1;
  CropImage.init( img, "canvas", {
    ratio: parseInt( ratio )
  });
});

// Calling th crop image function to crop the image.
CropImage.crop();

// After croping the image save it in a variable.
current.finalImage = CropImage.save();

//After saving the image , resetting the constructor.
CropImage.reset();
