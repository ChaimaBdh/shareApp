# Application de partage


## Membres  

* Chaïma BOUDEHANE    
* Meriem ANSEUR  


## Récupérer le projet  


```bash  
git clone git@gitlab-etu.fil.univ-lille.fr:chaima.boudehane.etu/jsfs-boudehane-anseur.git
```

*se placer dans le répertoire*  

```bash  
cd jsfs-boudehane-anseur/projet2/shareApp
```  

## Installer les modules  

```bash  
npm install
```  

## Mise en place de la base de données  

*créer le dossier dbData*  

```bash
mkdir dbData
```  

*lancer le serveur mongodb*  

```bash
mongod --dbpath dbData
```  

## Lancer le serveur  

*dans un autre terminal, effectuer la commande suivante à la racine de /shareApp*

```bash  
nodemon  
```  

*ouvrir le lien dans le navigateur de votre choix*  

```bash  
localhost:3000/  
```  
