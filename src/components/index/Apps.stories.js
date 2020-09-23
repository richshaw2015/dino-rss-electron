import Apps from './Apps.svelte';

export default {
    title: 'Apps',
    excludeStories: /.*Data$/,
};

export const Default = () => ({
    Component: Apps,
    props: {
    },
    on: {},
});
