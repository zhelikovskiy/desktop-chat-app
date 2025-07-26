<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const username = ref('');

function register() {}
</script>

<template>
	<form @submit.prevent="register">
		<div>
			<label for="email">Email:</label>
			<input id="email" v-model="email" type="email" required />
		</div>
		<div>
			<label for="username">Username:</label>
			<input id="username" v-model="username" type="text" required />
		</div>
		<div>
			<label for="password">Password:</label>
			<input id="password" v-model="password" type="password" required />
		</div>
		<button type="submit">Register</button>
	</form>
</template>
