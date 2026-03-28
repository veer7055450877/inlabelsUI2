<script>
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { elasticOut, backOut }     from 'svelte/easing';
  import { updateFeedback }          from '../lib/api.js';
  import { REASONS }                 from '../lib/data.js';

  export let email    = '';
  export let analytics = {};

  const reasons = REASONS.emotional;

  let selected   = '';
  let otherText  = '';
  let submitting = false;
  let submitted  = false;

  async function handleSubmit() {
    if (!selected || submitting) return;
    submitting = true;

    await updateFeedback({
      ...analytics,
      email,
      reason:    selected,
      otherText: selected === 'other' ? otherText : '',
    });

    // Deliberate small delay so the loading state feels real
    await new Promise(r => setTimeout(r, 900));
    submitting = false;
    submitted  = true;
  }
</script>

<!-- ── Page shell ── -->
<div class="page-wrap em-page" in:fade={{ duration: 700 }}>

  <!-- Decorative blobs -->
  <div class="blob blob-a" aria-hidden="true"></div>
  <div class="blob blob-b" aria-hidden="true"></div>

  <div class="card" in:fly={{ y: 40, duration: 800, easing: elasticOut }}>

    {#if !submitted}

      <!-- Header -->
      <div class="header">
        <span class="hero-emoji" aria-hidden="true">💔</span>
        <h1>Wait... leaving already?</h1>
        <p class="sub">We really want to improve.<br />Tell us what went wrong 🥺</p>
      </div>

      <!-- Form -->
      <form on:submit|preventDefault={handleSubmit}>
        <fieldset>
          <legend class="sr-only">Reason for uninstalling</legend>

          {#each reasons as { value, label } (value)}
            <label class="radio-row" class:selected={selected === value}>
              <input
                type="radio"
                name="reason"
                {value}
                bind:group={selected}
              />
              <span class="radio-dot" aria-hidden="true"></span>
              <span class="radio-label">{label}</span>
            </label>
          {/each}
        </fieldset>

        {#if selected === 'other'}
          <div class="other-wrap" in:slide={{ duration: 300 }}>
            <textarea
              bind:value={otherText}
              placeholder="We're all ears... pour it out 💜"
              rows="3"
            ></textarea>
          </div>
        {/if}

        <button type="submit" class="submit-btn" disabled={!selected || submitting}>
          {#if submitting}
            <span class="spinner" aria-hidden="true"></span>
            <span>Sending some love…</span>
          {:else}
            <span>💌 Help us improve</span>
          {/if}
        </button>
      </form>

    {:else}

      <!-- Success state -->
      <div class="success" in:scale={{ duration: 550, easing: elasticOut }}>
        <span class="success-emoji" aria-hidden="true">❤️</span>
        <h2>Thanks… this means a lot.</h2>
        <p>We'll work hard to be better. Promise 🫶</p>
      </div>

    {/if}
  </div>
</div>

<style>
  /* ── Layout ── */
  .em-page {
    background: linear-gradient(140deg, #fce4ec 0%, #ead5f5 45%, #d4e3ff 100%);
    font-family: 'Nunito', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Decorative blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.55;
    pointer-events: none;
    animation: float 8s ease-in-out infinite;
  }
  .blob-a {
    width: 420px; height: 420px;
    background: radial-gradient(circle, #f9a8d4, #c084fc);
    top: -120px; left: -100px;
    animation-delay: 0s;
  }
  .blob-b {
    width: 360px; height: 360px;
    background: radial-gradient(circle, #a5b4fc, #818cf8);
    bottom: -100px; right: -80px;
    animation-delay: -4s;
  }

  /* ── Card ── */
  .card {
    background: rgba(255, 255, 255, 0.68);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 32px;
    padding: 52px 44px;
    max-width: 520px;
    width: 100%;
    box-shadow:
      0 24px 64px rgba(140, 90, 200, 0.14),
      0 1px 0 rgba(255, 255, 255, 0.9) inset;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  /* ── Header ── */
  .header { margin-bottom: 32px; }

  .hero-emoji {
    display: block;
    font-size: 3.8rem;
    margin-bottom: 14px;
    animation: float 3s ease-in-out infinite;
    line-height: 1;
  }

  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: #5b21b6;
    line-height: 1.2;
    margin-bottom: 10px;
  }

  .sub {
    font-size: 1rem;
    color: #7c3aed;
    opacity: 0.7;
    line-height: 1.6;
    font-weight: 500;
  }

  /* ── Fieldset ── */
  fieldset { border: none; display: flex; flex-direction: column; gap: 10px; }

  /* ── Radio rows ── */
  .radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 16px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.22s ease;
    text-align: left;
  }
  .radio-row:hover {
    background: rgba(255, 255, 255, 0.85);
    transform: translateX(4px);
  }
  .radio-row.selected {
    background: rgba(124, 58, 237, 0.1);
    border-color: #c084fc;
    box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.14);
    transform: scale(1.01);
  }

  input[type='radio'] { display: none; }

  .radio-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2.5px solid #c084fc;
    flex-shrink: 0;
    position: relative;
    transition: border-color 0.2s;
  }
  .selected .radio-dot {
    border-color: #9333ea;
    background: #9333ea;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.25);
  }
  .selected .radio-dot::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: #fff;
    border-radius: 50%;
  }

  .radio-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: #4c1d95;
  }

  /* ── Other textarea ── */
  .other-wrap { margin-top: 14px; }

  textarea {
    width: 100%;
    padding: 14px 16px;
    border-radius: 16px;
    border: 2px solid #c084fc;
    background: rgba(255, 255, 255, 0.7);
    color: #4c1d95;
    font-family: 'Nunito', sans-serif;
    font-size: 0.94rem;
    resize: vertical;
    min-height: 90px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  textarea:focus {
    border-color: #9333ea;
    box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.12);
  }
  textarea::placeholder { color: #a78bfa; }

  /* ── Submit button ── */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 24px;
    padding: 16px 32px;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
    color: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    box-shadow: 0 8px 24px rgba(147, 51, 234, 0.35);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.2s ease,
                opacity 0.2s;
  }
  .submit-btn:not(:disabled):hover {
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 12px 32px rgba(147, 51, 234, 0.45);
  }
  .submit-btn:not(:disabled):active { transform: scale(0.97); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Spinner ── */
  .spinner {
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  /* ── Success ── */
  .success { padding: 16px 0; }

  .success-emoji {
    display: block;
    font-size: 4.5rem;
    margin-bottom: 18px;
    animation: wiggle 1.2s ease-in-out 2;
  }

  .success h2 {
    font-size: 1.8rem;
    font-weight: 900;
    color: #5b21b6;
    margin-bottom: 10px;
  }

  .success p {
    font-size: 1rem;
    color: #7c3aed;
    opacity: 0.75;
    line-height: 1.6;
  }

  /* ── SR only ── */
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .card { padding: 36px 24px; }
    h1 { font-size: 1.6rem; }
  }
</style>
