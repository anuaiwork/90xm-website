/* =====================================================
   90XM — YOUTUBE RADIO
   Playlist controlled by custom player
===================================================== */

const PLAYLIST_ID = "PLZFw8xFp3oqg";

let player = null;
let isReady = false;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

let errorCount = 0;
let currentVideoId = null;


/* =====================================================
   YOUTUBE IFRAME API
===================================================== */

function onYouTubeIframeAPIReady() {

    console.log("YouTube API loaded");

    player = new YT.Player("youtube-player", {

        height: "1",
        width: "1",

        playerVars: {
            listType: "playlist",
            list: PLAYLIST_ID,

            autoplay: 0,
            controls: 0,
            rel: 0,

            playsinline: 1,

            // Helps YouTube identify the embedding page
            origin: window.location.origin
        },

        events: {

            onReady: youtubeReady,

            onStateChange: youtubeStateChange,

            onError: youtubeError
        }

    });
}


/* =====================================================
   PLAYER READY
===================================================== */

function youtubeReady(event) {

    console.log("90XM YouTube player ready");

    isReady = true;

    errorCount = 0;

    event.target.setVolume(100);

    updateStatus("READY TO PLAY");

    /*
       Make sure the playlist is loaded.
    */

    try {

        event.target.loadPlaylist({
            list: PLAYLIST_ID,
            listType: "playlist",
            index: 0,
            startSeconds: 0
        });

    } catch (error) {

        console.log(
            "Playlist already loaded."
        );

    }

    setTimeout(() => {

        updateSongInfo();

    }, 1000);
}


/* =====================================================
   PLAY / PAUSE
===================================================== */

function togglePlay() {

    if (!isReady || !player) {

        updateStatus("LOADING...");

        return;
    }

    const state =
        player.getPlayerState();

    console.log(
        "Current YouTube state:",
        state
    );


    if (
        state === YT.PlayerState.PLAYING
    ) {

        player.pauseVideo();

    } else {

        player.playVideo();

    }
}


/* =====================================================
   NEXT SONG
===================================================== */

function nextSong() {

    if (!isReady || !player) return;

    console.log("Next song");

    errorCount = 0;

    player.nextVideo();

    setTimeout(() => {

        updateSongInfo();

    }, 800);
}


/* =====================================================
   PREVIOUS SONG
===================================================== */

function previousSong() {

    if (!isReady || !player) return;

    console.log("Previous song");

    errorCount = 0;

    player.previousVideo();

    setTimeout(() => {

        updateSongInfo();

    }, 800);
}


/* =====================================================
   SHUFFLE
===================================================== */

function toggleShuffle() {

    if (!isReady || !player) return;

    isShuffle = !isShuffle;

    console.log(
        "Shuffle:",
        isShuffle
    );

    player.setShuffle(isShuffle);


    const button =
        document.getElementById(
            "shuffleButton"
        );


    if (button) {

        button.classList.toggle(
            "active",
            isShuffle
        );

    }


    updateStatus(
        isShuffle
            ? "SHUFFLE ON"
            : "SHUFFLE OFF"
    );
}


/* =====================================================
   REPEAT
===================================================== */

function toggleRepeat() {

    if (!isReady || !player) return;

    isRepeat = !isRepeat;

    console.log(
        "Repeat:",
        isRepeat
    );

    player.setLoop(isRepeat);


    const button =
        document.getElementById(
            "repeatButton"
        );


    if (button) {

        button.classList.toggle(
            "active",
            isRepeat
        );

    }


    updateStatus(
        isRepeat
            ? "REPEAT ON"
            : "REPEAT OFF"
    );
}


/* =====================================================
   LIKE BUTTON
===================================================== */

function toggleLike() {

    const button =
        document.getElementById(
            "heartButton"
        );

    if (!button) return;


    button.classList.toggle(
        "liked"
    );


    if (
        button.classList.contains(
            "liked"
        )
    ) {

        button.textContent = "♥";

    } else {

        button.textContent = "♡";

    }
}


/* =====================================================
   YOUTUBE STATE CHANGE
===================================================== */

function youtubeStateChange(event) {

    console.log(
        "YouTube state:",
        event.data
    );


    /* ---------------------------------------------
       PLAYING
    --------------------------------------------- */

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        isPlaying = true;

        errorCount = 0;

        updatePlayButton();

        updateStatus(
            "NOW PLAYING"
        );


        document
            .querySelector(".player")
            ?.classList.remove(
                "paused"
            );


        updateSongInfo();

    }


    /* ---------------------------------------------
       PAUSED
    --------------------------------------------- */

    else if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        isPlaying = false;

        updatePlayButton();

        updateStatus(
            "PAUSED"
        );


        document
            .querySelector(".player")
            ?.classList.add(
                "paused"
            );

    }


    /* ---------------------------------------------
       BUFFERING
    --------------------------------------------- */

    else if (
        event.data ===
        YT.PlayerState.BUFFERING
    ) {

        updateStatus(
            "BUFFERING..."
        );

    }


    /* ---------------------------------------------
       ENDED
    --------------------------------------------- */

    else if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        isPlaying = false;

        updatePlayButton();


        if (!isRepeat) {

            setTimeout(() => {

                player.nextVideo();

            }, 300);

        }

    }

}


