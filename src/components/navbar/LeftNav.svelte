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
    #nav-image {
        width: 36px;
        height: 36px;
        margin-top: 64px;
    }
    #nav-image img{
        max-height: 100%;
        max-width: 100%;
    }
    .nav-icon {
        width: 24px;
        height: 24px;
        color: #CDCDCD;
    }
    #nav-apps-icon, #nav-star-icon, #nav-rss-icon{
        margin-top: 36px;
    }
    #nav-add-icon {
        margin-bottom: 32px;
    }
    #nav-space {
        flex-grow: 1;
    }
    .activeTab {
        color: #ee6e73;
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
    <div id="nav-image">
        <img src="{userInfo.image}" alt="Avatar">
    </div>

    <div class="nav-icon {activeTab === 'rss' ? 'activeTab' : ''}" id="nav-rss-icon">
        <i class="material-icons">rss_feed</i>
    </div>

    <div class="nav-icon {activeTab === 'star' ? 'activeTab' : ''}" id="nav-star-icon">
        <i class="material-icons">star</i>
    </div>

    <div class="nav-icon {activeTab === 'apps' ? 'activeTab' : ''}" id="nav-apps-icon">
        <i class="material-icons">apps</i>
    </div>

    <div id="nav-space">
    </div>

    <div class="nav-icon" id="nav-add-icon">
        <i class="material-icons">add_circle</i>
    </div>
</div>
