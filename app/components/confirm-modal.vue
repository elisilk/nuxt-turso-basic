<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    title="Confirm Deletion"
    description="Are you sure you want to delete this item?"
  >
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Cancel"
          @click="emit('close', false)"
        />
        <UButton color="error" label="Delete" @click="emit('close', true)" />
      </div>
    </template>
  </UModal>
</template>
