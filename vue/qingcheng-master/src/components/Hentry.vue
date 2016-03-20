<template>
  <div class="hentry" v-el:page>
    <style class="cafe-theme" v-if="cafe.style.color">
      .entry-content blockquote {
        border-color: {{ cafe.style.color }};
      }
    </style>
    <div class="entry-cover cover" v-if="topicStyle" :style="topicStyle">
      <div class="cover__text">
        <div class="container">
          <h2 class="entry-title">{{ topic.title }}</h2>
        </div>
      </div>
    </div>

    <div class="container" v-if="topic">
      <h2 class="entry-title" v-if="!topicStyle">{{ topic.title }}</h2>
      <div class="entry-meta">
        <a href="/c/{{ cafe.slug }}" aria-label="Published in {{ cafe.name }}">
          <span class="cafe-logo" :style="cafeStyle"></span>
        </a>
        <time datetime="{{ topic.created_at }}" title="Updated at {{ topic.updated_at }}">{{ topic.created_at| timeago }}</time>
        <a v-if="user" href="/u/{{ user.username }}" aria-label="Published by @{{ user.username }}">@{{ user.username }}</a>
      </div>

      <webpage :webpage="topic.webpage" v-if="topic.webpage"></webpage>

      <div class="entry-content yue" v-html="topic.content"></div>

      <div class="entry-actions clearfix">
        <span id="like-button-status" v-if="!topic.liked_by_me">Like this topic</span>
        <span id="like-button-status" v-if="topic.liked_by_me">Toggle off like of this topic</span>
        <button class="button button--white like-button" :class="{liked: topic.liked_by_me}" @click="toggleLike" aria-labelledby="like-button-status" aria-pressed="{{topic.liked_by_me|json}}">
          <i class="qc-icon-heart"></i>
          <span>Like it</span>
        </button>
        <div class="more-actions">
          <span class="share-buttons">
            <button class="button button--white tip" aria-label="Share to Weibo" @click="share('weibo')">
              <i class="qc-icon-weibo"></i>
            </button>
            <button class="button button--white tip" aria-label="Share to Twitter" @click="share('twitter')">
              <i class="qc-icon-twitter"></i>
            </button>
          </span>
          <span v-if="isOwner">
            <button class="button button--white tip" aria-label="Show edit options" @click="showEditDropdown=true">
              <i class="qc-icon-quill"></i>
            </button>
            <dropdown v-show="showEditDropdown" :show.sync="showEditDropdown">
              <a class="dropdown-item" v-if="canEdit" v-link="{name: 'edit-topic', params: {topicId: topic.id}}">Edit</a>
              <a class="dropdown-item" href="/account/delete-topic/{{topic.id}}">Delete</a>
            </dropdown>
          </span>
        </div>
      </div>

      <div class="entry-footer clearfix">
        <div class="topic-cafe column" v-if="cafe.slug">
          <div class="column-title">Published In</div>
          <a href="/c/{{ cafe.slug }}" class="column-header">
            <span class="cafe-logo" :style="cafeStyle"></span>
            <div class="column-main">
              <strong>{{ cafe.name }}</strong>
            </div>
          </a>
          <p v-html="cafe.description|urlize"></p>
        </div>

        <div class="topic-author column" v-if="user.username">
          <div class="column-title">Created By</div>
          <div class="column-header">
            <a class="avatar" href="/u/{{ user.username }}">
                <avatar :alt="user.username" :src="user.avatar_url" class="v-avatar--squared"></avatar>
            </a>
            <a class="column-main" href="/u/{{ user.username }}">
              <strong>{{ user.username }}</strong>
              <div>#{{ user.id }}</div>
            </a>
          </div>
          <p v-html="user.description|urlize"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import Avatar from './Avatar.vue';
import Webpage from './Webpage.vue';
import Dropdown from './Dropdown.vue';

