<script setup lang="ts">
import type { Framework } from '~/types';

const props = defineProps<{
  framework: Framework;
}>();

const emit = defineEmits(['updated', 'deleted']);

const editedName = ref('');
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
  if (!editedName.value.trim()) return;
  if (editedName.value.trim() === props.framework.name) return;

  try {
    await $fetch(`/api/frameworks/${props.framework.id}`, {
      method: 'PUT',
      body: { newName: editedName.value.trim() },
    });
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
    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
      <div
        v-if="!isEditing"
        class="flex items-center gap-1 editable"
        @click="startEditing"
      >
        {{ framework.name }}
        <Icon name="lucide:pencil" class="block editable__edit-icon" />
      </div>
      <div v-else class="flex items-center gap-1 editable">
        <input
          v-model="editedName"
          type="text"
          autofocus
          @keyup.enter="handleRename"
          @keyup.esc="cancelEditing"
        />
        <Icon
          name="lucide:check"
          class="block editable__edit-icon"
          @click="handleRename"
        />
        <Icon
          name="lucide:x"
          class="block editable__edit-icon"
          @click="cancelEditing"
        />
      </div>
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
</template>
