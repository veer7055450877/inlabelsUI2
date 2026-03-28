<script>
  import { fade, slide } from 'svelte/transition';
  import { updateFeedback } from '../lib/api.js';
  import { REASONS } from '../lib/data.js';

  export let email     = '';
  export let analytics = {};

  const reasons = REASONS.minimal;

  const EMOJI_RATINGS = [
    { emoji: '😡', value: 1, label: 'Very unhappy' },
    { emoji: '😐', value: 3, label: 'Neutral' },
    { emoji: '😊', value: 5, label: 'Happy' },
  ];

  let selected     = '';
  let otherText    = '';
  let emojiRating  = null;
  let submitting   = false;
  let submitted    = false;

  async function handleSubmit() {
    if (!selected || submitting) return;
    submitting = true;

    await updateFeedback({
      ...analytics,
      email,
      reason:      selected,
      otherText:   selected === 'other' ? otherText : '',
      emojiRating,
    });

    await new Promise(r => setTimeout(r, 700));
    submitting = false;
    submitted  = true;
  }
</script>

<div class="page-wrap mi-page" in:fade={{ duration: 350 }}>

  <div class="card">

    {#if !submitted}

      <!-- Header -->
      <div class="top-row">
        <div class="logo" aria-label="InLabels">
          <span class="dot" aria-hidden="true"></span>InLabels
        </div>
        <span class="timer-tag" aria-label="Quick 5-second feedback">⏱ 5 seconds</span>
      </div>

      <h1>Why did you uninstall?</h1>
      <p class="hint">Quick feedback — we actually read every response.</p>

      <!-- Emoji scale -->
      <div class="emoji-scale" role="group" aria-label="Rate your experience">
        {#each EMOJI_RATINGS as { emoji, value, label }}
          <button
            type="button"
            class="emoji-btn"
            class:active={emojiRating === value}
            aria-label="{label}"
            aria-pressed={emojiRating === value}
            on:click={() => emojiRating = value}
          >
            <span class="ej" aria-hidden="true">{emoji}</span>
          </button>
        {/each}
      </div>

      <form on:submit|preventDefault={handleSubmit}>
        <fieldset>
          <legend class="field-legend">Select your main reason</legend>

          {#each reasons as { value, label } (value)}
            <label class="radio-row" class:selected={selected === value}>
              <input type="radio" name="reason" {value} bind:group={selected} />
              <span class="pip" aria-hidden="true"></span>
              <span>{label}</span>
            </label>
          {/each}
        </fieldset>

        {#if selected === 'other'}
          <div class="other-wrap" in:slide={{ duration: 220 }}>
            <textarea
              bind:value={otherText}
              placeholder="Any other thoughts?"
              rows="2"
            ></textarea>
          </div>
        {/if}

        <button type="submit" class="submit-btn" disabled={!selected || submitting}>
          {#if submitting}
            <span class="spinner spinner--dark" aria-hidden="true"></span>
          {:else}
            Submit →
          {/if}
        </button>
      </form>

    {:else}

      <div class="success" in:fade={{ duration: 300 }}>
        <div class="check" aria-hidden="true">✓</div>
        <h2>Done. Thank you.</h2>
        <p>Feedback logged. We'll make it count.</p>
      </div>

    {/if}
  </div>
</div>

<style>
  /* ── Page ── */
  .mi-page {
    background: #fff;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Card ── */
  .card {
    max-width: 440px;
    width: 100%;
    animation: slide-up 0.42s ease both;
  }

  /* ── Top row ── */
  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.88rem;
    font-weight: 700;
    color: #111;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .dot {
    width: 8px; height: 8px;
    background: #111;
    border-radius: 50%;
  }

  .timer-tag {
    font-size: 0.78rem;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 10px;
    border-radius: 99px;
  }

  /* ── Typography ── */
  h1 {
    font-size: 1.65rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 6px;
    line-height: 1.25;
  }

  .hint {
    font-size: 0.87rem;
    color: #9ca3af;
    margin-bottom: 26px;
    font-weight: 400;
  }

  /* ── Emoji scale ── */
  .emoji-scale {
    display: flex;
    gap: 16px;
    margin-bottom: 30px;
  }

  .emoji-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px; height: 64px;
    background: #fff;
    border: 2.5px solid #e5e7eb;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
  }
  .emoji-btn:hover { transform: scale(1.16); border-color: #d1d5db; }
  .emoji-btn.active {
    border-color: #111;
    background: #f9fafb;
    transform: scale(1.12);
    box-shadow: 0 0 0 4px rgba(0,0,0,0.07);
  }

  .ej { font-size: 1.7rem; line-height: 1; }

  /* ── Fieldset ── */
  fieldset { border: none; }

  .field-legend {
    font-size: 0.78rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: block;
    margin-bottom: 12px;
  }

  /* ── Radio rows ── */
  .radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 4px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.93rem;
    color: #6b7280;
    font-weight: 400;
    transition: color 0.14s;
  }
  .radio-row:last-child { border-bottom: none; }
  .radio-row:hover { color: #111; }
  .radio-row.selected { color: #111; font-weight: 600; }

  input[type='radio'] { display: none; }

  .pip {
    width: 15px; height: 15px;
    border-radius: 50%;
    border: 2px solid #e5e7eb;
    flex-shrink: 0;
    transition: border-color 0.14s, background 0.14s;
    position: relative;
  }
  .selected .pip { border-color: #111; background: #111; }
  .selected .pip::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: #fff;
    border-radius: 50%;
  }

  /* ── Other ── */
  .other-wrap { margin-top: 10px; }

  textarea {
    width: 100%;
    padding: 11px 13px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #f9fafb;
    color: #374151;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 72px;
    outline: none;
    transition: border-color 0.15s;
  }
  textarea:focus { border-color: #9ca3af; }
  textarea::placeholder { color: #d1d5db; }

  /* ── Submit ── */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 22px;
    padding: 13px 28px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: #111;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    transition: background 0.18s, transform 0.2s, box-shadow 0.18s;
  }
  .submit-btn:not(:disabled):hover {
    background: #333;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }
  .submit-btn:not(:disabled):active { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .spinner--dark {
    width: 16px; height: 16px;
    border: 2.5px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ── Success ── */
  .success { padding: 10px 0; animation: slide-up 0.32s ease both; }

  .check {
    width: 44px; height: 44px;
    background: #111;
    color: #fff;
    font-size: 1.2rem;
    font-weight: 900;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    animation: pop 0.4s ease both;
  }

  .success h2 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 6px;
  }

  .success p {
    font-size: 0.88rem;
    color: #9ca3af;
  }

  @media (max-width: 480px) {
    h1 { font-size: 1.45rem; }
    .emoji-btn { width: 56px; height: 56px; }
  }
</style>
