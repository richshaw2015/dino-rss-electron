<script>
    export let isMaximized = false

    import { toggleMaximizeWindow, minimizeWindow, closeWindow } from '../utils/helper.js'
    const { ipcRenderer } = require('electron')

    ipcRenderer.on('maximize-window', () => {
        isMaximized = true
    })
    ipcRenderer.on('unmaximize-window', () => {
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
        user-select: none;
    }
</style>

<div id="omr-win-titlebar" class="no-drag">
    <img src="./icon/windows/titlebar-minimize.svg" alt="Minimize" on:click={minimizeWindow}>

    {#if isMaximized}
        <img src="./icon/windows/titlebar-restore.svg" alt="Restore" on:click={toggleMaximizeWindow}>
    {:else}
        <img src="./icon/windows/titlebar-maximize.svg" alt="Maximize" on:click={toggleMaximizeWindow}> 
    {/if}

    <img src="./icon/windows/titlebar-close.svg" alt="Close" on:click="{closeWindow}">
</div>
