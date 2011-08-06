/**!
 * This is wrapper for swfobject that detects FlashBlock in browser.
 *
 * Wrapper detects:
 *   - Chrome
 *     - FlashBlock (https://chrome.google.com/webstore/detail/cdngiadmnkhgemkimkhiilgffbjijcie)
 *     - FlashBlock (https://chrome.google.com/webstore/detail/gofhjkjmkpinhpoiabjplobcaignabnl)
 *     - FlashFree (https://chrome.google.com/webstore/detail/ebmieckllmmifjjbipnppinpiohpfahm)
 *   - Firefox Flashblock (https://addons.mozilla.org/ru/firefox/addon/flashblock/)
 *   - Opera >= 11.5 "Enable plugins on demand" setting
 *   - Safari ClickToFlash Extension (http://hoyois.github.com/safariextensions/clicktoplugin/)
 *   - Safari ClickToFlash Plugin (for Safari < 5.0.6) (http://rentzsch.github.com/clicktoflash/)
 *
 * Tested on:
 *   - Firefox 5.0.1 + Flashblock 1.5.15.1
 *   - Opera 11.5
 *   - Safari 5.1 + ClickToFlash (2.3.2)
 *
 * Also this wrapper can remove blocked swf and let you to downgrade to other ?????.
 *
 * Feel free to contact with me via email.
 *
 * Copyright 2011, Alexey Androsov
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) or GPL Version 3 (http://www.gnu.org/licenses/gpl.html) licenses.
 *
 * @requires swfobject
 * @author Alexey Androsov <doochik@ya.ru>
 * @version 1.0
 *
 * Thanks to flashblockdetector project (http://code.google.com/p/flashblockdetector)
 */
(function(/**document*/document) {

    function remove(node) {
        node.parentNode.removeChild(node);
    }

    var FlashBlockNotifier = {

        /**
         * CSS-class for swf wrapper.
         * @protected
         * @default fbn-swf-wrapper
         * @type String
         */
        __SWF_WRAPPER_CLASS: 'fbn-swf-wrapper',

        /**
         * Remove swf if flash block detected
         * @public
         * @type Boolean
         */
        REMOVE_BLOCKED_SWF: true,

        /**
         * Is flash block detected?
         * @public
         * @type Boolean
         */
        FLASH_BLOCK: false,

        /**
         * Timeout for flash block detect
         * @default 500
         * @protected
         * @type Number
         */
        __TIMEOUT: 500,

        embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn, removeSWF) {
            if (!window['swfobject']) {
                window['console']
                    && console.log
                && console.log('This script requires swfobject. http://code.google.com/p/swfobject/');
                return;
            }

            if (FlashBlockNotifier.FLASH_BLOCK) {
                callbackFn({
                    'success': false,
                    'error': 'FlashBlock'
                });
                return;
            }

            swfobject.addDomLoadEvent(function() {
                var replaceElement = document.getElementById(replaceElemIdStr);
                if (!replaceElement) {
                    return;
                }

                // We need to create div-wrapper because some flash block plugins replaces swf with another content
                // Also some flash requires wrapper for properly work
                var wrapper = document.createElement('div');
                wrapper.className = FlashBlockNotifier.__SWF_WRAPPER_CLASS;

                replaceElement.parentNode.replaceChild(wrapper, replaceElement);
                wrapper.appendChild(replaceElement);

                swfobject.embedSWF(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, function(e) {
                    // e.success === false means that browser don't have flash or flash is too old
                    // @see http://code.google.com/p/swfobject/wiki/api
                    if (!e || e.success === false) {
                        callbackFn(e);

                    } else {
                        var swfElement = e.ref;

                        if (swfElement && swfElement['getSVGDocument'] && swfElement['getSVGDocument']()) {
                            // Opera 11.5 and above replaces flash with SVG button
                            onFailure(e);

                        } else {
                            //set timeout to let FlashBlock plugin detect swf and replace it some contents
                            window.setTimeout(function() {
                                if (wrapper.childNodes.length > 1) {
                                    // we expect that swf is the onle child of wrapper
                                    // Chome FlashBlock extension (https://chrome.google.com/webstore/detail/cdngiadmnkhgemkimkhiilgffbjijcie#)
                                    // Chome FlashBlock extension (https://chrome.google.com/webstore/detail/gofhjkjmkpinhpoiabjplobcaignabnl)
                                    onFailure(e, true);

                                } else if (swfElement.type != 'application/x-shockwave-flash') {
                                    // older Safari ClickToFlash (http://rentzsch.github.com/clicktoflash/)
                                    onFailure(e);

                                } else if (!swfElement.parentNode) {
                                    // swf have been detached from DOM
                                    // FlashBlock for Firefox (https://addons.mozilla.org/ru/firefox/addon/flashblock/)
                                    // Chrome FlashFree (https://chrome.google.com/webstore/detail/ebmieckllmmifjjbipnppinpiohpfahm)
                                    onFailure(e);

                                } else if (swfElement.parentNode.className.indexOf('CTFnodisplay') > -1) {
                                    // Safari ClickToFlash Extension
                                    // @see http://hoyois.github.com/safariextensions/clicktoplugin/
                                    onFailure(e, true);
                                }
                            }, FlashBlockNotifier.__TIMEOUT);
                        }
                    }

                    function onFailure(e, removeArtefacts) {
                        if (removeSWF !== false && FlashBlockNotifier.REMOVE_BLOCKED_SWF) {
                            //remove swf
                            swfobject.removeSWF(replaceElemIdStr);
                            //remove wrapper
                            remove(wrapper);
                            if (removeArtefacts) {
                                //ClickToFlash artefacts
                                var ctf = document.getElementById('CTFstack');
                                if (ctf) {
                                    remove(ctf);
                                }

                                //Chrome FlashBlock artefact
                                var lastBodyChild = document.body.lastChild;
                                if (lastBodyChild && lastBodyChild.className == 'ujs_flashblock_placeholder') {
                                    remove(lastBodyChild);
                                }
                            }
                        }
                        FlashBlockNotifier.FLASH_BLOCK = true;
                        e.success = false;
                        e.error = 'FlashBlock';
                        callbackFn(e);
                    }
                });
            });
        }
    };

    window['FlashBlockNotifier'] = FlashBlockNotifier;
})(document);