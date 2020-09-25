<script>
    // import { createEventDispatcher } from 'svelte';
    //
    // const dispatch = createEventDispatcher();

    export let userInfo = {
        id: 0,
        uuid: '',
        level: 1,
        oauth: '',
        name: '',
        image: './icon/logo-grey.svg',
        blog: '',
    };
    export let activeTab = undefined

    function switchStarNav(event) {
        activeTab = 'star'
        // TODO update data
    }
    function switchRssNav(event) {
        activeTab = 'rss'
        // TODO update data
    }
    function switchAppsNav(event) {
        activeTab = 'apps'
        // TODO update data
    }
</script>

<style>
    #omr-left-nav {
        height: 100%;
        min-width: 70px;
        background: #24292E;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #omr-nav-avatar {
        margin-top: 64px;
    }
    #omr-nav-avatar img {
        width: 36px;
        height: 36px;
        margin: auto;
        display: block;
    }
    .nav-tab-btn {
        display: flex;
        align-items: center;
        width: 100%;
        height: 36px;
        color: #CDCDCD;
        user-select: none;
    }
    .nav-tab-btn i {
        height: 24px;
        width: 24px;
        margin: auto;
    }
    #omr-nav-apps, #omr-nav-star, #omr-nav-rss{
        margin-top: 24px;
    }
    #omr-nav-add {
        margin-bottom: 32px;
    }
    #omr-nav-space {
        flex-grow: 1;
    }
</style>

<div id="omr-left-nav" class="drag">
    <div id="omr-nav-avatar" class="nav-tab-btn no-drag">
        <img src="{userInfo.image}" alt="Avatar">
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-rss" on:click={switchRssNav}>
        <i class="material-icons {activeTab === 'rss' ? 'primary-color' : ''}">rss_feed</i>
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-star" on:click={switchStarNav}>
        <i class="material-icons {activeTab === 'star' ? 'primary-color' : ''}">star</i>
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-apps" on:click={switchAppsNav}>
        <i class="material-icons {activeTab === 'apps' ? 'primary-color' : ''}">apps</i>
    </div>

    <div id="omr-nav-space">
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-add">
        <i class="material-icons">add_circle</i>
    </div>
</div>
