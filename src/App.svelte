<script>
    import { getViewMode, getViewScope, getFontSize, getTokenPromise } from './components/utils/storage.js'
    import Nav from './components/navbar/Nav.svelte';
    import List from './components/listview/List.svelte'
    import Apps from './components/index/Apps.svelte'
    import Title from './components/detail/Title.svelte'
    import Third from './components/detail/Third.svelte'
    import Toolbar from './components/index/Toolbar.svelte'
    import Statusbar from './components/detail/Statusbar.svelte'
    import Error from './components/error/Error.svelte'
    import Loading from './components/error/Loading.svelte'

    const tokenPromise = getTokenPromise()
    const M = require('materialize-css')

    let activeTab = 'rss'

    let viewMode = getViewMode()
    let viewScope = getViewScope()
    let fontSize = getFontSize()

    let currentEntry
    let thirdContent
    let currentFeed
    let itemList

    import { onMount } from 'svelte';

    onMount(() => {
        M.AutoInit();
    });
</script>

<style>
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
        width: 70px;
        min-width: 70px;
        max-width: 70px;
        overflow: hidden;
    }
    .middle-container {
        width: 400px;
        min-width: 400px;
        max-width: 400px;
        padding: 0 10px;
        border-right: 1px dashed rgba(0,0,0,.14);
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
        background-color: #f3f3f3;
    }
</style>

{#await tokenPromise}
    <!-- TODO loading img -->
    <div class="main-container">
        <div class="left-container">
            <Nav bind:activeTab />
        </div>

        <div class="middle-container">
            <Toolbar bind:activeTab bind:viewMode bind:viewScope />
            {#if activeTab !== 'apps'}
                <Loading />
            {:else}
                <Apps />
            {/if}
        </div>

        <div class="right-container">
        </div>
    </div>
{:then token}
    <div class="main-container">
        <div class="left-container">
            <Nav bind:activeTab />
        </div>

        <div class="middle-container">
            {#if activeTab !== 'apps'}
                <List bind:activeTab bind:viewMode bind:viewScope bind:currentEntry bind:itemList bind:thirdContent />
            {:else}
                <Apps />
            {/if}
        </div>

        <div class="right-container">
            <Title bind:currentEntry bind:fontSize />
            <Third bind:currentEntry bind:fontSize bind:thirdContent />
            <Statusbar />
        </div>
    </div>
{:catch error}
<div class="main-container">
    <div class="left-container">
        <Nav bind:activeTab />
    </div>

    <div class="middle-container">
        {#if activeTab !== 'apps'}
            <Toolbar bind:activeTab bind:viewMode bind:viewScope />
            <Error msg={error} />
        {:else}
            <Apps />
        {/if}
    </div>

    <div class="right-container">
    </div>
</div>
{/await}
