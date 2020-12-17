<script>
    let cacheSize = 1

    import { onMount } from 'svelte'
    import { getCacheDir, toast, warnToast, readableSize, reloadWindow, resizeImageUrl } from '../utils/helper.js'
    import { userInfoRsp } from '../utils/store.js'
    import { clearUserInfo } from '../utils/storage.js'

    const fs = require('fs')
    const getFolderSize = require('get-folder-size')

    function handleCleanCache() {
        if (cacheSize > 0) {
            fs.rmdir(getCacheDir(), { recursive: true }, (err) => {
                if (err) {
                    warnToast(err)
                } else {
                    cacheSize = 0
                    toast("Clean up")
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

    onMount(() => {
        getFolderSize(getCacheDir(), (err, size) => {
            if (err) { 
                warnToast(err)
            } else {
                cacheSize = size
            }
        })
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
        margin: 24px auto;
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
    .divider {
        width: 80%;
        margin: 2px 10%;
    }
    .btn-white {
        background-color: white;
        color: black;
        width: 100px;
    }
</style>

{#if $userInfoRsp.level > 1}
    <div></div>
{/if}

<div class="setting-item">
    <span class="setting-title">Account:</span>

    <div class="user-image-wrapper">
        <img class="user-image circle" src="{resizeImageUrl($userInfoRsp.image)}" alt="Avatar">

        {#if $userInfoRsp.level >= 10}
            <span class="avatar-vip-badge">V</span>
        {/if}
    </div>

    {#if $userInfoRsp.level > 1}
    <a href="{$userInfoRsp.blog}" target="_blank"><span>{$userInfoRsp.name}</span></a>
    <span class="flex-grow"></span>
    <button class="waves-effect waves-light btn-small btn-white" on:click={handleLogout}>Logout</button>
    {:else}
    <span>Visitor</span>
    <span class="flex-grow"></span>
    {/if}
</div>
<div class="divider"></div>

<div class="setting-item">
    <span class="setting-title">Cache Usage:</span>
    <span class="flex-grow">{readableSize(cacheSize)}</span>
    <button class="waves-effect waves-light btn-small btn-white {cacheSize > 0 ? '' : 'disabled'}" 
        on:click={handleCleanCache}>Clean</button>
</div>
<div class="divider"></div>

<div class="setting-item">
    <span class="setting-title">Feedback:</span>
    <a href="https://github.com/richshaw2015/dino-rss-electron/discussions/new" target="_blank">
        <button class="waves-effect waves-light btn-small btn-white">Discuss</button>
    </a>
</div>
