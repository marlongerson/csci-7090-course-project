<template>
  <div class="p-4 w-100">
    <div class="border border-yellow-200">
      <div class="bg-blue-500 text-white font-bold px-2 py-0.5">Order Statement Exercise</div>
      <div class="text-center space-y-6 py-4 max-w-sm mx-auto">
        <p>
          {{ statement }}
        </p>
        <div class="space-y-2">
          <ul class="text-left mx-auto" v-for="(item, i) in reorderedItems" :key="i">
            <li
              class="border border-green-600 px-2 cursor-pointer"
              draggable="true"
              :ref="`li${i}`"
              @dragstart="(e) => onDragStart(e, i)"
              @dragover="onDragOver(i)"
              @dragend="onDragEnd()"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="space-x-2">
          <button class="bg-blue-500 px-4 py-1 rounded text-white" @click="showAnswer()">
            Show Answer
          </button>
          <button class="bg-blue-500 px-4 py-1 rounded text-white" @click="reset()">Reset</button>
        </div>
      </div>
    </div>
    <Modal title="Correct Order" :open="open" @closed="open = false" :body="items.join('\n')" />
    <Modal
      title="Congratulations"
      :open="correct"
      @closed="correct = false"
      body="You are correct!"
    />
  </div>
</template>

<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  props: {
    statement: {
      type: String,
    },
    items: [],
    shuffledItems: [],
  },
  data() {
    return {
      open: false,
      correct: false,
      reorderedItems: [],
      dragIndex: 0,
      dragText: '',
    };
  },
  created() {
    this.reorderedItems = [...this.shuffledItems];
  },
  methods: {
    showAnswer() {
      this.open = true;
    },
    reset() {
      this.reorderedItems = [...this.shuffledItems];
    },
    isCorrect() {
      return this.reorderedItems.every((item, i) => item === this.items[i]);
    },
    onDragStart(e, i) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.parentNode);
      this.dragIndex = i;
      this.dragText = this.reorderedItems[i];
    },
    onDragOver(i) {
      const temp = [...this.reorderedItems];
      temp.splice(this.dragIndex, 1);
      temp.splice(i, 0, this.reorderedItems[this.dragIndex]);
      this.reorderedItems = temp;
      for (let x = 0; x < this.items.length; x += 1) {
        this.$refs[`li${x}`].classList.add('border');
        this.$refs[`li${x}`].classList.add('border-green-600');
      }
      this.$refs[`li${this.dragIndex}`].innerHTML = '&nbsp;';
      this.$refs[`li${this.dragIndex}`].classList.remove('border');
      this.$refs[`li${this.dragIndex}`].classList.remove('border-green-600');
      this.dragIndex = i;
    },
    onDragEnd() {
      this.$refs[`li${this.dragIndex}`].innerText = this.dragText;
      this.$refs[`li${this.dragIndex}`].classList.add('border');
      this.$refs[`li${this.dragIndex}`].classList.add('border-green-600');
      if (this.isCorrect()) {
        this.correct = true;
      }
      this.dragIndex = -1;
      this.dragText = null;
    },
  },
};
</script>
