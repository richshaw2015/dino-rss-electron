import Titlebar from './Titlebar.svelte';

export default {
    title: 'Titlebar',
    excludeStories: /.*Data$/,
};

export const Fullscreen = () => ({
    Component: Titlebar,
    props: {
        isMaximized: true
    },
    on: {},
});

export const NotFullscreen = () => ({
    Component: Titlebar,
    props: {
        isMaximized: false
    },
    on: {},
});