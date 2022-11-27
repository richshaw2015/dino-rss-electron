<script>
    import {apiReq} from "../utils/req";

    const { ipcRenderer } = require('electron')

    let cacheSize = 1

    import { onMount } from 'svelte'
    import {
        getCacheDir,
        toast,
        warnToast,
        readableSize,
        reloadWindow,
        fixAvatarUrl,
        i18n,
        getLocaleLang,
        getAppVer,
        shortToast
    }
        from '../utils/helper.js'
    import { userInfoRsp } from '../utils/store.js'
    import { clearUserInfo, saveLocaleLang, getImgMode, saveImgMode, getAppearance, saveAppearanceMode } from '../utils/storage.js'

    let locale = getLocaleLang()
    let imgMode = getImgMode()
    let appearance = getAppearance()

    const fs = require('fs')
    const getFolderSize = require('get-folder-size')

    function handleCleanCache() {
        if (cacheSize > 0) {
            fs.rmdir(getCacheDir(), { recursive: true }, (err) => {
                if (err) {
                    warnToast(err)
                } else {
                    cacheSize = 0
                    toast(i18n('clean.success'))
                    fs.mkdirSync(getCacheDir(), {recursive: true})
                }
            })
        }
    }

    function handleLogout(){
        if ($userInfoRsp.level > 1) {
            clearUserInfo()
            reloadWindow()
        }
    }
    function handleDeleteAccount() {
        const instanse = M.Modal.init(document.querySelector('#omr-modal-delete-account'), {
            inDuration: 0,
            outDuration: 0,
            opacity: 0.5,
            endingTop: "15%"
        });
        instanse.open()
    }

    function deleteAccountSubmit() {
        if ($userInfoRsp.level > 1) {
            apiReq('/api/user/delete', {}).then( rsp => {
                if (rsp.code === 0) {
                    try {
                        M.Modal.getInstance(document.querySelector('#omr-modal-delete-account')).close()
                    } catch (e) {}

                    // logout local account
                    handleLogout()
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
            })
        }
    }

    function handleImageMode(mode) {
        ipcRenderer.invoke('image-mode-change', mode)
        saveImgMode(mode)
    }
    function handleAppearanceMode(mode) {
        ipcRenderer.invoke('toggle-appearance', mode)
        saveAppearanceMode(mode)
    }

    onMount(() => {
        if (fs.existsSync(getCacheDir())) {
            getFolderSize(getCacheDir(), (err, size) => {
                if (err) {
                    warnToast(err)
                } else {
                    cacheSize = size
                }
            })
        }

        // init form
        M.FormSelect.init(document.querySelectorAll('select'), {});
    })
</script>

<style>
    .setting-title {
        width: 140px;
    }
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80%;
        margin: 16px auto;
    }
    .setting-item a {
        color: unset;
    }
    .user-image {
        width: 48px;
        margin-right: 10px;
    }
    .user-image-wrapper {
        position: relative;
    }
    .avatar-vip-badge {
        position: absolute;
        top: 29px;
        right: 9px;
        width: 15px;
        height: 15px;
        font-size: 10px;
        border-radius: 50%;
        color: white;
        display: flex;
        justify-content: center;
        background: #ff9d28;
        box-shadow: 0 0 0 1px #fff;
    }
    .user-delete {
        font-size: 1.1rem;
        margin-left: 16px;
        vertical-align: bottom;
        color: #d32f2f;
    }
    .divider {
        width: 80%;
        margin: 2px 10%;
    }
    .btn-white {
        background-color: white;
        color: black;
        width: 100px;
    }
    .locale-select {
        min-width: 200px;
    }

    #omr-modal-delete-account {
        width: 640px;
        padding: 24px;
        left: 64px;
    }
    .modal-title {
        margin-bottom: 1.6rem;
    }
    .btn-warning {
        background-color: #d32f2f;
    }
    .delete-tips {
        color: #d32f2f;
    }

    @media (prefers-color-scheme: dark) {
        .btn-white {
            background-color: #373737;
            color: #cecece;
        }
        .user-delete {
            color: #b71c1c;
        }
        .btn-warning {
            background-color: #b71c1c;
        }
        .delete-tips {
            color: #b71c1c;
        }
    }
