var fnPageLoad = [];//page load method
var isFirstPageLoad = true;//is first page
var gbError = null;

jQuery.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
}

function ConvertStringToDateTime(data) {
    if (data == null) return '1/1/1950';
    var r = /\/Date\(([0-9]+)\)\//gi
    var matches = data.match(r);
    if (matches == null) return '1/1/1950';
    var result = matches.toString().substring(6, 19);
    var epochMilliseconds = result.replace(
    /^\/Date\(([0-9]+)([+-][0-9]{4})?\)\/$/,
    '$1');
    var b = new Date(parseInt(epochMilliseconds));
    var c = new Date(b.toString());
    var curr_date = c.getDate();
    var curr_month = c.getMonth() + 1;
    var curr_year = c.getFullYear();
    var curr_h = c.getHours();
    var curr_m = c.getMinutes();
    var curr_s = c.getSeconds();
    var curr_offset = c.getTimezoneOffset() / 60
    var strDate = FormatStr("00", curr_date);
    var strMonth = FormatStr("00", curr_month.toString());
    var d = strDate + '/' + strMonth + '/' + curr_year;
    return d;
}

function FormatStr(format, value) {
    var result = format.toString() + value.toString();
    result = result.substr(value.toString().length, format.toString().length)

    return result;
}

//formula function
function ISNULL(value, valueif) {
    if (typeof valueif == 'undefined') {
        return value == null || typeof value == 'undefined' ? true : false;
    } else {
        return value == null || typeof value == 'undefined' ? valueif : value;
    }
}

function isnull(value, valueif) {
    return ISNULL(value, valueif)
}

function IF(condition, resultTrue, resultFalse) {
    if (condition) {
        return resultTrue;
    } else {
        return resultFalse;
    }
}

//format formula field for if else statement
function CaseWhen(input) {
    return (((input.replace(/case when/g, "(")).replace(/then/g, ")?")).replace(/else/g, ":")).replace(/end/g, "").trim();
}

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

//Get text field cursor position
function getCaretRangePosition(ctrl) {
    var ctrlType = [];
    if ($(ctrl).prop('type') != undefined && $(ctrl).prop('type') != "text") {
        ctrlType.push($(ctrl).prop('type'));
        $(ctrl).prop('type', 'text');
    }

    CaretPos = 0; // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        var length = Sel.text.length;
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
        if (CaretPos != Sel.text.length + length) {
            CaretPos = { 'start': CaretPos - length, 'end': CaretPos };
        } else {
            CaretPos = { 'start': CaretPos, 'end': Sel.text.length + length };
        }
    }
        // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = { 'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };

    if (ctrlType.length > 0) {
        var type = ctrlType.pop();
        $(ctrl).prop('type', type);
    }
    return (CaretPos);
}