/* =====================================================
   YOUTUBE ERROR
===================================================== */

function youtubeError(event) {

    console.error(
        "YouTube Error:",
        event.data
    );


    /*
       YouTube error codes:

       2   = Invalid parameter
       5   = HTML5 player error
       100 = Video not found/private
       101 = Embedding not allowed
       150 = Embedding not allowed
       153 = Client identification issue
    */


    updateStatus(
        "SKIPPING UNAVAILABLE SONG..."
    );


    /*
       Some songs in playlists may not be
       allowed to play inside websites.

       Automatically move to the next song.
    */

    errorCount++;


    if (
        errorCount <= 10
    ) {

        setTimeout(() => {

            console.log(
                "Skipping unavailable video..."
            );

            player.nextVideo();

        }, 1200);

    } else {

        updateStatus(
            "PLAYLIST UNAVAILABLE"
        );

        console.error(
            "Too many unavailable videos."
        );

    }
}


/* =====================================================
   PLAY BUTTON UI
===================================================== */

function updatePlayButton() {

    const button =
        document.getElementById(
            "playButton"
        );


    if (!button) return;


    if (isPlaying) {

        button.textContent = "Ⅱ";

    } else {

        button.textContent = "▶";

    }
}


/* =====================================================
   STATUS
===================================================== */

function updateStatus(text) {

    const status =
        document.getElementById(
            "statusText"
        );


    if (status) {

        status.textContent = text;

    }
}


/* =====================================================
   SONG INFORMATION
===================================================== */

function updateSongInfo() {

    if (
        !player ||
        !isReady
    ) return;


    setTimeout(() => {

        try {

            const data =
                player.getVideoData();


            console.log(
                "Current video:",
                data
            );


            const title =
                document.getElementById(
                    "songTitle"
                );


            const artist =
                document.getElementById(
                    "songArtist"
                );


            /*
               Update song title
            */

            if (
                title &&
                data &&
                data.title
            ) {

                title.textContent =
                    data.title;

            }


            /*
               Artist/channel
            */

            if (
                artist &&
                data &&
                data.author
            ) {

                artist.textContent =
                    data.author;

            } else if (artist) {

                artist.textContent =
                    "YouTube • 90XM";

            }


            /*
               Store current video
            */

            if (
                data &&
                data.video_id
            ) {

                currentVideoId =
                    data.video_id;

            }

        }

        catch (error) {

            console.error(
                "Song info error:",
                error
            );

        }

    }, 500);
}


/* =====================================================
   PROGRESS BAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const progress =
            document.getElementById(
                "progress"
            );


        if (!progress) return;


        progress.addEventListener(
            "input",
            function () {

                if (
                    !player ||
                    !isReady
                ) return;


                const duration =
                    player.getDuration();


                if (
                    !duration ||
                    duration <= 0
                ) return;


                const time =
                    duration *
                    (
                        this.value / 100
                    );


                player.seekTo(
                    time,
                    true
                );

            }
        );

    }
);


/* =====================================================
   UPDATE PROGRESS
===================================================== */

setInterval(() => {

    if (
        !player ||
        !isReady
    ) return;


    try {

        const state =
            player.getPlayerState();


        if (
            state ===
            YT.PlayerState.PLAYING
        ) {

            const current =
                player.getCurrentTime();


            const duration =
                player.getDuration();


            if (
                duration &&
                duration > 0
            ) {

                const percentage =
                    (
                        current /
                        duration
                    ) * 100;


                const progress =
                    document.getElementById(
                        "progress"
                    );


                if (progress) {

                    progress.value =
                        percentage;

                }


                updateTime(
                    current,
                    duration
                );

            }

        }

    }

    catch (error) {

        console.log(
            "Progress update waiting..."
        );

    }

}, 500);


/* =====================================================
   TIME
===================================================== */

function updateTime(
    current,
    duration
) {

    const currentTime =
        document.getElementById(
            "currentTime"
        );


    const totalTime =
        document.getElementById(
            "totalTime"
        );


    if (currentTime) {

        currentTime.textContent =
            formatTime(current);

    }


    if (totalTime) {

        totalTime.textContent =
            formatTime(duration);

    }
}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "0:00";

    }


    seconds =
        Math.floor(seconds);


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return (
        minutes +
        ":" +
        String(
            remaining
        ).padStart(
            2,
            "0"
        )
    );
}