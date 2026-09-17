import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const RESTAURANT_IMAGE = '/assets/restaurant.jpeg';
const MANSARDA_IMAGE = '/assets/pod.jpeg';

const GRAND_TOTAL_LEI = 17400000;
const GRAND_TOTAL_ITEMS = 3200;

const patrimoniuCategories = [
  {
    label: 'Construcții',
    value: '13.132.102 lei',
    items: '20 bunuri',
    text: 'Clădiri, infrastructură și lucrări de modernizare — fundația fizică a întregii transformări, pentru liceu și grădiniță.'
  },
  {
    label: 'PNRR',
    value: '2.040.551 lei',
    items: '1.933 bunuri',
    text: 'Dotări moderne prin Planul Național de Redresare și Reziliență — de la echipamente digitale la mobilier didactic.'
  },
  {
    label: 'Echipamente',
    value: '798.649 lei',
    items: '64 bunuri',
    text: 'Aparatură tehnică pentru laboratoare și ateliere, în liceu, grădiniță și creșă.'
  },
  {
    label: 'Obiecte de inventar',
    value: '665.241 lei',
    items: '1.077 bunuri',
    text: 'Peste 1.000 de bunuri de mic inventar care susțin activitatea zilnică în toate unitățile.'
  },
  {
    label: 'Altele',
    value: '585.817 lei',
    items: '20 bunuri',
    text: 'Investiții complementare care completează infrastructura educațională.'
  },
  {
    label: '„Practicanții de azi”',
    value: '176.955 lei',
    items: '18 bunuri',
    text: 'Dotarea directă a laboratorului de practică turism, parte din proiectul PEO pentru cei 252 de elevi în stagii.'
  },
  {
    label: 'POCU',
    value: '35.091 lei',
    items: '60 bunuri',
    text: 'Echipamente achiziționate prin fonduri POCU, pentru activități educaționale outdoor și extrașcolare.'
  }
];

const impactStats = [
  { value: '9', label: 'Inițiative și investiții majore', hint: '2014 – 2029' },
  { value: '4,18 mil. lei', label: 'Fonduri POCU/PEO implementate', hint: '„PRO artă sport și tradiții” + „Practicanții de mâine”' },
  { value: '1,4 mil. €', label: 'Megaproiect depus, în evaluare', hint: 'PEO 2026–2029' },
  { value: '600.000+ €', label: 'Fonduri internaționale în parteneriat', hint: 'Erasmus+, Granturi SEE & Banca Mondială' },
  { value: '900+', label: 'Elevi implicați în proiecte', hint: 'Cumulat, pe parcursul mai multor promoții (2014–2029)' }
];

const modernSpaces = [
  {
    title: 'Mansarda Inteligentă – Smart Learning Loft',
    tag: 'Spațiu de inovație',
    tone: 'loft',
    image: MANSARDA_IMAGE,
    imageAlt: 'Mansarda Inteligentă – Smart Learning Loft',
    text: 'O mansardă neexploatată a devenit un hub educațional modern: bibliotecă actuală, spații de lucru colaborativ și tehnologie dedicată explorării și cercetării. Dovada că resursele existente, bine gestionate, pot genera valoare educațională fără precedent.'
  },
  {
    title: 'Restaurant Didactic Academia Gustului',
    tag: 'Formare antreprenorială',
    tone: 'culinary',
    image: RESTAURANT_IMAGE,
    imageAlt: 'Restaurant Didactic Academia Gustului',
    text: 'Un spațiu profesionist de instruire culinară și antreprenorială, unde elevii de la Turism și HoReCa exersează în condiții reale — de la bucătărie la sala de servire — pregătindu-se pentru o piață a muncii exigentă.'
  }
];

