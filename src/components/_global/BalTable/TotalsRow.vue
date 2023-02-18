<script setup lang="ts">
import { tail } from 'lodash';

import { ColumnDefinition, Sticky } from './BalTable.vue';

type Props = {
  isColumnStuck?: boolean;
  onRowClick: (data: any) => void;
  sticky?: Sticky;
  columns: ColumnDefinition<any>[];
};

const props = defineProps<Props>();

/** FUNCTIONS */
// Need a method for horizontal stickiness as we need to
// check whether the table item belongs in the first column
function getHorizontalStickyClass(index: number) {
  if (index !== 0) return '';
  if (props.sticky === 'horizontal' || props.sticky === 'both') {
    return 'horizontalSticky';
  }
  return '';
}
</script>

<template>
  <tbody>
    <tr :class="['row-bg group z-10 bg-white', { 'cursor-pointer': onRowClick }]">
      <td :class="[getHorizontalStickyClass(0), isColumnStuck ? 'isSticky' : '', 'border-t bg-white p-6 text-left align-top dark:border-gray-900 dark:bg-gray-850']">
        <span class="text-left font-semibold"> Total </span>
      </td>
      <td
        v-for="(column, columnIndex) in tail(columns)"
        :key="column.id"
        :class="[
          column.align === 'right' ? 'text-left' : 'text-right',
          getHorizontalStickyClass(columnIndex + 1),
          isColumnStuck ? 'isSticky' : '',
          'border-t bg-white p-6 dark:border-gray-900 dark:bg-gray-850',
        ]"
      >
        <slot v-if="column.totalsCell" :name="column.totalsCell" />
      </td>
    </tr>
  </tbody>
</template>
