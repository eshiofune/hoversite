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

function getBodyText(useOnlyText = true) {
    // if useOnlyText is true, only send the text on this page to the LLM. otherwise, send the entire HTML source code.
    const tags = document.getElementsByTagName("html");
    // what html code is used for the "Generate" button?
    return useOnlyText ? tags[0].innerText : tags[0].innerHTML;
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
    await makeLLMRequest();
}

async function onSendMessageClicked() {
    const userInput = document.getElementById("userMessage");
    const message = userInput.value;
    userInput.value = "";
    userInput.focus();
    await sendUserMessage(message);
}

function runStartUp() {
    document.getElementById("userMessage").addEventListener("keypress", async function (e) {
        if (e.key.toLowerCase() === "enter") {
            await onSendMessageClicked();
        }
    });
    document.getElementById("sendMessageBtn").addEventListener("click", onSendMessageClicked);
}