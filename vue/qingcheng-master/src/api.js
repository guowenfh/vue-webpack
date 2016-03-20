
var TRY_CURRENT_USER_KEY = 'zq:try:me';

var http = require('./xhr');

http.defaults.afterRequest = function(req, duration) {
  ga('send', 'timing', 'AJAX', req.url, duration, req.status);
};


exports.register = function(app) {
  trackUser.app = app;

  http.defaults.error = function(resp, status) {
    if (status === 401) {
      cleanUser();
      if (!sessionStorage[TRY_CURRENT_USER_KEY]) return;
    }

    if (resp.error_description) {
      var type = 'error';
      if (status === 429) {
        type = 'warn';
      }
      app.show(type, resp.error_description);
    } else if (status >= 500) {
      app.show('error', 'There is a server error.');
    }
  };
  if (sessionStorage[TRY_CURRENT_USER_KEY]) return;

  exports.user.profile('me').error(function() {
    sessionStorage[TRY_CURRENT_USER_KEY] = '1';
  });
};

exports.cafe = {
  list: function(cb) {
    ga('send', 'pageview', {title: 'Cafe List'});
    http.get('/api/cafes?count=100', cb);
  },
  url: function(slug) {
    return '/api/cafes/' + slug;
  },

  view: function(slug, cb) {
    return http.get(this.url(slug), function(resp) {
      if (resp.membership && resp.membership.label !== 'visitor') {
        resp.is_following = true;
      }
      cb(resp);
      ga('send', 'pageview', {title: resp.name});
    });
  },

  topics: function(slug, page, cb) {
    var url = this.url(slug) + '/topics';
    if (page) {
      url += '?page=' + page;
    }
    http.get(url, cb);
  },

  users: function(slug, page, cb) {
    var url = this.url(slug) + '/users';
    if (page) {
      url += '?page=' + page;
    }
    http.get(url, cb);
  },

  join: function(slug, cb) {
    http.post(this.url(slug) + '/users', cb);
  },

  leave: function(slug, cb) {
    http.del(this.url(slug) + '/users', cb);
  },
};


exports.timeline = function(params, cb) {
  var url = '/api/topics/timeline';
  ga('send', 'pageview', {title: 'Home'});
  http.get(url, params, cb);
};

exports.preview = function(text, cb) {
  http.post('/api/preview', {text: text}, cb);
};

exports.upload = function(file, transform, cb) {
  var data = {'content-type': file.type};
  if (transform) {
    data['image-type'] = transform;
  }
  http.get('/api/upload', data, function(resp) {
    var body = new FormData();
    body.append(resp.name, file);
    Object.keys(resp.payload).forEach(function(k) {
      body.append(k, resp.payload[k]);
    });
    var value = resp.value;
    http.post(resp.action, body, function(resp) {
      resp.value = resp.value || value;
      cb(resp);
    });
  });
};

exports.topic = {
  create: function(slug, payload, cb) {
    var url = '/api/cafes/' + slug + '/topics';
    http.post(url, payload, cb);
  },

  url: function(tid) {
    return '/api/topics/' + tid;
  },
  view: function(tid, cb) {
    return http.get(this.url(tid), function(resp) {
      cb(resp);
      ga('send', 'pageview', {title: resp.title});
    });
  },
  viewRaw: function(tid, cb) {
    http.get(this.url(tid) + '?content=raw', function(resp) {
      if (!resp.link) {
        resp.link = '';
      }
      cb(resp);
      ga('send', 'pageview', {title: 'Edit ' + resp.title});
    });
  },
  update: function(tid, payload, cb) {
    http.post(this.url(tid), payload, cb);
  },
  read: function(tid, percent, cb) {
    var url = this.url(tid) + '/read';
    http.post(url, {percent: percent}, cb);
  },
  like: function(tid, cb) {
    http.post(this.url(tid) + '/likes', cb);
  },
  unlike: function(tid, cb) {
    http.del(this.url(tid) + '/likes', cb);
  },
  comments: function(tid, cursor, cb) {
    var url = this.url(tid) + '/comments';
    var params = {order: 'asc'};
    if (cursor) {
      params.cursor = cursor;
    }
    http.get(url, params, cb);
  }
};

exports.comment = {
  url: function(comment) {
    return '/api/topics/' + comment.topic_id + '/comments/' + comment.id;
  },
  create: function(tid, payload, cb) {
    var url = '/api/topics/' + tid + '/comments';
    http.post(url, payload, cb);
  },
  delete: function(comment, cb) {
    http.del(this.url(comment), cb);
  },
  like: function(comment, cb) {
    http.post(this.url(comment) + '/likes', cb);
  },
  unlike: function(comment, cb) {
    http.del(this.url(comment) + '/likes', cb);
  },
  flag: function(comment, cb) {
    http.post(this.url(comment) + '/flag', cb);
  }
};

exports.user = {
  login: function(data, cb) {
    delete sessionStorage[TRY_CURRENT_USER_KEY];
    var rv = {};
    if (data.permanent) {
      rv.permanent = 'yes';
    }
    var headers = {
      'Authorization': 'Basic ' + btoa(data.username + ':' + data.password)
    };
    return http.post('/session', rv, function(user) {
      trackUser(user);
      cb && cb(user);
    }, {headers: headers});
  },
  signup: function(email, cb) {
    return http.post('/session/new', {email: email}, cb);
  },
  logout: function(cb) {
    cleanUser();
    http.del('/session', cb);
  },

  profile: function(uid, cb) {
    var url = '/api/users/' + uid;

    if (uid === 'me') {
      return http.get(url, function(user) {
        trackUser(user);
        cb && cb(user);
      });
    } else {
      ga('send', 'pageview', {title: uid});
      return http.get(url, cb);
    }
  },

  save: function(data, cb) {
    http.post('/api/users/me', data, function(user) {
      trackUser(user);
      cb && cb(user);
    });
  },

  topics: function(uid, cursor, cb) {
    var url = '/api/users/' + uid + '/topics';
    if (cursor) {
      url += '?cursor=' + cursor;
    }
    http.get(url, cb);
  }
};

exports.notification = {
  count: function(cb) {
    http.get('/api/users/me/notification/count', cb);
  },
  list: function(cb) {
    http.get('/api/users/me/notification?perpage=50', cb);
  },
  flush: function(cb) {
    http.del('/api/users/me/notification', cb);
  }
};

function trackUser(user) {
  trackUser.app.user = user;
  ga('set', 'userId', user.username);
}
trackUser.app = {};

function cleanUser() {
  trackUser.app.user = {};
}
