'use strict';

(() => {
  const body = document.body;
  const intro = document.getElementById('intro');
  const garden = document.getElementById('garden');
  const bloomButton = document.getElementById('bloom');
  const replayButton = document.getElementById('replay');
  const soundButton = document.getElementById('sound');
  const announcement = document.getElementById('announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let blooming = false;
  let replayTimer = null;
  let sparkleCount = 0;

  // Each flower is drawn from original vector petals, leaves, and curved stems.
  const tulips = [
    { x: 337, y: 354, size: .83, lean: -20, root: 431, delay: .18, depth: .83 },
    { x: 576, y: 343, size: .81, lean: 19, root: 474, delay: .42, depth: .83 },
    { x: 259, y: 445, size: .69, lean: -30, root: 416, delay: .55, depth: .92 },
    { x: 652, y: 446, size: .70, lean: 29, root: 492, delay: .78, depth: .92 },
    { x: 450, y: 261, size: 1.10, lean: -3, root: 454, delay: 0, depth: 1 },
    { x: 380, y: 439, size: .73, lean: -11, root: 441, delay: .92, depth: 1 },
    { x: 541, y: 425, size: .80, lean: 13, root: 466, delay: 1.1, depth: 1 }
  ];

  function leaf(x, y, scale, mirrored, tilt = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${mirrored ? -scale : scale} ${scale})">
      <g class="leaf-growth">
        <path d="M0 0C-23-6-45-25-58-55C-69-80-81-108-104-129C-65-117-42-86-26-59C-10-33 3-12 0 0Z" fill="url(#leaf-${mirrored ? 'right' : 'left'})"/>
        <path d="M-2-3C-21-40-53-90-101-126" fill="none" stroke="#83c4ba" stroke-width=".8" opacity=".24"/>
        <path d="M-7-14C-17-40-48-92-93-120" fill="none" stroke="#143b44" stroke-width="1.5" opacity=".25"/>
      </g>
    </g>`;
  }

  function flower(t, i) {
    const middleX = (t.x + t.root) / 2;
    const middleY = (t.y + 697) / 2;
    return `<g class="plant" style="--delay:${t.delay}s;--sway:${5.5 + i * .53}s;--root:${t.root}px;opacity:${t.depth}">
      <path class="stem-line" pathLength="1" d="M${t.root} 697C${t.root + (t.x - t.root) * .1} 612 ${t.x + (t.root - t.x) * .12} ${t.y + 110} ${t.x} ${t.y}" fill="none" stroke="url(#stem)" stroke-width="${4.5 * t.size}" stroke-linecap="round"/>
      ${leaf(middleX, middleY + 28, .89 * t.size, false, -9)}
      ${leaf(middleX + 11, middleY + 91, 1.07 * t.size, true, -10)}
      ${leaf(t.x + (t.root - t.x) * .2, t.y + 107, .61 * t.size, i % 2 === 0, -7)}
      <g transform="translate(${t.x} ${t.y}) rotate(${t.lean}) scale(${t.size})" class="flower-head">
        <g class="corolla">
          <path d="M-15-3C-24-9-27-25-18-31L0-23L18-31C26-23 20-8 13-3L2 9Z" fill="url(#calyx)"/>
          <path d="M0 0C-28-7-36-45-25-82C-18-103-6-108-1-112C11-98 26-80 28-62C35-25 22-6 0 0Z" fill="url(#petal-back)"/>
          <path d="M-6-2C-36-6-49-29-52-59C-54-77-51-95-46-106C-38-90-26-88-15-73C-4-57 10-33 7-9Z" fill="url(#petal-left)"/>
          <path d="M2-1C28-4 47-26 50-57C53-78 49-96 43-108C35-91 22-87 11-69C-3-48-11-23-5-7Z" fill="url(#petal-right)"/>
          <path d="M0 1C-23 0-37-17-38-42C-39-61-26-74-18-90C-13-83-9-74-2-70C5-72 13-83 18-89C26-72 39-63 38-44C38-16 23 1 0 1Z" fill="url(#petal-front)"/>
          <path d="M-44-99C-49-74-42-46-27-31M-20-80C-27-61-29-45-24-29M-1-103C-12-82-12-67-10-58M42-100C49-78 40-52 34-43" fill="none" stroke="#c2e2ff" stroke-width="1.2" stroke-linecap="round" opacity=".29"/>
          <path d="M4-64C-3-38-1-13 1-4M26-64C32-42 20-15 8-5M-32-53C-33-31-20-13-7-5" fill="none" stroke="#163f86" stroke-width="1" opacity=".25"/>
          <path d="M-17-86C-11-76-8-72-2-69C4-71 12-81 17-85" fill="none" stroke="#b1d9ff" stroke-width="1.2" opacity=".42"/>
        </g>
      </g>
    </g>`;
  }
  document.getElementById('plants').innerHTML = tulips.map(flower).join('');

  let seed = 9173;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  document.getElementById('stars').innerHTML = Array.from({ length: 62 }, (_, i) => {
    const size = i % 7 === 0 ? 2 : 1;
    return `<i class="star ${i % 7 === 0 ? 'bright' : ''}" style="--x:${random() * 100}%;--y:${random() * 94}%;--size:${size}px;--time:${3 + random() * 6}s;--wait:-${random() * 10}s"></i>`;
  }).join('');

  document.getElementById('grass').innerHTML = Array.from({ length: 15 }, (_, i) => {
    const root = 362 + i * 12;
    const side = i < 7 ? -1 : 1;
    const spread = 45 + random() * 120;
    const height = 90 + random() * 130;
    return `<g class="blade-growth" style="--delay:${random() * .8}s">
      <path d="M${root} 719Q${root + side * spread * .13} ${719 - height * .8} ${root + side * spread} ${719 - height}Q${root + side * spread * .29} ${719 - height * .5} ${root + 7} 719Z" fill="url(#blade)" opacity="${.25 + random() * .28}"/>
    </g>`;
  }).join('');

  document.getElementById('fireflies').innerHTML = Array.from({ length: 18 }, () =>
    `<i class="firefly" style="--x:${16 + random() * 68}%;--y:${16 + random() * 72}%;--time:${4 + random() * 5}s;--delay:${random() * 7}s;--dx:${-25 + random() * 50}px"></i>`
  ).join('');

  function reveal() {
    if (blooming) return;
    blooming = true;
    intro.setAttribute('aria-hidden', 'true');
    intro.inert = true;
    garden.removeAttribute('aria-hidden');
    garden.inert = false;
    body.classList.add('bloomed', 'growing');
    announcement.textContent = 'Your blue tulips are blooming. A little something, just for you.';
    window.setTimeout(() => replayButton.focus({ preventScroll: true }), reducedMotion.matches ? 20 : 4700);
  }
  bloomButton.addEventListener('click', reveal);

  replayButton.addEventListener('click', () => {
    if (!blooming || replayTimer !== null) return;
    replayButton.disabled = true;
    body.classList.remove('growing');
    announcement.textContent = 'Your tulips are blooming again.';
    // A paint boundary restarts the stem and petal animations together.
    replayTimer = window.setTimeout(() => {
      body.classList.add('growing');
      replayTimer = null;
      window.setTimeout(() => { replayButton.disabled = false; }, reducedMotion.matches ? 20 : 4700);
    }, 100);
  });

  document.getElementById('flower-stage').addEventListener('pointerdown', (event) => {
    if (!blooming || reducedMotion.matches || sparkleCount > 72) return;
    const count = 15;
    for (let i = 0; i < count; i++) {
      const point = document.createElement('i');
      point.className = 'sparkle';
      point.setAttribute('aria-hidden', 'true');
      const angle = (Math.PI * 2 * i) / count;
      const distance = 25 + random() * 80;
      point.style.cssText = `left:${event.clientX}px;top:${event.clientY}px;--dx:${Math.cos(angle) * distance}px;--dy:${Math.sin(angle) * distance - 30}px;--size:${1 + random() * 2}px`;
      body.appendChild(point);
      sparkleCount++;
      window.setTimeout(() => { point.remove(); sparkleCount--; }, 1700);
    }
  });

  // Quiet original bell tones, started only when the visitor switches sound on.
  let audio = null;
  let audioOn = false;
  let musicTimer = null;
  let sequence = 0;
  let soundBusy = false;
  const notes = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];

  function bell(frequency, delay, volume) {
    if (!audio) return;
    const now = audio.currentTime + delay;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + .08);
    gain.gain.exponentialRampToValueAtTime(.0001, now + 3.6);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 3.7);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  function musicPhrase() {
    if (!audioOn || document.hidden) return;
    const frequency = notes[sequence++ % notes.length];
    bell(frequency, 0, .035);
    bell(frequency * 2, .15, .009);
    bell(sequence % 4 < 2 ? 130.81 : 174.61, .1, .015);
  }

  function updateSound() {
    soundButton.setAttribute('aria-pressed', String(audioOn));
    soundButton.setAttribute('aria-label', audioOn ? 'Turn soft music off' : 'Turn soft music on');
    document.getElementById('sound-label').textContent = audioOn ? 'Sound on' : 'Sound off';
  }

  soundButton.addEventListener('click', async () => {
    if (soundBusy) return;
    soundBusy = true;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        announcement.textContent = 'Soft sound is unavailable in this browser. Enjoy your flowers.';
        return;
      }
      if (!audio) audio = new AudioContext();
      audioOn = !audioOn;
      if (audioOn) {
        await audio.resume();
        musicPhrase();
        musicTimer = window.setInterval(musicPhrase, 2400);
      } else {
        window.clearInterval(musicTimer);
        musicTimer = null;
        await audio.suspend();
      }
      updateSound();
    } catch {
      audioOn = false;
      window.clearInterval(musicTimer);
      musicTimer = null;
      updateSound();
      announcement.textContent = 'Sound could not start. Your flowers are still ready.';
    } finally {
      soundBusy = false;
    }
  });

  document.addEventListener('visibilitychange', async () => {
    if (!audio || !audioOn) return;
    try {
      if (document.hidden) await audio.suspend();
      else await audio.resume();
    } catch { /* Some mobile browsers wait for the next sound-button tap. */ }
  });
})();
