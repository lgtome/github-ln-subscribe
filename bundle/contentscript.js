const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null")
    return v
}

function injectCode(src) {
    const script = document.createElement('script')
    // This is why it works!
    script.src = src
    script.onload = function () {
        this.remove()
    }

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script)
}

injectCode(chrome.runtime.getURL('/myscript.js'))

const config = { attributes: true, childList: true, subtree: true }
let GLOBAL_LIST
const mutationObserverCallback = function (mutationsList, observer) {
    unSubscribe()
    GLOBAL_LIST = linkedInGetButtonsList()
    subscribe(linkedInGetButtonsList())
}
const observer = new MutationObserver(mutationObserverCallback)

awaitLoadDocument()

function EventEmitter() {
    const list = []

    return {
        subscribe(cb, id) {
            list.push({ callback: cb, id })
        },
        emit() {
            list.forEach(({ callback, id }) => {
                callback()
            })
        },
        unSubscribe(id) {
            const childIndex = list.indexOf((el) => el.id === id)
            if (~childIndex) {
                list.splice(childIndex, 1)
            }
        },
    }
}
const eventEmitter = EventEmitter()

function awaitLoadDocument() {
    const list = document.querySelectorAll('input[value="Follow"]')
    let intervalId
    let counter = 0
    GLOBAL_LIST = list
    subscribe()
    intervalId = setInterval(() => {
        const linkedInList = linkedInGetButtonsList()
        counter++
        if (counter >= 10) clearInterval(intervalId)
        if (!!Array.from(linkedInList).length) {
            GLOBAL_LIST = linkedInList
            clearInterval(intervalId)
            subscribe(linkedInList)
            chrome.storage.local.set({ host: window.location.host })
            const ul =
                document.querySelector(
                    '.discover-fluid-entity-list.discover-fluid-entity-list--default-width-cards'
                ) || false
            eventEmitter.subscribe(() => {
                if (ul) {
                    observer.observe(ul, config)
                }
            }, 1)
            setTimeout(() => {
                eventEmitter.emit()
            }, 100)
        }
    }, 2000)
}
function linkedInGetButtonsList() {
    const lnList = document.querySelectorAll('button[aria-label^="Invite"]')
    return lnList
}
function emitClick(nodeList) {
    nodeList.forEach((node) => node.click())
}
function DEPRECATED_HANDLER(list) {
    return (changes, namespace) => {
        if (changes.isClicked?.newValue?.value) {
            emitClick(list)
            chrome.storage.local.set({ isClicked: { value: false } })
        }
    }
}
function handler(changes, namespace) {
    if (changes.isClicked?.newValue?.value) {
        //TODO: add location
        emitClick(GLOBAL_LIST)
        chrome.storage.local.set({ isClicked: { value: false } })
    }
}

function subscribe() {
    chrome.storage.onChanged.addListener(handler)
}
function unSubscribe() {
    chrome.storage.onChanged.removeListener(handler)
}
