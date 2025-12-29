<script setup lang="ts">
import type { Framework } from '~/types';
import type { TableColumn } from '@nuxt/ui';

const { status, data, refresh } = await useLazyFetch<Framework[]>(
  '/api/frameworks'
);

async function handleRefresh() {
  console.log('refreshing');
  await refresh();
}

// async function handleRowUpdated() {
//   await refresh();
// }

// async function handleRowDeleted() {
//   await refresh();
// }

const formatNumber = (val: number) =>
  new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(val);

const columns: TableColumn<Framework>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'language',
    header: 'Programming Language',
  },
  {
    accessorKey: 'stars',
    header: 'GitHub Stars',
    cell: ({ row }) => formatNumber(row.getValue('stars')),
  },
  {
    accessorKey: 'url',
    header: 'Repo',
  },
];
</script>

<template>
  <UPage>
    <UPageHeader title="Top Web Frameworks">
      <template #links>
        <UButton
          icon="i-lucide-refresh-ccw"
          size="md"
          color="neutral"
          variant="subtle"
          @click="handleRefresh"
        />
      </template>
    </UPageHeader>
    <UPageBody>
      <div v-if="status === 'pending'">Loading ...</div>
      <UTable v-else :data :columns class="flex-1" />
    </UPageBody>
  </UPage>
</template>
