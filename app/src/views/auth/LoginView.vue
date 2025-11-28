<script setup>
import router from '@/routes';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
		const loginResponse = await window.ipcRenderer.login(
			email.value,
			password.value
		);

		if(loginResponse.success) {
			authStore.login();
			router.push('/');
		} else {
			alert(loginResponse.message || 'Login failed. Please try again.');
		}
};
</script>

<template>
	<div>
		<h1>Login</h1>
		<form @submit.prevent="handleLogin">
			<div>
				<label for="email">Email:</label>
				<input id="email" v-model="email" type="email" required />
			</div>
			<div>
				<label for="password">Password:</label>
				<input
					id="password"
					v-model="password"
					type="password"
					required
				/>
			</div>
			<button type="submit">Login</button>
		</form>
	</div>
</template>
