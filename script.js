// ==================== DONNÉES ====================
let cards = [];
let currentCardId = null;
let currentEditId = null;
let currentQuizIndex = 0;
let quizCards = [];
let quizStats = { correct: 0, wrong: 0, artistPoints: 0, titlePoints: 0, datePoints: 0, totalPoints: 0, maxPoints: 0 };
let quizHistory = []; // Historique des sessions
let quizMode = 'all'; // 'all' ou 'towork'
let quizAnswered = false;
let currentSessionDetails = []; // Détails de la session en cours

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  loadHistoryFromLocalStorage();
  setupEventListeners();
  renderCardsList();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Basculer entre modes
  document.getElementById('editModeBtn').addEventListener('click', () => switchMode('edit'));
  document.getElementById('quizModeBtn').addEventListener('click', () => switchMode('quiz'));

  // Mode édition
  document.getElementById('addCardBtn').addEventListener('click', createNewCard);
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    sortCards(e.target.value);
    renderCardsList();
  });
  document.getElementById('cardImage').addEventListener('change', handleImageUpload);
  document.getElementById('saveCardBtn').addEventListener('click', saveCard);
  document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
  document.getElementById('deleteCardBtn').addEventListener('click', deleteCard);
  document.getElementById('toggleToWorkBtn').addEventListener('click', toggleToWork);
  document.getElementById('resetStatsBtn').addEventListener('click', resetCardStats);

  // Export / Import
  document.getElementById('exportBtn').addEventListener('click', exportCards);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importCards);

  // Mode quiz
  document.getElementById('verifyBtn').addEventListener('click', verifyAnswer);
  document.getElementById('saveNoteBtn').addEventListener('click', saveNoteFromQuiz);
  document.getElementById('nextCardBtn').addEventListener('click', () => {
    nextQuizCard();
  });
  
  document.addEventListener('keydown', function(e) {
    const quizCard = document.getElementById('quizCard');
    const quizMode = document.getElementById('quizMode');
    
    if (!quizMode.classList.contains('active')) return;
    if (!quizCard || quizCard.style.display === 'none') return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      
      if (!quizAnswered) {
        verifyAnswer();
      } else {
        nextQuizCard();
      }
    }
  });
  document.getElementById('prevCardBtn').addEventListener('click', prevQuizCard);
  document.getElementById('restartQuizBtn').addEventListener('click', startQuiz);
  document.getElementById('viewHistoryBtn').addEventListener('click', showHistoryModal);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  
  // 🆕 Bouton pour voir les statistiques de session
  document.getElementById('viewSessionStatsBtn').addEventListener('click', showSessionStatsModal);
  document.getElementById('closeSessionStatsBtn').addEventListener('click', closeSessionStatsModal);

  // Sélecteurs de mode quiz
  document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.quiz-mode-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      quizMode = e.target.dataset.mode;
      startQuiz();
    });
  });
}

// ==================== MODE SWITCHING ====================
function switchMode(mode) {
  const editMode = document.getElementById('editMode');
  const quizMode = document.getElementById('quizMode');
  const editBtn = document.getElementById('editModeBtn');
  const quizBtn = document.getElementById('quizModeBtn');

  if (mode === 'edit') {
    editMode.classList.add('active');
    quizMode.classList.remove('active');
    editBtn.classList.add('active');
    quizBtn.classList.remove('active');
  } else {
    editMode.classList.remove('active');
    quizMode.classList.add('active');
    editBtn.classList.remove('active');
    quizBtn.classList.add('active');
    startQuiz();
  }
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== CONFIRMATION MODAL ====================
function showConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    
    modal.style.display = 'flex';
    
    const handleYes = () => {
      modal.style.display = 'none';
      cleanup();
      resolve(true);
    };
    
    const handleNo = () => {
      modal.style.display = 'none';
      cleanup();
      resolve(false);
    };
    
    const yesBtn = document.getElementById('confirmYes');
    const noBtn = document.getElementById('confirmNo');
    
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleNo();
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    function cleanup() {
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
      document.removeEventListener('keydown', handleEscape);
    }
  });
}

