<script lang="ts">
  import { onMount } from 'svelte';
  import { lyricsData, songDuration } from './lyricsData';
  import audioFile from './assets/Inspired by Alexander.mp3';

  interface Word {
    text: string;
    startTime: number;
    endTime: number;
  }

  interface ProcessedLine {
    words: Word[];
    startTime: number;
    endTime: number;
  }

  let audio: HTMLAudioElement;
  let isPlaying = false;
  let currentTime = 0;
  let duration = songDuration;
  let lyricsContainer: HTMLDivElement;

  // Process lyrics to calculate word timings
  const processedLyrics: ProcessedLine[] = lyricsData.map(line => {
    if (!line.text.trim()) {
      return {
        words: [],
        startTime: line.startTime,
        endTime: line.endTime
      };
    }

    const words = line.text.split(/(\s+)/).filter(w => w.trim().length > 0);
    const lineDuration = line.endTime - line.startTime;
    const timePerWord = lineDuration / words.length;

    const processedWords: Word[] = words.map((word, index) => ({
      text: word,
      startTime: line.startTime + (index * timePerWord),
      endTime: line.startTime + ((index + 1) * timePerWord)
    }));

    return {
      words: processedWords,
      startTime: line.startTime,
      endTime: line.endTime
    };
  });

  $: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  $: currentMinutes = Math.floor(currentTime / 60);
  $: currentSeconds = Math.floor(currentTime % 60);
  $: totalMinutes = Math.floor(duration / 60);
  $: totalSeconds = Math.floor(duration % 60);

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function handleTimeUpdate() {
    currentTime = audio.currentTime;
    scrollToActiveLyric();
  }

  function handleLoadedMetadata() {
    duration = audio.duration || songDuration;
  }

  function handleSeek(event: MouseEvent | KeyboardEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clientX = 'clientX' in event ? event.clientX : rect.left + rect.width / 2;
    const percent = (clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    currentTime = newTime;
  }

  function formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }

  function isLineActive(line: ProcessedLine): boolean {
    return currentTime >= line.startTime && currentTime < line.endTime;
  }

  function isWordActive(word: Word): boolean {
    return currentTime >= word.startTime && currentTime < word.endTime;
  }

  function scrollToActiveLyric() {
    if (!lyricsContainer) return;

    const activeLine = lyricsContainer.querySelector('.line.active');
    if (activeLine) {
      const containerRect = lyricsContainer.getBoundingClientRect();
      const lineRect = activeLine.getBoundingClientRect();
      const scrollOffset = lineRect.top - containerRect.top - containerRect.height / 2 + lineRect.height / 2;

      lyricsContainer.scrollTo({
        top: lyricsContainer.scrollTop + scrollOffset,
        behavior: 'smooth'
      });
    }
  }

  onMount(() => {
    audio.addEventListener('play', () => { isPlaying = true; });
    audio.addEventListener('pause', () => { isPlaying = false; });
    audio.addEventListener('ended', () => { isPlaying = false; audio.currentTime = 0; });
  });
</script>

<div class="player-container">
  <audio
    bind:this={audio}
    src={audioFile}
    on:timeupdate={handleTimeUpdate}
    on:loadedmetadata={handleLoadedMetadata}
  ></audio>

  <div class="lyrics-container" bind:this={lyricsContainer}>
    <div class="lyrics-content">
      {#each processedLyrics as line}
        <div
          class="line"
          class:active={isLineActive(line)}
        >
          {#if line.words.length === 0}
            <div class="empty-line"></div>
          {:else}
            {#each line.words as word}
              <span
                class="word"
                class:highlighted={isWordActive(word)}
              >
                {word.text}
              </span>
            {/each}
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <div class="controls">
    <button class="play-button" on:click={togglePlay}>
      {#if isPlaying}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </button>

    <div class="time-display">
      {formatTime(currentMinutes)}:{formatTime(currentSeconds)}
    </div>

    <div
      class="progress-container"
      on:click={handleSeek}
      on:keydown={(e) => e.key === 'Enter' && handleSeek(e)}
      role="slider"
      tabindex="0"
      aria-label="Seek through song"
      aria-valuemin="0"
      aria-valuemax={duration}
      aria-valuenow={currentTime}
    >
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%"></div>
        <div class="progress-handle" style="left: {progress}%"></div>
      </div>
    </div>

    <div class="time-display">
      {formatTime(totalMinutes)}:{formatTime(totalSeconds)}
    </div>
  </div>
</div>

<style>
  .player-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    overflow: hidden;
  }

  .lyrics-container {
    flex: 1;
    overflow-y: auto;
    padding: 80px 40px;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }

  .lyrics-container::-webkit-scrollbar {
    width: 8px;
  }

  .lyrics-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .lyrics-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .lyrics-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .lyrics-content {
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 200px;
  }

  .line {
    margin: 16px 0;
    font-size: 28px;
    font-weight: 600;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    min-height: 1.6em;
  }

  .line.active {
    color: rgba(255, 255, 255, 0.7);
    transform: scale(1.02);
  }

  .empty-line {
    height: 1.6em;
  }

  .word {
    display: inline-block;
    margin-right: 8px;
    transition: all 0.2s ease;
    position: relative;
  }

  .word.highlighted {
    color: #ffffff;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
    font-weight: 700;
  }

  .controls {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 30px 40px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.3);
  }

  .play-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }

  .play-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
  }

  .play-button:active {
    transform: scale(0.95);
  }

  .play-button svg {
    width: 24px;
    height: 24px;
    color: white;
  }

  .time-display {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    min-width: 45px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .progress-container {
    flex: 1;
    padding: 10px 0;
    cursor: pointer;
  }

  .progress-bar {
    position: relative;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: visible;
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

  .progress-handle {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .progress-container:hover .progress-handle {
    opacity: 1;
  }

  .progress-container:hover .progress-bar {
    height: 8px;
  }

  @media (max-width: 768px) {
    .lyrics-container {
      padding: 40px 20px;
    }

    .line {
      font-size: 22px;
    }

    .controls {
      padding: 20px;
      gap: 12px;
    }

    .play-button {
      width: 48px;
      height: 48px;
    }

    .play-button svg {
      width: 20px;
      height: 20px;
    }
  }
</style>
