// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


(function (window) {
    const activeClass = 'resize-active';
    const resetDelay = 500;
    let flag = false;
    let timer = null;
    const removeClassHandler = () => {
        flag = false;
        document.documentElement.classList.remove(activeClass);
    };
    const resizeHandler = () => {
        if (!flag) {
            flag = true;
            document.documentElement.classList.add(activeClass);
        }
        clearTimeout(timer);
        timer = setTimeout(removeClassHandler, resetDelay);
    };
    window.addEventListener('resize', resizeHandler);
})(window);

jQuery(function () {
	initOpenClose();
});

function initOpenClose() {
    jQuery('.open-close').openClose({
        activeClass: 'active',
        bodyClass: true,
        activeBodyClass: 'open-close-active',
        opener: '.opener',
        slider: '.slide',
        animSpeed: 400,
        effect: 'slide',
    });

    jQuery('ul.sitebar-accordion').slideAccordion({
        opener: '>a.opener',
        slider: '>div.slide',
        collapsible: true,
        animSpeed: 300,
    });
}

/* eslint-disable */

/*
 * jQuery Open/Close plugin
 */
(function ($) {
    function OpenClose(options) {
        this.options = $.extend(
            {
                addClassBeforeAnimation: true,
                hideOnClickOutside: false,
                activeClass: 'active',
                activeBodyClass: 'open-close-active',
                opener: '.opener',
                slider: '.slide',
                animSpeed: 400,
                effect: 'fade',
                event: 'click',
            },
            options
        );
        this.init();
    }
    OpenClose.prototype = {
        init() {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit', this);
            }
        },
        findElements() {
            this.holder = $(this.options.holder);
            this.opener = this.holder.find(this.options.opener);
            this.slider = this.holder.find(this.options.slider);
        },
        attachEvents() {
            // add handler
            const self = this;
            this.eventHandler = function (e) {
                e.preventDefault();
                if (self.slider.hasClass(slideHiddenClass)) {
                    self.showSlide();
                    $(document.body).addClass(self.options.activeBodyClass);
                } else {
                    self.hideSlide();
                    $(document.body).removeClass(self.options.activeBodyClass);
                }
            };
            self.opener.on(self.options.event, this.eventHandler);

            // hover mode handler
            if (self.options.event === 'hover') {
                self.opener.on('mouseenter', function () {
                    if (!self.holder.hasClass(self.options.activeClass)) {
                        self.showSlide();
                    }
                });
                self.holder.on('mouseleave', function () {
                    self.hideSlide();
                });
            }

            // outside click handler
            self.outsideClickHandler = function (e) {
                if (self.options.hideOnClickOutside) {
                    const target = $(e.target);
                    if (!target.is(self.holder) && !target.closest(self.holder).length) {
                        self.hideSlide();
                    }
                }
            };

            // set initial styles
            if (this.holder.hasClass(this.options.activeClass)) {
                $(document).on('click touchstart', self.outsideClickHandler);
            } else {
                this.slider.addClass(slideHiddenClass);
            }
        },
        showSlide() {
            const self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.addClass(self.options.activeClass);
            }
            self.slider.removeClass(slideHiddenClass);
            $(document).on('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', true);
            toggleEffects[self.options.effect].show({
                box: self.slider,
                speed: self.options.animSpeed,
                complete() {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.addClass(self.options.activeClass);
                    }
                    self.makeCallback('animEnd', true);
                },
            });
        },
        hideSlide() {
            const self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.removeClass(self.options.activeClass);
            }
            $(document).off('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', false);
            toggleEffects[self.options.effect].hide({
                box: self.slider,
                speed: self.options.animSpeed,
                complete() {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.removeClass(self.options.activeClass);
                    }
                    self.slider.addClass(slideHiddenClass);
                    self.makeCallback('animEnd', false);
                },
            });
        },
        destroy() {
            this.slider.removeClass(slideHiddenClass).css({
                display: '',
            });
            this.opener.off(this.options.event, this.eventHandler);
            this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
            $(document).off('click touchstart', this.outsideClickHandler);
        },
        makeCallback(name) {
            if (typeof this.options[name] === 'function') {
                const args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
    };

    // add stylesheet for slide on DOMReady
    var slideHiddenClass = 'js-slide-hidden';
    (function () {
        const tabStyleSheet = $('<style type="text/css">')[0];
        let tabStyleRule = `.${slideHiddenClass}`;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    })();

    // animation effects
    var toggleEffects = {
        slide: {
            show(o) {
                o.box.stop(true).hide().slideDown(o.speed, o.complete);
            },
            hide(o) {
                o.box.stop(true).slideUp(o.speed, o.complete);
            },
        },
        fade: {
            show(o) {
                o.box.stop(true).hide().fadeIn(o.speed, o.complete);
            },
            hide(o) {
                o.box.stop(true).fadeOut(o.speed, o.complete);
            },
        },
        none: {
            show(o) {
                o.box.hide().show(0, o.complete);
            },
            hide(o) {
                o.box.hide(0, o.complete);
            },
        },
    };

    // jQuery plugin interface
    $.fn.openClose = function (opt) {
        const args = Array.prototype.slice.call(arguments);
        const method = args[0];

        return this.each(function () {
            const $holder = jQuery(this);
            const instance = $holder.data('OpenClose');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                $holder.data(
                    'OpenClose',
                    new OpenClose(
                        $.extend(
                            {
                                holder: this,
                            },
                            opt
                        )
                    )
                );
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };
})(jQuery);

/*
 * jQuery Accordion plugin
 */
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.SlideAccordion = factory(jQuery);
    }
})(this, function ($) {
    'use strict';
    var accHiddenClass = 'js-acc-hidden';

    function SlideAccordion(options) {
        this.options = $.extend(
            true,
            {
                allowClickWhenExpanded: false,
                activeClass: 'active',
                opener: '.opener',
                slider: '.slide',
                animSpeed: 300,
                collapsible: true,
                event: 'click',
                scrollToActiveItem: {
                    enable: false,
                    breakpoint: 767, // max-width
                    animSpeed: 600,
                    extraOffset: null,
                },
            },
            options
        );
        this.init();
    }

    SlideAccordion.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.setStateOnInit();
                this.attachEvents();
                this.makeCallback('onInit');
            }
        },

        findElements: function () {
            this.$holder = $(this.options.holder).data('SlideAccordion', this);
            this.$items = this.$holder.find(':has(' + this.options.slider + ')');
        },

        setStateOnInit: function () {
            var self = this;

            this.$items.each(function () {
                if (!$(this).hasClass(self.options.activeClass)) {
                    $(this).find(self.options.slider).addClass(accHiddenClass);
                }
            });
        },

        attachEvents: function () {
            var self = this;

            this.accordionToggle = function (e) {
                var $item = jQuery(this).closest(self.$items);
                var $actiItem = self.getActiveItem($item);

                if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
                    e.preventDefault();
                    self.toggle($item, $actiItem);
                }
            };

            this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
        },

        toggle: function ($item, $prevItem) {
            if (!$item.hasClass(this.options.activeClass)) {
                this.show($item);
            } else if (this.options.collapsible) {
                this.hide($item);
            }

            if (!$item.is($prevItem) && $prevItem.length) {
                this.hide($prevItem);
            }

            this.makeCallback('beforeToggle');
        },

        show: function ($item) {
            var $slider = $item.find(this.options.slider);

            $item.addClass(this.options.activeClass);
            $slider
                .stop()
                .hide()
                .removeClass(accHiddenClass)
                .slideDown({
                    duration: this.options.animSpeed,
                    complete: function () {
                        $slider.removeAttr('style');
                        if (this.options.scrollToActiveItem.enable && window.innerWidth <= this.options.scrollToActiveItem.breakpoint) {
                            this.goToItem($item);
                        }
                        this.makeCallback('onShow', $item);
                    }.bind(this),
                });

            this.makeCallback('beforeShow', $item);
        },

        hide: function ($item) {
            var $slider = $item.find(this.options.slider);

            $item.removeClass(this.options.activeClass);
            $slider
                .stop()
                .show()
                .slideUp({
                    duration: this.options.animSpeed,
                    complete: function () {
                        $slider.addClass(accHiddenClass);
                        $slider.removeAttr('style');
                        this.makeCallback('onHide', $item);
                    }.bind(this),
                });

            this.makeCallback('beforeHide', $item);
        },

        goToItem: function ($item) {
            var itemOffset = $item.offset().top;

            if (itemOffset < $(window).scrollTop()) {
                // handle extra offset
                if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
                    itemOffset -= this.options.scrollToActiveItem.extraOffset;
                } else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
                    itemOffset -= this.options.scrollToActiveItem.extraOffset();
                }

                $('body, html').animate(
                    {
                        scrollTop: itemOffset,
                    },
                    this.options.scrollToActiveItem.animSpeed
                );
            }
        },

        getActiveItem: function ($item) {
            return $item.siblings().filter('.' + this.options.activeClass);
        },

        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },

        destroy: function () {
            this.$holder.removeData('SlideAccordion');
            this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
            this.$items.removeClass(this.options.activeClass).each(
                function (i, item) {
                    $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
                }.bind(this)
            );
            this.makeCallback('onDestroy');
        },
    };

    $.fn.slideAccordion = function (opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        return this.each(function () {
            var $holder = jQuery(this);
            var instance = $holder.data('SlideAccordion');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                new SlideAccordion(
                    $.extend(
                        true,
                        {
                            holder: this,
                        },
                        opt
                    )
                );
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };

    (function () {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + accHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    })();

    return SlideAccordion;
});


