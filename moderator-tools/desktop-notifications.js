// ==UserScript==
// @name Moderator Flag Notification
// @author Simon Forsberg
// @description Shows a desktop notification when there are flags or review items to be handled.
// @namespace https://github.com/Zomis/SE-Scripts
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_notification
// @match *://*.stackexchange.com/review*
// @match *://*.stackoverflow.com/review*
// @match *://*.superuser.com/review*
// @match *://*.serverfault.com/review*
// @match *://*.askubuntu.com/review*
// @match *://*.stackapps.com/review*
// @match *://*.mathoverflow.net/review*
// ==/UserScript==

if (window.location.href.indexOf('/desktop-notifications') === -1) {
    $('.tools-rev h1').append('<span class="lsep">|</span><a href="/review/desktop-notifications">Desktop Notifications</a></h1>');
} else {
    var KEY_NEXT = 'NextReload';
    var DELAY = 60 * 1000;
    var currentTime = Date.now ? Date.now() : new Date().getTime();
    var lastTime = GM_getValue(KEY_NEXT, 0);
    var nextTime = currentTime + DELAY;
    GM_setValue(KEY_NEXT, nextTime);

    var timeDiff = Math.abs(lastTime - currentTime);
    setTimeout(function(){ window.location.reload(); }, DELAY);

    $('.subheader h1').html('Desktop Notifications');
    $('.leftcol').html('Keep your browser open on this page and it will be automatically reloaded and alert you when something wants your attention.').removeClass('leftcol');
    $('.rightcol').remove();

    var title = document.title.split(' - '); // keep the site name
    document.title = 'Desktop Notifications - ' + title[1];

    // a way to detect that the script is being executed because of an automatic script reload, not by the user.
    if (timeDiff <= DELAY * 2) {
        var notifications = [];

        var topbarFlag = $('.topbar-links .mod-only .icon-flag .flag-count').html();
        var topbarFlagCount = parseInt(topbarFlag);
        if (topbarFlagCount > 0) {
            notifications.push(topbarFlagCount + ' Flags');
        }

        var reviewItems = $('.icon-tools-flag span');
        var reviewCount = 0;
        if (reviewItems.length > 0) {
            reviewCount = parseInt(reviewItems.html());
            if (reviewCount > 0) {
                notifications.push(reviewCount + ' Review Items');
            }
        }

        if (notifications.length > 0) {
            var details = {
                title: document.title,
                text: notifications.join('\n'),
                timeout: 0
            };
            GM_notification(details, null);
        }
    }
}
