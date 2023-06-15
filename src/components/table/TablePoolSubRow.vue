<script setup lang="ts">
import {MsgStoreCode} from 'secretjs';
import {getClient} from '../../lib/wallet';
import IconHorizontalDownArrow from '../svgs/IconHorizontalDownArrow.vue';

</script>
<template>
  <div class="sub-row-container">
    <div class="actions-and-stats">
      <div class="actions">
        <button class="action-button">
          Unbond
        </button>
        <button class="action-button">
          Withdraw
        </button>
      </div>
      <div class="card">
        <div class="stats-row">
          <div class="card stats-section">
            <p>Deposits</p>
            <p>-</p>
          </div>
          <div class="card stats-section">
            <p>User Winnings</p>
            <p>-</p>
          </div>
        </div>
        <div class="stats-row">
          <div class="card stats-section">
            <p>User Unbondings</p>
            <p>-</p>
          </div>
          <div class="card stats-section">
            <p>Cumulative Winnings</p>
            <p>-</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card sponsor-banner">
      <p> SPONSOR </p>
    </div>
    <div class="card pool-stats">
      <p> Pool Statistics </p>
      <div class="card circle-clicker">
        <IconHorizontalDownArrow/>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sub-row-container {
  margin: 25px, 16px;

  .actions-and-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    align-items: center;

    .actions {
      width: 40%;
      padding-right: 20px;

      .action-button {
        width: 100%;

        &:last-child{
          margin-top: 12px;
        }
      }
    }

    .card {
      width: 60%;

      .stats-row{
        display: flex;
        padding: 12px;

        &:last-child{
          padding-top: 0;
        }
        
        .stats-section {
          width: 50%;
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
          margin-right: 12px;

          p {
            color: #fff;
          }

          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
  }
  .sponsor-banner {
    width: 100%;
    display: flex;
    justify-content: center;

    p {
      color: #fff;
    }
  }
  .pool-stats {
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    margin-top: 12px;
    padding: 0 12px;

    p {
      color: #fff;
    }
    .circle-clicker{
      border-radius: 50px;
      padding: 5px;

      svg {
        fill: #fff;
        width: 7px;
      }
    }
  }
}
</style>

