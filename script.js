// ==================== COMPRESSION ====================
// Bibliothèque de compression LZString (inline)
var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

// ==================== STORAGE SYSTEM ====================
const StorageManager = {
  STORAGE_KEY: 'quizart_data_v2',
  LEGACY_KEY: 'flashcards',
  HISTORY_KEY: 'quizart_history_v2',
  LEGACY_HISTORY_KEY: 'quizHistory',
  TIME_KEY: 'quizart_time_v2',
  LEGACY_TIME_KEY: 'totalQuizTime',

  // Sauvegarder les données compressées
  save(cards) {
    try {
      const data = {
        version: '2.0',
        timestamp: Date.now(),
        cards: cards
      };
      const json = JSON.stringify(data);
      const compressed = LZString.compressToUTF16(json);
      localStorage.setItem(this.STORAGE_KEY, compressed);
      
      // Calculer les stats de compression
      const originalSize = new Blob([json]).size;
      const compressedSize = new Blob([compressed]).size;
      const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      
      console.log(`💾 Sauvegarde: ${originalSize} → ${compressedSize} bytes (${ratio}% compression)`);
      return true;
    } catch (e) {
      console.error('❌ Erreur sauvegarde:', e);
      return false;
    }
  },

  // Charger les données compressées
  load() {
    try {
      // Essayer de charger la nouvelle version
      const compressed = localStorage.getItem(this.STORAGE_KEY);
      if (compressed) {
        const json = LZString.decompressFromUTF16(compressed);
        const data = JSON.parse(json);
        return data.cards || [];
      }
      
      // Sinon, migrer depuis l'ancien système
      return this.migrate();
    } catch (e) {
      console.error('❌ Erreur chargement:', e);
      // Tentative de migration en cas d'erreur
      return this.migrate();
    }
  },

  // Migration depuis l'ancien localStorage
  migrate() {
    try {
      const legacy = localStorage.getItem(this.LEGACY_KEY);
      if (legacy) {
        const cards = JSON.parse(legacy);
        console.log(`🔄 Migration: ${cards.length} cartes détectées`);
        
        // Normaliser les données
        cards.forEach(card => {
          if (!card.stats) {
            card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0, artistCorrect: 0, titleCorrect: 0, dateCorrect: 0 };
          }
          if (!card.stats.artistCorrect) card.stats.artistCorrect = 0;
          if (!card.stats.titleCorrect) card.stats.titleCorrect = 0;
          if (!card.stats.dateCorrect) card.stats.dateCorrect = 0;
          if (card.toWork === undefined) card.toWork = false;
          if (card.note === undefined) card.note = '';
          if (card.hasError === undefined) card.hasError = false;
          if (card.lastPlayed === undefined) card.lastPlayed = null;
        });
        
        // Sauvegarder dans le nouveau format
        this.save(cards);
        
        // Migrer l'historique
        this.migrateHistory();
        
        // Migrer le temps total
        this.migrateTime();
        
        console.log('✅ Migration terminée avec succès !');
        return cards;
      }
      
      return [];
    } catch (e) {
      console.error('❌ Erreur migration:', e);
      return [];
    }
  },

  // Migrer l'historique
  migrateHistory() {
    try {
      const legacyHistory = localStorage.getItem(this.LEGACY_HISTORY_KEY);
      if (legacyHistory) {
        const history = JSON.parse(legacyHistory);
        const compressed = LZString.compressToUTF16(legacyHistory);
        localStorage.setItem(this.HISTORY_KEY, compressed);
        console.log(`✅ Historique migré: ${history.length} sessions`);
      }
    } catch (e) {
      console.error('❌ Erreur migration historique:', e);
    }
  },

  // Migrer le temps total
  migrateTime() {
    try {
      const legacyTime = localStorage.getItem(this.LEGACY_TIME_KEY);
      if (legacyTime) {
        localStorage.setItem(this.TIME_KEY, legacyTime);
        console.log(`✅ Temps total migré: ${legacyTime}s`);
      }
    } catch (e) {
      console.error('❌ Erreur migration temps:', e);
    }
  },

  // Sauvegarder l'historique
  saveHistory(history) {
    try {
      const json = JSON.stringify(history);
      const compressed = LZString.compressToUTF16(json);
      localStorage.setItem(this.HISTORY_KEY, compressed);
    } catch (e) {
      console.error('❌ Erreur sauvegarde historique:', e);
    }
  },

  // Charger l'historique
  loadHistory() {
    try {
      const compressed = localStorage.getItem(this.HISTORY_KEY);
      if (compressed) {
        const json = LZString.decompressFromUTF16(compressed);
        return JSON.parse(json);
      }
      return [];
    } catch (e) {
      console.error('❌ Erreur chargement historique:', e);
      return [];
    }
  },

  // Sauvegarder le temps total
  saveTime(time) {
    try {
      localStorage.setItem(this.TIME_KEY, time.toString());
    } catch (e) {
      console.error('❌ Erreur sauvegarde temps:', e);
    }
  },

  // Charger le temps total
  loadTime() {
    try {
      const time = localStorage.getItem(this.TIME_KEY);
      return time ? parseInt(time) : 0;
    } catch (e) {
      console.error('❌ Erreur chargement temps:', e);
      return 0;
    }
  },

  // Réparer les données corrompues
  repair() {
    try {
      const cards = this.load();
      cards.forEach(card => {
        if (!card.stats) {
          card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0, artistCorrect: 0, titleCorrect: 0, dateCorrect: 0 };
        }
        if (!card.stats.artistCorrect) card.stats.artistCorrect = 0;
        if (!card.stats.titleCorrect) card.stats.titleCorrect = 0;
        if (!card.stats.dateCorrect) card.stats.dateCorrect = 0;
        if (card.lastPlayed === undefined) card.lastPlayed = null;
      });
      this.save(cards);
      console.log('✅ Données réparées');
      return cards;
    } catch (e) {
      console.error('❌ Erreur réparation:', e);
      return [];
    }
  },

  // Recompresser (forcer une nouvelle compression)
  recompress() {
    const cards = this.load();
    this.save(cards);
    showToast('🔄 Données recompressées !', 'success');
  },

  // Nettoyer les anciennes données
  cleanup() {
    localStorage.removeItem(this.LEGACY_KEY);
    localStorage.removeItem(this.LEGACY_HISTORY_KEY);
    localStorage.removeItem(this.LEGACY_TIME_KEY);
    console.log('🧹 Anciennes données supprimées');
  }
};

