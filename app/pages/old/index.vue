<script setup lang="ts">
import type { Framework } from '~/types';

const {
  status,
  data: frameworks,
  refresh,
} = await useLazyFetch<Framework[]>('/api/frameworks');

async function handleRowUpdated() {
  await refresh();
}

async function handleRowDeleted() {
  await refresh();
}
</script>

<template>
  <UPage>
    <UPageHeader title="Top Web Frameworks" />
    <UPageBody>
      <p>
        This is the older format, before switching to using
        <ULink to="https://ui.nuxt.com/" external target="_blank">Nuxt UI</ULink
        >.
      </p>

      <div v-if="status === 'pending'">Loading ...</div>
      <div
        v-else
        class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800"
      >
        <table
          class="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800 text-sm"
        >
          <caption class="py-2">
            The list of top web frameworks
          </caption>
          <thead>
            <tr>
              <th class="whitespace-nowrap px-4 py-2 text-left">Name</th>
              <th class="whitespace-nowrap px-4 py-2 text-left">Language</th>
              <th class="whitespace-nowrap px-4 py-2 text-left">
                GitHub Stars
              </th>
              <th class="whitespace-nowrap px-4 py-2 text-left">Repo</th>
              <th class="whitespace-nowrap px-4 py-2 text-left">Delete</th>
            </tr>
          </thead>

          <tbody
            v-if="frameworks"
            class="divide-y divide-gray-200 dark:divide-gray-800"
          >
            <TableRow
              v-for="(framework, key) of frameworks"
              :key="key"
              :framework="framework"
              @updated="handleRowUpdated"
              @deleted="handleRowDeleted"
            />
          </tbody>
        </table>
      </div>
    </UPageBody>
  </UPage>
</template>

<style scoped>
.editable {
  cursor: pointer;
}

.editable:hover .editable__edit-icon {
  opacity: 1;
}

.editable__edit-icon {
  width: 1rem;
  height: 1rem;
  opacity: 0;
  margin-left: 0.25rem;
  transition: opacity 0.2s;
}
</style>
