// src/components/About.jsx
import { useEffect } from "react";

export default function About() {
  /* simple scroll-trigger fade-in */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => e.target.classList.toggle("show", e.isIntersecting)),
      { threshold: 0.2 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ---------- page shell ---------- */
        .about-shell{
          min-height:100vh;
          background:linear-gradient(135deg,#fff7ed 0%, #ffedd5 100%);
          position:relative;
          overflow:hidden;
        }
        /* floating decorative leaves */
        .leaf{
          position:absolute;
          width:60px;
          height:60px;
          background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="%23f97316" d="M32 2C17 2 4 15 4 30c0 8 3 15 8 20l20 12 20-12c5-5 8-12 8-20C60 15 47 2 32 2z"/></svg>') no-repeat center/contain;
          opacity:.15;
          animation:drift 25s linear infinite;
        }
        .leaf1{top:10%;left:5%;animation-duration:20s;}
        .leaf2{top:50%;right:10%;animation-duration:25s;animation-delay:5s;}
        .leaf3{bottom:10%;left:15%;animation-duration:30s;animation-delay:10s;}
        @keyframes drift{
          0%{transform:translateY(0) rotate(0deg);}
          100%{transform:translateY(-120vh) rotate(360deg);}
        }

        /* ---------- section ---------- */
        .about-section{max-width:64rem;margin:0 auto;padding:5rem 1rem;position:relative;z-index:10;}
        .text-center{text-align:center;margin-bottom:3rem;}
        .subtitle{font-size:1.25rem;color:#4b5563;}
        .section-title{
          font-size:2.75rem;font-weight:800;
          background:linear-gradient(90deg,#f97316 0%, #ea580c 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          margin-bottom:.5rem;
        }

        /* ---------- grid ---------- */
        .about-grid{
          display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;
          margin-bottom:6rem;
        }
        @media (max-width:1024px){
          .about-grid{grid-template-columns:1fr;}
        }

        /* ---------- image ---------- */
        .img-wrapper{
          position:relative;border-radius:1.25rem;overflow:hidden;
          box-shadow:0 25px 50px -12px rgba(0,0,0,.15);
          transform:scale(.95);opacity:0;
          animation:fadeInScale 1s ease-out forwards;
        }
        @keyframes fadeInScale{
          to{transform:scale(1);opacity:1;}
        }
        .about-img{
          width:100%;display:block;transition:transform .6s;
        }
        .img-wrapper:hover .about-img{transform:scale(1.15) rotate(-2deg);}

        /* ---------- content ---------- */
        .about-content{display:flex;flex-direction:column;gap:1.25rem;}
        .about-subtitle{font-size:1.875rem;font-weight:700;color:#1f2937;}
        .about-text{color:#4b5563;line-height:1.8;}
        .highlight{background:linear-gradient(90deg,#fed7aa 0%, #fdba74 100%);padding:.1rem .4rem;border-radius:.5rem;font-weight:600;color:#1f2937;}

        /* ---------- values ---------- */
        .values-section{background:rgba(255,255,255,.5);backdrop-filter:blur(8px);padding:4rem 2rem;border-radius:1.5rem;margin-bottom:6rem;box-shadow:0 10px 30px rgba(0,0,0,.05);}
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;text-align:center;}
        @media (max-width:1024px){
          .values-grid{grid-template-columns:1fr;}
        }
        .value-box{
          background:#fff;border-radius:1rem;padding:2.5rem 1.5rem;
          box-shadow:0 8px 25px rgba(0,0,0,.05);
          transition:transform .3s, box-shadow .3s;
        }
        .value-box:hover{transform:translateY(-8px);box-shadow:0 15px 40px rgba(0,0,0,.1);}
        .value-icon{
          width:3.5rem;height:3.5rem;margin:0 auto .75rem;
          background:linear-gradient(135deg,#f97316 0%, #ea580c 100%);
          border-radius:50%;display:grid;place-items:center;
        }
        .value-icon svg{width:1.75rem;height:1.75rem;color:#fff;}
        .value-title{font-weight:700;font-size:1.125rem;margin-bottom:.5rem;color:#1f2937;}

        /* ---------- team ---------- */
        .team-section{margin-bottom:6rem;}
        .team-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;}
        @media (max-width:1024px){
          .team-grid{grid-template-columns:1fr;}
        }
        .team-img{width:100%;border-radius:1.25rem;box-shadow:0 20px 40px rgba(0,0,0,.1);}

        /* ---------- scroll fade ---------- */
        .fade-up{opacity:0;transform:translateY(40px);transition:opacity .8s ease, transform .8s ease;}
        .fade-up.show{opacity:1;transform:translateY(0);}
      `}</style>

      <div className="about-shell">
        {/* floating leaves */}
        <div className="leaf leaf1" />
        <div className="leaf leaf2" />
        <div className="leaf leaf3" />

        <div className="about-section">
          <div className="text-center fade-up">
            <h2 className="section-title">About Amani</h2>
            <p className="subtitle">Hand-crafted with passion from Kurunegala, Sri Lanka</p>
          </div>

          <div className="about-grid fade-up">
            <div className="img-wrapper">
              <img
                src="https://photosmint.com/wp-content/uploads/beautiful-cute-simple-girl-pic-12-years-indian.jpeg"
                alt="Amani"
                className="about-img"
              />
            </div>
            <div className="about-content">
              <h3 className="about-subtitle">Our Story</h3>
              <p className="about-text">
                Amani is a passionate artisan from Kurunegala, Sri Lanka, creating unique handmade crafts with love and tradition. Each piece tells a story of <span className="highlight">Sri Lankan heritage</span>, culture, and the skilled hands that craft them.
              </p>
              <p className="about-text">
                From traditional masks to eco-friendly coconut-shell products, every item is 100 % authentic and supports local artisans and their families.
              </p>
              <p className="about-text">
                Our mission is to preserve ancient techniques while innovating modern designs that appeal to global audiences.
              </p>
            </div>
          </div>

          <div className="values-section fade-up">
            <div className="text-center" style={{ marginBottom: "3rem" }}>
              <h3 className="section-title">Our Values</h3>
              <p className="subtitle">What drives us to create every piece with care</p>
            </div>
            <div className="values-grid">
              {[
                {
                  title: "Sustainability",
                  txt: "We use eco-friendly materials and techniques to reduce environmental impact.",
                  ico: (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  ),
                },
                {
                  title: "Passion",
                  txt: "Each craft is made with love, skill, and attention to detail.",
                  ico: (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ),
                },
                {
                  title: "Community",
                  txt: "Supporting local artisans and their families is at the heart of what we do.",
                  ico: (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                  ),
                },
              ].map((v) => (
                <div className="value-box" key={v.title}>
                  <div className="value-icon">{v.ico}</div>
                  <div className="value-title">{v.title}</div>
                  <p className="about-text">{v.txt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="team-section fade-up">
            <div className="text-center" style={{ marginBottom: "3rem" }}>
              <h3 className="section-title">Meet the Artisan</h3>
              <p className="subtitle">The hands behind Amani's unique crafts</p>
            </div>
            <div className="team-grid">
              <img
                src="https://photoswish.net/wp-content/uploads/2025/03/Lovely-Girls-Dp-1.jpg"
                alt="Amani Artisan"
                className="team-img"
              />
              <div className="about-content">
                <p className="about-text">
                  Amani began crafting at the age of 12, inspired by the vibrant Sri Lankan traditions and natural beauty around Kurunegala. Over the years she has perfected her techniques while mentoring younger artisans, ensuring the legacy continues.
                </p>
                <p className="about-text">
                  Her dedication is reflected in every piece, combining <span className="highlight">heritage, creativity, and quality</span> to bring authentic Sri Lankan crafts to the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}