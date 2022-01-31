<template>
  <div class="border border-gray-300 rounded bg-blue-50">
    <table>
      <tbody>
        <tr v-for="i in maxLines" :key="i">
          <td v-for="j in maxIndentations" :key="j" class="border-r border-gray-300 w-10 h-10">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    maxIndentations: Number,
    maxLines: Number,
  },
};
</script>
