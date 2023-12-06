const SYSTEM_PROMPT = `You are a browser extension used to analyse websites and extract information quickly for users. When a user asks you a question, you need to scan through the website source code which will be provided, and answer the question as briefly and accurately as you can, never going beyond 3 sentences. You must be helpful to the user, telling them when information isn't available on the web page or that they might find better information on a different web page linked to this one. For example, if the user is on the home page of a website and asks a question about the privacy policy, but there is no such information on the home page, you should ask the user to visit the privacy policy page instead (as long as that page is linked). However if there is no linked page that might answer the user's question, you should tell the user there is no information on the page that can help you answer their question. Now you are going to be provided with a web page source code and the user's query. Keep to the above guidelines. Take a look at the following website:`;

function addMessageToStorage(message, role) {
    const messageStructure = {
        "role": role,
        "content": message
    };
    let queue = JSON.parse(localStorage.getItem("queue")) ?? [];
    if (queue.length > 10) {
        const newQueue = [{
            "role": "system",
            "content": `${SYSTEM_PROMPT} ${localStorage.getItem("pageText")}.`
        }];
        queue = newQueue.concat(queue.slice(queue.length - 4));
    }
    queue.push(messageStructure);
    localStorage.setItem("queue", JSON.stringify(queue));
}

function getMessagesFromStorage() {
    return JSON.parse(localStorage.getItem("queue"));
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "same-origin",
        headers: {
            "Authorization": "Bearer token",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function getBodyText() {
    let tags = document.getElementsByTagName("body");
    return tags[0].innerText;
}

async function makeOpenAIRequest(message) {
    const COMPLETIONS_ENDPOINT = "https://api.openai.com/v1/chat/completions";
    const data = {
        "model": "gpt-4",
        "messages": getMessagesFromStorage()
    };
    await postData(COMPLETIONS_ENDPOINT, data).then((response) => {
        let responseText = "";
        try {
            responseText = response["choices"][0]["message"]["content"];
        } catch (error) {
            responseText = "I had some trouble getting a response to that. Please wait a moment then try again.";
        }
        sendBotMessage(responseText);
        addMessageToStorage(responseText, "assistant");
    });
}

async function getDocumentText(tabId) {
    const tab = await getCurrentTab();
    chrome.scripting
        .executeScript({
            target: { tabId: tabId ? tabId : tab.id, allFrames: false },
            func: getBodyText,
        })
        .then(async (injectionResults) => {
            const pageText = injectionResults[0]["result"];
            localStorage.setItem("pageText", pageText);
            localStorage.removeItem("queue");
            addMessageToStorage(`${SYSTEM_PROMPT} ${pageText}.`, "system");
        });
}

function sendMessage(message, divClass) {
    const divElem = document.createElement("div");
    divElem.setAttribute("class", divClass);
    const pElem = document.createElement("p");
    pElem.innerText = message;
    const spanElem = document.createElement("span");
    const date = new Date();
    spanElem.innerText = date.toLocaleTimeString();
    divElem.appendChild(pElem);
    divElem.appendChild(spanElem);
    document.getElementById("chatBoxBody").appendChild(divElem);
    document.getElementById("chatBoxBody").scrollTop = document.getElementById("chatBoxBody").scrollHeight;
}

function sendBotMessage(message) {
    sendMessage(message, "chat-box-body-receive");
}

async function sendUserMessage(message) {
    sendMessage(message, "chat-box-body-send");
    sendBotMessage("Thinking...");
    addMessageToStorage(message, "user");
    await makeOpenAIRequest(message);
}

getDocumentText();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url) {
        getDocumentText(tabId);
    }
});