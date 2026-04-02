function AboutPage() {
  return (
    <section className="page-shell about-page">
      <img
        src="/assets/poza_liceu.jpeg"
        alt="Elevi ai Liceului Tehnologic Nr. 1"
        className="about-hero-image"
      />

      <div className="page-banner">DESPRE NOI</div>

      <section className="about-story">
        <h2>CINE SUNTEM?</h2>
        <p>
          La Liceul Tehnologic Nr. 1, credem că educația practică este cheia succesului. Misiunea
          noastră este să oferim elevilor competențele necesare pentru a reuși pe o piață a muncii
          în continuă schimbare. Prin ateliere moderne, parteneriate cu agenți economici și un corp
          profesoral dedicat, asigurăm tranziția ușoară de la școală la o carieră de succes sau
          către studii superioare în domeniul tehnic.
        </p>
      </section>
    </section>
  );
}

export default AboutPage;

