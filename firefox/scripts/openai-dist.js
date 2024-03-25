const SYSTEM_PROMPT = ""; // e.g. "You are a browser extension used to analyse websites and extract information quickly for users. You must be helpful to the user, telling them when information isn't available on the web page or that they might find better information on a different web page linked to this one. Take a look at the following website:"
const OPENAI_TOKEN = ""; // e.g. "sk-xx..."
const OPENAI_MODEL = ""; // e.g. "gpt-3.5-turbo-16k"
const COMPLETIONS_ENDPOINT = "https://api.openai.com/v1/chat/completions";

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "same-origin",
        headers: {
            "Authorization": `Bearer ${OPENAI_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function makeLLMRequest() {
    const COMPLETIONS_ENDPOINT = "https://api.openai.com/v1/chat/completions";
    const data = {
        "model": `${OPENAI_MODEL}`,
        "messages": getMessagesFromStorage()
    };
    await postData(COMPLETIONS_ENDPOINT, data).then((response) => {
        let responseText = "";
        try {
            responseText = response["choices"][0]["message"]["content"];
            if (!responseText) {
                throw new Error();
            }
        } catch (error) {
            responseText = "I had some trouble getting a response to that. Please wait a moment then try again.";
        }
        sendBotMessage(responseText);
        addMessageToStorage(responseText, "assistant");
    });
}