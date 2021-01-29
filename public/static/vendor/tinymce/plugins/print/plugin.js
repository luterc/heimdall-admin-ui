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

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    var register = function (editor) {
      editor.addCommand('mcePrint', function () {
        if (global$1.browser.isIE()) {
          editor.getDoc().execCommand('print', false, null);
        } else {
          editor.getWin().print();
        }
      });
    };

    var register$1 = function (editor) {
      editor.ui.registry.addButton('print', {
        icon: 'print',
        tooltip: 'Print',
        onAction: function () {
          return editor.execCommand('mcePrint');
        }
      });
      editor.ui.registry.addMenuItem('print', {
        text: 'Print...',
        icon: 'print',
        onAction: function () {
          return editor.execCommand('mcePrint');
        }
      });
    };

    function Plugin () {
      global.add('print', function (editor) {
        register(editor);
        register$1(editor);
        editor.addShortcut('Meta+P', '', 'mcePrint');
      });
    }

    Plugin();

}());
