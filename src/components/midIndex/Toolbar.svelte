<script>
    export let showModeBtn = true

    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { saveViewScope } from '../utils/storage.js'
    import { activeTab, rssViewMode, viewScope, starViewMode } from '../utils/store.js'
    import { shortToast } from '../utils/helper.js'

    const Mousetrap = require('mousetrap')
    const dispatch = createEventDispatcher()

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('r', function() {
            handleRefreshAction()
            shortToast("Refresh")
            return false
        });
    })

    function handleToggleViewMode() {
        // change status after network
        if ($activeTab === "rss") {
            const mode = ($rssViewMode === 'feed') ? 'entry' : 'feed'
            dispatch('refresh-list-view', {page: 1, mode: mode})
        } else {
            const mode = ($starViewMode === 'feed') ? 'entry' : 'feed'
            dispatch('refresh-list-view', {page: 1, mode: mode})
        }
    }
    function handleToggleViewScope() {
        // change status instant
        if ($viewScope === 'all') {
            viewScope.set('unread')
        } else {
            viewScope.set('all')
        }
        saveViewScope($viewScope)
        dispatch('refresh-list-view', {page: 1})
    }
    function handleRefreshAction() {
        dispatch('refresh-list-view', {page: 1})
    }
</script>

<style>
    #omr-top-toolbar {
        width: 100%;
        max-width: 400px;
        height: 60px;
        display: flex;
        /*border: 0.5px dashed red;*/
        padding-top: 16px;
        padding-bottom: 10px;
    }
    .toolbar-group {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .omr-search-form {
        margin-left: 15px;
        background: #E6E6E6;
        border-radius: 3px;
    }
    input[id=omr-search-input]:active, input[id=omr-search-input]:focus {
        background-color: #E6E6E6;
    }
    .omr-search-form.input-field {
        margin: 0;
        height: 100%;
    }
    .nav-wrapper {
        width: 100%;
        flex-grow: 1;
        margin-right: 10px;
    }
    .omr-full-search {
        padding-right: 0;
        margin-right: 0 !important;
    }
    #omr-search-input {
        margin: 0;
        line-height: 34px;
        border-radius: 3px;
        font-size: .95rem;
        vertical-align: middle;
    }

    .toolbar-icon {
        width: 54px;
        height: 34px;
        color: #101010;
    }
    .toolbar-icon i {
        margin: 5px 15px;
    }
    .search-icon {
        margin: 5px 0;
    }
</style>

<div id="omr-top-toolbar" class="drag">
    {#if $activeTab === 'apps'}
        <div class="nav-wrapper no-drag omr-full-search">
            <div class="input-field omr-search-form">
                <input id="omr-search-input" type="search" class="" placeholder="Search" required>
                <label class="label-icon search-icon" for="omr-search-input">
                    <i class="material-icons">search</i></label>
            </div>
        </div>
    {:else}
        <div class="nav-wrapper no-drag">
            <div class="input-field omr-search-form">
                <input id="omr-search-input" type="search" class="" placeholder="Search" required>
                <label class="label-icon search-icon" for="omr-search-input">
                    <i class="material-icons">search</i></label>
            </div>
        </div>

        <div class="toolbar-group no-drag">
            {#if $activeTab === 'rss'}
                <div class="toolbar-icon" id="omr-toolbar-scope" on:click={handleToggleViewScope}>
                    <i class="material-icons">{ $viewScope === 'all' ? 'donut_large' : 'fiber_manual_record' }</i>
                </div>

                {#if showModeBtn}
                <div class="toolbar-icon" id="omr-toolbar-mode" on:click={handleToggleViewMode}>
                    <i class="material-icons">{$rssViewMode === 'feed' ? 'view_module' : 'view_list'} </i>
                </div>
                {/if}
            {:else if $activeTab === 'star' && showModeBtn}
                <div class="toolbar-icon" id="omr-toolbar-mode" on:click={handleToggleViewMode}>
                    <i class="material-icons">{$starViewMode === 'feed' ? 'view_module' : 'view_list'} </i>
                </div>
            {/if}

            <div class="toolbar-icon" id="omr-toolbar-update"  on:click={handleRefreshAction}>
                <i class="material-icons">update</i>
            </div>

        </div>
    {/if}
</div>