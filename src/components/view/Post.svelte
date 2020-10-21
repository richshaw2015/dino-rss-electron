<script>
    const Mousetrap = require('mousetrap')
    const { clipboard } = require('electron')

    import { closeWindow } from '../utils/helper.js'
    import { getFontSize } from '../utils/storage.js'

    import Find from '../find/Find.svelte'
    import Title from '../detail/Title.svelte'
    import Statusbar from '../detail/Statusbar.svelte'
    import Third from '../detail/Third.svelte'

    import { statusMsg } from '../store/store.js'

    import { onMount, afterUpdate } from 'svelte';

    export let currentEntry
    export let contentApiRsp = {}

    let fontSize = getFontSize()
    const scrollStep = 60

    afterUpdate(() => {
        if (currentEntry) {
            statusMsg.set(currentEntry.link)
        }
    })

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
    })
</script>

<Title {currentEntry} bind:fontSize />

<Find />

<Third {currentEntry} {fontSize} {contentApiRsp} />

<Statusbar />
