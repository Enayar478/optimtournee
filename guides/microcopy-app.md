# Micro-copy — OptimTournée App

_Labels, tooltips et messages d'erreur pour l'interface._

---

## Dashboard

### Empty States

**Pas encore de clients :**
```
Titre : Votre première tournée vous attend
Sous-titre : Ajoutez 3 clients pour générer votre planning optimisé
CTA : Ajouter mon premier client
```

**Clients existants mais pas de tournée générée :**
```
Titre : Prêt à optimiser votre semaine ?
Sous-titre : Générez automatiquement les meilleurs itinéraires pour vos équipes
CTA : Créer mes tournées
```

**Semaine sans intervention planifiée :**
```
Titre : Semaine calme ou oubli de planning ?
Sous-titre : Vérifiez vos récurrences client ou créez des interventions ponctuelles
CTA : Voir mes clients
```

---

## Tooltips

### Carte
```
Marqueur client : Cliquez pour voir les détails et modifier l'ordre
Ligne d'itinéraire : Glissez les points pour réorganiser le trajet
Filtre équipe : Affiche/masque les interventions de cette équipe
```

### Planning
```
Glisser-déposer : Change l'ordre de passage (le trajet se recalcule)
Icône météo : Conditions prévues à cette heure-là
Badge distance : Kilomètres depuis le point précédent
```

### Actions
```
Bouton "Générer" : Crée automatiquement les tournées optimisées
Bouton "Publier" : Envoie les tournées aux équipes (SMS/email)
Bouton "Verrouiller" : Empêche les modifications après envoi
```

---

## Messages d'erreur métier

### Conflits de planning
```
Créneau déjà pris : Cette équipe est déjà assignée sur [Nom client] à cette heure
Chevauchement : L'intervention dure 2h, elle chevauche la suivante
Hors dispo : L'équipe [Nom] n'est pas disponible le [jour]
```

### Contraintes client
```
Jour refusé : Ce client demande à être traité le [jour] uniquement
Fréquence invalide : Dernière intervention il y a 5 jours, fréquence = 7 jours
Horaire impossible : L'intervention demande 3h, fin prévue après 18h
```

### Météo
```
Pluie détectée : 80% de pluie prévue — les entretiens pelouse sont décalés
Vent fort : Tonte annulée, risque de projections
Gel matinal : Reporté après 10h pour sécurité
```

---

## Labels de formulaires

### Fiche Client
```
Nom : Nom du client ou de la résidence
Adresse : Adresse complète pour la navigation GPS
Type d'entretien : Pelouse | Haies | Jardin complet | Désherbage
Fréquence : Tous les combien de jours ?
Durée estimée : Temps moyen sur place (pour le calcul d'itinéraire)
Contraintes : Jours préférés, horaires à éviter, accès particulier
```

### Fiche Équipe
```
Nom de l'équipe : Comment vous les appelez en interne
Couleur : Pour les distinguer sur la carte
Membres : Qui fait partie de cette équipe
Engins assignés : Quels véhicules/tondeuses utilisent-ils
Disponibilités : Jours de travail habituels
Congés : Périodes d'absence à prendre en compte
```

### Intervention
```
Type : Entretien régulier | Intervention ponctuelle | Urgence
Client : Qui doit être traité
Équipe assignée : Qui s'en occupe
Date/heure : Quand (modifiable par glisser-déposer)
Durée : Combien de temps ça prend
Priorité : Normale | Haute (urgence)
Notes : Infos utiles pour l'équipe sur place
```

---

## Notifications (email/SMS)

### Tournée publiée
```
Sujet : Votre tournée du [jour] est prête
Contenu : 
- Bonjour [Prénom],
- Voici votre planning du [date] :
- [Liste avec horaires et adresses cliquables]
- Bonne journée,
- [Nom entreprise]
```

### Alerte météo
```
Sujet : ⚠️ 3 interventions décalées à cause de la pluie
Contenu :
- Pluie prévue demain matin
- Les entretiens pelouse sont reportés à [nouvelle date]
- Votre nouvelle tournée : [lien]
```

### Urgence insérée
```
Sujet : Nouvelle intervention ajoutée à votre [jour]
Contenu :
- Un client urgent a été inséré dans votre tournée
- Heure : [heure]
- Client : [nom]
- Votre itinéraire mis à jour : [lien]
```

---

## Toast / Snackbar

### Succès
```
Tournée générée : 12 interventions planifiées pour 3 équipes
Modifications sauvegardées : Planning mis à jour
Tournée publiée : Vos équipes ont reçu leur planning
Client ajouté : [Nom] sera inclus dans les prochaines tournées
```

### Attention
```
Conflit détecté : 2 interventions se chevauchent
Météo à surveiller : Pluie possible demain, vérifiez avant d'envoyer
Équipe surcharge : [Nom] a déjà 8h d'interventions ce jour
```

### Erreur
```
Génération impossible : Aucune équipe disponible cette semaine
Adresse invalide : Vérifiez l'adresse de [Nom client]
Problème de connexion : Impossible de récupérer la météo
```

---

## SEO / Meta

### Titres de page
```
Dashboard : Mon planning | OptimTournée
Clients : Mes clients | OptimTournée
Nouveau client : Ajouter un client | OptimTournée
Équipes : Mes équipes | OptimTournée
Paramètres : Réglages | OptimTournée
```

### Descriptions
```
Dashboard : Planifiez et optimisez les tournées d'entretien de votre entreprise paysagiste
Clients : Gérez votre base clients et leurs fréquences d'intervention
```

---

*Dernière mise à jour : Mars 2025*
