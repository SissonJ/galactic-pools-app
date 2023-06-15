<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';
import IconCross from '../svgs/IconCross.vue';

defineEmits(['close']);

defineProps({
  noClose: {
    type: Boolean,
    default: false,
    required: false,
  },
  title: {
    type: String,
    required: true,
    default: 'Galatic Pools'
  }
});

</script>

<template>
  <Teleport to="body">
    <div
      class="modal-backdrop"
      v-bind="$attrs"
    >
      <div>
        <h2> {{ title }} </h2>
        <div class="modal card-with-border">
          <div
            v-if="!noClose"
            class="btn-close"
            @click="$emit('close')"
          >
            <IconCross class="icon-gray-selectable" />
          </div>
          <slot name="header" />
          <slot name="body" />
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(0 0 0 / 80%);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    margin-bottom: 24px;
    font-size: 18px;
  }

  .modal {
    position: relative;
    min-width: 500px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #eee;
    color: #fff;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eee;
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 10px;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 18px;
    cursor: pointer;
  }
</style>
