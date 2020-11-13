<script>
    export let currentPage = 1
    export let numPages

    import { createEventDispatcher, onMount } from 'svelte'
    import { warnToast } from '../utils/helper.js'

    const dispatch = createEventDispatcher()
    const Mousetrap = require('mousetrap')

    function nextPage() {
        if (currentPage < numPages) {
            dispatch('refresh-list-view', {page: currentPage + 1 })
        } else {
            warnToast("Already the last page")
        }
    }
    function prevPage() {
        if (currentPage > 1) {
            dispatch('refresh-list-view', { page: currentPage - 1 })
        } else {
            warnToast("Already the first page")
        }
    }
    function firstPage() {
        if (currentPage > 1) {
            dispatch('refresh-list-view', { page: 1 })
        } else {
            warnToast("Already the first page")
        }
    }
    function lastPage() {
        if (currentPage < numPages) {
            dispatch('refresh-list-view', { page: numPages })
        } else {
            warnToast("Already the last page")
        }
    }

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind(['p', 'right'], function() {
            nextPage(true)
            return false
        });
        Mousetrap.bind(['P', 'left'], function() {
            prevPage(true)
            return false
        });
    })
</script>

<style>
    #omr-pager {
        width: 100%;
        max-width: 400px;
        border-top: 1px dashed rgba(0,0,0,0.14);
        /*border: 0.5px dashed red;*/
    }
    .pagination {
        display: flex;
        justify-content: center;
    }
    .pagination li {
        width: 16%;
        margin: auto 2%;
        border-radius: 3px;
    }
    .current-page a {
        color: #fff;
        cursor: default;
    }
</style>

<div id="omr-pager">
    <ul class="pagination">
        <li class="{ currentPage > 1 ? 'waves-effect' : 'disabled' }" title="Previous page" on:click={prevPage}>
            <a href={'#'}><i class="material-icons">chevron_left</i></a></li>

        <li class="{ currentPage > 1 ? 'waves-effect' : 'disabled' }" title="First page" on:click={firstPage}>
            <a href={'#'}>1</a></li>

        <li class="current-page primary-bg-color" title="Current page"><a href={'#'}>{currentPage}</a></li>

        <li class="{ currentPage < numPages ? 'waves-effect' : 'disabled' }" title="Last page" on:click={lastPage}>
            <a href={'#'}>{ numPages }</a></li>

        <li class="{ currentPage < numPages ? 'waves-effect' : 'disabled' }" title="Next page" on:click={nextPage}>
            <a href={'#'}><i class="material-icons">chevron_right</i></a></li>
    </ul>
</div>
