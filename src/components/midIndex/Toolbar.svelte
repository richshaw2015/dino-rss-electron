<script>
    export let showModeBtn = true

    import {onDestroy, onMount, afterUpdate} from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { saveViewScope } from '../utils/storage.js'
    import { activeTab, rssViewMode, viewScope, starViewMode, isApiLoading, unreadCountRsp } from '../utils/store.js'
    import { shortToast, warnToast, toast, i18n } from '../utils/helper.js'
    import FeedCard from '../global/FeedCard.svelte'
    import { apiReq } from '../utils/req.js';

    const Mousetrap = require('mousetrap')
    const dispatch = createEventDispatcher()

    let searchKeyword
    let searchRsp

    let tooltipInstances = null
    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('r', function() {
            handleRefreshAction()
            return false
        });
    })
    afterUpdate(() => {
        if (tooltipInstances !== null) {
            tooltipInstances.forEach(instance => instance.destroy());
        }

        tooltipInstances = M.Tooltip.init(document.querySelectorAll('.toolbar-icon.tooltipped'),
            {"outDuration": 0, "enterDelay": 5, "inDuration": 10})
    });

    onDestroy(() => {
        if (tooltipInstances !== null) {
            tooltipInstances.forEach(instance => instance.destroy());
        }
    });

    function handleMarkAllAsRead() {
        console.log('mark all as read')
        if ($unreadCountRsp.count > 0) {
            apiReq('/api/entry/mark/read', {entries: $unreadCountRsp.list.join(',')}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast(i18n("mark.all.as.read"))
                    $unreadCountRsp.count = 0

                    // refresh
                    dispatch('refresh-list-view', {page: 1})
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
            })
        } else {
            toast(i18n('no.unread.feed'))
        }
    }
    function handleToggleViewMode() {
        // change status after network
        if ($activeTab === "rss") {
            dispatch('refresh-list-view', {page: 1, mode: ($rssViewMode === 'feed') ? 'entry' : 'feed'})
        } else if ($activeTab === "star") {
            dispatch('refresh-list-view', {page: 1, mode: ($starViewMode === 'feed') ? 'entry' : 'feed'})
        }
    }
    function handleToggleViewScope() {
        // change status instant
        viewScope.set(($viewScope === 'all') ? 'unread' : 'all')
        saveViewScope($viewScope)
        dispatch('refresh-list-view', {page: 1})
    }
    function handleRefreshAction() {
        shortToast(i18n('refresh'))
        dispatch('refresh-list-view', {page: 1})
    }
    function handleSearch(event) {
        if (event.keyCode === 13 && searchKeyword) {
            event.preventDefault()

            isApiLoading.set(true)
            searchRsp = undefined
            apiReq('/api/search/feed', {keyword: searchKeyword}).then( rsp => {
                if (rsp.code === 0) {
                    searchRsp = rsp
                    showSearchhWindow()
                } else if (rsp.code === 106) {
                    warnToast(i18n('keyword.error'))
                } else if (rsp.code === 100) {
                    warnToast(i18n('no.data'))
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
            }).finally(() => {
                isApiLoading.set(false)
            });
        }
    }
    function showSearchhWindow() {
        const instanse = M.Modal.init(document.querySelector('#omr-modal-search-feed'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 0.5,
            endingTop: document.querySelector('#omr-top-toolbar').offsetHeight + 'px'
        });
        instanse.open()
    }
</script>

<style>
    #omr-top-toolbar {
        width: 100%;
        max-width: 400px;
        height: 50px;
        display: flex;
        padding-top: 8px;
        padding-bottom: 8px;
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
        height: 28px;
        margin: 3px 0;
    }
    .nav-wrapper {
        width: 100%;
        flex-grow: 1;
        margin-right: 6px;
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
        padding-left: 3rem;
    }

    .toolbar-icon {
        width: 44px;
        height: 28px;
        color: #101010;
    }
    .toolbar-icon i {
        margin: 5px 15px;
        font-size: 21px;
    }
    #omr-toolbar-scope i {
        font-size: 19px;
    }
    .search-icon {
        margin: 5px 0;
    }
    .search-icon i {
        font-size: 21px;
    }
    #omr-modal-search-feed {
        width: 76%;
        padding: 28px;
        left: 64px;
        max-height: calc(100% - 120px);
    }

    @media (prefers-color-scheme: dark) {
        .omr-search-form {
            background: #373737;
        }
        input[id=omr-search-input]:active, input[id=omr-search-input]:focus {
            background-color: #373737;
            color: #cecece;
        }
        .toolbar-icon {
            color: #cecece;
        }
    }
</style>

<div id="omr-top-toolbar" class="drag">
    {#if $activeTab === 'apps'}
        <div class="nav-wrapper no-drag omr-full-search">
            <div class="input-field omr-search-form">
                <input id="omr-search-input" type="search" class="" placeholder="{i18n('search')}" required
                    bind:value={searchKeyword} on:keyup={handleSearch} />
                <label class="label-icon search-icon" for="omr-search-input">
                    <i class="material-icons">search</i></label>
            </div>
        </div>
    {:else}
        <div class="nav-wrapper no-drag">
            <div class="input-field omr-search-form">
                <input id="omr-search-input" type="search" class="" placeholder="{i18n('search')}" required
                    bind:value={searchKeyword} on:keyup={handleSearch} />
                <label class="label-icon search-icon" for="omr-search-input">
                    <i class="material-icons">search</i></label>
            </div>
        </div>

        <div class="toolbar-group no-drag">
            {#if $activeTab === 'rss'}
                <div data-position="bottom" data-tooltip="{i18n('toggle.unread.all')}" class="toolbar-icon tooltipped" id="omr-toolbar-scope" on:click={handleToggleViewScope}>
                    <i class="material-icons">{ $viewScope === 'all' ? 'donut_large' : 'fiber_manual_record' }</i>
                </div>

                {#if showModeBtn}
                <div data-position="bottom" data-tooltip="{i18n('toggle.view')}" class="toolbar-icon tooltipped" id="omr-toolbar-mode" on:click={handleToggleViewMode}>
                    <i class="material-icons">{$rssViewMode === 'feed' ? 'view_module' : 'view_list'} </i>
                </div>

                <div data-position="bottom" data-tooltip="{i18n('mark.all.as.read')}" class="toolbar-icon tooltipped" id="dino-mark-all" on:click={handleMarkAllAsRead}>
                    <i class="material-icons">done_all</i>
                </div>
                {/if}
            {:else if $activeTab === 'star' && showModeBtn}
                <div data-position="bottom" data-tooltip="{i18n('toggle.view')}" class="toolbar-icon tooltipped" id="omr-toolbar-mode" on:click={handleToggleViewMode}>
                    <i class="material-icons">{$starViewMode === 'feed' ? 'view_module' : 'view_list'} </i>
                </div>
            {/if}

            <div data-position="bottom" data-tooltip="{i18n('refresh')}" class="toolbar-icon tooltipped" id="omr-toolbar-update"  on:click={handleRefreshAction}>
                <i class="material-icons">update</i>
            </div>

        </div>
    {/if}
</div>

<div id="omr-modal-search-feed" class="modal">
    <div class="modal-title"><i class="material-icons">search</i> {i18n('search')} "{searchKeyword}"</div>

    {#if searchRsp}
    <div class="row">
        {#each searchRsp.data as feed}
        <div class="col s6">
            <FeedCard feedInfo={feed} />
        </div>
        {/each}
    </div>
    {/if}
</div>
