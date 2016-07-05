function isNull(item, replacement) {
    if (typeof replacement === 'undefined') {
        replacement = null;
    }

    if (item === null || typeof item === 'undefined' || (typeof item === 'number' && item.toString() === 'NaN')) {
        return replacement;
    } else {
        return item;
    }
}

(function ($) {
    //global jquery var
    $window = window;

    if (self !== top) {
        $window = window.parent;
    }

    //system var
    $.app = new function(){
        this.error = {};
        this.exception  = []
        this.handleException = function (data, textStatus, jqXHR) {
            if (isNull(data.status) === null || data.status.code != 0) {
                this.error.data = data;
                this.error.data = textStatus;
                this.error.data = jqXHR;
            }
        }

        function processAjaxData(html, url) {
            window.history.pushState({
                "html": html
            }, "", url);
        }

        function updateContent(html) {
            $('.page > .container').empty().append($(html).filter('.page').find('> .container > *'));
            $('.page > .container').animate({
                'marginLeft': '0%',
                'opacity': '1'
            });
        }


        window.onpopstate = function (e) {
            if (e.state) {
                $('.page > .container').animate({
                    'marginLeft': '-200%',
                    'opacity': '0'
                }, function () {
                    updateContent(e.state.html);
                });
            }
        };

        this.navigateTo = function (url) {
            $('.page > .container').animate({
                'marginLeft': '-200%',
                'opacity': '0'
            }, function () {
                if (isNull(window.history.pushState) !== null) {
                    $.ajax({
                        type: "GET",
                        url: url,
                        dataType: "html",
                        success: function (result, textStatus, jqXH) {

                            if (isNull($('#popupWindow').dialog("instance")) !== null) {
                                $('#popupWindow').dialog("destroy");
                            }

                            processAjaxData(jqXH.responseText, url);
                            updateContent(result);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            debugger;
                        }
                    });
                } else {
                    window.location = url;
                }
            });
        };
    }

    //scroll to element
    $.fn.scrollToElement = function (elem) {
        var $this = $(this);
        var $elem = $(elem).filter(':eq(0)')

        // scroll to selected item
        var itemScrollTop = ($this.scrollTop() - $this.offset().top) + $elem.offset().top;


        if (itemScrollTop < $this.scrollTop() || itemScrollTop > $this.scrollTop() + 400) {
            $this.stop().animate({ scrollTop: itemScrollTop });
        }
    }

    //find index of array
    $.indexOf = function (value, array, options) {
        var defaultOptions = {
            ignoreCase : true,
            contains: false
        }

        options = $.mergeJsonObj(defaultOptions, options);

        var index = -1;

        if (isNull(value, '') !== '') {
            $.each(array, function (i, item) {
                //ignore undefined, null and empty
                if (isNull(item, '') === '') {
                    return true;
                }

                //ignoreCase and equal
                if (options.ignoreCase && !options.contains
                    && item.toString().toLowerCase() !== value.toString().toLowerCase()) {
                    return true;
                }

                index = i;
                return false;
            });
        }

        return index;
    }

    //sort html ul li tag
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

    //merge Json Object
    $.mergeJsonObj = function (defaultObj, optionObj) {

        function clone(obj) {
            var output = null;
        
            if (isNull(obj) === null) {
                return null;
            }

            if (Object.keys(obj).length > 0) {
                if (isNull(obj.length) === null) {
                    output = {};
                } else {
                    output = [];
                }

                output = jQuery.extend(true, output, obj);
            } else {
                output = obj;
            }

            return output;
        }


        var jsonObj = clone(defaultObj);
        var optObj = clone(optionObj);

        if (isNull(optObj) != null) {
            $.each(optObj, function (key, value) {
                var dObj = jsonObj[key];
                var oObj = optObj[key];

                //if key no exists in default object, direct add
                if (Object.keys(jsonObj).indexOf(key) === -1) {
                    jsonObj[key] = optObj[key];
                }
                else if (isNull(dObj) === null) {
                    jsonObj[key] = optObj[key];
                }
                else if (Object.prototype.toString.call(oObj).indexOf('Object') > -1
                    && Object.prototype.toString.call(dObj).indexOf('Object') > -1) {
                    if (isNull(oObj.length) === null) {
                        jsonObj[key] = $.mergeJsonObj(dObj, oObj);
                    } else {
                        jsonObj[key] = optObj[key];
                    }
                }
                else if (isNull(oObj) !== null) {
                    jsonObj[key] = optObj[key];
                }
            });
        }


        return jsonObj;
    }

    //add pad

    $.pad = function (value, options) {
        var pad = function (value, options) {
            var defaults = {
                direction: $.pad.direction.left,
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

        return pad(value, options);
    };

    $.pad.direction = {
        left: "left",
        right: "right"
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
            autoHide: false,
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

        options = $.mergeJsonObj(defaults, options);

        var className = "popup message";
        className = className + ' ' + options.type;

        if(options.hideTitle){
            className = className + ' ' + 'hideTitle'
        }

        $window.$('#popup').dialog({
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
                var $dialog = $window.$('#popup');

                var callback = function (userResponse) {
                    if (options.validateRequired
                        && !$window.$('#popup form.frmPopupInput').valid()) {
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

                    var html = '<span class="message">' + options.message + '</span>';

                    html = html + '<div>'
                    html = html + '<button id="btnok">OK</button>'
                    html = html + '</div>'

                    $(this).html('<form class="frmPopupInput">' + html + '</form>');

                    //set control event
                    $dialog.find('#btnok').click(function () {
                        callback(true);
                        return false;
                    });

                    if (options.autoHide) {
                        setTimeout(function () {
                            callback(true);
                        }, options.autoHideDelayTime);
                    }
                } else {
                    //rendering UI
                    var html = '';
                    html = html + '<span class="message">' + options.message + '</span>'
                    
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

    function Interval(fn, time) {
        var timer = false;
        this.start = function () {
            if (!this.isRunning())
                timer = setInterval(fn, time);
        };
        this.stop = function () {
            clearInterval(timer);
            timer = false;
        };
        this.isRunning = function () {
            return timer !== false;
        };
    }


    $.fn.validateType = function (options) {
        var defaultValue = {
            type: 'int' //or 'decimal'
        }

        var prop = {
            dataType: {
                int: 'int',
                decimal: 'decimal'
            }
        }

        var setting = $.mergeJsonObj(defaultValue, options);

        //fire event alternative
        var fireEvent = function fireEvent(element, event) {
            try {
                if (typeof document.createEvent != 'undefined') {
                    e = document.createEvent('HTMLEvents');
                    e.initEvent(event, true, true);
                    element.dispatchEvent(e);
                }
            } catch (err) { }

            try {
                if (typeof document.createEvent != 'undefined') {
                    e = document.createEventObject();
                    element.fireEvent('on' + event.toLowerCase(), e);
                }
            } catch (err) { }
        }

        $(this).each(function () {
            var timerValidation = null;

            //Handle paste event for numeric only text field
            $(this)
                .unbind('input.intParse')
                .bind('input.intParse', function (e) {
                    var $this = $(this);
                    var oriVal = $this.val();
                    var strVal = $this.val();
                    strVal = strVal.replace(/[^0-9\.\%]/g, '');

                    var re = /\./g;
                    var matchIndexes = [];
                    while ((match = re.exec(strVal)) != null) {
                        matchIndexes.push(match.index);
                    }

                    var i = matchIndexes.length - 1;
                    if (matchIndexes.length !== 1) {

                        for (; i >= 1; i--) {
                            var index = matchIndexes[i];
                            var initIndex = 0;
                            if (index === 0) {
                                initIndex = 1;
                            }
                            strVal = strVal.substring(initIndex, index) + strVal.substring(index+1, strVal.length);
                        }
                    }

                    re = /\%/g;
                    var matchPercentages = [];
                    while ((match = re.exec(strVal)) != null) {
                        matchPercentages.push(match.index);
                    }

                    i = matchPercentages.length - 1;
                    if (matchPercentages.length > 0) {
                        var index = matchPercentages[0];
                        var initIndex = 0;
                        strVal = strVal.substring(initIndex, index+1);
                    }

                    if (setting.type.toLowerCase() === prop.dataType.int.toLowerCase() && isNull(strVal, '') !== '') {
                        strVal = parseInt(Math.round(strVal))
                    }
                    
                    if (oriVal.toString() !== strVal.toString()) {
                        var selectStart = $(this).get(0).selectionStart;

                        $(this).val(strVal);

                        $(this).get(0).selectionStart = selectStart;
                        $(this).get(0).selectionEnd = selectStart;

                        if (typeof timerValidation != 'undefined'
                            && timerValidation != null) {
                            timerValidation.stop();
                        }

                        timerValidation = new Interval(function () {
                            try {
                                fireEvent($this.get(0), 'change')
                                timerValidation.stop();
                            } catch (err) { }
                        }, 500);

                        timerValidation.start();
                    }
                });
        });
    }

    /* Excel Function*/
    $.excel = new function (options) {
        var self = this;
        var lookuplist = {};
        self.lookuplist = lookuplist;
        self.method = {};

        var regex = {
            math: /[^\d|\-|\+|\=|\*|\%|\/|\(|\)|\.]/g,
            fnc: /[\w]+[\s]?\(/g,
            fncFull: /([\w]+)(\()([\w|\W]+)(\))/g,
            word: /[\w|\.]+/g,
            dot: /[\.]/g,
            closeBracket: /\)/g,
            openBracket: /\(/g,
            agg: /((SUM)|(AVG))[\s]?\(/gi,
            method: /[^\w]?((SUM)|(AVG)|(IF)|(AND)|(IFERROR)|(VLOOKUP))[\s]?\(/gi,
            text: /\"[\w|\s]+?\"/g,
            tempText: /\{0\}/g,
            fncReplacement: /\{\d\}/g
        }

        var FALSE = false;
        var TRUE = true;

        //excel function
        var AVG = function (array) {
            return array.length <= 0 ? 0 : sum(array) / array.length;
        }

        var SUM = function (values) {
            try{
                var result = 0.0;

                if (isNull(values) !== null) {
                    values = [].concat(values);
                    $.each(values, function (i, value) {
                        try{
                            eval('value = '+value);
                        } catch (e) {

                        }

                        if ($.isNumeric(value)) {
                            result += parseFloat(value);
                        } else {
                            result += 0;
                        }
                    });
                }
            }catch(e){
                return undefined;
            }

            return result;
        }

        var IF = function (condition, result1, result2) {
            try{
                if (condition) {
                    return result1;
                } else {
                    return result2;
                }
            } catch (e) {
                return undefined;
            }
        }

        var AND = function (condition, condition2) {
            try{
                return condition && isNull(condition2, true);
            } catch (e) {
                return undefined;
            }
        }

        var OR = function (condition, condition2) {
            try {
                return condition || isNull(condition2, true);
            } catch (e) {
                return undefined;
            }
        }

        var IFERROR = function (value, errorifvalue) {
            if (value !== undefined) {
                return value;
            } else {
                return errorifvalue;
            }
        }

        var VLOOKUP = function (value, table, colIndex, approx) {
            try{
                var col, row, rowLength, colLength;

                if(typeof(table == 'object') && table.constructor.name == 'Object'){
                    table = utility.rangeToTable(table);
                }

                rowLength = table.length;
                colLength = table[0].length;
                colIndex  = colIndex-1;
                /** default approx to false */
                approx = typeof(approx) == 'undefined' ? false : approx;

                if(colIndex > colLength-1){
                    return '#REF!';
                }

                if(colIndex < 0){
                    return '#VALUE!';
                }

                if(false == approx){
                    for(row = 0; row < rowLength; row++){
                        if(value == table[row][0]){
                            return table[row][colIndex];
                        }
                    }

                    return '#N/A!';
                }else{
                    var delta = [], deltaMin, rowIndex, deltaLength;

                    for(row = 0; row < rowLength; row++){
                        if(value == table[row][0]){
                            return table[row][colIndex];
                        }
                        delta[row] = Math.abs(table[row][0] - value);

                        if(isNaN(delta[row])){
                            delta[row] = -1;
                        }

                    }

                    deltaLength = delta.length;
                    deltaMin    = null;

                    for(var a = 0; a < deltaLength; a++){
                        if(delta[a] >= 0){
                            if(deltaMin === null){
                                deltaMin = delta[a];
                            }else{
                                deltaMin = (deltaMin < delta[a]) ? deltaMin : delta[a];
                            }
                        }
                    }

                    rowIndex = delta.indexOf(deltaMin);

                    if(rowIndex < 0){
                        return '#N/A!';
                    }

                    return table[rowIndex][colIndex];
                }

            } catch (e) {
                return undefined;
            }
        }

        
        var SMALL = function (array, k) {
            if (isNull(array) === null) {

                browser.log('array is null');
                return '#ERROR';
            }

            if (isNull(k) === null) {
                browser.log('position is null');
                return '#ERROR';
            }

            var arrayClone = [];
            var converted = true;

            $.each(array, function (i, data) {
                try {
                    if (isNull(data, '') !== '')
                    {
                        if (kendo.parseDate(data, 'dd/MM/yyyy') !== null)
                        {
                            arrayClone.push(kendo.parseDate(data, 'dd/MM/yyyy'));
                        }
                        else if (kendo.parseDate(data, 'yyyy-MM-dd') !== null)
                        {
                            arrayClone.push(kendo.parseDate(data, 'yyyy-MM-dd'));
                        }
                        else
                        {
                            converted = false;
                            return false;
                        }
                    }
                } catch (e) {
                    converted = false;
                    return false;
                }
            });

            if (!converted) {
                arrayClone = array;
            }

            var result = arrayClone.sort(function (a, b) {
                return a - b;
            })[k - 1];

            return result;
        }

        var SUMIF = function(array1, criteria, array2) {
            if (isNull(array1) === null) {
                return '#ERROR';
            }

            if (isNull(array2) === null) {
                return '#ERROR';
            }

            if (isNull(criteria) === null) {
                return '#ERROR';
            }

            if(array1.length !== array2.length){
                return '#ERROR'
            }

            var total = 0.0;

            $.each(array1, function(i, value){
                if(value === criteria){
                    total += parseFloat(array2[i]);
                }
            });

            return total;
        }

        var LEN = function(text) {
            return (isNull(text,'')+'').length;
        }

        self.translate = function (options) {
            try {
                var opts = options;
                var expression = opts.expression;
                var desc = opts.desc;
                var result = expression;
                var source = opts.source;
                var cell = opts.cell;

                
                var fncs = [];
                var noFnc = 0;
                fncs[noFnc] = '';

                var matchedOpenBracket = result.match(regex.openBracket);
                var matchedCloseBracket = result.match(regex.closeBracket);

                if((matchedOpenBracket === null && matchedCloseBracket === null)
                    || (matchedOpenBracket !== null 
                        && matchedCloseBracket !== null 
                        && matchedOpenBracket.length === matchedCloseBracket.length)){

                }else{
                    throw "Unexpected token";
                }

                function parse(formula, NoAgg) {
                    var values = [];

                    $.each(source, function (k, data) {
                        var result = formula;

                        var texts = [];

                        result = result.replace(regex.text, function (text) {
                            texts.push(text);

                            return "{0}"
                        });

                        result = result.replace(regex.word, function (word) {
                            if ($.isNumeric(word)) {
                                return word;
                            }

                            if (word.match(regex.dot) !== null) {
                                return word;
                            }

                            var value = undefined;

                            $.each(data, function (key, val) {
                                if (key.toLowerCase() === word.toLowerCase()) {
                                    value = val;
                                    return false;
                                }
                            });

                            if (value === null) {
                                value = '';
                            }

                            if (isNull(value) !== null) {
                                if ($.isNumeric(value)) {
                                    value = parseFloat(value);
                                } else {
                                    value = '"' + value + '"';
                                }

                                return value;
                            } else {
                                return word;
                            }
                        });

                        var count = 0;

                        result = result.replace(regex.tempText, function (tempText) {
                            var text = texts[count]

                            count += 1;

                            return text;
                        });

                        if (formula !== result || values.length <= 0) {
                            if ($.isNumeric(result)) {
                                result = parseFloat(result);
                            }

                            values.push(result);
                        }

                        if (NoAgg === true) {
                            return false;
                        }
                    });

                    if (values.length === 1) {
                        values = values[0];
                        return values;
                    }

                    return JSON.stringify(values);
                }

                for (var i = 0; i < result.length; i++) {
                    var char = result[i];

                    if (isNull(fncs[noFnc]) === null) {
                        fncs[noFnc] = '';
                    }

                    if (char === ',' || char === ')') {
                        if (fncs[noFnc] !== '') {
                            noFnc += 1;
                            fncs[noFnc] = '';
                        }
                        fncs[noFnc] += char;
                        noFnc += 1;
                    } else if (char === '(') {
                        fncs[noFnc] += char;
                        noFnc += 1;
                        fncs[noFnc] = '';
                    } else {
                        fncs[noFnc] += char;
                    }
                }

                var formulas = [];
                var translatedForm = [];
                var no = 0;

                do {

                    for (var i = 0; i < fncs.length; i++) {
                        if (isNull(formulas[no]) === null) {
                            formulas[no] = '';
                        }

                        if (formulas[no] === '') {
                            formulas[no] += fncs[i];
                        } else if (fncs[i].match(regex.fnc) !== null
                            && fncs[i].match(regex.agg) === null) {
                            formulas[no] += fncs[i];
                        } else if (fncs[i].match(regex.agg) !== null) {
                            no += 1;
                            formulas[no] = ''
                            formulas[no] += fncs[i];
                        } else if (fncs[i].match(regex.closeBracket) !== null) {
                            formulas[no] += fncs[i];

                            var formula = formulas[no];

                            matchedOpenBracket = formula.match(regex.openBracket);
                            matchedCloseBracket = formula.match(regex.closeBracket);

                            if (formula.match(regex.fncFull) !== null
                                && formula.match(regex.agg) !== null
                                && matchedOpenBracket.length === matchedCloseBracket.length) {
                                formula = formula.substr(0, formula.length - 1);

                                var strFnc = '';

                                for (var j = 0; j < formula.length; j++) {
                                    strFnc += formula[j];

                                    if (formula[j].match(regex.openBracket) !== null) {

                                        formula = formula.substr(j+1, formula.length);
                                        break;
                                    }
                                }

                                formula = parse(formula);

                                translatedForm.push(strFnc+formula+')');

                                if (no - 1 !== -1) {
                                    formulas[no - 1] += '{' + translatedForm.length + '}';
                                    formulas.splice(no, 1);
                                    no -= 1;
                                } else {
                                    formulas[no] = '{' + translatedForm.length + '}';
                                }
                            } else {
                                no += 1;
                            }
                        } else {
                            formulas[no] += fncs[i];
                        }
                    }

                    fncs = formulas;
                    formulas = [];
                    no = 0;
                } while (fncs.length !== 1);

                result = parse(fncs[0], true);

                for(var i = translatedForm.length-1;i>=0; i--){
                    result = result.replace(new RegExp('\\{'+(i+1)+'\\}','g'), translatedForm[i]);
                }

                return result;
            } catch (e) {
                return e;
            }
        }

        self.execute = function (options) {
            try{
                var opts = options;
                var expression = opts.expression;
                var desc = opts.desc;
                var result = expression;
                var source = opts.source;
                var cell = opts.cell;
                var method = self.method;

                result = result.replace(regex.method, function ($0) {
                    return $0.toUpperCase();
                });

                if (result[0] === "=") {
                    result = result.substring(1, result.length);
                }

                if(isNull(source) !== null){
                    result = self.translate({ expression: result, source: source, cell: cell });
                }

                result = result.replace(/([^>|<])([=])/g, function (m, m1, m2) {
                    return m1+'===';
                });
                result = result.replace(/&/g, '+');
                result = result.replace(/<>/g, '!==');

                $.each(Object.keys(self.lookuplist), function (j, key) {
                    result = result.replace(new RegExp(key, 'gi'), function ($0) {
                        return 'self.lookuplist.' + key;
                    })
                });

                try {
                    eval("result = (" + result + ")");
                } catch (e) {
                    browser.log(desc + '|' + result + '|' + expression);
                    browser.log(e);
                    result = "";
                }

                return result;
            } catch (e) {
                return e;
            }
        }
    }


    $.fn.caret = function (position) {
        var field = this;

        function doGetCaretPosition(element) {
            if ('selectionStart' in element) {
                return element.selectionStart;
            } else if (document.selection) {
                element.focus();
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;
                sel.moveStart('character', -element.value.length);
                return sel.text.length - selLen;
            }
        }

        function doSetCaretPosition(element, caretPos) {
            if (element.createTextRange) {
                var range = element.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                element.focus();
                if (element.selectionStart !== undefined) {
                    element.setSelectionRange(caretPos, caretPos);
                }
            }
        }

        $(this).each(function () {
            if ($.isNumeric(position)) {
                return doSetCaretPosition($(this).get(0), position);
            } else {
                return doGetCaretPosition($(this).get(0));
            }
        });
    }

    $.fn.enterpress = function (callback) {
        function triggerEvent(event, sender, parameter) {
            if (typeof event === 'function') {
                event(sender, parameter);
            }
        }

        function stopRKey(evt) {
            var evt = (evt) ? evt : ((event) ? event : null);
            var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
            if ((evt.keyCode == 13) && (node.type == "text")) {
                triggerEvent(callback, this, null);
                return false;
            }
        }
        $(this).unbind('keypress.buttonclick').bind('keypress.buttonclick', stopRKey);
    }
})(window.jQuery);


browser = {
    log: function (value) {
        if (typeof console !== "undefined" && $.app.IsJsDebuggerEnabled) {
            console.log(value);
        }
    }
}

//Loading Panel
loading = {
    'show': function () {
        $window.$('.overlay, .loading').show();
    },
    "hide": function () {
        $window.$('.overlay, .loading').hide();
    }
}


String.prototype.toUpperCaseOnFirstChar = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toLowerCaseOnFirstChar = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.isEmptyOrNull = function () {
    if (isNull(this) == null) {
        return true;
    }

    if (this.trim().length === 0) {
        return true;
    }

    return false;
}


String.prototype.format = function (format) {
    var value = this.trim();
    if (isNull(format) === null) {
        return value;
    }

    if (value === "") {
        return "";
    } if (isNaN(parseFloat(isNull(value, "")))) {
        return value;
    } else {
        var formatArray = format.split(',');
        formatArray = formatArray[formatArray.length - 1];
        formatArray = formatArray.split('.');
        var noOfDecimal = isNull(formatArray[formatArray.length - 1].match(/0/g), []).length;
        var noOfSeperate = isNull(formatArray[0].match(/#/g), []).length;

        var isPercentage = false;

        if (format.indexOf('%')!== -1) {
            isPercentage = true;
        }

        var value = String((parseFloat(value) * (isPercentage ? 100 : 1)).toFixed(noOfDecimal)).replace(new RegExp('\\\B(?=(\\\d{' + noOfSeperate + '})+(?!\\\d))', 'g'), ",");

        value = format.replace(/[#|,|.|0]+/g, value);

        return value;
    }
};


Date.prototype.isDate = function () {
    if (isNaN(this.getTime())) {
        return false;
    }
    else {
        return true;
    }
}