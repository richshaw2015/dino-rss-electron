import FeedItem from './FeedItem.svelte';

export default {
    title: 'FeedItem',
    excludeStories: /.*Data$/,
};

export const NoUnread = () => ({
    Component: FeedItem,
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

export const Podcast = () => ({
    Component: FeedItem,
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
            "is_podcast": true,
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


export const NotActive = () => ({
    Component: FeedItem,
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
            "is_active": false,
            "is_podcast": true,
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

export const PodcastUnread = () => ({
    Component: FeedItem,
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
            "is_active": false,
            "is_podcast": true,
            "stats": {
                "update_count": 238,
                "update_ts": '3 days ago',
                "unread_count": 64,
                "unread_list": [],
            }
        }
    },
    on: {},
});

export const SyncError = () => ({
    Component: FeedItem,
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
            "is_active": false,
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