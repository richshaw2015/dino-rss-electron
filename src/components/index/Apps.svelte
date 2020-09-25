<style>
    #omr-apps {
        width: 100%;
        min-width: 400px;
        display: flex;
        flex-direction: column;
        border: 0.5px dashed red;
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
</style>

<script>
</script>

<div id="omr-apps">
    <div class="waves-effect one-app"><i class="material-icons app-icon explore-icon">explore</i>Explore</div>
    <div class="waves-effect one-app"><i class="material-icons app-icon">equalizer</i>Ranking</div>

    <div class="divider app-divider"></div>

    <div class="waves-effect one-app"><i class="material-icons app-icon">info_outline</i>About</div>
    <div class="waves-effect one-app"><i class="material-icons app-icon">help_outline</i>FAQ</div>
    <div class="waves-effect one-app"><i class="material-icons app-icon">attach_money</i>Donate</div>

    <div class="divider app-divider"></div>

    <div class="waves-effect one-app"><i class="material-icons app-icon setting-icon">settings</i>Settings</div>
</div>