<script>
    import { onMount } from 'svelte'
    const Mousetrap = require('mousetrap')
    const { clipboard, remote } = require('electron')
    const fs = require('fs')
    const path = require('path')

    import { getFontSize } from '../utils/storage.js'
    import { isInList } from '../utils/helper.js'
    import { scrollStep } from '../utils/config.js'

    import Find from '../global/Find.svelte'
    import Title from './Title.svelte'
    import Statusbar from './Statusbar.svelte'
    import Third from './Third.svelte'    

    import { shortToast, toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { rssActiveEntry, rssListRsp, rssEntryContentRsp, starActiveEntry, starEntryContentRsp, 
        activeTab, unreadCountRsp, rssFeedEntriesView, rssActiveFeed } from '../utils/store.js'

    let fontSize = getFontSize()
    
    const entryCacheDir = path.join(remote.app.getPath('temp'), remote.app.getName(), "entry.tmp")
    
    function setEntryCache(entryId, cacheRsp) {
        const entryCacheFile = path.join(entryCacheDir, entryId + ".json")
        fs.writeFileSync(entryCacheFile, JSON.stringify(cacheRsp), {encoding: "utf8"})
    }
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
            } catch (e) {}

            return true
        }

        // through network api
        let activeEntry
        let entryContentRsp

        if ($activeTab === "star") {
            starEntryContentRsp.set({})
            activeEntry = $starActiveEntry
        } else if ($activeTab === "rss") {
            rssEntryContentRsp.set({})
            activeEntry = $rssActiveEntry
        }

        apiReq('/api/entry/get/content', {
            entry_id: activeEntry.id,
            feed_id: activeEntry.feed.id,
            is_podcast: activeEntry.feed.is_podcast
        }).then( rsp => {
            if (rsp.episode && Object.keys(rsp.episode).length > 0) {
                let episodeBase = {
                    "version": 5,
                    "show": {
                        "title": activeEntry.feed.title,
                        "subtitle": activeEntry.feed.description,
                        "poster": activeEntry.feed.image,
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
            } else {
                entryContentRsp = rsp
            }

            // set cache
            setEntryCache(entry.id, rsp)

            if ($activeTab === "star") {
                starEntryContentRsp.set(entryContentRsp)
            } else if ($activeTab === "rss") {
                rssEntryContentRsp.set(entryContentRsp)

                // sync read status
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
            const msg =  err + ' Content'
            if ($activeTab === "star") {
                starEntryContentRsp.set({
                    code: -1,
                    msg: msg
                })
            } else if ($activeTab === "rss") {
                rssEntryContentRsp.set({
                    code: -1,
                    msg: msg
                })
            }
        })
    }

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('j', function() {
            document.querySelector('#omr-post-third-html').scrollTop += scrollStep
            return false
        });
        Mousetrap.bind('d', function() {
            document.querySelector('#omr-post-third-html').scrollTop += 
                document.querySelector('#omr-post-third-html').offsetHeight / 2 - 20
            return false
        });

        Mousetrap.bind('k', function() {
            document.querySelector('#omr-post-third-html').scrollTop -= scrollStep
            return false
        });
        Mousetrap.bind('u', function() {
            document.querySelector('#omr-post-third-html').scrollTop -= 
                document.querySelector('#omr-post-third-html').offsetHeight / 2 - 20
            return false
        });

        Mousetrap.bind('g g', function() {
            document.querySelector('#omr-post-third-html').scrollTop = 0
            return false
        });
        Mousetrap.bind('G', function() {
            document.querySelector('#omr-post-third-html').scrollTop =
                document.querySelector('#omr-post-third-html').scrollHeight
            return false
        });
        Mousetrap.bind('space', function() {
            document.querySelector('#omr-post-third-html').scrollTop +=
                document.querySelector('#omr-post-third-html').offsetHeight - 40
            return false
        });
        Mousetrap.bind('y y', function() {
            if ($activeTab === "star") {
                clipboard.writeText($starActiveEntry.link)
            } else if ($activeTab === "rss") {
                clipboard.writeText($rssActiveEntry.link)
            }
            shortToast("Link copied")
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
{/if}

<Find />
