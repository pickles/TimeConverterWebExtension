export {}

console.log("Hello contents");
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("onMessage", message)
});
