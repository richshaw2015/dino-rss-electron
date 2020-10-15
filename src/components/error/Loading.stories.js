import Loading from './Loading.svelte';

export default {
    title: 'Loading',
    excludeStories: /.*Data$/,
};

export const LoadingDefault = () => ({
    Component: Loading,
    props: {},
    on: {},
});
