chrome.action.onClicked.addListener(async (tab) => {
    if (/nnn\.ed\.nico\/courses\/\d+\/chapters\/\d+/.test(tab.url)) {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [ 'content.js' ]
        });
        const leaningURL = results[0].result;
        console.log(leaningURL,'なんでconsole.log使えないの？');
        chrome.tabs.update({url:leaningURL});
    }
});