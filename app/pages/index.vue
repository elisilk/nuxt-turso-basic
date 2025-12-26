<script setup lang="ts">
import type { Framework } from '~/types';

const {
  status,
  data: frameworks,
  refresh,
} = await useLazyFetch<Framework[]>('/api/frameworks');

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

    <div v-if="status === 'pending'">Loading ...</div>
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y-2 divide-gray-200 text-sm">
        <caption class="py-2">
          The list of top web frameworks
        </caption>
        <thead>
          <tr>
            <th class="whitespace-nowrap px-4 py-2 text-left">Name</th>
            <th class="whitespace-nowrap px-4 py-2 text-left">Language</th>
            <th class="whitespace-nowrap px-4 py-2 text-left">GitHub Stars</th>
            <th class="whitespace-nowrap px-4 py-2 text-left">Repo</th>
            <th class="whitespace-nowrap px-4 py-2 text-left">Delete</th>
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
              <div class="flex items-center gap-1">
                {{ formatNumber(framework.stars) }}
                <Icon name="lucide:star" class="block" />
              </div>
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              <a
                :href="framework.url"
                title="GitHub link"
                target="_blank"
                class="inline-flex p-2 rounded-md hover:bg-gray-100"
                ><Icon name="lucide:github"
              /></a>
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              <button
                class="inline-flex p-2 rounded-md hover:bg-gray-100"
                title="delete this item"
                @click="handleFrameworkDelete(framework.id)"
              >
                <Icon name="lucide:trash-2" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
