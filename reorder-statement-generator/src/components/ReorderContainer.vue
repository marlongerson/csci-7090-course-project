<template>
  <div>
    <div class="border border-yellow-200">
      <div class="bg-blue-500 text-white font-bold px-2 py-0.5">Order Statement Exercise</div>
      <div class="text-center space-y-6 py-4 max-w-3xl mx-auto">
        <p>
          {{ statement }}
        </p>
        <div class="relative bg-blue-50 p-4 rounded">
          <template v-if="!this.correct">
            <div class="absolute bottom-0 top-0 border-gray-300 border-l" />
            <div class="absolute bottom-0 top-0 left-indent-1 border-gray-300 border-l" />
            <div class="absolute bottom-0 top-0 left-indent-2 border-gray-300 border-l" />
            <div class="absolute bottom-0 top-0 left-indent-3 border-gray-300 border-l" />
            <div class="absolute bottom-0 top-0 left-indent-4 border-gray-300 border-l" />
            <div class="absolute bottom-0 top-0 left-indent-5 border-gray-300 border-l" />
          </template>
          <div class="relative space-y-2">
            <ul class="text-left mx-auto" v-for="(item, i) in reorderedItems" :key="i">
              <li
                draggable="true"
                :ref="`li${i}`"
                @dragstart="(e) => onDragStart(e, i)"
                @dragover="(e) => onDragOver(e, i)"
                @dragend="onDragEnd()"
                :style="{ marginLeft: marginLeftFromTabLevel(reorderedTabs[i]) }"
                v-html="item"
              ></li>
            </ul>
          </div>
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
      :body="createBody()"
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
    items: {
      type: Array,
    },
    shuffledItems: {
      type: Array,
    },
    tabs: {
      type: Array,
    },
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
    this.reorderedTabs = new Array(this.shuffledItems.length).fill(0);
  },
  methods: {
    createBody() {
      let body = '';
      for (let i = 0; i < this.items.length; i += 1) {
        for (let j = 0; j < this.tabs[i] * 4; j += 1) {
          body += '&nbsp;';
        }
        body += `${this.items[i]}\n`;
      }
      return body;
    },
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
      this.reorderedTabs = new Array(this.shuffledItems.length).fill(0);
    },
    isCorrect() {
      return (
        this.reorderedItems.every((item, i) => item === this.items[i]) && // eslint-disable-line
        this.reorderedTabs.every((tab, i) => tab === this.tabs[i])
      );
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
        this.reorderedTabs[i] = Math.min(5, this.reorderedTabs[i]);
        // Clear dragged-over class from all list items and set dragged-over class
        // to the dragged over list item.
        for (let x = 0; x < this.items.length; x += 1) {
          this.$refs[`li${x}`].classList.remove('dragged-over');
        }
        this.$refs[`li${this.dragIndex}`].innerHTML = this.dragText.trim();
        this.$refs[`li${this.dragIndex}`].classList.add('dragged-over');
        this.dragIndex = i;
      }
    },
    onDragEnd() {
      if (!this.correct) {
        this.$refs[`li${this.dragIndex}`].innerHTML = this.dragText.trim();
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
.left-indent-1 {
  left: 56px;
}

.highlighted {
  @apply border-l-2 border-blue-500;
}

.left-indent-2 {
  left: 96px;
}

.left-indent-3 {
  left: 136px;
}

.left-indent-4 {
  left: 176px;
}

.left-indent-5 {
  left: 216px;
}

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
