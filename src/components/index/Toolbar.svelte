<style>
    #omr-top-toolbar {
        width: 400px;
        height: 34px;
        display: flex;
        /*border: 1px dashed red;*/
    }
    .toolbar-group {
        width: 180px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .omr-search-form {
        width: 220px;
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
    .omr-full-search {
        width: 400px;
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
    export let scope = 'all'
    export let mode = 'feed'
    export let activeTab = 'star'
</script>

<div id="omr-top-toolbar">
    <div class="nav-wrapper">
        <div class="input-field omr-search-form {activeTab === 'apps' ? 'omr-full-search' : ''}">
            <input id="omr-search-input" type="search" class="" placeholder="Search" required>
            <label class="label-icon search-icon" for="omr-search-input">
                <i class="material-icons">search</i></label>
        </div>
    </div>

    {#if activeTab !== 'apps'}
    <div class="toolbar-group">
        {#if activeTab !== 'star'}
        <div class="toolbar-icon" id="omr-toolbar-scope">
            <i class="material-icons">{ scope === 'all' ? 'donut_large' : 'fiber_manual_record' }</i>
        </div>
        {/if}

        <div class="toolbar-icon" id="omr-toolbar-mode">
            <i class="material-icons">{mode === 'feed' ? 'view_module' : 'view_list'} </i>
        </div>

        <div class="toolbar-icon" id="omr-toolbar-update">
            <i class="material-icons">update</i>
        </div>
    </div>
    {/if}
</div>