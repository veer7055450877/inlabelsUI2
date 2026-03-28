<script>
  import { onMount } from 'svelte';
  import { saveEmail, buildAnalytics } from './lib/api.js';

  import Emotional    from './variants/Emotional.svelte';
  import Funny        from './variants/Funny.svelte';
  import Professional from './variants/Professional.svelte';
  import Retention    from './variants/Retention.svelte';
  import Minimal      from './variants/Minimal.svelte';
  import Meme         from './variants/Meme.svelte';

  const VARIANTS = [Emotional, Funny, Professional, Retention, Minimal, Meme];
  const VARIANT_KEYS = ['emotional', 'funny', 'professional', 'retention', 'minimal', 'meme'];

  let email        = '';
  let analytics    = null;
  let variantIndex = null;   // stays null until onMount to avoid flash
  let ready        = false;

  onMount(async () => {
    const params  = new URLSearchParams(window.location.search);
    email         = params.get('email') || '';
    variantIndex  = Math.floor(Math.random() * VARIANTS.length);

    // Build analytics payload once
    analytics = buildAnalytics({
      email,
      variant: VARIANT_KEYS[variantIndex],
      extensionVersion: params.get('v'),
    });

    // Fire-and-forget: save email on page load
    await saveEmail(analytics);

    ready = true;
  });

  $: ActiveVariant = variantIndex !== null ? VARIANTS[variantIndex] : null;
</script>

{#if ready && ActiveVariant}
  <svelte:component this={ActiveVariant} {email} {analytics} />
{/if}