// ==================== MASTERY ALGORITHM ====================
const MasteryCalculator = {
  // Calculer le score de maîtrise d'une carte (0-100)
  calculateMastery(card) {
    if (!card.stats || card.stats.played === 0) {
      return 0; // Carte jamais jouée = 0% maîtrise
    }

    const weights = {
      globalSuccess: 0.4,    // Taux de réussite global (40%)
      componentSuccess: 0.3, // Taux de réussite par composant (30%)
      playCount: 0.2,        // Nombre de fois jouée (20%)
      recency: 0.1          // Récence de la dernière révision (10%)
    };

    // 1. Taux de réussite global
    const globalRate = card.stats.successRate || 0;

    // 2. Taux de réussite par composant (moyenne des 3)
    const artistRate = card.stats.played > 0 ? (card.stats.artistCorrect / card.stats.played) * 100 : 0;
    const titleRate = card.stats.played > 0 ? (card.stats.titleCorrect / card.stats.played) * 100 : 0;
    const dateRate = card.stats.played > 0 ? (card.stats.dateCorrect / card.stats.played) * 100 : 0;
    const componentRate = (artistRate + titleRate + dateRate) / 3;

    // 3. Score basé sur le nombre de révisions (plafonné à 10)
    const playScore = Math.min((card.stats.played / 10) * 100, 100);

    // 4. Score de récence (si jamais jouée ou il y a longtemps = score bas)
    let recencyScore = 50; // Score par défaut
    if (card.lastPlayed) {
      const daysSinceLastPlay = (Date.now() - card.lastPlayed) / (1000 * 60 * 60 * 24);
      // Plus c'est ancien, plus le score baisse (courbe exponentielle)
      recencyScore = Math.max(0, 100 - (daysSinceLastPlay * 5));
    }

    // Calcul final pondéré
    const mastery = 
      (globalRate * weights.globalSuccess) +
      (componentRate * weights.componentSuccess) +
      (playScore * weights.playCount) +
      (recencyScore * weights.recency);

    return Math.round(mastery);
  },

  // Obtenir le niveau de maîtrise
  getMasteryLevel(score) {
    if (score === 0) return { label: 'Non révisée', color: '#9CA3AF', icon: '📝' };
    if (score < 30) return { label: 'À découvrir', color: '#EF4444', icon: '🔴' };
    if (score < 50) return { label: 'En cours', color: '#F59E0B', icon: '🟠' };
    if (score < 70) return { label: 'Bien', color: '#F59E0B', icon: '🟡' };
    if (score < 85) return { label: 'Très bien', color: '#10B981', icon: '🟢' };
    return { label: 'Maîtrisée', color: '#059669', icon: '✅' };
  },

  // Trier les cartes par priorité de révision (score bas = haute priorité)
  sortByPriority(cards) {
    return [...cards].sort((a, b) => {
      const scoreA = this.calculateMastery(a);
      const scoreB = this.calculateMastery(b);
      
      // Cartes jamais jouées en priorité absolue
      if (scoreA === 0 && scoreB !== 0) return -1;
      if (scoreA !== 0 && scoreB === 0) return 1;
      
      // Sinon, score le plus bas en premier
      return scoreA - scoreB;
    });
  },

  // Obtenir les cartes à réviser (score < 70)
  getCardsToReview(cards) {
    return cards.filter(card => {
      const score = this.calculateMastery(card);
      return score < 70;
    });
  }
};

