<script setup lang="ts">
import { useRegisterStore } from '@/stores/register.store';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const registerStore = useRegisterStore();

const code = ref('');
const errorMessage = ref('');

const remainingTime = ref(300);
const isResendDisabled = computed(() => remainingTime.value > 0);

let timer: any | null = null;

const startTimer = () => {
	timer = setInterval(() => {
		if (remainingTime.value > 0) {
			remainingTime.value -= 1;
		} else if (timer) {
			clearInterval(timer);
		}
	}, 1000);
};

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const goBack = () => {
	router.back();
};

const resendEmail = async () => {
	if (!isResendDisabled.value) {
		await window.ipcRenderer.getUserInfo();
		remainingTime.value = 300;
		startTimer();
		errorMessage.value = '';
		code.value = '';
	}
};

const verifyCode = async () => {
	errorMessage.value = '';

	const verificationResponse = await registerStore.verifyCode(code.value);

	if (verificationResponse.success) {
		router.push({ name: 'Login' });
	} else {
		errorMessage.value = verificationResponse.error;
	}
};

onMounted(() => {
	startTimer();
});

onUnmounted(() => {
	if (timer) {
		clearInterval(timer);
	}
});
</script>

<template>
	<main>
		<div class="card">
			<h1>Verify Your Email</h1>
			<p>
				A verification code has been sent to
				<strong>{{ registerStore.email }}</strong
				>. Please enter the code below to continue with your
				registration.
			</p>
			<form @submit.prevent="verifyCode">
				<div>
					<label for="code">Verification Code:</label>
					<input
						id="code"
						v-model="code"
						type="text"
						required
						placeholder="Enter code"
					/>
				</div>
				<button type="submit">Verify</button>
			</form>
			<div v-if="errorMessage" class="error-message">
				{{ errorMessage }}
			</div>
			<div class="button-group">
				<button @click="goBack">Back</button>
				<button
					@click="resendEmail"
					:disabled="isResendDisabled"
					:class="{ disabled: isResendDisabled }"
				>
					Resend Code
					{{
						isResendDisabled ? `(${formatTime(remainingTime)})` : ''
					}}
				</button>
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

p {
	margin-bottom: 1.5rem;
	color: rgba(255, 255, 255, 0.87);
}

form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 1.5rem;
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

form input[type='text'] {
	width: 100%;
	padding: 0.8em 1.2em;
	border-radius: 8px;
	border: 1px solid #646cff;
	background-color: #1a1a1a;
	color: rgba(255, 255, 255, 0.87);
	box-sizing: border-box;
}

form input[type='text']:focus {
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

button.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.button-group {
	display: flex;
	gap: 1rem;
	justify-content: center;
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

	p,
	form label {
		color: #213547;
	}

	form input[type='text'] {
		background-color: #ffffff;
		border: 1px solid #747bff;
		color: #213547;
	}

	form input[type='text']:focus {
		border-color: #535bf2;
	}

	button {
		background-color: #f9f9f9;
		color: #213547;
	}

	button:hover {
		border-color: #747bff;
	}

	.error-message {
		color: #ff4d4f;
	}
}
</style>
