const passwordLength = document.getElementById('passwordLength')
const specSymbol = document.getElementById('specSymbol')
const hardSpecSymbol = document.getElementById('hardSpecSymbol')
const superHardSpecSymbol = document.getElementById('superHardSpecSymbol')
const similarSymbol = document.getElementById('similarSymbol')
const hardSpecSymbolLabel = document.getElementById('hardSpecSymbolLabel')
const superHardSpecSymbolLabel = document.getElementById('superHardSpecSymbolLabel')
const similarSymbolLabel = document.getElementById('similarSymbolLabel')


chrome.storage.local.get(['passwordLength', 'specSymbol', 'hardSpecSymbol', 'superHardSpecSymbol', 'similarSymbol'], (result) => {
    passwordLength.value = result.passwordLength
    specSymbol.checked = result.specSymbol
    hardSpecSymbol.checked = result.hardSpecSymbol
    superHardSpecSymbol.checked = result.superHardSpecSymbol
    similarSymbol.checked = result.similarSymbol
    showSubmenu()
})

function showSubmenu() {
    if (specSymbol.checked) {
        hardSpecSymbolLabel.style.display = 'flex'
        if (hardSpecSymbol.checked) {
            superHardSpecSymbolLabel.style.display = 'flex'
            similarSymbolLabel.append(' | ` \'')
        } else {
            superHardSpecSymbolLabel.style.display = 'none'
            similarSymbolLabel.innerHTML = '&nbsp&nbspRemove similar symbols 0 O o 1 I l'
        }
    } else {
        hardSpecSymbolLabel.style.display = 'none'
        superHardSpecSymbolLabel.style.display = 'none'

    }
}


specSymbol.addEventListener('click', changeSpecInput)
hardSpecSymbolLabel.addEventListener('click', changeSpecInput)

function changeSpecInput() {
    showSubmenu()
    if (specSymbol.checked === false) {
        hardSpecSymbol.checked = false
        superHardSpecSymbol.checked = false
    }
    if (hardSpecSymbol.checked === false) {
        superHardSpecSymbol.checked = false
    }
}


const passwordLengthValue = document.getElementById('passwordLengthValue')
passwordLength.addEventListener('mousemove', showPasswordLengthValue)

function showPasswordLengthValue(e) {
    passwordLengthValue.style.visibility = 'visible'
    passwordLengthValue.innerText = Math.round(passwordLength.value)

    const passwordLengthLeftX = passwordLength.getBoundingClientRect().left
    const passwordLengthRightX = passwordLength.getBoundingClientRect().right
    const passwordLengthValueWidth = Number(window.getComputedStyle(passwordLengthValue).width.slice(0, -2))
    if (e.pageX < passwordLengthLeftX + passwordLengthValueWidth) {
        passwordLengthValue.style.left = passwordLengthLeftX + (passwordLengthValueWidth / 2) + 'px'
    } else if (e.pageX > passwordLengthRightX - (passwordLengthValueWidth / 2)) {
        passwordLengthValue.style.left = passwordLengthRightX - passwordLengthValueWidth + 'px'
    } else {
        passwordLengthValue.style.left = e.pageX - (passwordLengthValueWidth / 2) + 'px'
    }
}

passwordLength.addEventListener('mouseout', hidePasswordLengthValue)

function hidePasswordLengthValue() {
    passwordLengthValue.style.visibility = 'hidden'
}


const button = document.getElementById('saveSet')
button.addEventListener('click', saveSet)

function saveSet() {
    chrome.storage.local.set({
        'passwordLength': Math.round(passwordLength.value),
        'specSymbol': specSymbol.checked,
        'hardSpecSymbol': hardSpecSymbol.checked,
        'superHardSpecSymbol': superHardSpecSymbol.checked,
        'similarSymbol': similarSymbol.checked
    })

    const body = document.querySelector('body')
    const checkMark = document.createElement('div')

    checkMark.id = 'checkMark'
    body.appendChild(checkMark)
    checkMark.style.setProperty('background-image', 'url(' + chrome.runtime.getURL('icons/checkMarkIcon.png') + ')', 'important')
    checkMark.style.backgroundRepeat = 'no-repeat'
    checkMark.style.backgroundPosition = 'center'
}
