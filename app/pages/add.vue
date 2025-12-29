<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';

useSeoMeta({
  title: 'Contribute to the frameworks list',
});

const state = reactive({
  frameworkName: undefined,
  programmingLanguage: undefined,
  githubUrl: undefined,
  githubStarsCount: undefined,
});

type Schema = typeof state;

function validate(state: Partial<Schema>): FormError[] {
  const errors = [];
  if (!state.frameworkName) errors.push({ name: 'name', message: 'Required' });
  if (!state.programmingLanguage)
    errors.push({ name: 'language', message: 'Required' });
  if (!state.githubUrl) errors.push({ name: 'url', message: 'Required' });
  if (!state.githubStarsCount)
    errors.push({ name: 'stars', message: 'Required' });
  return errors;
}

const loading = ref(false);
const toast = useToast();

async function addNewFramework(data) {
  console.log(data);
  const {
    frameworkName: name,
    programmingLanguage: language,
    githubUrl: url,
    githubStarsCount: stars,
  } = data;

  try {
    await $fetch('/api/frameworks', {
      method: 'post',
      body: { name, language, url, stars },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  await addNewFramework(event.data);
  loading.value = false;

  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success',
  });
}
</script>

<template>
  <UPage>
    <UPageHeader title="Add a New Framework" />

    <UPageBody>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Framework Name" name="name" required>
          <UInput v-model="state.frameworkName" size="xl" class="w-full" />
        </UFormField>

        <UFormField label="Programming Language" name="language" required>
          <UInput
            v-model="state.programmingLanguage"
            size="xl"
            class="w-full"
          />
        </UFormField>

        <UFormField label="GitHub URL" name="url" required>
          <UInput v-model="state.githubUrl" size="xl" class="w-full" />
        </UFormField>

        <UFormField label="GitHub Stars Count" name="stars" required>
          <UInput v-model="state.githubStarsCount" size="xl" class="w-full" />
        </UFormField>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </UPageBody>
  </UPage>
</template>
