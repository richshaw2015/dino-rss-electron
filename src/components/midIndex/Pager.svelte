<script>
    export let currentPage = 1
    export let numPages

    import { createEventDispatcher, onMount } from 'svelte'
    import { shortToast } from '../utils/toast.js'

    const dispatch = createEventDispatcher()
    const Mousetrap = require('mousetrap')

    function nextPage(fromKbd=false) {
        if (currentPage < numPages) {
            if (fromKbd) {
                shortToast("Next page")
            }
            dispatch('refresh-list-view', {page: currentPage + 1 })
        }
    }
    function prevPage(fromKbd=false) {
        if (currentPage > 1) {
            if (fromKbd) {
                shortToast("Previous page")
            }
            dispatch('refresh-list-view', { page: currentPage - 1 })
        }
    }
    function firstPage() {
        if (currentPage > 1) {
            dispatch('refresh-list-view', { page: 1 })
        }
    }
    function lastPage() {
        if (currentPage < numPages) {
            dispatch('refresh-list-view', { page: numPages })
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
        width: 14%;
        margin: auto 3%;
        border-radius: 4px;
    }
    .current-page a {
        color: #fff;
        cursor: default;
    }
</style>

<div id="omr-pager">
    <ul class="pagination">
        <li class="{ currentPage > 1 ? 'waves-effect' : 'disabled' }" title="Previous Page" on:click={prevPage}>
            <a href={'#'}><i class="material-icons">chevron_left</i></a></li>

        <li class="{ currentPage > 1 ? 'waves-effect' : 'disabled' }" title="First Page" on:click={firstPage}>
            <a href={'#'}>1</a></li>

        <li class="current-page primary-bg-color" title="Current Page"><a href={'#'}>{currentPage}</a></li>

        <li class="{ currentPage < numPages ? 'waves-effect' : 'disabled' }" title="Last Page" on:click={lastPage}>
            <a href={'#'}>{ numPages }</a></li>

        <li class="{ currentPage < numPages ? 'waves-effect' : 'disabled' }" title="Next Page" on:click={nextPage}>
            <a href={'#'}><i class="material-icons">chevron_right</i></a></li>
    </ul>
</div>
