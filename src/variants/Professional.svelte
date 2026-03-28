<script>
  import { fade, fly, slide } from 'svelte/transition';
  import { cubicOut }          from 'svelte/easing';
  import { updateFeedback }    from '../lib/api.js';
  import { REASONS }           from '../lib/data.js';

  export let email     = '';
  export let analytics = {};

  const reasons = REASONS.professional;

  let selected   = '';
  let otherText  = '';
  let submitting = false;
  let submitted  = false;

  $: progress = selected ? 100 : 30;

  async function handleSubmit() {
    if (!selected || submitting) return;
    submitting = true;

    await updateFeedback({
      ...analytics,
      email,
      reason:    selected,
      otherText: selected === 'other' ? otherText : '',
    });

    await new Promise(r => setTimeout(r, 1000));
    submitting = false;
    submitted  = true;
  }
</script>

<div class="page-wrap pr-page" in:fade={{ duration: 500 }}>

  <div class="card" in:fly={{ y: 32, duration: 640, easing: cubicOut }}>

    <!-- Left panel -->
    <aside class="left-panel">
      <div class="brand">
        <span class="brand-dot"></span>
        <span class="brand-name">InLabels</span>
      </div>

      <div class="illustration" aria-hidden="true">📊</div>

      <h2>Your feedback shapes our roadmap</h2>
      <p>
        Every response helps us build tools that work for real teams — not
        just on paper.
      </p>

      <div class="trust-row">
        <span class="trust-pill">🔒 Private</span>
        <span class="trust-pill">⚡ 10 seconds</span>
      </div>
    </aside>

    <!-- Right panel -->
    <main class="right-panel">

      {#if !submitted}
        <!-- Progress -->
        <div class="progress-wrap">
          <span class="step-label">Step 1 of 1</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width:{progress}%"></div>
          </div>
          <span class="pct-label">{progress}%</span>
        </div>

        <h1>We're sorry to see you go</h1>
        <p class="sub">
          Your feedback helps us build better tools.<br />
          What's the main reason you're leaving?
        </p>

        <form on:submit|preventDefault={handleSubmit}>
          <fieldset>
            <legend class="sr-only">Uninstall reason</legend>

            {#each reasons as { value, label } (value)}
              <label class="radio-row" class:selected={selected === value}>
                <input type="radio" name="reason" {value} bind:group={selected} />
                <span class="radio-pip" aria-hidden="true"></span>
                <span>{label}</span>
              </label>
            {/each}
          </fieldset>

          {#if selected === 'other'}
            <div class="other-wrap" in:slide={{ duration: 260 }}>
              <label class="field-label" for="other-input">
                Please tell us more (optional)
              </label>
              <textarea
                id="other-input"
                bind:value={otherText}
                placeholder="Describe your experience…"
                rows="3"
              ></textarea>
            </div>
          {/if}

          <button type="submit" class="submit-btn" disabled={!selected || submitting}>
            {#if submitting}
              <span class="spinner" aria-hidden="true"></span>
              <span>Submitting…</span>
            {:else}
              <span>Submit Feedback</span>
              <span aria-hidden="true">→</span>
            {/if}
          </button>
        </form>

      {:else}

        <div class="success" in:fly={{ y: 20, duration: 400 }}>
          <div class="check-circle" aria-hidden="true">✓</div>
          <h2>Feedback received</h2>
          <p>
            Thank you for taking the time. Your input will directly inform
            our next product cycle.
          </p>
          <div class="meta">Logged · {new Date().toLocaleDateString()}</div>
        </div>

      {/if}
    </main>
  </div>
</div>

<style>
  /* ── Page ── */
  .pr-page {
    background: #f1f5f9;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Card ── */
  .card {
    background: #fff;
    border-radius: 24px;
    max-width: 820px;
    width: 100%;
    box-shadow:
      0 4px 6px rgba(0,0,0,0.04),
      0 24px 48px rgba(0,0,0,0.08);
    display: grid;
    grid-template-columns: 300px 1fr;
    overflow: hidden;
  }

  /* ── Left panel ── */
  .left-panel {
    background: linear-gradient(160deg, #1e3a8a 0%, #2563eb 100%);
    padding: 44px 36px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: #fff;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .brand-dot {
    width: 10px; height: 10px;
    background: #60a5fa;
    border-radius: 50%;
    box-shadow: 0 0 8px #93c5fd;
    animation: pulse-soft 2.5s ease-in-out infinite;
  }
  .brand-name {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .illustration {
    font-size: 4.5rem;
    margin: 8px 0;
    animation: float 5s ease-in-out infinite;
    line-height: 1;
  }

  .left-panel h2 {
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .left-panel p {
    font-size: 0.88rem;
    opacity: 0.78;
    line-height: 1.65;
  }

  .trust-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }
  .trust-pill {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 12px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 99px;
    white-space: nowrap;
  }

  /* ── Right panel ── */
  .right-panel {
    padding: 48px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* ── Progress ── */
  .progress-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
  }
  .step-label {
    font-size: 0.78rem;
    color: #94a3b8;
    font-weight: 600;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .progress-bar {
    flex: 1;
    height: 5px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #60a5fa);
    border-radius: 99px;
    transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .pct-label {
    font-size: 0.78rem;
    color: #94a3b8;
    font-weight: 600;
    min-width: 34px;
    text-align: right;
  }

  /* ── Typography ── */
  h1 {
    font-size: 1.55rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .sub {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 26px;
    line-height: 1.65;
  }

  /* ── Fieldset ── */
  fieldset { border: none; display: flex; flex-direction: column; gap: 8px; }

  /* ── Radio rows ── */
  .radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.91rem;
    color: #334155;
    transition: all 0.16s ease;
    font-weight: 500;
  }
  .radio-row:hover { border-color: #93c5fd; background: #f8fafc; }
  .radio-row.selected { border-color: #2563eb; background: #eff6ff; color: #1e40af; font-weight: 600; }

  input[type='radio'] { display: none; }

  .radio-pip {
    width: 16px; height: 16px;
    border-radius: 50%;
    border: 2px solid #cbd5e1;
    flex-shrink: 0;
    transition: border-color 0.15s;
    position: relative;
  }
  .selected .radio-pip {
    border-color: #2563eb;
    background: #2563eb;
  }
  .selected .radio-pip::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: #fff;
    border-radius: 50%;
  }

  /* ── Other field ── */
  .other-wrap { margin-top: 12px; }
  .field-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    color: #334155;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.91rem;
    resize: vertical;
    min-height: 85px;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  textarea::placeholder { color: #94a3b8; }

  /* ── Submit button ── */
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
    background: #1e40af;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.93rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(30, 64, 175, 0.25);
    transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
    align-self: flex-start;
  }
  .submit-btn:not(:disabled):hover {
    background: #1d4ed8;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.35);
    transform: translateY(-1px);
  }
  .submit-btn:not(:disabled):active { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ── Success ── */
  .success { display: flex; flex-direction: column; gap: 12px; }

  .check-circle {
    width: 52px; height: 52px;
    background: #dcfce7;
    color: #16a34a;
    font-size: 1.3rem;
    font-weight: 900;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: bounce-in 0.5s ease both;
  }

  .success h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .success p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.65;
    max-width: 340px;
  }

  .meta {
    font-size: 0.78rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ── SR ── */
  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .card { grid-template-columns: 1fr; }
    .left-panel { display: none; }
    .right-panel { padding: 36px 24px; }
  }
</style>
