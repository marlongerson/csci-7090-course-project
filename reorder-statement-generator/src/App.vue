<template>
  <div>
    <div class="bg-gray-100 border-b border-gray-200 shadow-sm py-4">
      <div class="max-w-5xl mx-auto text-xl px-4 text-center">Reorder Statement Generator</div>
    </div>
    <div class="max-w-5xl mx-auto mt-6 px-4">
      <form @submit="(e) => e.preventDefault()">
        <div class="space-y-2">
          <label class="block">Code</label>
          <textarea class="border border-gray-300 w-full rounded" style="height: 200px" />
          <label class="block">Reordered</label>
          <textarea class="border border-gray-300 w-full rounded" disabled style="height: 200px" />
          <div class="flex">
            <div class="space-x-2">
              <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded">
                Reorder
              </button>
              <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded">
                Preview
              </button>
            </div>
            <button class="bg-blue-500 hover:bg-blue-600 ml-auto px-4 py-2 text-white rounded">
              Download
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
