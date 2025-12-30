<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';
import type { Framework } from '~/types';
type NewFramework = Omit<Framework, 'id'>;

useSeoMeta({
  title: 'Edit a framework',
});

const route = useRoute();
const frameworkId = route.params.id;

const { status, data, error } = await useLazyFetch<Framework>(
  `/api/frameworks/${frameworkId}`
);

if (error.value) {
  console.error('Error fetching data:', error.value);
}

const formRef = ref();

const formState: NewFramework = reactive({
  name: data.value?.name || undefined,
  language: data.value?.language || undefined,
  url: data.value?.url || undefined,
  stars: data.value?.stars || undefined,
});

watch(
  data,
  () => {
    if (data) {
      formState.name = data.value?.name;
      formState.language = data.value?.language;
      formState.url = data.value?.url;
      formState.stars = data.value?.stars;
    }
  },
  { deep: true }
);

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
  console.log(event.data);
  const { name, language, url, stars } = event.data;
  loading.value = true;
  try {
    await $fetch(`/api/frameworks/${frameworkId}`, {
      method: 'PUT',
      body: { name, language, url, stars },
    });

    toast.add({
      title: 'Success',
      description: 'The framework was updated.',
      color: 'success',
    });
    await navigateTo('/');
  } catch (error) {
    console.log(error);
    toast.add({
      title: 'Error',
      description: 'Something went wrong.',
      color: 'error',
    });
  }

  loading.value = false;
}
</script>

<template>
  <UPage>
    <UPageHeader title="Edit a Framework" />

    <UPageBody>
      <div v-if="status === 'pending'">Loading ...</div>
      <UForm
        v-else
        ref="formRef"
        :validate="validate"
        :state="formState"
        class="space-y-4"
        @submit="submitForm"
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
        </div>
      </UForm>
    </UPageBody>
  </UPage>
</template>
