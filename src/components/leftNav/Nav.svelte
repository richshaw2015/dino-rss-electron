<script>
    import { onMount } from 'svelte'
    const { ipcRenderer } = require('electron')
    const Mousetrap = require('mousetrap')

    import { toggleMaximizeWindow, macNavCtxMenu, isWin, closeWindow, toast } from '../utils/helper.js'
    import { getToken, saveUserInfo, setToken } from '../utils/storage.js';
    import { apiReq } from '../utils/req.js';
    import { activeTab, unreadCountRsp, userInfoRsp } from '../utils/store.js'
    import Titlebar from './Titlebar.svelte'

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('x', function() {
            closeWindow()
            return false
        });
    })

    ipcRenderer.on('login-status-changed', (event) => {
        // try multi times
        syncUserInfo()
        setTimeout(syncUserInfo, 1000)
        setTimeout(syncUserInfo, 3000)
        setTimeout(syncUserInfo, 5000)
        setTimeout(syncUserInfo, 10000)
        setTimeout(syncUserInfo, 30000)
    })
    
    function syncUserInfo() {
        if ($userInfoRsp.id <= 0) {
            apiReq('/api/user/info', {}).then( rsp => {
                if (rsp.code === 0 && rsp.id > 0) {
                    if (rsp.token) {
                        setToken(rsp.token)
                    }
                    userInfoRsp.set(rsp)
                    saveUserInfo(rsp)
                }
            }).catch(err => {
                console.log(err + " User info")
            })
        }
    }

    function showLoginOrUser() {
        const token = getToken()
        if (token) {
            if ($userInfoRsp.id > 0) {
                // display user info
            } else {
                // OAuth login 
                ipcRenderer.invoke('show-login-window', token)
            }
        }
    }
</script>

<style>
    #omr-left-nav {
        height: 100%;
        min-height: 600px;
        min-width: 70px;
        max-width: 70px;
        background: #24292E;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #omr-nav-avatar {
        margin-top: 64px;
    }
    .margin-win32 {
        margin-top: 28px !important;
    }
    #omr-nav-avatar img {
        width: 36px;
        height: 36px;
        margin: auto;
        display: block;
    }
    .nav-tab-btn {
        display: flex;
        align-items: center;
        width: 100%;
        height: 36px;
        color: #CDCDCD;
        user-select: none;
    }
    .nav-tab-btn i {
        height: 24px;
        width: 24px;
        margin: auto;
    }
    #omr-nav-apps, #omr-nav-star, #omr-nav-rss{
        margin-top: 24px;
    }
    #omr-nav-add {
        margin-bottom: 32px;
    }
    #omr-nav-space {
        flex-grow: 1;
        width: 100%;
        cursor: move;
    }
    .rss-notify-wrapper {
        position: relative;
        width: 100%;
    }
    .rss-notify-wrapper i {
        margin-left: 23px;
    }
    .rss-notify-badge {
        position: absolute;
        top: -5px;
        right: 12px;
        padding: 1px 5px;
        min-width: 18px;
        min-height: 18px;
        border-radius: 50%;
        color: white;
        font-size: 11px;
        display: flex;
        justify-content: center;
    }
</style>

<div id="omr-left-nav" class="drag">
    {#if isWin()}
        <Titlebar />
    {/if}
    <div id="omr-nav-avatar" class="nav-tab-btn no-drag {isWin() ? 'margin-win32' : ''}" on:click={showLoginOrUser}>
        <img src="{$userInfoRsp.image}" alt="Avatar">
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-rss" on:click={() => activeTab.set('rss')}>
        <div class="rss-notify-wrapper">
            <i class="material-icons {$activeTab === 'rss' ? 'primary-color' : ''}">rss_feed</i>
            {#if $unreadCountRsp.count > 0}
                <span class="rss-notify-badge second-bg-color">
                    {$unreadCountRsp.count <= 999 ? $unreadCountRsp.count : '···'}
                </span>
            {/if}
        </div>
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-star" on:click={() => activeTab.set('star')}>
        <i class="material-icons {$activeTab === 'star' ? 'primary-color' : ''}">star</i>
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-apps" on:click={() => activeTab.set('apps')}>
        <i class="material-icons {$activeTab === 'apps' ? 'primary-color' : ''}">apps</i>
    </div>

    <div id="omr-nav-space" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
    </div>

    <div class="nav-tab-btn no-drag" id="omr-nav-add">
        <i class="material-icons">add_circle</i>
    </div>
</div>
