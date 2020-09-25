<script>
    import Nav from './components/navbar/Nav.svelte';
    import Toolbar from './components/index/Toolbar.svelte'
    import FeedItem from './components/index/FeedItem.svelte'
    import FeedNav from './components/index/FeedNav.svelte'
    import Pager from './components/pager/Pager.svelte'
    import Post from './components/detail/Post.svelte'

    let activeTab = 'rss'
</script>

<style>
    .main-container {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        align-items: stretch;
        height: 100vh;
    }
    .left-container {
        width: 70px;
        min-width: 70px;
        max-width: 70px;
        overflow: hidden;
    }
    .middle-container {
        width: 400px;
        min-width: 400px;
        max-width: 400px;
        padding: 0 10px;
        border-right: 1px dashed rgba(0,0,0,.14);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .right-container {
        flex-grow: 1;
        overflow-y: auto;
    }
    .middle-list {
        flex-grow: 1;
    }
    .mid-index-ul {
        margin: 8px 0 12px 0;
    }
    .mid-list-li {
        padding: 0;

    }
    .mid-list-li:not(.active):hover{
        background-color:#ddd;
        cursor: pointer;
    }
</style>

<div class="main-container">
    <div class="left-container">
        <Nav bind:activeTab />
    </div>

    <div class="middle-container">
        <Toolbar />
        <FeedNav />

        <div class="middle-list">
            <ul class="collection mid-index-ul">
                <li class="collection-item mid-list-li">
                    <FeedItem />
                </li>
                <li class="collection-item mid-list-li">
                    <FeedItem />
                </li>
            </ul>
        </div>

        <Pager />
    </div>

    <div class="right-container">
        <Post />
    </div>

</div>

