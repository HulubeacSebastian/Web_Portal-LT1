/** Mesaje motivationale — același mesaj pe zi (fus orar local). */
const DAILY_MESSAGES = [
  {
    text: 'Fiecare zi e o pagină nouă. Scrie-o cu curaj, răbdare și încredere în tine.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Nu trebuie să fii perfect ca să faci progrese. Trebuie doar să nu renunți.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Munca de azi e investiția de mâine. Un pas mic, dar făcut cu seriozitate, contează.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Învață pentru tine, nu pentru note. Notele vin atunci când înveți cu sens.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Eșecul nu te oprește — te învață. Ridică-te, corectează și încearcă din nou.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Disciplina e prietena visurilor mari. Azi alege un lucru și fă-l până la capăt.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Compară-te cu cine ai fost ieri, nu cu ceilalți. Progresul tău e al tău.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Curiozitatea deschide uși pe care teama le închide. Pune o întrebare în plus azi.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Respectul începe cu tine: somn, pregătire, cuvinte alese — toate construiesc încredere.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Nu amâna ce poți face acum. Zece minute concentrate bat o oră de amânare.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Școala nu e doar sală de clasă — e antrenament pentru viață. Fii prezent.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Când e greu, respiră adânc. Apoi fă următorul pas mic — e suficient pentru azi.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Succesul se construiește în zile obișnuite, cu efort obișnuit, repetat cu consecvență.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Întreabă, caută, verifică. A învăța înseamnă să gândești, nu doar să memorezi.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Fii bun cu colegii — și cu tine. O zi grea nu definește cine ești.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Visul devine plan când îl descompui în pași. Azi alege primul pas.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Concentrarea e un superputere. Pune telefonul deoparte și oferă-ți 25 de minute clare.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Meriți să crezi în tine. Dovezile vin după, nu înainte de primul efort.',
    author: 'Mesajul zilei'
  },
  {
    text: 'O greșeală e feedback, nu verdict. Corectează și mergi mai departe.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Educația îți dă libertatea de a alege. Învață cu inima deschisă.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Fii mândru de progresul mic — e fundația succesului mare.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Astăzi poți fi versiunea care începe, nu cea care amână.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Respectul pentru profesori și colegi te face mai puternic, nu mai mic.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Nu știi încă tot — și e în regulă. Învață, exersează, crește.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Ziua de azi nu se repetă. Fă ceva care contează pentru tine și pentru viitorul tău.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Curajul nu înseamnă să nu îți fie frică — înseamnă să mergi înainte oricum.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Harnicia bate talentul când talentul nu muncește. Azi muncește cu cap.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Fiecare lecție învățată e un dar pe care ți-l faci singur.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Stai drept, respiră, zâmbește. Atitudinea bună deschide mintea.',
    author: 'Mesajul zilei'
  },
  {
    text: 'Viitorul tău se scrie azi — cu atenție, respect și perseverență.',
    author: 'Mesajul zilei'
  }
];

function dayIndexLocal(date = new Date()) {
  return date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
}

export function getDailyMotivation(date = new Date()) {
  const index = dayIndexLocal(date) % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[index];
}
