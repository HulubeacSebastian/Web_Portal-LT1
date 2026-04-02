import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SchoolFooter from '../components/SchoolFooter.jsx';
import { useDocuments } from '../store/DocumentsContext';

const statusPalette = {
  Activ: '#bfd4e6',
  Revizie: '#7f648f',
  Arhivat: '#a78bfa',
};

const monthlyLabels = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie'];

function DocumentAnalyticsPage() {
  const { documents } = useDocuments();

  const statusStats = useMemo(() => {
    const counts = documents.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      },
      { Activ: 0, Revizie: 0, Arhivat: 0 }
    );

    const total = Math.max(1, counts.Activ + counts.Revizie + counts.Arhivat);
    const gradient = [
      `${statusPalette.Activ} 0 ${(counts.Activ / total) * 100}%`,
      `${statusPalette.Revizie} ${(counts.Activ / total) * 100}% ${((counts.Activ + counts.Revizie) / total) * 100}%`,
      `${statusPalette.Arhivat} ${((counts.Activ + counts.Revizie) / total) * 100}% 100%`,
    ].join(', ');

    return { counts, gradient };
  }, [documents]);

  const monthlyStats = useMemo(() => {
    const approved = [420, 400, 220, 180, 980, 760, 20];
    const pending = [440, 820, 170, 480, 250, 340, 160];

    return monthlyLabels.map((label, index) => ({
      label,
      approved: approved[index],
      pending: pending[index],
    }));
  }, []);

  const maxBarValue = Math.max(...monthlyStats.flatMap((item) => [item.approved, item.pending]), 1);

  return (
    <section className="documents-page documents-analytics-page">
      <article className="documents-title-card">
        <h2>DOCUMENTE SCOLARE</h2>
        <p className="documents-subtitle">SCHIMBA VIZUALIZARE</p>
        <Link to="/documente" className="view-toggle analytics-toggle" aria-label="Inapoi la lista documente" />
      </article>

      <section className="documents-analytics-stage">
        <article className="analytics-pie-card">
          <div className="analytics-legend">
            <span>
              <i style={{ background: '#e9b2b6' }} /> Aprobat
            </span>
            <span>
              <i style={{ background: '#bfd4e6' }} /> In lucru
            </span>
            <span>
              <i style={{ background: '#eadca2' }} /> Finalizat
            </span>
            <span>
              <i style={{ background: '#a7dbc0' }} /> In asteptare
            </span>
            <span>
              <i style={{ background: '#bca6e6' }} /> Arhiva
            </span>
          </div>

          <div
            className="analytics-pie"
            style={{
              background: `conic-gradient(${statusStats.gradient})`,
            }}
            role="img"
            aria-label="Distribuirea documentelor dupa status"
          />
        </article>

        <article className="analytics-bar-card">
          <h3>Evolutia documentelor incarcate (2026)</h3>

          <div className="analytics-bar-legend">
            <span>
              <i className="approved" /> Documente Aprobate
            </span>
            <span>
              <i className="pending" /> Documente Respinte / In lucru
            </span>
          </div>

          <div className="analytics-bars">
            {monthlyStats.map((entry) => (
              <div key={entry.label} className="analytics-month">
                <div className="analytics-columns">
                  <div
                    className="analytics-col approved"
                    style={{ height: `${(entry.approved / maxBarValue) * 100}%` }}
                    title={`Aprobate: ${entry.approved}`}
                  />
                  <div
                    className="analytics-col pending"
                    style={{ height: `${(entry.pending / maxBarValue) * 100}%` }}
                    title={`Respinse / In lucru: ${entry.pending}`}
                  />
                </div>
                <span>{entry.label}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <SchoolFooter />
    </section>
  );
}

export default DocumentAnalyticsPage;