// ==================== DONNÉES ====================
let cards = [];
let currentCardId = null;
let currentEditId = null;
let currentQuizIndex = 0;
let quizCards = [];
let quizStats = { correct: 0, wrong: 0, artistPoints: 0, titlePoints: 0, datePoints: 0, totalPoints: 0, maxPoints: 0 };
let quizHistory = [];
let quizMode = 'all'; // 'all', 'smart', ou 'manual'
let quizAnswered = false;
let currentSessionDetails = [];
let sessionStartTime = null;
let totalQuizTime = 0;
let timerInterval = null;

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Charger avec le nouveau système
  cards = StorageManager.load();
  quizHistory = StorageManager.loadHistory();
  totalQuizTime = StorageManager.loadTime();
  
  setupEventListeners();
  renderCardsList();
  
  // Message de bienvenue si migration effectuée
  const migrated = localStorage.getItem('quizart_migrated');
  if (!migrated && cards.length > 0) {
    localStorage.setItem('quizart_migrated', 'true');
    showToast('✨ Système optimisé ! Vos données sont maintenant compressées.', 'success');
  }
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
  document.getElementById('resetStatsBtn').addEventListener('click', resetCardStats);

  // Export / Import
  document.getElementById('exportBtn').addEventListener('click', exportCards);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importCards);

  // Nouveaux boutons de maintenance
  document.getElementById('repairBtn').addEventListener('click', repairData);
  document.getElementById('recompressBtn').addEventListener('click', forceCleanup);

  // Mode quiz
  document.getElementById('verifyBtn').addEventListener('click', verifyAnswer);
  document.getElementById('saveNoteBtn').addEventListener('click', saveNoteFromQuiz);
  document.getElementById('cardErrorCheckbox').addEventListener('change', autoSaveErrorCheckbox);
  document.getElementById('nextCardBtn').addEventListener('click', () => {
    nextQuizCard();
  });
  
  document.addEventListener('keydown', function(e) {
    const quizCard = document.getElementById('quizCard');
    const quizModeEl = document.getElementById('quizMode');
    
    if (!quizModeEl.classList.contains('active')) return;
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
  const quizModeEl = document.getElementById('quizMode');
  const editBtn = document.getElementById('editModeBtn');
  const quizBtn = document.getElementById('quizModeBtn');

  if (mode === 'edit') {
    editMode.classList.add('active');
    quizModeEl.classList.remove('active');
    editBtn.classList.add('active');
    quizBtn.classList.remove('active');
  } else {
    editMode.classList.remove('active');
    quizModeEl.classList.add('active');
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
    lastPlayed: null,
    stats: {
      played: 0,
      correct: 0,
      wrong: 0,
      successRate: 0,
      artistCorrect: 0,
      titleCorrect: 0,
      dateCorrect: 0
    }
  };
  cards.push(newCard);
  renderCardsList();
  selectCard(newCard.id);
  showToast('Nouvelle carte créée', 'success');
  saveToStorage();
}

function selectCard(cardId) {
  currentEditId = cardId;
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  if (!card.stats) {
    card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0, artistCorrect: 0, titleCorrect: 0, dateCorrect: 0 };
  }
  if (!card.stats.artistCorrect) card.stats.artistCorrect = 0;
  if (!card.stats.titleCorrect) card.stats.titleCorrect = 0;
  if (!card.stats.dateCorrect) card.stats.dateCorrect = 0;
  if (card.lastPlayed === undefined) card.lastPlayed = null;
  
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
  document.getElementById('cardHasError').checked = card.hasError || false;

  const preview = document.getElementById('imagePreview');
  if (card.image) {
    preview.innerHTML = `<img src="${card.image}" alt="Aperçu">`;
  } else {
    preview.innerHTML = '';
  }

  // Afficher le score de maîtrise
  const masteryScore = MasteryCalculator.calculateMastery(card);
  const masteryLevel = MasteryCalculator.getMasteryLevel(masteryScore);
  
  const masteryBadge = document.getElementById('masteryBadge');
  masteryBadge.innerHTML = `
    <span style="color: ${masteryLevel.color}; font-size: 24px;">${masteryLevel.icon}</span>
    <span style="font-weight: 700; font-size: 20px; color: ${masteryLevel.color};">${masteryScore}%</span>
    <span style="font-size: 12px; color: var(--anthracite);">${masteryLevel.label}</span>
  `;

  document.getElementById('statPlayed').textContent = card.stats.played;
  document.getElementById('statCorrect').textContent = card.stats.correct;
  document.getElementById('statWrong').textContent = card.stats.wrong;
  document.getElementById('statRate').textContent = card.stats.successRate + '%';
  
  const artistRate = card.stats.played > 0 ? Math.round((card.stats.artistCorrect / card.stats.played) * 100) : 0;
  const titleRate = card.stats.played > 0 ? Math.round((card.stats.titleCorrect / card.stats.played) * 100) : 0;
  const dateRate = card.stats.played > 0 ? Math.round((card.stats.dateCorrect / card.stats.played) * 100) : 0;
  
  document.getElementById('statArtistRate').textContent = artistRate + '%';
  document.getElementById('statTitleRate').textContent = titleRate + '%';
  document.getElementById('statDateRate').textContent = dateRate + '%';
  
  // Afficher la dernière révision
  if (card.lastPlayed) {
    const lastPlayedDate = new Date(card.lastPlayed);
    const daysSince = Math.floor((Date.now() - card.lastPlayed) / (1000 * 60 * 60 * 24));
    const lastPlayedText = daysSince === 0 ? "Aujourd'hui" : 
                          daysSince === 1 ? "Hier" : 
                          `Il y a ${daysSince} jours`;
    document.getElementById('lastPlayed').textContent = lastPlayedText;
  } else {
    document.getElementById('lastPlayed').textContent = 'Jamais';
  }
}

