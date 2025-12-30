<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Add New',
    to: '/add',
  },
  {
    label: 'Old Format',
    defaultOpen: true,
    children: [
      {
        label: 'Listing',
        to: '/old/',
      },
      {
        label: 'Add New',
        to: '/old/add',
      },
    ],
  },
  {
    label: 'About',
    to: '/about',
  },
]);
</script>

<template>
  <UHeader title="Top Frameworks" mode="slideover">
    <UNavigationMenu :items content-orientation="vertical" />
    <template #body>
      <UNavigationMenu :items orientation="vertical" />
    </template>
    <template #right>
      <UColorModeButton />
      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/elisilk/nuxt-turso-basic"
          target="_blank"
          icon="i-lucide-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
