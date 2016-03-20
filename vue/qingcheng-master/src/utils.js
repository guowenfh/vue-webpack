export function escape(html) {
  html = html || '';
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
};

export function shake(el) {
  el.classList.add('shake');
  setTimeout(() => {
    el.classList.remove('shake');
  }, 650);
};

export function errorMessage(formError) {
  for (var k in formError) {
    if (formError[k].length) {
      return formError[k][0];
    }
  }
};
