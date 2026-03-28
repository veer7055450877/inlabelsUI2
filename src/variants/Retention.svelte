<script>
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { elasticOut, cubicOut }    from 'svelte/easing';
  import { updateFeedback }          from '../lib/api.js';
  import { REASONS, RETENTION_FEATURES } from '../lib/data.js';

  export let email     = '';
  export let analytics = {};

  const reasons = REASONS.retention;

  let step       = 'offer'; // 'offer' | 'form'
  let selected   = '';
  let otherText  = '';
  let submitting = false;
  let submitted  = false;

  function goToForm() { step = 'form'; }

  function goToProduct() {
    window.location.href = 'https://app.inlabels.io';
  }

  async function handleSubmit() {
    if (!selected || submitting) return;
    submitting = true;

    await updateFeedback({
      ...analytics,
      email,
      reason:    selected,
      otherText: selected === 'other' ? otherText : '',
    });

    await new Promise(r => setTimeout(r, 900));
    submitting = false;
    submitted  = true;
  }
</script>

<div class="page-wrap re-page" in:fade={{ duration: 600 }}>

  <!-- Stars / particles background -->
  {#each Array(14) as _, i}
    <div
      class="star"
      style="
        top:{Math.round(5 + (i * 7.2) % 90)}%;
        left:{Math.round(3 + (i * 13.7) % 94)}%;
        animation-delay:{(i * 0.4).toFixed(1)}s;
        width:{i % 3 === 0 ? 3 : 2}px;
        height:{i % 3 === 0 ? 3 : 2}px;
      "
      aria-hidden="true"
    ></div>
  {/each}

  <div class="card">

    {#if !submitted}

      {#if step === 'offer'}

        <div class="offer-panel" in:fly={{ y: 28, duration: 640, easing: elasticOut }}>
          <div class="badge" aria-label="Coming soon">🚀 Coming Soon</div>

          <h1>Wait! Before you go…<br />We're just getting started.</h1>

          <p class="sub">
            We're shipping features you actually asked for. Give us one more shot?
          </p>

          <ul class="features">
            {#each RETENTION_FEATURES as { icon, text }, i}
              <li style="animation-delay:{i * 80}ms">
                <span class="feat-icon" aria-hidden="true">{icon}</span>
                <span>{text}</span>
              </li>
            {/each}
          </ul>

          <div class="ctas">
            <button class="btn-main" on:click={goToProduct}>
              🙏 Give us another chance
            </button>
            <button class="btn-skip" on:click={goToForm}>
              Continue uninstall
            </button>
          </div>
        </div>

      {:else}

        <div class="form-panel" in:fly={{ y: 24, duration: 500, easing: cubicOut }}>
          <p class="form-pre">Before you go — one quick thing 👇</p>
          <h2>What went wrong?</h2>
          <p class="form-sub">Your answer helps the next version be better.</p>

          <form on:submit|preventDefault={handleSubmit}>
            <fieldset>
              <legend class="sr-only">Reason for leaving</legend>

              {#each reasons as { value, label } (value)}
                <label class="radio-row" class:selected={selected === value}>
                  <input type="radio" name="reason" {value} bind:group={selected} />
                  <span class="radio-pip" aria-hidden="true"></span>
                  <span>{label}</span>
                </label>
              {/each}
            </fieldset>

            {#if selected === 'other'}
              <div class="other-wrap" in:slide={{ duration: 270 }}>
                <textarea
                  bind:value={otherText}
                  placeholder="Tell us more…"
                  rows="3"
                ></textarea>
              </div>
            {/if}

            <button type="submit" class="submit-btn" disabled={!selected || submitting}>
              {#if submitting}
                <span class="spinner" aria-hidden="true"></span>
                <span>Sending…</span>
              {:else}
                <span>Submit Feedback</span>
              {/if}
            </button>
          </form>
        </div>

      {/if}

    {:else}

      <div class="success" in:scale={{ duration: 500, easing: elasticOut }}>
        <span class="success-emoji" aria-hidden="true">🙏</span>
        <h2>Thank you sincerely.</h2>
        <p>We'll build something worth coming back to.<br />The door is always open.</p>
      </div>

    {/if}
  </div>
</div>

<style>
  /* ── Page ── */
  .re-page {
    background: linear-gradient(135deg, #0c0a1e 0%, #1e1b4b 45%, #4c1d95 100%);
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Stars */
  .star {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    opacity: 0;
    animation: pulse-soft 3s ease-in-out infinite;
    pointer-events: none;
  }

  /* ── Card ── */
  .card {
    background: rgba(255, 255, 255, 0.065);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 28px;
    padding: 52px 44px;
    max-width: 580px;
    width: 100%;
    color: #fff;
    position: relative;
    z-index: 1;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(255,255,255,0.05) inset;
  }

  /* ── Badge ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(90deg, #f59e0b, #ef4444);
    color: #fff;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 99px;
    margin-bottom: 22px;
    animation: pulse-soft 2.2s ease-in-out infinite;
  }

  /* ── Typography ── */
  h1 {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.22;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .sub {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.65);
    line-height: 1.65;
    margin-bottom: 28px;
  }

  .form-pre {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.45);
    margin-bottom: 8px;
    font-weight: 500;
  }

  .form-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.5);
    margin-bottom: 22px;
    line-height: 1.55;
  }

  /* ── Features list ── */
  .features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .features li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.94rem;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    animation: slide-up 0.5s ease both;
  }

  .feat-icon {
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  /* ── CTAs ── */
  .ctas {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .btn-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 15px 28px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    background: linear-gradient(135deg, #a855f7, #6366f1);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    animation: glow-pulse 3s ease-in-out infinite;
  }
  .btn-main:hover {
    transform: scale(1.03) translateY(-2px);
    box-shadow: 0 12px 32px rgba(99, 102, 241, 0.55);
  }
  .btn-main:active { transform: scale(0.97); }

  .btn-skip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px 28px;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 14px;
    color: rgba(255,255,255,0.5);
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.18s, color 0.18s;
  }
  .btn-skip:hover {
    border-color: rgba(255,255,255,0.45);
    color: rgba(255,255,255,0.85);
  }

  /* ── Fieldset ── */
  fieldset { border: none; display: flex; flex-direction: column; gap: 9px; }

  /* ── Radio rows ── */
  .radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.92rem;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
    transition: all 0.18s ease;
  }
  .radio-row:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
  }
  .radio-row.selected {
    background: rgba(168,85,247,0.22);
    border-color: #a855f7;
    color: #fff;
    font-weight: 600;
  }

  input[type='radio'] { display: none; }

  .radio-pip {
    width: 16px; height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    flex-shrink: 0;
    transition: border-color 0.15s;
    position: relative;
  }
  .selected .radio-pip {
    border-color: #a855f7;
    background: #a855f7;
  }
  .selected .radio-pip::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: #fff;
    border-radius: 50%;
  }

  /* ── Other ── */
  .other-wrap { margin-top: 12px; }

  textarea {
    width: 100%;
    padding: 13px 15px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.07);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 0.91rem;
    resize: vertical;
    min-height: 90px;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  textarea:focus {
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168,85,247,0.2);
  }
  textarea::placeholder { color: rgba(255,255,255,0.3); }

  /* ── Submit ── */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 20px;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    background: linear-gradient(135deg, #a855f7, #6366f1);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .submit-btn:not(:disabled):hover {
    transform: scale(1.03) translateY(-2px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner {
    width: 17px; height: 17px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  /* ── Success ── */
  .success { text-align: center; padding: 20px 0; }

  .success-emoji {
    display: block;
    font-size: 4rem;
    margin-bottom: 18px;
    animation: float 3s ease-in-out infinite;
  }

  .success h2 {
    font-size: 1.7rem;
    font-weight: 800;
    margin-bottom: 12px;
  }

  .success p {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.65;
  }

  /* ── SR ── */
  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  @media (max-width: 480px) {
    .card { padding: 36px 22px; }
    h1 { font-size: 1.6rem; }
  }
</style>