function saveCard() {
  const card = cards.find(c => c.id === currentEditId);
  if (!card) return;

  const artist = document.getElementById('cardArtist').value.trim();
  const title = document.getElementById('cardTitle').value.trim();
  const date = document.getElementById('cardDate').value.trim();
  const note = document.getElementById('cardNote').value.trim();
  const hasError = document.getElementById('cardHasError').checked;

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
  card.hasError = hasError;

  renderCardsList();
  saveToStorage();
  showToast('Carte enregistrée !', 'success');
  updateGlobalStats();
}

function deleteCard() {
  if (!currentEditId) return;
  
  showConfirm(
    'Supprimer la carte ?',
    'Voulez-vous vraiment supprimer cette carte ? Cette action est irréversible.'
  ).then(confirmed => {
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
    saveToStorage();
    showToast('Carte supprimée', 'info');
  });
}

function resetCardStats() {
  if (!currentEditId) return;
  
  showConfirm(
    'Réinitialiser les statistiques ?',
    'Voulez-vous remettre à zéro toutes les statistiques de cette carte ?'
  ).then(confirmed => {
    if (!confirmed) return;

    const card = cards.find(c => c.id === currentEditId);
    if (!card) return;

    card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0, artistCorrect: 0, titleCorrect: 0, dateCorrect: 0 };
    card.lastPlayed = null;
    
    document.getElementById('statPlayed').textContent = '0';
    document.getElementById('statCorrect').textContent = '0';
    document.getElementById('statWrong').textContent = '0';
    document.getElementById('statRate').textContent = '0%';
    document.getElementById('statArtistRate').textContent = '0%';
    document.getElementById('statTitleRate').textContent = '0%';
    document.getElementById('statDateRate').textContent = '0%';
    document.getElementById('lastPlayed').textContent = 'Jamais';
    
    // Recalculer le badge de maîtrise
    const masteryBadge = document.getElementById('masteryBadge');
    masteryBadge.innerHTML = `
      <span style="color: #9CA3AF; font-size: 24px;">📝</span>
      <span style="font-weight: 700; font-size: 20px; color: #9CA3AF;">0%</span>
      <span style="font-size: 12px; color: var(--anthracite);">Non révisée</span>
    `;

    saveToStorage();
    showToast('Statistiques réinitialisées', 'success');
  });
}