export default {
  props: {
    topic: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      rawTopic: {},
      showEditDropdown: false,
      showTopicForm: false
    }
  },
  computed: {
    cafe() {
      var cafes = this.topic.cafes;
      if (cafes) return cafes[0];
    },
    user() {
      return this.topic.user;
    },
    isOwner() {
      return this.topic.user.id === this.$root.user.id;
    },
    canEdit() {
      return this.topic.editable;
    },
    topicStyle() {
      var cover = this.topic.info.cover;
      if (!cover) return null;
      return {'background-image': 'url(' + cover + ')'};
    },
    cafeStyle() {
      var style = this.cafe.style;
      var rv = {'background-color': style.color || '#222221'};
      if (style.logo) {
        rv['background-image'] = 'url(' + style.logo + ')';
      }
      return rv;
    },
    shouldBind() {
      if (!this.$root.user.id) return false;
      return this.topic.read_by_me !== '100%';
    }
  },
  methods: {
    share(site) {
      var services = {
        twitter: 'https://twitter.com/intent/tweet?text={text}&url={url}',
        weibo: 'http://service.weibo.com/share/share.php?title={text}&url={url}'
      };
      var url = services[site];
      url = url.replace('{text}', encodeURIComponent(this.topic.title));
      url = url.replace('{url}', encodeURIComponent(location.href));
      window.open(url, '_blank', 'width=615,height=505');
    },
    toggleLike() {
      if (!this.$root.user.id) {
        return this.$root.showLogin = true;
      }
      if (this.topic.liked_by_me) {
        api.topic.unlike(this.topic.id, () => {
          this.topic.liked_by_me = false;
        });
      } else {
        api.topic.like(this.topic.id, () => {
          this.topic.liked_by_me = true;
        });
      }
    },
    editTopic() {
      if (!this.canEdit) return;
      api.topic.viewRaw(this.topic.id, resp => {
        this.rawTopic = resp;
        this.showTopicForm = true;
      });
    },
    progress() {
      var viewport = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      var height = this.$els.page.clientHeight;
      var percent = (window.scrollY + viewport * 0.8) / height * 100;
      return Math.min(Math.round(percent), 100);
    },
    bind() {
      var me = this;
      if (!me.shouldBind) return;

      var clock;
      var record = e => {
        clearTimeout(clock);
        if (!me.shouldBind) {
          return me.unbind();
        }

        clock = setTimeout(() => {
          var percent = me.progress();
          api.topic.read(me.topic.id, percent, resp => {
            me.topic.read_by_me = resp.percent;
          });
        }, 1000);
      };

      me._bindFunc = record;
      window.addEventListener('scroll', record)
    },
    unbind() {
      if (this._bindFunc) {
        window.removeEventListener('scroll', this._bindFunc);
        this._bindFunc = null;
      }
    }
  },
  attached() {
    this.bind();
  },
  detached() {
    this.unbind();
  },
  components: {
    Avatar,
    Dropdown,
    Webpage,
  }
}
</script>

<style>
  .hentry .cafe-logo {
    display: inline-block;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .hentry .entry-title {
    margin: 0;
    padding-top: 40px;
    padding-bottom: 10px;
    font-weight: 400;
    font-size: 42px;
    line-height: 1;
    color: #222223;
  }
  .entry-cover {
    height: 340px;
    margin-bottom: 20px;
  }
  .entry-cover .entry-title {
    color: white;
    padding-bottom: 1em;
  }
  .entry-meta {
    font-size: 14px;
    line-height: 2em;
    color: #999;
    padding: 10px 0;
  }
  .entry-meta time {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  .entry-meta .cafe-logo {
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.2em;
  }
  .entry-actions {
    margin-top: 2em;
  }
  .entry-actions .like-button {
    outline: none;
    font-size: 16px;
  }
  .entry-actions .like-button .qc-icon-heart {
    margin-right: 4px;
  }
  .entry-actions .liked .qc-icon-heart {
    color: red;
  }
  .entry-actions .more-actions {
    float: right;
  }
  .share-buttons .button {
    font-size: 18px;
    margin: 0 4px;
  }
  .entry-footer {
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
    margin-top: 20px;
  }
  .entry-footer .column {
    float: left;
    width: 46%;
    padding-bottom: 20px;
    line-height: 1.2;
  }
  .entry-footer .column-title {
    padding: 6px 0 14px;
    color: #999;
    font-size: 13px;
    text-transform: uppercase;
  }
  .entry-footer .column p {
    margin: 10px 0 0 0;
    line-height: 1.2;
    color: #666;
  }
  .entry-footer .topic-cafe {
    margin-right: 8%;
  }
  .entry-footer .column-header {
    display: block;
    overflow: hidden;
  }
  .entry-footer .column-main {
    overflow: hidden;
  }
  .column-header .cafe-logo, .column-header .avatar {
    float: left;
    width: 48px;
    height: 48px;
    line-height: 48px;
    margin-right: 10px;
  }
  #like-button-status {
    display: none;
  }
</style>
