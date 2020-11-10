<script>
    export let fontSize
    export let activeEntry = {}
    export let entryContentRsp = {}

    import { truncateStr, isMac, isWin, captureWindow, toast, copyToClipboard } from '../utils/helper.js'
    import Podcast from './Podcast.svelte'
    import Notice from '../global/Notice.svelte'

    const Prism = require('prismjs')
    const { remote } = require('electron')
    const { shell, clipboard } = require('electron')
    const { Menu, MenuItem } = remote
    
    let qrcode
    const qrcodeSize = 280

    import { onMount, afterUpdate } from 'svelte';

    onMount(() => {
        qrcode = new QRCode(document.getElementById("omr-qrcode"), {
            width: qrcodeSize,
            height: qrcodeSize,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.L
        })
    })

    afterUpdate(() => {
        if (entryContentRsp.code !== -1 && entryContentRsp.content && activeEntry.id ) {
            // highlight code
            console.log('Highlight code')
            if (document.querySelector('#omr-post-third-html pre[class*="language-"]') !== null 
                || document.querySelector('#omr-post-third-html code[class*="language-"]') !== null) {
                Prism.highlightAll()
            } else {
                document.querySelectorAll('#omr-post-third-html pre > code').forEach((block) => {
                    hljs.highlightBlock(block)
                })
            }
        }
	});

    function showPostCtxMenu(event) {
        const hasText = window.getSelection().toString().trim().length > 0
        const truncateText = truncateStr(window.getSelection().toString().trim(), 20)

        const menu = new Menu()

        menu.append(new MenuItem({
            label: `🔍  Search "${truncateText}" with Google`,
            visible: hasText,
            click: function(){
                const url = new URL('https://www.google.com/search');
                url.searchParams.set('q', window.getSelection().toString());
                shell.openExternal(url.toString());
            }
        }));
        menu.append(new MenuItem({
            label: `📗  Look Up "${truncateText}"`,
            visible: hasText && isMac(),
            click: function(){
                remote.getCurrentWindow().showDefinitionForSelection()
            }
        }));
        menu.append(new MenuItem({
            visible: isMac() && hasText,
            label: "🔊  Speaking",
            submenu: [
                {"role": "startSpeaking"},
                {"role": "stopSpeaking"},
            ]
        }));

        // role and separator are not affected by visible attribute
        if (hasText) {
            menu.append(new MenuItem({
                label: "📋  Copy",
                role: "copy"
            }));
            menu.append(new MenuItem({type: "separator", visible: hasText}));
        }

        menu.append(new MenuItem({
            label: "🔗  Copy Link",
            click: function() {
                copyToClipboard(activeEntry.link)
            }
        }));
        menu.append(new MenuItem({type: "separator"}));
        
        menu.append(new MenuItem({
            label: "🧭  Open in Browser",
            click: function(){
                shell.openExternal(activeEntry.link);
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        menu.append(new MenuItem({
            label: "📲  QR Code",
            click: function() {
                qrcode.clear()
                qrcode.makeCode(activeEntry.link);

                const instanse = M.Modal.init(document.querySelector('#omr-modal-qrcode'), {
                    inDuration: 0,
                    outDuration: 0,
                    opacity: 1,
                    endingTop:  window.outerHeight / 2 - qrcodeSize / 2 + "px"
                });
                document.querySelector('#omr-modal-qrcode').style.width = `${qrcodeSize}px`
                document.querySelector('#omr-modal-qrcode').style.height = `${qrcodeSize}px`
                document.querySelector('#omr-modal-qrcode').style.left = (window.outerWidth - 470) / 2 + 470 - qrcodeSize / 2 + 'px'
                instanse.open()
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        menu.append(new MenuItem({
            label: "📸  Screenshot",
            click: function(){
                captureWindow()
            }
        }));

        menu.popup({ window: remote.getCurrentWindow() })
    }

    function allowDrop(event) {
        event.preventDefault();
    }
</script>

<style>
    #omr-post-third-html {
        padding: 4px 14px 6px 24px;
        overflow-y: auto;
        height: 100%;
    }
    #omr-modal-qrcode {
        padding: 16px;
        margin: 0;
    }
</style>

{#if entryContentRsp.code === -1}
    <!-- error -->
    <Notice level='warn' msg={ entryContentRsp.msg }  />
{:else if Object.keys(entryContentRsp).length === 0}
    <!-- loading -->
    <Notice />
{:else}
    <!-- success -->
    <div class="flow-text {fontSize}" id="omr-post-third-html" on:contextmenu={showPostCtxMenu} on:dragover={allowDrop}>
        <Podcast episode={ entryContentRsp.episode } />

        <article>
            { @html entryContentRsp.content }
        </article>
    </div>
{/if}

<div class="modal" id="omr-modal-qrcode">
    <div id="omr-qrcode"></div>
</div>
