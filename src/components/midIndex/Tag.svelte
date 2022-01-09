<script>

</script>

<style>
    #omr-tag {
        height: 28px;
    }
    .tag-row {
        margin: 0;
    }
    .tag-row div {
        width: 16.666%;
    }
    .tag-row i {
        font-size: 18px;
        vertical-align: middle;
    }
    .tag-row .col {
        padding: 0 0.2rem;
        cursor: pointer;
    }
    .tag-row .active {
        /*background-color: rgb(230, 230, 230);*/
        /*border-radius: 4px;*/
        border-bottom: 3px solid;
    }

    .count {
        font-size: 13px;
        font-weight: bold;
        vertical-align: middle;
    }

    .tag-red {
        color: rgb(247, 93, 78);
    }
    /*.tag-orange {*/
    /*    color: rgb(247, 163, 55);*/
    /*}*/
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
        <div class="col tag-red active">
            <i class="material-icons">assistant_photo</i>
            <span class="count">32</span>
        </div>
        <!--    <div class="col tag-orange">-->
        <!--        <i class="material-icons">folder</i>-->
        <!--        <span class="count">12</span>-->
        <!--    </div>-->
        <div class="col tag-yellow">
            <i class="material-icons">folder_special</i>
            <span class="count">2</span>
        </div>
        <div class="col tag-green">
            <i class="material-icons">folder_shared</i>
            <span class="count">302</span>
        </div>
        <div class="col tag-blue">
            <i class="material-icons">create_new_folder</i>
            <span class="count">5</span>
        </div>
        <div class="col tag-purple">
            <i class="material-icons">folder</i>
            <span class="count">2</span>
        </div>
        <div class="col tag-grey">
            <i class="material-icons">folder</i>
            <span class="count">0</span>
        </div>
    </div>
</div>
