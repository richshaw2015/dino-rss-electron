<script>
    import { onMount } from 'svelte'
    const { ipcRenderer } = require('electron')
    const Mousetrap = require('mousetrap')
    const fs = require('fs')
    const { dialog } = require('@electron/remote')

    import { toggleMaximizeWindow, macNavCtxMenu, isWin, isLinux, closeWindow, toast, reloadWindow, fixAvatarUrl, i18n,
        warnToast, readableCount, shortToast, toggleDevTools, appVersion, getPlatform, getArch } from '../utils/helper.js'
    import { getToken, saveUserInfo, saveToken, getImgMode, getAppearance, setMasVerify, deleteMasVerify,
        isMasVerify } from '../utils/storage.js';
    import { apiReq, isValidUrl } from '../utils/req.js';
    import { activeTab, unreadCountRsp, userInfoRsp, isApiLoading, isForceLoading, upgradeRsp, readingMode } from '../utils/store.js'
    import Titlebar from './Titlebar.svelte'
    
    let feedUrl
    let loginModalInstance

    onMount(() => {
        // init appearance
        ipcRenderer.invoke('toggle-appearance', getAppearance())

        // keyboard shortcut
        Mousetrap.bind('x', function() {
            closeWindow()
            return false
        });
        Mousetrap.bind('f5', function() {
            reloadWindow()
            return false
        });
        Mousetrap.bind('f12', function() {
            toggleDevTools()
            return false
        });
        Mousetrap.bind('.', function() {
            readingMode.set(!$readingMode)
            return false
        });
        Mousetrap.bind('M', function() {
            document.getElementById('dino-mark-all').click()
            return false
        });

        ipcRenderer.invoke('image-mode-change', getImgMode())

        if (process.mas) {
            // demo mode for apple verify
            apiReq('/api/user/demo', {version: appVersion()}).then( rsp => {
                if (rsp.code === 0) {
                    setMasVerify(JSON.stringify(rsp))
                } else {
                    deleteMasVerify()
                }
            }).catch(err => {})
        }

        if (!process.mas) {
            setTimeout(() => {
                // check update after 15 seconds
                apiReq('/api/app/check/upgrade/v2', {version: appVersion(), platform: getPlatform(), arch: getArch()}).then( rsp => {
                    if (rsp.code === 0) {
                        upgradeRsp.set(rsp)

                        const instanse = M.Modal.init(document.querySelector('#omr-modal-upgrade'), {
                            inDuration: 0,
                            outDuration: 0,
                            opacity: 0.3,
                            dismissible: false,
                            endingTop: "15%"
                        });
                        instanse.open()
                    }
                }).catch(err => {
                    console.warn(err)
                })
            }, 15000)
        }
    })

    ipcRenderer.on('login-status-changed', (event) => {
        // try multi times
        setTimeout(syncVisitorInfo, 1)
        setTimeout(syncVisitorInfo, 1000)
        setTimeout(syncVisitorInfo, 3000)
        setTimeout(syncVisitorInfo, 5000)
        setTimeout(syncVisitorInfo, 10000)
        setTimeout(syncVisitorInfo, 30000)
    })

    // Login loading process
    ipcRenderer.on('loading-login-window', (event) => {
        isApiLoading.set(true)
        isForceLoading.set(true)
    })
    ipcRenderer.on('finish-login-window', (event) => {
        isApiLoading.set(false)
        isForceLoading.set(false)
    })

    function syncVisitorInfo() {
        if ($userInfoRsp.id <= 0) {
            apiReq('/api/user/info', {}).then( rsp => {
                if (rsp.code === 0 && rsp.id > 0) {
                    if ($userInfoRsp.id <= 0) {
                        if (rsp.token) {
                            saveToken(rsp.token)
                        }
                        saveUserInfo(rsp)
                        userInfoRsp.set(rsp)

                        reloadWindow()
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    function syncDemoUserInfo(rsp) {
        if (rsp.code === 0 && rsp.id > 0) {
            saveToken(rsp.token)
            saveUserInfo(rsp)
            userInfoRsp.set(rsp)

            reloadWindow()
        }
    }

    function syncUserInfo() {
        if ($userInfoRsp.id > 0) {
            apiReq('/api/user/info', {}).then( rsp => {
                if (rsp.code === 0 && rsp.id) {
                    saveUserInfo(rsp)
                    userInfoRsp.set(rsp)
                }
            }).catch(err => {
                console.log(err)
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
                    opacity: 0.1,
                    endingTop: event.y + 'px'
                });
                instanse.open()
                
                syncUserInfo()
            } else {
                loginModalInstance = M.Modal.init(document.querySelector('#omr-modal-oauth-login'), {
                    inDuration: 0,
                    outDuration: 0,
                    opacity: 0.1,
                    endingTop: event.y + 'px'
                });
                loginModalInstance.open()
            }
        }
    }

    function handleGithubLogin() {
        if (loginModalInstance) {
            loginModalInstance.close()
        }

        const verifyRsp = isMasVerify()
        if (process.mas && verifyRsp) {
            syncDemoUserInfo(JSON.parse(verifyRsp))
        } else {
            ipcRenderer.invoke('show-login-window', {token: getToken(), sdk: "github"})
        }
    }
    function  handleGoogleLogin() {
        if (loginModalInstance) {
            loginModalInstance.close()
        }

        ipcRenderer.invoke('show-login-window', {token: getToken(), sdk: "google"})
    }

    function  handleAppleLogin() {
        if (loginModalInstance) {
            loginModalInstance.close()
        }

        ipcRenderer.invoke('show-login-window', {token: getToken(), sdk: "apple"})
    }

    function showAddFeedWindow(event) {
        const instanse = M.Modal.init(document.querySelector('#omr-modal-add-feed'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 0.5,
            endingTop: "15%"
        });
        instanse.open()
    }
    function showOpmlUploadDialog(event) {
		const options = {
            filters: [{ name: 'Opml', extensions: ['opml'] }],
            properties: ['openFile']
		}
        dialog.showOpenDialog(options).then((result) => {
			if (result.filePaths.length > 0) {
                const fileContent = fs.readFileSync(result.filePaths[0])

                if (fileContent.length < 1 * 1024 * 1024) {
                    isApiLoading.set(true)
                    apiReq('/api/feed/import/opml', {file: fileContent}).then( rsp => {
                        if (rsp.code === 0) {
                            toast(i18n("wait.a.moment"), 30*1000)

                            try {
                                M.Modal.getInstance(document.querySelector('#omr-modal-add-feed')).close();
                            } catch (e) {}
                        } else {
                            warnToast(i18n("file.parse.error"))
                        }
                    }).catch(err => {
                        warnToast(err)
                    }).finally(() => {
                        isApiLoading.set(false)
                    });
                } else {
                    warnToast(i18n("file.too.large"))
                }
			}
        }).catch(err => {
            warnToast(err)
        })
    }
    function handleAddFeed(event) {
        if (isValidUrl(feedUrl)) {
            isApiLoading.set(true)
            apiReq('/api/feed/add', {feed_rss: feedUrl}).then( rsp => {
                if (rsp.code === 0) {
                    toast(i18n("feed.add.success"))
                } else {
                    warnToast(i18n("feed.parse.error") + " " + feedUrl)
                }
            }).catch(err => {
                warnToast(err)
            }).finally(() => {
                isApiLoading.set(false)
            });
        } else {
            warnToast(i18n("feed.url.invalid") + " " + feedUrl)
        }
    }
</script>

<style>
    #omr-left-nav {
        height: 100%;
        min-height: 600px;
        min-width: 64px;
        max-width: 64px;
        background: rgb(247, 247, 247);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #omr-nav-avatar {
        margin-top: 60px;
        cursor: pointer;
    }
    .margin-win32 {
        margin-top: 28px !important;
    }
    #omr-nav-avatar img {
        width: 38px;
        height: 38px;
        margin: auto;
        display: block;
    }
    .nav-tab-btn {
        display: flex;
        align-items: center;
        width: 100%;
        height: 36px;
        color: black;
        user-select: none;
    }
    .nav-tab-btn i {
        height: 26px;
        width: 26px;
        font-size: 26px;
        margin: auto;
    }
    #omr-nav-apps, #omr-nav-star, #omr-nav-rss{
        margin-top: 24px;
    }
    .nav-tab-btn i:not(.primary-color) {
        opacity: 0.8;
    }
    .nav-tab-btn i:not(.primary-color):hover {
        opacity: 1;
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
        margin-left: 22px;
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
        left: 64px;
    }
    #omr-modal-add-feed, #omr-modal-upgrade {
        width: 600px;
        padding: 24px;
        left: 64px;
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
    /* TODO */
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
    /* TODO */

    .user-divider {
        margin: 16px 0;
    }
    .submit-feed {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60px;
        margin-bottom: 12px;
        margin-top: 20px;
    }
    .rss-input-wrapper {
        margin: 0;
        flex-grow: 1;
    }
    .rss-submit-btn {
        margin-left: 1rem;
    }
    .submit-opml {
        display: flex;
        align-items: center;
        text-transform: none;
        justify-content: center;
        font-size: 1.1rem;
    }
    .submit-opml i {
        margin-left: 12px;
        margin-right: 10px;
    }
    .import-icon {
        font-size: 24px;
    }
    .user-stats {
        display: flex;
        align-items: center;
        padding-top: 8px;
    }
    .user-stats i {
        font-size: 18px;
        cursor: auto;
    }
    .padding-space {
        width: 8px;
    }
    #omr-modal-upgrade ul li {
        list-style: disc;
        margin-left: 2rem;
        word-break: break-word;
    }
    #omr-modal-upgrade .modal-footer a {
        color: unset;
    }
    #omr-modal-oauth-login {
        width: 300px;
        margin: 0;
        padding: 24px;
        left: 64px;
    }
    .oauth-sdks {
        display: flex;
    }
    .sdk {
        cursor: pointer;
        display: block;
        width: 48px;
        height: 48px;
        margin: 8px 16px;
    }

    @media (prefers-color-scheme: dark) {
        #omr-left-nav { background: #1e1e1e; }

        .nav-tab-btn {
            color: #CDCDCD;
        }
    }
    .user-intro-wrapper {
        word-break: break-word;
    }
