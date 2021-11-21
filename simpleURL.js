/**
 * Created by wangcong on 2019/03/21.
 */

//   example 1: urlencode('Kevin van Zonneveld!');
//   returns 1: 'Kevin+van+Zonneveld%21'
//   example 2: urlencode('http://kevin.vanzonneveld.net/');
//   returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
//   example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
//   returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
function urlencode(str) {
    str = (str + '')
        .toString();
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
}

//   example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
//   returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
//   example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
//   returns 2: 'myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&php=hypertext+processor&cow=milk'
function http_build_query(formdata, numeric_prefix, arg_separator) {
    var value, key, tmp = [],
        that = this;

    var _http_build_query_helper = function (key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = '1';
        } else if (val === false) {
            val = '0';
        }
        if (val != null) {
            if (typeof val === 'object') {
                for (k in val) {
                    if (val[k] != null) {
                        tmp.push(_http_build_query_helper(key + '[' + k + ']', val[k], arg_separator));
                    }
                }
                return tmp.join(arg_separator);
            } else if (typeof val !== 'function') {
                return that.urlencode(key) + '=' + that.urlencode(val);
            } else {
                throw new Error('There was an error processing for http_build_query().');
            }
        } else {
            return '';
        }
    };

    if (!arg_separator) {
        arg_separator = '&';
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
        var query = _http_build_query_helper(key, value, arg_separator);
        if (query !== '') {
            tmp.push(query);
        }
    }

    return tmp.join(arg_separator);
}
//   example 1: trim('    Kevin van Zonneveld    ');
//   returns 1: 'Kevin van Zonneveld'
//   example 2: trim('Hello World', 'Hdle');
//   returns 2: 'o Wor'
//   example 3: trim(16, 1);
//   returns 3: 6
function trim(str, charlist) {
    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

function authMiddleware() {
    //按需实现   做ajax请求 或从缓存中读取权限 拦截跳转
    return true;
}

function toPage(pageParam) {
    var currentParam = {
        domain: '',   //如需跳转到其他域名  http://www.baidu.com
        prefixPath: '/wap/',   //更改全局前缀路径
        suffix: '.html',       //更改页面类型与路径
        pageName: '',     //页面名称
        urlParam: {},          //默认参数
        isCreate: false,
        url: ''
    }

    if(typeof(pageParam)=='string'){
        currentParam.pageName = pageParam;
    }

    if(typeof(pageParam)=='object'){
        for (var i in currentParam) {
            if (pageParam[i]) {
                currentParam[i] = pageParam[i];
            }
        }
    }

    var urlParam = http_build_query(currentParam.urlParam);

    if (typeof(currentParam.urlParam) != 'object') {
        currentParam.urlParam = {};
        urlParam = "";
    }
    //格式整理
    if (urlParam) {
        urlParam = '?' + urlParam;
    }
    if(currentParam.domain){
        currentParam.domain = trim(currentParam.domain,'/');
    }
    if(currentParam.prefixPath){
        currentParam.prefixPath = '/'+trim(currentParam.prefixPath,'/')+'/';
    }
    if(currentParam.pageName){
        currentParam.pageName = trim(currentParam.pageName,'/');
    }
    if(currentParam.suffix){
        currentParam.suffix = '.'+trim(currentParam.suffix,'.');
    }

    var url = currentParam.domain + currentParam.prefixPath + currentParam.pageName + currentParam.suffix + urlParam;

    currentParam.url = url;

    if (currentParam.isCreate) {
        return url;
    }

    //权限拦截
    if(authMiddleware(currentParam)==true){
        window.location.href = url;
    }


}
var to = toPage;