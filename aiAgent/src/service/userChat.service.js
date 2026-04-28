import { GoogleGenAI } from "@google/genai";
import {tools,addToCartTool} from "../tools/addItemToCart.js"


async function talkWithBuddy(History,token) {

    try{

    const ai = new GoogleGenAI({
        apiKey:"AIzaSyDwvVSENrcOsKAodaBHYAJT_DD27tc8iYQ"
    });

    while (true) {


        const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:History,
        config: {
            systemInstruction:`You are a polite shopping assistant for an e-commerce cart system.

Your ONLY responsibility is to help users add products to their cart.

Rules:
- If the user mentions a product and quantity (explicitly or implicitly), extract the product name and quantity and call the provided add-to-cart tool.
- Always prefer calling the tool instead of replying in text when the intent is to add an item to the cart.
- After a successful tool call, respond briefly confirming the item was added.
-If internally you get a response that product not founded in cart then tell it to user this product (name of product here) currently unavailable,try again after some time.
Conversation limits:
- If the user greets you, greet them back politely in one short line.
- If the user makes small talk, respond briefly and redirect them to adding items.
- If the user asks anything unrelated to adding items to the cart, respond with a short refusal such as:
  "I can help with adding items to your cart. Please ask about a product 🙂"

Style:
- Keep responses short, clear, and polite.
- Use at most ONE emoji per response.
- Do not provide explanations, recommendations, or unrelated information.
- Do not answer questions outside cart operations.
            `,
            tools
        },
        });
        
        if (result.functionCalls && result.functionCalls.length > 0){
            console.log("Calling the function");
            
            const functionCall = result.functionCalls[0];
            const { name, args } = functionCall;
            
            const toolResponse = await addToCartTool(args,token)

             const functionResponsePart = {
            
                name: functionCall.name,
                response: {
                  result: toolResponse,
                },
            };

            History.push({
                role: "model",
                parts: [{functionCall: functionCall,},],
            });

            History.push({
                role: "user",
                parts: [
                  {
                    functionResponse: functionResponsePart,
                  },
                ],
            });            
        
        }
        else{
            console.log(result.text);
            
            return result.text
            
        }
    
    };
  
    

    }catch(err){
        console.log(err);
        return "Something went wrong"
        
    }
 
}

export default talkWithBuddy