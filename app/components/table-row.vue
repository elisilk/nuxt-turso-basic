<script setup lang="ts">
import type { Framework } from '~/types';

const props = defineProps<{
  framework: Framework;
}>();

const emit = defineEmits(['updated', 'deleted']);

const editedName = ref<string | undefined>('');
const isEditing = ref(false);

function startEditing() {
  editedName.value = props.framework.name;
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
  editedName.value = '';
}

async function handleRename() {
  if (!editedName.value || !editedName.value.trim()) return;
  if (editedName.value.trim() === props.framework.name) return;

  try {
    // await $fetch(`/api/frameworks/${props.framework.id}`, {
    //   method: 'PUT',
    //   body: { newName: editedName.value.trim() },
    // });
    isEditing.value = false;
    editedName.value = '';
    emit('updated');
  } catch (error: unknown) {
    console.error('Framework rename failed');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}

const formatNumber = (val: number) =>
  new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(val);

async function handleFrameworkDelete(id: number) {
  try {
    await $fetch(`/api/frameworks/${id}`, {
      method: 'DELETE',
    });
    emit('deleted');
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
  <tr>
    <td
      class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-100"
    >
      <div
        v-if="!isEditing"
        class="flex items-center gap-1 editable"
        @click="startEditing"
      >
        {{ framework.name }}
        <Icon name="i-lucide-pencil" class="block editable__edit-icon" />
      </div>
      <div v-else class="flex items-center gap-1 editable">
        <UInput
          v-model="editedName"
          type="text"
          autofocus
          @keyup.enter="handleRename"
          @keyup.esc="cancelEditing"
        />
        <Icon
          name="i-lucide-check"
          class="block editable__edit-icon"
          @click="handleRename"
        />
        <Icon
          name="i-lucide-x"
          class="block editable__edit-icon"
          @click="cancelEditing"
        />
      </div>
    </td>
    <td class="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">
      {{ framework.language }}
    </td>
    <td class="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">
      <div class="flex items-center gap-1">
        {{ framework.stars ? formatNumber(framework.stars) : 'undefined' }}
        <Icon name="i-lucide-star" class="block" />
      </div>
    </td>
    <td class="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">
      <a
        :href="framework.url"
        title="GitHub link"
        target="_blank"
        class="inline-flex p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        ><Icon name="i-lucide-github"
      /></a>
    </td>
    <td class="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">
      <button
        class="inline-flex p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        title="delete this item"
        @click="handleFrameworkDelete(framework.id)"
      >
        <Icon name="i-lucide-trash-2" />
      </button>
    </td>
  </tr>
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
