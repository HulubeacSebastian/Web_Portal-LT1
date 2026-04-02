import SchoolFooter from '../components/SchoolFooter.jsx';

const days = [
  { day: 2, label: 'Lun' },
  { day: 3, label: 'Mar' },
  { day: 4, label: 'Mie' },
  { day: 5, label: 'Joi' },
  { day: 6, label: 'Vin' },
  { day: 7, label: 'Sam' },
  { day: 8, label: 'Dum' },
  { day: 9, label: 'Lun' },
  { day: 11, label: 'Mar' },
  { day: 12, label: 'Mie' },
  { day: 13, label: 'Joi', active: true },
  { day: 14, label: 'Vin' },
  { day: 15, label: 'Sam' },
  { day: 16, label: 'Dum' },
  { day: 17, label: 'Lun' },
];

const teachers = [
  'Andrei Popescu',
  'Alexandru Ionescu',
  'Stefan Dumitru',
  'Matei Stancu',
  'Mihai Georgescu',
  'Elena Vasilescu',
  'Maria Radu',
  'Ioana Stoica',
];

const events = [
  { row: 0, colStart: 7, colSpan: 3, tone: 'full', title: 'Zi intreaga', time: '8:00 - 16:00' },
  { row: 2, colStart: 2, colSpan: 2, tone: 'vacation', title: 'Vacanta' },
  { row: 3, colStart: 2, colSpan: 3, tone: 'remote', title: 'La distanta' },
  { row: 3, colStart: 7, colSpan: 5, tone: 'full', title: 'Zi intreaga', time: '8:00 - 16:00' },
  { row: 3, colStart: 13, colSpan: 2, tone: 'remote', title: 'La distanta' },
  { row: 4, colStart: 1, colSpan: 4, tone: 'full', title: 'Zi intreaga', time: '8:00 - 16:00' },
  { row: 4, colStart: 7, colSpan: 5, tone: 'full', title: 'Zi intreaga', time: '8:00 - 16:00' },
  { row: 7, colStart: 1, colSpan: 3, tone: 'vacation', title: 'Vacanta' },
];

function CalendarPage() {
  return (
    <section className="page-shell calendar-page">
      <div className="calendar-content">
        <div className="calendar-breadcrumb">Calendar &gt; Program de Munca</div>

        <header className="calendar-header">
          <div className="calendar-date-wrap">
            <h2>13 Martie 2026</h2>
            <div className="calendar-arrows">
              <button type="button" className="calendar-icon-btn" aria-label="Ziua anterioara">
                ←
              </button>
              <button type="button" className="calendar-icon-btn" aria-label="Ziua urmatoare">
                →
              </button>
            </div>
          </div>

          <button type="button" className="calendar-generate-btn">
            Generare Orar
          </button>

          <button type="button" className="calendar-filter-btn">
            Filtrare
          </button>
        </header>

        <nav className="calendar-months" aria-label="Luni">
          {['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'].map((month) => (
            <button
              key={month}
              type="button"
              className={`calendar-month${month === 'Aprilie' ? ' is-active' : ''}`}
            >
              {month}
            </button>
          ))}
        </nav>

        <section className="calendar-summary" aria-label="Rezumat luna">
          <div className="calendar-week-hours">
            <p>Totalul de ore pe saptamana</p>
            <strong>546h</strong>
          </div>

          <div className="calendar-workload">
            <p>Durata de munca a profesorilor</p>
            <div className="calendar-workload-bar" role="img" aria-label="Distribuire volum de munca">
              <span className="s1" />
              <span className="s2" />
              <span className="s3" />
              <span className="s4" />
            </div>
          </div>

          <div className="calendar-total">
            <p>Total: Aprilie</p>
            <strong>2,446h</strong>
          </div>
        </section>

        <div className="calendar-legend-row">
          <div className="calendar-legend">
            <span className="legend-item full">Zi intreaga (8:00 - 16:00)</span>
            <span className="legend-item vacation">Vacanta</span>
            <span className="legend-item remote">La distanta</span>
          </div>

          <button type="button" className="calendar-category-btn">
            Categorie
          </button>
        </div>

        <section className="calendar-board" aria-label="Planificare profesori">
          <aside className="calendar-professors">
            <div className="calendar-prof-title">
              <h3>Profesori</h3>
              <span>45</span>
            </div>

            <div className="calendar-group">COLECTIV PROFESORAL</div>
            {teachers.slice(0, 7).map((name) => (
              <label key={name} className="calendar-prof-row">
                <input type="checkbox" />
                <span className="avatar" />
                <span>{name}</span>
              </label>
            ))}

            <div className="calendar-group">PERSONAL AUXILIAR</div>
            <label className="calendar-prof-row">
              <input type="checkbox" />
              <span className="avatar" />
              <span>{teachers[7]}</span>
            </label>
          </aside>

          <div className="calendar-timeline">
            <div className="calendar-days">
              {days.map((entry) => (
                <button
                  key={`${entry.day}-${entry.label}`}
                  type="button"
                  className={`calendar-day${entry.active ? ' is-active' : ''}`}
                >
                  <strong>{entry.day}</strong>
                  <span>{entry.label}</span>
                </button>
              ))}
            </div>

            <div className="calendar-rows">
              {teachers.map((teacher, rowIndex) => (
                <div key={teacher} className="calendar-row-grid">
                  {Array.from({ length: days.length }).map((_, cellIndex) => (
                    <div key={`${teacher}-${cellIndex}`} className="calendar-cell" />
                  ))}

                  {events
                    .filter((event) => event.row === rowIndex)
                    .map((event) => (
                      <article
                        key={`${teacher}-${event.colStart}-${event.title}`}
                        className={`calendar-event ${event.tone}`}
                        style={{
                          gridColumn: `${event.colStart} / span ${event.colSpan}`,
                        }}
                      >
                        <strong>{event.title}</strong>
                        {event.time ? <span>{event.time}</span> : null}
                      </article>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SchoolFooter />
    </section>
  );
}

export default CalendarPage;

