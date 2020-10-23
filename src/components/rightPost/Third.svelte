<script>
    export let fontSize

    import { toast } from '../utils/toast.js'
    import { truncateStr, isMac, isWin, captureWindow } from '../utils/helper.js'
    import { activeEntry, activeEntryContentRsp } from '../store/store.js'
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
        if ($activeEntryContentRsp.code !== -1 && $activeEntryContentRsp.content && $activeEntry.id ) {
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
                clipboard.writeText($activeEntry.link)
                // toast("Copied")
            }
        }));
        menu.append(new MenuItem({
            label: "🧭  Open in Browser",
            click: function(){
                shell.openExternal($activeEntry.link);
            }
        }));
        menu.append(new MenuItem({
            label: "📲  QR Code",
            click: function() {
                qrcode.clear()
                qrcode.makeCode($activeEntry.link);

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

{#if $activeEntryContentRsp.code === -1}
    <!-- error -->
    <Notice level='warn' msg={ $activeEntryContentRsp.msg }  />
{:else if Object.keys($activeEntryContentRsp).length === 0}
    <!-- loading -->
    <Notice />
{:else}
    <!-- success -->
    <div class="flow-text {fontSize}" id="omr-post-third-html" on:contextmenu={showPostCtxMenu} on:dragover={allowDrop}>
        <Podcast episode={ $activeEntryContentRsp.episode } />

        <article>
            { @html $activeEntryContentRsp.content }
        </article>
    </div>
{/if}

<div class="modal" id="omr-modal-qrcode">
    <div id="omr-qrcode"></div>
</div>
