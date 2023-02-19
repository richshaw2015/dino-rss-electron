<script>
    import { onMount } from 'svelte'

    import { endPodcastMini } from '../utils/store.js'

    export let podcastInfo

    let player
    let isPlaying = true

    onMount(() => {
        player.src = podcastInfo.src
        player.volume = podcastInfo.volume
        player.playbackRate = podcastInfo.rate
        player.currentTime = podcastInfo.playtime / 1000

        player.play()

        player.addEventListener("ended", function(){
            player.pause();
            isPlaying = false

            player.src = player.src;
            player.currentTime = 0;
            
            endPodcastMini.set(true)
        });
    })

    function handlePlayAudio() {
        if (isPlaying) {
            player.pause()
            isPlaying = false
        } else {
            player.play()
            isPlaying = true
        }
    }
</script>

<div style="visibility: hidden">
    <audio bind:this={player} ></audio>
</div>

<div class="fixed-action-btn podcast-mini">
    <div class="btn-floating podcast-mini-playinner podcast-mini-btn" on:click={handlePlayAudio}>
        {#if isPlaying}
            <span class="podcast-mini-playinner">
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="4" width="3" height="16" rx="1.5" fill="#E9F1F5"></rect> <rect x="14" y="4" width="3" height="16" rx="1.5" fill="#E9F1F5"></rect></svg>
            </span>
        {:else}
            <span class="podcast-mini-playinner podcast-mini-playarrow">
                <svg data-v-21801504="" data-v-92efa286="" width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 5.76341C6 5.19411 6.60936 4.83238 7.10914 5.10498L18.5429 11.3416C19.064 11.6258 19.064 12.3742 18.5429 12.6584L7.10914 18.895C6.60936 19.1676 6 18.8059 6 18.2366V5.76341Z" fill="#E9F1F5"></path></svg>
            </span>
        {/if}
    </div>
</div>
