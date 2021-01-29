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

    var getKeyboardSpaces = function (editor) {
      var spaces = editor.getParam('nonbreaking_force_tab', 0);
      if (typeof spaces === 'boolean') {
        return spaces === true ? 3 : 0;
      } else {
        return spaces;
      }
    };
    var wrapNbsps = function (editor) {
      return editor.getParam('nonbreaking_wrap', true, 'boolean');
    };

    var stringRepeat = function (string, repeats) {
      var str = '';
      for (var index = 0; index < repeats; index++) {
        str += string;
      }
      return str;
    };
    var isVisualCharsEnabled = function (editor) {
      return editor.plugins.visualchars ? editor.plugins.visualchars.isEnabled() : false;
    };
    var insertNbsp = function (editor, times) {
      var classes = function () {
        return isVisualCharsEnabled(editor) ? 'mce-nbsp-wrap mce-nbsp' : 'mce-nbsp-wrap';
      };
      var nbspSpan = function () {
        return '<span class="' + classes() + '" contenteditable="false">' + stringRepeat('&nbsp;', times) + '</span>';
      };
      var shouldWrap = wrapNbsps(editor);
      var html = shouldWrap || editor.plugins.visualchars ? nbspSpan() : stringRepeat('&nbsp;', times);
      editor.undoManager.transact(function () {
        return editor.insertContent(html);
      });
    };

    var register = function (editor) {
      editor.addCommand('mceNonBreaking', function () {
        insertNbsp(editor, 1);
      });
    };

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.VK');

    var setup = function (editor) {
      var spaces = getKeyboardSpaces(editor);
      if (spaces > 0) {
        editor.on('keydown', function (e) {
          if (e.keyCode === global$1.TAB && !e.isDefaultPrevented()) {
            if (e.shiftKey) {
              return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            insertNbsp(editor, spaces);
          }
        });
      }
    };

    var register$1 = function (editor) {
      editor.ui.registry.addButton('nonbreaking', {
        icon: 'non-breaking',
        tooltip: 'Nonbreaking space',
        onAction: function () {
          return editor.execCommand('mceNonBreaking');
        }
      });
      editor.ui.registry.addMenuItem('nonbreaking', {
        icon: 'non-breaking',
        text: 'Nonbreaking space',
        onAction: function () {
          return editor.execCommand('mceNonBreaking');
        }
      });
    };

    function Plugin () {
      global.add('nonbreaking', function (editor) {
        register(editor);
        register$1(editor);
        setup(editor);
      });
    }

    Plugin();

}());
