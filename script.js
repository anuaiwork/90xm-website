/* =========================================
   90XM YOUTUBE RADIO
========================================= */

const PLAYLIST_ID = "PLZFw8xFp3oqg";

let player = null;
let isReady = false;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;


/* =========================================
   LOAD YOUTUBE IFRAME API
========================================= */

function loadYouTubeAPI() {

    console.log("Loading YouTube API...");

    if (window.YT && window.YT.Player) {

        console.log("YouTube API already loaded");

        createYouTubePlayer();

        return;
    }


    window.onYouTubeIframeAPIReady = function () {

        console.log("✅ YouTube API READY");

        createYouTubePlayer();

    };


    const script =
        document.createElement("script");

    script.src =
        "https://www.youtube.com/iframe_api";

    script.async = true;

    script.onerror = function () {

        console.error(
            "❌ Could not load YouTube API"
        );

        updateStatus(
            "YOUTUBE CONNECTION ERROR"
        );

    };


    document
        .head
        .appendChild(script);

}


/* =========================================
   CREATE YOUTUBE PLAYER
========================================= */
function createYouTubePlayer() {

    console.log("Creating YouTube player...");

    const container = document.getElementById("youtube-player");

    if (!container) {
        console.error("❌ youtube-player element missing");
        return;
    }

    if (!window.YT || !window.YT.Player) {
        console.error("❌ YT.Player unavailable");
        return;
    }

    player = new YT.Player("youtube-player", {

        width: "200",
        height: "200",

        playerVars: {
            listType: "playlist",
            list: PLAYLIST_ID,
            autoplay: 0,
            controls: 0,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
        },

        events: {

            onReady: onPlayerReady,

            onStateChange: onPlayerStateChange,

            onError: onPlayerError,

            onAutoplayBlocked: onAutoplayBlocked

        }

    });

}


/* =====================================================
   PLAYER READY
===================================================== */

function onPlayerReady(event) {

    console.log("=================================");
    console.log("YOUTUBE PLAYER READY");
    console.log("=================================");

    isReady = true;

    player = event.target;

    player.setVolume(100);

    updateStatus("LOADING 90XM...");


    /*
       IMPORTANT

       First CUE the playlist.

       We do NOT automatically play here.
    */

    player.cuePlaylist({

        listType: "playlist",

        list: PLAYLIST_ID,

        index: 0,

        startSeconds: 0

    });


    setTimeout(function () {

        updateSongInfo();

        updateStatus("READY TO PLAY");

    }, 1500);

}


/* =====================================================
   PLAY / PAUSE
===================================================== */
function togglePlay() {

    console.log("PLAY CLICKED");
    console.log("player:", player);
    console.log("isReady:", isReady);

    if (!player || !isReady) {

        console.log("❌ YouTube player is NOT ready");

        updateStatus("YOUTUBE LOADING...");

        return;
    }

    const state = player.getPlayerState();

    console.log("Current state:", state);

    if (state === YT.PlayerState.PLAYING) {

        player.pauseVideo();

    } else {

        updateStatus("LOADING...");

        player.playVideo();

    }
}

/* =====================================================
   PREVIOUS
===================================================== */

function previousSong() {

    if (!player || !isReady) {

        updateStatus("LOADING...");

        return;

    }

    console.log("PREVIOUS SONG");

    player.previousVideo();

}


/* =====================================================
   SHUFFLE
===================================================== */

function toggleShuffle() {

    if (!player || !isReady) return;


    isShuffle = !isShuffle;


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


    console.log(
        "Shuffle:",
        isShuffle
    );

}


/* =====================================================
   REPEAT
===================================================== */

function toggleRepeat() {

    if (!player || !isReady) return;


    isRepeat = !isRepeat;


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


    console.log(
        "Repeat:",
        isRepeat
    );

}


/* =====================================================
   LIKE
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
   YOUTUBE STATE
===================================================== */

