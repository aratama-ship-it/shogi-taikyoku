// 基本問題のフランス語・スペイン語テキスト。
// puzzles.mjs が読み込み、各問題の title / prompt / hint(s) / success にマージする。
// 新しい問題を追加したら、ここにも fr / es を追加すること
// （tests/game-core.test.mjs の言語完全性テストが漏れを検出する）。

export const PUZZLE_TRANSLATIONS = {
  "gold-at-the-head": {
    title: { fr: "L'or porte le coup final", es: "El oro remata" },
    prompt: {
      fr: "Trouvez le coup qui ne laisse au roi aucune fuite.",
      es: "Encuentra la jugada que no deja escapatoria al rey.",
    },
    hint: {
      fr: "Un or en main est très fort juste devant le roi.",
      es: "Un oro en mano es muy fuerte justo delante del rey.",
    },
    success: {
      fr: "Mat de l'or en tête ! L'or contrôle le roi et toutes les cases voisines.",
      es: "¡Mate de oro de cabeza! El oro cubre al rey y todas las casillas cercanas.",
    },
  },
  "rook-at-the-edge": {
    title: { fr: "Verrouiller le bord avec la tour", es: "Sella el borde con la torre" },
    prompt: {
      fr: "Un roi au bord a moins de cases disponibles.",
      es: "Un rey en el borde tiene menos casillas disponibles.",
    },
    hint: {
      fr: "Parachutez la tour juste sous le roi, protégée par l'or.",
      es: "Suelta la torre justo debajo del rey, protegida por el oro.",
    },
    success: {
      fr: "Mat par parachutage de tour ! Le roi ne peut pas la prendre : l'or la protège.",
      es: "¡Mate de torre! El rey no puede capturarla porque el oro la protege.",
    },
  },
  "bishop-diagonal": {
    title: { fr: "Utiliser la diagonale du fou", es: "Aprovecha la diagonal del alfil" },
    prompt: {
      fr: "Le fou peut donner échec de loin, en diagonale.",
      es: "El alfil puede dar jaque en diagonal desde lejos.",
    },
    hint: {
      fr: "Essayez de parachuter le fou en 4b, où l'or le protège.",
      es: "Prueba a soltar el alfil en 4b, donde el oro lo protege.",
    },
    success: {
      fr: "Parachutage de fou réussi ! L'échec diagonal s'appuie sur votre or.",
      es: "¡Mate de alfil! El jaque diagonal se apoya en tu oro.",
    },
  },
  "silver-at-the-head": {
    title: { fr: "Le parachutage tranchant de l'argent", es: "Una plata afilada" },
    prompt: {
      fr: "Utilisez la forte attaque frontale de l'argent.",
      es: "Usa el fuerte ataque frontal de la plata.",
    },
    hint: {
      fr: "Parachutez l'argent juste sous le roi. Voyez quelle pièce le protège.",
      es: "Suelta la plata justo debajo del rey. Fíjate en qué pieza la protege.",
    },
    success: {
      fr: "Mat d'argent ! L'or derrière lui rend le coup sûr.",
      es: "¡Mate de plata! El oro detrás la hace segura.",
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
    title: { fr: "Le pion promu vaut un or", es: "El peón promovido vale un oro" },
    prompt: {
      fr: "Même l'humble pion cache une grande force.",
      es: "Hasta el humilde peón esconde una gran fuerza.",
    },
    hint: {
      fr: "Avancez le pion de 5c et promouvez-le. La lance derrière le soutient.",
      es: "Avanza el peón de 5c y promuévelo. La lanza detrás lo respalda.",
    },
    success: {
      fr: "Mat par promotion ! Le tokin agit comme un or, protégé par la lance sur la colonne ouverte.",
      es: "¡Mate por promoción! El tokin funciona como un oro, protegido por la lanza en la columna abierta.",
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
      fr: "Mat en 3 coups. Laissez le roi prendre votre tour, puis concluez avec l'or.",
      es: "Mate en 3. Deja que el rey capture tu torre y remata con el oro.",
    },
    hints: [
      {
        fr: "Jouez la tour en 7a pour forcer le roi à bouger.",
        es: "Mueve la torre a 7a y obliga al rey a moverse.",
      },
      {
        fr: "Quand le roi la capture, parachutez l'or en 7b : mat de l'or en tête.",
        es: "Cuando el rey capture, suelta el oro en 7b: mate de oro de cabeza.",
      },
    ],
    success: {
      fr: "Le sacrifice de tour a attiré le roi, et l'or a conclu le mat.",
      es: "El sacrificio de torre atrajo al rey y el oro remató el mate.",
    },
  },
  "knight-relay": {
    title: { fr: "Le relais des deux cavaliers", es: "El relevo de dos caballos" },
    prompt: {
      fr: "Mat en 3 coups. Le premier cavalier chasse le roi ; le second conclut.",
      es: "Mate en 3. El primer caballo empuja al rey; el segundo remata.",
    },
    hints: [
      {
        fr: "Parachutez le cavalier en 6c : un échec sauté imparable.",
        es: "Suelta el caballo en 6c: un jaque saltado imparable.",
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
    title: { fr: "Chasser avec l'argent, mater avec le fou", es: "Empuja con la plata, mata con el alfil" },
    prompt: {
      fr: "Mat en 3 coups. Utilisez deux pièces différentes de votre main, dans l'ordre.",
      es: "Mate en 3. Usa dos piezas distintas de tu mano, en orden.",
    },
    hints: [
      {
        fr: "Parachutez l'argent en 8b pour donner échec en diagonale.",
        es: "Suelta la plata en 8b para dar jaque en diagonal.",
      },
      {
        fr: "Quand le roi descend, parachutez le fou en 8a.",
        es: "Cuando el rey baje, suelta el alfil en 8a.",
      },
    ],
    success: {
      fr: "L'argent a délogé le roi et la diagonale du fou a conclu le mat.",
      es: "La plata expulsó al rey y la diagonal del alfil completó el mate.",
    },
  },
  "silver-lure-gold-pincer": {
    title: { fr: "Attirer avec l'argent, pincer avec l'or", es: "Atrae con la plata, atenaza con el oro" },
    prompt: {
      fr: "Mat en 3 coups. Votre or et votre argent forment des murs des deux côtés.",
      es: "Mate en 3. Tu oro y tu plata forman muros a ambos lados.",
    },
    hints: [
      {
        fr: "Parachutez l'argent en 4b pour attirer le roi vers 3b.",
        es: "Suelta la plata en 4b para atraer al rey a 3b.",
      },
      {
        fr: "Parachutez l'or en 3c pour pincer le roi par en dessous.",
        es: "Suelta el oro en 3c para atenazar al rey desde abajo.",
      },
    ],
    success: {
      fr: "L'argent a attiré le roi en coupant sa retraite, et l'or a conclu la tenaille.",
      es: "La plata atrajo al rey cortando su retirada y el oro cerró la tenaza.",
    },
  },
  "rook-silver-gold-relay": {
    title: { fr: "Sacrifier, chasser, conclure", es: "Sacrifica, persigue y remata" },
    prompt: {
      fr: "Mat en 5 coups. Trouvez le bon ordre pour la tour, l'argent et l'or.",
      es: "Mate en 5. Encuentra el orden correcto para torre, plata y oro.",
    },
    hints: [
      {
        fr: "Parachutez d'abord la tour en 8b et laissez le roi la prendre.",
        es: "Primero suelta la torre en 8b y deja que el rey la capture.",
      },
      {
        fr: "Quand le roi arrive en 8b, parachutez l'argent en 7c pour le chasser.",
        es: "Cuando el rey llegue a 8b, suelta la plata en 7c para expulsarlo.",
      },
      {
        fr: "Concluez avec l'or en 8b, en utilisant toute votre main.",
        es: "Remata con el oro en 8b, usando toda tu mano.",
      },
    ],
    success: {
      fr: "Le sacrifice de tour a attiré le roi, l'argent l'a chassé et l'or a conclu sans pièce restante en main.",
      es: "El sacrificio de torre atrajo al rey, la plata lo persiguió y el oro remató sin piezas sobrantes.",
    },
  },
  "silver-bishop-gold-relay": {
    title: { fr: "Relais argent, fou, or", es: "Relevo de plata, alfil y oro" },
    prompt: {
      fr: "Mat en 5 coups. Trois pièces différentes font faire l'aller-retour au roi.",
      es: "Mate en 5. Tres piezas distintas hacen ir y volver al rey.",
    },
    hints: [
      {
        fr: "Parachutez l'argent en 3b pour attirer le roi vers le bas.",
        es: "Suelta la plata en 3b para atraer al rey hacia abajo.",
      },
      {
        fr: "Quand le roi arrive en 3b, parachutez le fou en 2c.",
        es: "Cuando el rey llegue a 3b, suelta el alfil en 2c.",
      },
      {
        fr: "Quand le roi revient, or en 3b. Plus rien en main.",
        es: "Cuando el rey vuelva, oro en 3b. No queda nada en mano.",
      },
    ],
    success: {
      fr: "Le roi a pris l'argent, le fou l'a repoussé et l'or a conclu un mat propre, main vide.",
      es: "El rey tomó la plata, el alfil lo hizo retroceder y el oro completó un mate limpio con la mano vacía.",
    },
  },
  "silver-sacrifice-gold-return": {
    title: { fr: "Donnez l'argent, rappelez le roi", es: "Entrega la plata y haz volver al rey" },
    prompt: {
      fr: "Mat en 5 coups. Donnez un argent, puis achevez la tenaille.",
      es: "Mate en 5. Entrega una plata y completa la tenaza.",
    },
    hints: [
      {
        fr: "Sacrifiez un argent en 2b et laissez le roi le prendre.",
        es: "Sacrifica una plata en 2b y deja que el rey la capture.",
      },
      {
        fr: "Parachutez l'or en 2c : le pion le soutient et renvoie le roi vers 3a.",
        es: "Suelta el oro en 2c: el peón lo apoya y devuelve al rey a 3a.",
      },
      {
        fr: "Concluez avec le second argent en 3b.",
        es: "Remata con la segunda plata en 3b.",
      },
    ],
    success: {
      fr: "Le sacrifice d'argent a attiré le roi, l'or l'a renvoyé et le second argent a conclu, main vide.",
      es: "El sacrificio de plata atrajo al rey, el oro lo hizo volver y la segunda plata remató con la mano vacía.",
    },
  },
  "lance-backed-silvers": {
    title: { fr: "Les argents soutenus par la lance", es: "Platas respaldadas por la lanza" },
    prompt: {
      fr: "Mat en 5 coups. Faites confiance à la portée lointaine de la lance.",
      es: "Mate en 5. Confía en el alcance lejano de la lanza.",
    },
    hints: [
      {
        fr: "Parachutez un argent en 4b pour pousser le roi vers 2a.",
        es: "Suelta una plata en 4b para empujar al rey a 2a.",
      },
      {
        fr: "Parachutez le second argent en 1b — la lance le protège, le roi ne peut pas le prendre.",
        es: "Suelta la segunda plata en 1b: la lanza la protege y el rey no puede capturarla.",
      },
      {
        fr: "Le roi a fui en 3b : parachutez l'or en 3c, c'est mat.",
        es: "El rey huyó a 3b: suelta el oro en 3c, mate.",
      },
    ],
    success: {
      fr: "La portée lointaine de la lance a soutenu l'argent et l'or a conclu — une coordination à distance.",
      es: "El alcance lejano de la lanza sostuvo la plata y el oro remató: coordinación a distancia.",
    },
  },
  "silver-stepping-stone": {
    title: { fr: "Empilez les argents, concluez à l'or", es: "Apila las platas y remata con el oro" },
    prompt: {
      fr: "Mat en 5 coups. Le premier argent est un sacrifice.",
      es: "Mate en 5. La primera plata es un sacrificio.",
    },
    hints: [
      {
        fr: "Sacrifiez un argent en 4b et laissez le roi le prendre.",
        es: "Sacrifica una plata en 4b y deja que el rey la capture.",
      },
      {
        fr: "Parachutez le second argent en 4c — l'or en 5d le protège.",
        es: "Suelta la segunda plata en 4c: el oro de 5d la protege.",
      },
      {
        fr: "Le roi a fui en 5a : parachutez l'or en 5b, mat de l'or en tête.",
        es: "El rey huyó a 5a: suelta el oro en 5b, mate de oro de cabeza.",
      },
    ],
    success: {
      fr: "L'argent sacrifié a servi d'appui, et l'or en tête a conclu — les deux argents ont ouvert la voie.",
      es: "La plata sacrificada sirvió de apoyo y el oro de cabeza remató: las dos platas abrieron el camino.",
    },
  },
  "knight-gold-corner-drive": {
    title: { fr: "Pousser le roi dans le coin", es: "Empuja al rey al rincón" },
    prompt: {
      fr: "Mat en 5 coups. Commencez par un échec de cavalier et poussez le roi dans le coin.",
      es: "Mate en 5. Empieza con un jaque de caballo y lleva al rey al rincón.",
    },
    hints: [
      {
        fr: "Parachutez le cavalier en 2c : un échec sauté ne peut pas être intercepté.",
        es: "Suelta el caballo en 2c: un jaque saltado no se puede bloquear.",
      },
      {
        fr: "Parachutez l'or en 3a pour pousser le roi vers 2b.",
        es: "Suelta el oro en 3a para empujar al rey a 2b.",
      },
      {
        fr: "Concluez par l'argent en 1c : sa portée diagonale achève le mat.",
        es: "Remata con la plata en 1c: su alcance diagonal completa el mate.",
      },
    ],
    success: {
      fr: "Le cavalier ouvre, l'or pousse, l'argent conclut : trois pièces de main en parfaite coordination.",
      es: "El caballo abre, el oro empuja y la plata remata: tres piezas de la mano en plena coordinación.",
    },
  },
  "knight-silver-bishop-gold-relay": {
    title: { fr: "Sacrifier le cavalier, puis conclure", es: "Sacrifica el caballo y remata" },
    prompt: {
      fr: "Mat en 7 coups. Attirez le roi avec le cavalier, puis argent, fou et or dans l'ordre.",
      es: "Mate en 7. Atrae al rey con el caballo y sigue con plata, alfil y oro en orden.",
    },
    hints: [
      {
        fr: "Jouez le cavalier de 4c en 3a, promouvez-le et laissez le roi le prendre.",
        es: "Mueve el caballo de 4c a 3a, promuévelo y deja que el rey lo capture.",
      },
      {
        fr: "Quand le roi arrive en 3a, parachutez l'argent en 3b pour l'attirer vers le bas.",
        es: "Cuando el rey llegue a 3a, suelta la plata en 3b para atraerlo hacia abajo.",
      },
      {
        fr: "Quand le roi arrive en 3b, parachutez le fou en 2c pour le repousser.",
        es: "Cuando el rey llegue a 3b, suelta el alfil en 2c para hacerlo retroceder.",
      },
      {
        fr: "Concluez avec l'or en 3b, en vidant votre main.",
        es: "Remata con el oro en 3b, vaciando tu mano.",
      },
    ],
    success: {
      fr: "Le sacrifice du cavalier a attiré le roi, et le relais argent-fou-or a conclu, main vide.",
      es: "El sacrificio del caballo atrajo al rey y el relevo plata-alfil-oro remató con la mano vacía.",
    },
  },
  "wandering-king-two-knights": {
    title: { fr: "Deux cavaliers à la poursuite", es: "Dos caballos a la caza" },
    prompt: {
      fr: "Mat en 7 coups. Poursuivez le roi fuyard avec deux cavaliers.",
      es: "Mate en 7. Persigue al rey errante con dos caballos.",
    },
    hints: [
      {
        fr: "Parachutez un cavalier en 2d pour donner échec.",
        es: "Suelta un caballo en 2d para dar jaque.",
      },
      {
        fr: "Parachutez l'argent en 3d pour pousser le roi vers 2b.",
        es: "Suelta la plata en 3d para empujar al rey a 2b.",
      },
      {
        fr: "Parachutez le second cavalier en 1d pour envoyer le roi vers 3a.",
        es: "Suelta el segundo caballo en 1d para mandar al rey a 3a.",
      },
      {
        fr: "Concluez avec l'or en 3b pour capturer le roi fuyard.",
        es: "Remata con el oro en 3b para atrapar al rey errante.",
      },
    ],
    success: {
      fr: "Cavalier, argent, cavalier, or : le roi fuyard est enfin capturé.",
      es: "Caballo, plata, caballo, oro: el rey errante por fin cae.",
    },
  },
  "gold-pin-silver-seal": {
    title: { fr: "Bloquez avec l'or, scellez avec l'argent", es: "Fija con el oro, sella con la plata" },
    prompt: {
      fr: "Mat en 7 coups. Poursuivez avec cavalier et argent, bloquez la fuite avec l'or et scellez avec le second argent.",
      es: "Mate en 7. Persigue con caballo y plata, corta la huida con el oro y sella con la segunda plata.",
    },
    hints: [
      {
        fr: "Parachutez le cavalier en 2d pour donner échec.",
        es: "Suelta el caballo en 2d para dar jaque.",
      },
      {
        fr: "Parachutez un argent en 3d pour pousser le roi vers 2b.",
        es: "Suelta una plata en 3d para empujar al rey a 2b.",
      },
      {
        fr: "Parachutez l'or en 3b — le roi doit glisser en 1a.",
        es: "Suelta el oro en 3b: el rey debe deslizarse a 1a.",
      },
      {
        fr: "Concluez avec le second argent en 2b — sa portée diagonale mate.",
        es: "Remata con la segunda plata en 2b: su alcance diagonal da mate.",
      },
    ],
    success: {
      fr: "Cavalier et argent ont poursuivi, l'or a fermé la fuite et le dernier argent a conclu — les quatre pièces de main utilisées.",
      es: "Caballo y plata persiguieron, el oro cerró la huida y la última plata remató: las cuatro piezas de la mano usadas.",
    },
  },
  "corner-knight-net": {
    title: { fr: "Un filet de cavaliers dans le coin", es: "Una red de caballos en el rincón" },
    prompt: {
      fr: "Mat en 7 coups. Sacrifiez l'argent, puis tissez un filet avec deux cavaliers.",
      es: "Mate en 7. Sacrifica la plata y teje una red con dos caballos.",
    },
    hints: [
      {
        fr: "Sacrifiez l'argent en 1b et laissez le roi le prendre.",
        es: "Sacrifica la plata en 1b y deja que el rey la capture.",
      },
      {
        fr: "Parachutez un cavalier en 2d : échec sauté au roi en 1b.",
        es: "Suelta un caballo en 2d: jaque saltado al rey en 1b.",
      },
      {
        fr: "Parachutez l'or en 3b pour repousser le roi dans le coin.",
        es: "Suelta el oro en 3b para empujar al rey al rincón.",
      },
      {
        fr: "Concluez avec le second cavalier en 2c — le premier garde 1b.",
        es: "Remata con el segundo caballo en 2c: el primero vigila 1b.",
      },
    ],
    success: {
      fr: "Après le sacrifice d'argent et la poussée de l'or, la portée des deux cavaliers a capturé le roi dans le coin.",
      es: "Tras el sacrificio de plata y el empuje del oro, el alcance de los dos caballos atrapó al rey en el rincón.",
    },
  },
  "double-knight-silver-bishop-gold-relay": {
    title: { fr: "Sacrifier deux cavaliers, puis conclure", es: "Sacrifica dos caballos y remata" },
    prompt: {
      fr: "Mat en 9 coups. Attirez deux fois le roi avec les cavaliers, puis argent, fou et or.",
      es: "Mate en 9. Atrae al rey dos veces con los caballos y sigue con plata, alfil y oro.",
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
        fr: "Quand le roi arrive en 3a, parachutez l'argent en 3b pour l'attirer vers le bas.",
        es: "Cuando el rey llegue a 3a, suelta la plata en 3b para atraerlo hacia abajo.",
      },
      {
        fr: "Quand le roi arrive en 3b, parachutez le fou en 2c pour le repousser.",
        es: "Cuando el rey llegue a 3b, suelta el alfil en 2c para hacerlo retroceder.",
      },
      {
        fr: "Concluez avec l'or en 3b, en vidant votre main.",
        es: "Remata con el oro en 3b, vaciando tu mano.",
      },
    ],
    success: {
      fr: "Deux sacrifices de cavalier ont attiré le roi, et le relais argent-fou-or a conclu, main vide.",
      es: "Dos sacrificios de caballo atrajeron al rey y el relevo plata-alfil-oro remató con la mano vacía.",
    },
  },
  "double-silver-sacrifice-chase": {
    title: { fr: "Deux sacrifices d'argent", es: "Dos sacrificios de plata" },
    prompt: {
      fr: "Mat en 9 coups. Donnez vos deux argents sans regret, puis concluez au cavalier.",
      es: "Mate en 9. Entrega tus dos platas sin miedo y remata con el caballo.",
    },
    hints: [
      {
        fr: "Parachutez un argent en 4b pour pousser le roi vers 2a.",
        es: "Suelta una plata en 4b para empujar al rey a 2a.",
      },
      {
        fr: "Sacrifiez le second argent en 1b. Laissez le roi le prendre.",
        es: "Sacrifica la segunda plata en 1b. Deja que el rey la capture.",
      },
      {
        fr: "Parachutez un cavalier en 2d : cet échec sauté ne peut pas être intercepté.",
        es: "Suelta un caballo en 2d: ese jaque saltado no se puede bloquear.",
      },
      {
        fr: "Parachutez l'or en 1b pour pousser le roi vers 2c.",
        es: "Suelta el oro en 1b para empujar al rey a 2c.",
      },
      {
        fr: "Concluez avec le second cavalier en 3e.",
        es: "Remata con el segundo caballo en 3e.",
      },
    ],
    success: {
      fr: "Deux sacrifices d'argent, puis cavalier, or, cavalier : une longue chasse en 9 coups lue jusqu'au bout.",
      es: "Dos sacrificios de plata y luego caballo, oro, caballo: una larga cacería de 9 jugadas leída hasta el final.",
    },
  },
  "dragon-bishop-board-relay": {
    title: { fr: "Relais du dragon et des deux fous", es: "Relevo del dragón y los dos alfiles" },
    prompt: {
      fr: "Mat en 5 coups sans pièce en main. Poursuivez le roi uniquement avec le dragon et les deux fous du plateau.",
      es: "Mate en 5 sin piezas en mano. Persigue al rey solo con el dragón y los dos alfiles del tablero.",
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
      fr: "Mat en 5 coups sans pièce en main. Coordonnez la lance promue et la tour déjà sur le plateau.",
      es: "Mate en 5 sin piezas en mano. Coordina la lanza promovida y la torre que ya están en el tablero.",
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
        fr: "Enfin, jouez le dragon de 1b en 3b ; avec l'or, il donne mat.",
        es: "Por último, mueve el dragón de 1b a 3b; junto con el oro da mate.",
      },
    ],
    success: {
      fr: "La lance promue a poursuivi, la tour est devenue dragon, puis le dragon a glissé de côté pour mater — sans pièce en main.",
      es: "La lanza promovida persiguió, la torre se convirtió en dragón y el dragón se deslizó de lado para dar mate, sin piezas en mano.",
    },
  },
};
