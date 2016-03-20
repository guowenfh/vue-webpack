<template>
  <section class="webpage" v-show="webpage.title">
    <a href="{{ webpage.link }}" v-el:wrapper>
      <div class="webpage__image" v-el:image></div>
      <div class="webpage__info">
        <h2>{{ webpage.title }}</h2>
        <p class="webpage__host">{{ webpage.domain }}</p>
        <p>{{ webpage.description }}</p>
      </div>
    </a>
  </section>
</template>

<script>
export default {
  props: ['webpage'],
  ready() {
    var src = this.webpage.image;
    if (!src || src.indexOf('https://') !== 0) return;

    var img = new Image();
    img.src = src;

    var wrap = this.$els.image;
    var sec = this.$els.wrapper;
    img.onload = function() {
      wrap.style.backgroundImage = 'url(' + src + ')';
      if (img.width > sec.clientWidth) {
        sec.className = 'webpage--cover';
      } else {
        sec.className = 'webpage--media';
      }
    };
  }
}
</script>
