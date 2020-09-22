<style>
    #omr-left-nav {
        width: 70px;
        height: 100%;
        min-height: 600px;
        background: #24292E;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #omr-nav-image {
        width: 36px;
        height: 36px;
        margin-top: 64px;
    }
    #omr-nav-image img{
        max-height: 100%;
        max-width: 100%;
    }
    .nav-icon {
        width: 24px;
        height: 24px;
        color: #CDCDCD;
    }
    #omr-nav-apps, #omr-nav-star, #omr-nav-rss{
        margin-top: 36px;
    }
    #omr-nav-add {
        margin-bottom: 32px;
    }
    #omr-nav-space {
        flex-grow: 1;
    }
</style>

<script>
    // import { createEventDispatcher } from 'svelte';
    //
    // const dispatch = createEventDispatcher();

    export let userInfo = {
        id: '',
        uuid: '',
        level: 1,
        oauth: '',
        name: '',
        image: './icon/logo-grey.svg',
        blog: '',
    };
    export let activeTab = 'rss'
</script>

<div id="omr-left-nav">
    <div id="omr-nav-image">
        <img src="{userInfo.image}" alt="Avatar">
    </div>

    <div class="nav-icon" id="omr-nav-rss">
        <i class="material-icons {activeTab === 'rss' ? 'primary-color' : ''}">rss_feed</i>
    </div>

    <div class="nav-icon" id="omr-nav-star">
        <i class="material-icons {activeTab === 'star' ? 'primary-color' : ''}">star</i>
    </div>

    <div class="nav-icon" id="omr-nav-apps">
        <i class="material-icons {activeTab === 'apps' ? 'primary-color' : ''}">apps</i>
    </div>

    <div id="omr-nav-space">
    </div>

    <div class="nav-icon" id="omr-nav-add">
        <i class="material-icons">add_circle</i>
    </div>
</div>
