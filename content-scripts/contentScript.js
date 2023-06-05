const mutationObserver = new MutationObserver(setInputProperty)
mutationObserver.observe(document.body, {
    subtree: true,
    childList: true
})

function setInputProperty() {
    let passwordInput = document.querySelector('input[type="password"]')
    if (passwordInput !== null) {
        passwordInput.style.setProperty('background-image',
            'url(' + chrome.runtime.getURL('icons/keyIcon16.png') + ')', 'important')
        passwordInput.style.backgroundRepeat = 'no-repeat'
        passwordInput.style.backgroundPosition = '96.5%'

        passwordInput.addEventListener('mousemove', mouseMoveOverIcon)
        passwordInput.addEventListener('click', insertPasswordByClick)
    }
}
setTimeout(() => {
    setInputProperty()
}, 2000)

function isOverIcon(e) {
    return (e.clientX - e.target.getBoundingClientRect().left) > (0.965 * window.getComputedStyle(e.target).width.slice(0, -2) - 20)
}

function mouseMoveOverIcon(e) {
    if (isOverIcon(e)) {
        e.target.style.cursor = 'pointer'
    } else {
        e.target.style.cursor = 'auto'
    }
}

function insertPasswordByContestMenus(password) {
    let input = document.activeElement
    input.value = password
    input.dispatchEvent(new Event('input', { bubbles: true }))
    navigator.clipboard.writeText(password)
}

function insertPasswordByClick (e){
    if (isOverIcon(e)) {
        generatePassword().then((password) => {
            console.log(password)
            let input = e.target
            input.value = password
            input.dispatchEvent(new Event('input', { bubbles: true }))
            navigator.clipboard.writeText(password)
        })
    }
}

chrome.runtime.onMessage.addListener(() => {
    generatePassword().then((password) => insertPasswordByContestMenus(password))
})

async function generatePassword() {
    let password
    await Promise.all([chrome.storage.local.get('passwordLength'),
        chrome.storage.local.get('specSymbol'),
        chrome.storage.local.get('hardSpecSymbol'),
        chrome.storage.local.get('superHardSpecSymbol'),
        chrome.storage.local.get('similarSymbol')]).then(result => {


        let alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        if (result[1].specSymbol) {
            alphabet += '!$%()*?@~'
        }
        if (result[2].hardSpecSymbol) {
            alphabet += '"#&\'+,-./:;<=>[\\]^_`{|}'
        }
        if (result[3].superHardSpecSymbol) {
            alphabet += ' '
        }
        if (result[4].similarSymbol) {
            alphabet = alphabet.replaceAll(/['`0oO1lI|]/g, '')
        }

        let flag
        do {
            password = ''
            let index = new Int8Array(1)
            let i = 0
            while (i < result[0].passwordLength) {
                crypto.getRandomValues(index)
                let char = alphabet[index]
                if (char !== undefined) {
                    password += char
                    i++
                }
            }
            if (result[1].specSymbol) {
                flag = /[!$%()*?@~]/.test(password)
            }
            if (result[2].hardSpecSymbol) {
                flag = /["#&'+,-.\/:;<=>[\]^_`{|}]/.test(password)
            }
            if (result[3].superHardSpecSymbol) {
                flag = /[ ]/.test(password)
            }
        } while (!flag)
    })
    return password
}