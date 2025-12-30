<script setup lang="ts">
const form = reactive({
  name: '',
  language: '',
  githubLink: '',
  githubStarsCount: '',
});
const loading = ref(false);
const status = reactive({
  message: '',
  type: '',
});

/**
 * @description Submits new frameworks to the database
 */
async function addNewFramework() {
  const { name, language, githubLink: url, githubStarsCount: stars } = form;

  let message = '';
  if (!name) message += " 'name'";
  if (!language) message += " 'language'";
  if (!url) message += " 'GitHub link'";
  if (!stars) message += " 'stars count'";
  if (message) {
    status.message = 'Fill in the:' + message;
    status.type = 'success';
    return;
  }

  loading.value = true;

  try {
    await $fetch('/api/frameworks', {
      method: 'POST',
      body: { name, language, url, stars },
    });

    status.message = 'Thanks for your contribution';
    status.type = 'success';
    form.name = '';
    form.language = '';
    form.githubLink = '';
    form.githubStarsCount = '';
  } catch (error: unknown) {
    if (error instanceof Error) {
      status.message = error.message;
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('An unknown error occurred:', error);
    }
    // status.message = error.value.data.message.includes('UNIQUE constraint')
    //   ? 'Framework exists!'
    //   : error.value.data.message;
    status.type = 'error';
  }
  loading.value = false;

  if (status.message)
    setTimeout(() => {
      status.message = '';
      status.type = '';
    }, 5000);
}

useSeoMeta({
  title: 'Contribute to the frameworks list',
});
</script>

<template>
  <UPage>
    <UPageHeader title="Add a New Framework" />

    <UPageBody>
      <div
        v-show="status.message"
        id="submission-status-message"
        class="p-2 px-4"
        :class="{
          'text-green-800 bg-green-300': status.type === 'success',
          'text-red-800 bg-red-200': status.type === 'error',
        }"
      >
        {{ status.message }}
      </div>

      <form class="grid gap-4" @submit.prevent="addNewFramework">
        <div class="grid gap-2">
          <label for="name">Name</label>
          <UInput
            id="name"
            v-model="form.name"
            placeholder="Framework name"
            autocomplete="off"
            size="xl"
          />
        </div>

        <div class="grid gap-2">
          <label for="language">Language</label>
          <UInput
            id="language"
            v-model="form.language"
            placeholder="Programming Language"
            size="xl"
          />
        </div>

        <div class="grid gap-2">
          <label for="language">GitHub</label>
          <UInput
            id="link"
            v-model="form.githubLink"
            placeholder="GitHub link"
            size="xl"
          />
        </div>

        <div class="grid gap-2">
          <label for="language">Stars Count</label>
          <UInput
            id="link"
            v-model="form.githubStarsCount"
            placeholder="GitHub stars count"
            size="xl"
          />
        </div>

        <div>
          <UButton type="submit" title="Submit the new framework" size="xl">
            <span>Submit</span>
            <svg
              v-if="loading"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4 animate-spin fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
              />
            </svg>
          </UButton>
        </div>
      </form>
    </UPageBody>
  </UPage>
</template>
