/** @preserve
// ==UserScript==
// @name Review Queue Notification
// @author Malachi with help from Simon Forsberg
// @description Shows a desktop notification when there review items in the queue. If you would like to donate, please send to PayPal via lyle.hart@hartwebpages.com
// @namespace https://github.com/malachi26/SE-Scripts
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_notification
// @match *://*.stackexchange.com/review
// @match *://*.stackoverflow.com/review
// @match *://*.mathoverflow.net/review
// @match *://*.serverfault.com/review
// @match *://*.askubuntu.com/review
// @match *://*.stackapps.com/review    
// @match *://*.superuser.com/review
// ==/UserScript==
*/

    var KEY_NEXT = 'NextReload';
    var DELAY = 30 * 1000; //30,000 milliseconds
    var currentTime = Date.now ? Date.now() : new Date().getTime();
    var lastTime = GM_getValue(KEY_NEXT, 0);
    var nextTime = currentTime + DELAY;
    GM_setValue(KEY_NEXT, nextTime);

    var timeDiff = Math.abs(lastTime - currentTime);
    setTimeout(function(){
        window.location.reload(); 
    }, DELAY);

    document.title = document.title.split(' - ')[1] + ' Review Queue'; // keep the site name

    // a way to detect that the script is being executed because of an automatic script reload, not by the user.
    if (timeDiff <= DELAY * 2) {
        var reviewCount = 0;
        var reviewItems = document.getElementsByClassName('dashboard-num');
                
        for (var i = 0; i < reviewItems.length; i++){
            reviewCount += parseInt((reviewItems[i].getAttribute("title")).replace(',', ''), 10);
            console.log(reviewItems[i]);
        }
        console.log(reviewCount);
   
        if (reviewCount > 0) {
            var details = {
                title: document.title,
                text: reviewCount + ' Review Items',
                timeout: 15000
            }
            GM_notification(details, null);
        }
    }