(function ($) {
    Date.prototype.ddMMyyyy = function () {

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based         
        var dd = this.getDate().toString();

        return (dd[1] ? dd : "0" + dd[0]) + " " + monthNames[mm]  + " " + yyyy;
    };

    $.oldAjax = $.ajax;

    $.ajax = function () {
        var args = Array.prototype.slice.call(arguments);

        var jqxhr = $.oldAjax.apply(this, args);

        jqxhr.fail(function () {
            if (/application\/json/.test(jqxhr.getResponseHeader('Content-Type'))) {
                try {
                    jqxhr.appError = JSON.parse(jqxhr.responseText);
                } catch (e) {
                }
            }
        });

        return jqxhr;
    };

    $.fn.localtime = function () {
        fmtMeridiem = function (d) {
            var hour, meridiem;
            hour = d.slice(0,2);
            if (hour < 12) {
                meridiem = "AM";
            } else {
                meridiem = "PM";
            }
            if (hour === 0) { hour = 12; }
            if (hour > 12) { hour = hour - 12; }
            return hour + d.slice(2,5) + ' ' + meridiem ;
        };
        return this.each(function () {
            var val = $(this).val();
            $(this).val(fmtMeridiem(val));
        });
    };

    $.fn.RegisterFormatValidate = function () {
        $(this).bind({
            keypress: function (evt) {
                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;

                if (key === 8 //back space
                    ) {
                    return true;
                }
                var c = String.fromCharCode(key);
                var value = $(this).val();
                var caretPosition = getCaretRangePosition(this);
                var start = caretPosition.start;
                var end = caretPosition.end;

                value = value.substring(0, start) + c + value.substring(end);

                var Format = new RegExp($(this).prop("InputFormat"));
                if (!Format.test(value)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }
            },
            blur: function () {
                var Format = new RegExp($(this).prop("InputFormat"));
                if (!Format.test($(this).val())) {
                    $(this).val("");
                }
            }
        });
    }

    $.fn.sortList = function () {
        var $people = $(this).parent().first(),
            $peopleli = $people.children($(this));

        $peopleli.sort(function (a, b) {
            var an = $(a).text(),
                bn = $(b).text();

            if (an > bn) {
                return 1;
            }
            if (an < bn) {
                return -1;
            }
            return 0;
        });

        $peopleli.detach().appendTo($people);
    }

    $.fn.markedErrors = function () {
        var form = $(this);

        var showAllErrorMessages = {
            'showErrorMessage': function () {
                // Find all invalid fields within the form.
                form.find("input[data-val]:not([data-val-regex-pattern])").each(function (index, node) {

                    //// Find the field's corresponding label
                    //var label = $("label[for=" + node.id + "] "),
                    //    message = node.validationMessage || 'Invalid value.';
                
                    if (!$(node).valid())
                        $(node).css('background-color', '#ff9494');
                    else if($(node).valid())
                        $(node).css('background-color', "");
                });
            },
            'toggleErrorMesage': function (elem) {
                if ($(elem).valid()) {
                    $(elem).css('background-color', "");
                }
                else {
                    $(elem).css('background-color', '#ff9494');
                }
            }   
        };

        form.submit( function (event) {
            var validate = $(this).validate();
            if (validate.errorList.length > 0) {
                validate.invalidElements[0].focus();
                event.preventDefault();
            }
        });

        $("input[type=submit], button:not([type=button])", form).click(function(evt){ showAllErrorMessages.showErrorMessage()});

        $("input", form).keyup(function (evt) {
            var type = $(this).attr("type");
            if (/date|email|month|number|search|tel|text|time|url|week/.test(type) || (event.keyCode == 8 && $(this).val().length == 0)) {               
                showAllErrorMessages.toggleErrorMesage(this);
            }
        });

        $("input[data-val-regex-pattern]", form).blur(function (evt) {
            var regex = new RegExp($(this).data('val-regex-pattern'));

            if (!regex.test($(this).val())) {
                $(this).val("");
                $(this).css('background-color', "");
            }
        });
    };

    //global jquery var
    $window = window;

    if (self !== top) {
        $window = window.parent;
    }

    //merge Json Object
    function mergeJsonObj(defaultObj, optionObj) {
        var jsonObj = defaultObj;

        if (optionObj !== null
            && typeof optionObj !== "undefined") {
            $.each(optionObj, function (key, value) {
                if ((optionObj[key] != null
                    && typeof optionObj[key] === 'object'
                    && Object.keys(optionObj[key]).length > 1)
                    || (jsonObj[key] != null
                    && typeof jsonObj[key] === 'object'
                    && Object.keys(jsonObj[key]).length > 1)) {
                    mergeJsonObj(jsonObj[key], optionObj[key])
                } else {
                    jsonObj[key] = optionObj[key]
                }
            });
        }

        return jsonObj;
    }

    //system var
    $.apps = {
        error: {},
        programmeStatus: {
            0: 'sandbox',
            1: 'active',
            2: 'declined'
        }
    }

    $.pad = function (value, options) { return pad(value, options); };

    $.pad.direction = {
        left: "left",
        right: "right"
    }

    var pad = function(value, options){
        var  defaults = {
            direction: $.pad.direction.left,
            strLength: 2,
            char: '0'
        };

        options = mergeJsonObj(defaults, options);
        var strMock = options.char;

        for (var i = 1; i < options.strLength; i++) {
            strMock += options.char;
        }
        var value = value.toString();
        var result = strMock.substring(0, strMock.length - value.length) + value

        return result;
    }

    //jquery notify
    $.notify = function (options) { notify(options); };

    $.notify.type = {
        'warning': 'warning',
        'error': 'error',
        'success': 'success',
        'input': 'input',
        'confirm': 'confirm'
    }

    var notify = function (options) {
        var  defaults = {
            type: $.notify.type.success,
            title: 'Success',
            hideTitle: true,
            message: '',
            autoHide: true,
            autoHideDelayTime: 3000,
            callback: null,
            validateRequired: false,
            buttons: {
                ok: {
                    text: 'OK'
                },
                cancel: {
                    text: 'Cancel'
                }
            }
        };

        options = mergeJsonObj(defaults, options);

        var className = "popupMsg";
        className = className + ' ' + options.type;

        if(options.hideTitle){
            className = className + ' ' + 'hideTitle'
        }

        $window.$('#popupMsg').dialog({
            closeText: "Close",
            modal: true,
            resizable: false,
            width: 1000,
            height: 550,
            closeOnEscape: true,
            draggable: false,
            dialogClass: className,
            title: options.title,
            open: function () {
                var $dialog = $window.$('#popupMsg');

                var callback = function (userResponse) {
                    if (options.validateRequired
                        && !$window.$('#popupMsg form.frmPopupInput').valid()) {
                        return false;
                    }

                    setTimeout(function () {
                        if (typeof options.callback === 'function') {
                            options.callback({
                                input: $dialog.find('textarea').val(),
                                userResponse: userResponse
                            });
                        }
                        $dialog.dialog("close");
                    }, 100);
                }

                if (options.type !== $.notify.type.input
                    && options.type !== $.notify.type.confirm) {
                    $(this).html('<span>' + options.message + '</span>');

                    if (options.autoHide) {
                        setTimeout(function () {
                            callback(true);
                        }, options.autoHideDelayTime);
                    }
                } else {
                    //rendering UI
                    var html = '';
                    html = html + '<span>' + options.message + '</span>'
                    
                    html = html + '<div>'

                    if (options.type === $.notify.type.input) {
                        html = html + '<textarea maxlength="2000"></textarea>'
                    }
                    html = html + '</div>'

                    html = html + '<div>'
                    $.each(options.buttons, function (key, item) {
                        html = html + '<button id="btn'+key+'">' + item.text+ '</button>'
                    })
                    html = html + '</div>'

                    $(this).html('<form class="frmPopupInput">' + html + '</form>');

                    //set control event
                    $dialog.find('#btnok').click(function () {
                        callback(true);
                        return false;
                    });

                    $dialog.find('#btncancel').click(function () {
                        callback(false);
                        $dialog.dialog("close");
                        return false;
                    });

                    if (options.type === $.notify.type.input) {
                        $dialog.find('form').submit(function () {
                            return false;
                        }).validate();

                        $dialog.find('textarea').rules('add',
                            {
                                required: true,
                                messages: {
                                    required: "Please enter comment!"
                                }
                            })
                    }
                }

                $dialog.dialog("option", "position", "center");
            }
        });
    };

})(window.jQuery);

