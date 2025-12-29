<script setup lang="ts">
useSeoMeta({
  title: 'The about page',
});
</script>

<template>
  <UPage>
    <UPageHeader title="About" />
    <UPageBody>
      <p>
        <span class="font-semibold">Top Frameworks</span> lists the top
        frameworks for web development based on their GitHub stars count.
      </p>

      <p>
        Feel free to contribute to the list by
        <ULink to="/add" title="Add a new framework"
          >making a new submission.</ULink
        >
      </p>

      <p>
        Built with
        <ULink to="https://nuxt.com" external target="_blank">Nuxt</ULink> and
        <ULink to="https://turso.tech" external target="_blank">Turso</ULink>.
      </p>
    </UPageBody>
  </UPage>
</template>
