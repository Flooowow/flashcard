// ==================== DONNÉES ====================
let cards = [];
let currentCardId = null;
let currentEditId = null;
let currentQuizIndex = 0;
let quizCards = [];
let quizStats = { correct: 0, wrong: 0 };

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
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

  // Export / Import
  document.getElementById('exportBtn').addEventListener('click', exportCards);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importCards);

  // Mode quiz
  document.getElementById('verifyBtn').addEventListener('click', verifyAnswer);
  document.getElementById('quizInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyAnswer();
  });
  document.getElementById('nextCardBtn').addEventListener('click', nextQuizCard);
  document.getElementById('prevCardBtn').addEventListener('click', prevQuizCard);
  document.getElementById('restartQuizBtn').addEventListener('click', startQuiz);
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

// ==================== CARDS MANAGEMENT ====================
function createNewCard() {
  const newCard = {
    id: Date.now(),
    artist: '',
    title: '',
    date: '',
    image: null,
    order: cards.length
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

  // Mise à jour UI
  document.querySelectorAll('.card-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.cardId) === cardId);
  });

  // Afficher l'éditeur
  document.querySelector('.editor-content .empty-state')?.remove();
  const editor = document.getElementById('cardEditor');
  editor.style.display = 'block';

  // Remplir le formulaire
  document.getElementById('cardArtist').value = card.artist || '';
  document.getElementById('cardTitle').value = card.title || '';
  document.getElementById('cardDate').value = card.date || '';

  // Afficher l'image si elle existe
  const preview = document.getElementById('imagePreview');
  if (card.image) {
    preview.innerHTML = `<img src="${card.image}" alt="Aperçu">`;
  } else {
    preview.innerHTML = '';
  }
}

function saveCard() {
  const card = cards.find(c => c.id === currentEditId);
  if (!card) return;

  const artist = document.getElementById('cardArtist').value.trim();
  const title = document.getElementById('cardTitle').value.trim();
  const date = document.getElementById('cardDate').value.trim();

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

  renderCardsList();
  saveToLocalStorage();
  showToast('Carte enregistrée !', 'success');
}

function deleteCard() {
  if (!currentEditId) return;
  
  if (!confirm('Voulez-vous vraiment supprimer cette carte ?')) return;

  cards = cards.filter(c => c.id !== currentEditId);
  currentEditId = null;
  
  // Réinitialiser l'éditeur
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

function cancelEdit() {
  if (currentEditId) {
    const card = cards.find(c => c.id === currentEditId);
    if (card && !card.artist && !card.title && !card.date) {
      // Si la carte est vide, la supprimer
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
    return;
  }

  container.innerHTML = cards.map(card => {
    const displayTitle = card.title || 'Sans titre';
    const displayArtist = card.artist || 'Artiste inconnu';
    const displayDate = card.date || '?';
    const thumbnail = card.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23e5e7eb" width="60" height="60"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3E🎨%3C/text%3E%3C/svg%3E';

    return `
      <div class="card-item ${currentEditId === card.id ? 'active' : ''}" 
           data-card-id="${card.id}"
           onclick="selectCard(${card.id})">
        <img src="${thumbnail}" alt="${displayTitle}" class="card-item-thumb">
        <div class="card-item-info">
          <div class="card-item-title">${escapeHtml(displayTitle)}</div>
          <div class="card-item-meta">${escapeHtml(displayArtist)} - ${escapeHtml(displayDate)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== QUIZ MODE ====================
function startQuiz() {
  // Filtrer les cartes complètes
  quizCards = cards.filter(c => c.artist && c.title && c.date && c.image);
  
  if (quizCards.length === 0) {
    document.getElementById('quizEmpty').style.display = 'block';
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    return;
  }

  // Mélanger les cartes
  quizCards = shuffleArray([...quizCards]);
  
  // Réinitialiser
  currentQuizIndex = 0;
  quizStats = { correct: 0, wrong: 0 };
  
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
  
  // Mise à jour de l'image
  document.getElementById('quizCardImage').src = card.image;
  
  // Réinitialiser l'input et le feedback
  document.getElementById('quizInput').value = '';
  document.getElementById('quizInput').disabled = false;
  document.getElementById('verifyBtn').disabled = false;
  document.getElementById('quizFeedback').style.display = 'none';
  
  // Mise à jour de la progression
  updateQuizProgress();
  
  // Mise à jour des boutons de navigation
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
  
  // Vérification flexible
  const artistMatch = userAnswer.includes(card.artist.toLowerCase());
  const titleMatch = userAnswer.includes(card.title.toLowerCase());
  
  const isCorrect = artistMatch && titleMatch;
  
  // Mise à jour des stats
  if (isCorrect) {
    quizStats.correct++;
  } else {
    quizStats.wrong++;
  }
  
  // Afficher le feedback
  const feedback = document.getElementById('quizFeedback');
  feedback.style.display = 'block';
  feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
  
  document.querySelector('.feedback-icon').textContent = isCorrect ? '✅' : '❌';
  document.querySelector('.feedback-text').textContent = isCorrect ? 
    'Bravo ! Bonne réponse' : 'Pas tout à fait...';
  document.getElementById('correctAnswer').textContent = correctAnswer;
  
  // Désactiver l'input
  input.disabled = true;
  document.getElementById('verifyBtn').disabled = true;
  
  updateQuizProgress();
}

function nextQuizCard() {
  if (currentQuizIndex < quizCards.length - 1) {
    currentQuizIndex++;
    showQuizCard();
  } else {
    showQuizResults();
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
  
  document.getElementById('correctCount').textContent = quizStats.correct;
  document.getElementById('wrongCount').textContent = quizStats.wrong;
  document.getElementById('scorePercent').textContent = percentage + '%';
  
  // Désactiver le bouton suivant
  document.getElementById('nextCardBtn').disabled = true;
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
  
  // Nom du fichier avec date
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
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      
      // Validation
      if (!imported.cards || !Array.isArray(imported.cards)) {
        showToast('❌ Fichier invalide', 'error');
        return;
      }

      // Confirmation si des cartes existent déjà
      if (cards.length > 0) {
        const replace = confirm(
          `⚠️ Vous avez déjà ${cards.length} carte(s).\n\n` +
          `Voulez-vous :\n` +
          `• OK = REMPLACER toutes vos cartes par les ${imported.cards.length} carte(s) du fichier\n` +
          `• Annuler = AJOUTER les ${imported.cards.length} carte(s) aux cartes existantes`
        );

        if (replace) {
          cards = imported.cards;
          showToast(`✅ ${imported.cards.length} carte(s) restaurée(s) !`, 'success');
        } else {
          // Ajouter avec nouveaux IDs pour éviter les conflits
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

      // Réinitialiser l'éditeur
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
  event.target.value = ''; // Reset input
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
    }
  } catch (e) {
    console.error('Erreur de chargement:', e);
    cards = [];
  }
}

// ==================== EXPORT / IMPORT ====================
function exportData() {
  const dataStr = JSON.stringify(cards, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `flashcards-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Export réussi !', 'success');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        cards = imported;
        renderCardsList();
        saveToLocalStorage();
        showToast('Import réussi !', 'success');
      }
    } catch (err) {
      showToast('Erreur d\'import', 'error');
    }
  };
  reader.readAsText(file);
}

// Rendre les fonctions globales pour onclick
window.selectCard = selectCard;
