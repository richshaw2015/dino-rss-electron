<script>
    import {onMount} from 'svelte'

    const Mousetrap = require('mousetrap')
    const fs = require('fs')
    const path = require('path')

    import {getFontSize} from '../utils/storage.js'
    import {
        isInList,
        shortToast,
        toast,
        warnToast,
        copyToClipboard,
        getCacheDir,
        setEntryCache
    } from '../utils/helper.js'
    import {SCROLLSTEP} from '../utils/config.js'

    import Find from '../global/Find.svelte'
    import Title from './Title.svelte'
    import Statusbar from './Statusbar.svelte'
    import Third from './Third.svelte'

    import {apiReq} from '../utils/req.js'
    import {
        rssActiveEntry, rssListRsp, rssEntryContentRsp, starActiveEntry, starEntryContentRsp, endPodcastMini,
        activeTab, unreadCountRsp, rssFeedEntriesView, rssActiveFeed, showPodcastMini, podcastMiniInfo
    } from '../utils/store.js'
    import PodcastAudio from "../global/PodcastAudio.svelte";

    let fontSize = getFontSize()

    const entryCacheDir = getCacheDir()

    function getEntryCache(entryId) {
        if (!fs.existsSync(entryCacheDir)) {
            fs.mkdirSync(entryCacheDir, {recursive: true})
            return null
        }

        const entryCacheFile = path.join(entryCacheDir, entryId + ".json")
        if (!fs.existsSync(entryCacheFile)) {
            return null
        } else {
            try {
                return JSON.parse(fs.readFileSync(entryCacheFile, 'utf8'))
            } catch (e) {
                console.log(e)
            }
        }
    }

    function getEntryContent(entry) {
        const entryCache = getEntryCache(entry.id)
        // hit cache
        if (entryCache) {
            if ($activeTab === "star") {
                starEntryContentRsp.set(entryCache)
            } else if ($activeTab === "rss") {
                rssEntryContentRsp.set(entryCache)
            }

            try {
                document.querySelector('#omr-post-third-html').scrollTop = 0
            } catch (e) {
            }

            return true
        }

        // through network api
        let activeEntry
        let entryContentRsp

        if ($activeTab === "star") {
            activeEntry = $starActiveEntry
            starEntryContentRsp.set(undefined)
        } else if ($activeTab === "rss") {
            activeEntry = $rssActiveEntry
            rssEntryContentRsp.set(undefined)
        }

        apiReq('/api/entry/get/content', {
            entry_id: activeEntry.id,
            feed_id: activeEntry.feed.id,
            is_podcast: activeEntry.feed.is_podcast
        }).then(rsp => {
            if (rsp.episode && Object.keys(rsp.episode).length > 0) {
                let episodeBase = {
                    "version": 5,
                    "show": {
                        "title": activeEntry.feed.title,
                        "subtitle": activeEntry.feed.description,
                        "poster": activeEntry.image,
                        "link": activeEntry.feed.link,
                    },
                    "title": activeEntry.title,
                    "link": activeEntry.link,
                    "publicationDate": activeEntry.updated
                }
                entryContentRsp = {
                    code: rsp.code,
                    content: rsp.content,
                    episode: Object.assign(episodeBase, rsp.episode)
                }
                if (!entryContentRsp.episode.poster) {
                    entryContentRsp.episode.poster = activeEntry.image
                }
            } else {
                entryContentRsp = rsp
            }

            // auto link
            entryContentRsp.content = Autolinker.link(entryContentRsp.content, {
                phone: false, stripPrefix: false, stripTrailingSlash: false
            })
            // set cache
            setEntryCache(entry.id, rsp)

            if ($activeTab === "star") {
                starEntryContentRsp.set(entryContentRsp)
            } else if ($activeTab === "rss") {
                rssEntryContentRsp.set(entryContentRsp)

                // sync rss read status
                if (isInList(entry, $rssListRsp.data)) {
                    if (!$rssListRsp.data[entry._index].stats.has_read) {
                        $rssListRsp.data[entry._index].stats.has_read = true
                        $unreadCountRsp.count -= 1

                        if ($rssFeedEntriesView) {
                            $rssActiveFeed.stats.unread_count -= 1
                        }
                    }
                }
            }
        }).catch(err => {
            if ($activeTab === "star") {
                starEntryContentRsp.set({
                    code: -1,
                    msg: err
                })
            } else if ($activeTab === "rss") {
                rssEntryContentRsp.set({
                    code: -1,
                    msg: err
                })
            }
        })
    }

    onMount(() => {
        M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {})

        // keyboard shortcut
        Mousetrap.bind('j', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop += SCROLLSTEP
            } catch (e) {
            }
            return false
        });
        Mousetrap.bind('d', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop +=
                    document.querySelector('#omr-post-third-html').offsetHeight / 2 - 20
            } catch (e) {
            }
            return false
        });

        Mousetrap.bind('k', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop -= SCROLLSTEP
            } catch (e) {
            }
            return false
        });
        Mousetrap.bind('u', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop -=
                    document.querySelector('#omr-post-third-html').offsetHeight / 2 - 20
            } catch (e) {
            }
            return false
        });

        Mousetrap.bind('g g', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop = 0
            } catch (e) {
            }
            return false
        });
        Mousetrap.bind('G', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop =
                    document.querySelector('#omr-post-third-html').scrollHeight
            } catch (e) {
            }
            return false
        });
        Mousetrap.bind('space', function () {
            try {
                document.querySelector('#omr-post-third-html').scrollTop +=
                    document.querySelector('#omr-post-third-html').offsetHeight - 40
            } catch (e) {
            }
            return false
        });
        Mousetrap.bind('y y', function () {
            if ($activeTab === "star") {
                copyToClipboard($starActiveEntry.link)
            } else if ($activeTab === "rss") {
                copyToClipboard($rssActiveEntry.link)
            }
            return false
        });
    })

    rssActiveEntry.subscribe(entry => {
        if (entry.id) {
            console.log("rssActiveEntry changed")
            getEntryContent(entry)
        }
        return entry
    });
    starActiveEntry.subscribe(entry => {
        if (entry.id) {
            console.log("starActiveEntry changed")
            getEntryContent(entry)
        }
        return entry
    });
</script>

{#if $activeTab === "rss"}
    <Title bind:fontSize activeEntry={$rssActiveEntry} />

    <Third {fontSize} activeEntry={$rssActiveEntry} entryContentRsp={$rssEntryContentRsp} />

    <Statusbar activeEntry={$rssActiveEntry} />
{:else if $activeTab === "star" }
    <Title bind:fontSize activeEntry={$starActiveEntry} />

    <Third {fontSize} activeEntry={$starActiveEntry} entryContentRsp={$starEntryContentRsp} />

    <Statusbar activeEntry={$starActiveEntry} />
{:else if $activeTab === "apps" }
    <Title />
    <Third {fontSize} />
{/if}

<Find />

{#if !$endPodcastMini && $showPodcastMini}
    <PodcastAudio podcastInfo={$podcastMiniInfo} />
{/if}