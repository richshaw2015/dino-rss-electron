import TopToolbar from './Toolbar.svelte';

export default {
    title: 'TopToolbar',
    excludeStories: /.*Data$/,
};

export const RssTab = () => ({
    Component: TopToolbar,
    props: {
        activeTab: 'rss',
        mode: 'feed',
        scope: 'unread',
    },
    on: {},
});

export const RssTabAll = () => ({
    Component: TopToolbar,
    props: {
        activeTab: 'rss',
        mode: 'entry',
        scope: 'all',
    },
    on: {},
});

export const StarTab = () => ({
    Component: TopToolbar,
    props: {
        activeTab: 'star',
        mode: 'feed',
        scope: 'unread',
    },
    on: {},
});

export const StarTabAll = () => ({
    Component: TopToolbar,
    props: {
        activeTab: 'star',
        mode: 'entry',
        scope: 'all',
    },
    on: {},
});

export const AppsTab = () => ({
    Component: TopToolbar,
    props: {
        activeTab: 'apps',
        mode: 'entry',
        scope: 'all',
    },
    on: {},
});