# HoverSite Browser Extension Documentation

This document details the setup, functionality, and code structure of HoverSite, enabling developers and contributors to understand and work with the project effectively.

## Getting Started

### Prerequisites

- Google Chrome Browser
- Basic knowledge of JavaScript and the Chrome Extension API

### Installation

1. Clone the HoverSite repository to your local machine.
1. Copy the file `openai-dist.js` to a new file called `openai.js` and provide values for the variables `SYSTEM_PROMPT`, `OPENAI_TOKEN`, and `OPENAI_MODEL`.
1. Open the Chrome browser and navigate to `chrome://extensions/`.
1. Enable "Developer mode" at the top right.
1. Click on "Load unpacked" and select the HoverSite directory.

The extension should now be installed and visible in your extensions list. Feel free to pin it for easier access.

## File Structure

HoverSite's core functionality is split across several JavaScript files and an HTML file that makes up the user interface. Below is a brief overview of each file and its purpose.

### `chrome/manifest.json`

Defines metadata, permissions, and settings for the extension. It sets up the extension name, version, permissions required (such as `webNavigation`, `scripting`, `activeTab`, and `tabs`), and the entry point (`index.html`).

### `chrome/index.html`

Serves as the popup interface for the extension.

### `chrome/scripts/browserSpecific.js`

Contains functions for interacting directly with the Chrome tabs and scripting APIs:

- `getCurrentTab()`: Fetches the currently active tab.
- `getDocumentText(tabId)`: Extracts the text content of a webpage, either the current or specified by `tabId`.
- An event listener to detect when a tab's URL changes, triggering `getDocumentText()`.

### `chrome/scripts/openai-dist.js`

Handles communication with OpenAI's API, including:

- Setting up constants for API interaction (`SYSTEM_PROMPT`, `OPENAI_TOKEN`, `OPENAI_MODEL`, `COMPLETIONS_ENDPOINT`).
- `postData()`: Generic function to POST data to any URL.
- `makeLLMRequest()`: Sends collected messages to the OpenAI API and processes responses.

Note that this should be copied to `chrome/scripts/openai.js` for the extension to work.

### `chrome/scripts/popup.js`

Manages the popup UI and its interactions:

- Functions to manipulate messages in local storage (`addMessageToStorage()`, `getMessagesFromStorage()`).
- `getBodyText()`: Gets the text or HTML content of the current webpage.
- Messaging functions to update the chat UI (`sendMessage()`, `sendBotMessage()`, `sendUserMessage()`).
- Event listeners to run whenever the extension is activated (`runStartUp()`).

## Usage

Once installed, the HoverSite extension icon will appear in your browser's toolbar. Clicking on this icon will open the chat interface. From here, users can type questions or commands, which the extension will process to provide relevant information extracted from the current webpage or through external analysis facilitated by the OpenAI API.

## Development Notes

- Ensure that the `OPENAI_TOKEN` in `chrome/scripts/openai.js` is set to a valid API key from OpenAI.
- Modify `SYSTEM_PROMPT` to customise the behaviour of the bot.
- To extend functionality or integrate additional APIs, adjust the scripts in `chrome/scripts/` accordingly.