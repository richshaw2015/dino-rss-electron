<script>
    export let countMap = {};

    import { Tags } from '../utils/constant.js'
    import { activeTag } from '../utils/store.js'

    function switchTag(tag) {
        if (tag === $activeTag) {
            activeTag.set(Tags.all);
        } else {
            activeTag.set(tag);
        }
    }
</script>

<style>
    #omr-tag {
        height: 28px;
    }
    .tag-row {
        margin: 0;
    }
    .tag-col i {
        font-size: 18px;
        vertical-align: middle;
    }
    .tag-col {
        padding: 0 0.2rem;
        cursor: pointer;
        opacity: 1.0;
        width: 16.666%;
    }
    .tag-col:hover {
        opacity: 0.75;
    }
    .tag-col.active {
        border-bottom: 3px solid;
        opacity: 0.9;
    }

    .count {
        font-size: 13px;
        font-weight: bold;
        vertical-align: middle;
    }

    .tag-red {
        color: rgb(247, 93, 78);
    }
    .tag-yellow {
        color: rgb(247, 207, 54);
    }
    .tag-green {
        color: rgb(82, 207, 96);
    }
    .tag-blue {
        color: rgb(54, 141, 247);
    }
    .tag-purple {
        color: rgb(178, 111, 212);
    }
    .tag-grey {
        color: rgb(157, 157, 161);
    }
</style>

<div id="omr-tag">
    <div class="row tag-row">
        <div class="col tag-red tag-col {$activeTag == Tags.red ? 'active' : ''}" on:click={() => switchTag(Tags.red)}>
            <i class="material-icons">assistant_photo</i>
            <span class="count">{countMap[Tags.red] || 0}</span>
        </div>
        <div class="col tag-yellow tag-col {$activeTag == Tags.yellow ? 'active' : ''}" on:click={() => switchTag(Tags.yellow)}>
            <i class="material-icons">folder_special</i>
            <span class="count">{countMap[Tags.yellow] || 0}</span>
        </div>
        <div class="col tag-green tag-col {$activeTag == Tags.green ? 'active' : ''}" on:click={() => switchTag(Tags.green)}>
            <i class="material-icons">folder_shared</i>
            <span class="count">{countMap[Tags.green] || 0}</span>
        </div>
        <div class="col tag-blue tag-col {$activeTag == Tags.blue ? 'active' : ''}" on:click={() => switchTag(Tags.blue)}>
            <i class="material-icons">create_new_folder</i>
            <span class="count">{countMap[Tags.blue] || 0}</span>
        </div>
        <div class="col tag-purple tag-col {$activeTag == Tags.purple ? 'active' : ''}" on:click={() => switchTag(Tags.purple)}>
            <i class="material-icons">folder</i>
            <span class="count">{countMap[Tags.purple] || 0}</span>
        </div>
        <div class="col tag-grey tag-col {$activeTag == Tags.grey ? 'active' : ''}" on:click={() => switchTag(Tags.grey)}>
            <i class="material-icons">folder</i>
            <span class="count">{countMap[Tags.grey] || 0}</span>
        </div>
    </div>
</div>

