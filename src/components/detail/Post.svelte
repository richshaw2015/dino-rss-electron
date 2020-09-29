<script>
    export let entryInfo = {
        "id": 1233,
        "title": "Thinking About Power Usage and Websites",
        "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
        "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
        "author": "Selena Deckelmann",
        "image": "https://css-tricks.com/apple-touch-icon.png",
        "updated": "3 hours ago",
        "feed": {
            "id": 2,
            "title": "CSS-Tricks",
            "link": "https://css-tricks.com",
            "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
            "rss": "https://css-tricks.com/feed/",
            "is_podcast": true
        },
        "stats": {
            "has_read": true,
            "has_stared": true,
            "uv_stared": 5,
            "uv_view": 246,
        }
    }
    export let content = JSON.parse('"<p>It\\u2019s true, web animation can be accessible! Sometimes it just takes a little extra effort to make sure that it is. There are strategic things we can do to make sure our animations have a positive impact on accessibility, like planning how they <a href=\\"https://alistapart.com/article/ui-animation-and-ux-a-not-so-secret-friendship/\\">contribute to the overall UX</a> and <a href=\\"https://www.nngroup.com/articles/animation-usability/\\">ease of use</a> of our site. There are also more tactical considerations for making sure the animations on our site are accessible, and that\\u2019s where the <a href=\\"https://www.w3.org/TR/WCAG21/\\">Web Content Accessibility Guidelines (WCAG)</a> comes in.</p>\\n\\n\\n\\n<p>While different contexts can affect the details of what you need to do, the WCAG provides a number of recommendations for animated content and interactions. These include guidelines for when to provide pause and play controls, limits for blinking or flashing the screen, and advice on when to provide reduced motion options for users with motion sensitivities. If you haven\\u2019t looked at it in a while, the specification has been updated to version 2.1, and now has even more useful guidance on how we can design web animations that are accessible.&nbsp;</p>\\n\\n\\n\\n<span id=\\"more-320684\\"></span>\\n\\n\\n\\n<p>Let\\u2019s dig into each of those recommendations in more detail to see how we can apply them to our work on the web:</p>\\n\\n\\n\\n<h3>Pause, Stop, Hide&nbsp;</h3>\\n\\n\\n\\n<p>The first of the WCAG recommendations that applies specifically to animation is <a href=\\"https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html\\">Pause, Stop, Hide</a>. For this one, the title gives a pretty big clue into what the recommendation is all about. It states:</p>\\n\\n\\n\\n<blockquote class=\\"wp-block-quote\\"><p>For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an activity where it is essential; [&#8230;]</p></blockquote>\\n\\n\\n\\n<p>The recommendation specifically applies to motion initiated by the web page without user interaction, and it might sound like something that doesn\\u2019t apply to UI animation work at first. Most of the durations we might use in UI animation work are far under this five second threshold individually. But there are some common patterns where this would apply. For example: auto-advancing carousels or slideshows, animated backgrounds, or animated illustrations. While each individual animation within these patterns might still be very short, the overall motion that is created often plays out over more than five seconds. This is especially true when these are designed to play on an infinite loop, which is most definitely longer than five seconds.</p>\\n\\n\\n\\n<h4>How to meet the Pause, Stop, Hide criteria</h4>\\n\\n\\n\\n<p>If you have some of these longer playing animations, you\\u2019ll need to add some kind of pause and play controls that allow users to control the motion and/or auto playing behaviour. The WCAG specification doesn\\u2019t dictate what these controls need to look like though, you have complete design control over that.</p>\\n\\n\\n\\n<p>A good example of this in practice is how the article series <a href=\\"https://www.matuzo.at/blog/the-' +
        'dark-side-of-the-grid-part-2/\\">&#8220;Dark Side of The Grid&#8221;</a> handles the example animations. Each animated figure loops infinitely once it starts, so they provide a play/stop button for readers to play the animation when they want to see it, and stop it when they\\u2019re done. Other more decorative or illustrative animations in the article play once and then present a button to replay them, if users want to. The placement and design of the buttons also fits the aesthetic of the overall design of the article which makes them both functional and aesthetically pleasing.&nbsp;</p>\\n\\n\\n\\n<figure class=\\"wp-block-image\\"><img alt=\\"\\" src=\\"https://lh5.googleusercontent.com/1E3G2eHPOF7sw2h_j1rYJ2SCnYGPGO80_cuEKqCz5ZMtOZLCWU_FsSxp_Gr3eBpez0hspMSZTHCUpMCkW3bjlOZbXn-uNDNnqPGwCQiagXn-Xzz6Whs_6bvxnERja6-tnKISPJz3\\" /></figure>\\n\\n\\n\\n<p>Animated GIFs are something to look out for too. If you\\u2019ve got a looping animated GIF, that\\u2019s going to need some sort of pause/play controls to successfully meet this criteria. <a href=\\"https://css-tricks.com/pause-gif-details-summary/\\">Both of the techniques mentioned in this post</a> are helpful for pulling that off.&nbsp;</p>\\n\\n\\n\\n<p>There are some exceptions for this recommendation, as noted by the WCAG. One exception specifically worth noting is loaders and preloaders.</p>\\n\\n\\n\\n<h3>Three flashes or below threshold&nbsp;</h3>\\n\\n\\n\\n<p>This recommendation is one that probably has the most research behind it because it stems from the days of broadcast TV. The main reason behind this recommendation is that significant flashing on screen has been known to trigger seizures.</p>\\n\\n\\n\\n<p>In short <a href=\\"https://www.w3.org/TR/WCAG21/#three-flashes-or-below-threshold\\">three flashes or below threshold</a> states:&nbsp;</p>\\n\\n\\n\\n<blockquote class=\\"wp-block-quote\\"><p>Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds.</p></blockquote>\\n\\n\\n\\n<h4>How to meet the three flashes or below threshold criteria</h4>\\n\\n\\n\\n<p>The WCAG provides details on the size, ratio and viewing angle thresholds under which flashing the screen could be considered safe. But for most of us, it\\u2019s probably easiest to avoid anything that flashes more than three times in one&nbsp;second. I don\\u2019t think many UX designers set out to flash the screen excessively on purpose, but it can happen. For example, a design that&#8217;s going for a video game sort of feel or a glitchy vibe might involve some screen flashing that happens more frequently than three times in a second.&nbsp;</p>\\n\\n\\n\\n<p>One specific example of a design that includes a significant amount of flashing is this article from the Huffington Post, pictured below. It\\u2019s a highly stylized piece on how millennials have a tougher go at things like jobs and saving for retirement than previous generations. Its&nbsp; glitchy 8-bit video game design is very on point with the theme of the article. Design-wise, it\\u2019s a great choice for the subject matter and is well executed. But there are times, as you can see from the frame-by-frame stills below, where the text color flashes more than three times a second.&nbsp;</p>\\n\\n\\n\\n<figure class=\\"wp-block-image\\"><img alt=\\"\\" src=\\"https://lh6.googleusercontent.com/F8Ob-K7MyB94tCJjdReQu7HbYij1rk5pPFX7vIK0cv4SpVsLOTQsgof2KaKSja_LT1IU-ygvYq7USQwBDhFbyJg0WFMoBJxnLZ8U0khdsdPfo3z2H2VIYWKP96h_cTY7jFxz9Vbq\\" /></figure>\\n\\n\\n\\n<p>This amount of flashing could be problematic for people with epilepsy or other physical reactions triggered by flashing. To their credit, the Huffington Post also provided a text-only version of the article for anyone sensitive to flashing, <a href=\\"https://source.opennews.org/articles/motion-sick/\\">as Eileen mentions in this post</a>, as well as advanced warning of the potential flashing hazard.</p>\\n\\n\\n\\n<p>In general, avoiding effects that require frequent flashing is the safest way to meet this criteria. However, If you can\\u2019t avoid flashing animations in your project the WCAG provides <a href=\\"https://www.w3.org/TR/2008/REC-WCAG20-20081211/#general-thresholddef\\">detailed instructions around the safe thresholds for flashing the screen</a>. Also, providing advanced warning of flashing content and an alternate version of the content without the flashing effect (like the example above) is a good thing to do as well.&nbsp;&nbsp;</p>\\n\\n\\n\\n<h3>The A, AA, and AAA levels of the WCAG&nbsp;</h3>\\n\\n\\n\\n<p>The WCAG has multiple levels of criteria and conformance, which is why each recommendation has a notation of what level it falls under. Level A compliance is the minimum level of conformance. Level AA is the middle level of conformance and indicates that the criteria for both level A and AA have been met. Level AAA is the highest level of conformance and requires satisfying the criteria from level A, AA and AAA. Typically, the guidelines found in level AAA require additional effort to meet. (If you want to learn more about these levels and what\\u2019s included in them outside of the animation-related recommendations we\\u2019re covering here, I\\u2019ve put together a list of helpful resources at the end of this article.)&nbsp;</p>\\n\\n\\n\\n<p>In general, most people are aiming for level AA compliance when they say they are making an accessible website. This is also the level you might see requested in an RFP or project brief. The last two guidelines we discussed fall under the level AA criteria and, therefore, must be met to claim level AA compliance. The next guideline, however, is part of the level AAA criteria. Even though it\\u2019s outside of the typical level of conformance, it\\u2019s a very useful recommendation to take into consideration if your project relies significantly on animation. I highly recommend implementing it in your work.</p>\\n\\n\\n\\n<h3>Animation from interactions&nbsp;</h3>\\n\\n\\n\\n<p>This guideline covers a different kind of animation than the previous two. While the first two are generally applied to animation that\\u2019s initiated by the web page itself, this one applies to animation initiated by user interaction. More specifically, it states:&nbsp;</p>\\n\\n\\n\\n<blockquote class=\\"wp-block-quote\\"><p>Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed.</p></blockquote>\\n\\n\\n\\n<p>At first read, the term \\u201cmotion animation\\u201d can be confusing since we typically use the terms \\u201cmotion\\u201d and \\u201canimation\\u201d interchangeably. It might seem overly specific at first, but it makes sense to get this specific in this case. The WCAG defines motion animation as animation that is used to \\u201dcreate the illusion of movement\\u201d, and specifies that \\u201cmotion animation does not include changes of color, blurring or opacity.\\u201d</p>\\n\\n\\n\\n<p>Essentially, the term <em>motion animation</em> is used to indicate that certain types of animation create the sense of movement, while others do not. It\\u2019s those animations that create a sense of movement that concerns this guideline. It\\u2019s important to keep that distinction in mind when discussing animation and accessibility to help make sure you focus your efforts efficiently. If we were to express this distinction in a very eyeball-like Venn Diagram, it would look&nbsp; like this:</p>\\n\\n\\n\\n<figure class=\\"wp-block-image size-full\\"><img alt=\\"A large light purple circle with the word Animation on it in white with a smaller white circle contained at the bottom of the larger circle with the word Motion on it in black.\\" class=\\"wp-image-320696\\" src=\\"https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/09/Screen-Shot-2020-04-28-at-3.06.55-PM.png?ssl=1\\" /></figure>\\n\\n\\n\\n<p>Over the last few years, we\\u2019ve come to realize that some types of motion on screen, even as part of an interface, can cause people with motion sensitivities to become physically ill. So this is why we might want to consider creating a reduced motion mode in our&nbsp; work. I <a href=\\"https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/\\">wrote more about the kinds of motion effects that are most likely to be triggering in this article</a>, and <a href=\\"https://webkit.org/blog/7551/responsive-design-for-motion/\\">this post from the WebKit blog</a> covers some examples in detail.</p>\\n\\n\\n\\n<h4>How to meet the animation from interactions criteria</h4>\\n\\n\\n\\n<p>The WCAG suggests we avoid unnecessary animation, provide a control for users to turn off any non-essential motion, or take advantage of the reduced motion setting in operating systems and user agents. Let\\u2019s look at each of these in a bit more detail. There are a few different things we can do to help avoid exposing people to animation that might make them dizzy, nauseous, or worse.</p>\\n\\n\\n\\n<h5><strong>Avoid unnecessary animation</strong></h5>\\n\\n\\n\\n<p>Context and expectations also play a role here. The amount of motion you might reasonably expect to encounter on a website for a movie or video game is very different from what you might reasonably expect to encounter on say a government site or construction company\\u2019s site. The same amazing effects that might fit in just fine on a video game\\u2019s site would feel unnecessary or out of place on, say, a government website. Consider the context and expectations that apply to your site and whether the amount of animation you\\u2019re using in your design fits that context.&nbsp;</p>\\n\\n\\n\\n<h5><strong>Provide a way for users to turn off potentially problematic motion animation</strong></h5>\\n\\n\\n\\n<p>If you have motion in your product that might be a trigger for folks with motion sensitivities, providing a way for users to avoid those triggering animations is the responsible thing to do. Based on the WCAG\\u2019s definition, any effect that could be considered motion animation should be one that includes a reduced version.&nbsp;</p>\\n\\n\\n\\n<p>Parallax effects are a good example. Those are universally problematic for folks with motion sensitivities based on my own research, yet it\\u2019s also still a very popular technique. While it wouldn\\u2019t be realistic to call for an end to all parallax effects entirely, implementing parallax responsibly requires giving your users some level of control to turn off that triggering motion.&nbsp;</p>\\n\\n\\n\\n<p>Typically, this is interpreted as including a toggle, setting, or preference for users to indicate their preference for reduced motion, and providing reduced versions of those motion animation effects when it\\u2019s activated. The <a href=\\"https://million-devs.netlify.com/\\" rel=\\"nofollow\\">Netlify 1 Million Devs site</a> is one example of a motion toggle in action, and the <a href=\\"https://animal-crossing.com/\\" rel=\\"nofollow\\">official Animal Crossing site</a> has one too.</p>\\n\\n\\n\\n<figure class=\\"wp-block-image size-full\\"><img alt=\\"Showing a screenshot of Netlify\'s Thanks a Million webpage. A toggle to disable animation is located in the top left corner of the page, above the content, which is set against a mint green background.\\" class=\\"wp-image-320697\\" src=\\"https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/09/Screen-Shot-2020-09-05-at-7.21.37-PM.png?ssl=1\\" /></figure>\\n\\n\\n\\n<h5><strong>Take advantage of the reduce motion feature&nbsp;</strong></h5>\\n\\n\\n\\n<p>Sites or apps that don\\u2019t rely heavily on large amounts of motion might find that a custom toggle isn\\u2019t the right strategy for them, and instead use the <code>prefers-reduced-motion</code> media query on its own. This allows you to provide a reduced version of highly animated content when that preference is present globally via the user\\u2019s operating system. It\\u2019s also a setting they can set in one place and have it affect a variety of content they encounter. That makes it a great tool for us to use to detect and respond to a user\\u2019s need for reduced motion.&nbsp;</p>\\n\\n\\n\\n<p><a href=\\"https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities/\\">I\\u2019ve written about using <code>prefers-reduced-motion</code> in detail over at Smashing Magazine</a>, and it\\u2019s also been covered by <a href=\\"https://css-tricks.com/introduction-reduced-motion-media-query/\\">other articles</a> on this site. In short, it allows us to access someone\\u2019s OS-level motion preference via a media query. We can access it in CSS or JavaScript and use the returned value to provide a reduced motion experience for those who want it. For example, we could do this to create a reduced motion variation of a bouncing CSS animation:&nbsp;&nbsp;</p>\\n\\n\\n\\n<pre class=\\"wp-block-csstricks-code-block language-css\\" rel=\\"css\\"><code>/* A constant bouncing motion effect applied to the title */\\nh2 {\\n  animation: bouncing 1.5s linear infinite alternate;\\n}\\n\\n/* Replace it with a safer effect when prefers-reduced-motion returns true */\\n@media (prefers-reduced-motion: reduce) {\\n  h2 {\\n    animation: fade 0.5s ease-in both;\\n  }\\n}</code></pre>\\n\\n\\n\\n<div class=\\"wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper\\">CodePen Embed Fallback</div>\\n\\n\\n\\n<p>Some sites opt to use both a custom toggle and reduced motion preferences together. If you go to the site with reduced motion requested in your operating system settings, you automatically get the reduced motion mode. This two-pronged approach is a great strategy for sites with large amounts of motion. Marcy Sutton covers the basics of how to set up this approach in <a href=\\"https://egghead.io/courses/start-building-accessible-web-applications-today\\" rel=\\"nofollow\\">her egghead.io course</a>, as well as in <a href=\\"https://codepen.io/marcysutton/pen/yqVVeY?editors=0010\\" rel=\\"nofollow\\">this CodePen demo</a>.&nbsp;</p>\\n\\n\\n\\n<h2>Use these guidelines for your next animation project</h2>\\n\\n\\n\\n<p>There you have it, everything the WCAG says about animation explained in one place. I hope this article will help you to confidently make your web animation work accessible. Sometimes it takes a little extra effort, but that extra effort is totally worth it when it means you\\u2019ve expanded the number of people who can meaningfully interact with your site.</p>\\n\\n\\n\\n<p>This article focused on the recommendations specific to animation, but animation isn\\u2019t the only place in our work where accessibility considerations can make a big impact.&nbsp;There are some great resources on accessibility out there that cover a more holistic view on accessibility. One of my favorites is the book <em><a href=\\"https://abookapart.com/products/accessibility-for-everyone\\">Accessibility for Everyone</a></em> by <a href=\\"https://laurakalbag.com\\" rel=\\"nofollow\\">Lara Kalbag</a>. Sites like <a href=\\"https://webaim.org/resources/\\">WebAIM</a> and the <a href=\\"https://a11yproject.com/resources/\\">A11y Project</a> are great ones to check out for a wealth of resources. If you\\u2019re doing a lot of your animation work with SVG, <a href=\\"https://css-tricks.com/accessible-svgs/\\">Heather\\u2019s SVG accessibility article</a> is a good resource as well. I highly recommend checking out these resources if you haven\\u2019t already.&nbsp;</p>\\n<hr />\\n<p>The post <a href=\\"https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/\\" rel=\\"nofollow\\">Accessible Web Animation: The WCAG on Animation Explained</a> appeared first on <a href=\\"https://css-tricks.com\\" rel=\\"nofollow\\">CSS-Tricks</a>.</p>\\n<p>You can support CSS-Tricks by being an <a href=\\"https://css-tricks.com/product/mvp-supporter/\\">MVP Supporter</a>.</p>"')

    const { remote } = require('electron')
    const { shell, clipboard } = require('electron')
    const { Menu, MenuItem } = remote
    const isMac = process.platform === 'darwin'

    function truncateStr(str) {
        return str.length < 10 ? str : str.slice(0, 10) + '...'
    }
    import { onMount } from 'svelte';

    onMount(() => {
        document.querySelectorAll("#omr-third-html img").forEach(item => {

            item.addEventListener('contextmenu', event => {
                event.preventDefault()
                event.stopPropagation()
                alert(event)
            })
        })
    });

    function showPostCtxMenu(event) {
        const hasText = window.getSelection().toString().trim().length > 0
        const truncateText = truncateStr(window.getSelection().toString().trim())

        const menu = new Menu();
        menu.append(new MenuItem({
            label: "⭐️  Star",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "📌  Mark as unread",
            click: function(){
                alert(`you clicked on`);
            }
        }));

        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: `🔍  Search "${truncateText}" with Google`,
            visible: hasText,
            click: function(){
                const url = new URL('https://www.google.com/search');
                url.searchParams.set('q', window.getSelection().toString());
                shell.openExternal(url.toString());
            }
        }));
        menu.append(new MenuItem({
            label: `📗  Look Up "${truncateText}"`,
            visible: hasText && isMac,
            click: function(){
                remote.getCurrentWindow().showDefinitionForSelection()
            }
        }));
        menu.append(new MenuItem({
            visible: isMac && hasText,
            label: "🔊  Speaking",
            submenu: [
                {"role": "startSpeaking"},
                {"role": "stopSpeaking"},
            ]
        }));

        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "🔗  Copy Link",
            click: function(){
                clipboard.writeText(entryInfo.link)
            }
        }));
        menu.append(new MenuItem({
            label: "🧭  Open in Browser",
            click: function(){
                shell.openExternal(entryInfo.link);
            }
        }));

        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "✏️  Edit Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🗑  Unsubscribe Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));

        menu.popup({ window: remote.getCurrentWindow() })
    }

