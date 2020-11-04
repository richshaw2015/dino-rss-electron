<script>
    import { onMount } from 'svelte'
    const { ipcRenderer } = require('electron')
    const Mousetrap = require('mousetrap')

    import { toggleMaximizeWindow, macNavCtxMenu, isWin, closeWindow, toast, reloadWindow, resizeImageUrl, warnToast } from '../utils/helper.js'
    import { getToken, saveUserInfo, setToken } from '../utils/storage.js';
    import { apiReq, isValidUrl } from '../utils/req.js';
    import { activeTab, unreadCountRsp, userInfoRsp, isApiLoading } from '../utils/store.js'
    import Titlebar from './Titlebar.svelte'
    
    let feedUrl

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('x', function() {
            closeWindow()
            return false
        });
        Mousetrap.bind('f5', function() {
            reloadWindow()
            return false
        });
    })

    ipcRenderer.on('login-status-changed', (event) => {
        // try multi times
        setTimeout(syncUserInfo, 1)
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

                    reloadWindow()
                }
            }).catch(err => {
                console.log(err + " User info")
            })
        }
    }

    function showLoginOrUser(event) {
        const token = getToken()
        if (token) {
            if ($userInfoRsp.id > 0) {
                const instanse = M.Modal.init(document.querySelector('#omr-modal-user-info'), {
                    inDuration: 0,
                    outDuration: 0,
                    opacity: 1,
                    endingTop: event.y + 'px'
                });
                instanse.open()
            } else {
                ipcRenderer.invoke('show-login-window', token)
            }
        }
    }

    function showAddFeedWindow(event) {
        const instanse = M.Modal.init(document.querySelector('#omr-modal-add-feed'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 1,
            endingTop: "15%"
        });
        instanse.open()
    }
    
    function handleAddFeed(event) {
        if (isValidUrl(feedUrl)) {
            isApiLoading.set(true)
            apiReq('/api/feed/add', {feed_rss: feedUrl}).then( rsp => {
                if (rsp.code === 0) {
                    toast("Feed add success")
                } else {
                    warnToast(`Parse error: ${feedUrl}`)
                }
            }).catch(err => {
                warnToast(err + " Request")
            }).finally(() => { 
                isApiLoading.set(false)
            });
        } else {
            warnToast(`Url not valid: ${feedUrl}`)
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
    #omr-modal-user-info {
        width: 300px;
        margin: 0;
        padding: 24px;
        left: 70px;
    }
    #omr-modal-add-feed {
        width: 600px;
        padding: 24px;
        left: 70px;
    }
    .user-top-wrapper, .user-info {
        display: flex;
        justify-content: center;
    }
    .user-info {
        flex-direction: column;
        flex-grow: 1;
    }
    .user-oauth {
        color: #616161;
    }
    .user-name {
        font-size: 1.2rem;
    }
    .user-name a {
        color: unset;
    }
    .user-image {
        max-width: 64px;
        max-height: 64px;
    }

    .user-image-wrapper {
        position: relative;
        width: 100%;
    }
    .avatar-vip-badge {
        position: absolute;
        top: 38px;
        right: 0px;
        width: 20px;
        height: 20px;
        font-size: 14px;
        border-radius: 50%;
        color: white;
        display: flex;
        justify-content: center;
        background: #ff9d28;
        box-shadow: 0 0 0 1px #fff;
    }

    .user-divider {
        margin: 16px 0;
    }
    .submit-feed {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60px;
        margin-bottom: 12px;
    }
    .rss-input-wrapper {
        margin: 0;
        flex-grow: 1;
    }
    .rss-submit-btn {
        margin-left: 1rem;
    }
    .submit-divider {
        margin: 12px 0;
    }
    .submit-opml, .feed-ranking {
        display: flex;
        align-items: center;
        text-transform: none;
        justify-content: center;
        font-size: 1.1rem;
    }
    .add-title {
        font-size: 1.5rem;
        margin-bottom: 1.2rem;
    }
    .add-title i {
        cursor: auto;
    }
    .app-icon {
        margin-left: 12px;
        margin-right: 10px;
    }
    .import-icon {
        font-size: 24px;
    }
</style>

<div id="omr-left-nav" class="drag">
    {#if isWin()}
        <Titlebar />
    {/if}
    <div id="omr-nav-avatar" class="nav-tab-btn no-drag {isWin() ? 'margin-win32' : ''}" on:click={showLoginOrUser}>
        <img src="{resizeImageUrl($userInfoRsp.image)}" alt="Avatar">
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

    <div class="nav-tab-btn no-drag" id="omr-nav-add" on:click={showAddFeedWindow}>
        <i class="material-icons">add_circle</i>
    </div>
</div>

<div id="omr-modal-user-info" class="modal">
    <div class="user-top-wrapper">
        <div class="user-info">
            <div class="user-name bold"><a href="{$userInfoRsp.blog}" target="_blank">{$userInfoRsp.name}</a></div>
            <div class="user-oauth">ID: {$userInfoRsp.oauth}</div>
        </div>

        <div>
            <div class="user-image-wrapper">
                <img class="user-image circle" src="{resizeImageUrl($userInfoRsp.image)}" alt="Avatar">
    
                {#if $userInfoRsp.level >= 10}
                    <span class="avatar-vip-badge">V</span>
                {/if}
            </div>
        </div>
    </div>

    <div class="divider user-divider"></div>

    {#if $userInfoRsp.intro}
        <div class="user-intro-wrapper">{$userInfoRsp.intro}</div>
    {:else}
        <div class="user-intro-wrapper"><a href="{$userInfoRsp.blog}" target="_blank">{$userInfoRsp.blog}</a></div>
    {/if}
</div>

<div id="omr-modal-add-feed" class="modal">
    <div class="add-title"><i class="material-icons">rss_feed</i> Add Subscription</div>

    <div class="submit-feed">
        <div class="input-field rss-input-wrapper">
            <input id="rss-input" type="text" data-length="1024" bind:value={feedUrl}>
            <label for="rss-input">Feed URL</label>
        </div>

        <button class="waves-effect waves-light btn rss-submit-btn" on:click={handleAddFeed}>Add</button>
    </div>

    <div class="waves-effect btn-flat submit-opml">
        <i class="material-icons app-icon import-icon">import_export</i>Import from OPML
    </div>
    
    <div class="divider submit-divider"></div>

    <div class="waves-effect btn-flat feed-ranking">
        <i class="material-icons app-icon equalizer-icon">equalizer</i>Feed ranking
    </div>
</div>