<script>
    import { isWin, dblClickTitleBar } from '../utils/helper.js'
    const { remote } = require('electron')
    const mainWindow = remote.getCurrentWindow()

    export let isMaximized = false

    function minimizeWindow() {
        mainWindow.minimize()
    }
    
    function closeWindow() {
        mainWindow.close()
    }

    mainWindow.on('maximize', (e, cmd) => {
        isMaximized = true
    })
    mainWindow.on('unmaximize', (e, cmd) => {
        isMaximized = false
    })
</script>

<style>
    #omr-win-titlebar {
        height: 36px;
        min-width: 70px;
        max-width: 70px;
        background: #24292E;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    #omr-win-titlebar img {
        display: block;
    }
</style>

<div id="omr-win-titlebar" class="no-drag">
    <img src="./icon/windows/titlebar-minimize.svg" alt="Minimize" on:click={minimizeWindow}>

    {#if isMaximized}
        <img src="./icon/windows/titlebar-restore.svg" alt="Restore" on:click={dblClickTitleBar}>
    {:else}
        <img src="./icon/windows/titlebar-maximize.svg" alt="Maximize" on:click={dblClickTitleBar}> 
    {/if}

    <img src="./icon/windows/titlebar-close.svg" alt="Close" on:click="{closeWindow}">
</div>
