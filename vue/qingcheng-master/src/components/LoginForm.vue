<template>
  <div class="login-form" :class="{shake: error}">
    <div class="login-tab clearfix">
      <a href="javascript:;" :class="{active: loginTab}" @click="loginTab=true">Log In</a>
      <a href="javascript:;" :class="{active: !loginTab}" @click="loginTab=false">Sign Up</a>
    </div>

    <form action="/session" method="post" @submit="login" v-show="loginTab">
      <div class="form-field">
        <input type="text" placeholder="Username/Email" aria-label="Username or Email" name="username" v-model="username" required v-el:username>
      </div>
      <div class="form-field">
        <input type="password" placeholder="Password" aria-label="Password" name="password" v-model="password" required>
      </div>
      <label class="form-check">
        <input type="checkbox" name="permanent" v-model="permanent">Remember Me
      </label>
      <div class="form-submit">
        <button class="button buttong--green">Log In</button>
        <a href="/account/find-password">Find Password</a>
      </div>
    </form>

    <form action="/session/new" method="post" @submit="signup" v-show="!loginTab">
      <div class="form-field">
        <input type="email" placeholder="Email" aria-label="Email" name="email" v-model="email" required>
      </div>
      <div class="form-submit">
        <button class="button buttong--green">Sign Up</button>
      </div>
    </form>
    <div class="login-social" v-if="$site.logins && loginTab">
      <h3>Login With</h3>
      <div class="login-buttons">
        <a class="button login-{{name}}" href="/account/s/{{name}}" v-for="name in $site.logins">
          <i class="qc-icon-{{name}}"></i>{{name}}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import errorMessage from '../utils';

export default {
  replace: true,
  data() {
    return {
      username: '',
      password: '',
      email: '',
      loginTab: true,
      error: false,
      permanent: true
    };
  },
  methods: {
    shakeError() {
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 1000);
    },
    login(e) {
      e.preventDefault();
      var data = {
        username: this.username,
        password: this.password,
        permanent: this.permanent
      };
      api.user.login(data, resp => {
        this.$root.showLogin = false;
      }).error(this.shakeError.bind(this));
    },
    signup(e) {
      e.preventDefault();
      api.user.signup(this.email, resp => {
        this.$root.show('info', resp.message);
      }).error(resp => {
        this.$root.show('error', errorMessage(resp.error_form));
        this.shakeError();
      });
    }
  },
  ready() {
    var el = this.$els.username;
    setTimeout(() => {
      el.focus();
    }, 20);
  }
};
</script>

<style>
  .login-overlay {
    background-color: rgba(255, 255, 255, 0.98);
  }
  .login-tab {
    margin-bottom: 35px;
  }
  .login-tab a {
    display: inline-block;
    float: left;
    width: 30%;
    background-color: #ddd;
    text-align: center;
    color: white;
    text-transform: uppercase;
    padding: 5px 0;
  }
  .login-tab a.active {
    background-color: #42B983;
  }
  .login-form {
    width: 460px;
    margin: 120px auto 100px;
    transition: all .15s ease;
    max-width: 100%;
  }
  .login-social {
    text-align: center;
    text-transform: uppercase;
    transition: all .2s ease;
  }
  .login-social h3 {
    color: #999;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .login-social .button {
    margin: 10px;
  }
  .login-social i {
    margin-right: 8px;
  }
  .login-social .login-github {
    background-color: black;
  }
  .login-social .login-google {
    background-color: #4d90fe;
  }
  .login-social .login-twitter {
    background-color: #23acee;
  }
  .login-social .login-facebook {
    background-color: #3c5696;
  }
  .login-social .login-weibo {
    background-color: #e32428;
  }
  .fade-enter .login-form {
    margin-top: 300px;
  }
  .fade-leave .login-social {
    opacity: 0;
  }
</style>