// ==================== CARDS MANAGEMENT ====================
function createNewCard() {
  const newCard = {
    id: Date.now(),
    artist: '',
    title: '',
    date: '',
    image: null,
    note: '',
    hasError: false,
    order: cards.length,
    toWork: false,
    stats: {
      played: 0,
      correct: 0,
      wrong: 0,
      successRate: 0
    }
  };
  cards.push(newCard);
  renderCardsList();
  selectCard(newCard.id);
  showToast('Nouvelle carte créée', 'success');
  saveToLocalStorage();
}

function selectCard(cardId) {
  currentEditId = cardId;
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  if (!card.stats) {
    card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0 };
  }
  if (card.toWork === undefined) {
    card.toWork = false;
  }

  document.querySelectorAll('.card-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.cardId) === cardId);
  });

  document.querySelector('.editor-content .empty-state')?.remove();
  const editor = document.getElementById('cardEditor');
  editor.style.display = 'block';

  document.getElementById('cardArtist').value = card.artist || '';
  document.getElementById('cardTitle').value = card.title || '';
  document.getElementById('cardDate').value = card.date || '';
  document.getElementById('cardNote').value = card.note || '';

  const preview = document.getElementById('imagePreview');
  if (card.image) {
    preview.innerHTML = `<img src="${card.image}" alt="Aperçu">`;
  } else {
    preview.innerHTML = '';
  }

  const toWorkBtn = document.getElementById('toggleToWorkBtn');
  if (card.toWork) {
    toWorkBtn.textContent = '✅ À travailler';
    toWorkBtn.classList.add('active');
  } else {
    toWorkBtn.textContent = '⭐ À travailler';
    toWorkBtn.classList.remove('active');
  }

  document.getElementById('statPlayed').textContent = card.stats.played;
  document.getElementById('statCorrect').textContent = card.stats.correct;
  document.getElementById('statWrong').textContent = card.stats.wrong;
  document.getElementById('statRate').textContent = card.stats.successRate + '%';
}

