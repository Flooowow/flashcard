# 🎨 Quizart - Application de Flashcards Histoire de l'Art

Application web élégante pour créer et réviser des flashcards d'œuvres d'art avec une interface raffinée inspirée des galeries d'art.

## ✨ Fonctionnalités

### 📝 Mode Édition
- **Créer des cartes** avec image, artiste, titre et date
- **Modifier** les cartes existantes
- **Supprimer** des cartes
- **Tri intelligent** :
  - Par ordre de création
  - Par date croissante/décroissante
  - Par artiste (A-Z)
- **Aperçu visuel** de toutes vos cartes
- **Sauvegarde automatique** dans le navigateur

### 🎯 Mode Quiz
- **Interface style "Retrouve sans te tromper"**
- **Barre de progression** visuelle
- **Feedback immédiat** (correct/incorrect)
- **Affichage de la réponse correcte**
- **Navigation** entre les cartes
- **Statistiques finales** :
  - Nombre de bonnes réponses
  - Nombre d'erreurs
  - Score en pourcentage
- **Mélange aléatoire** des cartes à chaque quiz

## 🎨 Design

Interface élégante **"Galerie d'art"** avec :
- **Palette raffinée** : Bordeaux, crème, anthracite et accents dorés
- **Typographie** : Georgia (serif) pour un aspect classique
- **Mode sombre élégant** pour le quiz (anthracite/charcoal)
- **Cartes beige** pour mettre en valeur les œuvres
- **Bordures dorées** pour les accents
- **Animations fluides**
- **Responsive design**

## 🚀 Utilisation

### Installation
1. Téléchargez les 3 fichiers : `index.html`, `style.css`, `script.js`
2. Placez-les dans le même dossier
3. Ouvrez `index.html` dans votre navigateur

### Mode Édition
1. Cliquez sur **"➕ Nouvelle carte"**
2. Ajoutez une image de l'œuvre
3. Remplissez :
   - Artiste (ex: Caravage)
   - Titre (ex: Le Caravage à Emmaüs)
   - Date (ex: 1602)
4. Cliquez sur **"💾 Enregistrer"**

### Mode Quiz
1. Passez en **"🎯 Mode Quiz"**
2. L'image de l'œuvre s'affiche
3. Entrez votre réponse (artiste + titre)
4. Cliquez sur **"Vérifier"**
5. Naviguez avec **"Suivant →"**

## 📊 Structure du Projet

```
flashcards/
├── index.html      # Structure HTML
├── style.css       # Styles et design
└── script.js       # Logique JavaScript
```

## 🎯 Validation des Réponses

Le système de vérification est **flexible** :
- Accepte les réponses avec l'artiste ET le titre
- Insensible à la casse
- Pas besoin de la date dans la réponse
- Exemple : "caravage emmaüs" = ✅ Correct

## 💾 Sauvegarde

- **Automatique** : Chaque modification est sauvegardée dans le navigateur
- **Persistante** : Les données restent même après fermeture
- **LocalStorage** : Pas besoin de serveur

## 🎨 Personnalisation

### Couleurs (dans `style.css`)
```css
:root {
  --burgundy: #7C1D1D;        /* Bordeaux principal */
  --dark-burgundy: #5A1515;   /* Bordeaux foncé */
  --cream: #F5F0E8;           /* Crème */
  --anthracite: #2D3436;      /* Gris anthracite */
  --gold: #D4AF37;            /* Or pour accents */
  --beige: #E8DCC8;           /* Beige */
  --success: #2D5016;         /* Vert olive */
}
```

### Tailles
- Images dans quiz : max 400px
- Largeur sidebar : 320px
- Padding général : 40px

## 🔧 Fonctionnalités Avancées

### Tri Intelligent
```javascript
// Dans script.js - fonction sortCards()
- 'order' : Ordre de création
- 'date-asc' : Chronologique
- 'date-desc' : Antichronologique  
- 'artist' : Alphabétique
```

### Validation Flexible
```javascript
// Accepte ces formats :
"Caravage - Le Caravage à Emmaüs"
"caravage emmaüs"
"CARAVAGE Le Caravage à Emmaüs 1602"
```

## 📱 Responsive

- **Desktop** : Layout à 2 colonnes (sidebar + éditeur)
- **Tablet/Mobile** : Layout vertical empilé
- **Touch-friendly** : Boutons et inputs adaptés

## 🐛 Dépannage

### Les images ne s'affichent pas
- Vérifiez que vous utilisez des fichiers images valides (JPG, PNG, etc.)
- Les images sont converties en base64 (peuvent être lourdes)

### Les données disparaissent
- Vérifiez que le LocalStorage n'est pas désactivé
- Ne pas utiliser en navigation privée

### Le quiz ne démarre pas
- Assurez-vous d'avoir au moins une carte complète
- Toutes les cartes doivent avoir : image, artiste, titre, date

## 🚀 Améliorations Futures Possibles

- [ ] Export/Import JSON des cartes
- [ ] Catégories par période (Renaissance, Baroque, etc.)
- [ ] Mode "apprentissage" avec répétition espacée
- [ ] Statistiques détaillées par carte
- [ ] Multi-langue
- [ ] Mode sombre pour l'édition
- [ ] Drag & drop pour réorganiser
- [ ] Recherche/filtres avancés

## 📝 Exemple de Données

```json
{
  "id": 1706512345678,
  "artist": "Caravage",
  "title": "Le Caravage à Emmaüs",
  "date": "1602",
  "image": "data:image/jpeg;base64,...",
  "order": 0
}
```

## 🎓 Cas d'Usage

- **Étudiants en histoire de l'art**
- **Préparation aux examens**
- **Révision pour concours**
- **Apprentissage personnel**
- **Enseignants** (créer des quiz pour les élèves)

## 💡 Conseils d'Utilisation

1. **Nommage cohérent** : Utilisez toujours le même format
2. **Dates précises** : Facilitent le tri chronologique
3. **Images de qualité** : Mais pas trop lourdes (< 500 Ko)
4. **Quiz réguliers** : Révisez souvent pour mémoriser
5. **Tri par date** : Visualisez l'évolution artistique

## 🌟 Points Forts

- ✅ **Sans installation** : Fonctionne directement dans le navigateur
- ✅ **Hors ligne** : Une fois chargé, pas besoin d'internet
- ✅ **Gratuit** : Code open source
- ✅ **Simple** : Interface intuitive
- ✅ **Performant** : Léger et rapide

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et éducatif.

## 🤝 Contribution

Suggestions d'amélioration bienvenues !

---

**Créé avec ❤️ pour les passionnés d'art**
