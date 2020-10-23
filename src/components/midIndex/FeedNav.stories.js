import FeedNav from './FeedNav.svelte';

export default {
    title: 'FeedNav',
    excludeStories: /.*Data$/,
};

export const Default = () => ({
    Component: FeedNav,
    props: {},
    on: {},
});

export const NoUnread = () => ({
    Component: FeedNav,
    props: {
        feedInfo : {
            "id": 1233,
            "title": "CSS-Tricks",
            "link": "https://css-tricks.com/",
            "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
            "author": "css-tricks.com",
            "image": "https://css-tricks.com/apple-touch-icon.png",
            "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
            "rss": "https://css-tricks.com/feed/",
            "is_active": true,
            "is_podcast": false,
            "stats": {
                "update_count": 238,
                "update_ts": '3 days ago',
                "unread_count": 0,
                "unread_list": [],
            }
        }
    },
    on: {},
});

export const SuperLong = () => ({
    Component: FeedNav,
    props: {
        feedInfo : {
            "id": 1233,
            "title": "CSS-Tricks Tips, Tricks, and Techniques on using Cascading Style Sheets",
            "link": "https://css-tricks.com/",
            "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
            "author": "css-tricks.com",
            "image": "https://css-tricks.com/apple-touch-icon.png",
            "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
            "rss": "https://css-tricks.com/feed/",
            "is_active": true,
            "is_podcast": false,
            "stats": {
                "update_count": 238,
                "update_ts": '3 days ago',
                "unread_count": 0,
                "unread_list": [],
            }
        }
    },
    on: {},
});
