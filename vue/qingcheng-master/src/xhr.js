
var defaults = {};

function request(url, options) {
  var req = new XMLHttpRequest();
  req.error = cb => {
    options.error = cb;
  };

  var method = options.method || 'GET';
  var data = options.data;
  if (method === 'GET' && data) {
    url += '?' + Object.keys(data).filter(
      k => k && data[k]
    ).map(
      k => k + '=' + data[k]
    ).join('&');
    data = null;
  }
  req.url = url;
  req.open(method, url);

  if (options.onload) {
    req.onload = options.onload.bind(this);
  }
  if (options.onerror) {
    req.onerror = options.onerror.bind(this);
  }
  if (options.onprogress) {
    req.upload.onprogress = options.onprogress.bind(this);
  }

  var startTime = new Date().getTime();
  var headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Requested-Time': startTime.toString(),
  };

  if (window.FormData && data instanceof FormData) {
    delete headers['Content-Type'];
  } else if (data) {
    data = JSON.stringify(data);
  }

  if (options.headers) {
    Object.keys(options.headers).forEach(k => {
      headers[k] = options.headers[k];
    });
  }

  Object.keys(headers).forEach(k => {
    req.setRequestHeader(k, headers[k]);
  });

  req.onreadystatechange = () => {
    if (4 === req.readyState) {
      var duration = new Date().getTime() - startTime;
      req.data = parseResponse(req.responseText);
      if (options.afterRequest) {
        options.afterRequest(req, duration);
      }
      var type = req.status / 100 | 0;
      if (2 === type) {
        options.success && options.success(req.data, req);
      } else {
        options.error && options.error(req.data, req);
      }
    }
  };

  if (options.beforeRequest) {
    options.beforeRequest(req);
  }

  if (data) {
    req.send(data);
  } else {
    req.send();
  }

  return req;
}

function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function extend(a, b) {
  Object.keys(b).forEach(k => {
    if (!a[k]) {
      a[k] = b[k];
    }
  });
  return a;
}

function parseParams(method, data, success, options) {
  if (typeof data === 'function') {
    options = success;
    success = data;
    data = null;
  }
  options = extend({method: method, data: data, success: success}, options || {});
  return extend(options, defaults);
}

exports.defaults = defaults;

exports.http = request;

export function get(url, data, success, options) {
  return request(url, parseParams('GET', data, success, options));
};

export function post(url, data, success, options) {
  return request(url, parseParams('POST', data, success, options));
};

export function del(url, data, success, options) {
  return request(url, parseParams('DELETE', data, success, options));
};

export function put(url, data, success, options) {
  return request(url, parseParams('PUT', data, success, options));
};
