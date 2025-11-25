<script lang="ts">
  import { onMount } from 'svelte';
  import audioFile from './assets/Inspired by Alexander.mp3';
  import { lyricsData as originalLyrics, type LyricLine, type LyricWord } from './lyricsData';

  let audio: HTMLAudioElement;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;

  // Flatten all words from the lyrics
  let allWords: string[] = [];
  let timestamps: { word: string; startTime: number; endTime: number }[] = [];
  let currentWordIndex = 0;
  let isRecording = false;
  let lastMarkTime = 0;

  $: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  $: currentMinutes = Math.floor(currentTime / 60);
  $: currentSeconds = Math.floor(currentTime % 60);

  onMount(() => {
    // Extract all words from original lyrics
    originalLyrics.forEach(line => {
      line.words.forEach(word => {
        allWords.push(word.word);
      });
    });
    allWords = allWords;
  });

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function handleTimeUpdate() {
    currentTime = audio.currentTime;
  }

  function handleLoadedMetadata() {
    duration = audio.duration;
  }

  function startRecording() {
    isRecording = true;
    currentWordIndex = 0;
    timestamps = [];
    lastMarkTime = 0;
    audio.currentTime = 0;
    audio.play();
  }

  function markWord() {
    if (!isRecording || currentWordIndex >= allWords.length) return;

    const currentTimestamp = audio.currentTime;

    // If this is not the first word, set the end time of the previous word
    if (timestamps.length > 0) {
      timestamps[timestamps.length - 1].endTime = currentTimestamp;
    }

    // Add the current word with its start time
    timestamps.push({
      word: allWords[currentWordIndex],
      startTime: currentTimestamp,
      endTime: currentTimestamp + 0.5 // Temporary, will be updated
    });

    currentWordIndex++;

    // If we've marked all words, finish recording
    if (currentWordIndex >= allWords.length) {
      finishRecording();
    }
  }

  function finishRecording() {
    isRecording = false;
    // Set the end time of the last word
    if (timestamps.length > 0) {
      timestamps[timestamps.length - 1].endTime = audio.currentTime;
    }
    audio.pause();
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.code === 'Space' && isRecording) {
      event.preventDefault();
      markWord();
    }
  }

  function exportTimestamps() {
    // Rebuild the lyrics data structure
    const newLyricsData: LyricLine[] = [];
    let timestampIndex = 0;

    originalLyrics.forEach(line => {
      const newLine: LyricLine = {
        lineStartTime: 0,
        words: []
      };

      line.words.forEach(word => {
        if (timestampIndex < timestamps.length) {
          newLine.words.push({
            word: timestamps[timestampIndex].word,
            startTime: timestamps[timestampIndex].startTime,
            endTime: timestamps[timestampIndex].endTime
          });
          timestampIndex++;
        }
      });

      // Set line start time to first word's start time
      if (newLine.words.length > 0) {
        newLine.lineStartTime = newLine.words[0].startTime;
      }

      newLyricsData.push(newLine);
    });

    // Generate TypeScript code
    const output = `export interface LyricWord {
  word: string;
  startTime: number;
  endTime: number;
}

export interface LyricLine {
  words: LyricWord[];
  lineStartTime: number;
}

export const lyricsData: LyricLine[] = ${JSON.stringify(newLyricsData, null, 2)};

export const songDuration = ${Math.ceil(duration)};
`;

    // Download as file
    const blob = new Blob([output], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lyricsData.ts';
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetWord() {
    if (currentWordIndex > 0 && isRecording) {
      currentWordIndex--;
      timestamps.pop();
    }
  }

  function handleSeek(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    currentTime = newTime;
  }

  function formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="editor-container">
  <audio
    bind:this={audio}
    src={audioFile}
    on:timeupdate={handleTimeUpdate}
    on:loadedmetadata={handleLoadedMetadata}
    on:play={() => { isPlaying = true; }}
    on:pause={() => { isPlaying = false; }}
  />

  <div class="header">
    <h1>Timestamp Editor</h1>
    <p class="instructions">
      Press <kbd>Space</kbd> or click "Mark Word" exactly when each word starts.
      The audio will play continuously, and you mark the timing for each word.
    </p>
  </div>

  <div class="content">
    <div class="words-display">
      <h2>Words to Time ({currentWordIndex}/{allWords.length})</h2>
      <div class="words-grid">
        {#each allWords as word, index}
          <span
            class="word-item"
            class:current={index === currentWordIndex && isRecording}
            class:done={index < currentWordIndex}
          >
            {word}
          </span>
        {/each}
      </div>
    </div>

    <div class="controls-section">
      <div class="playback-controls">
        <button class="btn-large" on:click={togglePlay}>
          {#if isPlaying}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
            Pause
          {:else}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          {/if}
        </button>

        <div class="time-info">
          {formatTime(currentMinutes)}:{formatTime(currentSeconds)}
        </div>
      </div>

      <div class="progress-container" on:click={handleSeek}>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress}%"></div>
        </div>
      </div>

      <div class="recording-controls">
        {#if !isRecording}
          <button class="btn-start" on:click={startRecording}>
            Start Recording Timestamps
          </button>
        {:else}
          <button class="btn-mark" on:click={markWord}>
            <kbd>Space</kbd> Mark Word
          </button>
          <button class="btn-reset" on:click={resetWord}>
            Undo Last
          </button>
          <button class="btn-finish" on:click={finishRecording}>
            Finish
          </button>
        {/if}
      </div>

      {#if timestamps.length > 0 && !isRecording}
        <div class="export-section">
          <button class="btn-export" on:click={exportTimestamps}>
            Export lyricsData.ts
          </button>
          <p class="export-info">
            {timestamps.length} words timed. Download the file and replace the existing lyricsData.ts
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .editor-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    padding: 40px;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 20px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .instructions {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  kbd {
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 600;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 40px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .words-display h2 {
    font-size: 20px;
    margin: 0 0 20px 0;
    color: rgba(255, 255, 255, 0.9);
  }

  .words-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    background: rgba(0, 0, 0, 0.3);
    padding: 24px;
    border-radius: 12px;
    max-height: 600px;
    overflow-y: auto;
  }

  .word-item {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    font-size: 16px;
    transition: all 0.2s ease;
  }

  .word-item.current {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: scale(1.1);
    font-weight: 700;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  }

  .word-item.done {
    background: rgba(102, 126, 234, 0.3);
    color: rgba(255, 255, 255, 0.5);
  }

  .controls-section {
    background: rgba(0, 0, 0, 0.3);
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .playback-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .btn-large {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-large:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
  }

  .btn-large svg {
    width: 20px;
    height: 20px;
  }

  .time-info {
    font-size: 18px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.9);
  }

  .progress-container {
    padding: 10px 0;
    cursor: pointer;
  }

  .progress-bar {
    position: relative;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
    transition: width 0.1s linear;
  }

  .recording-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn-start,
  .btn-mark,
  .btn-reset,
  .btn-finish,
  .btn-export {
    padding: 16px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-start {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-mark {
    background: #10b981;
    color: white;
    font-size: 18px;
  }

  .btn-mark:hover {
    background: #059669;
    transform: scale(1.02);
  }

  .btn-reset {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .btn-reset:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .btn-finish {
    background: #f59e0b;
    color: white;
  }

  .btn-finish:hover {
    background: #d97706;
  }

  .export-section {
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-export {
    width: 100%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .btn-export:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 30px rgba(16, 185, 129, 0.5);
  }

  .export-info {
    margin-top: 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }

  @media (max-width: 1024px) {
    .content {
      grid-template-columns: 1fr;
    }
  }
</style>
