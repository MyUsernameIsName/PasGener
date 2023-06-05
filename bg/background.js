chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, '')
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        'passwordLength':  14,
        'specSymbol': true,
        'hardSpecSymbol': false,
        'superHardSpecSymbol': false,
        'similarSymbol': true
    })

    chrome.contextMenus.create({
        'title': 'insert password',
        'contexts': ['editable'],
        'id': 'insertPassword'
    })
})