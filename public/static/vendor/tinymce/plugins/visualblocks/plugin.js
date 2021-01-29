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

    var Cell = function (initial) {
      var value = initial;
      var get = function () {
        return value;
      };
      var set = function (v) {
        value = v;
      };
      return {
        get: get,
        set: set
      };
    };

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var fireVisualBlocks = function (editor, state) {
      editor.fire('VisualBlocks', { state: state });
    };

    var toggleVisualBlocks = function (editor, pluginUrl, enabledState) {
      var dom = editor.dom;
      dom.toggleClass(editor.getBody(), 'mce-visualblocks');
      enabledState.set(!enabledState.get());
      fireVisualBlocks(editor, enabledState.get());
    };

    var register = function (editor, pluginUrl, enabledState) {
      editor.addCommand('mceVisualBlocks', function () {
        toggleVisualBlocks(editor, pluginUrl, enabledState);
      });
    };

    var isEnabledByDefault = function (editor) {
      return editor.getParam('visualblocks_default_state', false, 'boolean');
    };

    var setup = function (editor, pluginUrl, enabledState) {
      editor.on('PreviewFormats AfterPreviewFormats', function (e) {
        if (enabledState.get()) {
          editor.dom.toggleClass(editor.getBody(), 'mce-visualblocks', e.type === 'afterpreviewformats');
        }
      });
      editor.on('init', function () {
        if (isEnabledByDefault(editor)) {
          toggleVisualBlocks(editor, pluginUrl, enabledState);
        }
      });
    };

    var toggleActiveState = function (editor, enabledState) {
      return function (api) {
        api.setActive(enabledState.get());
        var editorEventCallback = function (e) {
          return api.setActive(e.state);
        };
        editor.on('VisualBlocks', editorEventCallback);
        return function () {
          return editor.off('VisualBlocks', editorEventCallback);
        };
      };
    };
    var register$1 = function (editor, enabledState) {
      editor.ui.registry.addToggleButton('visualblocks', {
        icon: 'visualblocks',
        tooltip: 'Show blocks',
        onAction: function () {
          return editor.execCommand('mceVisualBlocks');
        },
        onSetup: toggleActiveState(editor, enabledState)
      });
      editor.ui.registry.addToggleMenuItem('visualblocks', {
        text: 'Show blocks',
        icon: 'visualblocks',
        onAction: function () {
          return editor.execCommand('mceVisualBlocks');
        },
        onSetup: toggleActiveState(editor, enabledState)
      });
    };

    function Plugin () {
      global.add('visualblocks', function (editor, pluginUrl) {
        var enabledState = Cell(false);
        register(editor, pluginUrl, enabledState);
        register$1(editor, enabledState);
        setup(editor, pluginUrl, enabledState);
      });
    }

    Plugin();

}());
