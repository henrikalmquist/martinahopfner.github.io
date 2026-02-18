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
          :alt="currentSlide.title || 'Martina Hopfner work'"
          @click="nextSlide"
        />

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
    <p class="title">{{ currentSlide.title }}</p>
    <p class="spacer-sm"></p>
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
  showInfo.value = false   // close legend
  index.value = (index.value + 1) % slides.length
}


function toggleInfo() {
  showInfo.value = !showInfo.value
}

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
.left p { margin: 0; }
.left a { color: rgb(0, 0, 0); text-decoration: none; }
.spacer { height: 20px; }

/* STAGE */
.stage { position: relative; }

/* image wrapper centred to full viewport */
.image-wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  display: inline-block;
}


/* image */
.image {
  display: block;
  max-width: 60vw;
  max-height: 85vh;
  object-fit: contain;
  cursor: pointer;
}

/* + pinned to image top-right corner */
.plus {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(28px, 0);

  border: 0;
  background: transparent;
  padding: 0;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: rgb(0, 0, 0);
}


/* spacer block "after +" (placeholder for future mobile behaviour) */
.plus-spacer {
  position: absolute;
  top: 22px;
  right: 0;
  transform: translate(28px, 0);
  height: 36px; /* adjust later */
  width: 1px;
}

/*
  LEGEND opens DOWNWARDS from the + point,
  and starts to the RIGHT of the image edge.
*/
.legend {
  position: absolute;

  /* anchor at image top-right corner */
  top: 0;
  right: 0;

  /* move down a bit under the + */
  margin-top: 28px;

  /* now: start to the RIGHT of the image edge */
  left: 100%;
  right: auto;

  /* spacing between image edge and legend */
  margin-left: 28px;

  width: 240px;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: rgb(0, 0, 0);
  text-align: left;
}



.legend p { margin: 0; }
.spacer-sm { height: 12px; }
</style>