</style>

<div class="setting-item">
    <span class="setting-title">{i18n('account')}</span>

    <div class="user-image-wrapper">
        <img class="user-image circle" src="{fixAvatarUrl($userInfoRsp.image, $userInfoRsp.id)}" alt="Avatar">

        {#if $userInfoRsp.level >= 10}
            <span class="avatar-vip-badge">V</span>
        {/if}
    </div>

    {#if $userInfoRsp.level > 1}
        <a href="{$userInfoRsp.blog}" target="_blank"><span>{$userInfoRsp.name}</span></a>
        <span class="flex-grow"></span>
        <button class="waves-effect waves-light btn-small btn-white" on:click={handleLogout}>
            {i18n('logout')}
        </button>

        <i class="user-delete material-icons" on:click={handleDeleteAccount}>delete_forever</i>
    {:else}
        <span>{i18n('visitor')}</span>
        <span class="flex-grow"></span>
    {/if}
</div>

<div class="divider"></div>
<div class="setting-item">
    <span class="setting-title">{ i18n('appearance') }</span>
    <div class="input-field locale-select">
        <select bind:value={appearance} on:change={() => handleAppearanceMode(appearance)}>
            <option value="system">{ i18n('appearance.system') }</option>
            <option value="light">{ i18n('appearance.light') }</option>
            <option value="dark">{ i18n('appearance.dark') }</option>
        </select>
    </div>
</div>

<div class="divider"></div>
<div class="setting-item">
    <span class="setting-title">{ i18n('load.image') }</span>
    <div class="switch">
        <label>
            OFF
            <input type="checkbox" bind:checked={imgMode} on:change={() => handleImageMode(imgMode)}>
            <span class="lever"></span>
            ON
        </label>
    </div>
</div>

<div class="divider"></div>

<div class="setting-item">
    <span class="setting-title">{i18n('cache.usage')}</span>
    <span class="flex-grow">{readableSize(cacheSize)}</span>
    <button class="waves-effect waves-light btn-small btn-white {cacheSize > 0 ? '' : 'disabled'}" 
        on:click={handleCleanCache}>{i18n('clean')}</button>
</div>

<div class="divider"></div>

<div class="setting-item">
    <span class="setting-title">{ i18n('feedback') }</span>
    <a href="https://github.com/richshaw2015/dino-rss-electron/discussions" target="_blank">
        <button class="waves-effect waves-light btn-small btn-white">{ i18n('discuss') }</button>
    </a>
</div>

<div class="divider"></div>

<div class="setting-item">
    <span class="setting-title">{ i18n('language') }</span>
    <div class="input-field locale-select">
        <select bind:value={locale} on:change={() => saveLocaleLang(locale)}>
            <option value="en">🇬🇧  English</option>
            <option value="zh">🇨🇳  简体中文</option>
            <option value="zh-TW">🇭🇰  繁體中文</option>
            <option value="ja">🇯🇵  日本語</option>
            <option value="ko">🇰🇷  한국어</option>
        </select>
    </div>
</div>

<div class="setting-item">
    <span class="setting-title">{ i18n('version') }</span>
    <span class="">Release {getAppVer()}</span>
</div>

<div id="omr-modal-delete-account" class="modal">
    <div class="modal-title"><i class="material-icons">delete_forever</i> {i18n('delete.account')}</div>

    <div class="row col s12 delete-tips">
        ⚠️ {i18n('delete.account.tips')}
    </div>

    <div class="modal-footer">
        <button class="modal-close btn waves-effect waves-light btn-small cancel-btn">{i18n('cancel')}</button>
        <button class="btn waves-effect waves-light btn-small btn-warning" on:click={deleteAccountSubmit}>{i18n('delete')}</button>
    </div>
</div>