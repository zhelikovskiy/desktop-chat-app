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

<style scoped> /* Добавляем scoped, чтобы стили применялись только к этому компоненту */
form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 1.5rem;
	align-items: center;
}

form div {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	max-width: 300px;
}

form label {
	margin-bottom: 0.5rem;
	color: rgba(255, 255, 255, 0.87);
}

form input[type="email"],
form input[type="password"] {
	width: 100%;
	padding: 0.8em 1.2em;
	border-radius: 8px;
	border: 1px solid #646cff;
	background-color: #1a1a1a;
	color: rgba(255, 255, 255, 0.87);
	box-sizing: border-box;
}

form input[type="email"]:focus,
form input[type="password"]:focus {
	outline: none;
	border-color: #535bf2;
}

@media (prefers-color-scheme: light) {
	form label {
		color: #213547;
	}

	form input[type="email"],
	form input[type="password"] {
		background-color: #ffffff;
		border: 1px solid #747bff;
		color: #213547;
	}

	form input[type="email"]:focus,
	form input[type="password"]:focus {
		border-color: #535bf2;
	}
}
</style>