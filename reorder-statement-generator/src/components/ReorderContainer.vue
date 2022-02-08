<template>
  <div>
    <div class="border border-yellow-200">
      <div class="bg-blue-500 text-white font-bold px-2 py-0.5">Order Statement Exercise</div>
      <div class="text-center space-y-6 py-4 max-w-3xl mx-auto">
        <p>
          {{ statement }}
        </p>
        <div class="space-y-2 bg-blue-50 p-4 rounded">
          <ul class="text-left mx-auto" v-for="(item, i) in reorderedItems" :key="i">
            <li
              draggable="true"
              :ref="`li${i}`"
              @dragstart="(e) => onDragStart(e, i)"
              @dragover="(e) => onDragOver(e, i)"
              @dragend="onDragEnd()"
              :style="{ marginLeft: marginLeftFromTabLevel(reorderedTabs[i]) }"
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
    tabs: [],
    shuffledTabs: [],
  },
  data() {
    return {
      correct: false,
      showAnswerModal: false,
      showCorrectModal: false,
      reorderedItems: [],
      reorderedTabs: [],
      dragIndex: 0,
      dragText: '',
      dragStartX: 0,
      dragStartTab: 0,
    };
  },
  created() {
    this.reorderedItems = [...this.shuffledItems];
    this.reorderedTabs = [...this.shuffledTabs];
  },
  methods: {
    marginLeftFromTabLevel(tab) {
      return `${tab * 40}px`;
    },
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
        this.dragStartX = e.clientX;
        this.dragStartTab = this.reorderedTabs[i];
      }
    },
    onDragOver(e, i) {
      if (!this.correct) {
        // Reorder texts.
        const temp = [...this.reorderedItems];
        temp.splice(this.dragIndex, 1);
        temp.splice(i, 0, this.reorderedItems[this.dragIndex]);
        this.reorderedItems = temp;
        // Reorder tabs.
        const temp2 = [...this.reorderedTabs];
        temp2.splice(this.dragIndex, 1);
        temp2.splice(i, 0, this.reorderedTabs[this.dragIndex]);
        this.reorderedTabs = temp2;
        // Update current tab width based on dx.
        const dx = e.clientX - this.dragStartX;
        this.reorderedTabs[i] = Math.max(0, this.dragStartTab + (dx - (dx % 40)) / 40);
        // Clear dragged-over class from all list items and set dragged-over class
        // to the dragged over list item.
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
