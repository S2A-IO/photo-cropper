var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;
const CropImage = require('./../client/index');
const url = './support.png';
const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

describe('initilize canvas image', function () {

  jsdom()
  it('has document', function () {
    var img = document.createElement('img');

    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => { throw err };
    img.src = url;
    CropImage.init( img, "canvas", {
      ratio: 1
    });
    expect(img.nodeName).eql('IMG')
  })
})
