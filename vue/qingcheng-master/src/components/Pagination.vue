<template>
  <div class="pagination clearfix">
    <a class="pagination-prev" v-if="pagination.prev" href="{{ url }}?page={{ pagination.prev }}">Prev</a>
    <span class="pagination-prev" v-if="!pagination.prev">Prev</span>

    <a class="pagination-next" v-if="pagination.next" href="{{ url }}?page={{ pagination.next }}">Next</a>
    <span class="pagination-next" v-if="!pagination.next">Next</span>
  </div>
</template>
<script>
export default {
  props: ['url', 'pagination']
};
</script>
