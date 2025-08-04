<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRegisterStore } from '@/stores/register.store';

const router = useRouter();
const registerStore = useRegisterStore();

const email = ref('');
const password = ref('');
const username = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
	const response = await registerStore.register(
		email.value,
		username.value,
		password.value
	);

	if (response.success)
		router.push({
			name: 'Verify',
		});
	else errorMessage.value = response.error;
};
</script>

<template>
	<main>
		<div class="card">
			<h1>Register</h1>
			<form @submit.prevent="handleRegister">
				<div>
					<label for="email">Email:</label>
					<input id="email" v-model="email" type="email" required />
				</div>
				<div>
					<label for="username">Username:</label>
					<input
						id="username"
						v-model="username"
						type="text"
						required
					/>
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
				<button type="submit">Register</button>
				<p>
					Already have an account?
					<router-link to="/login">Login</router-link>
				</p>
			</form>
			<div v-if="errorMessage" class="error-message">
				{{ errorMessage }}
			</div>
		</div>
	</main>
</template>

<style scoped>
.card {
	padding: 2em;
	background-color: #1a1a1a;
	border-radius: 8px;
	max-width: 400px;
	width: 100%;
	text-align: center;
}

h1 {
	font-size: 3.2em;
	line-height: 1.1;
	margin-bottom: 1rem;
}

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

form input[type='email'],
form input[type='text'],
form input[type='password'] {
	width: 100%;
	padding: 0.8em 1.2em;
	border-radius: 8px;
	border: 1px solid #646cff;
	background-color: #1a1a1a;
	color: rgba(255, 255, 255, 0.87);
	box-sizing: border-box;
}

form input[type='email']:focus,
form input[type='text']:focus,
form input[type='password']:focus {
	outline: none;
	border-color: #535bf2;
}

button {
	border-radius: 8px;
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-weight: 500;
	font-family: inherit;
	background-color: #1a1a1a;
	color: rgba(255, 255, 255, 0.87);
	cursor: pointer;
	transition: border-color 0.25s;
}

button:hover {
	border-color: #646cff;
}

button:focus,
button:focus-visible {
	outline: 4px auto -webkit-focus-ring-color;
}

p {
	margin-top: 1rem;
	color: rgba(255, 255, 255, 0.87);
}

a {
	font-weight: 500;
	color: #646cff;
	text-decoration: inherit;
}

a:hover {
	color: #535bf2;
}

.error-message {
	margin-top: 1rem;
	color: #ff4d4f;
	font-size: 0.9em;
}

@media (prefers-color-scheme: light) {
	.card {
		background-color: #ffffff;
	}

	form label,
	p {
		color: #213547;
	}

	form input[type='email'],
	form input[type='text'],
	form input[type='password'] {
		background-color: #ffffff;
		border: 1px solid #747bff;
		color: #213547;
	}

	form input[type='email']:focus,
	form input[type='text']:focus,
	form input[type='password']:focus {
		border-color: #535bf2;
	}

	button {
		background-color: #f9f9f9;
		color: #213547;
	}

	button:hover {
		border-color: #747bff;
	}

	a:hover {
		color: #747bff;
	}

	.error-message {
		color: #ff4d4f;
	}
}
</style>
