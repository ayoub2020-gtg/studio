'use server';

/**
 * @fileOverview An AI agent for generating product images based on product name and description.
 *
 * - generateProductImage - A function that generates a product image.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image URL in data URI format.'),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;

export async function generateProductImage(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImagePrompt = ai.definePrompt({
  name: 'generateProductImagePrompt',
  input: {schema: GenerateProductImageInputSchema},
  output: {schema: GenerateProductImageOutputSchema},
  prompt: `Generate a realistic image of a product based on the following information:\n\nProduct Name: {{{productName}}}\nProduct Description: {{{productDescription}}}\n\nThe image should be suitable for use in an online inventory system and should visually represent the product accurately.\n\nEnsure the image is high quality and visually appealing, with good lighting and composition.`, 
});

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an image of ${input.productName}, described as ${input.productDescription}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image.');
    }

    return {imageUrl: media.url};
  }
);
