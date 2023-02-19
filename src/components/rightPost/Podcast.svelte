<script>
    export let episode

    import { afterUpdate, onDestroy } from 'svelte';
    import {podcastConfig, podcastTemplate} from '../utils/config.js'
    import {showPodcastMini, podcastMiniInfo, endPodcastMini, activeTab} from '../utils/store.js'

    afterUpdate(() => {
        if (episode && Object.keys(episode).length > 0) {
            document.getElementById('omr-post-third-podcast').innerHTML = podcastTemplate
            
            window.podlovePlayer('#omr-post-third-podcast', episode, podcastConfig).then(store => {
                store.subscribe(() => {
                    const state = store.getState();
                    // if (state.lastAction.type !== 'PLAYER_BACKEND_PLAYTIME' 
                    //     && state.lastAction.type !== 'PLAYER_SET_QUANTILE' 
                    //     && state.lastAction.type !== 'PLAYER_UPDATE_CHAPTER') {
                    //     console.log(state.lastAction)
                    // }
                    if (state.lastAction.type === 'PLAYER_REQUEST_PLAY' || 
                        state.lastAction.type === 'PLAYER_BACKEND_PLAY') {
                        showPodcastMini.set(false)
                        endPodcastMini.set(false)
                        podcastMiniInfo.set({})
                    } else if (state.lastAction.type === 'PLAYER_BACKEND_PLAYTIME') {
                        const podcast = {
                            "volume": state.audio.volume,
                            "rate": state.audio.rate,
                            "src": state.media[0].url,
                            "duration": state.timepiece.duration,
                            "playtime": state.timepiece.playtime,
                            "poster": state.episode.poster,
                            "tab": $activeTab
                        }
                        podcastMiniInfo.set(podcast)
                    }
                })
            })
        } else {
            document.getElementById('omr-post-third-podcast').innerHTML = ''
        }
    })
</script>

<style>
</style>

<div id="omr-post-third-podcast"></div>