</style>

<div id="omr-left-nav" class="drag">
    {#if isWin() || isLinux()}
        <Titlebar />
    {/if}
    <div id="omr-nav-avatar" class="nav-tab-btn no-drag {isWin() || isLinux() ? 'margin-win32' : ''}" on:click={showLoginOrUser}>
        <img src="{fixAvatarUrl($userInfoRsp.image, $userInfoRsp.id)}" alt="Avatar" title="{$userInfoRsp.level > 1 ? i18n('my') : i18n('login')}">
    </div>

    <div title="{ i18n('rss') }" class="nav-tab-btn no-drag" id="omr-nav-rss" on:click={() => activeTab.set('rss')}>
        <div class="rss-notify-wrapper">
            <i class="material-icons {$activeTab === 'rss' ? 'primary-color' : ''}">rss_feed</i>
            {#if $unreadCountRsp.count > 0}
                <span class="rss-notify-badge second-bg-color">
                    {readableCount($unreadCountRsp.count)}
                </span>
            {/if}
        </div>
    </div>

    <div title="{ i18n('star') }" class="nav-tab-btn no-drag" id="omr-nav-star" on:click={() => activeTab.set('star')}>
        <i class="material-icons {$activeTab === 'star' ? 'primary-color' : ''}">star</i>
    </div>

    <div title="{ i18n('more') }" class="nav-tab-btn no-drag" id="omr-nav-apps" on:click={() => activeTab.set('apps')}>
        <i class="material-icons {$activeTab === 'apps' ? 'primary-color' : ''}">apps</i>
    </div>

    <div id="omr-nav-space" on:dblclick={toggleMaximizeWindow} on:contextmenu={macNavCtxMenu}>
    </div>

    <div title="{ i18n('feed.add') }" class="nav-tab-btn no-drag" id="omr-nav-add" on:click={showAddFeedWindow}>
        <i class="material-icons">add_circle</i>
    </div>
</div>

<div id="omr-modal-user-info" class="modal">
    <div class="user-top-wrapper">
        <div class="user-info">
            <div class="user-name bold"><a href="{$userInfoRsp.blog}" target="_blank">{$userInfoRsp.name}</a></div>
            <div class="user-oauth">ID: {$userInfoRsp.oauth}</div>

            <div class="user-stats">
                <i class="material-icons">rss_feed</i>{$userInfoRsp.stats.sub_feeds_count}
                <div class="padding-space"></div>
                <i class="material-icons">star_border</i>{$userInfoRsp.stats.star_entries_count}
            </div>
        </div>

        <div>
            <div class="user-image-wrapper">
                <img class="user-image circle" src="{fixAvatarUrl($userInfoRsp.image, $userInfoRsp.id)}" alt="Avatar">
    
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
    <div class="modal-title"><i class="material-icons">rss_feed</i> { i18n("add.subscription") }</div>

    <div class="submit-feed">
        <div class="input-field rss-input-wrapper">
            <input id="rss-input" type="text" data-length="1024" bind:value={feedUrl}>
            <label for="rss-input">Feed URL</label>
        </div>

        <button class="waves-effect waves-light btn btn-small rss-submit-btn" on:click={handleAddFeed}>{ i18n('feed.add') }</button>
    </div>

    <div class="waves-effect btn-flat submit-opml" on:click={showOpmlUploadDialog}>
        <i class="material-icons import-icon">import_export</i>{ i18n("import.from.opml") }
    </div>
    
    <!-- <div class="divider submit-divider"></div>

    <div class="waves-effect btn-flat feed-ranking">
        <i class="material-icons equalizer-icon">equalizer</i>Feed ranking
    </div> -->
</div>

<div id="omr-modal-oauth-login" class="modal">
    <div class="modal-title"><i class="material-icons">account_circle</i> { i18n("select.login") }</div>

    <div class="oauth-sdks">
        <picture title="GitHub" on:click={handleGithubLogin}>
            <source srcset="./icon/github_dark.png" media="(prefers-color-scheme: dark)">
            <img class="sdk" src="./icon/github_light.png" alt="GitHub" />
        </picture>

        <picture title="Google" on:click={handleGoogleLogin}>
            <source srcset="./icon/google_dark.png" media="(prefers-color-scheme: dark)">
            <img class="sdk" src="./icon/google_light.png" alt="Google" />
        </picture>

        <picture title="Apple" on:click={handleAppleLogin}>
            <source srcset="./icon/apple_dark.png" media="(prefers-color-scheme: dark)">
            <img class="sdk" src="./icon/apple_light.png" alt="Apple" />
        </picture>

    </div>

</div>

{#if $upgradeRsp.code === 0}
    <div id="omr-modal-upgrade" class="modal">
        <div class="modal-title">
            <i class="material-icons">flight</i> Dinosaur Rss {$upgradeRsp.version} available</div>

        <h6>{ i18n("change.log") }</h6>
        <ul>
            {#each $upgradeRsp.description as dp}
                <li class="">{dp}</li>
            {/each}
        </ul>

        <div class="modal-footer">
            <button class="modal-close btn waves-effect waves-light btn-small cancel-btn">{ i18n("cancel") }</button>
            <button class="modal-close btn waves-effect waves-light btn-small">
                <a href="{$upgradeRsp.url}" target="_blank">{ i18n("upgrade") }</a></button>
        </div>
    </div>
{/if}