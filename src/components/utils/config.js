export const SERVER = "__SERVER__"

// j k shortcut scroll
export const SCROLLSTEP = 60

export const SPONSORS = [{
        name: "JetBrains",
        link: "https://www.jetbrains.com/?from=dinorss",
        image: "icon/jetbrains.svg"
    }
]
export const SUPPORTERS = [
    {
        name: "@leeiv",
        link: "https://twitter.com/leeiv",
        image: "icon/supporter/leeiv.jpg"
    },
]

export const podcastConfig = {
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

export const podcastTemplate = `
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
                    </div>
                    <div class="w-3/12 text-right">
                        <timer-duration class="text-sm"></timer-duration>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full mb-4"></div>
    </div>
    <error></error>
</root>`