const majorFunds = [
  {
    title: '„PRO, artă sport și tradiții”',
    program: 'POCU 2022–2023 · Fondul Social European',
    value: '1.727.136 lei',
    text: 'Program de educație outdoor implementat în 3 unități școlare din Câmpulung Moldovenesc, cu 321 de elevi și 36 de cadre didactice formate. Rezultat concret: o sală de fitness modernizată la liceu și un spațiu outdoor amenajat pentru Școala Profesională Specială.'
  },
  {
    title: '„Practicanții de astăzi, profesioniștii de mâine”',
    program: 'PEO 2024–2026 · Fondul Social European+',
    value: '2.456.458 lei',
    text: 'Un laborator de practică în domeniul turismului, complet dotat, și stagii de practică pentru 252 de elevi, cu țintă de calificare pentru 230 dintre ei (91,26%) — legătura directă dintre sala de clasă și angajatori.'
  }
];

const megaProjectPillars = [
  {
    title: 'City Break „MESERIAȘ”',
    text: '5 circuite educaționale de câte 4 zile, 150 de elevi în vizite directe la operatori economici — o punte reală între educație și carieră.'
  },
  {
    title: 'Ateliere de carieră',
    text: '18 workshop-uri practice despre meseriile viitorului, pentru elevii care aleg încă traseul profesional fără să cunoască oportunitățile reale ale ÎPT.'
  },
  {
    title: 'Programul „Școala Părinților”',
    text: '36 de ateliere tematice pentru 135 de părinți — comunicare, gestionarea conflictelor și sprijin pentru familiile vulnerabile.'
  },
  {
    title: 'Investiție în oameni',
    text: 'Formare pentru 20 de cadre didactice, subvenții lunare pentru 354 de elevi și sprijin material (rechizite, îmbrăcăminte) pentru reducerea abandonului școlar.'
  }
];

const heroPhotos = [
  {
    src: '/assets/proiecte/hero-1-clasa-tematica.jpg',
    alt: 'Clasă tematică modernă, cu mese portocalii și pereți decorați cu personalități culturale românești',
    caption: 'Săli moderne, gata pentru învățarea de mâine.'
  },
  {
    src: '/assets/proiecte/hero-2-fatada.jpg',
    alt: 'Fațada liceului într-o zi însorită, cu grădină amenajată',
    caption: 'Clădirea școlii, revitalizată și pregătită pentru viitor.'
  },
  {
    src: '/assets/proiecte/hero-3-eveniment.jpg',
    alt: 'Sală modernă plină cu cadre didactice la un eveniment de formare',
    caption: 'Spații care se folosesc, nu doar se admiră — formare profesională reală, pentru o comunitate întreagă.'
  }
];

const punctulZero = [
  {
    src: '/assets/proiecte/zero-1-arhiva.jpg',
    alt: 'Fotografie de arhivă alb-negru a clădirii liceului',
    caption: 'Rădăcini din 1873 — aceeași clădire, un secol și jumătate de responsabilitate față de comunitate.'
  },
  {
    src: '/assets/proiecte/zero-2-hol-vechi.jpg',
    alt: 'Hol vechi cu covor uzat și pereți în două culori, înainte de renovare',
    caption: 'Holul de altădată: covor uzat, tencuială din altă epocă. Aici a pornit decizia de a schimba tot.'
  },
  {
    src: '/assets/proiecte/zero-3-scara-veche.jpg',
    alt: 'Scară veche din terasit, cu valori educaționale scrise pe trepte',
    caption: 'Valori bune, spații depășite — treptele vechi nu mai țineau pasul cu ambițiile elevilor noștri.'
  },
  {
    src: '/assets/proiecte/zero-4-scara-uzata.jpg',
    alt: 'Scară istorică din fier forjat acoperită de praf și moloz, înainte de restaurare',
    caption: 'Sub praf și moloz, un detaliu de patrimoniu așteaptă să fie readus la viață.'
  }
];

