import Post from './Post.svelte';

export default {
    title: 'Post',
    excludeStories: /.*Data$/,
};

export const Default = () => ({
    Component: Post,
    props: {
    },
    on: {},
});
