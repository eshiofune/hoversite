async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await browser.tabs.query(queryOptions);
    return tab;
}

async function getDocumentText(tabId) {
    const tab = await getCurrentTab();
    browser.scripting
        .executeScript({
            target: { tabId: tabId ? tabId : tab.id, allFrames: false },
            func: getBodyText,
        })
        .then(async (injectionResults) => {
            runStartUp();
            const pageText = injectionResults[0]["result"];
            localStorage.setItem("pageText", pageText);
            localStorage.removeItem("queue");
            addMessageToStorage(`${SYSTEM_PROMPT} ${pageText}.`, "system");
        });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url) {
        getDocumentText(tabId);
    }
});

getDocumentText();