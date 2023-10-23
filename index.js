const { OpenAI } = require('openai');
const fs  = require("fs");
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const axios =  require("axios")

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

  
  downloadImage('https://oaidalleapiprodscus.blob.core.windows.net/private/org-ctGeEEwBVZKMkPJ0wwEZLqNF/user-OOKxlRnbcrPn29m6NM6yVUG0/img-1fGe7UCD9DfW0bI0HfcVbhdm.png?st=2023-10-23T16%3A50%3A31Z&se=2023-10-23T18%3A50%3A31Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-23T01%3A29%3A39Z&ske=2023-10-24T01%3A29%3A39Z&sks=b&skv=2021-08-06&sig=oZ%2Bv7zm%2BRfjghDmRp/QFI50ySgjOAHnI6vXmpheTTCc%3D','downloaded_image.png')
.then(() => {
  console.log('Image downloaded successfully!');
})
.catch((error) => {
  console.error('Error:', error);
});

async function dalleGenerateImage(text) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: 'Say this is a test' }],
//     model: 'gpt-3.5-turbo',
//   });

//   console.log(chatCompletion.choices);


const image = await openai.images.generate({ prompt: text });

console.log(image.data);

downloadImage(image.data,'downloaded_image.png')
.then(() => {
  console.log('Image downloaded successfully!');
})
.catch((error) => {
  console.error('Error:', error);
});

// watermarkText(text,'beer.png','output.png')

}


// Function to download the image
async function downloadImage(image_url,outputPath) {
  try {
    const response = await axios.get(image_url, { responseType: 'stream' });
    const writer = fs.createWriteStream(path.join(__dirname,outputPath));

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading the image:', error);
  }
}


// dalleGenerateImage(text);



});


//Watermarking Poem On Image
function watermarkText(text,inputImage,outputImage){

// Create a Canvas
const canvas = createCanvas(800, 600);
const context = canvas.getContext('2d');

// Load the image onto the canvas
loadImage(inputImage).then((image) => {
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0, image.width, image.height);

  // Set watermark text properties
  context.font = 'bold 40px Arial';
  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Watermark text
  context.fillText(text, canvas.width / 2, (canvas.height / 3));

  // Save the resulting image
  const out = fs.createWriteStream(outputImage);
  const stream = canvas.createJPEGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('Watermark added!'));
});





}