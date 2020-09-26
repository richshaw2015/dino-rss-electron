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
        width: 162px;
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

<script>
    export let viewScope = 'all' // unread / all
    export let viewMode = 'feed'
    export let activeTab = 'star' // star / rss / apps

    function toggleViewMode() {
        // TODO save to localstorage
        viewMode = (viewMode === 'feed') ? 'entry' : 'feed'
    }
    function toggleViewScope() {
        viewScope = (viewScope === 'all') ? 'unread' : 'all'
    }
</script>

<div id="omr-top-toolbar" class="drag">
    <div class="nav-wrapper no-drag {activeTab === 'apps' ? 'omr-full-search' : ''}">
        <div class="input-field omr-search-form">
            <input id="omr-search-input" type="search" class="" placeholder="Search" required>
            <label class="label-icon search-icon" for="omr-search-input">
                <i class="material-icons">search</i></label>
        </div>
    </div>

    {#if activeTab !== 'apps'}
    <div class="toolbar-group no-drag">
        {#if activeTab !== 'star'}
        <div class="toolbar-icon" id="omr-toolbar-scope" on:click={toggleViewScope}>
            <i class="material-icons">{ viewScope === 'all' ? 'donut_large' : 'fiber_manual_record' }</i>
        </div>
        {/if}

        <div class="toolbar-icon" id="omr-toolbar-mode" on:click={toggleViewMode}>
            <i class="material-icons">{viewMode === 'feed' ? 'view_module' : 'view_list'} </i>
        </div>

        <div class="toolbar-icon" id="omr-toolbar-update">
            <i class="material-icons">update</i>
        </div>
    </div>
    {/if}
</div>