import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Nav({
  currentPage,
  setCurrentPage,
  totalItems,
  searchQuery,
  setSearchQuery,
  mobileMenu,
  setMobileMenu,
  isAdmin
}) {
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (totalItems > 0) setPop(true);
    const t = setTimeout(() => setPop(false), 600);
    return () => clearTimeout(t);
  }, [totalItems]);

  return (
    <>
      <style>{`
        :root {
          --pin:#ff0055;
          --purple:#8b5cf6;
          --bg:rgba(255,255,255,.78);
          --text:#111827;
          --gray:#9ca3af;
          --glow:0 0 12px rgba(139,92,246,.55);
        }
        @keyframes gel{0%{transform:scale(.7)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes wave{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        
        .nav {
          position: sticky; top: 0; z-index: 1200;
          background: var(--bg);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,.6);
          box-shadow: 0 4px 30px -10px rgba(0,0,0,.12);
        }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .nav-flex { display: flex; justify-content: space-between; align-items: center; height: 4.5rem; }

        /* logo + links in one row */
        .nav-left {
          display: flex; align-items: center; gap: 2rem;
        }

        .logo {
          font-size: 1.7rem; font-weight: 800;
          background: linear-gradient(120deg, var(--purple), var(--pin), var(--purple));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wave 4s ease infinite;
          cursor: pointer; user-select: none;
          transition: transform .3s cubic-bezier(.175,.885,.32,1.275);
        }
        .logo:hover { transform: scale(1.08) rotate(-3deg); }

        /* desktop links */
        .nav-links { display: flex; align-items: center; gap: 1.2rem; }
        .nav-btn {
          position: relative; font-weight: 600; color: var(--text);
          background: none; border: none; cursor: pointer; padding: .6rem .8rem;
          transition: color .3s;
        }
        .nav-btn::after {
          content: ""; position: absolute; left: 50%; bottom: -6px;
          width: 0; height: 3px;
          background: linear-gradient(90deg, var(--purple), var(--pin));
          border-radius: 2px; transform: translateX(-50%);
          transition: width .35s cubic-bezier(.77,0,.18,1);
        }
        .nav-btn:hover { color: var(--purple); }
        .nav-btn:hover::after { width: 100%; }
        .nav-btn.active { color: var(--pin); }
        .nav-btn.active::after { width: 100%; }

        /* search field */
        .search-wrapper {
          position: absolute; right: 220px; width: 8.5rem;
          transition: width .3s ease;
        }
        .search-wrapper:focus-within { width: 11rem; }
        .search-input {
          width: 100%; padding: .55rem 2.6rem .55rem 1.1rem;
          border: 1.5px solid transparent; border-radius: 9999px;
          background: rgba(255,255,255,.65);
          transition: all .3s;
        }
        .search-input:focus { outline: none; border-color: var(--purple); box-shadow: var(--glow); }
        .search-icon {
          position: absolute; right: .8rem; top: 50%; transform: translateY(-50%);
          width: 1.25rem; height: 1.25rem; color: var(--gray); pointer-events: none;
        }

        /* icon cluster */
        .icons-wrapper { display: flex; align-items: center; gap: .4rem; }
        .icons-wrapper button {
          position: relative; background: none; border: 1.5px solid transparent;
          cursor: pointer; padding: .5rem; border-radius: 50%;
          transition: transform .3s cubic-bezier(.175,.885,.32,1.275), background .3s, box-shadow .3s;
        }
        .icons-wrapper button:hover {
          transform: scale(1.15) rotate(-10deg);
          background: #fff;
          box-shadow: 0 8px 25px -5px rgba(0,0,0,.15);
        }
        .cart-badge {
          position: absolute; top: -4px; right: -4px;
          background: var(--purple); color: #fff; font-size: .7rem; font-weight: 700;
          width: 1.3rem; height: 1.3rem; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          animation: ${pop ? "gel .6s ease forwards" : "none"};
        }

        /* mobile */
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; }
        .mobile-sheet { display: none; overflow: hidden; }
        @media(max-width:768px){
          .nav-links,.search-wrapper{display:none;}
          .mobile-menu-btn{display:block;}
          .mobile-sheet{
            display:block;
            max-height:${mobileMenu?"400px":"0"};
            transition:max-height .45s cubic-bezier(.22,1,.36,1);
          }
          .mobile-content{
            background:var(--bg);
            backdrop-filter:blur(16px);
            -webkit-backdrop-filter:blur(16px);
            border-top:1px solid rgba(255,255,255,.6);
            padding:1rem;display:flex;flex-direction:column;gap:.6rem;
          }
          .mobile-search{width:100%;padding:.6rem 1rem;border:1.5px solid var(--gray);border-radius:.5rem;}
          .mobile-link{
            width:100%;text-align:left;padding:.7rem 1rem;background:none;border:none;cursor:pointer;
            border-radius:.4rem;transition:background .25s,color .25s;
          }
          .mobile-link:hover{background:rgba(139,92,246,.08);color:var(--purple);}
          .mobile-link.active{background:var(--purple);color:#fff;font-weight:600;}
        }
      `}</style>

      <nav className="nav">
        <div className="nav-container">
          <div className="nav-flex">
            {/* ✅ Logo and Nav Links in Same Row */}
            <div className="nav-left">
              <h1 className="logo" onClick={() => setCurrentPage("home")}>Magic Craft Gallery</h1>
              <div className="nav-links">
                {["home","shop","about","contact"].map(p => (
                  <button
                    key={p}
                    className={`nav-btn ${currentPage===p?"active":""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p.charAt(0).toUpperCase()+p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="nav-right">
              <div className="search-wrapper">
                <Search className="search-icon"/>
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="icons-wrapper">
                {isAdmin && (
                  <button onClick={()=>setCurrentPage("admin")} aria-label="Admin Panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </button>
                )}
                <button onClick={()=>setCurrentPage("cart")}>
                  <ShoppingCart/>
                  {totalItems>0 && <span className="cart-badge">{totalItems}</span>}
                </button>
              </div>

              <button onClick={()=>setMobileMenu(!mobileMenu)} className="mobile-menu-btn">
                {mobileMenu?<X/>:<Menu/>}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="mobile-sheet">
            <div className="mobile-content">
              <input type="text" placeholder="Search…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="mobile-search"/>
              {["home","shop","about","contact"].map(p=>(
                <button key={p} onClick={()=>{setCurrentPage(p);setMobileMenu(false);}} className={`mobile-link ${currentPage===p?"active":""}`}>
                  {p.charAt(0).toUpperCase()+p.slice(1)}
                </button>
              ))}
              {isAdmin && (
                <button onClick={()=>{setCurrentPage("admin");setMobileMenu(false);}} className={`mobile-link ${currentPage==="admin"?"active":""}`} style={{color:"var(--pin)"}}>
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
