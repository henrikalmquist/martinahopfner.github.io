<template>
  <main class="layout">
    <!-- LEFT COLUMN -->
    <div class="left">
      <p>MARTINA HOPFNER</p>
      <p><em>Art Director / Creative Producer</em></p>

      <p class="spacer"></p>

      <p>Currently based in Germany</p>

      <p class="spacer"></p>

      <p>+49 152 59165837</p>
      <p><a href="mailto:mail@martinahopfner.com">mail@martinahopfner.com</a></p>
      <p>
        <a href="https://instagram.com/martina.hopfner" target="_blank" rel="noreferrer">
          Instagram: @martina.hopfner
        </a>
      </p>
    </div>

    <!-- MAIN AREA -->
    <div class="stage">
      <div class="image-wrap" :style="wrapStyle">
        <img
          class="image"
          :src="currentSlide.src"
          :alt="currentSlide.alt || currentSlide.title || 'Martina Hopfner work'"
          @click="nextSlide"
        />

        <!-- Overlay lives outside image to the right -->
        <div class="overlay">
          <button
            class="plus"
            type="button"
            @click.stop="toggleInfo"
            :aria-expanded="showInfo ? 'true' : 'false'"
            aria-label="Toggle info"
          >
            {{ showInfo ? '−' : '+' }}
          </button>

          <div v-if="showInfo" class="legend">
            <p v-if="currentSlide.title" class="title">{{ currentSlide.title }}</p>
            <p class="spacer-sm" aria-hidden="true"></p>
            <p v-for="(line, i) in currentSlide.legend" :key="i">
              {{ line }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { slides } from '../data.js'

const index = ref(0)
const showInfo = ref(false)

const currentSlide = computed(() => slides[index.value])

function nextSlide() {
  // clicking the image closes legend and advances
  showInfo.value = false
  index.value = (index.value + 1) % slides.length
}

function toggleInfo() {
  showInfo.value = !showInfo.value
}

// per-slide fine tuning (viewport percent offsets)
const wrapStyle = computed(() => {
  const x = currentSlide.value.offset?.x ?? 0
  const y = currentSlide.value.offset?.y ?? 0
  return {
    transform: `translate(calc(-50% + ${x}vw), calc(-50% + ${y}vh))`,
  }
})
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* no scroll */
}

/* LEFT */
.left {
  padding: 40px;
  text-align: left;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: rgb(0, 0, 0);
}

.left p {
  margin: 0;
}

.left a {
  color: rgb(0, 0, 0);
  text-decoration: none;
}

.spacer {
  height: 20px;
}

/* STAGE */
.stage {
  position: relative;
  overflow: hidden;
}

/* image wrapper centred to full viewport (fine tuned via wrapStyle) */
.image-wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  display: inline-block;
}

/* image */
.image {
  display: block;
  max-width: 60vw;   /* adjust image width here */
  max-height: 85vh;  /* adjust image height here */
  object-fit: contain;
  cursor: pointer;

  position: relative;
  z-index: 1;
}

/* Overlay sits OUTSIDE the image to the right */
.overlay {
  position: absolute;
  top: 0;

  left: 100%;         /* start at the right edge of the image */
  margin-left: 28px;  /* distance from image edge */

  z-index: 5;
  text-align: left;

  /* CONTROL VERTICAL SPACE BETWEEN + AND LEGEND HERE */
  --plus-gap: 28px;
}

/* + */
.plus {
  border: 0;
  background: transparent;
  padding: 0;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  line-height: 1;

  cursor: pointer;
  color: rgb(0, 0, 0);
}

/* legend opens downward under + */
.legend {
  margin-top: var(--plus-gap);
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
