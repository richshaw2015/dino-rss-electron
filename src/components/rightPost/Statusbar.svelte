<script>
    import { statusMsg } from '../store/store.js'
</script>

<style>
    #omr-status-bar {
        height: 30px;
        padding: 0 28px;
        width: 100%;
        font-size: 0.8em;
        display: flex;
        align-items: center;
        background: #DEE1E6;
        border-radius: 3px;
    }
</style>

{#if $statusMsg }
<div id="omr-status-bar">
    <span class="truncate">{$statusMsg}</span>
</div>    
{/if}
