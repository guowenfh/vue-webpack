<template>
  <form class="topic-form" :class="{'disabled-form': disabled}" @submit.prevent="formSubmit" v-el:form>
    <div class="form-description">
      Topic in <a v-link="{name: 'cafe', params: {slug: cafe.slug }}">{{ cafe.name }}</a>
    </div>
    <div class="form-field form-title">
      <input placeholder="Your topic title" v-model="topic.title" v-el:title :disabled="disabled">
    </div>
    <div class="form-field form-link">
      <input placeholder="Source link?" type="url" v-model="topic.link">
    </div>
    <markdown-area class="form-field form-content yue" :content.sync="topic.content" placeholder="What is in your mind" @submit="formSubmit"></markdown-area>
    <div class="form-submit">
      <button class="button buttong--green" :disabled="disabled">{{ type }}</button>
    </div>
  </form>
</template>

<script>
import shake from '../utils';
import MarkdownArea from './MarkdownArea.vue';

export default {
  props: {
    cafe: Object,
    type: String,
    topic: {
      type: Object,
      default() {
        return {
          title: '',
          link: '',
          content: ''
        };
      }
    }
  },
  data() {
    return {
      disabled: false
    };
  },
  computed: {
    hasContent() {
      return this.topic.title || this.topic.content;
    }
  },
  methods: {
    formSubmit() {
      if (this.disabled) return;

      var topic = this.topic;
      var payload = {
        title: topic.title.trim(),
        content: topic.content.trim(),
        link: topic.link.trim()
      }
      if (!payload.title || !payload.content) {
        return shake(this.$els.form);
      }
      this.disabled = true;
      this.$emit('submit', payload);
    }
  },
  ready() {
    var el = this.$els.title;
    setTimeout(() => {
      el.focus();
    }, 20);
  },
  components: {
    MarkdownArea
  }
}
</script>

<style>
.topic-form {
  padding: 40px 110px 20px;
}
.topic-form.disabled-form {
  opacity: 0.5;
}
.topic-form .form-title input {
  border: none;
  font-size: 36px;
  font-weight: 600;
  color: #343433;
}
.topic-form .form-link input {
  font-size: 12px;
  border: none;
  padding-right: 140px;
}
.topic-form .form-content {
  padding-top: 0.2em;
}
.topic-form .form-content .markdown-actions {
  top: -36px;
}
.topic-form .form-content textarea {
  border: none;
  height: 24em;
}
.topic-form .form-field input, .topic-form .form-field textarea {
  font-family: "Helvetica Neue", "Xin Gothic", "Hiragino Sans GB", "Droid Sans Fallback", "Microsoft YaHei", "SimSun", sans-serif;
}
</style>
