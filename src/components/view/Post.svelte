<script>
    const Mousetrap = require('mousetrap')
    const Prism = require('prismjs')

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
    export let thirdContent
    export let episodeInfo

    let fontSize = getFontSize()
    const scrollStep = 60

    afterUpdate(() => {
        if (thirdContent) {
            document.querySelector('#omr-post-third-html').scrollTop = 0
        }

        if (currentEntry) {
            statusMsg.set(currentEntry.link)
        }

        // highlight code
        if (document.querySelector('#omr-post-third-html pre[class*="language-"]') !== null 
            || document.querySelector('#omr-post-third-html code[class*="language-"]') !== null) {
            Prism.highlightAll()
        } else {
            console.log("Apply highlight.js")

            document.querySelectorAll('#omr-post-third-html pre > code').forEach((block) => {
                hljs.highlightBlock(block)
            })
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

<Title bind:currentEntry bind:fontSize />

<Find />

<Third bind:currentEntry bind:fontSize bind:thirdContent bind:episodeInfo />

<Statusbar />
