<!--
  - /*
  -  *
  -  *
  -  *      Copyright 2020-2021 Luter.me
  -  *
  -  *      Licensed under the Apache License, Version 2.0 (the "License");
  -  *      you may not use this file except in compliance with the License.
  -  *      You may obtain a copy of the License at
  -  *
  -  *        http://www.apache.org/licenses/LICENSE-2.0
  -  *
  -  *      Unless required by applicable law or agreed to in writing, software
  -  *      distributed under the License is distributed on an "AS IS" BASIS,
  -  *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  *      See the License for the specific language governing permissions and
  -  *      limitations under the License.
  -  *
  -  *
  -  */
  -->

<template>
  <div
    :style="{ zIndex: zIndex, height: height, width: width }"
    class="thumb-item"
  >
    <div class="thumb-info">
      <div class="thumb-info-roles-container">
        <slot />
      </div>
    </div>
    <!-- eslint-disable-next-line -->
    <div :style="{backgroundImage: `url(${image})`}" class="thumb-thumb"></div>
  </div>
</template>

<script>
  export default {
    name: "PanThumb",
    props: {
      image: {
        type: String,
        required: true,
      },
      zIndex: {
        type: Number,
        default: 1,
      },
      width: {
        type: String,
        default: "150px",
      },
      height: {
        type: String,
        default: "150px",
      },
    },
  };
</script>

<style scoped>
  .thumb-item {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    cursor: default;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .thumb-info-roles-container {
    padding: 20px;
    text-align: center;
  }

  .thumb-thumb {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    transform-origin: 95% 40%;
    transition: all 0.3s ease-in-out;
  }

  .thumb-thumb:after {
    content: "";
    width: 8px;
    height: 8px;
    position: absolute;
    border-radius: 50%;
    top: 40%;
    left: 95%;
    margin: -4px 0 0 -4px;
    background: radial-gradient(
      ellipse at center,
      rgba(14, 14, 14, 1) 0%,
      rgba(125, 126, 125, 1) 100%
    );
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.9);
  }

  .thumb-info {
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: inset 0 0 0 5px rgba(0, 0, 0, 0.05);
  }

  .thumb-info h3 {
    color: #fff;
    text-transform: uppercase;
    position: relative;
    letter-spacing: 2px;
    font-size: 18px;
    margin: 0 60px;
    padding: 22px 0 0 0;
    height: 85px;
    font-family: "Open Sans", Arial, sans-serif;
    text-shadow: 0 0 1px #fff, 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .thumb-info p {
    color: #fff;
    padding: 10px 5px;
    font-style: italic;
    margin: 0 30px;
    font-size: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }

  .thumb-info p a {
    display: block;
    color: #333;
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    font-style: normal;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 1px;
    padding-top: 24px;
    margin: 7px auto 0;
    font-family: "Open Sans", Arial, sans-serif;
    opacity: 0;
    transition: transform 0.3s ease-in-out 0.2s, opacity 0.3s ease-in-out 0.2s,
      background 0.2s linear 0s;
    transform: translateX(60px) rotate(90deg);
  }

  .thumb-info p a:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .thumb-item:hover .thumb-thumb {
    transform: rotate(-110deg);
  }

  .thumb-item:hover .thumb-info p a {
    opacity: 1;
    transform: translateX(0px) rotate(0deg);
  }
</style>
