<template>
  <div class="p-4">
    <ReorderContainer
      :items="items"
      :shuffledItems="shuffledItems"
      statement="Drag the boxes up or down to form a program that
       displays teh sum of nubmers from 1 to 100."
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
      shuffledItems: ['Pasta', 'Bread', 'Seafood', 'Cake', 'Salad', 'Pizza'],
      items: ['Pizza', 'Pasta', 'Cake', 'Salad', 'Seafood', 'Bread'],
    };
  },
};
</script>
