<script lang="ts" setup>
import BigNumber from 'bignumber.js';
import {
  defineProps,
  defineEmits,
  computed,
} from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  isDisabled: {
    type: Boolean,
  },
  max: {
    type: String,
    default: '100',
  },
  min: {
    type: String,
    default: '0',
  },
  step: {
    type: String,
    default: '1',
  },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: { target: { value: string; }; }) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div
    class="range-container"
  >
    <div class="range-slider-container">
      <div class="range-track" />
      <div
        class="range-track track-highlight"
      />
      <input
        class="range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :disabled="isDisabled"
        :value="modelValue !== '' ? modelValue : 0"
        data-testid="range-input"
        @input="(updateValue as any)"
      >
    </div>
    <div class="percentage-display">
      <div class="percentage-and-pointer">
        <div class="line" />
        <p> 0% </p>
      </div>
      <div class="percentage-and-pointer">
        <div class="line" />
        <p> 25% </p>
      </div>
      <div class="percentage-and-pointer">
        <div class="line" />
        <p> 50% </p>
      </div>
      <div class="percentage-and-pointer">
        <div class="line" />
        <p> 75% </p>
      </div>
      <div class="percentage-and-pointer">
        <div class="line" />
        <p> 100% </p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.range-container {
  position: relative;
  height: 40px;

  .range-slider-container {
    position: relative;

    input[type="range"] {
      appearance: none;
      box-sizing: border-box;
      width: 100%;
      background: 0;
      cursor: pointer;
    }

    .range-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      background: linear-gradient(90deg, #944826 38.33%, #F2A44F 100%);
      border-radius: 25px;
      position: absolute;
      z-index: 0;
      pointer-events: none;
      top: 10px;
      left: 1px;

      &:disabled {
        background: #4d5362;
      }
    }

    .range {
      appearance: none;
      width: 100%;
      background: transparent;
      position: absolute;

      &:focus {
        outline: none;
      }

      &::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border: 1px solid #777e90;
        border-radius: 50%;
        background: #000;
        box-shadow: 0 0 4px 0 rgb(0 0 0 / 100%);
        cursor: pointer;
        margin-top: 4px;
      }

      &::-moz-range-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border: 1px solid #fff;
        border-radius: 50%;
        background: #000;
        box-shadow: 0 0 4px 0 rgb(0 0 0 / 100%);
        cursor: pointer;
        margin-top: 2px;
      }
    }
  }

  .percentage-display {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 30px;

    .percentage-and-pointer {
      display: flex;
      flex-direction: column;
      align-items: center;

      .line {
        background: rgba(255, 255, 255, 0.1);
        height: 11px;
        width: 2px;
      }

      p {
        font-size:10px;
        margin: 5px
      }
    }
  }
}
</style>

