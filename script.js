/* =====================================================
   90XM — YAADON KA ADDA
   YOUTUBE PLAYER
===================================================== */

const PLAYLIST_ID = "PLZFw8xFp3oqg";

let player = null;
let isReady = false;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;


/* =====================================================
   YOUTUBE API READY
===================================================== */

function onYouTubeIframeAPIReady() {

    console.log("=================================");
    console.log("YOUTUBE API READY");
    console.log("=================================");

    player = new YT.Player("youtube-player", {

        width: "200",
        height: "200",

        playerVars: {
            autoplay: 0,
            controls: 0,
            playsinline: 1,
            rel: 0,
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

    console.log("=================================");
    console.log("PLAY BUTTON CLICKED");
    console.log("=================================");


    if (!player || !isReady) {

        console.log("PLAYER NOT READY");

        updateStatus("LOADING...");

        return;

    }


    const state =
        player.getPlayerState();


    console.log(
        "Current YouTube state:",
        state
    );


    /* PLAYING */

    if (
        state ===
        YT.PlayerState.PLAYING
    ) {

        console.log("PAUSING");

        player.pauseVideo();

        return;

    }


    /*
       Everything else:
       play the currently cued video
    */

    console.log("PLAYING");

    updateStatus("PLAYING...");

    player.playVideo();

}


/* =====================================================
   NEXT
===================================================== */

function nextSong() {

    if (!player || !isReady) {

        updateStatus("LOADING...");

        return;

    }

    console.log("NEXT SONG");

    player.nextVideo();

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