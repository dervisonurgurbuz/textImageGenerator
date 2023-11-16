const { OpenAI } = require('openai');

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
  });

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", 
    
    content:' what can be prepared from these ingrediances in one sentance: 2 ¾ cups all-purpose flour, 1 teaspoon baking soda, ½ teaspoon baking powder, 1 cup butter, softened, 1 ½ cups white sugar, 1 egg, 1 teaspoon vanilla extract'
    }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();