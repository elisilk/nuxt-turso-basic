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
      method: 'post',
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
  <div>
    <h1>Submit a framework</h1>

    <div class="px-4 md:px-8 lg:px-12">
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

      <form action="" @submit.prevent="addNewFramework">
        <div>
          <label for="name" class="block text-xs font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            name="name"
            autocomplete="off"
            placeholder="Framework name"
            class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            data-cy="name"
          />
        </div>

        <div>
          <label for="language" class="block text-xs font-medium text-gray-700">
            Language
          </label>
          <input
            id="language"
            v-model="form.language"
            type="text"
            name="language"
            placeholder="Programming Language"
            class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            data-cy="programming-language"
          />
        </div>

        <div>
          <label for="link" class="block text-xs font-medium text-gray-700">
            Github
          </label>
          <input
            id="link"
            v-model="form.githubLink"
            type="text"
            name="github_link"
            placeholder="GitHub link"
            class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            data-cy="github-link"
          />
        </div>

        <div>
          <label for="stars" class="block text-xs font-medium text-gray-700">
            Stars count
          </label>
          <input
            id="stars"
            v-model="form.githubStarsCount"
            type="text"
            name="github_stars_count"
            placeholder="GitHub stars count"
            class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            data-cy="github-stars-count"
          />
        </div>

        <div class="flex justify-center p-2">
          <button
            type="submit"
            class="py-2 px-4 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 focus:relative flex space-x-2 justify-between items-center"
            title="View Orders"
            data-cy="submit"
          >
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
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
