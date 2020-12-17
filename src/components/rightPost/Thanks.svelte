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
</style>

<h2>Credits</h2>
    <ul>
        <li>
            <img src="icon/logo.svg" class="logo" alt="logo" />
            <span>
                Dinosaur Rss's logo is derived from <a href="https://icon-icons.com/pack/Safari/2565" target="_blank">Beibidog</a>'s design.
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
            <img src="https://podlove.org/files/2014/06/cropped-podlove-avatar-bkd-1024-180x180.png" class="logo" 
                alt="Podlove Web Player" />
            <a href="https://podlove.org/podlove-web-player/" target="_blank">Podlove Web Player</a>
        </li>
        <li>
            <img src="https://craig.global.ssl.fastly.net/img/favicon/mousetrap.png" class="logo" 
                alt="Mousetrap" />
            <a href="https://craig.is/killing/mice" target="_blank">Mousetrap</a>
        </li>

        <li>
            <img src="https://highlightjs.org/static/favicon.png" class="logo" 
                alt="highlight.js" />
            <a href="https://highlightjs.org/" target="_blank">highlight.js</a>
        </li>
        <li>
            <img src="https://prismjs.com/assets/favicon.png" class="logo" 
                alt="Prism" />
            <a href="https://prismjs.com/" target="_blank">Prism</a>
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
