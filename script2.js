document.addEventListener('DOMContentLoaded', function () {
  // sideview
  const leftView = document.querySelector('.sideviewport.left');
  const rightView = document.querySelector('.sideviewport.right');

  function createBadgewindow(windowpiece) {
    if (!windowpiece) { return; }
    const col = document.createElement('div');
    col.className = 'badge';
    const badgearray = ['badge1.png', 'badge2.png', 'badge3.png'];
    for (var i = 0; i < badgearray.length; i++) {
      var src = badgearray[i];
      const img = document.createElement('img');
      img.src = `images/${src}`;
      img.alt = src;
      col.appendChild(img);
    }
    windowpiece.appendChild(col);
  }

  createBadgewindow(leftView);
  createBadgewindow(rightView);

  function ensureLayer(windowpiece) {
    if (!windowpiece) { return null; }
    let layer = windowpiece.querySelector('.side_img');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'side_img';
      windowpiece.appendChild(layer);
    }
    return layer;
  }

  const leftLayer = ensureLayer(leftView);
  const rightLayer = ensureLayer(rightView);

  function showSideImage(url) {
    if (!leftView || !rightView || !leftLayer || !rightLayer) { return; }

    const originalUrl = url.replace(/2(?=\.[a-zA-Z]+$)/, ''); //name2.jpg
    leftLayer.style.backgroundImage = `url('${originalUrl}')`;
    rightLayer.style.backgroundImage = `url('${originalUrl}')`;

    leftView.classList.add('show_img');
    rightView.classList.add('show_img');
  }

  function showcardImage(url) {
    console.log('Main image:', url);
  }



  function showBadges() {
    if (leftView) { leftView.classList.remove('show_img'); }
    if (rightView) { rightView.classList.remove('show_img'); }
    if (leftLayer) { leftLayer.style.backgroundImage = ''; }
    if (rightLayer) { rightLayer.style.backgroundImage = ''; }
  }

  const cards = document.querySelectorAll('.card');
  for (var c = 0; c < cards.length; c++) {
    (function (card) {
      card.addEventListener('mouseover', function () {
        const img = card.querySelector('.card_img');
        const src = img ? img.getAttribute('src') : null;
        if (src) {
          showcardImage(src);
          showSideImage(src);
        }
      });
      card.addEventListener('mouseout', showBadges);
    })(cards[c]);
  }


  const viewportReset = document.querySelector('.viewport');
  if (viewportReset) {
    viewportReset.addEventListener('mouseout', function (e) {
      const related = e.relatedTarget;
      if (!related || !viewportReset.contains(related)) {
        showBadges();
      }
    });
  }

  const track = document.getElementById('track');
  const buttons = document.querySelectorAll('.scroll');
  if (!track || buttons.length === 0) { return; }

  const VISIBLE = 3;
  const STEP = 324;
  const total = track.children.length;
  const maxIndex = Math.max(0, total - VISIBLE);
  let index = 0;

  function transformStart(animate) {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(${-STEP * index}px)`;
  }

  function move(dir) {
    index += dir;
    if (index < 0) { index = 0; }
    if (index > maxIndex) { index = maxIndex; }
    transformStart(true);
  }

  transformStart(false);
  for (var b = 0; b < buttons.length; b++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        const label = (btn.getAttribute('aria-label') || btn.textContent || '').toLowerCase();
        const isRight = (label.indexOf('right') !== -1) || (label.indexOf('›') !== -1) || (label.indexOf('>') !== -1);
        move(isRight ? 1 : -1);
      });
    })(buttons[b]);
  }
  window.addEventListener('resize', function () { transformStart(false); });

  //popup window
  function openPopupFromCard(card) {
    //player voiceline
    const _h3 = card.querySelector('h3');
    const _nameText = _h3 && _h3.textContent ? _h3.textContent.trim().toLowerCase() : '';
    const name = _nameText || '';
    const soundPath = `sounds/${name}.mp3`;
    const sound = new Audio(soundPath);
    sound.currentTime = 0;
    var voiceplay = sound.play();
    if (voiceplay && typeof voiceplay.catch === 'function') { voiceplay.catch(function () {}); }

    // setup popup window
    const popup = document.createElement('div');
    popup.className ='popup';

    const shell = document.createElement('div');
    shell.className = 'popupcard';

    const cloned = card.cloneNode(true);
    let details = cloned.querySelector('.details');
    if (!details) {
      details = document.createElement('div');
      details.className = 'details';
      details.textContent = 'detailed graph';
      cloned.appendChild(details);
    }
    shell.appendChild(cloned);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'popupclose';
    closeBtn.textContent = 'Close';
    shell.style.position = 'relative';
    shell.appendChild(closeBtn);

    popup.appendChild(shell);
    document.body.appendChild(popup);

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    function close() {
      popup.classList.remove('show');
      setTimeout(function () {
        document.body.removeChild(popup);
        document.documentElement.style.overflow = prevOverflow || '';
      }, 250);
    }


    popup.addEventListener('click', function (e) {
      if (e.target === popup) { close(); }
    });
    closeBtn.addEventListener('click', close);

    setTimeout(function () { popup.classList.add('show'); }, 0);
  }

  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      const img = card.querySelector('.card_img');
      if (!img) { return; }
      img.addEventListener('click', function () { openPopupFromCard(card); });
    })(cards[i]);
  }
});
