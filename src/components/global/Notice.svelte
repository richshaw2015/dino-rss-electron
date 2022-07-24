<script>
    export let msg = "Loading ..."
    export let level = "loading"  // succ / info / warn / loading

    let src

    $: {
        if (level === 'warn') {
            src = './icon/warn.svg'
        }  else if (level === 'info') {
            src = './icon/info.svg'
        } else if (level === 'succ') {
            const number = Math.floor(Math.random() * 6) + 1
            src = `./icon/succ/dino${number}.svg`
        }
    }
</script>

<style>
    .notice-container {
        height: 100%;
        display: flex;
        align-items: center;
    }
    .notice-wrapper {
        width: 100%;
        padding-bottom: 20%;
    }
    .progress-wrapper {
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .notice-img {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .notice-img img {
        max-height: 100px;
        user-select: none;
    }
    .notice-msg {
        color: #59595A;
        text-align: center;
	    margin-top: 1.8rem;
        font-size: 1.2rem;
        word-break: break-word;
    }
    @media (prefers-color-scheme: dark) {
        .notice-msg {
            color: #cecece;
        }
    }
</style>

<div class="notice-container">
    <div class="notice-wrapper">
        {#if level === 'loading'}
            <div class="progress-wrapper">
                <div class="preloader-wrapper big active">
                    <div class="spinner-layer spinner-blue">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                    </div>
            
                    <div class="spinner-layer spinner-red">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                    </div>
            
                    <div class="spinner-layer spinner-yellow">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                    </div>
            
                    <div class="spinner-layer spinner-green">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                    </div>
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
</div>
