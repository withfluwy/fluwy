<script lang="ts">
	interface LoginProps {
		default_strategy: string;
		providers: ProviderProp;
	}

	interface ProviderProp {
		google: SocialProvider;
		github: SocialProvider;
	}

	type SocialProvider = {
		client_id: string;
		client_secret: string;
	};
</script>

<div>Create login form here</div>
