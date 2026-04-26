# Treball individual - Marc Alzamora

## 1. Introducció
Aquest projecte tracte d'acabar d'implementar un memory que hem anat construint amb el professor a les hores de toeria a classe. S'utilitza HTML, CSS, JavaScript i les
cartes estàn programades amb SVG, sense utilitzar imatges externes. També s'utilitza Canvas.

## 2. Descripció del disseny del joc
* **Modes de joc**: 
    * **Mode 1 (Clàssic)**: Rep una configuració de partida introduida per l'usuari en la pantalla de opcions i inicia la partida. 
    * **Mode 2 (Progressiu)**: Agafa de base la configuració introduida per l'usuari en la pantalla de opcions, hi ha cada nivell que super va augmentant la dificultat, pentalitzant mes cada error i reduint el temps de cada nivell.
* **Sistema de Guardat i carrega de partides**: Incliou un sistema de guardat de partides en local i de carrega de les mateixes partides per continuar on ho havies deixat.
* **Rànquing**: Guarda un sistema de puntuacions exclusivament per el mode 2 de joc.
* **Interfície**: El disseny es simple i coherent amb els colors i l'estructura de la pantalla.

## 3. Parts mes rellevant de la implementació
* **Renderització amb Canvas**: Totes les cartes i elements de joc es dibuixen en temps real. S'ha implementat una funció `dibuixarForma` que genera les figures sense dependre de fitxers d'imatge externs, com s'especifíca a l'enunciat.

## 4. Conclusions i problemes trobats
El problema principal trobat a estat implementar correctament el mode 2 de joc. El sistema de guardat ha estat difícil també degut a que tota l'estona es sobreescrivia les dades de diferents partides i no es creaven diferents guardats.