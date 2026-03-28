<script>
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { elasticOut }              from 'svelte/easing';
  import { updateFeedback }          from '../lib/api.js';
  import { REASONS, MEME_TEXTS }     from '../lib/data.js';

  export let email     = '';
  export let analytics = {};

  const reasons = REASONS.meme;

  let selected      = '';
  let otherText     = '';
  let submitting    = false;
  let submitted     = false;
  let prevSelected  = '';
  let memeChanged   = false;
  let memeTimer     = null;

  $: memeText = MEME_TEXTS[selected] || MEME_TEXTS[''];
  $: memeEmoji = selected ? '💀' : '😭';

  function handleChange() {
    if (selected !== prevSelected) {
      memeChanged  = true;
      clearTimeout(memeTimer);
      memeTimer    = setTimeout(() => { memeChanged = false; }, 700);
      prevSelected = selected;
    }
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

    await new Promise(r => setTimeout(r, 950));
    submitting = false;
    submitted  = true;
  }
</script>

<div class="page-wrap me-page" in:fade={{ duration: 500 }}>

  <!-- Scanline overlay -->
  <div class="scanlines" aria-hidden="true"></div>

  <div class="layout">

    <!-- Meme card — always visible -->
    <div class="meme-card" class:shaking={memeChanged} aria-live="polite">
      <div class="meme-noise" aria-hidden="true"></div>
      <span class="meme-emoji" aria-hidden="true">{memeEmoji}</span>
      <div class="meme-top">{memeText.top}</div>
      <div class="meme-main">
        You <mark>uninstalling</mark> us?
      </div>
      <div class="meme-bottom" class:changed={memeChanged}>{memeText.bottom}</div>
      {#if selected}
        <div class="meme-tag" in:fade={{ duration: 200 }}>// selection logged</div>
      {/if}
    </div>

    <!-- Form card -->
    <div class="form-card">

      {#if !submitted}

        <div class="form-header">
          <div class="terminal-dot red" aria-hidden="true"></div>
          <div class="terminal-dot yellow" aria-hidden="true"></div>
          <div class="terminal-dot green" aria-hidden="true"></div>
          <span class="terminal-title">damage_report.sh</span>
        </div>

        <p class="form-pre">// please state your reasons for this crime</p>

        <form on:submit|preventDefault={handleSubmit}>
          <fieldset>
            <legend class="sr-only">Select your reason</legend>

            {#each reasons as { value, label } (value)}
              <label class="radio-row" class:selected={selected === value}
                on:change={handleChange}>
                <input type="radio" name="reason" {value} bind:group={selected} />
                <span class="radio-bracket" aria-hidden="true">
                  {selected === value ? '▶' : '·'}
                </span>
                <span>{label}</span>
              </label>
            {/each}
          </fieldset>

          {#if selected === 'other'}
            <div class="other-wrap" in:slide={{ duration: 250 }}>
              <textarea
                bind:value={otherText}
                placeholder="// type your trauma here"
                rows="3"
              ></textarea>
            </div>
          {/if}

          <button type="submit" class="submit-btn" disabled={!selected || submitting}>
            {#if submitting}
              <span class="meme-spinner" aria-hidden="true"></span>
              <span>processing the pain…</span>
            {:else}
              <span>💣 Send the damage</span>
            {/if}
          </button>
        </form>

      {:else}

        <div class="success" in:scale={{ duration: 520, easing: elasticOut }}>
          <span class="success-emoji" aria-hidden="true">😭</span>
          <div class="success-tag">// feedback_received: TRUE</div>
          <h2>We'll recover from this.</h2>
          <p>…maybe 😅<br />Thanks for being real with us.</p>
        </div>

      {/if}
    </div>
  </div>
</div>

<style>
  /* ── Page ── */
  .me-page {
    background: #080808;
    font-family: 'Space Mono', monospace;
    position: relative;
    overflow: hidden;
    align-items: flex-start;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  /* Scanlines */
  .scanlines {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.013) 3px,
      rgba(255,255,255,0.013) 4px
    );
    pointer-events: none;
    z-index: 0;
  }

  /* ── Layout ── */
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 860px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  /* ── Meme card ── */
  .meme-card {
    background: #111;
    border: 2px solid #222;
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .meme-card.shaking { animation: shake 0.45s ease; }

  .meme-noise {
    position: absolute;
    inset: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 120px 120px;
    pointer-events: none;
  }

  .meme-emoji {
    font-size: 3.5rem;
    display: block;
    animation: float 2.8s ease-in-out infinite;
    line-height: 1;
  }

  .meme-top {
    font-size: 0.78rem;
    color: #555;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
  }

  .meme-main {
    font-size: 1.55rem;
    font-weight: 700;
    color: #eee;
    line-height: 1.3;
  }
  .meme-main mark {
    background: none;
    color: #f59e0b;
    padding: 0 2px;
  }

  .meme-bottom {
    font-size: 0.88rem;
    color: #555;
    transition: color 0.25s;
    font-weight: 400;
  }
  .meme-bottom.changed { color: #f43f5e; }

  .meme-tag {
    font-size: 0.72rem;
    color: #3d3;
    letter-spacing: 0.08em;
    margin-top: 4px;
    opacity: 0.8;
  }

  /* ── Form card ── */
  .form-card {
    background: #111;
    border: 2px solid #222;
    border-radius: 20px;
    padding: 0;
    overflow: hidden;
  }

  .form-header {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 14px 20px;
    background: #161616;
    border-bottom: 1px solid #222;
  }

  .terminal-dot {
    width: 11px; height: 11px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .red    { background: #ff5f57; }
  .yellow { background: #febc2e; }
  .green  { background: #28c840; }

  .terminal-title {
    font-size: 0.75rem;
    color: #555;
    margin-left: 6px;
    letter-spacing: 0.04em;
  }

  .form-pre {
    font-size: 0.78rem;
    color: #3d3;
    margin: 20px 22px 16px;
    letter-spacing: 0.04em;
    font-weight: 400;
  }

  /* ── Fieldset ── */
  fieldset {
    border: none;
    padding: 0 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* ── Radio rows ── */
  .radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 13px;
    background: #0d0d0d;
    border: 1.5px solid #1e1e1e;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.84rem;
    color: #555;
    font-weight: 400;
    transition: all 0.16s;
  }
  .radio-row:hover { border-color: #333; color: #ccc; }
  .radio-row.selected { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.07); }

  input[type='radio'] { display: none; }

  .radio-bracket {
    font-size: 0.85rem;
    width: 14px;
    flex-shrink: 0;
    color: inherit;
    transition: color 0.14s;
  }

  /* ── Other textarea ── */
  .other-wrap { padding: 0 22px; margin-top: 10px; }

  textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid #222;
    background: #0a0a0a;
    color: #aaa;
    font-family: 'Space Mono', monospace;
    font-size: 0.82rem;
    resize: vertical;
    min-height: 85px;
    outline: none;
    transition: border-color 0.18s;
  }
  textarea:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
  textarea::placeholder { color: #333; }

  /* ── Submit ── */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: calc(100% - 44px);
    margin: 18px 22px 22px;
    padding: 13px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: linear-gradient(90deg, #f59e0b, #ef4444);
    color: #0a0a0a;
    font-family: 'Space Mono', monospace;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    transition: filter 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .submit-btn:not(:disabled):hover {
    filter: brightness(1.1);
    box-shadow: 0 0 24px rgba(245,158,11,0.4);
    transform: translateY(-1px);
  }
  .submit-btn:not(:disabled):active { transform: translateY(0); filter: brightness(0.95); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .meme-spinner {
    width: 16px; height: 16px;
    border: 2.5px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ── Success ── */
  .success {
    padding: 40px 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .success-emoji {
    font-size: 4rem;
    display: block;
    animation: wiggle 1s ease 2;
  }

  .success-tag {
    font-size: 0.72rem;
    color: #3d3;
    letter-spacing: 0.08em;
  }

  .success h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #eee;
  }

  .success p {
    font-size: 0.88rem;
    color: #555;
    line-height: 1.65;
  }

  /* ── SR ── */
  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .layout { grid-template-columns: 1fr; }
    .me-page { align-items: center; padding-top: 24px; }
    .meme-card { display: none; }
  }
</style>