const santierPhotos = [
  {
    src: '/assets/proiecte/santier-1-teren-sport.jpg',
    alt: 'Muncitori turnând betonul unui teren de sport, cu munții în fundal',
    caption: 'Turnarea terenului de sport — un petic de teren devine infrastructură pentru educația outdoor.'
  },
  {
    src: '/assets/proiecte/santier-2-ferestre.jpg',
    alt: 'Montarea unei ferestre noi termopan într-un gol de zid din cărămidă veche',
    caption: 'Fereastră cu fereastră, clădirea capătă o nouă anvelopă termică — eficiență, nu doar estetică.'
  },
  {
    src: '/assets/proiecte/santier-3-tavan.jpg',
    alt: 'Muncitori montând izolație termică la tavan, într-o sală în renovare',
    caption: 'Sub tavanul deschis, izolația modernă pregătește terenul pentru sălile de curs de mâine.'
  },
  {
    src: '/assets/proiecte/santier-4-hol.jpg',
    alt: 'Scara de la intrarea principală, în lucru, cu schele și materiale de construcție',
    caption: 'Intrarea principală, reconstruită strat cu strat — de la moloz la prima impresie a liceului.'
  },
  {
    src: '/assets/proiecte/santier-5-fatada.jpg',
    alt: 'Fațada liceului acoperită de schele, cu un muncitor aplicând tencuială',
    caption: 'Fațada prinde formă sub schele — investiția se vede din prima privire, chiar de afară.'
  },
  {
    src: '/assets/proiecte/santier-6-restaurant.jpg',
    alt: 'Sală generoasă cu ferestre mari, în plină renovare, tavan cu izolație expusă',
    caption: 'Un spațiu generos, cu ferestre mari spre viitor — pregătit să devină o sală modernă de practică.'
  }
];

const rezultatGeneral = [
  {
    src: '/assets/proiecte/rezultat-general-1.jpg',
    alt: 'Laborator AutoCAD modern, cu elevi lucrând la calculatoare',
    caption: 'Laborator AutoCAD: elevii proiectează digital, exact ca într-un birou de inginerie real.'
  },
  {
    src: '/assets/proiecte/rezultat-general-2.jpg',
    alt: 'Scară istorică restaurată, cu o frescă modernă dedicată construcțiilor',
    caption: 'Aceeași scară istorică din perioada de șantier, restaurată — trecut și viitor, pe aceleași trepte.'
  },
  {
    src: '/assets/proiecte/rezultat-general-3.jpg',
    alt: 'Coridor cu arcade și reliefuri istorice puse în valoare',
    caption: 'Patrimoniul nu a fost demolat, ci pus în valoare: reliefuri istorice expuse elegant sub arcade restaurate.'
  },
  {
    src: '/assets/proiecte/rezultat-general-4.jpg',
    alt: 'Hol de la intrare cu însemnele liceului și un ecran de prezentare',
    caption: 'Identitatea liceului, la vedere din prima secundă — un hol care transmite seriozitate.'
  },
  {
    src: '/assets/proiecte/rezultat-general-5.jpg',
    alt: 'Sală de clasă modernă, luminoasă, cu mobilier nou',
    caption: 'Sală de clasă modernă, luminoasă, gândită pentru concentrare și performanță.'
  },
  {
    src: '/assets/proiecte/rezultat-general-6.jpg',
    alt: 'Laborator IT modern, cu calculatoare și mobilier colorat, personalizat cu însemnele liceului',
    caption: 'Laborator IT complet echipat — competențe digitale exersate din prima oră de curs.'
  }
];

const rezultatMultifunctional = [
  {
    src: '/assets/proiecte/rezultat-restaurant-1.jpg',
    alt: 'Sală modernă cu banchete verzi și draperii aurii, pregătită pentru evenimente',
    caption: 'O sală la standard hotelier, pentru evenimente instituționale și formare practică în ospitalitate.'
  },
  {
    src: '/assets/proiecte/rezultat-restaurant-2.jpg',
    alt: 'Aceeași sală, plină cu cadre didactice în timpul unei sesiuni de formare',
    caption: 'Aceeași sală, în plină activitate — spațiile noi găzduiesc formare profesională reală.'
  }
];

