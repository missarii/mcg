// src/components/Contact.jsx
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { api } from "../api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.sendMessage(form);
    } catch (err) {
      console.error(err);
    }
    alert("Thanks! We’ll get back to you soon ✨");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <style>{`
        /* ---------- page shell ---------- */
        .contact-shell{
          min-height:100vh;
          background:linear-gradient(135deg,#fff7ed 0%, #ffedd5 100%);
          position:relative;
          overflow:hidden;
          font-family:'Inter',sans-serif;
        }
        /* decorative floating blobs */
        .blob{
          position:absolute;
          border-radius:50%;
          filter:blur(40px);
          opacity:.35;
          animation:float 20s ease-in-out infinite;
        }
        .blob1{width:300px;height:300px;background:#fb923c;top:10%;left:5%;}
        .blob2{width:250px;height:250px;background:#f97316;top:60%;right:10%;animation-delay:5s;}
        .blob3{width:200px;height:200px;background:#ea580c;bottom:5%;left:20%;animation-delay:10s;}
        @keyframes float{
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(-40px) scale(1.15);}
        }

        /* ---------- section ---------- */
        .contact-section{
          max-width:64rem;
          margin:0 auto;
          padding:4rem 1rem;
          position:relative;
          z-index:10;
        }
        .section-title{
          font-size:2.5rem;
          font-weight:800;
          text-align:center;
          margin-bottom:3rem;
          background:linear-gradient(90deg,#f97316 0%, #ea580c 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:fadeInDown .8s ease-out;
        }
        @keyframes fadeInDown{
          from{opacity:0;transform:translateY(-30px);}
          to{opacity:1;transform:translateY(0);}
        }

        /* ---------- grid ---------- */
        .contact-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:2.5rem;
          animation:fadeInUp 1s ease-out .3s both;
        }
        @keyframes fadeInUp{
          from{opacity:0;transform:translateY(30px);}
          to{opacity:1;transform:translateY(0);}
        }
        @media (max-width:1024px){
          .contact-grid{grid-template-columns:1fr;}
        }

        /* ---------- info panel ---------- */
        .contact-info{
          display:flex;
          flex-direction:column;
          gap:2rem;
        }
        .contact-item{
          display:flex;
          align-items:flex-start;
          gap:1.25rem;
          background:rgba(255,255,255,.65);
          backdrop-filter:blur(10px);
          padding:1.5rem;
          border-radius:1rem;
          box-shadow:0 8px 32px rgba(0,0,0,.05);
          transition:transform .3s, box-shadow .3s;
        }
        .contact-item:hover{
          transform:translateY(-6px);
          box-shadow:0 12px 40px rgba(0,0,0,.1);
        }
        .contact-icon-wrapper{
          background:#fed7aa;
          padding:.75rem;
          border-radius:50%;
          display:grid;
          place-items:center;
          flex-shrink:0;
          transition:background .3s;
        }
        .contact-item:hover .contact-icon-wrapper{background:#fdba74;}
        .contact-icon{
          width:1.5rem;
          height:1.5rem;
          color:#f97316;
          transition:transform .3s;
        }
        .contact-item:hover .contact-icon{transform:scale(1.2);}
        .contact-label{
          font-weight:700;
          margin-bottom:.25rem;
          color:#1f2937;
        }
        .contact-value{
          color:#4b5563;
        }

        /* ---------- form ---------- */
        .contact-form{
          background:rgba(255,255,255,.75);
          backdrop-filter:blur(12px);
          padding:2.5rem;
          border-radius:1.25rem;
          box-shadow:0 20px 50px rgba(0,0,0,.08);
          display:flex;
          flex-direction:column;
          gap:1.25rem;
          animation:fadeInUp 1s ease-out .6s both;
        }
        .form-input, .form-textarea{
          padding:1rem 1.25rem;
          border:1px solid #d1d5db;
          border-radius:.75rem;
          font-size:1rem;
          transition:border-color .3s, box-shadow .3s;
        }
        .form-input:focus, .form-textarea:focus{
          outline:none;
          border-color:#f97316;
          box-shadow:0 0 0 3px rgba(249,115,22,.25);
        }
        .primary-btn{
          background:linear-gradient(90deg,#f97316 0%, #ea580c 100%);
          color:#fff;
          padding:.85rem 2rem;
          border:none;
          border-radius:9999px;
          font-weight:700;
          font-size:1rem;
          cursor:pointer;
          transition:transform .3s, box-shadow .3s;
        }
        .primary-btn:hover{
          transform:translateY(-3px) scale(1.03);
          box-shadow:0 10px 25px rgba(249,115,22,.35);
        }
        .primary-btn:active{transform:translateY(0) scale(1);}
      `}</style>

      <div className="contact-shell">
        {/* animated background blobs */}
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />

        <div className="contact-section">
          <h2 className="section-title">Get In Touch</h2>

          <div className="contact-grid">
            {/* ---- info ---- */}
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Phone className="contact-icon" />
                </div>
                <div>
                  <h3 className="contact-label">Phone</h3>
                  <p className="contact-value">074 1606120</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Mail className="contact-icon" />
                </div>
                <div>
                  <h3 className="contact-label">Email</h3>
                  <p className="contact-value">magiccraftgallery@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <MapPin className="contact-icon" />
                </div>
                <div>
                  <h3 className="contact-label">Address</h3>
                  <p className="contact-value">Kurunegala, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* ---- form ---- */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="form-textarea"
                required
              />
              <button type="submit" className="primary-btn w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}