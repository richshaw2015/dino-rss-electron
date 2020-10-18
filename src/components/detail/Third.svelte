<script>
    import { toast } from '../utils/toast.js'
    import { truncateStr, isMac, isWin, closeWindow, captureWindow } from '../utils/helper.js'
    import Podcast from './Podcast.svelte'

    export let currentEntry
    export let fontSize
    export let thirdContent
    export let episodeInfo = {}
    const scrollStep = 60

    const { remote } = require('electron')
    const { shell, clipboard } = require('electron')
    const { Menu, MenuItem } = remote
    const Mousetrap = require('mousetrap');
    const Prism = require('prismjs');

    const qrcodeWidth = 256
    let qrcode

    import { statusMsg } from '../store/store.js'

    import { onMount, afterUpdate } from 'svelte';

    afterUpdate(() => {
        // highlight code
        // TODO add highlightjs support
        Prism.highlightAll()
        
        if (currentEntry) {
            statusMsg.set(currentEntry.link)
        }
        
        if (thirdContent) {
            document.querySelector('#omr-post-third-html').scrollTop = 0
        }
    });

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('j', function() {
            document.querySelector('#omr-post-third-html').scrollTop += scrollStep
            return false
        });
        Mousetrap.bind('d', function() {
            document.querySelector('#omr-post-third-html').scrollTop += 
                document.querySelector('#omr-post-third-html').offsetHeight / 2 - 20
            return false
        });

        Mousetrap.bind('k', function() {
            document.querySelector('#omr-post-third-html').scrollTop -= scrollStep
            return false
        });
        Mousetrap.bind('u', function() {
            document.querySelector('#omr-post-third-html').scrollTop -= 
                document.querySelector('#omr-post-third-html').offsetHeight / 2 - 20
            return false
        });

        Mousetrap.bind('g g', function() {
            document.querySelector('#omr-post-third-html').scrollTop = 0
            return false
        });
        Mousetrap.bind('G', function() {
            document.querySelector('#omr-post-third-html').scrollTop =
                document.querySelector('#omr-post-third-html').scrollHeight
            return false
        });
        Mousetrap.bind('space', function() {
            document.querySelector('#omr-post-third-html').scrollTop +=
                document.querySelector('#omr-post-third-html').offsetHeight - 40
            return false
        });

        Mousetrap.bind('x', function() {
            closeWindow()
        });
        Mousetrap.bind('y y', function() {
            clipboard.writeText(currentEntry.link)
        });

        qrcode = new QRCode(document.getElementById("omr-qrcode"), {
            width: qrcodeWidth,
            height: qrcodeWidth,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.L
        })
    });

    function showPostCtxMenu(event) {
        const hasText = window.getSelection().toString().trim().length > 0
        const truncateText = truncateStr(window.getSelection().toString().trim(), 20)

        const menu = new Menu();
        menu.append(new MenuItem({
            label: isWin() ? "🌟  Star" : "⭐️  Star",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        menu.append(new MenuItem({
            label: "📌  Mark as unread",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

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
            click: function(){
                clipboard.writeText(currentEntry.link)
                // toast("Copied")
            }
        }));
        menu.append(new MenuItem({
            label: "🧭  Open in Browser",
            click: function(){
                shell.openExternal(currentEntry.link);
            }
        }));
        menu.append(new MenuItem({
            label: "📲  QR Code",
            click: function() {
                qrcode.clear()
                qrcode.makeCode(currentEntry.link);

                const instanse = M.Modal.init(document.querySelector('#omr-modal-qrcode'), {
                    inDuration: 0,
                    outDuration: 0,
                    opacity: 1,
                    endingTop:  window.outerHeight / 2 - qrcodeWidth / 2 + "px"
                });
                document.querySelector('#omr-modal-qrcode').style.width = `${qrcodeWidth}px`
                document.querySelector('#omr-modal-qrcode').style.height = `${qrcodeWidth}px`
                document.querySelector('#omr-modal-qrcode').style.left = (window.outerWidth - 470) / 2 + 470 - qrcodeWidth / 2 + 'px'
                instanse.open()
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        menu.append(new MenuItem({
            label: "✏️  Edit Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        menu.append(new MenuItem({
            label: "🗑  Unsubscribe Feed",
            click: function(){
                alert(`you clicked on`);
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

{#if thirdContent}
<div class="flow-text {fontSize}" id="omr-post-third-html" on:contextmenu={showPostCtxMenu} on:dragover={allowDrop}>
    <Podcast bind:episodeInfo />

    <article>
        { @html thirdContent }
    </article>
</div>
{/if}

<div class="modal" id="omr-modal-qrcode">
    <div id="omr-qrcode"></div>
</div>
