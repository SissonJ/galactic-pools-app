<script setup lang="ts">
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import BigNumber from 'bignumber.js';
import {storeToRefs} from 'pinia';
import {usePools} from '../../stores/poolStore';

const props = defineProps({
  data: {
    type: String,
    required: true,
  }
});

const pools = storeToRefs(usePools());

const remainingMS = ref(new BigNumber(pools.pools.value[props.data]?.remainingCountdownMS ?? 0));

const msInDay = new BigNumber(1000 * 60 * 60 * 24);
const msInHour = new BigNumber(1000 * 60 * 60);
const msInMin = new BigNumber(1000 * 60);
const msInSec = new BigNumber(1000);

const formatTime = (unit: string) => {
  let formatted = unit;
  if(formatted.includes('.')) {
    formatted = Math.floor(Number(formatted)).toString();
  }
  if(formatted.length < 2) {
    formatted = `0${formatted}`;
  }
  return formatted;
};

const days = computed(() => {
  if(remainingMS.value.lt(msInDay)) {
    return '00';
  }
  const res = remainingMS.value.div(msInDay).toString();
  return formatTime(res);
});

const hours = computed(() => {
  const noDays = remainingMS.value.mod(msInDay);
  if(noDays.lt(msInHour)) {
    return '00';
  }
  const res = noDays.div(msInHour).toString();
  return formatTime(res);
});

const mins = computed(() => {
  const noHours = remainingMS.value.mod(msInHour);
  if(noHours.lt(msInMin)) {
    return '00';
  }
  const res = noHours.div(msInMin).toString();
  return formatTime(res);
});

const seconds = computed(() => {
  const noMins = remainingMS.value.mod(msInMin);
  if(noMins.lt(msInSec)) {
    return '00';
  }
  const res = noMins.div(msInSec).toString();
  return formatTime(res);
});

watch(() => pools.pools.value[props.data], (nextMs) => {
  remainingMS.value = new BigNumber(nextMs.remainingCountdownMS ?? 0);
})

onMounted(() => {
  setInterval(() => remainingMS.value = remainingMS.value.minus(new BigNumber(1000)), 1000)
});
</script>
<template>
  <div class="countdown">
    <div class="cell-pool">
      <div class="time-number">
        <h2> {{ days[0] }} </h2>
      </div>
      <div class="time-number">
        <h2> {{ days[1] }} </h2>
      </div>
      <h2>:</h2>
      <div class="time-number">
        <h2> {{ hours[0] }} </h2>
      </div>
      <div class="time-number">
        <h2> {{ hours[1] }} </h2>
      </div>
      <h2>:</h2>
      <div class="time-number">
        <h2> {{ mins[0] }} </h2>
      </div>
      <div class="time-number">
        <h2> {{ mins[1] }} </h2>
      </div>
      <h2>:</h2>
      <div class="time-number">
        <h2> {{ seconds[0] }} </h2>
      </div>
      <div class="time-number">
        <h2> {{ seconds[1] }} </h2>
      </div>
    </div>
    <div class="time-words"> 
      <h3> DAY </h3>
      <h3> HR </h3>
      <h3> MIN </h3>
      <h3> SEC </h3>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.countdown {
  margin-bottom: -25px;

  .cell-pool {
    display: flex;
    align-items: baseline;
    justify-content: left;

    .time-number {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      border-radius: 4px;
      padding: 3px 6px;
      margin: 0 2px;
      width: 10px;
    }
  }
  .time-words {
    display:flex;
    justify-content: space-around;
    margin-right: 80px;

    h3 {
      margin: 5px 0;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-size: 11px;
      line-height: 11px;
      text-align: right;
      color: #FFFFFF;
      opacity: 0.25;
    }
  }
}
</style>
