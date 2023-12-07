# HoverSite

An interactive browser extension that uses the OpenAI GPT API to summarise and answer questions on whatever webpage you're on. It helps cut down time spent searching for information.

Tests I've run:
- summarizing a Twitter post
- asking questions on a research article
- asking a question on a recipe page
- quickly retrieving the solution to a coding issue on GitHub.

## Setup - Chrome

After cloning this repo to your computer:

1. Go to `hoversite/chrome/scripts/` and copy `openai-dist.js` to `openai.js`. Fill in the values for `SYSTEM_PROMPT`, `OPENAI_TOKEN`, and `OPENAI_MODEL` (examples have been provided). You can get your `OPENAI_TOKEN` by [creating an OpenAI account](https://platform.openai.com/signup) and then [creating a secret key](https://platform.openai.com/api-keys).

1. Open the extension page in Google Chrome: type `chrome://extensions` in the url bar and press enter.

1. Switch on "Developer mode".

1. Click the "Load unpacked" button and select the Chrome extension folder (hoversite/chrome).

1. Go to Extensions in the browser and select HoverSite to start using it!

## Firefox

Unfortunately, based on my research, Firefox does not currently allow extensions to load URLs and as such, this extension would not be able to request data from the OpenAI API. I am happy to be proven wrong though, so feel free to fork this repo and shoot a PR if you're able to get the openai.js functions working.