function cancelEdit() {
  if (currentEditId) {
    const card = cards.find(c => c.id === currentEditId);
    if (card && !card.artist && !card.title && !card.date) {
      cards = cards.filter(c => c.id !== currentEditId);
      renderCardsList();
      saveToStorage();
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
      saveToStorage();
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
    case 'mastery':
      // Tri par score de maîtrise (du plus faible au plus élevé)
      cards.sort((a, b) => {
        const scoreA = MasteryCalculator.calculateMastery(a);
        const scoreB = MasteryCalculator.calculateMastery(b);
        return scoreA - scoreB;
      });
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
    const errorBadge = card.hasError ? '<span class="error-badge" title="Erreur signalée">⚠️</span>' : '';
    
    // Calculer le score de maîtrise
    const masteryScore = MasteryCalculator.calculateMastery(card);
    const masteryLevel = MasteryCalculator.getMasteryLevel(masteryScore);
    
    const masteryBadge = `<span class="mastery-badge-corner" style="background: ${masteryLevel.color};" title="${masteryLevel.label}: ${masteryScore}%">${masteryLevel.icon}</span>`;

    return `
      <div class="card-item ${currentEditId === card.id ? 'active' : ''}" 
           data-card-id="${card.id}"
           onclick="selectCard(${card.id})">
        ${masteryBadge}
        <img src="${thumbnail}" alt="${displayTitle}" class="card-item-thumb">
        <div class="card-item-info">
          <div class="card-item-title">${escapeHtml(displayTitle)}</div>
          <div class="card-item-meta">${escapeHtml(displayArtist)} - ${escapeHtml(displayDate)}</div>
          <div class="card-item-mastery" style="color: ${masteryLevel.color}; font-size: 11px; font-weight: 600; margin-top: 3px;">${masteryScore}% • ${masteryLevel.label}</div>
        </div>
        ${errorBadge}
      </div>
    `;
  }).join('');
  
  updateGlobalStats();
}

function updateGlobalStats() {
  const totalCards = cards.length;
  const cardsToReview = MasteryCalculator.getCardsToReview(cards).length;
  
  let totalPlayed = 0;
  let totalCorrect = 0;
  
  cards.forEach(card => {
    if (card.stats) {
      totalPlayed += card.stats.played;
      totalCorrect += card.stats.correct;
    }
  });
  
  const globalSuccessRate = totalPlayed > 0 ? Math.round((totalCorrect / totalPlayed) * 100) : 0;
  
  // Calculer le score de maîtrise moyen
  const avgMastery = cards.length > 0 
    ? Math.round(cards.reduce((sum, card) => sum + MasteryCalculator.calculateMastery(card), 0) / cards.length)
    : 0;
  
  document.getElementById('globalTotalCards').textContent = totalCards;
  document.getElementById('globalToReview').textContent = cardsToReview;
  document.getElementById('globalSuccessRate').textContent = globalSuccessRate + '%';
  document.getElementById('globalAvgMastery').textContent = avgMastery + '%';
  document.getElementById('globalTotalTime').textContent = formatTime(totalQuizTime);
}

