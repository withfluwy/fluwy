<script lang="ts">
    interface ImageProps {
        class?: string;
        src: string;
        alt?: string;
    }

    const props: ImageProps = $props();
</script>

<img src={props.src} alt={props.alt} class={props.class} />
