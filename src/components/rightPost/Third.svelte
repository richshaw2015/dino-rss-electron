<script>
    export let fontSize
    export let activeEntry = {}
    export let entryContentRsp = {}

    import { truncateStr, isMac, isWin, captureWindow, toast, copyToClipboard, warnToast, setEntryCache, i18n }
        from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import { appsActiveMenu, activeTab, rssActiveEntry, starActiveEntry } from '../utils/store.js'
    import Podcast from './Podcast.svelte'
    import Home from './Home.svelte'
    import Update from './Update.svelte'
    import Explore from './Explore.svelte'
    import Thanks from './Thanks.svelte'
    import Setting from './Setting.svelte'
    import Notice from '../global/Notice.svelte'

    const { shell } = require('electron')
    const { Menu, MenuItem } = require('@electron/remote')
    
    let qrcode
    let pellEditor
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

        pellEditor = window.pell.init({
            element: document.getElementById('omr-pell-editor'),
            defaultParagraphSeparator: 'div',
            styleWithCSS: false,
            actions: [
                'bold', 'italic', 'underline', 'strikethrough', 'heading1', 'heading2', 'paragraph', 'quote', 'olist', 'line',
                {
                    name: 'format',
                    title: 'Clear Format',
                    icon: 'F',
                    result: function result() {
                        pell.exec('removeFormat');
                    }
                }, {
                    name: "undo",
                    icon: '↺',
                    title: 'Undo',
                    result: function result() {
                        pell.exec('undo');
                    }
                }, {
                    name: "redo",
                    icon: '↻',
                    title: 'Redo',
                    result: function result() {
                        pell.exec('redo');
                    }
                }
            ],
            onChange: function () {}
      })
    })

    afterUpdate(() => {
        if (entryContentRsp && entryContentRsp.code !== -1 && entryContentRsp.content && activeEntry.id ) {
            // highlight code
            console.log('Highlight article code')
            if (document.querySelector('#omr-post-third-html pre[class*="language-"]') !== null 
                || document.querySelector('#omr-post-third-html code[class*="language-"]') !== null) {
                Prism.highlightAll()
            } else {
                document.querySelectorAll('#omr-post-third-html pre > code').forEach((block) => {
                    hljs.highlightBlock(block)
                })
            }
        } else if (entryContentRsp && Object.keys(entryContentRsp).length === 0) {
            console.log('Highlight home')
            Prism.highlightAll()
        }
	});

    function showPostCtxMenu(event) {
        const hasText = window.getSelection().toString().trim().length > 0
        const truncateText = truncateStr(window.getSelection().toString().trim(), 20)

        const menu = new Menu()

        menu.append(new MenuItem({
            label: '🔍  ' + i18n('search') + `"${truncateText}"`,
            visible: hasText,
            click: function(){
                const url = new URL('https://www.google.com/search');
                url.searchParams.set('q', window.getSelection().toString());
                shell.openExternal(url.toString());
            }
        }));
        menu.append(new MenuItem({
            label: '📗  ' + i18n('lookup') + `"${truncateText}"`,
            visible: hasText && isMac(),
            click: function(){
                require('@electron/remote').getCurrentWindow().showDefinitionForSelection()
            }
        }));
        menu.append(new MenuItem({
            visible: isMac() && hasText,
            label: "🔊  " + i18n('speaking'),
            submenu: [
                {"role": "startSpeaking"},
                {"role": "stopSpeaking"},
            ]
        }));

        // role and separator are not affected by visible attribute
        if (hasText) {
            menu.append(new MenuItem({
                label: "📋  " + i18n('copy'),
                role: "copy"
            }));
            menu.append(new MenuItem({type: "separator", visible: hasText}));
        }

        menu.append(new MenuItem({
            label: "📝  " + i18n('add.memo'),
            click: function() {
                showPellEditor()
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        // menu.append(new MenuItem({
        //     label: "🔗  Copy Link",
        //     click: function() {
        //         copyToClipboard(activeEntry.link)
        //     }
        // }));
        // menu.append(new MenuItem({type: "separator"}));
        
        menu.append(new MenuItem({
            label: "🧭  " + i18n('open.in.browser'),
            click: function(){
                shell.openExternal(activeEntry.link);
            }
        }));
        menu.append(new MenuItem({type: "separator"}));

        menu.append(new MenuItem({
            label: "📲  " + i18n('qr.code'),
            click: function() {
                qrcode.clear()
                qrcode.makeCode(activeEntry.link);

                const instanse = M.Modal.init(document.querySelector('#omr-modal-qrcode'), {
                    inDuration: 0,
                    outDuration: 0,
                    opacity: 0.5,
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
            label: "📸  " + i18n('screenshot'),
            click: function(){
                captureWindow()
            }
        }));

        menu.popup({ window: require('@electron/remote').getCurrentWindow() })
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function showPellEditor() {
        pellEditor.content.innerHTML = entryContentRsp.memo || ''

        const instanse = M.Modal.init(document.querySelector('#omr-modal-pell'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 0.5,
            dismissible: false,
            endingTop: "15%"
        });

        instanse.open()

        document.getElementsByClassName('pell-content')[0].focus()
    }

    function handleSubmitMemo() {
        const memo = pellEditor.content.innerHTML
        apiReq('/api/star/memo', {feed_id: activeEntry.feed.id, entry_id: activeEntry.id, memo: memo}).then( rsp => {
            if (rsp.code === 0) {
                entryContentRsp.memo = memo
                
                setEntryCache(activeEntry.id, entryContentRsp)

                // re-render
                if ($activeTab === "rss") {
                    if (activeEntry.id === $rssActiveEntry.id) {
                        $rssActiveEntry.stats.has_starred = true
                    }
                } else if ($activeTab === "star") {
                    if (activeEntry.id === $starActiveEntry.id) {
                        $starActiveEntry.stats.has_starred = true
                    }
                }

                try {
                    M.Modal.getInstance(document.querySelector('#omr-modal-pell')).close();
                } catch (e) {}

            } else if (rsp.code === 108) {
                warnToast(i18n('add.memo.failed'))
            }
        }).catch(err => {
            warnToast(err)
        })
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
    .user-memo-txt {
        margin: 20px 0;
        padding: 20px;
        background: white;
        color: #585858;
        border-radius: 2px;
    }
    #omr-modal-pell {
        box-sizing: border-box;
        margin: 0 auto;
        max-width: 656px;
        padding: 28px;
        left: 70px;
    }
</style>

{#if entryContentRsp === undefined}
    <!-- loading -->
    <Notice />
{:else if entryContentRsp && entryContentRsp.code === -1}
    <!-- error -->
    <Notice level='warn' msg={ entryContentRsp.msg }  />
{:else if entryContentRsp && Object.keys(entryContentRsp).length === 0}
    <!-- init -->
    <div class="flow-text" id="omr-post-third-html">
        {#if $activeTab !== 'apps'}
            <Home />
        {:else}
            {#if $appsActiveMenu === 'update'}
                <Update />
            {:else if $appsActiveMenu === 'about'}
                <Home />
            {:else if $appsActiveMenu === 'thanks'}
                <Thanks />
            {:else if $appsActiveMenu === 'setting'}
                <Setting />
            {:else if $appsActiveMenu === 'explore'}
                <Explore />
            {/if}
        {/if}
    </div>
{:else}
    <!-- success -->
    <div class="flow-text {fontSize}" id="omr-post-third-html" on:contextmenu={showPostCtxMenu} on:dragover={allowDrop}>
        {#if entryContentRsp.memo}
        <div class="user-memo-txt z-depth-1" on:dblclick={showPellEditor}>
            { @html entryContentRsp.memo }
        </div>
        {/if}

        <Podcast episode={ entryContentRsp.episode } />

        <article>
            { @html entryContentRsp.content }
        </article>
    </div>
{/if}

<div class="modal" id="omr-modal-qrcode">
    <div id="omr-qrcode"></div>
</div>

<div class="modal" id="omr-modal-pell">
    <div class="modal-title"><i class="material-icons">note_add</i> {i18n('add.memo')}</div>
    <div id="omr-pell-editor" class="pell"></div>

    <div class="modal-footer">
        <button class="modal-close btn waves-effect waves-light btn-small cancel-btn">{i18n('cancel')}</button>
        <button class="btn waves-effect waves-light btn-small" on:click={handleSubmitMemo}>{i18n('save')}</button>
    </div>
</div>
