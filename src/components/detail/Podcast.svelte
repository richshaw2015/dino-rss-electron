<script>
    import { afterUpdate } from 'svelte';

    export let episodeInfo = {
        "version": 5,
        "show": {
            "title": "Syntax - Tasty Web Development Treats",
            "subtitle": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
            "poster": "http://imagev2.xmcdn.com/group5/M03/A6/D8/wKgDtlR1MD_T1DQHAANqZDyk48s720.jpg",
            "link": "https://css-tricks.com",
        },
        "title": "段子来了丨活动活动，要活就要动；人类人类，是人就会累20.9.30（采采）",
        "link": "https://traffic.libsyn.com/secure/syntax/Syntax288.mp3",
        "publicationDate": "Wed, 30 Sep 2020 13:00:00 +0000",
        "poster": "http://imagev2.xmcdn.com/group88/M06/9F/58/wKg5CV90KTfg9nbuAAhSGuVenow906.png!op_type=3&columns=640&rows=640",
        "duration": "0:41:15",
        "audio": [
            {
                "url": "http://aod.cos.tx.xmcdn.com/storages/5592-audiofreehighqps/FC/3F/CMCoOSEDSe7wAHTrfwBZH1KJ.m4a",
                "mimeType": "audio/x-m4a",
                "length": 2475
            }
        ]
    }

    const podcastConfig = {
        "base": "./podplayer/",
        "theme": {
            "tokens": {
                "brand": "#166255",
                "brandDark": "#166255",
                "brandDarkest": "#1A3A4A",
                "brandLightest": "#E5EAECFF",
                "shadeDark": "#807E7C",
                "shadeBase": "#807E7C",
                "contrast": "#000",
                "alt": "#fff"
            },
        }
    }

    afterUpdate(() => {
        window.podlovePlayer('#omr-post-third-podcast', episodeInfo, podcastConfig)
    });
</script>

<style>
</style>

<div id="omr-post-third-podcast">
    <root style="max-width:950px;min-width:500px;">
        <div class="tablet:px-6 tablet:pt-6 mobile:px-4 mobile:pt-4 flex flex-col">
            <div class="flex-col items-center mobile:flex tablet:hidden">
                <show-title class="text-sm"></show-title>
                <episode-title class="text-base mb-2"></episode-title>
                <subscribe-button
                        class="mb-4 mobile:flex tablet:hidden"
                ></subscribe-button>
                <poster class="rounded-sm w-48 shadow overflow-hidden"></poster>
                <divider class="w-full my-6"></divider>
            </div>

            <div class="tablet:flex flex-grow">
                <div class="w-64 mobile:hidden tablet:block tablet:mr-6">
                    <poster class="rounded-sm shadow overflow-hidden"></poster>
                </div>
                <div class="w-full">
                    <div class="hidden tablet:block">
                        <show-title class="text-base"></show-title>
                        <episode-title class="text-xl desktop:text-2xl"></episode-title>
                        <divider class="w-full my-4"></divider>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="block">
                            <play-state on="active">
                                <speed-control
                                        class="block hidden tablet:block"
                                ></speed-control>
                            </play-state>
                        </div>

                        <div class="flex">
                            <play-state on="active">
                                <chapter-previous class="mx-2 block"></chapter-previous>
                            </play-state>
                            <play-state on="active">
                                <step-backward class="mx-2 block"></step-backward>
                            </play-state>

                            <play-button class="mx-2 block" label="播放"></play-button>

                            <play-state on="active">
                                <step-forward class="mx-2 block"></step-forward>
                            </play-state>
                            <play-state on="active">
                                <chapter-next class="mx-2 block"></chapter-next>
                            </play-state>
                        </div>

                        <div class="block">
                            <play-state on="active">
                                <volume-control
                                        class="flex items-center hidden tablet:flex"
                                ></volume-control>
                            </play-state>
                        </div>
                    </div>
                    <div class="flex w-full">
                        <progress-bar></progress-bar>
                    </div>
                    <div class="flex w-full -mt-2">
                        <div class="w-3/12 text-left">
                            <timer-current class="text-sm"></timer-current>
                        </div>
                        <div class="w-6/12 text-center">
                            <play-state on="active">
                                <current-chapter class="text-sm truncate"></current-chapter>
                            </play-state>
                        </div>
                        <div class="w-3/12 text-right">
                            <timer-duration class="text-sm"></timer-duration>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full mt-6 mb-3"></div>
        </div>
        <error></error>
    </root>
</div>
