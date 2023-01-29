// ==UserScript==
// @name         Nanote
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Nanote search tools 帮助打开本地收藏的书签, 快速搜索内容
// @author       Nickel
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=segmentfault.com
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.js
// ==/UserScript==

(function () {
    'use strict';
    // load jquery modal css file
    $("<link>").attr({
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.bootcdn.net/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.css'
    }).appendTo("head")

    // custom template
    const template = `<div id="nanote-tool">
    <div>
        <input type="text" id="input"/>
        <button type="button" id="button">
            <svg viewBox="0 0 1024 1024"xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M1005.312 914.752l-198.528-198.464A448 448 0 1 0 0 448a448 448 0 0 0 716.288 358.784l198.4 198.4a64 64 0 1 0 90.624-90.432zM448 767.936A320 320 0 1 1 448 128a320 320 0 0 1 0 640z" fill="#1296db"></path></svg>
        </button>
    </div>
</div>`
    const style = `<style>
    body > .jquery-modal {
        z-index: 100;
    }
    #nanote-tool {
        position: fixed;
        top: 25vh;
        left: 36vw;
        font-size: 20px;
        display: none;
        max-width: 28vw;
    }

    #nanote-tool #input {
        width: 20vw;
        height: 37px;
        font-size: inherit;
        padding: 0 15px;
        margin-right: 10px;
    }

    #nanote-tool #button {
        line-height: 10px;
        width: 4vw;
        height: 40px;
        font-size: inherit;
    }
    
    #nanote-tool > div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>`

    $(template).appendTo('body')
    $(style).appendTo('head')

    window.onkeydown = (event) => {
        // Alt + K
        if (event.altKey && event.code === 'KeyK') {
            $('#nanote-tool').modal({
                showClose: false
            })
            $("#nanote-tool #input").focus()
        }
    }
})();