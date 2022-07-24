<script>
    export let currentPage = 1
    export let numPages

    import { createEventDispatcher, onMount } from 'svelte'
    import { warnToast, i18n} from '../utils/helper.js'

    const dispatch = createEventDispatcher()
    const Mousetrap = require('mousetrap')

    function nextPage() {
        if (currentPage < numPages) {
            dispatch('refresh-list-view', {page: currentPage + 1 })
        } else {
            warnToast(i18n('already.last.page'))
        }
    }
    function prevPage() {
        if (currentPage > 1) {
            dispatch('refresh-list-view', { page: currentPage - 1 })
        } else {
            warnToast(i18n('already.first.page'))
        }
    }
    function firstPage() {
        if (currentPage > 1) {
            dispatch('refresh-list-view', { page: 1 })
        } else {
            warnToast(i18n('already.first.page'))
        }
    }
    function lastPage() {
        if (currentPage < numPages) {
            dispatch('refresh-list-view', { page: numPages })
        } else {
            warnToast(i18n('already.last.page'))
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
    }
    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 6px;
        margin-bottom: 6px;
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
    @media (prefers-color-scheme: dark) {
        .pagination li.disabled a {
            color: #444;
        }
        .pagination li a {
            color: #999;
        }
        .current-page a {
            color: #555 !important;
        }
        .current-page {
            background-color: #cdcdcd;
            opacity: 0.8;
        }
    }
</style>

<div id="omr-pager">
    <ul class="pagination">
        <li class="{ currentPage > 1 ? 'waves-effect' : 'disabled' }" title="{i18n('prev.page')}" on:click={prevPage}>
            <a href={'#'}><i class="material-icons">chevron_left</i></a></li>

        <li class="{ currentPage > 1 ? 'waves-effect' : 'disabled' }" title="{i18n('first.page')}" on:click={firstPage}>
            <a href={'#'}>1</a></li>

        <li class="current-page primary-bg-color"><a href={'#'}>{currentPage}</a></li>

        <li class="{ currentPage < numPages ? 'waves-effect' : 'disabled' }" title="{i18n('last.page')}" on:click={lastPage}>
            <a href={'#'}>{ numPages }</a></li>

        <li class="{ currentPage < numPages ? 'waves-effect' : 'disabled' }" title="{i18n('next.page')}" on:click={nextPage}>
            <a href={'#'}><i class="material-icons">chevron_right</i></a></li>
    </ul>
</div>
