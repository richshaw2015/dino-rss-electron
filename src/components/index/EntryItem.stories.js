import EntryItem from './EntryItem.svelte';

export default {
    title: 'EntryItem',
    excludeStories: /.*Data$/,
};

export const EntryItemDefault = () => ({
    Component: EntryItem,
    props: {},
    on: {},
});

export const EntryItemUnread = () => ({
    Component: EntryItem,
    props: {
        entryInfo: {
            "id": 1233,
            "title": "Thinking About Power Usage and Websites Tips, Tricks, and Techniques on using Cascading Styl",
            "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
            "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
            "author": "css-tricks.coabcddsfsferewm",
            "image": "https://css-tricks.com/apple-touch-icon.png",
            "updated": "3 Hours ago hahaha wowowo",
            "feed": {
                "id": 2,
                "title": "CSS-Tricks",
                "link": "https://css-tricks.com",
                "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
                "rss": "https://css-tricks.com/feed/",
            },
            "stats": {
                "has_read": false,
                "has_stared": true,
                "uv_stared": 9999,
                "uv_view": 88908,
            }
        }
    },
    on: {},
});


