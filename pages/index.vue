<template>
  <div class="content">
    <div class="content__street-img-grid">
      <div
        @mouseover="hovered(2, 2)"
        @mouseout="unhovered(2, 2)"
        id="content__street-img-grid__item--2-2"
        class="content__street-img-grid__item content__street-img-grid__item--2-2"
      ></div>
      <div
        @mouseover="hovered(2, 3)"
        @mouseout="unhovered(2, 3)"
        id="content__street-img-grid__item--2-3"
        class="content__street-img-grid__item content__street-img-grid__item--2-3"
      ></div>
      <div
        @mouseover="hovered(2, 4)"
        @mouseout="unhovered(2, 4)"
        id="content__street-img-grid__item--2-4"
        class="content__street-img-grid__item content__street-img-grid__item--2-4"
      ></div>
      <div
        @mouseover="hovered(3, 2)"
        @mouseout="unhovered(3, 2)"
        id="content__street-img-grid__item--3-2"
        class="content__street-img-grid__item content__street-img-grid__item--3-2"
      ></div>
      <div
        @mouseover="hovered(3, 3)"
        @mouseout="unhovered(3, 3)"
        id="content__street-img-grid__item--3-3"
        class="content__street-img-grid__item content__street-img-grid__item--3-3"
      ></div>
      <div
        @mouseover="hovered(3, 4)"
        @mouseout="unhovered(3, 4)"
        id="content__street-img-grid__item--3-4"
        class="content__street-img-grid__item content__street-img-grid__item--3-4"
      ></div>
      <div
        @mouseover="hovered(4, 2)"
        @mouseout="unhovered(4, 2)"
        id="content__street-img-grid__item--4-2"
        class="content__street-img-grid__item content__street-img-grid__item--4-2"
      ></div>
      <div
        @mouseover="hovered(4, 3)"
        @mouseout="unhovered(4, 3)"
        id="content__street-img-grid__item--4-3"
        class="content__street-img-grid__item content__street-img-grid__item--4-3"
      ></div>
      <div
        @mouseover="hovered(4, 4)"
        @mouseout="unhovered(4, 4)"
        id="content__street-img-grid__item--4-4"
        class="content__street-img-grid__item content__street-img-grid__item--4-4"
      ></div>
    </div>
    <img
      class="content__pegman-img"
      :class="{ front: mapShowing }"
      src="~/assets/img/pegman.png"
    />

    <div @click="goOutsideClicked" class="content__go-outside-btn">
      <p>GO OUTSIDE</p>
      <p>GO OUTSIDE</p>
      <p>GO OUTSIDE</p>
    </div>
    <div
      class="content__maps-container"
      id="map"
      :class="{ visible: mapShowing }"
    ></div>
    <div
      class="content__pano-container"
      id="pano"
      :class="{ visible: mapShowing }"
    ></div>
  </div>
</template>

<script>
import { shuffleArray } from "~/api/utilities";
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
export default {
  head() {
    return {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}`,
        },
      ],
    };
  },
  data: () => {
    return {
      unlisten: [],
      hoverStates: {
        2: [false, false, false],
        3: [false, false, false],
        4: [false, false, false],
      },
      imageStates: {
        2: [false, false, false],
        3: [false, false, false],
        4: [false, false, false],
      },
      imagesOrder: [1, 3, 4, 6, 2, 5],
      currentImageIndex: 0,
      mapShowing: false,
      map: null,
    };
  },
  methods: {
    hovered(row, column) {
      if (
        !this.hoverStates[row][column - 2] &&
        !this.imageStates[row][column - 2] &&
        this.currentImageIndex < this.imagesOrder.length
      ) {
        this.hoverStates[row][column - 2] = true;
        this.imageStates[row][column - 2] = true;
        this.addImage(row, column);
      }
    },
    unhovered(row, column) {
      if (this.hoverStates[row][column - 2]) {
        this.hoverStates[row][column - 2] = false;
      }
    },
    generateRandomPercentage() {
      return Math.round(Math.random() * 100);
    },
    addImage(row, column) {
      const parentElem = document.getElementById(
        `content__street-img-grid__item--${row}-${column}`
      );

      var img = document.createElement("img");
      img.src = require(`~/assets/img/example-${
        this.imagesOrder[this.currentImageIndex]
      }.png`);
      this.currentImageIndex += 1;
      img.classList = ["content__street-img-grid__item__img"];
      img.style.top = `${this.generateRandomPercentage()}%`;
      img.style.left = `${this.generateRandomPercentage()}%`;
      img.style.position = "absolute";
      img.style.width = "120%";
      img.style.height = "auto";
      img.style.transform = "translate3d(-50%, -50%, 0)";
      img.style.maxWidth = "none";

      parentElem.appendChild(img);
    },

    goOutsideClicked() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.startupMaps);
      } else {
        alert("Location services not supported");
      }
    },
    async startupMaps(position) {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      this.mapShowing = true;

      const { Map, StreetViewPanorama } = await google.maps.importLibrary(
        "maps"
      );
      // Short namespaces can be used.
      this.map = new Map(document.getElementById("map"), {
        center: pos,
        zoom: 14,
      });

      this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
          position: pos,
          pov: {
            heading: 34,
            pitch: 10,
          },
        }
      );

      this.map.setStreetView(this.panorama);
    },
  },
  mounted() {
    this.imagesOrder = shuffleArray(this.imagesOrder);
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  background-color: var(--color-white);
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);

  &__go-outside-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    mix-blend-mode: difference;

    &:hover {
      cursor: pointer;
      mix-blend-mode: normal;

      p {
        color: red;
      }
    }

    p {
      margin: 0 0;
      font-size: 150px;
      line-height: 150px;
      color: var(--color-white);
      text-align: center;
    }
  }

  &__pegman-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);

    height: 45%;
    width: auto;
    max-width: 90%;

    &.front {
      z-index: 50;
    }
  }

  &__street-img-grid {
    position: absolute;
    display: grid;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    &__item {
      position: relative;
      width: 100%;
      height: 100%;

      &--2-2 {
        grid-row: 2;
        grid-column: 2;
      }

      &--2-3 {
        grid-row: 2;
        grid-column: 3;
      }

      &--2-4 {
        grid-row: 2;
        grid-column: 4;
      }

      &--3-2 {
        grid-row: 3;
        grid-column: 2;
      }

      &--3-3 {
        grid-row: 3;
        grid-column: 3;
      }

      &--3-4 {
        grid-row: 3;
        grid-column: 4;
      }

      &--4-2 {
        grid-row: 4;
        grid-column: 2;
      }
      &--4-3 {
        grid-row: 4;
        grid-column: 3;
      }
      &--4-4 {
        grid-row: 4;
        grid-column: 4;
      }
    }
  }

  &__maps-container,
  &__pano-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    visibility: hidden;

    &.visible {
      visibility: visible;
    }
  }
}
</style>