function onPlayerStateChange(event) {

    console.log(
        "YouTube state:",
        event.data
    );


    /* ================================================
       PLAYING
    ================================================ */

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        isPlaying = true;

        updatePlayButton();

        updateStatus(
            "NOW PLAYING"
        );


        const playerBox =
            document.querySelector(
                ".player"
            );


        if (playerBox) {

            playerBox.classList.remove(
                "paused"
            );

        }


        updateSongInfo();

    }


    /* ================================================
       PAUSED
    ================================================ */

    else if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        isPlaying = false;

        updatePlayButton();

        updateStatus(
            "PAUSED"
        );


        const playerBox =
            document.querySelector(
                ".player"
            );


        if (playerBox) {

            playerBox.classList.add(
                "paused"
            );

        }

    }


    /* ================================================
       BUFFERING
    ================================================ */

    else if (
        event.data ===
        YT.PlayerState.BUFFERING
    ) {

        updateStatus(
            "BUFFERING..."
        );

    }


    /* ================================================
       ENDED
    ================================================ */

    else if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        isPlaying = false;

        updatePlayButton();


        if (isRepeat) {

            player.playVideo();

        } else {

            player.nextVideo();

        }

    }


    /* ================================================
       CUED
    ================================================ */

    else if (
        event.data ===
        YT.PlayerState.CUED
    ) {

        console.log(
            "Playlist video cued"
        );

        updateSongInfo();

        updateStatus(
            "READY TO PLAY"
        );

    }

}


/* =====================================================
   AUTOPLAY BLOCKED
===================================================== */

function onAutoplayBlocked() {

    console.warn(
        "YouTube autoplay/playback was blocked"
    );


    updateStatus(
        "CLICK PLAY AGAIN"
    );

}


/* =====================================================
   YOUTUBE ERROR
===================================================== */

function onPlayerError(event) {

    console.error(
        "================================="
    );

    console.error(
        "YOUTUBE ERROR:",
        event.data
    );

    console.error(
        "================================="
    );


    let message =
        "YOUTUBE ERROR";


    if (event.data === 2) {

        message =
            "INVALID VIDEO";

    }

    else if (event.data === 5) {

        message =
            "HTML5 PLAYER ERROR";

    }

    else if (event.data === 100) {

        message =
            "VIDEO REMOVED";

    }

    else if (
        event.data === 101 ||
        event.data === 150
    ) {

        message =
            "VIDEO EMBED BLOCKED";

    }

    else if (event.data === 153) {

        message =
            "YOUTUBE CONNECTION ERROR";

    }


    updateStatus(message);

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

        button.setAttribute(
            "aria-label",
            "Pause"
        );

    } else {

        button.textContent = "▶";

        button.setAttribute(
            "aria-label",
            "Play"
        );

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

        status.textContent =
            text;

    }

}


/* =====================================================
   SONG INFO
===================================================== */

function updateSongInfo() {

    if (
        !player ||
        !isReady
    ) {

        return;

    }


    setTimeout(function () {

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


            if (
                title &&
                data &&
                data.title
            ) {

                title.textContent =
                    data.title;

            }


            if (artist) {

                artist.textContent =
                    "YouTube • 90XM";

            }

        }

        catch (error) {

            console.error(
                "Song information error:",
                error
            );

        }

    }, 500);

}


/* =====================================================
   PROGRESS BAR
===================================================== */

const progress =
    document.getElementById(
        "progress"
    );


if (progress) {

    progress.addEventListener(
        "input",
        function () {

            if (
                !player ||
                !isReady
            ) {

                return;

            }


            const duration =
                player.getDuration();


            if (
                !duration ||
                duration <= 0
            ) {

                return;

            }


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


/* =====================================================
   PROGRESS UPDATE
===================================================== */

setInterval(function () {

    if (
        !player ||
        !isReady
    ) {

        return;

    }


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
            "Progress error:",
            error
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

    seconds =
        Math.floor(
            seconds || 0
        );


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

// =========================================
// START YOUTUBE RADIO
// =========================================

loadYouTubeAPI();