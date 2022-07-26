<script>
    import { activeTab, readingMode } from './components/utils/store.js'
    import { i18n, getTokenPromise } from './components/utils/helper.js'

    import Nav from './components/leftNav/Nav.svelte'
    import AppsTab from './components/midIndex/AppsTab.svelte'
    import FeedEdit from './components/midIndex/FeedEdit.svelte'
    import StarTab from './components/midIndex/StarTab.svelte'
    import RssTab from './components/midIndex/RssTab.svelte'
    import Toolbar from './components/midIndex/Toolbar.svelte'
    import Post from './components/rightPost/Post.svelte'
    import Notice from './components/global/Notice.svelte'
    import Preloader from './components/global/Preloader.svelte'

    const tokenPromise = getTokenPromise()

    import { onMount } from 'svelte';

    onMount(() => {
        M.AutoInit();
    })
</script>

<style>
    .hidden {
        display: none !important;
    }
    .main-container {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        align-items: stretch;
        height: 100vh;
    }
    .left-container {
        width: 64px;
        min-width: 64px;
        max-width: 64px;
        overflow: hidden;
    }
    .middle-container {
        width: 400px;
        min-width: 400px;
        max-width: 400px;
        padding: 0 10px;
        /*border-right: 1px solid rgba(0,0,0,.14);*/
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
    }

    .right-container {
        flex-grow: 1;
        min-width: 500px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f3f3f3;
    }
    @media (prefers-color-scheme: dark) {
        .middle-container {
            background: #181818;
        }
        .right-container {
            background: #111111;
        }
    }
</style>

{#await tokenPromise}
    <!-- TODO loading img -->
    <div class="main-container">
        <div class="left-container">
            <Nav />
        </div>

        <div class="middle-container">
            <Toolbar />
            <Notice msg={i18n('loading')} />
        </div>

        <div class="right-container">
            <!-- TODO about -->
        </div>
    </div>
{:then token}
    <div class="main-container">
        <div class="left-container">
            <Nav />
        </div>

        <div class="middle-container {$readingMode && ($activeTab === 'rss' || $activeTab === 'star') ? 'hidden' : '' }">
            {#if $activeTab === 'rss'}
                <RssTab />
            {:else if $activeTab === 'star'}
                <StarTab />
            {:else if $activeTab === 'apps'}
                <AppsTab />
            {/if}
        </div>

        <div class="right-container">
            <Post />
        </div>
    </div>
{:catch error}
<div class="main-container">
    <div class="left-container">
        <Nav />
    </div>

    <div class="middle-container">
        <Toolbar />
        <Notice msg={error} level='warn' />
    </div>

    <div class="right-container">
        <!-- TODO about -->
    </div>
</div>
{/await}

<Preloader />
<FeedEdit />
