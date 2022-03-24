const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null")
    return v
}

function injectCode(src) {
    const script = document.createElement('script')
    // This is why it works!
    script.src = src
    script.onload = function () {
        console.log('script injected')
        this.remove()
    }

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script)
}

injectCode(chrome.runtime.getURL('/myscript.js'))

const config = { attributes: true, childList: true, subtree: true }

function EventEmitter() {
    const list = []

    return {
        subscribe(cb, id) {
            list.push({ callback: cb, id })
            console.log(list, 'event emitter list')
        },
        emit() {
            list.forEach(({ callback, id }) => {
                callback()
            })
            console.log(list, 'event emitter list EMIT METHOD')
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

const mutationObserverCallback = function (mutationsList, observer) {
    unSubscribe()
    console.log(linkedInGetButtonsList())
    subscribe(linkedInGetButtonsList())
}
const observer = new MutationObserver(mutationObserverCallback)

const list = document.querySelectorAll('input[value="Follow"]')
let LINKED_IN_NODE_LIST
awaitLoadDocument()
subscribe(list)
function awaitLoadDocument() {
    let intervalId
    intervalId = setInterval(() => {
        const linkedInList = linkedInGetButtonsList()
        if (!!Array.from(linkedInList).length) {
            console.log('hello from interval')
            clearInterval(intervalId)
            subscribe(linkedInList)
            chrome.storage.local.set({ host: window.location.host })
            const ul = document.querySelector(
                '.discover-fluid-entity-list.discover-fluid-entity-list--default-width-cards'
            )
            eventEmitter.subscribe(() => {
                observer.observe(ul, config)
            }, 1)
            setTimeout(() => {
                console.log('timeout work')
                eventEmitter.emit()
            })
            // const seeAllButton = document.querySelector(
            //     'button[aria-label^="See all"'
            // )
            // seeAllButton.addEventListener('click', () => {
            //     let timeoutId
            //     timeoutId = setTimeout(() => {
            //         LINKED_IN_NODE_LIST = linkedInGetButtonsList()
            //         const ul = document.querySelector(
            //             '.discover-fluid-entity-list.discover-fluid-entity-list--default-width-cards'
            //         )
            //         observer.observe(ul, config)
            //         clearTimeout(timeoutId)
            //     }, 2000)
            // })
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
function handler(list) {
    return (changes, namespace) => {
        if (changes.isClicked?.newValue?.value) {
            emitClick(list)
            chrome.storage.local.set({ isClicked: { value: false } })
        }
    }
}
function subscribe(list) {
    chrome.storage.onChanged.addListener(handler(list))
}
function unSubscribe() {
    chrome.storage.onChanged.removeListener(handler())
}
