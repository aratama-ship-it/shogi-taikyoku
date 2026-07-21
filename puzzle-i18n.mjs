// 基本問題のフランス語・スペイン語テキスト。
// puzzles.mjs が読み込み、各問題の title / prompt / hint(s) / success にマージする。
// 新しい問題を追加したら、ここにも fr / es を追加すること
// （tests/game-core.test.mjs の言語完全性テストが漏れを検出する）。

export const PUZZLE_TRANSLATIONS = {
  "gold-at-the-head": {
    title: { fr: "Le Général d'or porte le coup final", es: "El General de oro remata" },
    prompt: {
      fr: "Trouvez le coup qui ne laisse au roi aucune fuite.",
      es: "Encuentra la jugada que no deja escapatoria al rey.",
    },
    hint: {
      fr: "Un Général d'or en main est très fort juste devant le roi.",
      es: "Un General de oro en mano es muy fuerte justo delante del rey.",
    },
    success: {
      fr: "Mat du Général d'or en tête ! Le Général d'or contrôle le roi et toutes les cases voisines.",
      es: "¡Mate con el General de oro delante del rey! La pieza controla al rey y todas las casillas cercanas.",
    },
  },
  "rook-at-the-edge": {
    title: { fr: "Verrouiller le bord avec la tour", es: "Sella el borde con la torre" },
    prompt: {
      fr: "Un roi au bord a moins de cases disponibles.",
      es: "Un rey en el borde tiene menos casillas disponibles.",
    },
    hint: {
      fr: "Posez la tour juste sous le roi, protégée par le Général d'or.",
      es: "Coloca la torre justo debajo del rey, protegida por el General de oro.",
    },
    success: {
      fr: "Mat après la pose de la Tour ! Le Roi ne peut pas la prendre : le Général d'or la protège.",
      es: "¡Mate de torre! El rey no puede capturarla porque el General de oro la protege.",
    },
  },
  "bishop-diagonal": {
    title: { fr: "Utiliser la diagonale du fou", es: "Aprovecha la diagonal del alfil" },
    prompt: {
      fr: "Le fou peut donner échec de loin, en diagonale.",
      es: "El alfil puede dar jaque en diagonal desde lejos.",
    },
    hint: {
      fr: "Essayez de poser le fou en 4b, où le Général d'or le protège.",
      es: "Prueba a colocar el alfil en 4b, donde el General de oro lo protege.",
    },
    success: {
      fr: "Pose du Fou réussie ! L'échec diagonal s'appuie sur votre Général d'or.",
      es: "¡Mate de alfil! El jaque diagonal se apoya en tu General de oro.",
    },
  },
  "silver-at-the-head": {
    title: { fr: "La pose tranchante du Général d'argent", es: "Una colocación incisiva del General de plata" },
    prompt: {
      fr: "Utilisez la forte attaque frontale du Général d'argent.",
      es: "Usa el fuerte ataque frontal del General de plata.",
    },
    hint: {
      fr: "Posez le Général d'argent juste sous le roi. Voyez quelle pièce le protège.",
      es: "Coloca el General de plata justo debajo del rey. Fíjate en qué pieza lo protege.",
    },
    success: {
      fr: "Mat du Général d'argent ! Le Général d'or placé derrière le protège.",
      es: "¡Mate del General de plata! El General de oro que está detrás lo protege.",
    },
  },
  "knight-jump": {
    title: { fr: "Le cavalier saute", es: "El caballo salta" },
    prompt: {
      fr: "Trouvez un échec de cavalier impossible à intercepter.",
      es: "Encuentra un jaque de caballo que no se pueda bloquear.",
    },
    hint: {
      fr: "Le cavalier donne échec depuis une colonne à côté et deux rangées plus bas.",
      es: "El caballo da jaque desde una columna al lado y dos filas más abajo.",
    },
    success: {
      fr: "Mat du cavalier ! Un échec sauté ne peut pas être paré par interposition.",
      es: "¡Mate de caballo! Un jaque que salta no se puede bloquear interponiendo piezas.",
    },
  },
  "capture-with-rook": {
    title: { fr: "Rapprocher la tour", es: "Acerca la torre" },
    prompt: {
      fr: "Amenez la tour assez près pour que le roi n'ait plus de défense.",
      es: "Acerca la torre tanto que el rey no tenga defensa.",
    },
    hint: {
      fr: "Jouez la tour en 9e. Le cavalier derrière la soutient.",
      es: "Mueve la torre a 9e. El caballo por detrás la apoya.",
    },
    success: {
      fr: "Mat de tour ! Le cavalier protège la tour sur sa case finale.",
      es: "¡Mate de torre! El caballo protege la torre en su casilla final.",
    },
  },
  "pawn-promotion-push": {
    title: { fr: "Le pion promu vaut un Général d'or", es: "El peón promovido vale un General de oro" },
    prompt: {
      fr: "Même l'humble pion cache une grande force.",
      es: "Hasta el humilde peón esconde una gran fuerza.",
    },
    hint: {
      fr: "Avancez le pion de 5c et promouvez-le. La lance derrière le soutient.",
      es: "Avanza el peón de 5c y promuévelo. La lanza detrás lo respalda.",
    },
    success: {
      fr: "Mat par promotion ! Le tokin agit comme un Général d'or, protégé par la lance sur la colonne ouverte.",
      es: "¡Mate por promoción! El tokin funciona como un General de oro, protegido por la lanza en la columna abierta.",
    },
  },
  "horse-power": {
    title: { fr: "Le fou devient cheval dragon", es: "El alfil se convierte en caballo dragón" },
    prompt: {
      fr: "Une pièce promue peut couvrir toutes les fuites à la fois.",
      es: "Una pieza promovida puede cubrir todas las escapatorias a la vez.",
    },
    hint: {
      fr: "Jouez le fou de 3c en 2b et promouvez-le. Le dragon en 5b le soutient latéralement.",
      es: "Mueve el alfil de 3c a 2b y promuévelo. El dragón en 5b lo apoya de lado.",
    },
    success: {
      fr: "Mat du cheval dragon ! Sa portée et l'appui latéral du dragon piègent le roi.",
      es: "¡Mate del caballo dragón! Su alcance y el apoyo lateral del dragón atrapan al rey.",
    },
  },
  "rook-sacrifice-gold-finish": {
    title: { fr: "Sacrifier la tour", es: "Sacrifica la torre" },
    prompt: {
      fr: "Tsume en 3 coups. Laissez le roi prendre votre tour, puis concluez avec le général d'or.",
      es: "Tsume de 3 jugadas. Deja que el rey capture tu torre y remata con el general de oro.",
    },
    hints: [
      {
        fr: "Jouez la tour en 7a pour forcer le roi à bouger.",
        es: "Mueve la torre a 7a y obliga al rey a moverse.",
      },
      {
        fr: "Quand le roi la capture, posez le Général d'or en 7b : mat du Général d'or en tête.",
      es: "Cuando el rey capture la torre, coloca el General de oro en 7b: mate delante del rey.",
      },
    ],
    success: {
      fr: "Le sacrifice de tour a attiré le roi, et le Général d'or a conclu le mat.",
      es: "El sacrificio de torre atrajo al rey y el General de oro remató el mate.",
    },
  },
  "knight-relay": {
    title: { fr: "Le relais des deux cavaliers", es: "El relevo de dos caballos" },
    prompt: {
      fr: "Tsume en 3 coups. Le premier cavalier chasse le roi ; le second conclut.",
      es: "Tsume de 3 jugadas. El primer caballo desplaza al rey; el segundo remata.",
    },
    hints: [
      {
        fr: "Posez le cavalier en 6c : un échec sauté imparable.",
        es: "Coloca el caballo en 6c: un jaque saltado imparable.",
      },
      {
        fr: "Jouez le cavalier du plateau en 7a. Il doit se promouvoir sur la dernière rangée.",
        es: "Mueve el caballo del tablero a 7a. Debe promover en la última fila.",
      },
    ],
    success: {
      fr: "Relais de cavaliers ! Le second s'est promu et a couvert la dernière fuite du roi.",
      es: "¡Relevo de caballos! El segundo promovió y cubrió la última escapatoria del rey.",
    },
  },
  "silver-then-bishop": {
    title: { fr: "Chasser avec le Général d'argent, mater avec le fou", es: "Empuja con el General de plata, mata con el alfil" },
    prompt: {
      fr: "Tsume en 3 coups. Utilisez deux pièces différentes de votre main, dans l'ordre.",
      es: "Tsume de 3 jugadas. Usa dos piezas distintas de tu mano, en orden.",
    },
    hints: [
      {
        fr: "Posez le Général d'argent en 8b pour donner échec en diagonale.",
        es: "Coloca el General de plata en 8b para dar jaque en diagonal.",
      },
      {
        fr: "Quand le roi descend, posez le fou en 8a.",
        es: "Cuando el rey baje, coloca el alfil en 8a.",
      },
    ],
    success: {
      fr: "Le Général d'argent a délogé le roi et la diagonale du fou a conclu le mat.",
      es: "El General de plata expulsó al rey y la diagonal del alfil completó el mate.",
    },
  },
  "silver-lure-gold-pincer": {
    title: { fr: "Attirer avec le Général d'argent, pincer avec le Général d'or", es: "Atrae con el General de plata, atenaza con el General de oro" },
    prompt: {
      fr: "Tsume en 3 coups. Vos Généraux d'or et d'argent contrôlent les deux côtés.",
      es: "Tsume de 3 jugadas. Tus generales de oro y de plata controlan ambos lados.",
    },
    hints: [
      {
        fr: "Posez le Général d'argent en 4b pour attirer le roi vers 3b.",
        es: "Coloca el General de plata en 4b para atraer al rey a 3b.",
      },
      {
        fr: "Posez le Général d'or en 3c pour pincer le roi par en dessous.",
        es: "Coloca el General de oro en 3c para atenazar al rey desde abajo.",
      },
    ],
    success: {
      fr: "Le Général d'argent a attiré le roi en coupant sa retraite, et le Général d'or a conclu la tenaille.",
      es: "El General de plata atrajo al rey cortando su retirada y el General de oro cerró la tenaza.",
    },
  },
  "rook-silver-gold-relay": {
    title: { fr: "Sacrifier, chasser, conclure", es: "Sacrifica, persigue y remata" },
    prompt: {
      fr: "Tsume en 5 coups. Trouvez le bon ordre pour la tour, le général d'argent et le général d'or.",
      es: "Tsume de 5 jugadas. Encuentra el orden correcto para la torre, el general de plata y el general de oro.",
    },
    hints: [
      {
        fr: "Posez d'abord la tour en 8b et laissez le roi la prendre.",
        es: "Primero coloca la torre en 8b y deja que el rey la capture.",
      },
      {
        fr: "Quand le roi arrive en 8b, posez le Général d'argent en 7c pour le chasser.",
        es: "Cuando el rey llegue a 8b, coloca el General de plata en 7c para expulsarlo.",
      },
      {
        fr: "Concluez avec le Général d'or en 8b, en utilisant toute votre main.",
        es: "Remata con el General de oro en 8b, usando toda tu mano.",
      },
    ],
    success: {
      fr: "Le sacrifice de tour a attiré le roi, le Général d'argent l'a chassé et le Général d'or a conclu sans pièce restante en main.",
      es: "El sacrificio de torre atrajo al rey, el General de plata lo persiguió y el General de oro remató sin piezas sobrantes.",
    },
  },
  "silver-bishop-gold-relay": {
    title: { fr: "Relais Général d'argent, Fou et Général d'or", es: "Relevo de General de plata, Alfil y General de oro" },
    prompt: {
      fr: "Tsume en 5 coups. Trois pièces différentes font faire l'aller-retour au roi.",
      es: "Tsume de 5 jugadas. Tres piezas distintas hacen ir y volver al rey.",
    },
    hints: [
      {
        fr: "Posez le Général d'argent en 3b pour attirer le roi vers le bas.",
        es: "Coloca el General de plata en 3b para atraer al rey hacia abajo.",
      },
      {
        fr: "Quand le roi arrive en 3b, posez le fou en 2c.",
        es: "Cuando el rey llegue a 3b, coloca el alfil en 2c.",
      },
      {
        fr: "Quand le roi revient, Général d'or en 3b. Plus rien en main.",
        es: "Cuando el rey vuelva, General de oro en 3b. No queda nada en mano.",
      },
    ],
    success: {
      fr: "Le roi a pris le Général d'argent, le fou l'a repoussé et le Général d'or a conclu un mat propre, main vide.",
      es: "El rey tomó el General de plata, el alfil lo hizo retroceder y el General de oro completó un mate limpio con la mano vacía.",
    },
  },
  "silver-sacrifice-gold-return": {
    title: { fr: "Donnez le Général d'argent, rappelez le roi", es: "Entrega el General de plata y haz volver al rey" },
    prompt: {
      fr: "Tsume en 5 coups. Sacrifiez un général d'argent, puis fermez le réseau de mat.",
      es: "Tsume de 5 jugadas. Sacrifica un general de plata y completa la red de mate.",
    },
    hints: [
      {
        fr: "Sacrifiez un Général d'argent en 2b et laissez le roi le prendre.",
        es: "Sacrifica un General de plata en 2b y deja que el rey lo capture.",
      },
      {
        fr: "Posez le Général d'or en 2c : le pion le soutient et renvoie le roi vers 3a.",
        es: "Coloca el General de oro en 2c: el peón lo apoya y devuelve al rey a 3a.",
      },
      {
        fr: "Concluez avec le second Général d'argent en 3b.",
        es: "Remata con el segundo General de plata en 3b.",
      },
    ],
    success: {
      fr: "Le sacrifice du Général d'argent a attiré le roi, le Général d'or l'a renvoyé et le second Général d'argent a conclu, main vide.",
      es: "El sacrificio del General de plata atrajo al rey, el General de oro lo hizo volver y el segundo General de plata remató con la mano vacía.",
    },
  },
  "lance-backed-silvers": {
    title: { fr: "Les Généraux d'argent soutenus par la Lance", es: "Generales de plata apoyados por la Lanza" },
    prompt: {
      fr: "Tsume en 5 coups. Utilisez le soutien à distance de la lance.",
      es: "Tsume de 5 jugadas. Aprovecha el apoyo a distancia de la lanza.",
    },
    hints: [
      {
        fr: "Posez un Général d'argent en 4b pour pousser le roi vers 2a.",
        es: "Coloca un General de plata en 4b para empujar al rey a 2a.",
      },
      {
        fr: "Posez le second Général d'argent en 1b — la lance le protège, le roi ne peut pas le prendre.",
        es: "Coloca el segundo General de plata en 1b: la Lanza lo protege y el Rey no puede capturarlo.",
      },
      {
        fr: "Le roi a fui en 3b : posez le Général d'or en 3c, c'est mat.",
        es: "El rey huyó a 3b: coloca el General de oro en 3c, mate.",
      },
    ],
    success: {
      fr: "La portée lointaine de la lance a soutenu le Général d'argent et le Général d'or a conclu — une coordination à distance.",
      es: "El alcance lejano de la lanza sostuvo el General de plata y el General de oro remató: coordinación a distancia.",
    },
  },
  "silver-stepping-stone": {
    title: { fr: "Empilez les Généraux d'argent, concluez au Général d'or", es: "Apila los Generales de plata y remata con el General de oro" },
    prompt: {
      fr: "Tsume en 5 coups. Le premier général d'argent est un sacrifice.",
      es: "Tsume de 5 jugadas. El primer general de plata es un sacrificio.",
    },
    hints: [
      {
        fr: "Sacrifiez un Général d'argent en 4b et laissez le roi le prendre.",
        es: "Sacrifica un General de plata en 4b y deja que el rey lo capture.",
      },
      {
        fr: "Posez le second Général d'argent en 4c — le Général d'or en 5d le protège.",
        es: "Coloca el segundo General de plata en 4c: el General de oro de 5d lo protege.",
      },
      {
        fr: "Le roi a fui en 5a : posez le Général d'or en 5b, mat du Général d'or en tête.",
        es: "El rey huyó a 5a: coloca el General de oro en 5b para dar mate delante del rey.",
      },
    ],
    success: {
      fr: "Le Général d'argent sacrifié a servi d'appui, et le Général d'or en tête a conclu — les deux Généraux d'argent ont ouvert la voie.",
      es: "El General de plata sacrificado sirvió de apoyo y el General de oro delante del Rey remató: los dos Generales de plata abrieron el camino.",
    },
  },
  "knight-gold-corner-drive": {
    title: { fr: "Pousser le roi dans le coin", es: "Empuja al rey al rincón" },
    prompt: {
      fr: "Tsume en 5 coups. Commencez par un échec de cavalier et poussez le roi dans le coin.",
      es: "Tsume de 5 jugadas. Empieza con un jaque de caballo y lleva al rey al rincón.",
    },
    hints: [
      {
        fr: "Posez le cavalier en 2c : un échec sauté ne peut pas être intercepté.",
        es: "Coloca el caballo en 2c: un jaque saltado no se puede bloquear.",
      },
      {
        fr: "Posez le Général d'or en 3a pour pousser le roi vers 2b.",
        es: "Coloca el General de oro en 3a para empujar al rey a 2b.",
      },
      {
        fr: "Concluez par le Général d'argent en 1c : sa portée diagonale achève le mat.",
        es: "Remata con el General de plata en 1c: su alcance diagonal completa el mate.",
      },
    ],
    success: {
      fr: "Le cavalier ouvre, le Général d'or pousse, le Général d'argent conclut : trois pièces de main en parfaite coordination.",
      es: "El caballo abre, el General de oro empuja y el General de plata remata: tres piezas de la mano en plena coordinación.",
    },
  },
  "knight-silver-bishop-gold-relay": {
    title: { fr: "Sacrifier le cavalier, puis conclure", es: "Sacrifica el caballo y remata" },
    prompt: {
      fr: "Tsume en 7 coups. Attirez le roi avec le cavalier, puis jouez le général d'argent, le fou et le général d'or dans cet ordre.",
      es: "Tsume de 7 jugadas. Atrae al rey con el caballo y sigue con el general de plata, el alfil y el general de oro, en ese orden.",
    },
    hints: [
      {
        fr: "Jouez le cavalier de 4c en 3a, promouvez-le et laissez le roi le prendre.",
        es: "Mueve el caballo de 4c a 3a, promuévelo y deja que el rey lo capture.",
      },
      {
        fr: "Quand le roi arrive en 3a, posez le Général d'argent en 3b pour l'attirer vers le bas.",
        es: "Cuando el rey llegue a 3a, coloca el General de plata en 3b para atraerlo hacia abajo.",
      },
      {
        fr: "Quand le roi arrive en 3b, posez le fou en 2c pour le repousser.",
        es: "Cuando el rey llegue a 3b, coloca el alfil en 2c para hacerlo retroceder.",
      },
      {
        fr: "Concluez avec le Général d'or en 3b, en vidant votre main.",
        es: "Remata con el General de oro en 3b, vaciando tu mano.",
      },
    ],
    success: {
      fr: "Le sacrifice du Cavalier a attiré le Roi, et le relais Général d'argent, Fou, Général d'or a conclu, main vide.",
      es: "El sacrificio del Caballo atrajo al Rey y el relevo General de plata, Alfil, General de oro remató con la mano vacía.",
    },
  },
  "wandering-king-two-knights": {
    title: { fr: "Deux cavaliers à la poursuite", es: "Dos caballos a la caza" },
    prompt: {
      fr: "Tsume en 7 coups. Poursuivez le roi avec deux cavaliers.",
      es: "Tsume de 7 jugadas. Persigue al rey con dos caballos.",
    },
    hints: [
      {
        fr: "Posez un cavalier en 2d pour donner échec.",
        es: "Coloca un caballo en 2d para dar jaque.",
      },
      {
        fr: "Posez le Général d'argent en 3d pour pousser le roi vers 2b.",
        es: "Coloca el General de plata en 3d para empujar al rey a 2b.",
      },
      {
        fr: "Posez le second cavalier en 1d pour envoyer le roi vers 3a.",
        es: "Coloca el segundo caballo en 1d para mandar al rey a 3a.",
      },
      {
        fr: "Concluez avec le Général d'or en 3b pour capturer le roi fuyard.",
        es: "Remata con el General de oro en 3b para atrapar al rey errante.",
      },
    ],
    success: {
      fr: "Cavalier, Général d'argent, Cavalier, Général d'or : le Roi fuyard est enfin pris au piège.",
      es: "Caballo, General de plata, Caballo, General de oro: el Rey por fin queda atrapado.",
    },
  },
  "gold-pin-silver-seal": {
    title: { fr: "Bloquez avec le Général d'or, scellez avec le Général d'argent", es: "Fija con el General de oro, sella con el General de plata" },
    prompt: {
      fr: "Tsume en 7 coups. Poursuivez avec le cavalier et le général d'argent, bloquez la fuite avec le général d'or, puis fermez avec le second général d'argent.",
      es: "Tsume de 7 jugadas. Persigue con el caballo y el general de plata, corta la huida con el general de oro y cierra con el segundo general de plata.",
    },
    hints: [
      {
        fr: "Posez le cavalier en 2d pour donner échec.",
        es: "Coloca el caballo en 2d para dar jaque.",
      },
      {
        fr: "Posez un Général d'argent en 3d pour pousser le roi vers 2b.",
        es: "Coloca un General de plata en 3d para empujar al rey a 2b.",
      },
      {
        fr: "Posez le Général d'or en 3b — le roi doit glisser en 1a.",
        es: "Coloca el General de oro en 3b: el rey debe deslizarse a 1a.",
      },
      {
        fr: "Concluez avec le second Général d'argent en 2b — sa portée diagonale mate.",
        es: "Remata con el segundo General de plata en 2b: su alcance diagonal da mate.",
      },
    ],
    success: {
      fr: "Le Cavalier et le Général d'argent ont poursuivi, le Général d'or a fermé la fuite et le dernier Général d'argent a conclu — les quatre pièces en main ont été utilisées.",
      es: "El Caballo y el General de plata persiguieron, el General de oro cerró la huida y el último General de plata remató: se usaron las cuatro piezas de la mano.",
    },
  },
  "corner-knight-net": {
    title: { fr: "Un filet de cavaliers dans le coin", es: "Una red de caballos en el rincón" },
    prompt: {
      fr: "Tsume en 7 coups. Sacrifiez le général d'argent, puis construisez un réseau de mat avec deux cavaliers.",
      es: "Tsume de 7 jugadas. Sacrifica el general de plata y construye una red de mate con dos caballos.",
    },
    hints: [
      {
        fr: "Sacrifiez le Général d'argent en 1b et laissez le roi le prendre.",
        es: "Sacrifica el General de plata en 1b y deja que el rey lo capture.",
      },
      {
        fr: "Posez un cavalier en 2d : échec sauté au roi en 1b.",
        es: "Coloca un caballo en 2d: jaque saltado al rey en 1b.",
      },
      {
        fr: "Posez le Général d'or en 3b pour repousser le roi dans le coin.",
        es: "Coloca el General de oro en 3b para empujar al rey al rincón.",
      },
      {
        fr: "Concluez avec le second cavalier en 2c — le premier garde 1b.",
        es: "Remata con el segundo caballo en 2c: el primero vigila 1b.",
      },
    ],
    success: {
      fr: "Après le sacrifice du Général d'argent et la poussée du Général d'or, la portée des deux Cavaliers a pris le Roi au piège dans le coin.",
      es: "Tras el sacrificio del General de plata y el empuje del General de oro, el alcance de los dos Caballos atrapó al Rey en el rincón.",
    },
  },
  "double-knight-silver-bishop-gold-relay": {
    title: { fr: "Sacrifier deux cavaliers, puis conclure", es: "Sacrifica dos caballos y remata" },
    prompt: {
      fr: "Tsume en 9 coups. Attirez deux fois le roi avec les cavaliers, puis continuez avec le général d'argent, le fou et le général d'or.",
      es: "Tsume de 9 jugadas. Atrae dos veces al rey con los caballos y sigue con el general de plata, el alfil y el general de oro.",
    },
    hints: [
      {
        fr: "Jouez le cavalier de 4d en 3b, promouvez-le et laissez le roi le prendre.",
        es: "Mueve el caballo de 4d a 3b, promuévelo y deja que el rey lo capture.",
      },
      {
        fr: "Puis jouez le cavalier de 4c en 3a, promouvez-le et laissez le roi le prendre encore.",
        es: "Luego mueve el caballo de 4c a 3a, promuévelo y deja que el rey lo capture otra vez.",
      },
      {
        fr: "Quand le roi arrive en 3a, posez le Général d'argent en 3b pour l'attirer vers le bas.",
        es: "Cuando el rey llegue a 3a, coloca el General de plata en 3b para atraerlo hacia abajo.",
      },
      {
        fr: "Quand le roi arrive en 3b, posez le fou en 2c pour le repousser.",
        es: "Cuando el rey llegue a 3b, coloca el alfil en 2c para hacerlo retroceder.",
      },
      {
        fr: "Concluez avec le Général d'or en 3b, en vidant votre main.",
        es: "Remata con el General de oro en 3b, vaciando tu mano.",
      },
    ],
    success: {
      fr: "Deux sacrifices de Cavalier ont attiré le Roi, et le relais Général d'argent, Fou, Général d'or a conclu, main vide.",
      es: "Dos sacrificios de Caballo atrajeron al Rey y el relevo General de plata, Alfil, General de oro remató con la mano vacía.",
    },
  },
  "double-silver-sacrifice-chase": {
    title: { fr: "Deux sacrifices de Généraux d'argent", es: "Dos sacrificios de Generales de plata" },
    prompt: {
      fr: "Tsume en 9 coups. Sacrifiez les deux Généraux d'argent, puis concluez avec un cavalier.",
      es: "Tsume de 9 jugadas. Sacrifica los dos generales de plata y remata con un caballo.",
    },
    hints: [
      {
        fr: "Posez un Général d'argent en 4b pour pousser le roi vers 2a.",
        es: "Coloca un General de plata en 4b para empujar al rey a 2a.",
      },
      {
        fr: "Sacrifiez le second Général d'argent en 1b. Laissez le roi le prendre.",
        es: "Sacrifica el segundo General de plata en 1b. Deja que el rey lo capture.",
      },
      {
        fr: "Posez un cavalier en 2d : cet échec sauté ne peut pas être intercepté.",
        es: "Coloca un caballo en 2d: ese jaque saltado no se puede bloquear.",
      },
      {
        fr: "Posez le Général d'or en 1b pour pousser le roi vers 2c.",
        es: "Coloca el General de oro en 1b para empujar al rey a 2c.",
      },
      {
        fr: "Concluez avec le second cavalier en 3e.",
        es: "Remata con el segundo caballo en 3e.",
      },
    ],
    success: {
      fr: "Deux sacrifices de Général d'argent, puis Cavalier, Général d'or, Cavalier : une longue chasse calculée jusqu'au bout.",
      es: "Dos sacrificios de General de plata y después Caballo, General de oro, Caballo: una larga persecución calculada hasta el final.",
    },
  },
  "dragon-bishop-board-relay": {
    title: { fr: "Relais du dragon et des deux fous", es: "Relevo del dragón y los dos alfiles" },
    prompt: {
      fr: "Tsume en 5 coups sans pièce en main. Poursuivez le roi uniquement avec le dragon et les deux fous du plateau.",
      es: "Tsume de 5 jugadas sin piezas en la mano. Persigue al rey solo con el dragón y los dos alfiles del tablero.",
    },
    hints: [
      {
        fr: "Jouez le dragon de 9d en 9a et chassez le roi en diagonale vers le bas.",
        es: "Mueve el dragón de 9d a 9a y empuja al rey en diagonal hacia abajo.",
      },
      {
        fr: "Jouez le fou de 6d en 7c et promouvez-le pour renvoyer le roi sur la première rangée.",
        es: "Mueve el alfil de 6d a 7c y promuévelo para devolver al rey a la primera fila.",
      },
      {
        fr: "Enfin, jouez le fou de 5a en 6b et promouvez-le : le cheval dragon donne mat.",
        es: "Por último, mueve el alfil de 5a a 6b y promuévelo: el caballo dragón da mate.",
      },
    ],
    success: {
      fr: "Le dragon a poursuivi, un fou s'est promu pour continuer l'attaque et l'autre est devenu cheval dragon pour mater — tout sur le plateau.",
      es: "El dragón persiguió, un alfil promovió para mantener el ataque y el otro se convirtió en caballo dragón para dar mate: todo sobre el tablero.",
    },
  },
  "promoted-lance-dragon-board-relay": {
    title: { fr: "Poursuivre avec la lance promue, conclure avec le dragon", es: "Persigue con la lanza promovida y remata con el dragón" },
    prompt: {
      fr: "Tsume en 5 coups sans pièce en main. Coordonnez la lance promue et la tour déjà présentes sur le plateau.",
      es: "Tsume de 5 jugadas sin piezas en la mano. Coordina la lanza promovida y la torre que ya están en el tablero.",
    },
    hints: [
      {
        fr: "Jouez la lance promue de 1d en 2c pour pousser le roi en 2a.",
        es: "Mueve la lanza promovida de 1d a 2c para empujar al rey a 2a.",
      },
      {
        fr: "Jouez la tour de 1g en 1b et promouvez-la pour pousser le roi en 3a.",
        es: "Mueve la torre de 1g a 1b y promuévela para empujar al rey a 3a.",
      },
      {
        fr: "Enfin, jouez le dragon de 1b en 3b ; avec le Général d'or, il donne mat.",
        es: "Por último, mueve el dragón de 1b a 3b; junto con el General de oro da mate.",
      },
    ],
    success: {
      fr: "La lance promue a poursuivi, la tour est devenue dragon, puis le dragon a glissé de côté pour mater — sans pièce en main.",
      es: "La lanza promovida persiguió, la torre se convirtió en dragón y el dragón se deslizó de lado para dar mate, sin piezas en mano.",
    },
  },
};