const rezultatTurism = [
  {
    src: '/assets/proiecte/rezultat-turism-1.jpg',
    alt: 'Clasă tematică cu postere despre destinații turistice și explorare',
    caption: 'Clasă tematică turism: elevii explorează destinații reale, pregătindu-se pentru cariere în ospitalitate.'
  }
];

const rezultatOutdoor = [
  {
    src: '/assets/proiecte/rezultat-outdoor-1.jpg',
    alt: 'Mini-parc amenajat în curtea liceului, cu alei din piatră și plantații noi',
    caption: 'Curtea școlii, transformată într-un mini-parc — educația outdoor prinde loc chiar lângă clase.'
  },
  {
    src: '/assets/proiecte/rezultat-outdoor-2.jpg',
    alt: 'Alee pietonală amenajată cu ghivece de flori și conifere',
    caption: 'Spații verzi amenajate pas cu pas — investiția nu s-a oprit la interior.'
  }
];

const mobilityProjects = [
  {
    title: '„Urban Sports Games”',
    program: 'Erasmus+ Sport · 2019–2020 · Partener: Portugalia',
    value: '48.365 €',
    note: 'Valoare totală proiect · alocare Liceul Tehnologic Nr. 1: 8.240 €',
    text: 'Educație prin sport și competențe transversale pentru 20 de tineri din zone defavorizate, finalizată cu o aplicație mobilă dezvoltată în cadrul proiectului.'
  },
  {
    title: '„Creativity Knows No Borders”',
    program: 'Erasmus+ KA201 · 2014–2017 · Parteneriat cu 10 țări',
    value: '432.600 €',
    note: 'Valoare totală proiect · alocare Liceul Tehnologic Nr. 1: 43.260 €',
    text: 'Dezvoltare artistică și culturală, leadership și lucru în echipă — finalizate cu un film, un album internațional și o carte de poezii create de elevi.'
  },
  {
    title: 'Formare profesională în Portugalia',
    program: 'Granturi SEE',
    value: '24.690 €',
    text: 'Stagii de formare profesională peste graniță, pentru cadre didactice și elevi — competențe aduse direct în sălile de clasă din Câmpulung Moldovenesc.'
  }
];

const goAheadHighlights = [
  { value: '304', label: 'Beneficiari direcți', hint: 'Consiliere, dezvoltare personală și orientare profesională' },
  { value: '8', label: 'Licee tehnologice', hint: 'Rețea națională de implementare a proiectului' },
  { value: '1.400+', label: 'Participanți DREAM XPERIENCE 2026', hint: '31 martie 2026 · Universitatea Politehnica București' },
  { value: '50+', label: 'Speakeri și profesioniști', hint: 'Inspirație și orientare profesională pentru elevi' }
];

const goAheadPhotos = [
  {
    src: '/assets/proiecte/goahead-1-echipa-isb.jpg',
    alt: 'Elevi ai liceului la standul Facultății de Inginerie a Sistemelor Biotehnice, Universitatea Politehnica București',
    caption: 'Delegația liceului, la Universitatea Politehnica București, gazda conferinței DREAM XPERIENCE.'
  },
  {
    src: '/assets/proiecte/goahead-2-laborator-robotica.jpg',
    alt: 'Elevi vizitând un laborator de robotică și mecatronică, în fața unui covor demonstrativ pentru roboți',
    caption: 'Vizită la laboratoarele de robotică și mecatronică ale Politehnicii — orientare profesională la firul ierbii.'
  },
  {
    src: '/assets/proiecte/goahead-4-echipa-mecatronica.jpg',
    alt: 'Grup de elevi în holul Facultății de Inginerie Mecanică și Mecatronică',
    caption: 'Elevii liceului, prezenți la Facultatea de Inginerie Mecanică și Mecatronică.'
  },
  {
    src: '/assets/proiecte/goahead-5-targul-de-joburi.jpg',
    alt: 'Grup de elevi și coordonator la Târgul de Joburi din cadrul conferinței DREAM XPERIENCE',
    caption: 'La standurile Târgului de Joburi — primul contact direct cu angajatori reali.'
  },
  {
    src: '/assets/proiecte/goahead-6-scena-dream-xperience.jpg',
    alt: 'Elevi și coordonatori pe scena conferinței DREAM XPERIENCE 2026',
    caption: 'Pe scena DREAM XPERIENCE 2026, sub mesajul „YOU ARE A HERO, YOU ARE UNSTOPPABLE”.'
  },
  {
    src: '/assets/proiecte/goahead-3-afis-sponsori.jpg',
    alt: 'Afișul oficial cu organizatorii, partenerii și sponsorii conferinței DREAM XPERIENCE 2026',
    caption: 'Amploarea evenimentului: zeci de parteneri instituționali, sponsori și organizații implicate.',
    fit: 'contain'
  }
];

