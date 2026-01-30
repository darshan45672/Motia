import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'

// Load environment variables
config()

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

async function listAvailableModels() {
  try {
    console.log('Fetching available models...\n')
    console.log('API Key:', process.env.GOOGLE_API_KEY?.substring(0, 10) + '...\n')
    
    // Try to list models using the API
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('Available models:')
    console.log('================\n')
    
    if (data.models && Array.isArray(data.models)) {
      data.models.forEach((model: any) => {
        console.log(`Model: ${model.name}`)
        console.log(`  Display Name: ${model.displayName}`)
        console.log(`  Description: ${model.description}`)
        console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ')}`)
        console.log()
      })
      
      // Filter models that support generateContent
      const contentGenerationModels = data.models.filter((model: any) => 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      
      console.log('\nModels that support generateContent:')
      console.log('====================================')
      contentGenerationModels.forEach((model: any) => {
        const modelId = model.name.replace('models/', '')
        console.log(`  - ${modelId}`)
      })
      
      if (contentGenerationModels.length > 0) {
        const recommendedModel = contentGenerationModels[0].name.replace('models/', '')
        console.log(`\n✅ Recommended model to use: ${recommendedModel}`)
      }
    } else {
      console.log('No models found or unexpected response format')
      console.log('Response:', JSON.stringify(data, null, 2))
    }
    
  } catch (error: any) {
    console.error('Error fetching models:', error.message)
    if (error.response) {
      console.error('Response:', await error.response.text())
    }
  }
}

listAvailableModels()
