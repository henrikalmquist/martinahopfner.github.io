<template>
  <main class="layout">
<!-- LEFT / TOP -->
<div class="left">
  <!-- name is clickable, keeps its own alignment -->
  <button
    class="name-toggle"
    type="button"
    @click="toggleLeftInfo"
    :aria-expanded="showLeftInfo ? 'true' : 'false'"
  >
    <p class="name">MARTINA HOPFNER</p>
  </button>

  <div class="left-indent">
    <!-- role is clickable, keeps indent alignment -->
    <button
      class="left-toggle"
      type="button"
      @click="toggleLeftInfo"
      :aria-expanded="showLeftInfo ? 'true' : 'false'"
    >
      <p class="role"><em>Art Director / Creative Producer</em></p>
    </button>

    <div v-if="showLeftInfo" class="left-details">
      <p class="spacer spacer-lg" aria-hidden="true"></p>

      <p>Currently based in Germany</p>

      <p class="spacer" aria-hidden="true"></p>

      <p>+49 152 59165837</p>
      <p><a href="mailto:mail@martinahopfner.com">mail@martinahopfner.com</a></p>
      <p>
        <a href="https://instagram.com/martina.hopfner" target="_blank" rel="noreferrer">
          Instagram: @martina.hopfner
        </a>
      </p>
    </div>
  </div>
</div>

    <!-- MAIN AREA -->
    <div class="stage" :class="{ hidden: isMobile && showLeftInfo }">
      <div class="image-wrap" :style="wrapStyle">
        <!-- this box hugs the image and becomes the anchor for + and legend -->
        <div class="img-box">
          <img
            v-if="currentSlide?.src"
            class="image"
            :src="currentSlide.src"
            :alt="currentSlide.alt || currentSlide.title || 'Martina Hopfner work'"
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
              <p v-if="currentSlide.title" class="title">{{ currentSlide.title }}</p>
              <p class="spacer-sm" aria-hidden="true"></p>
              <p v-for="(line, i) in currentSlide.legend" :key="i">
                {{ line }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import slidesRaw from '../data.json'

const index = ref(0)
const showInfo = ref(false)
const showLeftInfo = ref(false)
const isMobile = ref(false)

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 1040px)').matches
  if (!isMobile.value) showLeftInfo.value = false
}

function handleKey(e) {
  if (e.key === 'ArrowRight') {
    nextSlide()
  }

  // backward arrow exists but disabled
  if (e.key === 'ArrowLeft') {
    // prevSlide()
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
  window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

function mobileFlag(v) {
  if (v === '' || v === null || typeof v === 'undefined') return 1
  if (v === 1 || v === true) return 1
  const s = String(v).trim().toLowerCase()
  if (s === '1' || s === 'true' || s === 'yes' || s === 'y') return 1
  if (s === '0' || s === 'false' || s === 'no' || s === 'n') return 0
  const n = Number(s)
  if (Number.isFinite(n)) return n > 0 ? 1 : 0
  return 1
}

const slides = computed(() => {
  if (!isMobile.value) return slidesRaw
  return slidesRaw.filter((s) => mobileFlag(s.mobile) === 1)
})

watch(
  () => slides.value.length,
  (len) => {
    if (!len) index.value = 0
    else if (index.value >= len) index.value = 0
  }
)

const currentSlide = computed(() => {
  if (!slides.value.length) return { src: '', legend: [], offset: { x: 0, y: 0 } }
  const safeIndex = ((index.value % slides.value.length) + slides.value.length) % slides.value.length
  return slides.value[safeIndex]
})

function nextSlide() {
  showInfo.value = false
  if (!slides.value.length) return
  index.value = (index.value + 1) % slides.value.length
}

function prevSlide() {
  showInfo.value = false
  if (!slides.value.length) return
  index.value = (index.value - 1 + slides.value.length) % slides.value.length
}

function toggleInfo() {
  showInfo.value = !showInfo.value
}

function toggleLeftInfo() {
  showLeftInfo.value = !showLeftInfo.value
  if (isMobile.value && showLeftInfo.value) showInfo.value = false
}

const wrapStyle = computed(() => {
  if (isMobile.value) return {}
  const x = currentSlide.value.offset?.x ?? 0
  const y = currentSlide.value.offset?.y ?? 0
  return {
    transform: `translate(calc(-50% + ${x}vw), calc(-50% + ${-y}vh))`,
  }
})
</script>

<style scoped>
/* DESKTOP DEFAULT */
.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* LEFT */
.left {
  padding-left: 60px;
  padding-top: 30px;
  text-align: left;
  font-family: Arial Narrow, Arial, Helvetica, sans-serif;
  font-size: 19px;
  line-height: 1.4;
  color: rgb(0, 0, 0);

  position: sticky;
  top: 0;
  height: 100vh;
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

.spacer-lg {
  height: 60px;
}

.left-indent {
  margin-left: 20px;
}

.left-toggle {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
  color: rgb(0, 0, 0);
  font: inherit;
}

.role {
  white-space: nowrap;
}

.name-toggle {
  all: unset;              /* removes default button styles */
  cursor: pointer;
  display: block;          /* keeps layout stable */
}

.name-toggle:focus-visible {
  outline: none;           /* remove blue focus ring */
}

.left-toggle:focus-visible {
  outline: 1px solid rgb(0, 0, 0);
  outline-offset: 6px;
}

/* STAGE */
.stage {
  position: relative;
  overflow: hidden;
}

.stage.hidden {
  display: none;
}

/* centres the whole image system on desktop */
.image-wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  display: inline-block;
}

/* box that hugs the image */
.img-box {
  position: relative;
  display: inline-block;
}

/* image */
/* image */
.image {
  display: block;

  width: auto;
  height: auto;

  max-width: min(50vw, 1100px);
  max-height: 85vh;

  cursor: pointer;
  position: relative;
  z-index: 1;
}
/* overlay to the right on desktop, anchored to the image box */
.overlay {
  position: absolute;
  top: -5px;
  left: 100%;
  margin-left: 40px;

  z-index: 5;
  text-align: left;

  --plus-gap: 40px;
}

.plus {
  border: 0;
  background: transparent;
  padding: 0;

  font-family: Arial Narrow, Arial, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 1;

  cursor: pointer;
  color: rgb(0, 0, 0);
}

.legend {
  margin-top: var(--plus-gap);
  width: 240px;

  font-family: Arial Narrow, Arial, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 1.4;
  color: rgb(0, 0, 0);
}

.legend p {
  margin: 0;
}

.spacer-sm {
  height: 12px;
}

/* MOBILE + IPAD */
@media (max-width: 1040px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .left {
    position: relative;
    height: auto;
    padding-left: 26px;
    padding-right: 26px;
    padding-top: 22px;
    font-size: 19px;
  }

  .left-indent {
    margin-left: 18px;
  }

  .stage {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .image-wrap {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    height: auto;
    transform: none !important;
    display: block;
    padding: 80px 80px 80px 80px;
    box-sizing: border-box;
  }

  .img-box {
    position: relative;
    display: block;
    width: 100%;
  }

  .image {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: none;
    object-fit: contain;
    margin: 0;
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 100%;
    margin-left: 0;
    margin-top: 22px;
    width: 100%;
    text-align: left;
    --plus-gap: 18px;
  }

  .legend {
    width: 100%;
    font-size: 16px;
  }

  .plus {
    font-size: 16px;
  }

  .spacer-lg {
    height: 160px;
  }

}
</style>