function useCountUpGroup(targets, duration = 2200) {
  const ref = useRef(null);
  const [values, setValues] = useState(() => targets.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) {
      setValues(targets);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValues(targets.map((target) => Math.round(target * eased)));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [targets, duration]);

  return { ref, values };
}

function GrandTotalBanner() {
  const { ref, values } = useCountUpGroup([GRAND_TOTAL_LEI, GRAND_TOTAL_ITEMS]);
  const [totalLei, totalItems] = values;
  const formatter = new Intl.NumberFormat('ro-RO');

  return (
    <section ref={ref} className="proj-grand-total" aria-label="Valoarea totală a investițiilor">
      <p className="proj-grand-total-value">
        {formatter.format(totalLei)}+ <span>lei</span>
      </p>
      <p className="proj-grand-total-label">
        valoarea totală a investițiilor și bunurilor inventariate — construcții, PNRR, echipamente,
        POCU și dotări didactice
      </p>
      <p className="proj-grand-total-sub">
        <strong>{formatter.format(totalItems)}+</strong> bunuri inventariate, în liceu, grădiniță și creșă
      </p>
    </section>
  );
}

function PhotoCard({ photo }) {
  const cardClass = photo.fit === 'contain' ? 'proj-photo-card proj-photo-card--contain' : 'proj-photo-card';
  return (
    <figure className={cardClass}>
      <img src={photo.src} alt={photo.alt} loading="lazy" />
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

function ProjectsPage() {
  return (
    <section className="page-shell projects-page">
      <header className="proj-hero" aria-labelledby="proj-hero-title">
        <img
          src="/assets/proiecte/zero-1-arhiva.jpg"
          alt=""
          className="proj-hero-media"
          aria-hidden="true"
        />
        <div className="proj-hero-scrim" aria-hidden="true" />
        <div className="proj-hero-pattern" aria-hidden="true" />
        <div className="proj-hero-content">
          <span className="proj-hero-badge">Antreprenoriat educațional</span>
          <h1 id="proj-hero-title">
            De la viziune la <span>impact măsurabil</span>
          </h1>
          <p className="proj-hero-lead">
            În ultimii ani am transformat Liceul Tehnologic Nr. 1 dintr-o instituție de învățământ
            într-un ecosistem antreprenorial: atragem fonduri europene și naționale, construim spații
            de învățare la standard profesional și deschidem drumuri reale către piața muncii pentru
            fiecare elev.
          </p>
          <div className="proj-hero-chips" aria-hidden="true">
            <span>Fonduri europene</span>
            <span>Parteneriate</span>
            <span>Impact măsurabil</span>
          </div>
        </div>

        <svg className="proj-hero-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 C320,64 720,0 1080,24 C1260,36 1380,44 1440,40 L1440,60 L0,60 Z" fill="#fff" />
        </svg>
      </header>


      <div className="proj-body">
        <section className="proj-showcase">
          <svg className="proj-showcase-wave-top" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0,20 C320,55 720,5 1080,35 C1260,48 1380,55 1440,45 L1440,0 L0,0 Z"
              fill="#fff"
            />
          </svg>
          <div className="proj-hero-photos">
            {heroPhotos.map((photo) => (
              <figure key={photo.src} className="proj-hero-photo">
                <img src={photo.src} alt={photo.alt} loading="eager" />
                {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
              </figure>
            ))}
          </div>

          <GrandTotalBanner />
        </section>

        <section className="proj-metrics proj-reveal" aria-label="Cifre de impact">
          <div className="proj-metrics-grid">
            {impactStats.map((item) => (
              <article key={item.label} className="proj-metric-card">
                <strong>{item.value}</strong>
                <p>{item.label}</p>
                <span>{item.hint}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="proj-section proj-reveal" aria-label="Galeria transformării">
          <header className="proj-section-head">
            <span className="proj-eyebrow">De la idee la standard european</span>
            <h2>Povestea transformării, în imagini</h2>
            <p className="proj-section-lead">
              Cifrele arată amploarea investiției. Fotografiile arată efortul din spatele lor — de la
              spațiile care ne-au făcut să simțim nevoia urgentă de schimbare, până la sălile în care
              elevii învață azi.
            </p>
          </header>

          <div className="proj-timeline-block">
            <div className="proj-timeline-head">
              <span className="proj-timeline-badge">01</span>
              <div>
                <h3>Punctul Zero — nevoia de schimbare</h3>
                <p>
                  Fiecare transformare pornește de la un adevăr incomod. Iată de unde am plecat, pentru
                  ca rezultatul de azi să vorbească de la sine.
                </p>
              </div>
            </div>
            <div className="proj-photo-grid">
              {punctulZero.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>
          </div>

          <div className="proj-timeline-block">
            <div className="proj-timeline-head">
              <span className="proj-timeline-badge">02</span>
              <div>
                <h3>Șantierul Inovației — efortul susținut</h3>
                <p>
                  Managementul unui liceu antreprenorial nu înseamnă doar scrierea proiectelor, ci și
                  coordonarea lucrărilor complexe, sală cu sală, an de an.
                </p>
              </div>
            </div>
            <div className="proj-photo-grid">
              {santierPhotos.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>
          </div>

          <div className="proj-timeline-block">
            <div className="proj-timeline-head">
              <span className="proj-timeline-badge">03</span>
              <div>
                <h3>Rezultatul Final — standarde europene</h3>
                <p>
                  Rezultatul nu e doar frumos — e funcțional, folosit zilnic de elevi și cadre didactice.
                  Așa arată un liceu tehnologic gândit ca o organizație performantă.
                </p>
              </div>
            </div>

            <h4 className="proj-photo-subhead">Spații generale, la standard european</h4>
            <div className="proj-photo-grid">
              {rezultatGeneral.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>

            <h4 className="proj-photo-subhead">Aulă multifuncțională</h4>
            <div className="proj-photo-grid proj-photo-grid--two">
              {rezultatMultifunctional.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>

            <h4 className="proj-photo-subhead">Laboratorul de Turism</h4>
            <div className="proj-photo-grid proj-photo-grid--two">
              {rezultatTurism.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>

            <h4 className="proj-photo-subhead">Spații outdoor</h4>
            <div className="proj-photo-grid proj-photo-grid--two">
              {rezultatOutdoor.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>
          </div>
        </section>

        <section className="proj-section proj-reveal" aria-label="Spații moderne și inovație">
          <header className="proj-section-head">
            <span className="proj-eyebrow">Investiție în infrastructură</span>
            <h2>Spații moderne și inovație</h2>
            <p className="proj-section-lead">
              Am transformat spații neexploatate în motoare de învățare aplicată — dovada că un
              management eficient al resurselor produce rezultate vizibile, nu doar promisiuni.
            </p>
          </header>

          <div className="proj-spaces-grid">
            {modernSpaces.map((item) => (
              <article key={item.title} className={`proj-space-card proj-space-card--${item.tone}`}>
                <div className="proj-space-media">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" />
                  <div className="proj-space-media-scrim" aria-hidden="true" />
                  <span className="proj-space-tag">{item.tag}</span>
                </div>
                <div className="proj-space-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="proj-section proj-section--funds proj-reveal" aria-label="Dezvoltare prin fonduri majore">
          <header className="proj-section-head">
            <span className="proj-eyebrow">Management performant al resurselor</span>
            <h2>Fonduri atrase, rezultate livrate</h2>
            <p className="proj-section-lead">
              Capacitatea de a scrie, câștiga și implementa proiecte cu finanțare europeană este dovada
              unui management antreprenorial matur — bani publici transformați în infrastructură,
              competențe și oportunități reale pentru elevi.
            </p>
          </header>

          <div className="proj-fund-grid">
            {majorFunds.map((item, index) => (
              <article key={item.title} className="proj-fund-card">
                <div className="proj-fund-card-head">
                  <span className="proj-index-chip">{String(index + 1).padStart(2, '0')}</span>
                  <span className="proj-fund-program">{item.program}</span>
                </div>
                <h3>{item.title}</h3>
                <strong className="proj-fund-value">{item.value}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="proj-section proj-reveal" aria-label="Patrimoniul instituției">
          <header className="proj-section-head">
            <span className="proj-eyebrow">Transparență și evidență contabilă</span>
            <h2>Patrimoniul instituției, pe categorii</h2>
            <p className="proj-section-lead">
              În spatele fiecărui leu atras stă o evidență clară. Iată cum se împarte valoarea totală a
              bunurilor inventariate — de la clădiri la ultimul scaun din laborator — conform Listelor
              de Inventariere din 15.09.2026.
            </p>
          </header>

          <div className="proj-mega-grid">
            {patrimoniuCategories.map((item, index) => (
              <article key={item.label} className="proj-mega-card">
                <span className="proj-index-chip proj-index-chip--ghost">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.label}</h3>
                <strong className="proj-fund-value">{item.value}</strong>
                <span className="proj-fund-note">{item.items}</span>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="proj-patrimoniu-footnote">
            * Valoare contabilă a bunurilor înregistrate în inventar, incluzând clădirile administrate
            de aceeași unitate: liceu, grădiniță și creșă.
          </p>
        </section>

        <section className="proj-section proj-section--mega proj-reveal" aria-label="Viziune antreprenorială pe termen lung">
          <header className="proj-section-head">
            <span className="proj-eyebrow">Viziune 2026–2029</span>
            <h2>Un megaproiect pentru viitorul liceului</h2>
            <p className="proj-section-lead">
              Recent am depus un proiect de aproape <strong>1,4 milioane de euro</strong> (6.964.815,99
              lei) — cea mai amplă investiție educațională din istoria liceului, gândită ca un pod real
              între sala de clasă și piața muncii. Proiectul este în evaluare.
            </p>
          </header>

          <div className="proj-mega-grid">
            {megaProjectPillars.map((item, index) => (
              <article key={item.title} className="proj-mega-card">
                <span className="proj-index-chip proj-index-chip--ghost">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="proj-section proj-reveal" aria-label="Mobilități și conexiuni europene">
          <header className="proj-section-head">
            <span className="proj-eyebrow">Erasmus+ &amp; Granturi SEE</span>
            <h2>Liceul nostru, pe harta europeană</h2>
            <p className="proj-section-lead">
              Prin parteneriate internaționale, elevii și profesorii noștri au acces la experiențe de
              învățare, mobilitate și formare profesională dincolo de granițele județului.
            </p>
          </header>

          <div className="proj-fund-grid proj-fund-grid--mobility">
            {mobilityProjects.map((item, index) => (
              <article key={item.title} className="proj-fund-card">
                <div className="proj-fund-card-head">
                  <span className="proj-index-chip">{String(index + 1).padStart(2, '0')}</span>
                  <span className="proj-fund-program">{item.program}</span>
                </div>
                <h3>{item.title}</h3>
                <strong className="proj-fund-value">{item.value}</strong>
                {item.note ? <span className="proj-fund-note">{item.note}</span> : null}
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="proj-section proj-reveal" aria-label="Îndrăznește să Mergi Mai Departe și DREAM XPERIENCE 2026">
          <header className="proj-section-head">
            <span className="proj-eyebrow">Parteneriat asociativ · Asociația GO-AHEAD</span>
            <h2>„Îndrăznește să Mergi Mai Departe” &amp; DREAM XPERIENCE 2026</h2>
            <p className="proj-section-lead">
              „Îndrăznește să Mergi Mai Departe” este un proiect al Asociației GO-AHEAD, susținut de
              Fundația Dacia pentru România prin programul „Mobilitatea Contează”. Derulat în 8 licee
              tehnologice din țară, proiectul a sprijinit 304 de beneficiari prin consiliere, dezvoltare
              personală și socio-emoțională, orientare profesională, educație financiară și pentru
              sănătate. Scopul principal: mai multă încredere în sine, o perspectivă mai clară asupra
              viitorului și susținerea elevilor pentru a-și continua studiile.
            </p>
          </header>

          <div className="proj-metrics-grid">
            {goAheadHighlights.map((item) => (
              <article key={item.label} className="proj-metric-card">
                <strong>{item.value}</strong>
                <p>{item.label}</p>
                <span>{item.hint}</span>
              </article>
            ))}
          </div>

          <div className="proj-timeline-block proj-timeline-block--goahead">
            <div className="proj-timeline-head">
              <div>
                <h3>DREAM XPERIENCE 2026 — a treia ediție</h3>
                <p>
                  Conferința educațională GO-AHEAD s-a desfășurat pe 31 martie 2026 la Universitatea
                  Politehnica București și a reunit peste 1.400 de participanți, peste 50 de speakeri și
                  numeroase activități interactive dedicate elevilor din învățământul profesional și
                  tehnic. Sub mesajul „YOU ARE A HERO, YOU ARE UNSTOPPABLE”, conferința a pus accent pe
                  inspirație, orientare profesională, întâlnirea cu profesioniști din diverse domenii și
                  încrederea tinerilor în propriul drum.
                </p>
              </div>
            </div>

            <h4 className="proj-photo-subhead">Echipa liceului, la conferință</h4>
            <div className="proj-photo-grid proj-photo-grid--goahead">
              {goAheadPhotos.map((photo) => (
                <PhotoCard key={photo.src} photo={photo} />
              ))}
            </div>
          </div>
        </section>

        <section className="proj-sper proj-reveal" aria-label="Sprijin comunitar și echitate">
          <div className="proj-sper-inner">
            <span className="proj-eyebrow">Echitate educațională</span>
            <h2>Proiectul SPER — o școală pentru fiecare elev</h2>
            <strong className="proj-sper-value">100.000 € · Banca Mondială</strong>
            <p>
              Proiectul SPER susține direct elevii aflați în risc de abandon școlar, printr-un pachet
              integrat de sprijin educațional și social — pentru că niciun elev nu ar trebui lăsat în
              urmă.
            </p>
          </div>
        </section>

        <section className="proj-cta-panel proj-reveal" aria-label="Concluzie">
          <div className="proj-cta-copy">
            <span className="proj-eyebrow">O echipă, o viziune</span>
            <h2>Un liceu antreprenorial, gândit pentru viitor</h2>
            <p className="proj-section-lead">
              În spatele fiecărei cifre stă un elev căruia i-am deschis o ușă. Este dovada că educația
              tehnică poate fi gestionată cu aceeași rigoare, ambiție și orientare spre rezultate ca o
              organizație performantă.
            </p>
          </div>
          <div className="proj-cta-actions">
            <Link to="/despre-noi" className="proj-cta-btn is-accent">
              <span>Despre liceu și evoluție</span>
              <small>Istorie, valori și identitate</small>
            </Link>
            <Link to="/contact" className="proj-cta-btn">
              <span>Contactează-ne</span>
              <small>Suntem deschiși la parteneriate</small>
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}

export default ProjectsPage;
