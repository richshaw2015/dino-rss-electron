import Post from './Post.svelte';

export default {
    title: 'Post',
    excludeStories: /.*Data$/,
};

export const Default = () => ({
    Component: Post,
    props: {
    },
    on: {},
});

export const LongTitle = () => ({
    Component: Post,
    props: {
        entryInfo : {
            "id": 1233,
            "title": "Thinking About Power Usage and Websites Thinking About Power Usage and Websites",
            "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
            "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
            "author": "Se",
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
        },
        content: JSON.parse('"<p>Here&#8217;s an important detail here: <strong>It&#8217;s free!</strong></p>\\n<p><a href=\\"https://jamstackconf.com/virtual/\\">Jamstack Conf Virtual</a> is coming up October 6<sup>th</sup> and 7<sup>th</sup>, 2020. <a href=\\"https://jamstackconfvirtual2020.sched.com/\\">The sessions</a> are on October 6<sup>th</sup>. That&#8217;s the free part (<a href=\\"https://ti.to/netlify/jamstack_virtual_oct\\">register here</a>). Then on October 7<sup>th</sup> there are a variety of workshops (they all look great to me) that are $100 USD each. That&#8217;s the classic conference one-two punch. Sessions are for getting a broad sense of what&#8217;s happening and will very likely open &#8230; <a class=\\"read-more\\" href=\\"https://css-tricks.com/jamstack-conf/\\">Read article <span class=\\"screen-reader-text\\"> &#8220;Jamstack Conf&#8221;</span></a></p>\\n<hr />\\n<p>The post <a href=\\"https://css-tricks.com/jamstack-conf/\\" rel=\\"nofollow\\">Jamstack Conf</a> appeared first on <a href=\\"https://css-tricks.com\\" rel=\\"nofollow\\">CSS-Tricks</a>.</p>\\n<p>You can support CSS-Tricks by being an <a href=\\"https://css-tricks.com/product/mvp-supporter/\\">MVP Supporter</a>.</p>"')
    },
    on: {},
});