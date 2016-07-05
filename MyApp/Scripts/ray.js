(function ($) {
    //private param
    var CLASS = 'ray-';

    var global = {

        layout: '<div class="' + CLASS + 'wrapper"></div>',

        class: {
            lifeTimer: CLASS+'life-timer'
        },

        clone: function (obj) {
            return $.extend([], obj);
        },

        date: {

            today: function () {
                return new Date();
            },

            tryParse: function (number) {
                try {
                    var millisecond = number % 1000;
                    var second = number / 1000 % 60;
                    var minute = number / 1000 / 60 % 60;
                    var hour = number / 1000 / 60 / 60 % 24;
                    var day = number / 1000 / 60 / 60 / 24 % 30;
                    var month = number / 1000 / 60 / 60 / 24 / 30 % 12;
                    var year = number / 1000 / 60 / 60 / 24 / 365;

                    millisecond= Math.floor(millisecond);
                    second= Math.floor(second);
                    minute= Math.floor(minute);
                    hour= Math.floor(hour);
                    day= Math.floor(day);
                    month= Math.floor(month);
                    year= Math.floor(year);

                    return $.pad(year) + ' Y '
                        + $.pad(month) + ' M '
                        + $.pad(day) + ' D '
                        + $.pad(hour) + ' h '
                        + $.pad(minute) + ' m '
                        + $.pad(second) + ' s '
                        //+ $.pad(millisecond,
                        //{
                        //    strLength: 4
                        //}) + ' mm ';
                } catch (e) {
                    return undefined;
                }
            }
        }
    }

    var User={
        brithday : new Date(),
        endAge : 25
    }
    var Timer = {
        type: {
            countDown: 'countDown',
            interval: 'interval'
        },
        duration: 1000,
        process: function () { },
    }

    var Pad = {
        direction: {
            left: "left",
            right: "right"
        }
    }

    //public function
    $.fn.lifeTimer = function (user) {
        $this = this;
        user = $.mergeJsonObj(User, user);

        this.addClass(global.class.lifeTimer);

        var $widget = $(global.layout);
        var endYear = user.brithday.getFullYear() + user.endAge;
        var endDate = user.brithday+'';
        endDate = new Date(new Date(endDate).setYear(endYear));
        var dateDiff = function () {
            return global.date.tryParse(endDate - global.date.today());
        }

        var timer = new $.timer({
            duration: 1000,
            process: function () {
                $widget.text(dateDiff());
            },
            type: Timer.type.interval
        });

        $this.append($widget);

        timer.start();

        this.setting = {
            endDate: endDate,
            brithday: user.brithday,
            timer : timer
        }
    }

    $.timer = function (timer) {
        this.timer = null;
        var setting = $.mergeJsonObj(Timer, timer);
        this.setting = setting;
        this.start = function () {
            if (Timer.type.countDown === setting.type) {
                this.timer = setTimeout(function () {
                    settting.process();
                }, setting.duration);
            } else if (Timer.type.interval === setting.type) {
                this.timer = setInterval(function () {
                    setting.process();
                }, setting.duration);
            }
        }

        this.stop = function () {
            if (Timer.type.countDown === setting.type) {
                clearTimeout(this.timer);
            } else if (Timer.type.interval === setting.type) {
                clearInterval(this.timer);
            }
        }

        this.setDuration = function (duration) {
            this.stop();
            setting.duration = duration;
            this.start();
        }
    }

    

    //merge Json Object
    $. mergeJsonObj = function (defaultObj, optionObj) {
        var jsonObj = global.clone(defaultObj);

        if (optionObj !== null
            && typeof optionObj !== "undefined") {
            $.each(optionObj, function (key, value) {
                if ((optionObj[key] != null
                    && typeof optionObj[key] === 'object'
                    && typeof optionObj[key] !== 'string'
                    && Object.keys(optionObj[key]).length > 1)
                    || (jsonObj[key] != null
                    && typeof jsonObj[key] === 'object'
                    && typeof optionObj[key] !== 'string'
                    && Object.keys(jsonObj[key]).length > 1)) {
                    global.mergeJsonObj(jsonObj[key], optionObj[key])
                } else {
                    jsonObj[key] = optionObj[key]
                }
            });
        }

        return jsonObj;
    }

    $.pad = function (value, options) { return pad(value, options); };

    var pad = function (value, options) {
        var defaults = {
            direction: Pad.direction.left,
            strLength: 2,
            char: '0'
        };

        options = $.mergeJsonObj(defaults, options);
        var strMock = options.char;

        for (var i = 1; i < options.strLength; i++) {
            strMock += options.char;
        }
        var value = value.toString();
        var result = strMock.substring(0, strMock.length - value.length) + value

        return result;
    }


})(window.jQuery);