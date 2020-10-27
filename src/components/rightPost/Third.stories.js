import Third, {thirdContent} from './Third.svelte';

export default {
    title: 'Third',
    excludeStories: /.*Data$/,
};

export const codeHighlight = () => ({
    Component: Third,
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
                "has_starred": true,
                "uv_starred": 5,
                "uv_view": 246,
            }
        }
    },
    on: {},
});
