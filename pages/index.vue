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
      class="content__peggy-img"
      :class="{ front: mapShowing }"
      src="~/assets/img/peggy.svg"
    />

    <div
      :class="{ visible: !isBusy }"
      @click="goOutsideClicked"
      class="content__go-outside-btn"
    >
      <p>GO OUTSIDE</p>
      <p>GO OUTSIDE</p>
      <p>GO OUTSIDE</p>
    </div>
    <div class="content__shameless-plug">
      BY <a href="https://emmabhoward.com" target="_blank">EMMA</a>
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
    <div
      @click="goInsideClicked"
      class="content__go-inside-btn"
      v-if="goInsideShowing"
    >
      <p>GO INSIDE?</p>
    </div>

    <div class="content__opening-door-text" v-if="isBusy">
      <p>OPENING DOOR{{ openingDoorDots }}</p>
    </div>
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
      rowColumnOrder: [
        [2, 2],
        [2, 3],
        [2, 4],
        [3, 2],
        [3, 3],
        [3, 4],
        [4, 2],
        [4, 3],
        [4, 4],
      ],
      currentImageIndex: 0,
      mapShowing: false,
      map: null,
      goInsideShowing: false,
      isBusy: false,
      openingDoorDots: ".",
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
      if (this.isTabletAndAbove) {
        img.style.width = "100%";
        img.style.height = "auto";
      } else {
        img.style.width = "auto";
        img.style.height = "120%";
      }
      img.style.transform = "translate3d(-50%, -50%, 0)";
      img.style.maxWidth = "none";

      parentElem.appendChild(img);
    },
    rad(x) {
      return (x * Math.PI) / 180;
    },

    getDistance(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = this.rad(p2.lat() - p1.lat());
      var dLong = this.rad(p2.lng() - p1.lng());
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p1.lat())) *
          Math.cos(this.rad(p2.lat())) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    },
    setIsBusy() {
      this.isBusy = true;

      this.openingDoorDotsInterval = setInterval(() => {
        if (!this.isBusy) {
          clearInterval(this.openingDoorDotsInterval);
        } else {
          if (this.openingDoorDots.length == 3) {
            this.openingDoorDots = ".";
          } else {
            this.openingDoorDots = this.openingDoorDots + ".";
          }
        }
      }, 500);
    },
    goOutsideClicked() {
      if (navigator.geolocation && !this.mapShowing) {
        this.setIsBusy();
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
      const sv = new google.maps.StreetViewService();

      // Short namespaces can be used.
      this.map = new Map(document.getElementById("map"), {
        center: pos,
        zoom: 14,
      });

      this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano")
      );

      sv.getPanorama({ location: pos, radius: 50, source: "outdoor" })
        .then(this.processSVData)
        .catch((err) => {
          console.log(err);
          this.isBusy = false;
          this.mapShowing = false;
          alert("Going outside not supported in your area :(");
        });
    },
    processSVData({ data }) {
      const location = data.location;

      this.panorama.setPano(location.pano);
      this.panorama.setPov({
        heading: 34,
        pitch: 10,
      });

      this.map.setStreetView(this.panorama);
      this.originalPosition = null;
      this.panorama.setVisible(true);

      this.isBusy = false;

      this.panorama.addListener("position_changed", () => {
        if (this.originalPosition == null) {
          this.originalPosition = this.panorama.getPosition();
          this.goInsideShowing = true;
        } else {
          const p2 = this.panorama.getPosition();
          const dist = this.getDistance(p2, this.originalPosition);
          console.log(dist);
          if (Math.abs(dist < 3)) {
            this.goInsideShowing = true;
          } else {
            this.goInsideShowing = false;
          }
        }
      });
    },
    goInsideClicked() {
      this.mapShowing = false;
      this.goInsideShowing = false;
    },
  },
  mounted() {
    this.imagesOrder = shuffleArray(this.imagesOrder);

    if (!this.$device.isDesktop) {
      this.rowColumnOrder = shuffleArray(this.rowColumnOrder);
      this.imageAddingInterval = setInterval(() => {
        if (this.currentImageIndex >= this.imagesOrder.length) {
          clearInterval(this.imageAddingInterval);
        } else {
          this.addImage(
            this.rowColumnOrder[this.currentImageIndex][0],
            this.rowColumnOrder[this.currentImageIndex][1]
          );
        }
      }, 1000);
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  background-color: var(--color-white);
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;

  &__go-outside-btn,
  &__go-inside-btn {
    p {
      text-align: center;
    }

    &:hover {
      cursor: pointer;
      mix-blend-mode: normal;

      p {
        color: red;
      }
    }
  }

  &__go-outside-btn,
  &__go-inside-btn,
  &__opening-door-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    mix-blend-mode: difference;

    p {
      margin: 0 0;
      font-size: 70px;
      line-height: 70px;
      color: var(--color-white);
      white-space: nowrap;

      @include tablet {
        font-size: 100px;
        line-height: 100px;
      }

      @include desktop {
        font-size: 150px;
        line-height: 150px;
      }
    }
  }

  &__opening-door-text {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      text-align: left;
      width: 410px;

      @include tablet {
        width: 600px;
      }

      @include desktop {
        width: 900px;
      }
    }
  }

  &__go-outside-btn {
    visibility: hidden;
    &.visible {
      visibility: visible;
    }
  }

  &__go-inside-btn {
    z-index: 50;
  }

  &__peggy-img {
    pointer-events: none;
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);

    height: 50%;
    width: auto;
    max-width: 90%;
    transition: all 1s;

    &.front {
      z-index: 50;
      top: 100%;
      transform: translate3d(-36%, 3%, 0) scale(2);

      @include tablet {
        transform: translate3d(-50%, 29%, 0) scale(3);
      }
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

      // pointer-events: none;
      // user-select: none;

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

  &__shameless-plug {
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-size: 16px;

    @include tablet {
      font-size: 20px;
      bottom: 10px;
      right: 10px;
    }

    a {
      color: var(--color-black);
      text-decoration-thickness: 1px;

      &:hover {
        color: red;
      }
    }
  }
}
</style>
