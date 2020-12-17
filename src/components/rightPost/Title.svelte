
<script>
    export let fontSize = "text-medium"
    export let activeEntry = {}

    import { toggleMaximizeWindow, macNavCtxMenu, isInList } from '../utils/helper.js'
    import { saveFontSize } from '../utils/storage.js'
    import { apiReq } from '../utils/req.js'
    import { activeTab, rssListRsp, starListRsp, appsActiveMenu } from '../utils/store.js'
    
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
            }
        }).catch(err => {
            warnToast(err + " Star")
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
        border-bottom: 1px dashed rgba(0,0,0,0.14);
        cursor: move;
    }
    #omr-post-title-bar > i {
        width: 54px;
        min-width: 54px;
        padding-left: 15px;
        padding-right: 15px;
    }
    .post-title {
        flex-grow: 1;
        font-size: 1.8rem;
        margin-top: 16px;
        margin-bottom: 16px;
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
    }
</style>

{#if activeEntry.id}
    <div id="omr-post-title-bar" class="drag" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
        <div class="post-title">{ activeEntry.title }</div>

        <i title="Toggle star / unstar" class="material-icons no-drag {activeEntry.stats.has_starred ? 'primary-color' : ''}" 
            on:click={toggleStarStatus}>
            {activeEntry.stats.has_starred ? 'star' : 'star_border'}</i>

        <i title="Change font size" class="material-icons no-drag" on:click="{showFontSizeWindow}">format_size</i>
    </div>

    <div id="omr-modal-font-size" class="modal">
        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-smaller" bind:group={fontSize} />
                <span>Smaller</span>
            </label>
        </span>

        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-small" bind:group={fontSize} />
                <span>Small</span>
            </label>
        </span>

        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-medium" bind:group={fontSize} />
                <span>Medium</span>
            </label>
        </span>
        
        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-large" bind:group={fontSize} />
                <span>Large</span>
            </label>
        </span>

        <span class="size-option">
            <label>
                <input name="font-size" type="radio" value="text-larger" bind:group={fontSize} />
                <span>Larger</span>
            </label>
        </span>
    </div>
{:else}
    <div id="omr-post-title-bar" class="drag" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
        <div class="post-title">
            {#if $activeTab !== 'apps'}
            Dinosaur Rss 🦕
            {:else}
                {#if $appsActiveMenu === 'about'}
                Dinosaur Rss 🦕
                {:else if $appsActiveMenu === 'thanks'}
                    Thanks 👏
                {:else if $appsActiveMenu === 'setting'}
                    Setting ⚙️
                {/if}
            {/if}
        </div>
    </div>
{/if}
