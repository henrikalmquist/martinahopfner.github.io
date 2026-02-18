<template>
  <div class="image-wrap">
    <img
      class="image"
      :src="current.src"
      :alt="current.alt || 'Image'"
      @click="next"
    />

    <button
      class="plus"
      type="button"
      @click.stop="toggleInfo"
      :aria-expanded="showInfo ? 'true' : 'false'"
      aria-label="Toggle info"
    >
      {{ showInfo ? '−' : '+' }}
    </button>

    <div class="plus-spacer" aria-hidden="true"></div>

    <div v-if="showInfo" class="legend">
      <p v-if="current.title"><strong>{{ current.title }}</strong></p>
      <p class="spacer-sm"></p>
      <p v-for="(line, i) in current.legend" :key="i">{{ line }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { slides } from '../data.js'

const index = ref(0)
const showInfo = ref(false)

const current = computed(() => slides[index.value])

function next() {
  index.value = (index.value + 1) % slides.length
}

function toggleInfo() {
  showInfo.value = !showInfo.value
}
</script>

<style scoped>
.image-wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
}

.image {
  display: block;

  /* size control */
  max-width: 65vw;
  max-height: 80vh;

  width: auto;
  height: auto;

  object-fit: contain;
  cursor: pointer;
}

.plus {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(24px, 0);

  all: unset;
  cursor: pointer;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1;
  color: rgb(0, 0, 0);
}

.plus-spacer {
  position: absolute;
  top: 20px;
  right: 0;
  transform: translate(24px, 0);
  height: 18px;
  width: 1px;
}

.legend {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(24px, 28px);

  width: 240px;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: rgb(0, 0, 0);
}

.legend p {
  margin: 0;
}

.spacer-sm {
  height: 12px;
}
</style>
