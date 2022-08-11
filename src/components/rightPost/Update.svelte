<script>
    import {i18n, warnToast} from "../utils/helper"

    import FeedCard2 from '../global/FeedCard2.svelte'
    import { apiReq } from '../utils/req.js'
    import { isApiLoading, hourUpdateRsp } from '../utils/store.js'
    import { onMount } from 'svelte'

    onMount(() => {
        if ($hourUpdateRsp.length === 0) {
            isApiLoading.set(true)
        }

        apiReq('/api/explore/last/hour').then( rsp => {
            if (rsp.code === 0) {
                hourUpdateRsp.set(rsp.data)
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

{#if $hourUpdateRsp.length > 0}
<div class="row">
    {#each $hourUpdateRsp as data}
        <div class="col s6">
            <FeedCard2 data={data} />
        </div>
    {/each}
</div>
{/if}
