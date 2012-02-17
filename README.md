#FlashBlockNotifier
This is a wrapper for swfobject that detects FlashBlock in browser.

Script requires SWFObject (http://code.google.com/p/swfobject/).

Also this wrapper can remove blocked swf and let you downgrade to other options.

Feel free to contact me via email.

Thanks to flashblockdetector project (http://code.google.com/p/flashblockdetector)

© 2011, Alexey Androsov <doochik@ya.ru>

Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) or GPL Version 3 (http://www.gnu.org/licenses/gpl.html) licenses.

##FlashBlockNotifier detects:
  - Chrome
    - FlashBlock (https://chrome.google.com/webstore/detail/cdngiadmnkhgemkimkhiilgffbjijcie)
    - FlashBlock (https://chrome.google.com/webstore/detail/gofhjkjmkpinhpoiabjplobcaignabnl)
    - FlashFree (https://chrome.google.com/webstore/detail/ebmieckllmmifjjbipnppinpiohpfahm)
  - Firefox Flashblock (https://addons.mozilla.org/ru/firefox/addon/flashblock/)
  - Opera >= 11.5 "Enable plugins on demand" setting
  - Safari ClickToFlash Extension (http://hoyois.github.com/safariextensions/clicktoplugin/)
  - Safari ClickToFlash Plugin (for Safari < 5.0.6) (http://rentzsch.github.com/clicktoflash/)

##Tested on:
  - Chrome 12
    - FlashBlock by Lex1 1.2.11.12
    - FlashBlock by josorek 0.9.31
    - FlashFree 1.1.3
  - Firefox 5.0.1 + Flashblock 1.5.15.1
  - Opera 11.5
  - Safari 5.1 + ClickToFlash (2.3.2)
  - Safari 5.1 + ClickToFlash (2.6)

##API Reference:
    FlashBlockNotifier.embedSWF(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn, removeBlockedSWF)

Syntax is identical to [swfobject.emdebSWF](http://code.google.com/p/swfobject/wiki/api#swfobject.embedSWF(swfUrlStr,_replaceElemIdStr,_widthStr,_height).

Last param "removeBlockedSWF" (default is true) tells FlashBlockNotifier to remove or not to remove blocked swf object from DOM.

Event object in callbackFn has new property "__fbn" which means "swf can't load because of flashblock".
