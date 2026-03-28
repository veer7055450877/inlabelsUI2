<script>
  import { fade, fly, slide } from 'svelte/transition';
  import { backOut }           from 'svelte/easing';
  import { updateFeedback }    from '../lib/api.js';
  import { REASONS, FUNNY_REACTIONS } from '../lib/data.js';

  export let email     = '';
  export let analytics = {};

  const reasons = REASONS.funny;

  let selected   = '';
  let otherText  = '';
  let reaction   = '';
  let submitting = false;
  let submitted  = false;
  let reactionKey = 0; // bump to re-trigger animation

  function handleChange() {
    const next = FUNNY_REACTIONS[selected] || '';
    if (next !== reaction) {
      reaction    = next;
      reactionKey = reactionKey + 1;
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

    await new Promise(r => setTimeout(r, 900));
    submitting = false;
    submitted  = true;
  }
</script>

<div class="page-wrap fu-page" in:fade={{ duration: 500 }}>

  <!-- Floating shapes -->
  <div class="shape s1" aria-hidden="true">😂</div>
  <div class="shape s2" aria-hidden="true">💀</div>
  <div class="shape s3" aria-hidden="true">🔥</div>

  <div class="card" in:fly={{ y: 36, duration: 600, easing: backOut }}>

    {#if !submitted}

      <div class="badge">😅 uninstall feedback</div>
      <h1>Did we spam you<br />like your ex? 👀</h1>
      <p class="sub">Be honest… what did we do? We can take it. Probably.</p>

      <form on:submit|preventDefault={handleSubmit}>
        <fieldset>
          <legend class="sr-only">Pick your reason</legend>

          {#each reasons as { value, label } (value)}
            <label class="radio-row" class:selected={selected === value}>
              <input
                type="radio"
                name="reason"
                {value}
                bind:group={selected}
                on:change={handleChange}
              />
              <span class="tick" aria-hidden="true">{selected === value ? '✓' : ''}</span>
              <span class="radio-label">{label}</span>
            </label>
          {/each}
        </fieldset>

        {#if reaction}
          {#key reactionKey}
            <div class="reaction" in:fly={{ y: -10, duration: 280 }}>
              {reaction}
            </div>
          {/key}
        {/if}

        {#if selected === 'other'}
          <div in:slide={{ duration: 280 }}>
            <textarea
              bind:value={otherText}
              placeholder="Type your damage here… we'll need therapy after 😭"
              rows="3"
            ></textarea>
          </div>
        {/if}

        <button type="submit" class="submit-btn" disabled={!selected || submitting}>
          {#if submitting}
            <span class="spinner spinner--dark" aria-hidden="true"></span>
            <span>Bracing for impact…</span>
          {:else}
            <span>💬 Send the verdict</span>
          {/if}
        </button>
      </form>

    {:else}

      <div class="success" in:fly={{ y: 24, duration: 400 }}>
        <span class="big-emoji" aria-hidden="true">😭</span>
        <h2>Feedback received.</h2>
        <p>We'll cry later. Privately.<br />Thanks for the roast, honestly.</p>
        <div class="tag">transmitted successfully ✓</div>
      </div>

    {/if}
  </div>
</div>

<style>
  /* ── Page ── */
  .fu-page {
    background: linear-gradient(135deg, #fef08a 0%, #fb923c 50%, #f43f5e 100%);
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Floating emoji shapes */
  .shape {
    position: absolute;
    font-size: 2.5rem;
    opacity: 0.22;
    pointer-events: none;
    animation: float 5s ease-in-out infinite;
    user-select: none;
  }
  .s1 { top: 8%;  left: 6%;  animation-delay: 0s; }
  .s2 { top: 15%; right: 8%; animation-delay: -2s; font-size: 2rem; }
  .s3 { bottom: 12%; left: 10%; animation-delay: -3.5s; font-size: 3rem; }

  /* ── Card ── */
  .card {
    background: #fff;
    border: 3px solid #1a1a1a;
    border-radius: 24px;
    padding: 48px 44px;
    max-width: 540px;
    width: 100%;
    box-shadow: 8px 8px 0 #1a1a1a;
    position: relative;
    z-index: 1;
  }

  /* ── Badge ── */
  .badge {
    display: inline-block;
    background: #1a1a1a;
    color: #fef08a;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 99px;
    margin-bottom: 18px;
  }

  /* ── Typography ── */
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .sub {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 28px;
    font-weight: 500;
    line-height: 1.55;
  }

  /* ── Fieldset ── */
  fieldset { border: none; display: flex; flex-direction: column; gap: 9px; }

  /* ── Radio rows ── */
  .radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border: 2.5px solid #e5e7eb;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.18s ease;
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.94rem;
  }
  .radio-row:hover {
    border-color: #fbbf24;
    background: #fffbeb;
    transform: translateX(4px);
  }
  .radio-row.selected {
    border-color: #fb923c;
    background: #fff7ed;
    box-shadow: 4px 4px 0 #fb923c;
    transform: translate(-2px, -2px);
  }

  input[type='radio'] { display: none; }

  .tick {
    width: 20px;
    height: 20px;
    border: 2.5px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 900;
    color: #fb923c;
    flex-shrink: 0;
    transition: border-color 0.15s;
  }
  .selected .tick { border-color: #fb923c; background: #fff7ed; }

  .radio-label { flex: 1; }

  /* ── Reaction chip ── */
  .reaction {
    margin-top: 16px;
    padding: 14px 18px;
    background: #fff7ed;
    border-left: 4px solid #fb923c;
    border-radius: 12px;
    font-size: 0.94rem;
    font-weight: 600;
    color: #c2410c;
    line-height: 1.5;
  }

  /* ── Textarea ── */
  textarea {
    width: 100%;
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 2.5px solid #fcd34d;
    background: #fffbeb;
    color: #1a1a1a;
    font-family: 'Syne', sans-serif;
    font-size: 0.94rem;
    resize: vertical;
    min-height: 90px;
    outline: none;
    transition: border-color 0.2s;
  }
  textarea:focus { border-color: #fb923c; }
  textarea::placeholder { color: #f59e0b; opacity: 0.7; }

  /* ── Submit ── */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 24px;
    padding: 15px 32px;
    border: 3px solid #1a1a1a;
    border-radius: 100px;
    cursor: pointer;
    background: #1a1a1a;
    color: #fef08a;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    box-shadow: 4px 4px 0 #f43f5e;
    transition: all 0.2s;
  }
  .submit-btn:not(:disabled):hover {
    background: #f43f5e;
    color: #fff;
    box-shadow: 6px 6px 0 #1a1a1a;
    transform: translate(-2px, -2px);
  }
  .submit-btn:not(:disabled):active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0 #1a1a1a;
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner--dark {
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(254, 240, 138, 0.3);
    border-top-color: #fef08a;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  /* ── Success ── */
  .success { text-align: center; padding: 10px 0; }

  .big-emoji {
    display: block;
    font-size: 4rem;
    margin-bottom: 16px;
    animation: wiggle 1s ease-in-out 2;
  }

  .success h2 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .success p {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .tag {
    display: inline-block;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    color: #16a34a;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 14px;
    border-radius: 99px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  @media (max-width: 480px) {
    .card { padding: 36px 22px; }
    h1 { font-size: 1.65rem; }
  }
</style>
