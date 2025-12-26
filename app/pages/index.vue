<script setup lang="ts">
interface Framework {
  id: number;
  name: string;
  language: string;
  url: string;
  stars: number;
}

const { data: frameworks, refresh } = await useFetch<Framework[]>(
  '/api/frameworks'
);

const formatNumber = (val: number) =>
  new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(val);

async function handleFrameworkDelete(id: number) {
  console.log('delete framework:', id);

  try {
    await $fetch(`/api/frameworks/${id}`, {
      method: 'DELETE',
    });
    await refresh();
  } catch (error: unknown) {
    console.error('Framework deletion failed');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-center">Top Web Frameworks</h1>

    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y-2 divide-gray-200 text-sm">
        <caption class="py-2">
          The list of top web frameworks
        </caption>
        <thead>
          <tr>
            <th
              class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
            >
              Name
            </th>
            <th
              class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
            >
              Language
            </th>
            <th
              class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
            >
              GitHub Stars
            </th>
            <th
              class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
            >
              Repo
            </th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody v-if="frameworks" class="divide-y divide-gray-200">
          <tr v-for="(framework, key) of frameworks" :key="key">
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {{ framework.name }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ framework.language }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ formatNumber(framework.stars) }} ⭐️
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              <a
                :href="framework.url"
                title="GitHub link"
                target="_blank"
                class="p-1 text-center px-2 bg-blue-600 hover:bg-blue-700 text-white hover:text-white rounded-md"
                >Visit</a
              >
            </td>
            <td class="text-center">
              <button @click="handleFrameworkDelete(framework.id)">
                <Icon name="heroicons:trash" style="color: black" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
