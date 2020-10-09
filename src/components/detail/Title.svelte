
<script>
    import { toggleMaximizeWindow, macNavCtxMenu } from '../utils/helper.js'
    import { setFontSize } from '../utils/storage.js'
    import Find from '../find/Find.svelte'

    export let entryInfo = {
        "id": 1233,
        "title": "Thinking About Power Usage and Websites",
        "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
        "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
        "author": "Selena Deckelmann",
        "image": "https://css-tricks.com/apple-touch-icon.png",
        "updated": "3 hours ago",
        "feed": {
            "id": 2,
            "title": "CSS-Tricks",
            "link": "https://css-tricks.com",
            "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
            "rss": "https://css-tricks.com/feed/",
            "is_podcast": true
        },
        "stats": {
            "has_read": true,
            "has_stared": true,
            "uv_stared": 5,
            "uv_view": 246,
        }
    }
    export let fontSize = "text-medium"

    function showFontSizeWindow(event) {
        const width = 450

        const instanse = M.Modal.init(document.querySelector('#omr-modal-font-size'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 1,
            endingTop: document.querySelector('#omr-post-title-bar').offsetHeight + 'px'
        });
        document.querySelector('#omr-modal-font-size').style.width = `${width}px`
        document.querySelector('#omr-modal-font-size').style.left = `${event.x - width}px`

        instanse.open()
    }
    $: {
        setFontSize(fontSize)
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
    #omr-post-title-bar i {
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

<div id="omr-post-title-bar" class="drag" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
    <div class="post-title">{ entryInfo.title }</div>
    <i class="material-icons no-drag {entryInfo.stats.has_stared ? 'primary-color' : ''}">
        {entryInfo.stats.has_stared ? 'star' : 'star_border'}</i>
    <i class="material-icons no-drag" on:click="{showFontSizeWindow}">format_size</i>
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
            <input name="font-size" type="radio" value="text-medium" bind:group={fontSize} checked />
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

<Find />
