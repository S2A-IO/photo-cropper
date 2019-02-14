var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;
const CropImage = require('./../client/index');
const url = './support.png';
const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

describe('initilize canvas image', function () {
//Calling jsdom function for create an image tag for test
  jsdom()
  it('initilize canvas image', function () {
//Initialize canvas, image and selector with given canvas id and image source.
    var img = document.createElement('img');
    // Assigning the image source to the image object
    img.src = url;
// Assigning the image source to the image object
    img.onload = () => {
      ctx.drawImage(img, 200, 200);
//This can call statically, make a CropImage class object and set it to static variable instance for further use.
      CropImage.init( img, "canvas", {
        ratio: 1
      });
      expect(img.nodeName).eql('IMG')
    }
  })
})

describe('cropping canvas image', function () {
//Calling jsdom function for create an image tag for test
  jsdom()
  it('cropping canvas image', function () {
//Initialize canvas, image and selector with given canvas id and image source.
    var img = document.createElement('img');
    // Assigning the image source to the image object
    img.src = url;
// Assigning the image source to the image object
    img.onload = () => {
      ctx.drawImage(img, 200, 200);
//Calling the function of CropImage class to crop the image.
      CropImage.crop();
      expect(img.nodeName).eql('IMG')
    }
  })
})

describe('saving canvas image', function () {
//Calling jsdom function for create an image tag for test
  jsdom()
  it('saving canvas image', function () {
//Initialize canvas, image and selector with given canvas id and image source.
    var img = document.createElement('img');
    // Assigning the image source to the image object
    img.src = url;
// Assigning the image source to the image object
    img.onload = () => {
      ctx.drawImage(img, 200, 200);
//Calling the function of CropImage class to save the image.
      CropImage.save();
      expect(img.nodeName).eql('IMG')
    }
  })
})

describe('resetting canvas image', function () {
//Calling jsdom function for create an image tag for test
  jsdom()
  it('resetting canvas image', function () {
//Initialize canvas, image and selector with given canvas id and image source.
    var img = document.createElement('img');
    // Assigning the image source to the image object
    img.src = url;
// Assigning the image source to the image object
    img.onload = () => {
      ctx.drawImage(img, 200, 200);
//Calling the function of CropImage class to reset the image.
      CropImage.reset();
      expect(img.nodeName).eql('IMG')
    }
  })
})
