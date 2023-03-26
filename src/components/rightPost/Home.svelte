<script>
    import { SPONSORS } from '../utils/config.js'
</script>

<style>
    .buymeacoffee {
        height: 60px;
        width: 231px;
        border-radius: 12px;
        margin-right: 12px;
    }
    .donate-info {
        display: flex;
        align-items: center;
    }
    .social-wrapper {
        display: flex;
        align-items: center;
    }
    .social {
        width: 64px;
        padding: 0 16px;
    }
    .social-img {
        width: 32px;
        height: 32px;
    }
    h2 {
        padding-top: 12px;
        padding-bottom: 12px;
    }
</style>

<div>
    <h1>A simple, efficient, open source RSS reader service.</h1>

    <h2>Key Features</h2>

    <h3>️🚀 Simple and Efficient</h3>
    <p>
        Dinosaur Rss 🦕 is build as minimum viable product, new features will be added up to you.
    </p>

    <p>
        By using Client-Server architecture, feeds are synchronized intelligently on the server, 
        so it's energy efficient for your device.
    </p>

    <h3>️💻 Cross Platform</h3>

    <table class="responsive-table">
        <thead>
        <tr>
            <th>macOS</th>
            <th>Windows</th>
            <th>Linux</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>✅ tested on macOS 10.15+</td>
            <td>✅ tested on Windows 7+</td>
            <td>✅ tested on manjaro</td>
        </tr>
        </tbody>
    </table>
    <br />

    <h3>️🎤 Podcast Optimized</h3>
    <p>Integrated with <code>@Podlove Player</code> for the specific needs of podcasters.</p>
    <img src="icon/podlove.jpg" width="480px" alt="podlove player" />
    <br />

    <h3>️💡 Code Highlight</h3>
    <pre><code class="language-js">const code = `var data = "Hello World!"`;

// log
console.log(code)</code></pre>
    <br />
    
    <h3>⌨️ Keyboard Shortcuts</h3>
    <table class="responsive-table">
        <tr>
            <td><kbd> n </kbd> / <kbd>⬇️</kbd> - Next </td>
            <td><kbd> N </kbd> / <kbd>⬆️</kbd> - Previous </td>
            <td><kbd> b </kbd> - Back </td>
        </tr>

        <tr>
            <td><kbd> p </kbd> / <kbd>➡️️</kbd> - Next page </td>
            <td><kbd> P </kbd> / <kbd>⬅️️️</kbd> - Previous page </td>
            <td><kbd> M </kbd> - Mark all as read </td>
        </tr>
        <tr>
            <td><kbd> j </kbd> - Move down </td>
            <td><kbd> k </kbd> - Move up </td>
            <td><kbd> x </kbd> - Exit </td>
        </tr>
        <tr>
            <td><kbd> d </kbd> / <kbd>space</kbd> - PgOn </td>
            <td><kbd> u </kbd> - PgUp </td>
            <td><kbd> r </kbd> - Refresh </td>
        </tr>

        <tr>
            <td><kbd>gg</kbd> - Go to first line </td>
            <td><kbd> G </kbd> - Go to last line </td>
            <td><kbd>yy</kbd> - Copy link </td>
        </tr>

        <tr>
            <td><kbd>.</kbd> - Toggle Reading Mode </td>
            <td><kbd>Esc</kbd> - Close modal window </td>
            <td><kbd>Ctrl + f</kbd> - Search </td>
        </tr>
    </table>
    <br />

    <h3>️📝 Personal Memo</h3>
    <p>
        <i>Have a skin in the game !</i>
    </p>

    <h3>️🍎 Apple Silicon Support</h3>
    <p>
        Enjoy the benefit of new technology in Apple Silicon.
    </p>

    <h3>️🆓 Free for 100 feeds</h3>

    {#if !process.mas}
        <p class="donate-info">
            <a href="https://www.buymeacoffee.com/dinorss" target="_blank">
                <img src="icon/buymeacoffee.png" class="buymeacoffee" alt="Buy Me A Coffee" />
            </a>
            to get more feeds.
        </p>
    {/if}

    <p class="social-wrapper">
        <span>Follow Us: </span>
        <a href="https://twitter.com/dino_rss" class="social" rel="nofollow" target="_blank">
            <img src="icon/twitter.svg" class="social-img" alt="Twitter" />
        </a>
        <a href="https://github.com/richshaw2015/dino-rss-electron" class="social" rel="nofollow" target="_blank">
            <img src="icon/github.svg" class="social-img" alt="GitHub" />
        </a>
    </p>
</div>

