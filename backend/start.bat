@echo off
cd /d "c:\Users\mediacom\Desktop\Clean PRO\backend"
echo Installation de Stripe...
npm install stripe
echo.
echo Installation terminée. Démarrage du serveur...
node server.js
