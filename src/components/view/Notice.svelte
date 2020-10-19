<script>
    export let msg = "Loading..."
    export let level  // succ / info / warn / loading

    let src

    $: {
        if (level === 'warn' || level === 'info') {
            src = './icon/warn.svg'
        } else if (level === 'succ') {
            const number = Math.floor(Math.random() * 6) + 1
            src = `./icon/succ/dino${number}.svg`
        }
    } 
</script>

<style>
    .notice-wrapper {
        width: 100%;
        padding: 2rem;
    }
    .progress-wrapper {
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 15%;
        margin-top: 2rem;
    }
    .notice-img {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
    }
    .notice-img img {
        max-height: 100px;
    }
    .notice-msg {
        color: #59595A;
        text-align: center;
	    margin-top: 2rem;
        font-size: 1.3rem;
        word-break: break-all;
    }
</style>

<div class="notice-wrapper">
    {#if level === 'loading'}
        <div class="progress-wrapper">
            <div class="progress">
                <div class="indeterminate"></div>
            </div>
        </div>
    {:else}
        <div class="notice-img">
            <img {src} alt="" />
        </div>
    {/if}


    <div class="notice-msg">
        {#if level === 'warn'}
            ⚠️ {msg}
        {:else if level === 'succ'}
            ✅ {msg}
        {:else if level === 'info'}
            ℹ️ {msg}
        {:else}
            {msg}
        {/if}
    </div>
</div>
