<script>
    import {i18n, warnToast} from "../utils/helper"

    import FeedCard from '../global/FeedCard.svelte'
    import { apiReq } from '../utils/req.js'
    import { isApiLoading, recentAddRsp } from '../utils/store.js'
    import { onMount } from 'svelte'

    onMount(() => {
        if ($recentAddRsp.length === 0) {
            isApiLoading.set(true)
        }

        apiReq('/api/recent/feeds').then( rsp => {
            if (rsp.code === 0) {
                recentAddRsp.set(rsp.data)
            } else {
                warnToast(i18n("unknown.error"))
            }
        }).catch(err => {
            warnToast(err)
        }).finally(() => {
            isApiLoading.set(false)
        })
    })
</script>

<style>
</style>

{#if $recentAddRsp.length > 0}
<div class="row">
    {#each $recentAddRsp as feed}
        <div class="col s6">
            <FeedCard feedInfo={feed} />
        </div>
    {/each}
</div>
{/if}
