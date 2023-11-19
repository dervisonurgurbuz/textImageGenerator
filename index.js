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
  apiKey: process.env.OPENAI_API_KEY, 
});



async function getGPTRecepie(myCallback) {
  let data = ''
  fs.readFile('./ingredients.txt', 'utf8', async (err, text) => {
    if (err) {
      console.error(err);
      return;
    } else {
      story = ''
      // The max length of image generation API is 400 that is why the chatGPT response has to be less than 400
      text = 'Can you make one paragraph maximum length 200 story from the food options that can be prepared from these ingredients: ' + text;
      // console.log(typeof (text))
      data = await getGPTResponse(text)
      console.log(data)
      fs.writeFile("./recepie.txt", data, (err) => {
        if (err)
          console.log(err);
        else {
          console.log(data.length + '  length story has been written in txt file')

          myCallback(data)

        }


      })

    }


  })

}



async function createFoodImage(text) {

  //  Prompt must be length 1000 or less while using DALL-E for image generation
  if (text.length > 1000) {
    text = text.substring(0, 1000)

  }

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
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}


// Used Call Back Functions to wait chatGPT response generation from the ingradiances. Then image has been created accordingly.

getGPTRecepie(createFoodImage)


async function getGPTResponse(text) {
  const completion = await openai.chat.completions.create({
    messages: [{
      role: "system",

      content: text
    }],
    model: "gpt-3.5-turbo",
  });

  // console.log(completion.choices[0]);
  return completion.choices[0].message.content
}


