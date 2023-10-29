const { OpenAI } = require('openai');
const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const axios = require("axios")

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

require('dotenv').config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

fs.readFile('./poem.txt', 'utf8', async (err, text) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(text);


  async function dalleGenerateImage(text) {

    const image = await openai.images.generate({ prompt: text });

    console.log(image.data[0].url);
    return image.data[0].url

    

  }


  // Function to download the image
  async function downloadImage(outputPath, myCallback) {
    try {
      image_url = await myCallback(text)
      const response = await axios.get(image_url, { responseType: 'stream' });
      const writer = fs.createWriteStream(path.join(__dirname, outputPath));

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  }

  downloadImage('downloaded_image.png', dalleGenerateImage)
    .then(() => {
      console.log('Image downloaded successfully!');
      watermarkText(text,'downloaded_image.png','output.png')
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    


  // dalleGenerateImage(text);



});


//Watermarking Poem On Image
function watermarkText(text, inputImage, outputImage) {

  // Create a Canvas
  const canvas = createCanvas(800, 600);
  const context = canvas.getContext('2d');

  // Load the image onto the canvas
  loadImage(inputImage).then((image) => {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);

    // Set watermark text properties
    context.font = 'bold 35px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Watermark text
    context.fillText(text, (canvas.width / 2), (canvas.height / 3));

    // Save the resulting image
    const out = fs.createWriteStream(outputImage);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Watermark added!'));
  });





}