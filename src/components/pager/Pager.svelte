<script>
    export let curPage = 2;
    export let numPages = 9;
    // export let newPage = 0;
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
    .cur_page a {
        color: #fff;
    }
</style>

<div id="omr-pager">
    <ul class="pagination">
        <li class="{ curPage > 1 ? 'waves-effect' : 'disabled' }" title="Previous Page">
            <a href={'#'}><i class="material-icons">chevron_left</i></a></li>

        <li class="{ curPage > 1 ? 'waves-effect' : 'disabled' }" title="First Page"><a href={'#'}>1</a></li>
        <li class="cur_page primary-bg-color" title="Current Page"><a href={'#'}>{curPage}</a></li>
        <li class="{ curPage < numPages ? 'waves-effect' : 'disabled' }" title="Last Page">
            <a href={'#'}>{ numPages }</a></li>

        <li class="{ curPage < numPages ? 'waves-effect' : 'disabled' }" title="Next Page">
            <a href={'#'}><i class="material-icons">chevron_right</i></a></li>
    </ul>
</div>
