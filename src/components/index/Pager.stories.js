import Pager from './Pager.svelte';

export default {
    title: 'Pager',
    excludeStories: /.*Data$/,
};

export const AllAvailable = () => ({
    Component: Pager,
    props: {
        curPage: 2,
        numPages: 99,
    },
    on: {},
});

export const FirstPage = () => ({
    Component: Pager,
    props: {
        curPage: 1,
        numPages: 2,
    },
    on: {},
});

export const EndPage = () => ({
    Component: Pager,
    props: {
        curPage: 3,
        numPages: 3,
    },
    on: {},
});

