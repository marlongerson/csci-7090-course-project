<template>
  <div>
    <div :class="{ hidden: previewing }">
      <div class="bg-gray-100 border-b border-gray-200 shadow-sm py-4">
        <div class="max-w-5xl mx-auto text-xl px-4 text-center">Reorder Statement Generator</div>
      </div>
      <div class="max-w-5xl mx-auto mt-6 px-4">
        <form @submit="(e) => e.preventDefault()">
          <div class="space-y-2">
            <label class="block">Question Statement</label>
            <input class="border border-gray-300 w-full rounded p-2" ref="questionStatementInput"/>
            <label class="block">Code</label>
            <textarea
              ref="codeTextArea"
              class="border border-gray-300 w-full rounded p-2 font-mono"
              style="height: 200px"
              @input="reorder()"
            />
            <label class="block">Reordered</label>
            <textarea
              ref="reorderTextArea"
              class="border border-gray-300 w-full rounded p-2 font-mono"
              disabled
              style="height: 200px"
            />
            <div class="flex">
              <div class="space-x-2">
                <button
                  class="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded"
                  @click="reorder()"
                >
                  Reorder
                </button>
                <button
                  class="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded"
                  @click="preview()"
                >
                  Preview
                </button>
              </div>
              <button
                class="bg-blue-500 hover:bg-blue-600 ml-auto px-4 py-2 text-white rounded"
                @click="download()"
              >
                Download
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-if="previewing" class="space-y-4 p-4">
      <ReorderContainer
        :items="this.$refs.codeTextArea.value.split('\n')"
        :shuffledItems="this.$refs.reorderTextArea.value.split('\n')"
        :statement="this.$refs.questionStatementInput.value"
        :tabs="this.getTabLevels()"
      />
      <button
        @click="previewing = false"
        class="bg-gray-200 hover:bg-gray-300 ml-auto px-4 py-2 text-gray-800 rounded"
      >
        Back
      </button>
    </div>
  </div>
</template>

<script>
import ReorderContainer from './components/ReorderContainer.vue';
import generate from './app/generate';

export default {
  components: {
    ReorderContainer,
  },
  data() {
    return {
      previewing: false,
    };
  },
  methods: {
    getShuffledItems() {
      return this.$refs.reorderTextArea.value.split('\n');
    },
    getTabLevels() {
      const shuffledItems = this.getShuffledItems();
      const result = new Array(shuffledItems.length).fill(0);
      for (let i = 0; i < shuffledItems.length; i += 1) {
        result[i] = this.countLeadingSpaces(shuffledItems[i]) / 4;
      }
      return result;
    },
    countLeadingSpaces(s) {
      let result = 0;
      for (let i = 0; i < s.length; i += 1) {
        if (s[i] === ' ') {
          result += 1;
        } else {
          break;
        }
      }
      return result;
    },
    reorder() {
      const items = [...this.$refs.codeTextArea.value.split('\n')];
      let currentIndex = items.length;
      while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        const t = items[currentIndex];
        items[currentIndex] = items[randomIndex];
        items[randomIndex] = t;
      }
      this.$refs.reorderTextArea.value = items.join('\n');
    },
    preview() {
      this.previewing = true;
    },
    download() {
      const html = generate(
        [...this.$refs.codeTextArea.value.split('\n')],
        [...this.$refs.reorderTextArea.value.split('\n')],
        this.$refs.questionStatementInput.value,
      );
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(html)}`);
      element.setAttribute('download', 'output.html');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
  },
};
</script>
