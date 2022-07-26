<script>
    export let activeEntry = {}
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
    @media (prefers-color-scheme: dark) {
        #omr-status-bar {
            color: #5f5f5f;
            background: #252525;
        }
    }
</style>

{#if activeEntry.link }
    <div id="omr-status-bar">
        <span class="truncate">{activeEntry.link}</span>
    </div>    
{/if}