//Loading Panel
LoadingPanel = {
    'Show': function () {
        $window.$('.divModalOverlay, .tblLoading').show();
    },
    "Hide": function () {
        $window.$('.divModalOverlay, .tblLoading').hide();
    }
}


String.prototype.thousandSeperate = function (noOfDecimal) {
    var value = this.trim();

    if (isNaN(parseFloat(isnull(noOfDecimal, "")))) {
        noOfDecimal = 0
    }

    if (value === "") {
        return "";
    } if (isNaN(parseFloat(isnull(value, "")))) {
        console.log(String(value));
        throw "value must be number";
    } else {
        return String(parseFloat(value).toFixed(noOfDecimal)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

String.prototype.toPercentage = function (noOfDecimal) {
    var value = this.trim();

    if (isNaN(parseFloat(isnull(noOfDecimal, "")))) {
        noOfDecimal = 0
    }

    if (value === "") {
        return "";
    } if (isNaN(parseFloat(isnull(value, "")))) {
        console.log(String(value));
        throw "value must be number";
    } else {
        return String((parseFloat(value)*100).toFixed(noOfDecimal)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};


String.prototype.isDecimalNumber = function () {
    var value = this.trim();
    var regexp = /^\d+(\.\d{1,})?$/;

    return regexp.test(value)
}

String.prototype.isNullOrEmpty = function () {
    if (this === null || this.toString() === '') {
        return true;
    } else {
        return false;
    }
}

String.prototype.splitUpperCase = function () {
    return this.toString().replace(/([a-z])([A-Z])/g, '$1 $2');
}

Browser = {
    log: function (value) {
        if (typeof console !== "undefined") {
            console.log(value);
        }
    }
}