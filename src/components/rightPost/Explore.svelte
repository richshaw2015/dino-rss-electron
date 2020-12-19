<script>
    let recentApiRsp

    import { warnToast } from "../utils/helper"

    import FeedCard from '../global/FeedCard.svelte'
    import { apiReq } from '../utils/req.js'
    import { isApiLoading } from '../utils/store.js'
    import { onMount } from 'svelte'

    onMount(() => {
        isApiLoading.set(true)
        apiReq('/api/recent/feeds').then( rsp => {
            if (rsp.code === 0) {
                recentApiRsp = rsp
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

{#if recentApiRsp}
<div class="row">
    {#each recentApiRsp.data as feed}
        <div class="col s6">
            <FeedCard feedInfo={feed} />
        </div>
    {/each}
</div>
{/if}
