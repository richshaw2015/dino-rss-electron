<script>
    import Toolbar from './Toolbar.svelte'
    import { i18n } from '../utils/helper.js'

    import { appsActiveMenu, isApiLoading } from '../utils/store.js'
</script>

<style>
    #omr-apps {
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
    }
    .active-app {
        background-color: #ddd;
    }
    .one-app {
        display: flex;
        height: 48px;
        align-items: center;
    }
    .app-icon {
        margin-left: 12px;
        margin-right: 10px;
    }
    .app-divider {
        margin-left: 18px;
        margin-right: 48px;
    }
    .setting-icon {
        width: 24px;
        font-size: 20px;
    }
    .explore-icon {
        width: 24px;
        font-size: 22px;
    }

    @media (prefers-color-scheme: dark) {
        .active-app {
            background-color: #373737;
        }
    }
</style>

<Toolbar />

<div id="omr-apps">
    <div class="waves-effect one-app {$appsActiveMenu === 'update' ? 'active-app' : ''}" on:click={() => appsActiveMenu.set('update')}>
        <i class="material-icons app-icon sync-icon">sync</i>{ i18n('update') }</div>

    <div class="waves-effect one-app {$appsActiveMenu === 'explore' ? 'active-app' : ''}" on:click={() => appsActiveMenu.set('explore')}>
        <i class="material-icons app-icon explore-icon">add_circle</i>{ i18n('explore') }</div>
    <!-- <div class="waves-effect one-app"><i class="material-icons app-icon">equalizer</i>Ranking</div> -->

    <div class="divider app-divider"></div>

    <div class="waves-effect one-app {$appsActiveMenu === 'about' ? 'active-app' : ''}" on:click={() => appsActiveMenu.set('about')}>
        <i class="material-icons app-icon">info_outline</i>{ i18n('about') }</div>
    <!-- <div class="waves-effect one-app">
        <i class="material-icons app-icon">help_outline</i>FAQ</div> -->
    <div class="waves-effect one-app {$appsActiveMenu === 'thanks' ? 'active-app' : ''}" on:click={() => appsActiveMenu.set('thanks')}>
        <i class="material-icons app-icon">mood</i>{ i18n('thanks') }</div>

    <div class="divider app-divider"></div>
    
    <div class="waves-effect one-app {$appsActiveMenu === 'setting' ? 'active-app' : ''}" on:click={() => appsActiveMenu.set('setting')}>
        <i class="material-icons app-icon setting-icon">settings</i>{ i18n('setting') }</div>
    
</div>
