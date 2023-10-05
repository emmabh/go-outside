<template>
  <div class="content">
    <img class="content__pegman-img" src="~/assets/img/pegman.png" />
    <div class="content__go-outside-btn">
      <p>GO OUTSIDE</p>
      <p>GO OUTSIDE</p>
      <p>GO OUTSIDE</p>
    </div>
  </div>
</template>

<script>
import { listenCb } from "~/assets/js/utils";
export default {
  data: () => {
    return {
      unlisten: [],
    };
  },
  mounted() {
    this.unlisten
      .push
      // listenCb(document)
      ();
  },
  beforeDestroy() {
    this.unlisten.array.forEach((cb) => {
      cb();
    });
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
  }
}
</style>
