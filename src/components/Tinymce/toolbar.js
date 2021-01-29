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

// Here is a list of the toolbar
// Detail list see https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols

const toolbarFull =
  "searchreplace undo redo |styleselect | bold italic underline strikethrough forecolor backcolor emoticons| alignleft aligncenter alignright outdent indent | blockquote  subscript superscript  |  bullist numlist link image uploadImagesButton charmap  anchor pagebreak insertdatetime media table  |  removeformat preview code codesamplehr | fullscreen ";
const toolbar1 = [
  "undo redo | styleselect | link image uploadImagesButton charmap  anchor | alignleft aligncenter alignright | anchor pagebreak insertdatetime media table  |  removeformat preview code codesamplehr | fullscreen ",
];
const toolbar2 = [
  "undo redo | styleselect | bold italic | link image alignleft aligncenter alignright",
];
export default toolbar1;