// ==================== QUIZ MODE ====================
function updateTimerDisplay() {
  if (sessionStartTime === null) return;
  
  const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
  const timerDisplay = document.getElementById('timerDisplay');
  timerDisplay.textContent = `⏱️ ${formatTime(elapsed)}`;
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  
  return `${hh}:${mm}:${ss}`;
}

function startQuiz() {
  let availableCards = cards.filter(c => c.artist && c.title && c.date && c.image);
  
  if (quizMode === 'smart') {
    // Mode intelligent : sélectionner les cartes à réviser, triées par priorité
    availableCards = MasteryCalculator.sortByPriority(availableCards);
    
    // Prendre les 20 premières (ou moins si pas assez de cartes)
    availableCards = availableCards.slice(0, Math.min(20, availableCards.length));
    
    if (availableCards.length === 0) {
      showToast('🎉 Toutes vos cartes sont bien maîtrisées !', 'success');
      document.getElementById('quizEmpty').innerHTML = `
        <div class="empty-icon">🎉</div>
        <h3>Félicitations !</h3>
        <p>Toutes vos cartes sont bien maîtrisées</p>
        <p class="small" style="margin-top: 10px;">Continuez à réviser régulièrement pour maintenir votre niveau</p>
      `;
      document.getElementById('quizEmpty').style.display = 'block';
      document.getElementById('quizCard').style.display = 'none';
      document.getElementById('quizResult').style.display = 'none';
      return;
    }
    
    showToast(`📚 ${availableCards.length} carte(s) sélectionnée(s) pour révision`, 'info');
  } else if (quizMode === 'manual') {
    // Mode manuel : seulement les cartes marquées "à travailler"
    availableCards = availableCards.filter(c => c.toWork);
    if (availableCards.length === 0) {
      showToast('Aucune carte marquée "À travailler"', 'error');
      document.getElementById('quizEmpty').innerHTML = `
        <div class="empty-icon">📝</div>
        <h3>Aucune carte sélectionnée</h3>
        <p>Marquez des cartes "À travailler" en mode édition</p>
      `;
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
  sessionStartTime = Date.now();
  
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimerDisplay, 1000);
  
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
  
  const artistMatch = userAnswer.includes(card.artist.toLowerCase());
  const titleMatch = userAnswer.includes(card.title.toLowerCase());
  const dateMatch = userAnswer.includes(card.date.toLowerCase());
  
  let points = 0;
  if (artistMatch) points++;
  if (titleMatch) points++;
  if (dateMatch) points++;
  
  const isCorrect = artistMatch && titleMatch && dateMatch;
  
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
    card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0, artistCorrect: 0, titleCorrect: 0, dateCorrect: 0 };
  }
  if (!card.stats.artistCorrect) card.stats.artistCorrect = 0;
  if (!card.stats.titleCorrect) card.stats.titleCorrect = 0;
  if (!card.stats.dateCorrect) card.stats.dateCorrect = 0;
  
  card.stats.played++;
  card.lastPlayed = Date.now(); // Enregistrer la date de dernière révision
  
  if (isCorrect) {
    card.stats.correct++;
  } else {
    card.stats.wrong++;
  }
  
  if (artistMatch) card.stats.artistCorrect++;
  if (titleMatch) card.stats.titleCorrect++;
  if (dateMatch) card.stats.dateCorrect++;
  
  card.stats.successRate = Math.round((card.stats.correct / card.stats.played) * 100);
  
  saveToStorage();
  
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
  
  const noteInput = document.getElementById('noteInput');
  noteInput.value = card.note || '';
  
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
  
  const originalCard = cards.find(c => c.id === card.id);
  if (originalCard) {
    originalCard.note = noteValue;
    originalCard.hasError = hasError;
    card.note = noteValue;
    card.hasError = hasError;
    saveToStorage();
    
    if (hasError) {
      showToast('📝 Note sauvegardée + Erreur signalée ⚠️', 'success');
    } else {
      showToast('📝 Note sauvegardée !', 'success');
    }
    
    renderCardsList();
  }
}

