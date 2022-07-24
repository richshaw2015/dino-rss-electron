<script>
    const { ipcRenderer } = require('electron')

    const mainWindow = require('@electron/remote').getCurrentWindow()

    let findKeyword
    let activeMatch
    let matchesNum

    function focusFindInput(){
        try {
            document.getElementById('omr-find-input').select()
        } catch(err) {
            console.warn(err)
        }
    }

    function showFindWindow() {
        const instanse = M.Modal.init(document.querySelector('#omr-modal-find-in-page'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 0.1,
            endingTop: document.querySelector('#omr-post-title-bar').offsetHeight + 'px'
        });

        instanse.open()
        focusFindInput()
    }

    ipcRenderer.on('found-in-page-content', (event, result) => {
        if (result.matches === 1) {
            [activeMatch, matchesNum] = [0, 0]
            showFindWindow()
        } else {
            [activeMatch, matchesNum] = [result.activeMatchOrdinal, result.matches]
        }
    })

    function findPrev() {
        if (findKeyword && matchesNum > 1) {
            mainWindow.webContents.findInPage(findKeyword, {findNext: true, forward: false})
        }
    }
    function findNext() {
        if (findKeyword && matchesNum > 1) {
            mainWindow.webContents.findInPage(findKeyword, {findNext: true})
        }
    }
    function findClose() {
        if (findKeyword) {
            [activeMatch, matchesNum] = [0, 0]
            mainWindow.webContents.stopFindInPage('clearSelection')
        }

        try {
            M.Modal.getInstance(document.querySelector('#omr-modal-find-in-page')).close();
        } catch (e) {}
    }
    function findStart(event) {
        if (event.keyCode === 13 && findKeyword !== undefined) {
            event.preventDefault();

            if (findKeyword === '') {
                [activeMatch, matchesNum] = [undefined, undefined]
                mainWindow.webContents.stopFindInPage('activateSelection')
            } else {
                mainWindow.webContents.findInPage(findKeyword)
            }
        }
    }

    // calculate drag area
    let coordX
    function dragStart(event) {
        coordX = event.x
    }
    function dragEnd(event) {
        coordX =event.x - coordX
        document.getElementById("omr-modal-find-in-page").style.left = 
            document.getElementById("omr-modal-find-in-page").offsetLeft + coordX + 'px'
    }

    import { onMount } from 'svelte';

    onMount(() => {
        Mousetrap.bind(['command+f', 'ctrl+f', '/'], function() {
            showFindWindow()
            return false
        })
        Mousetrap.bind('enter', function() {
            findNext()
            return false
        })
        Mousetrap.bind('shift+enter', function() {
            findPrev()
            return false
        })
        Mousetrap.bind('esc', function() {
            findClose()
            return false
        })
    });
</script>

<style>
    #omr-modal-find-in-page {
        margin: 0;
        padding: 7px 4px 7px 16px;
        left: calc(100vw - 360px - 54px);
        height: 48px;
        width: 360px;
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
        border-right: 1px solid rgba(0,0,0,0.14)
    }
    .find-btns .disabled {
        cursor: default;
        color: #999;
    }
    @media (prefers-color-scheme: dark) {
        #omr-modal-find-in-page input {
            color: #cecece;
        }
        .vertical-line {
            border-color: #373737;
        }
        .find-btns .disabled {
            color: #444;
        }
    }
</style>


<div id="omr-modal-find-in-page" class="modal" draggable="true" on:dragstart={dragStart} on:dragend="{dragEnd}">
    <div class="find-inner">
        <input type="text" id="omr-find-input" bind:value={findKeyword} on:keyup={findStart} />

        {#if matchesNum >= 0}
            <span class="find-stats">{activeMatch}/{matchesNum}</span>
        {:else}
            <span class="find-stats"></span>
        {/if}

        <div class="vertical-line"></div>
        <div class="find-btns">
            <i class="material-icons find-prev { matchesNum > 1 ? '' : 'disabled' }" on:click="{findPrev}">expand_less</i>
            <i class="material-icons find-next { matchesNum > 1 ? '' : 'disabled' }" on:click="{findNext}">expand_more</i>
            <i class="material-icons find-close" on:click="{findClose}">clear</i>
        </div>
    </div>
</div>
