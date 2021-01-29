/*
 *
 *  *
 *  *
 *  *      Copyright 2020-2021 Luter.me
 *  *
 *  *      Licensed under the Apache License, Version 2.0 (the "License");
 *  *      you may not use this file except in compliance with the License.
 *  *      You may obtain a copy of the License at
 *  *
 *  *        http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *      Unless required by applicable law or agreed to in writing, software
 *  *      distributed under the License is distributed on an "AS IS" BASIS,
 *  *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  *      See the License for the specific language governing permissions and
 *  *      limitations under the License.
 *  *
 *  *
 *
 */
(function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var html2bbcode = function (s) {
      s = global$1.trim(s);
      var rep = function (re, str) {
        s = s.replace(re, str);
      };
      rep(/<a.*?href=\"(.*?)\".*?>(.*?)<\/a>/gi, '[url=$1]$2[/url]');
      rep(/<font.*?color=\"(.*?)\".*?class=\"codeStyle\".*?>(.*?)<\/font>/gi, '[code][color=$1]$2[/color][/code]');
      rep(/<font.*?color=\"(.*?)\".*?class=\"quoteStyle\".*?>(.*?)<\/font>/gi, '[quote][color=$1]$2[/color][/quote]');
      rep(/<font.*?class=\"codeStyle\".*?color=\"(.*?)\".*?>(.*?)<\/font>/gi, '[code][color=$1]$2[/color][/code]');
      rep(/<font.*?class=\"quoteStyle\".*?color=\"(.*?)\".*?>(.*?)<\/font>/gi, '[quote][color=$1]$2[/color][/quote]');
      rep(/<span style=\"color: ?(.*?);\">(.*?)<\/span>/gi, '[color=$1]$2[/color]');
      rep(/<font.*?color=\"(.*?)\".*?>(.*?)<\/font>/gi, '[color=$1]$2[/color]');
      rep(/<span style=\"font-size:(.*?);\">(.*?)<\/span>/gi, '[size=$1]$2[/size]');
      rep(/<font>(.*?)<\/font>/gi, '$1');
      rep(/<img.*?src=\"(.*?)\".*?\/>/gi, '[img]$1[/img]');
      rep(/<span class=\"codeStyle\">(.*?)<\/span>/gi, '[code]$1[/code]');
      rep(/<span class=\"quoteStyle\">(.*?)<\/span>/gi, '[quote]$1[/quote]');
      rep(/<strong class=\"codeStyle\">(.*?)<\/strong>/gi, '[code][b]$1[/b][/code]');
      rep(/<strong class=\"quoteStyle\">(.*?)<\/strong>/gi, '[quote][b]$1[/b][/quote]');
      rep(/<em class=\"codeStyle\">(.*?)<\/em>/gi, '[code][i]$1[/i][/code]');
      rep(/<em class=\"quoteStyle\">(.*?)<\/em>/gi, '[quote][i]$1[/i][/quote]');
      rep(/<u class=\"codeStyle\">(.*?)<\/u>/gi, '[code][u]$1[/u][/code]');
      rep(/<u class=\"quoteStyle\">(.*?)<\/u>/gi, '[quote][u]$1[/u][/quote]');
      rep(/<\/(strong|b)>/gi, '[/b]');
      rep(/<(strong|b)>/gi, '[b]');
      rep(/<\/(em|i)>/gi, '[/i]');
      rep(/<(em|i)>/gi, '[i]');
      rep(/<\/u>/gi, '[/u]');
      rep(/<span style=\"text-decoration: ?underline;\">(.*?)<\/span>/gi, '[u]$1[/u]');
      rep(/<u>/gi, '[u]');
      rep(/<blockquote[^>]*>/gi, '[quote]');
      rep(/<\/blockquote>/gi, '[/quote]');
      rep(/<br \/>/gi, '\n');
      rep(/<br\/>/gi, '\n');
      rep(/<br>/gi, '\n');
      rep(/<p>/gi, '');
      rep(/<\/p>/gi, '\n');
      rep(/&nbsp;|\u00a0/gi, ' ');
      rep(/&quot;/gi, '"');
      rep(/&lt;/gi, '<');
      rep(/&gt;/gi, '>');
      rep(/&amp;/gi, '&');
      return s;
    };
    var bbcode2html = function (s) {
      s = global$1.trim(s);
      var rep = function (re, str) {
        s = s.replace(re, str);
      };
      rep(/\n/gi, '<br />');
      rep(/\[b\]/gi, '<strong>');
      rep(/\[\/b\]/gi, '</strong>');
      rep(/\[i\]/gi, '<em>');
      rep(/\[\/i\]/gi, '</em>');
      rep(/\[u\]/gi, '<u>');
      rep(/\[\/u\]/gi, '</u>');
      rep(/\[url=([^\]]+)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>');
      rep(/\[url\](.*?)\[\/url\]/gi, '<a href="$1">$1</a>');
      rep(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" />');
      rep(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<font color="$1">$2</font>');
      rep(/\[code\](.*?)\[\/code\]/gi, '<span class="codeStyle">$1</span>&nbsp;');
      rep(/\[quote.*?\](.*?)\[\/quote\]/gi, '<span class="quoteStyle">$1</span>&nbsp;');
      return s;
    };

    function Plugin () {
      global.add('bbcode', function (editor) {
        editor.on('BeforeSetContent', function (e) {
          e.content = bbcode2html(e.content);
        });
        editor.on('PostProcess', function (e) {
          if (e.set) {
            e.content = bbcode2html(e.content);
          }
          if (e.get) {
            e.content = html2bbcode(e.content);
          }
        });
      });
    }

    Plugin();

}());
