# Cacao Supply Chain Website

This website provides information about the cacao supply chain, from farming to distribution. It includes an interactive chat bot that can answer questions about cacao and the supply chain.

## Features

- Responsive design that works on desktop and mobile devices
- Interactive map showing global cacao production locations
- Animated supply chain steps
- Chat bot assistant for answering questions about cacao

## Chat Bot

The website includes a chat bot in the bottom right corner that can answer questions about:
- Cacao farming and production
- The cacao supply chain process
- Challenges in the cacao industry
- Innovations and improvements in the industry

## Development

This website is built with HTML, CSS, and JavaScript, and is configured to work with GitHub Pages using Jekyll.

### Local Development

There are two ways to run this site locally:

#### Option 1: Using Jekyll (Recommended for GitHub Pages)

1. Make sure you have Ruby and Bundler installed
2. Clone this repository
3. Navigate to the project directory
4. Run `bundle install` to install dependencies
5. Run `bundle exec jekyll serve` to start the local server
6. Visit `http://localhost:4000/cacao-Supplychain/` in your browser

#### Option 2: Direct HTML (Quick Testing)

For quick testing without Jekyll:

1. Clone this repository
2. Navigate to the project directory
3. Open `local-index.html` directly in your browser

### GitHub Pages Deployment

This site is configured to be deployed on GitHub Pages. When pushing to the main branch, GitHub will automatically build and deploy the site.

## Chat Bot API Integration

The chat bot is designed to integrate with the OpenWebUI API. For demonstration purposes, it currently uses simulated responses. To connect to the actual API:

1. Obtain an API key from OpenWebUI
2. Uncomment the API call code in `script.js`
3. Replace `YOUR_API_KEY` with your actual API key

## License

This project is for educational purposes only.
