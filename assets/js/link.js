const spotify = {
    intent_id: 'spotify_intent',
    link_id: 'spotify_link'
};
const ytmusic = {
    intent_id: 'ytmusic_intent',
    link_id: 'ytmusic_link'
};
const youtube = {
    intent_id: 'youtube_intent',
    link_id: 'youtube_link'
};
const apple = {
    link_id: 'apple_link'
};
const artwork_link_id = 'artwork_link';

var isMobile = {
    Android: function() {
      return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
      return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function() {
      return /IEMobile/i.test(navigator.userAgent);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

var event_prop;

function deviceKind() {
    if (isMobile.Android()) { return 'android'; }
    else if (isMobile.BlackBerry()) { return 'blackberry'; }
    else if (isMobile.iOS()) { return 'ios'; }
    else if (isMobile.Windows()) { return 'windows'; }
    return 'desktop';
};

function addInfo(text) {
    var info = document.getElementById('info');
    var line = document.createElement('p');
    line.innerHTML = text;
    info.appendChild(line);
};

function fallbackLink(base, qs, fallback) {
    var params = new URLSearchParams(qs);
    if (params.has('f')) params.delete('f');
    params.append('f', fallback);
    return encodeURIComponent(base + '?' + params.toString());
}

function amplitudeClick(button) {
    var click_prop = {
        button: button
    };
    if (typeof amplitude !== 'undefined') amplitude.track('Click', {...event_prop, ...click_prop});
}

function linkSet(el_id, link, button) {
    var el_link = document.getElementById(el_id);
    el_link.href = link;
    el_link.onclick = function(){ amplitudeClick(button) };
}

function spotifyLinkSet(base, qs, medium, track_id, si, context) {
    var link = 'https://open.spotify.com/track/' + track_id + '?si=' + si;
    var intent = 'track/' + track_id + '?go=1&nd=1';
    if (context != 'none') {
        link = link + "&context=" + encodeURIComponent(context);
        intent = intent + "&context=" + encodeURIComponent(context);
    }
    document.getElementById(spotify.intent_id).href = 'intent://' +
              intent +
              '#Intent;' +
              'scheme=spotify;' +
              'package=com.spotify.music;' +
              'S.browser_fallback_url=' + fallbackLink(base, qs, 'spotify') + ';' +
              'end;';
    linkSet(spotify.link_id, link, 'spotify');
    if (medium == 'spotify') { linkSet(artwork_link_id, link, 'artwork') };
}

function openSpotifyTrack(track_id, si, context) {
    // Try open by spotify mobile app
    if (isMobile.iOS()) {
        var link = 'spotify://track/' + track_id + '?si=' + si;
        if (context != 'none') {
            link = link + "&context=" + encodeURIComponent(context);
        }
        window.location = link;
    } else {
        document.getElementById(spotify.intent_id).click();
    }
};

function ytMusicLinkSet(base, qs, medium, track_id, list_id) {
    var link = 'https://music.youtube.com/watch?v=' + track_id;
    var intent = 'music.youtube.com/watch?v=' + track_id;
    if (list_id != 'none') {
        link = link + "&list=" + list_id;
        intent = intent + "&list=" + list_id;
    }
    document.getElementById(ytmusic.intent_id).href = 'intent://' +
              intent +
              '#Intent;' +
              'scheme=http;' +
              'package=com.google.android.apps.youtube.music;' +
              'S.browser_fallback_url=' + fallbackLink(base, qs, 'ytmusic') + ';' +
              'end;';
    linkSet(ytmusic.link_id, link, 'ytmusic');
    if (medium == 'ytmusic') { linkSet(artwork_link_id, link, 'artwork') };
}

function openYouTubeMusic(track_id, list_id) {
    // Try open by YouTube Music mobile app
    if (isMobile.iOS()) {
        var link = 'youtubemusic://watch?v=' + track_id;
        if (list_id != 'none') {
            link = link + "&list=" + list_id;
        }
        window.location = link;
    } else {
        document.getElementById(ytmusic.intent_id).click();
    }
};

function youTubeLinkSet(base, qs, medium, video_id, list_id) {
    var link = 'https://www.youtube.com/watch?v=' + video_id;
    var intent = 'www.youtube.com/watch?v=' + video_id;
    if (list_id != 'none') {
        link = link + "&list=" + list_id;
        intent = intent + "&list=" + list_id;
    }
    document.getElementById(youtube.intent_id).href = 'intent://' +
              intent +
              '#Intent;' +
              'scheme=https;' +
              'package=com.google.android.youtube;' +
              'S.browser_fallback_url=' + fallbackLink(base, qs, 'youtube') + ';' +
              'end;';
    linkSet(youtube.link_id, link, 'youtube');
    if (medium == 'youtube') { linkSet(artwork_link_id, link, 'artwork') };
}

function openYouTubeVideo(video_id, list_id) {
    // Try open by YouTube mobile app
    if (isMobile.iOS()) {
        var link = 'vnd.youtube://www.youtube.com/watch?v=' + video_id;
        if (list_id != 'none') {
            link = link + "&list=" + list_id;
        }
        window.location = link;
    } else {
        document.getElementById(youtube.intent_id).click();
    }
};

function appleLinkSet(link) {
    linkSet(apple.link_id, link, 'apple');
}
