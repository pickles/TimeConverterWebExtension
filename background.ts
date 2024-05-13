import { Storage } from "@plasmohq/storage";

console.log("Hello world from background script");

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "DateTime Converter",
        contexts: ["selection"],
        id: "page.memo.DateTimeConverter.root"
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log(info);
});
