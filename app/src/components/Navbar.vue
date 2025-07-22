<template>
	<nav class="navbar">
		<router-link to="/" class="nav-item">Home</router-link>
		<router-link to="/chat" class="nav-item">Chat</router-link>
		<router-link to="/profile" class="nav-item">Profile</router-link>
		<button class="nav-item logout-btn" @click="handleLogout">Log out</button>
	</nav>
</template>

<script setup>
	const handleLogout = () => {

	}
</script>

<style scoped> /* Добавляем scoped, чтобы стили применялись только к этому компоненту */
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  background-color: #1a1a1a;
  border-bottom: 1px solid #646cff;
  width: 100%;
  box-sizing: border-box;
}

.nav-item {
  font-weight: 500;
  color: #646cff;
  text-decoration: none;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
  background-color: transparent;
  border: 1px solid transparent;
}

.nav-item:hover {
  background-color: rgba(100, 108, 255, 0.1);
  color: #535bf2;
  border-color: rgba(100, 108, 255, 0.3);
}

.logout-btn {
  background-color: transparent;
  color: #646cff;
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.25s, background-color 0.2s, color 0.2s;
}

.logout-btn:hover {
  border-color: rgba(100, 108, 255, 0.3);
  background-color: rgba(100, 108, 255, 0.1);
  color: #535bf2;
}

@media (prefers-color-scheme: light) {
	.navbar {
		background-color: #f0f0f0;
		border-bottom: 1px solid #747bff;
	}

	.nav-item {
		color: #213547;
	}

	.nav-item:hover {
		background-color: rgba(116, 123, 255, 0.1);
		color: #747bff;
		border-color: rgba(116, 123, 255, 0.3);
	}

	.logout-btn {
		color: #213547;
	}

	.logout-btn:hover {
		border-color: rgba(116, 123, 255, 0.3);
		background-color: rgba(116, 123, 255, 0.1);
		color: #747bff;
	}
}
</style>
