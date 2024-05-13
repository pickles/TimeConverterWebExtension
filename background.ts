export {}

console.log("Hello world from background script");

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Hello world",
        contexts: ["selection"],
        id: "myIdIsSoCool"
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
});