function autoSaveErrorCheckbox() {
  const card = quizCards[currentQuizIndex];
  const cardErrorCheckbox = document.getElementById('cardErrorCheckbox');
  const hasError = cardErrorCheckbox.checked;
  
  const originalCard = cards.find(c => c.id === card.id);
  if (originalCard) {
    originalCard.hasError = hasError;
    card.hasError = hasError;
    saveToStorage();
    
    if (hasError) {
      showToast('⚠️ Erreur signalée automatiquement', 'info');
    } else {
      showToast('✅ Erreur retirée', 'info');
    }
    
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
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  document.getElementById('quizCard').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  
  const total = quizStats.correct + quizStats.wrong;
  const percentage = total > 0 ? Math.round((quizStats.correct / total) * 100) : 0;
  const pointsPercentage = quizStats.maxPoints > 0 ? Math.round((quizStats.totalPoints / quizStats.maxPoints) * 100) : 0;
  
  const sessionDuration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
  
  document.getElementById('correctCount').textContent = quizStats.correct;
  document.getElementById('wrongCount').textContent = quizStats.wrong;
  document.getElementById('scorePercent').textContent = percentage + '%';
  document.getElementById('pointsScore').textContent = `${quizStats.totalPoints}/${quizStats.maxPoints}`;
  document.getElementById('pointsPercent').textContent = pointsPercentage + '%';
  document.getElementById('sessionTime').textContent = formatTime(sessionDuration);
  
  totalQuizTime += sessionDuration;
  StorageManager.saveTime(totalQuizTime);
  updateGlobalStats();
  
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
    duration: sessionDuration
  };
  quizHistory.push(historyEntry);
  StorageManager.saveHistory(quizHistory);
  
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
    
    let modeLabel = '📚 Toutes les cartes';
    if (session.mode === 'smart') modeLabel = '🧠 Révision intelligente';
    if (session.mode === 'manual') modeLabel = '⭐ À travailler';
    
    const duration = session.duration ? formatTime(session.duration) : 'N/A';
    const sessionIndex = quizHistory.length - 1 - index;
    
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
          <div class="session-header-right">
            <div class="session-score-badge">
              ${session.totalPoints}/${session.maxPoints} pts
            </div>
            <div class="session-time-badge">
              ⏱️ ${duration}
            </div>
            <button class="btn-icon-delete" onclick="deleteSession(${sessionIndex})" title="Supprimer cette session">
              🗑️
            </button>
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
      </div>
    `;
  }).join('');
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
    version: '2.0',
    exported: new Date().toISOString(),
    totalCards: cards.length,
    totalQuizTime: totalQuizTime,
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
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      
      if (!imported.cards || !Array.isArray(imported.cards)) {
        showToast('❌ Fichier invalide', 'error');
        return;
      }

      // Normaliser les cartes importées
      imported.cards.forEach(card => {
        if (!card.stats) {
          card.stats = { played: 0, correct: 0, wrong: 0, successRate: 0, artistCorrect: 0, titleCorrect: 0, dateCorrect: 0 };
        }
        if (!card.stats.artistCorrect) card.stats.artistCorrect = 0;
        if (!card.stats.titleCorrect) card.stats.titleCorrect = 0;
        if (!card.stats.dateCorrect) card.stats.dateCorrect = 0;
        if (card.lastPlayed === undefined) card.lastPlayed = null;
        if (card.note === undefined) card.note = '';
        if (card.hasError === undefined) card.hasError = false;
        if (card.toWork === undefined) card.toWork = false;
      });

      if (imported.totalQuizTime !== undefined) {
        totalQuizTime = imported.totalQuizTime;
        StorageManager.saveTime(totalQuizTime);
        updateGlobalStats();
      }

      // Si on a déjà des cartes, demander confirmation
      if (cards.length > 0) {
        showConfirm(
          'Remplacer ou ajouter ?',
          `Vous avez déjà ${cards.length} carte(s).\n\nCliquez "Oui" pour REMPLACER toutes vos cartes par les ${imported.cards.length} carte(s) du fichier.\n\nCliquez "Non" pour AJOUTER les cartes aux existantes.`
        ).then(replace => {
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
          
          finalizeImport();
        });
      } else {
        // Pas de cartes existantes, importer directement
        cards = imported.cards;
        showToast(`✅ ${imported.cards.length} carte(s) restaurée(s) !`, 'success');
        finalizeImport();
      }
      
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur : fichier corrompu', 'error');
    }
  };
  
  reader.readAsText(file);
  event.target.value = '';
}

function finalizeImport() {
  currentEditId = null;
  
  // Cacher l'éditeur
  const editor = document.getElementById('cardEditor');
  if (editor) {
    editor.style.display = 'none';
  }
  
  // Afficher l'état vide dans l'éditeur
  const editorContent = document.querySelector('.editor-content');
  if (editorContent && !document.querySelector('.empty-state')) {
    editorContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎨</div>
        <h3>Aucune carte sélectionnée</h3>
        <p>Sélectionnez une carte ou créez-en une nouvelle</p>
      </div>
    `;
  }
  
  // Rafraîchir la liste et sauvegarder
  renderCardsList();
  saveToStorage();
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
    
    let modeLabel = '📚 Toutes les cartes';
    if (entry.mode === 'smart') modeLabel = '🧠 Révision intelligente';
    if (entry.mode === 'manual') modeLabel = '⭐ À travailler';
    
    const duration = entry.duration ? formatTime(entry.duration) : 'N/A';

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
          <div class="history-stat">
            <span class="history-stat-value" style="color: var(--burgundy)">⏱️ ${duration}</span>
            <span class="history-stat-label">Temps</span>
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

