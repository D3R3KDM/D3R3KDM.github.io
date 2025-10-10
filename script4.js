document.addEventListener('DOMContentLoaded', function () {
  const leftView = document.querySelector('.sideviewport.left');
  const rightView = document.querySelector('.sideviewport.right');

  function createBadgewindow(windowpiece) {
    if (!windowpiece) return;
    const col = document.createElement('div');
    col.className = 'badge';
    const badgearray = ['badge1.png', 'badge2.png', 'badge3.png'];
    for (var i = 0; i < badgearray.length; i++) {
      var src = badgearray[i];
      const img = document.createElement('img');
      img.src = 'images/' + src;
      img.alt = src;
      col.appendChild(img);
    }
    windowpiece.appendChild(col);
  }

  createBadgewindow(leftView);
  createBadgewindow(rightView);

  function ensureLayer(windowpiece) {
    if (!windowpiece) return null;
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

  function stripTrailingTwo(u) {
    var dot = u.lastIndexOf('.');
    if (dot > 1 && u.charAt(dot - 1) === '2') {
      return u.slice(0, dot - 1) + u.slice(dot);
    }
    return u;
  }

  function showSideImage(url) {
    if (!leftView || !rightView || !leftLayer || !rightLayer) return;
    var originalUrl = stripTrailingTwo(url);
    leftLayer.style.backgroundImage = "url('" + originalUrl + "')";
    rightLayer.style.backgroundImage = "url('" + originalUrl + "')";
    leftView.classList.add('show_img');
    rightView.classList.add('show_img');
  }

  function showcardImage(url) {}

  function showBadges() {
    if (leftView) leftView.classList.remove('show_img');
    if (rightView) rightView.classList.remove('show_img');
    if (leftLayer) leftLayer.style.backgroundImage = '';
    if (rightLayer) rightLayer.style.backgroundImage = '';
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

  const popup = document.getElementById('popup');
  const popupImg = document.getElementById('popupImg');
  const popupTitle = document.getElementById('popupTitle');
  const popupBody = document.getElementById('popupBody');
  const popupClose = document.getElementById('popupClose');

  function openPopupFromCard(card) {
    const h3 = card.querySelector('h3');
    const nameText = h3 && h3.textContent ? h3.textContent.trim() : '';
    const nameLower = nameText.toLowerCase();
    const soundPath = 'sounds/' + nameLower + '.mp3';
    const sound = new Audio(soundPath);
    sound.currentTime = 0;
    sound.play();

    const img = card.querySelector('.card_img');
    const details = card.querySelector('.details');
    popupTitle.textContent = nameText;
    popupImg.src = img ? img.src : '';
    popupBody.innerHTML = details ? details.innerHTML : '';
    popup.classList.add('show');
    document.documentElement.classList.add('lockscroll');
  }

  function closePopup() {
    popup.classList.remove('show');
    document.documentElement.classList.remove('lockscroll');
    popupImg.src = '';
    popupTitle.textContent = '';
    popupBody.innerHTML = '';
  }

  popupClose.addEventListener('click', closePopup);
  popup.addEventListener('click', function (e) {
    if (e.target === popup) closePopup();
  });

  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      const img = card.querySelector('.card_img');
      if (!img) return;
      img.addEventListener('click', function () { openPopupFromCard(card); });
    })(cards[i]);
  }
});
