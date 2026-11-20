# HAFS

Site de présentation React JS / Vite pour HAFS.

## Démarrage

Node.js 22 ou supérieur et pnpm sont requis.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Le résultat de compilation se trouve dans `dist/`.

## Publication Cloudflare

Compte : Storeonline. Nom du Worker : `hafs`.
Le site utilise Workers Static Assets, avec repli SPA vers `index.html`.
Les médias optimisés sont versionnés dans `public/assets/`.

## Contenu

Quatre onglets : Accueil, À propos, Boutique et Contact.
Les six parfums du catalogue sont des concepts de démonstration.
La page À propos présente le texte et le portrait fournis par la cliente.
Le formulaire prépare et copie un message ; il ne l’envoie pas automatiquement.
L’adresse de contact est `serviceclient@hafs.com`.

Aucune clé d’API, aucun compte Cloudflare et aucun secret ne sont nécessaires dans le code public.
