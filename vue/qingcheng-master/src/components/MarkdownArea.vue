<template>
  <div class="markdown-area" :class="{active: content.length}">
    <textarea placeholder="{{ placeholder }}" aria-label="{{ placeholder }}" v-show="!html" v-model='content' v-el:text @keydown="keyboardSubmit"></textarea>
    <div class="markdown-preview" v-show="html" v-html="html" @click="focus"></div>
    <div class="markdown-actions" v-show="!html">
      <a href="#" @click="image" v-show="!uploading">Image</a>
      <a href="#" @click="preview">Preview</a>
    </div>
    <div class="markdown-actions" v-show="html">
      <a href="#" @click="focus">Edit</a>
    </div>
    <input type="file" style="opacity: 0; left: -99999px; position: absolute" v-el:file accept="image/*" @change="upload">
  </div>
</template>

<script>
import api from '../api';

export default {
  props: {
    placeholder: String,
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      html: '',
      uploading: false
    };
  },
  methods: {
    keyboardSubmit(e) {
      if (e.keyCode !== 13) return;
      var mac = /mac/i.test(navigator.userAgent);
      if ((mac && !e.metaKey) || (!mac && !e.ctrlKey)) return;
      this.$emit('submit');
    },
    focus(e) {
      e && e.preventDefault();
      this.html = '';
      var el = this.$els.text;
      setTimeout(() => {
        el.focus();
      }, 10);
    },
    preview(e) {
      e.preventDefault();
      if (this.html) {
        return this.html = '';
      }
      api.preview(this.content, html => {
        this.html = html;
      });
    },
    image(e) {
      e.preventDefault();
      this.$els.file.click();
    },
    upload() {
      var files = this.$els.file.files;
      if (!files.length) return;

      var stamp = Date.now().toString(36);
      var mark = '[uploading image ' + stamp + ' ...]';
      this.uploading = true;
      this.content += '\n' + mark + '\n';
      api.upload(files[0], null, resp => {
        this.content = this.content.replace(mark, '![image](' + resp.value + ')');
        this.focus();
        this.uploading = false;
      });
    }
  }
}
</script>

<style>
  .markdown-area {
    position: relative;
    padding-top: 1em;
  }
  .markdown-area .markdown-actions {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 1;
  }
  .markdown-area .markdown-actions a {
    color: #666;
    font-size: 12px;
    text-transform: uppercase;
    margin-right: 12px;
  }
</style>
