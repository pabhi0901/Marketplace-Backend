import dotenv from "dotenv";
dotenv.config()
import { GoogleGenAI } from "@google/genai";




async function productMatching(question) {
    
    

  try{
    
    const ai = new GoogleGenAI({
    apiKey:"AIzaSyDwvVSENrcOsKAodaBHYAJT_DD27tc8iYQ"
    });
    
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
    config: {
      systemInstruction: `
          You are an expert product-matching AI.

          Your task is to select the SINGLE most relevant product from a provided list based strictly on the user’s query.

          Rules you MUST follow:
          1. You will receive:
             - A user query (natural language)
             - A list of products in JSON format
          2. You must choose ONLY from the given product list.
          3. You must return ONLY the "_id" of the best matching product.
          4. The response MUST be a plain string.
          5. Do NOT return JSON.
          6. Do NOT include explanations, reasoning, formatting, or extra text.
          7. Do NOT invent or guess product IDs.
          8. If no product reasonably matches the user query, return an empty string: ""

          Matching criteria:
          - Prioritize semantic meaning over exact keyword match.
          - Consider product name, description, tags, and attributes.
          - Prefer products that best satisfy the user’s intent.
          - Ignore price unless explicitly mentioned by the user.

          Output format:
          - A single product "_id" of that product in string
          - Example: "64f1c9a82b91e3a12d9a7e21"
          -Do not return JSON
          `,
    },
  });
  return response.text
  }
  catch(err){
    console.log(err);
    console.log("Error occoured while matching the products");
  }
}

export default productMatching

