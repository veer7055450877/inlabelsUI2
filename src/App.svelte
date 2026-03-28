<script>
  import { onMount } from 'svelte';
  import { saveEmail, buildAnalytics } from './lib/api.js';

  import Emotional    from './variants/Emotional.svelte';
  import Funny        from './variants/Funny.svelte';
  import Professional from './variants/Professional.svelte';
  import Retention    from './variants/Retention.svelte';
  import Minimal      from './variants/Minimal.svelte';
  import Meme         from './variants/Meme.svelte';

  const VARIANT_COMPONENTS = {
    emotional: Emotional,
    funny: Funny,
    professional: Professional,
    retention: Retention,
    minimal: Minimal,
    meme: Meme,
  };

  const DEFAULT_VARIANT = 'professional';

  let email        = '';
  let analytics    = null;
  let variantKey   = '';
  let ready        = false;

  function resolveVariantKey() {
    const params = new URLSearchParams(window.location.search);
    const queryVariant = params.get('variant')?.trim().toLowerCase();

    if (queryVariant && queryVariant in VARIANT_COMPONENTS) {
      return queryVariant;
    }

    const pathSegments = window.location.pathname
      .split('/')
      .map((segment) => segment.trim().toLowerCase())
      .filter(Boolean);

    const pathVariant = pathSegments[pathSegments.length - 1];

    if (pathVariant && pathVariant in VARIANT_COMPONENTS) {
      return pathVariant;
    }

    return DEFAULT_VARIANT;
  }

  onMount(async () => {
    const params  = new URLSearchParams(window.location.search);
    email         = params.get('email') || '';
    variantKey    = resolveVariantKey();

    analytics = buildAnalytics({
      email,
      variant: variantKey,
      extensionVersion: params.get('v'),
    });

    await saveEmail(analytics);

    ready = true;
  });

  $: ActiveVariant = variantKey ? VARIANT_COMPONENTS[variantKey] : null;
</script>

{#if ready && ActiveVariant}
  <svelte:component this={ActiveVariant} {email} {analytics} />
{/if}
