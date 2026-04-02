import logoMark from '../../assets/logo-mov-vector.pdf.png';

function SchoolFooter() {
  return (
    <footer className="school-footer">
      <div className="school-footer-award">
        <p>MINISTERUL EDUCAȚIEI</p>
        <p>INSPECTORATUL ȘCOLAR JUDEȚEAN SUCEAVA</p>
      </div>

      <div className="school-footer-main">
        <div className="school-footer-brand">
          <img src={logoMark} alt="Liceul Tehnologic Nr. 1" className="school-footer-logo" />
          <div className="school-footer-brand-text">
            <strong>LICEUL TEHNOLOGIC NR. 1</strong>
            <span>Câmpulung Moldovenesc</span>
          </div>
        </div>

        <ul className="school-footer-contact">
          <li>Calea Transilvaniei, Nr. 55, 725100, Câmpulung Moldovenesc, jud. Suceava</li>
          <li>tel: +40 230 311 382 / fax: +40 230 312 912</li>
          <li>liceultehnologic1cm@yahoo.ro</li>
          <li>www.liceultehnologicnr1.ro</li>
        </ul>
      </div>
    </footer>
  );
}

export default SchoolFooter;

