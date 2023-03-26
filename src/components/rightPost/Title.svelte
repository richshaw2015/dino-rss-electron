
<script>
    export let fontSize = "text-medium"
    export let activeEntry = {}

    import { toggleMaximizeWindow, macNavCtxMenu, isInList, i18n, warnToast } from '../utils/helper.js'
    import { saveFontSize } from '../utils/storage.js'
    import { apiReq } from '../utils/req.js'
    import { activeTab, rssListRsp, starListRsp, appsActiveMenu, readingMode } from '../utils/store.js'

    function exitReadingMode(event) {
        readingMode.set(false)
    }

    function showFontSizeWindow(event) {
        const width = 450

        const instanse = M.Modal.init(document.querySelector('#omr-modal-font-size'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 0.1,
            endingTop: document.querySelector('#omr-post-title-bar').offsetHeight + 'px'
        });
        document.querySelector('#omr-modal-font-size').style.width = `${width}px`
        document.querySelector('#omr-modal-font-size').style.left = `${event.x - width}px`

        instanse.open()
    }

    function toggleStarStatus(event) {
        const url = activeEntry.stats.has_starred ? '/api/unstar/entry' : '/api/star/entry'
        
        apiReq(url, {entry_id: activeEntry.id, feed_id: activeEntry.feed.id}).then( rsp => {
            if (rsp.code === 0) {
                activeEntry.stats.has_starred = !activeEntry.stats.has_starred
                if ($activeTab === 'rss') {
                    if (isInList(activeEntry, $rssListRsp.data)) {
                        $rssListRsp.data[activeEntry._index].stats.has_starred = activeEntry.stats.has_starred
                    }
                } else if ($activeTab === 'star') {
                    if (isInList(activeEntry, $starListRsp.data)) {
                        $starListRsp.data[activeEntry._index].stats.has_starred = activeEntry.stats.has_starred
                    }
                }
            } else if (rsp.code === 109) {
                warnToast(i18n("max.stars.limit"))
            } else {
                warnToast(i18n("unknown.error"))
            }
        }).catch(err => {
            warnToast(err)
        })
    }

    $: {
        console.log(`Set font size ${fontSize}`)
        saveFontSize(fontSize)
    }
</script>

<style>
    #omr-post-title-bar {
        display: flex;
        align-items: center;
        padding-left: 24px;
        padding-right: 10px;
        border-bottom: 1px solid rgba(0,0,0,0.14);
        cursor: move;
    }
    #omr-post-title-bar > i {
        width: 40px;
        min-width: 40px;
        padding-left: 8px;
        font-size: 21px;
    }
    .post-title {
        flex-grow: 1;
        font-size: 1.6rem;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 10px;
        word-break: break-word;
    }
    #omr-modal-font-size {
        padding: 12px;
        margin: 0;
        max-width: 500px;
        min-width: 400px;
    }
    .size-option {
        max-width: 20%;
        min-width: 18%;
        display: inline-block;
    }
    .iphone {
        position: relative;
    }
    .notch {
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 50%;
        width: 210px;
        height: 42px;
        background-color: #24292E;
        border-radius: 0 0 28px 28px;
        transform: translateX(-50%);
    }
    .notch::before, .notch::after {
        content: "";
        position: absolute;
        top: 0;
        left: -7px;
        width: 14px;
        height: 7px;
        background-size: 50% 100%;
        background-repeat: no-repeat;
        background-image: radial-gradient(circle at 0 100%, transparent 6px, #222 7px);
    }
    .notch::after {
        left: 100%;
        margin-right: corner-sizepx;
        background-image: radial-gradient(circle at 100% 100%, transparent 6px, #222 7px);
    }
    .exit-btn {
        cursor: pointer;
        color: white;
        font-size: 16px;
        text-align: center;
        line-height: 42px;
        opacity: 0.8;
    }
    .exit-btn:hover {
        opacity: 1;
    }

    @media (prefers-color-scheme: dark) {
        #omr-post-title-bar {
            border-color: #373737;
        }
        .notch {
            background-color: #373737;
        }
        .notch::before, .notch::after {
            background-image: radial-gradient(circle at 0 100%, transparent 6px, #373737 7px);
        }
        .notch::after {
            background-image: radial-gradient(circle at 100% 100%, transparent 6px, #373737 7px);
        }
    }
</style>

{#if activeEntry.id}
    <div id="omr-post-title-bar" class="drag" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
        <div class="post-title">{ activeEntry.title }</div>

        {#if $readingMode}
            <div class="phone">
                <div class="notch">
                    <div class="no-drag exit-btn" on:click={exitReadingMode}>{i18n('exit.reader.mode')}</div>
                </div>
            </div>
        {/if}

        <i title="{i18n('toggle.star.unstar')}" class="material-icons no-drag {activeEntry.stats.has_starred ? 'primary-color' : ''}"
            on:click={toggleStarStatus}>
            {activeEntry.stats.has_starred ? 'star' : 'star_border'}</i>

        <i title="{i18n('change.font.size')}" class="material-icons no-drag" on:click="{showFontSizeWindow}">format_size</i>
    </div>

    <div id="omr-modal-font-size" class="modal">
        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-smaller" bind:group={fontSize} />
                <span>{i18n('smaller')}</span>
            </label>
        </span>

        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-small" bind:group={fontSize} />
                <span>{i18n('small')}</span>
            </label>
        </span>

        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-medium" bind:group={fontSize} />
                <span>{i18n('medium')}</span>
            </label>
        </span>
        
        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-large" bind:group={fontSize} />
                <span>{i18n('large')}</span>
            </label>
        </span>

        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-larger" bind:group={fontSize} />
                <span>{i18n('larger')}</span>
            </label>
        </span>
    </div>
{:else}
    <div id="omr-post-title-bar" class="drag" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
        <div class="post-title">
            {#if $activeTab !== 'apps'}
            Dinosaur Rss 🦕
            {:else}
                {#if $appsActiveMenu === 'thanks'}
                    {i18n('thanks')}  👏
                {:else if $appsActiveMenu === 'setting'}
                    {i18n('setting')}  ⚙️
                {:else if $appsActiveMenu === 'explore'}
                    {i18n('explore')}  🧭
                {:else if $appsActiveMenu === 'update'}
                    {i18n('update')}  📡
                {:else}
                    Dinosaur Rss 🦕
                {/if}
            {/if}
        </div>
    </div>
{/if}
