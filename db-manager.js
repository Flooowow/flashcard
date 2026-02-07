// ==================== INDEXEDDB MANAGER ====================
// Système de stockage moderne avec IndexedDB + compression

// ==================== COMPRESSION ====================
// Bibliothèque de compression LZString (inline)
var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

const DB_NAME = 'QuizartDB';
const DB_VERSION = 1;

const STORES = {
  CARDS: 'cards',
  HISTORY: 'history',
  SETTINGS: 'settings'
};

class DatabaseManager {
  constructor() {
    this.db = null;
    this.ready = false;
    this.initPromise = null;
  }

  // Initialiser la base de données
  async init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('❌ Erreur ouverture IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.ready = true;
        console.log('✅ IndexedDB initialisée');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store des cartes
        if (!db.objectStoreNames.contains(STORES.CARDS)) {
          const cardsStore = db.createObjectStore(STORES.CARDS, { keyPath: 'id' });
          cardsStore.createIndex('artist', 'artist', { unique: false });
          cardsStore.createIndex('date', 'date', { unique: false });
          cardsStore.createIndex('order', 'order', { unique: false });
          console.log('✅ Store "cards" créé');
        }

        // Store de l'historique
        if (!db.objectStoreNames.contains(STORES.HISTORY)) {
          db.createObjectStore(STORES.HISTORY, { keyPath: 'date' });
          console.log('✅ Store "history" créé');
        }

        // Store des paramètres (key-value)
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
          console.log('✅ Store "settings" créé');
        }
      };
    });

    return this.initPromise;
  }

  // Obtenir une transaction
  getTransaction(storeNames, mode = 'readonly') {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.transaction(storeNames, mode);
  }

  // ==================== CARDS ====================
  
  async saveCards(cards) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.CARDS, 'readwrite');
      const store = transaction.objectStore(STORES.CARDS);
      
      // Vider le store avant de sauvegarder
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        // Compresser et sauvegarder chaque carte
        let completed = 0;
        const total = cards.length;
        
        if (total === 0) {
          resolve();
          return;
        }
        
        cards.forEach(card => {
          // Compresser l'image si elle existe
          const cardToSave = { ...card };
          if (cardToSave.image) {
            cardToSave.imageCompressed = LZString.compressToUTF16(cardToSave.image);
            delete cardToSave.image; // Stocker uniquement la version compressée
          }
          
          const request = store.put(cardToSave);
          
          request.onsuccess = () => {
            completed++;
            if (completed === total) {
              console.log(`💾 ${total} cartes sauvegardées`);
              resolve();
            }
          };
          
          request.onerror = () => {
            console.error('❌ Erreur sauvegarde carte:', request.error);
            reject(request.error);
          };
        });
      };
      
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async loadCards() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.CARDS);
      const store = transaction.objectStore(STORES.CARDS);
      const request = store.getAll();

      request.onsuccess = () => {
        const cards = request.result.map(card => {
          // Décompresser l'image
          if (card.imageCompressed) {
            card.image = LZString.decompressFromUTF16(card.imageCompressed);
            delete card.imageCompressed;
          }
          return card;
        });
        
        console.log(`📚 ${cards.length} cartes chargées`);
        resolve(cards);
      };

      request.onerror = () => {
        console.error('❌ Erreur chargement cartes:', request.error);
        reject(request.error);
      };
    });
  }

  async getCard(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.CARDS);
      const store = transaction.objectStore(STORES.CARDS);
      const request = store.get(id);

      request.onsuccess = () => {
        const card = request.result;
        if (card && card.imageCompressed) {
          card.image = LZString.decompressFromUTF16(card.imageCompressed);
          delete card.imageCompressed;
        }
        resolve(card);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteCard(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.CARDS, 'readwrite');
      const store = transaction.objectStore(STORES.CARDS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearCards() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.CARDS, 'readwrite');
      const store = transaction.objectStore(STORES.CARDS);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('🗑️ Toutes les cartes supprimées');
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== HISTORY ====================
  
  async saveHistory(history) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.HISTORY, 'readwrite');
      const store = transaction.objectStore(STORES.HISTORY);
      
      // Vider le store
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        if (history.length === 0) {
          resolve();
          return;
        }
        
        let completed = 0;
        history.forEach(entry => {
          const request = store.put(entry);
          request.onsuccess = () => {
            completed++;
            if (completed === history.length) {
              console.log(`📊 ${history.length} sessions sauvegardées`);
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
      };
      
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async loadHistory() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.HISTORY);
      const store = transaction.objectStore(STORES.HISTORY);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`📈 ${request.result.length} sessions chargées`);
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearHistory() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.HISTORY, 'readwrite');
      const store = transaction.objectStore(STORES.HISTORY);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== SETTINGS ====================
  
  async saveSetting(key, value) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.SETTINGS, 'readwrite');
      const store = transaction.objectStore(STORES.SETTINGS);
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadSetting(key, defaultValue = null) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.SETTINGS);
      const store = transaction.objectStore(STORES.SETTINGS);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : defaultValue);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteSetting(key) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(STORES.SETTINGS, 'readwrite');
      const store = transaction.objectStore(STORES.SETTINGS);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== MIGRATION ====================
  
  async migrateFromLocalStorage() {
    console.log('🔄 Début migration depuis localStorage...');
    
    try {
      // Charger les anciennes données
      let cards = [];
      let history = [];
      let totalTime = 0;
      
      // Essayer le nouveau format d'abord
      const compressedData = localStorage.getItem('quizart_data_v2');
      if (compressedData) {
        console.log('📦 Détection format v2.0 compressé');
        const json = LZString.decompressFromUTF16(compressedData);
        const data = JSON.parse(json);
        cards = data.cards || [];
      } else {
        // Sinon, essayer l'ancien format
        const oldData = localStorage.getItem('flashcards');
        if (oldData) {
          console.log('📦 Détection ancien format v1.0');
          cards = JSON.parse(oldData);
        }
      }
      
      // Historique
      const compressedHistory = localStorage.getItem('quizart_history_v2');
      if (compressedHistory) {
        const json = LZString.decompressFromUTF16(compressedHistory);
        history = JSON.parse(json);
      } else {
        const oldHistory = localStorage.getItem('quizHistory');
        if (oldHistory) {
          history = JSON.parse(oldHistory);
        }
      }
      
      // Temps total
      totalTime = parseInt(localStorage.getItem('quizart_time_v2') || localStorage.getItem('totalQuizTime') || '0');
      
      // Normaliser les cartes
      cards.forEach(card => {
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
      
      console.log(`📊 Migration: ${cards.length} cartes, ${history.length} sessions, ${totalTime}s de quiz`);
      
      // Sauvegarder dans IndexedDB
      await this.saveCards(cards);
      await this.saveHistory(history);
      await this.saveSetting('totalQuizTime', totalTime);
      await this.saveSetting('migrated', true);
      await this.saveSetting('migrationDate', new Date().toISOString());
      
      // Nettoyer le localStorage
      this.cleanupLocalStorage();
      
      console.log('✅ Migration terminée avec succès !');
      return { cards, history, totalTime };
      
    } catch (error) {
      console.error('❌ Erreur migration:', error);
      throw error;
    }
  }

  cleanupLocalStorage() {
    const keysToRemove = [
      'flashcards',
      'quizHistory',
      'totalQuizTime',
      'quizart_data_v2',
      'quizart_history_v2',
      'quizart_time_v2',
      'quizart_migrated'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 localStorage nettoyé');
  }

  // ==================== UTILITAIRES ====================
  
  async getDatabaseSize() {
    await this.init();
    
    const cards = await this.loadCards();
    const history = await this.loadHistory();
    
    const cardsSize = JSON.stringify(cards).length;
    const historySize = JSON.stringify(history).length;
    
    return {
      cards: cardsSize,
      history: historySize,
      total: cardsSize + historySize,
      cardsCount: cards.length,
      historyCount: history.length
    };
  }

  async exportAll() {
    await this.init();
    
    const cards = await this.loadCards();
    const history = await this.loadHistory();
    const totalQuizTime = await this.loadSetting('totalQuizTime', 0);
    
    return {
      version: '2.1',
      exported: new Date().toISOString(),
      totalCards: cards.length,
      totalQuizTime,
      cards,
      history
    };
  }

  async importAll(data) {
    await this.init();
    
    // Normaliser les données
    if (data.cards) {
      data.cards.forEach(card => {
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
    }
    
    await this.saveCards(data.cards || []);
    await this.saveHistory(data.history || []);
    await this.saveSetting('totalQuizTime', data.totalQuizTime || 0);
    
    console.log('✅ Import terminé');
  }

  async clearAll() {
    await this.init();
    
    await this.clearCards();
    await this.clearHistory();
    await this.saveSetting('totalQuizTime', 0);
    
    console.log('🗑️ Toutes les données effacées');
  }
}

// Instance globale
const DB = new DatabaseManager();
