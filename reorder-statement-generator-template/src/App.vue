<template>
  <div class="p-4">
    <ReorderContainer
      :items="items"
      :shuffledItems="shuffledItems"
      :tabs="tabs"
      statement="Drag the boxes up or down to form a program that
       displays the sum of numbers from 1 to 100."
    />
  </div>
</template>

<script>
import ReorderContainer from './components/ReorderContainer.vue';

export default {
  name: 'App',
  components: {
    ReorderContainer,
  },
  data() {
    return {
      tabs: [1, 2, 3, 4, 3, 2],
      shuffledItems: ['Pasta', 'Bread', 'Seafood', 'Cake', 'Salad', 'Pizza'],
      items: ['Pizza', 'Pasta', 'Cake', 'Salad', 'Seafood', 'Bread'],
    };
  },
};
</script>
