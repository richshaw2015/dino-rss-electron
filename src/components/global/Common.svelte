<script>
    export let listRsp = {}

    import { shortToast, toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { viewMode, viewScope, activeEntry, activeFeed, isFeedEntriesView, entryContentRsp, feedListRspBak } 
        from '../store/store.js'

    const Mousetrap = require('mousetrap')

    import { onMount } from 'svelte'

    function isInList(item, list) {
        for (let i of list) {
           if (item.id === i.id) {
               return true
           } 
        }
        return false
    }

    function getEntryContent(entry) {
        entryContentRsp.set({})

        apiReq('/api/entry/get/content', {
            entry_id: $activeEntry.id,
            feed_id: $activeEntry.feed.id,
            is_podcast: $activeEntry.feed.is_podcast
        }).then( rsp => {
            if (rsp.episode && Object.keys(rsp.episode).length > 0) {
                let episodeBase = {
                    "version": 5,
                    "show": {
                        "title": $activeEntry.feed.title,
                        "subtitle": $activeEntry.feed.description,
                        "poster": $activeEntry.feed.image,
                        "link": $activeEntry.feed.link,
                    },
                    "title": $activeEntry.title,
                    "link": $activeEntry.link,
                    "publicationDate": $activeEntry.updated
                }
                entryContentRsp.set({
                    code: rsp.code || 0,
                    content: rsp.content,
                    episode: Object.assign(episodeBase, rsp.episode)
                })
            } else {
                entryContentRsp.set({
                    code: rsp.code || 0,
                    content: rsp.content
                })
            }

            // sync read status
            listRsp.data[entry._index].stats.has_read = true
        }).catch(err => {
            const msg =  err + ' Content'
            entryContentRsp.set({
                    code: -1,
                    msg: msg
            })

            warnToast(msg)
        })
    }

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('n', function() {
            if (listRsp.data.length === 0 || listRsp.code !== 0) {
                return false
            }
            if ($viewMode === 'entry' || ($viewMode === 'feed' && $isFeedEntriesView) ) {
                if (!isInList($activeEntry, listRsp.data)) {
                    shortToast("Next Entry")
                    activeEntry.set(listRsp.data[0])
                } else {
                    const index = $activeEntry._index + 1
                    if (index === listRsp.data.length) {
                        warnToast("Already the last Entry")
                    } else {
                        shortToast("Next Entry")
                        activeEntry.set(listRsp.data[index])
                    }
                }
            } else {
                if (!isInList($activeFeed, listRsp.data)) {
                    shortToast("Next Feed")
                    activeFeed.set(listRsp.data[0])
                } else {
                    const index = $activeFeed._index + 1
                    if (index === listRsp.data.length) {
                        warnToast("Already the last Feed")
                    } else {
                        shortToast("Next Feed")
                        activeFeed.set(listRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind('N', function() {
            if (listRsp.data.length === 0 || listRsp.code !== 0) {
                return false
            }
            if ($viewMode === 'entry' || ($viewMode === 'feed' && $isFeedEntriesView) ) {
                if (!isInList($activeEntry, listRsp.data)) {
                    shortToast("Previous Entry")
                    activeEntry.set(listRsp.data[0])
                } else {
                    const index = $activeEntry._index - 1
                    if (index < 0) {
                        warnToast("Already the first Entry")
                    } else {
                        shortToast("Previous Entry")
                        activeEntry.set(listRsp.data[index])
                    }
                }
            } else {
                if (!isInList($activeFeed, listRsp.data)) {
                    shortToast("Previous Feed")
                    activeFeed.set(listRsp.data[0])
                } else {
                    const index = $activeFeed._index - 1
                    if (index < 0 ) {
                        warnToast("Already the first Feed")
                    } else {
                        shortToast("Previous Feed")
                        activeFeed.set(listRsp.data[index])
                    }
                }
            }
            return false
        });

        activeEntry.subscribe(entry => {
            if (entry.id) {
                console.log(entry)
                getEntryContent(entry)
            }
        });
    })
</script>

