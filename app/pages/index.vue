<script setup lang="ts">
import { ConfirmModal } from '#components';

import type { Framework } from '~/types';
import type { TableColumn } from '@nuxt/ui';

const ULink = resolveComponent('ULink');
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const overlay = useOverlay();
const modal = overlay.create(ConfirmModal);

const {
  data: frameworks,
  pending,
  error,
} = await useLazyFetch<Framework[]>('/api/frameworks', {
  key: 'frameworks',
});

const refreshing = ref(false);
const toast = useToast();

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
    toast.add({
      title: 'Success',
      description: 'The framework was deleted.',
      color: 'success',
    });
    await handleRefresh();
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
  refreshing.value = true;
  try {
    await refreshNuxtData(['frameworks']);
  } finally {
    refreshing.value = false;
  }
}

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
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'GitHub Stars',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      });
    },
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right font-mono',
      },
    },
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

const sorting = ref([
  {
    id: 'stars',
    desc: true,
  },
]);
</script>

<template>
  <UPage>
    <UPageHeader title="Top Web Frameworks">
      <template #links>
        <UButton
          v-if="refreshing"
          icon="i-lucide-refresh-cw-off"
          size="md"
          color="neutral"
          variant="subtle"
          aria-label="Actively refreshing the frameworks data"
          disabled
        />
        <UButton
          v-else
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
      <pre v-if="error">{{ error }}</pre>
      <UTable
        v-else
        v-model:sorting="sorting"
        :data="frameworks"
        :columns
        :loading="pending"
      />
    </UPageBody>
  </UPage>
</template>
