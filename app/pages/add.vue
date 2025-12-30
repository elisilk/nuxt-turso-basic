<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';
import type { Framework } from '~/types';
type NewFramework = Omit<Framework, 'id'>;

useSeoMeta({
  title: 'Contribute to the frameworks list',
});

const formRef = ref();

const getFormInitialState = () => ({
  name: undefined,
  language: undefined,
  url: undefined,
  stars: undefined,
});

const formState: NewFramework = reactive(getFormInitialState());

type Schema = typeof formState;

function validate(formState: Partial<Schema>): FormError[] {
  const errors = [];
  if (!formState.name) errors.push({ name: 'name', message: 'Required' });
  if (!formState.language)
    errors.push({ name: 'language', message: 'Required' });
  if (!formState.url) errors.push({ name: 'url', message: 'Required' });
  if (!formState.stars) errors.push({ name: 'stars', message: 'Required' });
  return errors;
}

const loading = ref(false);
const toast = useToast();

async function submitForm(event: FormSubmitEvent<Schema>) {
  const { name, language, url, stars } = event.data;
  loading.value = true;
  try {
    await $fetch('/api/frameworks', {
      method: 'POST',
      body: { name, language, url, stars },
    });
    toast.add({
      title: 'Success',
      description: 'The new framework was added.',
      color: 'success',
    });
    await navigateTo('/');
  } catch (error) {
    console.error(error);
    toast.add({
      title: 'Error',
      description: 'Something went wrong.',
      color: 'error',
    });
  }

  loading.value = false;
}

function resetForm() {
  formRef.value.clear();
  Object.assign(formState, getFormInitialState());
}
</script>

<template>
  <UPage>
    <UPageHeader title="Add a New Framework" />

    <UPageBody>
      <UForm
        ref="formRef"
        :validate="validate"
        :state="formState"
        class="space-y-4"
        @submit="submitForm"
        @reset="resetForm"
      >
        <UFormField label="Framework Name" name="name" required>
          <UInput v-model="formState.name" size="xl" class="w-full" />
        </UFormField>

        <UFormField label="Programming Language" name="language" required>
          <UInput v-model="formState.language" size="xl" class="w-full" />
        </UFormField>

        <UFormField label="GitHub URL" name="url" required>
          <UInput v-model="formState.url" size="xl" class="w-full" />
        </UFormField>

        <UFormField label="GitHub Stars Count" name="stars" required>
          <UInput v-model="formState.stars" size="xl" class="w-full" />
        </UFormField>

        <div class="flex gap-2">
          <UButton type="submit"> Submit </UButton>
          <UButton type="reset" color="neutral" variant="subtle">
            Reset
          </UButton>
        </div>
      </UForm>
    </UPageBody>
  </UPage>
</template>
