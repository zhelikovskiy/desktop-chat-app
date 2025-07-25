<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { ref } from 'vue';

const authStore = useAuthStore();

const username = ref(authStore.getUserInfo.username || '');

</script>

<template>
	<div>
		<h1>Welcome {{username}} to the Home Page</h1>
		<p>This is the main content of the home component.</p>
	</div>
</template>
