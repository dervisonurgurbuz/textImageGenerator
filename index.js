const { OpenAI } = require('openai');
const fs  = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

fs.readFile('./poem.txt', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);


async function dalleGenerateImage(text) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: 'Say this is a test' }],
//     model: 'gpt-3.5-turbo',
//   });

//   console.log(chatCompletion.choices);


const image = await openai.images.generate({ prompt: text });

console.log(image.data);

}
//dalleGenerateImage(data);

});