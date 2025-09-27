# AI Features Setup Guide

This guide will help you set up the AI features in your NotesAI application using OpenAI's API.

## Prerequisites

1. **OpenAI Account**: You need an OpenAI account with API access
2. **API Key**: Generate an API key from OpenAI's platform

## Setup Steps

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the generated API key (starts with `sk-`)

### 2. Configure Environment Variables

1. Copy the `.env` file from `env.template`:
   ```bash
   cp env.template .env
   ```

2. Add your OpenAI API key to the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Restart Development Server

After adding the API key, restart your development server:
```bash
npm run dev
```

## AI Features Available

### 1. AI Summary
- Generates a 1-2 line summary of your note
- Provides key points extracted from the content
- Uses GPT-3.5-turbo for analysis

### 2. Suggested Tags
- Analyzes note content to suggest relevant tags
- Returns 3-5 tags with confidence scores
- Helps with note organization and searchability

### 3. Grammar Check
- Identifies grammatical errors in your text
- Provides suggestions for corrections
- Highlights errors with red underlines
- Shows hover tooltips with suggestions

### 4. Auto Glossary Highlighting
- Identifies key terms and concepts in your notes
- Highlights terms with yellow background
- Shows definitions on hover
- Helps with understanding technical content

## Usage

1. Open any note in the NoteDetailsPage
2. Click the "AI Features" button to open the AI panel
3. Click on any of the four AI feature buttons:
   - **AI Summary**: Get a summary and key points
   - **Suggested Tags**: Generate relevant tags
   - **Grammar Check**: Check for grammar errors
   - **Glossary**: Identify and highlight key terms

## Cost Considerations

- OpenAI API charges per token used
- GPT-3.5-turbo is cost-effective for most use cases
- Each AI feature call typically costs $0.001-0.005
- Monitor your usage in the OpenAI dashboard

## Fallback Behavior

If no API key is configured, the AI features will:
- Show mock data for demonstration
- Display appropriate error messages
- Allow you to test the UI without API costs

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Check that `VITE_OPENAI_API_KEY` is set in your `.env` file
   - Restart the development server after adding the key

2. **"API request failed" error**
   - Verify your API key is valid and has credits
   - Check your OpenAI account status
   - Ensure you have internet connectivity

3. **Slow response times**
   - This is normal for AI API calls (2-5 seconds)
   - Consider implementing caching for better UX

### Support

For issues with:
- **OpenAI API**: Check [OpenAI Documentation](https://platform.openai.com/docs)
- **Application**: Check the browser console for error messages
- **Setup**: Verify your environment variables are correctly configured

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure and don't share it
- Consider implementing rate limiting for production use
- Monitor API usage to prevent unexpected charges
