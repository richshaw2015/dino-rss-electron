import Podcast from './Podcast.svelte';

export default {
    title: 'Podcast',
    excludeStories: /.*Data$/,
};

export const ximalaya = () => ({
    Component: Podcast,
    props: {},
    on: {},
});

export const nullEpisode = () => ({
    Component: Podcast,
    props: {
        episode: {
            "version": 5,
            "show": {
                "title": "Syntax - Tasty Web Development Treats",
                "subtitle": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
                "poster": "http://imagev2.xmcdn.com/group5/M03/A6/D8/wKgDtlR1MD_T1DQHAANqZDyk48s720.jpg",
                "link": "https://css-tricks.com",
            },
            "title": "就会累20.9.30（采采）",
            "link": "https://traffic.libsyn.com/secure/syntax/Syntax288.mp3",
            "publicationDate": "Wed, 30 Sep 2020 13:00:00 +0000",
        }
    },
    on: {},
});
