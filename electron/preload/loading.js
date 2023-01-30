/**
 * 加载动画来源
 * Loading Animation Source Code
 * https://codepen.io/Sirop/pen/noRgZm
 */

function domReady(condition) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

const safeDOM = {
    append(parent, child) {
        if (!Array.from(parent.children).find(e => e === child)) {
            return parent.appendChild(child)
        }
    },
    remove(parent, child) {
        if (Array.from(parent.children).find(e => e === child)) {
            return parent.removeChild(child)
        }
    }
}

function useLoading() {
    const css_link = document.createElement('link')
    css_link.rel = 'stylesheet'
    css_link.href = '/loading.css'
    const div = document.createElement('div')
    div.className = 'loading'
    div.innerHTML = `<span>NANOTE</span>`
    return {
        appendLoading() {
            safeDOM.append(document.head, css_link)
            safeDOM.append(document.body, div)
        },
        removeLoading() {
            safeDOM.remove(document.head, css_link)
            safeDOM.remove(document.body, div)
        }
    }
}

const {appendLoading, removeLoading} = useLoading()
domReady(['complete', 'interactive']).then(appendLoading)

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 5000)