function clearHistory() {
  showConfirm(
    'Effacer l\'historique ?',
    'Voulez-vous vraiment supprimer tout l\'historique de vos quiz ? Cette action est irréversible.'
  ).then(confirmed => {
    if (!confirmed) return;
    
    quizHistory = [];
    StorageManager.saveHistory(quizHistory);
    renderHistory();
    showToast('Historique effacé', 'info');
  });
}

function deleteSession(sessionIndex) {
  showConfirm(
    'Supprimer cette session ?',
    'Voulez-vous vraiment supprimer cette session ? Cette action est irréversible.'
  ).then(confirmed => {
    if (!confirmed) return;
    
    const session = quizHistory[sessionIndex];
    if (session && session.duration) {
      totalQuizTime -= session.duration;
      if (totalQuizTime < 0) totalQuizTime = 0;
      StorageManager.saveTime(totalQuizTime);
      updateGlobalStats();
    }
    
    quizHistory.splice(sessionIndex, 1);
    StorageManager.saveHistory(quizHistory);
    renderSessionStats();
    showToast('Session supprimée', 'info');
  });
}

// ==================== MAINTENANCE ====================
function repairData() {
  const repaired = StorageManager.repair();
  cards = repaired;
  renderCardsList();
  showToast('🔧 Données réparées !', 'success');
}

function forceCleanup() {
  try {
    // Nettoyer toutes les anciennes clés
    const keysToRemove = [
      'flashcards',
      'quizHistory', 
      'totalQuizTime',
      'quizart_migrated'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Forcer la recompression des données actuelles
    if (cards.length > 0) {
      StorageManager.save(cards);
    }
    if (quizHistory.length > 0) {
      StorageManager.saveHistory(quizHistory);
    }
    StorageManager.saveTime(totalQuizTime);
    
    showToast('🧹 Nettoyage complet effectué !', 'success');
    console.log('✅ localStorage nettoyé et données recompressées');
  } catch (e) {
    console.error('❌ Erreur nettoyage:', e);
    showToast('❌ Erreur lors du nettoyage', 'error');
  }
}

// ==================== STORAGE ====================
function saveToStorage() {
  StorageManager.save(cards);
}

// ==================== GLOBAL FUNCTIONS ====================
window.selectCard = selectCard;
window.closeHistoryModal = closeHistoryModal;
window.closeSessionStatsModal = closeSessionStatsModal;
window.deleteSession = deleteSession;
