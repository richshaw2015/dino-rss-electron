<script>
    import { afterUpdate } from 'svelte';
    import { podcastConfig, podcastTemplate } from '../utils/config.js'

    export let episode

    afterUpdate(() => {
        if (episode && Object.keys(episode).length > 0) {
            console.log("Render podcast data")
            document.getElementById('omr-post-third-podcast').innerHTML = podcastTemplate
            
            window.podlovePlayer('#omr-post-third-podcast', episode, podcastConfig)
        } else {
            document.getElementById('omr-post-third-podcast').innerHTML = ''
        }
    })
</script>

<style>
</style>

<div id="omr-post-third-podcast"></div>
