export const machines = [
  // ==================== KATEGORIA: WYWROTKI ====================
  {
    id: 'man-tgs-8x4',
    name: 'MAN TGS 8x4',
    category: 'wywrotki',
    type: '4-osiowe',
    brand: 'man',
    weight: 32000, // DMC
    specs: {
      "Ładowność": "ok. 20 ton",
      "Napęd": "8x4",
      "Objętość skrzyni": "18 m³",
      "Moc silnika": "400 KM"
    },
    description: "Solidna wywrotka 4-osiowa marki MAN, idealna do transportu ciężkich kruszyw i ziemi. Doskonale sprawdza się w trudnym terenie dzięki napędowi 8x4.",
    features: ["Wysoka ładowność", "Napęd na dwie tylne osie", "Wytrzymała zabudowa", "Niska emisja spalin Euro 6"],
    attachments: "Możliwość wynajmu z doświadczonym kierowcą. Samochód wyposażony w system GPS. Dostępny do pracy ciągłej przy dużych inwestycjach drogowych.",
    image: 'assets/img-wynajem/transport_osprzęt.webp'
  },
  {
    id: 'scania-p410-8x4',
    name: 'Scania P410 8x4',
    category: 'wywrotki',
    type: '4-osiowe',
    brand: 'scania',
    weight: 32000,
    specs: {
      "Ładowność": "ok. 20 ton",
      "Napęd": "8x4",
      "Moc silnika": "410 KM",
      "Norma emisji": "Euro 6"
    },
    description: "Scania P410 to synonim niezawodności i ekonomii. Wywrotka przeznaczona do intensywnej pracy przy wywozie urobku i dostawach materiałów sypkich.",
    features: ["Ekonomiczny silnik", "Komfortowa kabina", "Wysoki prześwit", "System optymalizacji trakcji"],
    attachments: "Pojazd posiada wzmocnioną zabudowę typu Square, idealną do przewozu głazów i gruzu. Możliwość pracy w systemie zmianowym.",
    image: 'assets/img-wynajem/transport_osprzęt.webp'
  },
  {
    id: 'mercedes-arocs-8x4',
    name: 'Mercedes Arocs 8x4',
    category: 'wywrotki',
    type: '4-osiowe',
    brand: 'mercedes',
    weight: 32000,
    specs: {
      "Ładowność": "ok. 21 ton",
      "Napęd": "8x4",
      "Moc silnika": "420 KM",
      "Skrzynia": "Wzmocniona Hardox"
    },
    description: "Specjalista od zadań budowlanych. Mercedes Arocs oferuje potężną moc i wytrzymałość ramy, niezbędną przy transporcie gruzu i ciężkich materiałów.",
    features: ["Wzmocnione zawieszenie", "Duża moc silnika", "Odporność na przeciążenia", "Precyzyjna skrzynia biegów"],
    attachments: "Samochód przystosowany do najcięższych warunków terenowych. Idealny do obsługi kopalni kruszyw i dużych placów budowy.",
    image: 'assets/img-wynajem/transport_osprzęt.webp'
  },
  {
    id: 'renault-kerax-wanna',
    name: 'Renault Kerax',
    category: 'wywrotki',
    type: 'wanna',
    brand: 'renault',
    weight: 40000, // Zestaw
    specs: {
      "Ładowność": "25-27 ton",
      "Typ zabudowy": "Rynna (Wanna)",
      "Objętość": "ok. 24 m³",
      "Przeznaczenie": "Masowe przewozy"
    },
    description: "Zestaw typu 'wanna' dedykowany do transportu dużych ilości kruszyw drogowych i piasku. Idealny do obsługi dużych inwestycji infrastrukturalnych.",
    features: ["Maksymalna ładowność", "Szybki wyładunek", "Szczelna zabudowa", "Stabilność w terenie"],
    attachments: "Zestaw ciągnik + naczepa samowyładowcza (stalowa lub aluminiowa). Przeznaczony do transportu sypkiego: piasek, żwir, tłuczeń, masa bitumiczna.",
    image: 'assets/img-wynajem/transport_osprzęt.webp'
  },
  {
    id: 'zestaw-niskopodwoziowy',
    name: 'Zestaw Niskopodwoziowy',
    category: 'wywrotki', // Kategoria transportowa
    type: 'niskopodwoziowa',
    brand: 'inne',
    weight: 40000,
    specs: {
      "Ładowność": "do 24 ton",
      "Długość pokładu": "13.6 m",
      "Najazdy": "Hydrauliczne",
      "Poszerzenia": "Tak"
    },
    description: "Specjalistyczna naczepa niskopodwoziowa do relokacji maszyn budowlanych. Gwarantujemy bezpieczny transport koparek, ładowarek i walców.",
    features: ["Hydrauliczne najazdy", "Niski kąt najazdu", "Możliwość poszerzenia", "Transport ponadgabarytowy"],
    attachments: "Usługa obejmuje załadunek, transport i rozładunek maszyn, kontenerów oraz konstrukcji stalowych. Posiadamy niezbędne zezwolenia na przejazdy nienormatywne.",
    image: 'assets/img-wynajem/transport_osprzęt.webp'
  },

  // ==================== KATEGORIA: KOPARKI ====================
  // --- Kołowe ---
  {
    id: 'komatsu-pw-140-8',
    name: 'Komatsu PW 140-8',
    category: 'koparki',
    type: 'kolowa',
    brand: 'komatsu',
    weight: 15000,
    specs: {
      "Masa robocza": "15.0 t",
      "Głębokość kopania": "5.1 m",
      "Pojemność łyżki": "0.8 m³",
      "Zasięg": "8.8 m"
    },
    description: "Kompaktowa koparka kołowa Komatsu, idealna do prac w terenie zurbanizowanym. Szybka, zwrotna i precyzyjna.",
    features: ["Kompaktowe wymiary", "Wysoka mobilność", "Ramię łamane", "Szybkozłącze hydrauliczne"],
    attachments: "W zestawie komplet łyżek (30, 60, 90 cm) oraz skarpówka hydrauliczna. Opcjonalnie: młot hydrauliczny, chwytak do krawężników.",
    image: 'assets/wynajem/koparka-kolowa.png'
  },
  {
    id: 'liebherr-316',
    name: 'Liebherr 316',
    category: 'koparki',
    type: 'kolowa',
    brand: 'liebherr',
    weight: 17000,
    specs: {
      "Masa robocza": "17.0 t",
      "Głębokość kopania": "5.6 m",
      "Moc silnika": "105 kW",
      "Zasięg": "9.2 m"
    },
    description: "Uniwersalna maszyna do robót ziemnych i drogowych. Liebherr 316 łączy dużą siłę kopania z mobilnością podwozia kołowego.",
    features: ["Duża stabilność", "Precyzyjne sterowanie", "Łyżka skarpowa w zestawie", "Niskie zużycie paliwa"],
    attachments: "Standardowo wyposażona w szybkozłącze mechaniczne i łyżkę skarpową. Idealna do korytowania pod drogi i chodniki.",
    image: 'assets/wynajem/koparka-kolowa.png'
  },
  {
    id: 'liebherr-900c',
    name: 'Liebherr 900C',
    category: 'koparki',
    type: 'kolowa',
    brand: 'liebherr',
    weight: 18000,
    specs: {
      "Masa robocza": "18.0 t",
      "Głębokość kopania": "6.0 m",
      "Pojemność łyżki": "1.0 m³",
      "Napęd": "4x4"
    },
    description: "Cięższa koparka kołowa do wymagających zadań. Doskonale radzi sobie przy wykopach pod instalacje sanitarne i drogowe.",
    features: ["Wysoka wydajność hydrauliki", "Zwiększony zasięg", "Mocny silnik Deutz", "Komfort operatora"],
    attachments: "Dostępne łyżki do kopania (40-120cm) oraz hydrauliczna łyżka skarpowa. Maszyna posiada wyjścia hydrauliczne pod młot i wiertnicę.",
    image: 'assets/wynajem/koparka-kolowa.png'
  },
  {
    id: 'volvo-ew-160c',
    name: 'VOLVO EW 160C',
    category: 'koparki',
    type: 'kolowa',
    brand: 'volvo',
    weight: 17500,
    specs: {
      "Masa robocza": "17.5 t",
      "Głębokość kopania": "5.7 m",
      "Prędkość jazdy": "35 km/h",
      "Moc": "119 kW"
    },
    description: "Volvo EW160C to lider w klasie 17 ton. Maszyna oferuje płynną pracę hydrauliki i doskonałą widoczność, co zwiększa bezpieczeństwo na budowie.",
    features: ["Płynna hydraulika", "Kabina Volvo Care Cab", "Rototilt (opcja)", "Wysoka siła odspajania"],
    attachments: "Maszyna może być wyposażona w głowicę obrotową (rototilt), co znacznie zwiększa precyzję prac wykończeniowych i skarpowania.",
    image: 'assets/wynajem/koparka-kolowa.png'
  },

  // --- Gąsienicowe ---
  {
    id: 'komatsu-pc-130',
    name: 'Komatsu PC 130',
    category: 'koparki',
    type: 'gasienicowa',
    brand: 'komatsu',
    weight: 13000,
    specs: {
      "Masa robocza": "13.0 t",
      "Głębokość kopania": "5.5 m",
      "Szerokość gąsienic": "500/600 mm",
      "Moc": "68 kW"
    },
    description: "Lekka koparka gąsienicowa, idealna na podmokłe tereny i mniejsze place budowy. Zapewnia niski nacisk na grunt.",
    features: ["Niski nacisk na grunt", "Zwrotność", "Ekonomiczny silnik", "Idealna do melioracji"],
    attachments: "Dedykowana do prac na terenach podmokłych (szerokie gąsienice). Możliwość montażu łyżki ażurowej do czyszczenia rowów.",
    image: 'assets/wynajem/koparka-gasienicowa.png'
  },
  {
    id: 'cat-318-c',
    name: 'CAT 318 C',
    category: 'koparki',
    type: 'gasienicowa',
    brand: 'cat',
    weight: 20000,
    specs: {
      "Masa robocza": "ok. 20.0 t",
      "Głębokość kopania": "6.4 m",
      "Pojemność łyżki": "1.1 m³",
      "Moc": "93 kW"
    },
    description: "Klasyka gatunku. CAT 318 C to wytrzymała maszyna o masie 20 ton, stworzona do ciągłej pracy przy wykopach szerokoprzestrzennych.",
    features: ["Legendarna trwałość CAT", "Duża siła łyżki", "Szerokie gąsienice", "Wysoka wydajność załadunku"],
    attachments: "Maszyna idealna do wykopów pod fundamenty, sieci wod-kan oraz prac drogowych. Dostępne łyżki: 60cm, 100cm, 120cm oraz skarpowa hydrauliczna.",
    image: 'assets/wynajem/koparka-gasienicowa.png'
  },
  {
    id: 'hitachi-350-lc',
    name: 'Hitachi 350 LC',
    category: 'koparki',
    type: 'gasienicowa',
    brand: 'hitachi',
    weight: 35000,
    specs: {
      "Masa robocza": "35.0 t",
      "Głębokość kopania": "7.4 m",
      "Pojemność łyżki": "2.0 m³",
      "Moc": "202 kW"
    },
    description: "Najcięższa maszyna w naszej flocie. 35-tonowy kolos do zadań specjalnych, głębokich wykopów i wyburzeń przemysłowych.",
    features: ["Ogromna wydajność", "Wzmocnione ramię", "Łyżka skalna", "Stabilność przy dużych obciążeniach"],
    attachments: "Przystosowana do najcięższych prac ziemnych. Opcjonalnie wyposażona w osprzęt wyburzeniowy: nożyce do betonu lub młot 2.5t.",
    image: 'assets/wynajem/koparka-gasienicowa.png'
  },

  // --- Mini ---
  {
    id: 'bobcat-minikoparka',
    name: 'BOBCAT Minikoparka',
    category: 'koparki',
    type: 'mini',
    brand: 'bobcat',
    weight: 2500,
    specs: {
      "Masa robocza": "2.5 t",
      "Głębokość kopania": "2.8 m",
      "Szerokość": "140 cm",
      "Moc": "15 kW"
    },
    description: "Wszechstronna minikoparka Bobcat. Niezastąpiona przy przyłączach, pracach ogrodowych i w ciasnych przestrzeniach miejskich.",
    features: ["Rozsuwane gąsienice", "Transport na lawecie", "Duża siła kopania jak na tę klasę", "Precyzyjny joystick"],
    attachments: "Komplet łyżek: 30cm, 50cm, skarpówka. Możliwość podpięcia wiertnicy gruntowej (np. pod słupki ogrodzeniowe).",
    image: 'assets/wynajem/mini-koparka.png'
  },

  // --- Koparko-ładowarki ---
  {
    id: 'jcb-3cx',
    name: 'JCB 3CX',
    category: 'koparki',
    type: 'kolowa',
    brand: 'jcb',
    weight: 8100,
    specs: {
      "Masa robocza": "8.1 t",
      "Pojemność łyżki": "1.0 m³",
      "Napęd": "4x4",
      "Uniwersalność": "Kopanie i ładowanie"
    },
    description: "Koparko-ładowarka JCB 3CX to najbardziej uniwersalna maszyna na budowie. Łączy funkcje koparki i ładowarki czołowej, dzięki czemu może wykonywać zarówno prace ziemne, jak i ładowanie materiałów.",
    features: ["Uniwersalne zastosowanie", "Kopanie i ładowanie", "Napęd 4x4", "Zwrotność i mobilność"],
    attachments: "Standardowo wyposażona w łyżkę ładowarkową z przodu oraz ramię koparki z tyłu. Idealna do prac przyłączeniowych, wykopów i załadunku materiałów sypkich.",
    image: 'assets/wynajem/koparka-kolowa.png'
  },

  // ==================== KATEGORIA: INNE ====================
  {
    id: 'spycharka-cat-d6',
    name: 'Spycharka CAT D6',
    category: 'inne',
    type: 'spycharka',
    brand: 'cat',
    weight: 21000,
    specs: {
      "Masa robocza": "ok. 21 t",
      "Moc": "160 kW",
      "Lemiesz": "SU (pół-wklęsły)",
      "System": "Laserowe sterowanie (opcja)"
    },
    description: "Profesjonalna spycharka gąsienicowa CAT D6. Idealna do niwelacji terenu, zdejmowania humusu i hałdowania materiału.",
    features: ["Wysoka wydajność pchania", "System niwelacji", "Zrywak tylny", "Doskonała przyczepność"],
    attachments: "Maszyna wyposażona w lemiesz typu SU do uniwersalnych prac ziemnych oraz zrywak tylny wielozębowy do spulchniania twardego gruntu.",
    image: 'assets/img-wynajem/sprzet_ciezki.webp'
  },
  {
    id: 'przesiewacz-mobilny',
    name: 'Przesiewacz Mobilny',
    category: 'inne',
    type: 'przesiewacz',
    brand: 'inne',
    weight: 18000,
    specs: {
      "Wydajność": "do 150 t/h",
      "Frakcje": "3 pokłady",
      "Napęd": "Diesel-Elektryczny",
      "Zastosowanie": "Ziemia, kruszywa"
    },
    description: "Mobilny zakład przesiewania. Pozwala na odzysk materiału na budowie, przesiewanie ziemi, gruzu i kruszyw na żądane frakcje.",
    features: ["Wysoka mobilność", "Szybki czas rozkładania", "Regulowane frakcje", "Własne zasilanie"],
    attachments: "Możliwość konfiguracji sit pod konkretne zamówienie (np. ziemia ogrodowa, tłuczeń, piasek).",
    image: 'assets/img-wynajem/sprzet_ciezki.webp'
  },
  {
    id: 'zamiatarka-iveco',
    name: 'Zamiatarka IVECO',
    category: 'inne',
    type: 'zamiatarka',
    brand: 'iveco',
    weight: 12000,
    specs: {
      "Szerokość zamiatania": "2.5 m",
      "Zbiornik na wodę": "1000 l",
      "Myjka": "Ciśnieniowa (lanca)",
      "Pojemność zbiornika": "6 m³"
    },
    description: "Zamiatarka uliczna na podwoziu ciężarowym. Niezbędna do utrzymania czystości dróg dojazdowych na placu budowy i ulic publicznych.",
    features: ["System zraszania", "Szczotki talerzowe", "Myjka ciśnieniowa ręczna", "Wydajny system ssący"],
    attachments: "Pojazd w pełni autonomiczny. Posiada własny zbiornik na wodę oraz lance do ręcznego mycia znaków lub trudno dostępnych miejsc.",
    image: 'assets/img-wynajem/sprzet_ciezki.webp'
  },

  // ==================== KATEGORIA: ŁADOWARKI ====================
  {
    id: 'ladowarka-teleskopowa-jcb',
    name: 'Ładowarka JCB 540-170',
    category: 'ladowarki',
    type: 'teleskopowa',
    brand: 'jcb',
    weight: 12000,
    specs: {
      "Wysokość podnoszenia": "17.0 m",
      "Udźwig max": "4.0 t",
      "Moc silnika": "100 KM",
      "Napęd": "4x4x4"
    },
    description: "Ładowarka teleskopowa o imponującym zasięgu 17 metrów. Niezastąpiona przy budowie hal, podawaniu materiałów na stropy i konstrukcje.",
    features: ["Duży zasięg", "Stabilizatory hydrauliczne", "Sterowanie krab", "Widły do palet"],
    attachments: "W zestawie: widły do palet, łyżka ładowarkowa. Opcjonalnie: kosz osobowy (zwyżka), zawiesie hakowe.",
    image: 'assets/img-wynajem/ładowarki.webp'
  },
  {
    id: 'bobcat-miniladowarka-873',
    name: 'BOBCAT 873',
    category: 'ladowarki',
    type: 'miniladowarka',
    brand: 'bobcat',
    weight: 3200,
    specs: {
      "Masa robocza": "3.2 t",
      "Udźwig operacyjny": "1000 kg",
      "Wysokość podnoszenia": "3.1 m",
      "Sterowanie": "Burtowe (Skid-Steer)"
    },
    description: "Mocna miniładowarka burtowa Bobcat 873. Kompaktowe wymiary pozwalają na pracę wewnątrz budynków, a duża moc na obsługę ciężkiego osprzętu.",
    features: ["Zwrotność w miejscu", "Wysoka hydraulika (High Flow)", "Szybka wymiana osprzętu", "Odporna konstrukcja"],
    attachments: "Szeroka gama osprzętu: widły, łyżka, zamiatarka, młot, wiertnica. Idealna do prac porządkowych i wykończeniowych.",
    image: 'assets/img-wynajem/ładowarki.webp'
  }
];