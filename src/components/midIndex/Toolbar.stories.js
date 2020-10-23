import TopToolbar from './Toolbar.svelte';

export default {
    title: 'TopToolbar',
    excludeStories: /.*Data$/,
};


export const RssTab = () => ({
    Component: TopToolbar,
    props: {
        mode: 'entry',
        scope: 'all',
    },
    on: {},
});

export const StarTab = () => ({
    Component: TopToolbar,
    props: {
        mode: 'feed',
        scope: 'unread',
    },
    on: {},
});

export const AppsTab = () => ({
    Component: TopToolbar,
    props: {
        mode: 'entry',
        scope: 'all',
    },
    on: {},
});