function saveCard() {
  const card = cards.find(c => c.id === currentEditId);
  if (!card) return;

  const artist = document.getElementById('cardArtist').value.trim();
  const title = document.getElementById('cardTitle').value.trim();
  const date = document.getElementById('cardDate').value.trim();
  const note = document.getElementById('cardNote').value.trim();

  if (!artist || !title || !date) {
    showToast('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }

  if (!card.image) {
    showToast('Veuillez ajouter une image', 'error');
    return;
  }

  card.artist = artist;
  card.title = title;
  card.date = date;
  card.note = note;

  renderCardsList();
  saveToLocalStorage();
  showToast('Carte enregistrée !', 'success');
  updateGlobalStats();
}

async function deleteCard() {
  if (!currentEditId) return;
  
  const confirmed = await showConfirm(
    'Supprimer la carte ?',
    'Voulez-vous vraiment supprimer cette carte ? Cette action est irréversible.'
  );
  
  if (!confirmed) return;

  cards = cards.filter(c => c.id !== currentEditId);
  currentEditId = null;
  
  document.getElementById('cardEditor').style.display = 'none';
  const editorContent = document.querySelector('.editor-content');
  if (!document.querySelector('.empty-state')) {
    editorContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎨</div>
        <h3>Aucune carte sélectionnée</h3>
        <p>Sélectionnez une carte ou créez-en une nouvelle</p>
      </div>
    `;
  }

  renderCardsList();
  saveToLocalStorage();
  showToast('Carte supprimée', 'info');
}

function toggleToWork() {
  if (!currentEditId) return;
  const card = cards.find(c => c.id === currentEditId);
  if (!card) return;

  card.toWork = !card.toWork;
  
  const btn = document.getElementById('toggleToWorkBtn');
  if (card.toWork) {
    btn.textContent = '✅ À travailler';
    btn.classList.add('active');
    showToast('Carte ajoutée à "À travailler"', 'success');
  } else {
    btn.textContent = '⭐ À travailler';
    btn.classList.remove('active');
    showToast('Carte retirée de "À travailler"', 'info');
  }

  saveToLocalStorage();
  renderCardsList();
}

async function resetCardStats() {
  if (!currentEditId) return;
  
  const confirmed = await showConfirm(
    'Réinitialiser les statistiques ?',
    'Voulez-vous remettre à zéro toutes les statistiques de cette carte ?'
  );
  
  if (!confirmed) return;

  const card = cards.find(c => c.id === currentEditId);
  if (!card) return;

  card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0 };
  
  document.getElementById('statPlayed').textContent = '0';
  document.getElementById('statCorrect').textContent = '0';
  document.getElementById('statWrong').textContent = '0';
  document.getElementById('statRate').textContent = '0%';

  saveToLocalStorage();
  showToast('Statistiques réinitialisées', 'success');
}

function cancelEdit() {
  if (currentEditId) {
    const card = cards.find(c => c.id === currentEditId);
    if (card && !card.artist && !card.title && !card.date) {
      cards = cards.filter(c => c.id !== currentEditId);
      renderCardsList();
      saveToLocalStorage();
    }
  }
  
  currentEditId = null;
  document.getElementById('cardEditor').style.display = 'none';
  const editorContent = document.querySelector('.editor-content');
  if (!document.querySelector('.empty-state')) {
    editorContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎨</div>
        <h3>Aucune carte sélectionnée</h3>
        <p>Sélectionnez une carte ou créez-en une nouvelle</p>
      </div>
    `;
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const card = cards.find(c => c.id === currentEditId);
    if (card) {
      card.image = event.target.result;
      document.getElementById('imagePreview').innerHTML = 
        `<img src="${event.target.result}" alt="Aperçu">`;
      saveToLocalStorage();
    }
  };
  reader.readAsDataURL(file);
}

function sortCards(sortType) {
  switch(sortType) {
    case 'date-asc':
      cards.sort((a, b) => {
        const dateA = parseInt(a.date) || 0;
        const dateB = parseInt(b.date) || 0;
        return dateA - dateB;
      });
      break;
    case 'date-desc':
      cards.sort((a, b) => {
        const dateA = parseInt(a.date) || 0;
        const dateB = parseInt(b.date) || 0;
        return dateB - dateA;
      });
      break;
    case 'artist':
      cards.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
      break;
    case 'order':
    default:
      cards.sort((a, b) => a.order - b.order);
      break;
  }
}

function renderCardsList() {
  const container = document.getElementById('cardsList');
  
  if (cards.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 20px;">
        <p style="text-align: center; color: #6b7280;">Aucune carte pour le moment</p>
      </div>
    `;
    updateGlobalStats();
    return;
  }

  container.innerHTML = cards.map(card => {
    const displayTitle = card.title || 'Sans titre';
    const displayArtist = card.artist || 'Artiste inconnu';
    const displayDate = card.date || '?';
    const thumbnail = card.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23e5e7eb" width="60" height="60"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3E🎨%3C/text%3E%3C/svg%3E';
    const toWorkBadge = card.toWork ? '<span class="towork-badge">⭐</span>' : '';
    const errorBadge = card.hasError ? '<span class="error-badge" title="Erreur signalée">⚠️</span>' : '';

    return `
      <div class="card-item ${currentEditId === card.id ? 'active' : ''}" 
           data-card-id="${card.id}"
           onclick="selectCard(${card.id})">
        <img src="${thumbnail}" alt="${displayTitle}" class="card-item-thumb">
        <div class="card-item-info">
          <div class="card-item-title">${escapeHtml(displayTitle)} ${toWorkBadge}</div>
          <div class="card-item-meta">${escapeHtml(displayArtist)} - ${escapeHtml(displayDate)}</div>
        </div>
        ${errorBadge}
      </div>
    `;
  }).join('');
  
  updateGlobalStats();
}

function updateGlobalStats() {
  const totalCards = cards.length;
  const toWorkCards = cards.filter(c => c.toWork).length;
  
  let totalPlayed = 0;
  let totalCorrect = 0;
  
  cards.forEach(card => {
    if (card.stats) {
      totalPlayed += card.stats.played;
      totalCorrect += card.stats.correct;
    }
  });
  
  const globalSuccessRate = totalPlayed > 0 ? Math.round((totalCorrect / totalPlayed) * 100) : 0;
  
  document.getElementById('globalTotalCards').textContent = totalCards;
  document.getElementById('globalToWork').textContent = toWorkCards;
  document.getElementById('globalSuccessRate').textContent = globalSuccessRate + '%';
}

// ==================== QUIZ MODE ====================
function startQuiz() {
  let availableCards = cards.filter(c => c.artist && c.title && c.date && c.image);
  
  if (quizMode === 'towork') {
    availableCards = availableCards.filter(c => c.toWork);
    if (availableCards.length === 0) {
      showToast('Aucune carte marquée "À travailler"', 'error');
      document.getElementById('quizEmpty').style.display = 'block';
      document.getElementById('quizCard').style.display = 'none';
      document.getElementById('quizResult').style.display = 'none';
      return;
    }
  }
  
  if (availableCards.length === 0) {
    document.getElementById('quizEmpty').style.display = 'block';
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    return;
  }

  quizCards = shuffleArray([...availableCards]);
  currentQuizIndex = 0;
  quizStats = { correct: 0, wrong: 0, artistPoints: 0, titlePoints: 0, datePoints: 0, totalPoints: 0, maxPoints: 0 };
  quizAnswered = false;
  currentSessionDetails = [];
  
  document.getElementById('quizEmpty').style.display = 'none';
  document.getElementById('quizCard').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  
  showQuizCard();
}

function showQuizCard() {
  if (currentQuizIndex >= quizCards.length) {
    showQuizResults();
    return;
  }

  const card = quizCards[currentQuizIndex];
  
  document.getElementById('quizCardImage').src = card.image;
  
  const input = document.getElementById('quizInput');
  input.value = '';
  input.disabled = false;
  input.focus();
  
  document.getElementById('verifyBtn').disabled = false;
  document.getElementById('quizFeedback').style.display = 'none';
  
  quizAnswered = false;
  
  updateQuizProgress();
  
  document.getElementById('prevCardBtn').disabled = currentQuizIndex === 0;
  document.getElementById('nextCardBtn').disabled = false;
}

function verifyAnswer() {
  const input = document.getElementById('quizInput');
  const userAnswer = input.value.trim().toLowerCase();
  
  if (!userAnswer) {
    showToast('Veuillez entrer une réponse', 'error');
    return;
  }

  const card = quizCards[currentQuizIndex];
  const correctAnswer = `${card.artist} - ${card.title} - ${card.date}`;
  
  // 🆕 Vérification détaillée avec points
  const artistMatch = userAnswer.includes(card.artist.toLowerCase());
  const titleMatch = userAnswer.includes(card.title.toLowerCase());
  const dateMatch = userAnswer.includes(card.date.toLowerCase());
  
  let points = 0;
  if (artistMatch) points++;
  if (titleMatch) points++;
  if (dateMatch) points++;
  
  const isCorrect = artistMatch && titleMatch && dateMatch;
  
  // 🆕 Mise à jour des points détaillés
  if (artistMatch) quizStats.artistPoints++;
  if (titleMatch) quizStats.titlePoints++;
  if (dateMatch) quizStats.datePoints++;
  quizStats.totalPoints += points;
  quizStats.maxPoints += 3;
  
  if (isCorrect) {
    quizStats.correct++;
  } else {
    quizStats.wrong++;
  }
  
  // 🆕 Enregistrer les détails de la réponse
  currentSessionDetails.push({
    cardId: card.id,
    artist: card.artist,
    title: card.title,
    date: card.date,
    userAnswer: input.value,
    artistMatch,
    titleMatch,
    dateMatch,
    points,
    isCorrect
  });

  if (!card.stats) {
    card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0 };
  }
  card.stats.played++;
  if (isCorrect) {
    card.stats.correct++;
  } else {
    card.stats.wrong++;
  }
  card.stats.successRate = Math.round((card.stats.correct / card.stats.played) * 100);
  
  saveToLocalStorage();
  
  const feedback = document.getElementById('quizFeedback');
  feedback.style.display = 'block';
  feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
  
  document.querySelector('.feedback-icon').textContent = isCorrect ? '✅' : '❌';
  document.querySelector('.feedback-text').textContent = isCorrect ? 
    `Bravo ! Bonne réponse (${points}/3 points)` : `Pas tout à fait... (${points}/3 points)`;
  
  const correctAnswerEl = document.getElementById('correctAnswer');
  if (isCorrect) {
    correctAnswerEl.textContent = correctAnswer;
  } else {
    let displayAnswer = '';
    
    if (!artistMatch) {
      displayAnswer += `<strong style="color: var(--danger);">${card.artist}</strong> - `;
    } else {
      displayAnswer += `<strong style="color: var(--success);">✓ ${card.artist}</strong> - `;
    }
    
    if (!titleMatch) {
      displayAnswer += `<strong style="color: var(--danger);">${card.title}</strong> - `;
    } else {
      displayAnswer += `<strong style="color: var(--success);">✓ ${card.title}</strong> - `;
    }
    
    if (!dateMatch) {
      displayAnswer += `<strong style="color: var(--danger);">${card.date}</strong>`;
    } else {
      displayAnswer += `<strong style="color: var(--success);">✓ ${card.date}</strong>`;
    }
    
    correctAnswerEl.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>Votre réponse :</strong> <span style="color: var(--anthracite);">${escapeHtml(input.value)}</span>
      </div>
      <div>
        <strong>Réponse correcte :</strong><br>${displayAnswer}
      </div>
    `;
  }
  
  // 📝 Afficher le champ note modifiable avec la note existante
  const noteInput = document.getElementById('noteInput');
  noteInput.value = card.note || '';
  
  // ⚠️ Afficher l'état de la checkbox hasError
  const cardErrorCheckbox = document.getElementById('cardErrorCheckbox');
  cardErrorCheckbox.checked = card.hasError || false;
  
  input.disabled = true;
  document.getElementById('verifyBtn').disabled = true;
  
  quizAnswered = true;
  
  updateQuizProgress();
}

function nextQuizCard() {
  if (currentQuizIndex < quizCards.length - 1) {
    currentQuizIndex++;
    quizAnswered = false;
    showQuizCard();
  } else {
    showQuizResults();
  }
}

function saveNoteFromQuiz() {
  const card = quizCards[currentQuizIndex];
  const noteInput = document.getElementById('noteInput');
  const noteValue = noteInput.value.trim();
  const cardErrorCheckbox = document.getElementById('cardErrorCheckbox');
  const hasError = cardErrorCheckbox.checked;
  
  // Trouver la carte dans le tableau principal et mettre à jour
  const originalCard = cards.find(c => c.id === card.id);
  if (originalCard) {
    originalCard.note = noteValue;
    originalCard.hasError = hasError;
    card.note = noteValue;
    card.hasError = hasError;
    saveToLocalStorage();
    
    if (hasError) {
      showToast('📝 Note sauvegardée + Erreur signalée ⚠️', 'success');
    } else {
      showToast('📝 Note sauvegardée !', 'success');
    }
    
    // Mettre à jour l'affichage dans la liste si on est en mode édition
    renderCardsList();
  }
}

function prevQuizCard() {
  if (currentQuizIndex > 0) {
    currentQuizIndex--;
    showQuizCard();
  }
}

function updateQuizProgress() {
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  
  progressText.textContent = `${currentQuizIndex + 1} / ${quizCards.length}`;
  
  const percentage = ((currentQuizIndex + 1) / quizCards.length) * 100;
  progressFill.style.width = percentage + '%';
}

function showQuizResults() {
  document.getElementById('quizCard').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  
  const total = quizStats.correct + quizStats.wrong;
  const percentage = total > 0 ? Math.round((quizStats.correct / total) * 100) : 0;
  const pointsPercentage = quizStats.maxPoints > 0 ? Math.round((quizStats.totalPoints / quizStats.maxPoints) * 100) : 0;
  
  document.getElementById('correctCount').textContent = quizStats.correct;
  document.getElementById('wrongCount').textContent = quizStats.wrong;
  document.getElementById('scorePercent').textContent = percentage + '%';
  document.getElementById('pointsScore').textContent = `${quizStats.totalPoints}/${quizStats.maxPoints}`;
  document.getElementById('pointsPercent').textContent = pointsPercentage + '%';
  
  // 🆕 Enregistrer l'historique avec les détails
  const historyEntry = {
    date: new Date().toISOString(),
    mode: quizMode,
    total: total,
    correct: quizStats.correct,
    wrong: quizStats.wrong,
    percentage: percentage,
    artistPoints: quizStats.artistPoints,
    titlePoints: quizStats.titlePoints,
    datePoints: quizStats.datePoints,
    totalPoints: quizStats.totalPoints,
    maxPoints: quizStats.maxPoints,
    pointsPercentage: pointsPercentage,
    details: currentSessionDetails
  };
  quizHistory.push(historyEntry);
  saveHistoryToLocalStorage();
  
  document.getElementById('nextCardBtn').disabled = true;
}

// ==================== SESSION STATS MODAL ====================
function showSessionStatsModal() {
  const modal = document.getElementById('sessionStatsModal');
  modal.style.display = 'flex';
  renderSessionStats();
}

function closeSessionStatsModal() {
  document.getElementById('sessionStatsModal').style.display = 'none';
}

function renderSessionStats() {
  const container = document.getElementById('sessionStatsList');
  
  if (quizHistory.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📊</div>
        <p>Aucune session enregistrée</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = [...quizHistory].reverse().map((session, index) => {
    const date = new Date(session.date);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const modeLabel = session.mode === 'all' ? '📚 Toutes les cartes' : '⭐ À travailler';
    
    // Calculer les pourcentages par composant
    const artistPercent = session.total > 0 ? Math.round((session.artistPoints / session.total) * 100) : 0;
    const titlePercent = session.total > 0 ? Math.round((session.titlePoints / session.total) * 100) : 0;
    const datePercent = session.total > 0 ? Math.round((session.datePoints / session.total) * 100) : 0;
    
    return `
      <div class="session-stats-item">
        <div class="session-header">
          <div>
            <div class="session-date">${dateStr}</div>
            <div class="session-mode">${modeLabel}</div>
          </div>
          <div class="session-score-badge">
            ${session.totalPoints}/${session.maxPoints} pts
          </div>
        </div>
        
        <div class="session-points-grid">
          <div class="session-point-box">
            <div class="session-point-icon">👤</div>
            <div class="session-point-label">Artiste</div>
            <div class="session-point-value">${session.artistPoints}/${session.total}</div>
            <div class="session-point-bar">
              <div class="session-point-fill" style="width: ${artistPercent}%"></div>
            </div>
          </div>
          
          <div class="session-point-box">
            <div class="session-point-icon">🎨</div>
            <div class="session-point-label">Titre</div>
            <div class="session-point-value">${session.titlePoints}/${session.total}</div>
            <div class="session-point-bar">
              <div class="session-point-fill" style="width: ${titlePercent}%"></div>
            </div>
          </div>
          
          <div class="session-point-box">
            <div class="session-point-icon">📅</div>
            <div class="session-point-label">Date</div>
            <div class="session-point-value">${session.datePoints}/${session.total}</div>
            <div class="session-point-bar">
              <div class="session-point-fill" style="width: ${datePercent}%"></div>
            </div>
          </div>
        </div>
        
        <div class="session-details-toggle">
          <button class="btn btn-secondary btn-small" onclick="toggleSessionDetails(${quizHistory.length - 1 - index})">
            📋 Voir les détails
          </button>
        </div>
        
        <div id="sessionDetails${quizHistory.length - 1 - index}" class="session-details" style="display: none;">
          ${renderSessionDetails(session)}
        </div>
      </div>
    `;
  }).join('');
}

function toggleSessionDetails(sessionIndex) {
  const detailsEl = document.getElementById(`sessionDetails${sessionIndex}`);
  if (detailsEl.style.display === 'none') {
    detailsEl.style.display = 'block';
  } else {
    detailsEl.style.display = 'none';
  }
}

function renderSessionDetails(session) {
  if (!session.details || session.details.length === 0) {
    return '<p style="text-align: center; color: var(--gray-700); padding: 20px;">Détails non disponibles</p>';
  }
  
  return `
    <table class="session-details-table">
      <thead>
        <tr>
          <th>Œuvre</th>
          <th>Artiste</th>
          <th>Titre</th>
          <th>Date</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        ${session.details.map((detail, idx) => `
          <tr class="${detail.isCorrect ? 'detail-correct' : 'detail-wrong'}">
            <td>${idx + 1}</td>
            <td>${detail.artistMatch ? '✓' : '✗'}</td>
            <td>${detail.titleMatch ? '✓' : '✗'}</td>
            <td>${detail.dateMatch ? '✓' : '✗'}</td>
            <td><strong>${detail.points}/3</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ==================== UTILS ====================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== EXPORT / IMPORT ====================
function exportCards() {
  if (cards.length === 0) {
    showToast('Aucune carte à exporter', 'error');
    return;
  }

  const data = {
    version: '1.0',
    exported: new Date().toISOString(),
    totalCards: cards.length,
    cards: cards
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  
  const date = new Date().toISOString().split('T')[0];
  link.download = `quizart-backup-${date}.json`;
  
  link.click();
  URL.revokeObjectURL(url);
  
  showToast(`✅ ${cards.length} carte(s) sauvegardée(s) !`, 'success');
}

function importCards(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      
      if (!imported.cards || !Array.isArray(imported.cards)) {
        showToast('❌ Fichier invalide', 'error');
        return;
      }

      if (cards.length > 0) {
        const replace = await showConfirm(
          'Remplacer ou ajouter ?',
          `Vous avez déjà ${cards.length} carte(s).\n\nCliquez "Oui" pour REMPLACER toutes vos cartes par les ${imported.cards.length} carte(s) du fichier.\n\nCliquez "Non" pour AJOUTER les cartes aux existantes.`
        );

        if (replace) {
          cards = imported.cards;
          showToast(`✅ ${imported.cards.length} carte(s) restaurée(s) !`, 'success');
        } else {
          const newCards = imported.cards.map(card => ({
            ...card,
            id: Date.now() + Math.random(),
            order: cards.length + card.order
          }));
          cards = [...cards, ...newCards];
          showToast(`✅ ${newCards.length} carte(s) ajoutée(s) !`, 'success');
        }
      } else {
        cards = imported.cards;
        showToast(`✅ ${imported.cards.length} carte(s) restaurée(s) !`, 'success');
      }

      currentEditId = null;
      document.getElementById('cardEditor').style.display = 'none';
      
      renderCardsList();
      saveToLocalStorage();
      
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur : fichier corrompu', 'error');
    }
  };
  
  reader.readAsText(file);
  event.target.value = '';
}

// ==================== HISTORY ====================
function showHistoryModal() {
  const modal = document.getElementById('historyModal');
  modal.style.display = 'flex';
  renderHistory();
}

function closeHistoryModal() {
  document.getElementById('historyModal').style.display = 'none';
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  const historyChart = document.getElementById('historyChart');
  const historyEmpty = document.querySelector('.history-empty');

  if (quizHistory.length === 0) {
    historyEmpty.style.display = 'block';
    historyChart.style.display = 'none';
    historyList.innerHTML = '';
    return;
  }

  historyEmpty.style.display = 'none';
  historyChart.style.display = 'block';

  drawProgressChart();

  historyList.innerHTML = [...quizHistory].reverse().map((entry, index) => {
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const modeLabel = entry.mode === 'all' ? '📚 Toutes les cartes' : '⭐ À travailler';

    return `
      <div class="history-item">
        <div class="history-header">
          <span class="history-date">${dateStr}</span>
          <span class="history-mode">${modeLabel}</span>
        </div>
        <div class="history-stats">
          <div class="history-stat">
            <span class="history-stat-value">${entry.total}</span>
            <span class="history-stat-label">Questions</span>
          </div>
          <div class="history-stat">
            <span class="history-stat-value" style="color: var(--success)">${entry.correct}</span>
            <span class="history-stat-label">Réussies</span>
          </div>
          <div class="history-stat">
            <span class="history-stat-value" style="color: var(--gold)">${entry.percentage}%</span>
            <span class="history-stat-label">Score</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function drawProgressChart() {
  const canvas = document.getElementById('progressChart');
  const ctx = canvas.getContext('2d');
  
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  ctx.clearRect(0, 0, width, height);

  if (quizHistory.length === 0) return;

  const data = quizHistory.slice(-10);
  const step = chartWidth / (data.length - 1 || 1);

  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(padding, padding, chartWidth, chartHeight);

  ctx.strokeStyle = '#E8DCC8';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();

    ctx.fillStyle = '#5A5A5A';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText((100 - i * 25) + '%', padding - 10, y + 4);
  }

  ctx.strokeStyle = '#7C1D1D';
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.forEach((entry, index) => {
    const x = padding + step * index;
    const y = padding + chartHeight - (entry.percentage / 100) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  data.forEach((entry, index) => {
    const x = padding + step * index;
    const y = padding + chartHeight - (entry.percentage / 100) * chartHeight;
    
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#7C1D1D';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#5A5A5A';
    ctx.font = '11px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('#' + (quizHistory.length - data.length + index + 1), x, height - 15);
  });

  ctx.fillStyle = '#7C1D1D';
  ctx.font = 'bold 16px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('📈 Évolution de vos performances', width / 2, 25);
}

async function clearHistory() {
  const confirmed = await showConfirm(
    'Effacer l\'historique ?',
    'Voulez-vous vraiment supprimer tout l\'historique de vos quiz ? Cette action est irréversible.'
  );
  
  if (!confirmed) return;
  
  quizHistory = [];
  saveHistoryToLocalStorage();
  renderHistory();
  showToast('Historique effacé', 'info');
}

// ==================== STORAGE ====================
function saveToLocalStorage() {
  try {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  } catch (e) {
    console.error('Erreur de sauvegarde:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      cards = JSON.parse(saved);
      cards.forEach(card => {
        if (!card.stats) {
          card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0 };
        }
        if (card.toWork === undefined) {
          card.toWork = false;
        }
        if (card.note === undefined) {
          card.note = '';
        }
        if (card.hasError === undefined) {
          card.hasError = false;
        }
      });
    }
  } catch (e) {
    console.error('Erreur de chargement:', e);
    cards = [];
  }
}

function saveHistoryToLocalStorage() {
  try {
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  } catch (e) {
    console.error('Erreur sauvegarde historique:', e);
  }
}

function loadHistoryFromLocalStorage() {
  try {
    const saved = localStorage.getItem('quizHistory');
    if (saved) {
      quizHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erreur chargement historique:', e);
    quizHistory = [];
  }
}

window.selectCard = selectCard;
window.closeHistoryModal = closeHistoryModal;
window.closeSessionStatsModal = closeSessionStatsModal;
window.toggleSessionDetails = toggleSessionDetails;
