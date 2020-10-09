<script>
    function showFindWindow(event) {
        const width = 360

        const instanse = M.Modal.init(document.querySelector('#omr-modal-find-in-page'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 1,
            endingTop: document.querySelector('#omr-post-title-bar').offsetHeight + 'px'
        });
        document.querySelector('#omr-modal-find-in-page').style.width = `${width}px`

        instanse.open()
    }

    import { onMount } from 'svelte';
    onMount(() => {
        Mousetrap.bind('/', function() {
            showFindWindow()
            return false
        });
    });
</script>

<style>
    #omr-modal-find-in-page {
        margin: 0;
        padding: 7px 4px 7px 16px;
        left: unset !important;
        right: 54px;
        height: 48px;
    }
    #omr-modal-find-in-page input {
        height: 100%;
        border: none;
        margin: 0;
        border-width: 0; 
        box-shadow: none;
        font-size: 0.95rem;
        width: 160px;
        min-width: 120px;
    }
    #omr-modal-find-in-page input:focus {
        border: none;
        border-width: 0; 
        box-shadow: none;     
    }
    .find-stats {
        min-width: 30px;
        flex-grow: 1;
        padding-left: 16px;
        padding-right: 16px;
        font-size: 0.9rem;
    }
    .find-inner, .find-btns {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .find-btns {
        width: 108px;
        justify-content: space-evenly;
    }
    .find-prev, .find-next {
        font-size: 20px;
    }
    .find-close {
        font-size: 18px;
    }
    .vertical-line {
        height: 100%;
        width: 1px;
        border-right: 1px dashed rgba(0,0,0,0.14)
    }
</style>

<div id="omr-find-in-page">
    <div id="omr-modal-find-in-page" class="modal">
        <div class="find-inner">
            <input type="text" />
            <span class="find-stats">1/345</span>

            <div class="vertical-line"></div>
            <div class="find-btns">
                <i class="material-icons find-prev" on:click="">expand_less</i>
                <i class="material-icons find-next" on:click="">expand_more</i>
                <i class="material-icons find-close" on:click="">clear</i>
            </div>
        </div>
    </div>
</div>
