<script lang="ts" setup>
import {
  defineProps, defineEmits, ref, watch,
} from 'vue';
import { isValidStringInput, roundStringInput } from '../lib/utils';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  onChange: {
    type: Function,
    required: false,
    default: () => {},
  },
  decimals: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputAmount = ref(props.modelValue);

watch(() => props.modelValue, (next) => {
  inputAmount.value = next;
});
watch(inputAmount, (next, prev) => {
  if (isValidStringInput(next) || next === '') {
    inputAmount.value = roundStringInput(next, props.decimals);
    emit('update:modelValue', inputAmount.value);
  } else {
    inputAmount.value = prev;
    emit('update:modelValue', inputAmount.value);
  }
});
</script>
<template>
  <input
    v-model="inputAmount"
    type="text"
    autocomplete="off"
    placeholder="0.0"
    @change="props.onChange"
    @focus="($event.target as HTMLInputElement).select()"
  >
</template>