</script>

<style>
    #omr-post {
        min-width: 500px;
        padding: 0 18px 10px 28px;
        background-color: #f3f3f3;
    }
    .post-title-line {
        display: flex;
        align-items: center;
    }
    .post-title-line i {
        width: 48px;
        min-width: 48px;
        padding-left: 12px;
        padding-right: 12px;
    }
    .post-title {
        flex-grow: 1;
        font-size: 2rem;
        margin-top: 16px;
        margin-bottom: 16px;
    }
    .post-meta {
        color: #616161;
        padding-bottom: 12px;
    }
</style>

<div id="omr-post" class="drag">
    <div class="post-title-line drag">
        <div class="post-title no-drag">{ entryInfo.title }</div>
        <i class="material-icons {entryInfo.stats.has_stared ? 'primary-color' : ''}">
            {entryInfo.stats.has_stared ? 'star' : 'star_border'}</i>
        <i class="material-icons">format_size</i>
    </div>

    <div class="post-meta">
        <div class="chip no-drag">
            {entryInfo.author}
        </div>
        <div class="chip no-drag">
            <a target="_blank" href="{entryInfo.link}">{entryInfo.link}</a>
        </div>
    </div>

    <div class="divider"></div>

    <div class="flow-text no-drag" id="omr-third-html" on:contextmenu={showPostCtxMenu}>
        { @html content }
    </div>

</div>