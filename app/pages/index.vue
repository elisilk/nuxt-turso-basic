<script setup lang="ts">
import { ConfirmModal } from '#components';

import type { Framework } from '~/types';
import type { TableColumn } from '@nuxt/ui';

const ULink = resolveComponent('ULink');
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const overlay = useOverlay();
const modal = overlay.create(ConfirmModal);

const { status, data, refresh } = await useLazyFetch<Framework[]>(
  '/api/frameworks'
);

async function handleItemDelete(id: number) {
  // confirm the deletion request
  const modalInstance = modal.open();
  const confirmDelete = await modalInstance.result;
  if (!confirmDelete) return;

  // make the api deletion request
  try {
    await $fetch(`/api/frameworks/${id}`, {
      method: 'DELETE',
    });
    console.log(`Framework ${id} successfully deleted`);
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

async function handleItemEdit(id: number) {
  await navigateTo(`/edit/${id}`);
}

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
    header: 'Framework',
    cell: ({ row }) =>
      h(ULink, { to: row.original.url }, () => row.getValue('name')),
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
    id: 'actions',
    cell: ({ row }) => {
      const items = [
        {
          label: 'Edit',
          icon: 'i-lucide-edit',
          onSelect() {
            handleItemEdit(row.original.id);
          },
        },
        {
          label: 'Delete',
          icon: 'i-lucide-trash',
          color: 'error',
          onSelect() {
            handleItemDelete(row.original.id);
          },
        },
      ];

      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items,
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown',
            })
        )
      );
    },
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
          aria-label="Refresh frameworks data"
          @click="handleRefresh"
        />
        <UButton
          icon="i-lucide-plus"
          size="md"
          color="neutral"
          variant="subtle"
          aria-label="Add a new framework"
          @click="navigateTo('/add')"
        />
      </template>
    </UPageHeader>
    <UPageBody>
      <div v-if="status === 'pending'">Loading ...</div>
      <UTable v-else :data :columns class="flex-1" />
    </UPageBody>
  </UPage>
</template>
