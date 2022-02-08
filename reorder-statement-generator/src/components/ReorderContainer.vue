<template>
  <div>
    <div class="border border-yellow-200">
      <div class="bg-blue-500 text-white font-bold px-2 py-0.5">Order Statement Exercise</div>
      <div class="text-center space-y-6 py-4 max-w-sm mx-auto">
        <p>
          {{ statement }}
        </p>
        <div class="space-y-2 bg-blue-50 p-4 rounded">
          <ul class="text-left mx-auto" v-for="(item, i) in reorderedItems" :key="i">
            <li
              draggable="true"
              :ref="`li${i}`"
              @dragstart="(e) => onDragStart(e, i)"
              @dragover="onDragOver(i)"
              @dragend="onDragEnd()"
            >
              {{ item.replace(/ /g, '&nbsp;') }}
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
    <Modal
      title="Correct Order"
      :open="showAnswerModal"
      @closed="showAnswerModal = false"
      :body="items.join('\n')"
    />
    <Modal
      title="Congratulations"
      :open="showCorrectModal"
      @closed="showCorrectModal = false"
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
      correct: false,
      showAnswerModal: false,
      showCorrectModal: false,
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
      this.showAnswerModal = true;
    },
    reset() {
      this.correct = false;
      for (let x = 0; x < this.items.length; x += 1) {
        this.$refs[`li${x}`].classList.remove('correct');
      }
      this.reorderedItems = [...this.shuffledItems];
    },
    isCorrect() {
      return this.reorderedItems.every((item, i) => item === this.items[i]);
    },
    onDragStart(e, i) {
      if (!this.correct) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode);
        this.dragIndex = i;
        this.dragText = this.reorderedItems[i];
      }
    },
    onDragOver(i) {
      if (!this.correct) {
        const temp = [...this.reorderedItems];
        temp.splice(this.dragIndex, 1);
        temp.splice(i, 0, this.reorderedItems[this.dragIndex]);
        this.reorderedItems = temp;
        for (let x = 0; x < this.items.length; x += 1) {
          this.$refs[`li${x}`].classList.remove('dragged-over');
        }
        this.$refs[`li${this.dragIndex}`].innerText = this.dragText;
        this.$refs[`li${this.dragIndex}`].classList.add('dragged-over');
        this.dragIndex = i;
      }
    },
    onDragEnd() {
      if (!this.correct) {
        this.$refs[`li${this.dragIndex}`].innerHTML = this.dragText.replace(/ /g, '&nbsp;');
        this.$refs[`li${this.dragIndex}`].classList.remove('dragged-over');
        if (this.isCorrect()) {
          this.correct = true;
          for (let x = 0; x < this.items.length; x += 1) {
            this.$refs[`li${x}`].classList.add('correct');
          }
          this.showCorrectModal = true;
        }
        this.dragIndex = -1;
        this.dragText = null;
      }
    },
  },
};
</script>

<style scoped>
li {
  font-family: 'Courier New', Courier, monospace;
}

li:not(.correct) {
  @apply bg-white border border-gray-300 p-2 cursor-pointer rounded;
}

li.dragged-over {
  @apply border-2 border-dashed border-blue-500;
}
</style>
