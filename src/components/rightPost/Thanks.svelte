<script>
    import { SPONSORS, SUPPORTERS } from '../utils/config.js'    
</script>
<style>
    ul li {
        margin: 4px 16px;
        min-height: 32px;
        display: flex;
        align-items: center;
    }
    .logo {
        width: 24px;
        max-height: 24px;
        margin-right: 6px;
    }
    .supporter-img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        margin-bottom: 8px;
    }
    #bmc-wbtn {
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 64px; 
        height: 64px; 
        color: white; 
        border-radius: 32px; 
        position: fixed; 
        right: 36px; 
        bottom: 36px; 
        box-shadow: rgba(0, 0, 0, 0.4) 0px 4px 8px; 
        z-index: 10; 
        cursor: pointer; 
        font-weight: 600; 
        transition: all 0.2s ease 0s; 
        transform: scale(1);
    }
    #bmc-wbtn img {
        height: 40px; 
        width: 40px; 
        margin: 0; 
        padding: 0;
    }
</style>

<h2>Credits</h2>
    <ul>
        <li>
            <img src="icon/logo.svg" class="logo" alt="logo" />
            <span>
                Dinosaur Rss's logo is derived from <a href="https://icon-icons.com/pack/Safari/2565" target="_blank">Beibidog</a>'s awesome works.
            </span>
        </li>

        <li>
            <img src="icon/electron.svg" class="logo" alt="Electron" />
            <a href="https://www.electronjs.org/" target="_blank">Electron</a>
        </li>

        <li>
            <img src="icon/svelte.svg" class="logo" alt="Svelte" />
            <a href="https://svelte.dev/" target="_blank">Svelte</a>
        </li>

        <li>
            <img src="icon/materialize.svg" class="logo" alt="Materialize" />
            <a href="https://materializecss.com" target="_blank">Materialize</a>
        </li>

        <li>
            <a href="https://podlove.org/podlove-web-player/" target="_blank">Podlove Web Player</a>
        </li>
        <li>
            <a href="https://craig.is/killing/mice" target="_blank">Mousetrap</a>
        </li>

        <li>
            <a href="https://highlightjs.org/" target="_blank">highlight.js</a>
        </li>
        <li>
            <a href="https://prismjs.com/" target="_blank">Prism</a>
        </li>
        <li>
            <a href="https://github.com/gregjacobs/Autolinker.js" target="_blank">Autolinker.js</a>
        </li>
        <li>
            <a href="https://github.com/alessioalex/get-folder-size#readme" target="_blank">get-folder-size</a>
        </li>
        <li>
            <a href="https://github.com/pvorb/node-md5#readme" target="_blank">MD5</a>
        </li>
        <li>
            <a href="https://github.com/uuidjs/uuid#readme" target="_blank">uuid</a>
        </li>
        <li>
            <a href="https://github.com/davidshimjs/qrcodejs" target="_blank">QRCode.js</a>
        </li>
        <li>
            <a href="https://github.com/jaredreich/pell" target="_blank">pell</a>
        </li>
    </ul>

<h2>Sponsors</h2>
<p>
    {#each SPONSORS as sponsor}
    <a href="{sponsor.link}" class="sponsor" rel="nofollow" target="_blank" title="{sponsor.name}">
        <img src="{sponsor.image}" class="sponsor-img" alt="{sponsor.name}" />
    </a>
    {/each}
</p>

<h2>Supporters</h2>
<br/>
{#each SUPPORTERS as supporter}
<a href="{supporter.link}" class="supporter" rel="nofollow" target="_blank" title="{supporter.name}">
    <img src="{supporter.image}" class="circle supporter-img" alt="{supporter.name}" />
</a>
{/each}

<h2>License</h2>
<p>
    <a href="https://opensource.org/licenses/MIT" target="_blank" title="MIT">MIT</a>
</p>

{#if !process.mas}
    <a href="https://www.buymeacoffee.com/dinorss" target="_blank" title="Buy Me A Coffee">
        <div id="bmc-wbtn" class="second-bg-color">
            <img src="icon/coffeecup.svg" alt="Buy Me A Coffee">
        </div>
    </a>
{/if}
