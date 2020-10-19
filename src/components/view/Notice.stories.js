import Notice from './Notice.svelte';

export default {
    title: 'Notice',
    excludeStories: /.*Data$/,
};

export const Loading = () => ({
    Component: Notice,
    props: {
        level: 'loading'
    },
    on: {},
});

export const Success = () => ({
    Component: Notice,
    props: {
        level: 'succ',
        msg: 'You have done',
    },
    on: {},
});

export const Error = () => ({
    Component: Notice,
    props: {
        level: 'warn',
        msg: 'We have met an error',
    },
    on: {},
});

export const Info = () => ({
    Component: Notice,
    props: {
        level: 'info',
        msg: 'See you tomorrow',
    },
    on: {},
});