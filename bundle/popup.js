const btn = document.getElementById('subscribe')

console.log(btn)

btn.addEventListener('click', () => {
    chrome.storage.local.get('host', (value) => {
        chrome.storage.local.set({
            isClicked: { value: Math.random(), host: value?.host },
        })
    })
})
