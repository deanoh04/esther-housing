import { useState, useEffect, useMemo } from "react";
import {
  Star, MapPin, Phone, ExternalLink, Plus, Pencil, Trash2, Check, X,
  Search, Heart, BedDouble, Building2, Users, Coffee, ChevronDown,
  RotateCcw, Info, Sparkles, Wifi,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data-driven listings — the UI renders from this, nothing hardcoded */
/*  in markup. Edit/extend live; everything saves just for Esther.     */
/* ------------------------------------------------------------------ */
const SEED_LISTINGS = [
  {
    id: "42share",
    name: "42SHARE Yonsei Hall",
    type: "Student housing",
    distance: "~5 min walk to campus",
    priceMin: 1300000, priceMax: 1300000, priceStatus: "reported",
    priceNote: "Utilities & wifi included. Confirm the current rate directly.",
    rating: 4.5, reviews: 75,
    tags: ["Furnished", "Utilities incl.", "WiFi incl.", "Exchange students"],
    phone: "+82 2-6221-4242",
    links: [
      { label: "Yonsei Hall page", url: "https://ssh42share.blogspot.com/p/yonseihall.html" },
      { label: "Reservation process", url: "https://ssh42share.blogspot.com/p/reservation-process.html" },
      { label: "Contact (KakaoTalk)", url: "https://ssh42share.blogspot.com/p/contact.html" },
    ],
  },
  {
    id: "goshipages",
    name: "Goshipages — goshiwon booking",
    type: "Goshiwon",
    distance: "2–3 min walk options",
    priceMin: 350000, priceMax: 550000, priceStatus: "estimate",
    priceNote: "Private-bathroom rooms toward the top end. Deposit ~₩100k–200k, usually applied to month 1.",
    rating: null, reviews: null,
    tags: ["Instant move-in", "Shared kitchen", "EN + KR support"],
    phone: null,
    links: [
      { label: "Main site (browse by uni)", url: "https://goshipages.com" },
      { label: "G House Sinchon (3 min)", url: "https://goshipages.com/ghouse03" },
      { label: "Residence First Oneroomtel", url: "https://goshipages.com/park" },
    ],
  },
  {
    id: "borderless",
    name: "Borderless House",
    type: "Share house",
    distance: "Short bus ride to Yonsei",
    priceMin: null, priceMax: null, priceStatus: "varies",
    priceNote: "Rent shown per listing in the rent column. Confirm on site.",
    rating: null, reviews: null,
    tags: ["~50% Korean residents", "No guarantor", "Books in ~3 days"],
    phone: null,
    links: [
      { label: "Seoul houses", url: "https://borderless-house.com/kr/seoul" },
      { label: "Search & filter by Yonsei", url: "https://borderless-house.com/kr/sharehouse" },
    ],
  },
  {
    id: "sharehousekorea",
    name: "Sharehouse Korea",
    type: "Share house",
    distance: "Positioned for Yonsei/Ewha/Sogang",
    priceMin: null, priceMax: null, priceStatus: "varies",
    priceNote: "Varies by room & house. Contact for current openings.",
    rating: null, reviews: null,
    tags: ["Private & shared", "EN support", "Matching for foreigners"],
    phone: null,
    links: [
      { label: "Main site", url: "https://sharehousekorea.net" },
      { label: "Hansol Sinchon example", url: "https://sharehousekorea.net/hansol-sinchon-sharehouse" },
    ],
  },
  {
    id: "sharedhomies",
    name: "SharedHomies",
    type: "Co-living",
    distance: "Semester / year stays",
    priceMin: null, priceMax: null, priceStatus: "varies",
    priceNote: "Varies by unit. Contact for openings.",
    rating: null, reviews: null,
    tags: ["Furnished", "No 2-yr lease", "Foreigner-friendly", "Fast WiFi"],
    phone: null,
    links: [{ label: "Main site", url: "https://sharedhomies.com" }],
  },
  {
    id: "seoulsharehouse",
    name: "seoulsharehouse",
    type: "Share house",
    distance: "76 Sinchon-ro 1-gil · near metro",
    priceMin: 500000, priceMax: 650000, priceStatus: "estimate",
    priceNote: "Renovated share house. Confirm rate directly.",
    rating: 5.0, reviews: null,
    tags: ["Owners speak EN + FR", "5★ Google"],
    phone: "+82 10-2790-6438",
    links: [{ label: "Website", url: "https://seoulsharehouse.com" }],
  },
  {
    id: "episode_sinchon",
    name: "Episode Sinchon Campus (Yonsei Dedicated)",
    type: "Co-living",
    distance: "2 min walk to Sinchon Station, 15 min walk to Yonsei University",
    priceMin: 800000, priceMax: 1100000, priceStatus: "estimate",
    priceNote: "Jointly operated with Yonsei Office of International Affairs. Minimum 1-month contract available, rent can be prorated by day for extensions.",
    rating: 4.7, reviews: 112,
    tags: ["Fully furnished", "Yonsei Intl. Affairs partner", "Online e-signatures", "1-month min"],
    phone: "+82 1600-6805",
    links: [
      { label: "Official Page", url: "https://www.epsd.co.kr/en/epcampus_yonsei" }
    ],
  },
  {
    id: "singlehouse_sinchon",
    name: "Single House Sinchon",
    type: "Goshiwon",
    distance: "3 min walk to Yonsei University Main Gate",
    priceMin: 350000, priceMax: 430000, priceStatus: "verified",
    priceNote: "Mini-rooms start at ₩350k (shared bath); full options go up to ₩430k. Booking deposit of ₩100,000 required.",
    rating: 4.2, reviews: 34,
    tags: ["Ultra close to gate", "Budget friendly", "Free rice/kimchi/ramen", "Rooftop"],
    phone: "+82 10-7304-4456",
    links: [
      { label: "Goshipages Listing", url: "https://goshipages.com/singlehousesinchon" },
      { label: "Manager Blog (Naver)", url: "https://blog.naver.com/smsjs7978" }
    ],
  },
  {
    id: "monostay_sinchon",
    name: "Mono Stay Sinchon",
    type: "Goshiwon",
    distance: "1 min from Sinchon Station Exit 1 · ~5 min walk to Yonsei",
    priceMin: 420000, priceMax: 600000, priceStatus: "verified",
    priceNote: "Deposit: ₩100,000. Private-bathroom rooms are at the higher end. Includes brand-new appliances, AC, and daily cleaning.",
    rating: 4.9, reviews: 21,
    tags: ["Top rated", "Private bathroom options", "Near metro", "Secured entry"],
    phone: "+82 10-5772-4499",
    links: [
      { label: "Photos & Price (Gobang)", url: "https://gobang.kr/place/8688" },
      { label: "Official Blog (Naver)", url: "https://blog.naver.com/monostay79" }
    ],
  },
  {
    id: "ghouse_sinchon",
    name: "G House Sinchon (Yonsei Branch)",
    type: "Goshiwon",
    distance: "384-2 Seongsan-ro · ~3 min walk to Yonsei",
    priceMin: 350000, priceMax: 550000, priceStatus: "estimate",
    priceNote: "Small deposit of ₩100,000–₩200,000. Shared kitchen facility.",
    rating: null, reviews: null,
    tags: ["Ultra close", "English support", "Foreigners welcome", "Shared kitchen"],
    phone: null,
    links: [
      { label: "Photos & Booking", url: "https://goshipages.com/ghouse03" }
    ],
  },
  {
    id: "easystay_oneroom",
    name: "Easy Stay Oneroom (Sinchon-Yonsei)",
    type: "Oneroomtel",
    distance: "Sinchon area · Close to campus",
    priceMin: 600000, priceMax: 900000, priceStatus: "estimate",
    priceNote: "Premium tier oneroomtel; confirm exact rates directly. Private unit with outer-facing window, private bathroom, washing machine, and dryer.",
    rating: 5.0, reviews: null,
    tags: ["In-room laundry", "Private bathroom", "New build", "Elevator", "Quiet"],
    phone: "+82 10-3398-1838",
    links: [
      { label: "Photos & Website", url: "https://easystay.co.kr/sc" }
    ],
  },
  {
    id: "residence_first",
    name: "Residence First Oneroomtel",
    type: "Oneroomtel",
    distance: "2 min from Sinchon Station · Close to campus",
    priceMin: 500000, priceMax: 800000, priceStatus: "estimate",
    priceNote: "Oneroomtel tier pricing; confirm directly. One older review flagged cleanliness, so viewing in person is recommended.",
    rating: 4.3, reviews: null,
    tags: ["Furnished", "Near metro", "Secure entry", "Female favorite location"],
    phone: "+82 50-71307-6100",
    links: [
      { label: "Photos & Booking", url: "https://goshipages.com/park" }
    ],
  },
  {
    id: "monostay_premium",
    name: "Mono Stay Premium Residence",
    type: "Oneroomtel",
    distance: "4 min from Sinchon Station · ~7 min walk to Yonsei",
    priceMin: 1100000, priceMax: 1200000, priceStatus: "verified",
    priceNote: "Deposit: ₩500,000. All utilities included with a 1-month minimum stay length.",
    rating: null, reviews: null,
    tags: ["Brand new", "Private bathroom", "Women-only floors available", "Utilities incl."],
    phone: "+82 10-2282-1251", // Storing WhatsApp mobile line for application simplicity
    links: [
      { label: "Photos & Details (English)", url: "https://goshipages.com/monostay" }
    ],
  },
];

const TIPS = [
  { id: "fb", text: "Join the Facebook group “Housing in Seoul” (search inside Facebook — referenced by Yonsei’s int’l office)." },
  { id: "see", text: "Goshiwon: see the room before paying. Inside-facing windows are cheaper but darker & worse ventilation." },
  { id: "immig", text: "Report your address to the local Immigration Office within 14 days of moving in, or risk a fine." },
  { id: "timing", text: "September rooms fill fast — reserve 1–2 months ahead. Favor refundable / flexible options." },
];

const STATUS_META = {
  none:      { label: "Not yet", c: "#b08aa0", bg: "rgba(176,138,160,.16)" },
  contacted: { label: "Messaged", c: "#8a6fc7", bg: "rgba(138,111,199,.16)" },
  waiting:   { label: "Waiting", c: "#d98a4a", bg: "rgba(217,138,74,.18)" },
  booked:    { label: "Booked! ♡", c: "#d6447f", bg: "rgba(214,68,127,.16)" },
};
const PRICE_TAG = {
  confirmed: { label: "Confirmed ♡", c: "#5aa17e" },
  reported:  { label: "Reported",  c: "#d98a4a" },
  estimate:  { label: "Estimate",  c: "#d98a4a" },
  varies:    { label: "Varies",    c: "#b08aa0" },
};
const TYPE_ICON = {
  "Student housing": Building2, "Goshiwon": BedDouble,
  "Share house": Users, "Co-living": Coffee,
};

const STORE_KEY = "esther-housing-v1";
const fmtKRW = (n) => "₩" + Number(n).toLocaleString();

/* ------------------------------------------------------------------ */
/*  ♡ EDIT ME: your handwritten note to Esther + how you sign it.      */
/* ------------------------------------------------------------------ */
const LOVE_NOTE =
  "i know you are really stressed about the housing. so i made you this — " +
  "pick whatever feels like home, i will add to the list periodically in case you need more. " +
  "i can't wait to come visit you in Seoul.";
const SIGNATURE = "— always, your dean";

/* ------------------------------------------------------------------ */
/*  Storage that works BOTH in the Claude preview (window.storage)     */
/*  AND once you deploy it (falls back to the browser's localStorage). */
/* ------------------------------------------------------------------ */
const hasCloud =
  typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";
const store = {
  async get(k) {
    if (hasCloud) return window.storage.get(k);
    const v = localStorage.getItem(k);
    return v == null ? null : { key: k, value: v };
  },
  async set(k, v) {
    if (hasCloud) return window.storage.set(k, v);
    localStorage.setItem(k, v);
    return { key: k, value: v };
  },
  async delete(k) {
    if (hasCloud) return window.storage.delete(k);
    localStorage.removeItem(k);
    return { key: k, deleted: true };
  },
};

/* ------------------------------------------------------------------ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [rate, setRate] = useState(920); // C$ per 1,000,000 KRW
  const [overrides, setOverrides] = useState({});
  const [custom, setCustom] = useState([]);
  const [checks, setChecks] = useState({});

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortKey, setSortKey] = useState("shortlist");
  const [budget, setBudget] = useState(1500000);
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await store.get(STORE_KEY);
        if (r && r.value) {
          const s = JSON.parse(r.value);
          if (s.rate) setRate(s.rate);
          if (s.overrides) setOverrides(s.overrides);
          if (s.custom) setCustom(s.custom);
          if (s.checks) setChecks(s.checks);
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await store.set(STORE_KEY, JSON.stringify({ rate, overrides, custom, checks }));
      } catch (e) {}
    })();
  }, [loaded, rate, overrides, custom, checks]);

  const toCAD = (krw) => Math.round((krw / 1_000_000) * rate);
  const cadStr = (l) => {
    if (l.priceMin == null) return "—";
    const lo = toCAD(l.priceMin);
    return l.priceMin === l.priceMax ? `≈ C$${lo.toLocaleString()}`
      : `≈ C$${lo.toLocaleString()} – ${toCAD(l.priceMax).toLocaleString()}`;
  };
  const krwStr = (l) => {
    if (l.priceMin == null) return "Price varies";
    return l.priceMin === l.priceMax ? fmtKRW(l.priceMin)
      : `${fmtKRW(l.priceMin)} – ${Number(l.priceMax).toLocaleString()}`;
  };

  const listings = useMemo(() => {
    const merged = SEED_LISTINGS.map((s) => ({ ...s, ...(overrides[s.id] || {}), seed: true }));
    return [...merged, ...custom.map((c) => ({ ...c, seed: false }))];
  }, [overrides, custom]);

  const types = useMemo(() => ["All", ...Array.from(new Set(listings.map((l) => l.type)))], [listings]);

  const view = useMemo(() => {
    let arr = listings.filter((l) => {
      if (typeFilter !== "All" && l.type !== typeFilter) return false;
      if (search && !(`${l.name} ${l.type} ${l.distance}`.toLowerCase().includes(search.toLowerCase()))) return false;
      if (l.priceMin != null && l.priceMin > budget) return false;
      return true;
    });
    const byNum = (v) => (v == null ? Infinity : v);
    arr.sort((a, b) => {
      if (sortKey === "shortlist") return (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || byNum(a.priceMin) - byNum(b.priceMin);
      if (sortKey === "price") return byNum(a.priceMin) - byNum(b.priceMin);
      if (sortKey === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return arr;
  }, [listings, typeFilter, search, budget, sortKey]);

  const patchSeed = (id, fields) => setOverrides((o) => ({ ...o, [id]: { ...(o[id] || {}), ...fields } }));
  const patchCustom = (id, fields) => setCustom((c) => c.map((l) => (l.id === id ? { ...l, ...fields } : l)));
  const patch = (l, fields) => (l.seed ? patchSeed(l.id, fields) : patchCustom(l.id, fields));
  const removeCustom = (id) => setCustom((c) => c.filter((l) => l.id !== id));

  const shortlisted = listings.filter((l) => l.fav).length;
  const booked = listings.filter((l) => l.status === "booked").length;
  const cheapest = listings.filter((l) => l.priceMin != null)
    .reduce((m, l) => (m == null || l.priceMin < m ? l.priceMin : m), null);

  if (!loaded) {
    return (
      <div style={S.shell}>
        <Style />
        <div style={{ ...S.wrap, textAlign: "center", paddingTop: 130 }}>
          <Heart size={30} fill="var(--accent)" style={{ color: "var(--accent)" }} className="beat" />
          <p style={{ fontFamily: "var(--script)", fontSize: 28, color: "var(--accent)", marginTop: 14 }}>
            finding cozy spots for you…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.shell}>
      <Style />
      <div style={S.wrap}>
        {/* ---------- HEADER ---------- */}
        <header style={S.header}>
          <span style={S.floatHeart} className="float1">♡</span>
          <span style={S.floatHeart2} className="float2">♡</span>
          <span style={S.floatHeart3} className="float3">✿</span>

          <div style={S.kicker}>♡ &nbsp; a little something i made for &nbsp; ♡</div>
          <h1 style={S.h1}>
            <span className="script">Esther's</span><br />
            Sinchon nest
          </h1>
          <p style={S.sub}>
            Some cozy places near campus, my sweet love. I'll keep checking the prices
            so you don't have to stress. Tap the heart on the ones you love. 🩷
          </p>

          <div style={S.noteCard}>
            <p style={S.noteText}>{LOVE_NOTE}</p>
            <p style={S.noteSign}>{SIGNATURE}</p>
          </div>

          <div style={S.statRow}>
            <Stat n={listings.length} label="cozy options" />
            <Stat n={shortlisted} label="your faves" accent heart />
            <Stat n={booked} label="booked!" booked />
            <Stat n={cheapest ? `₩${(cheapest / 1000).toLocaleString()}k` : "—"} label="cheapest" small />
          </div>

          <div style={S.rateBox}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>exchange rate</span>
            <span style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>₩1,000,000 = C$</span>
            <input type="number" value={rate} min={1}
              onChange={(e) => setRate(Number(e.target.value) || 0)} style={S.rateInput} />
            <span style={{ color: "var(--muted)", fontSize: 12 }}>· checked 1 Jun 2026</span>
          </div>
        </header>

        {/* ---------- CONTROLS ---------- */}
        <div style={S.controls}>
          <div style={S.searchWrap}>
            <Search size={16} style={{ color: "var(--accent)" }} />
            <input placeholder="search a name, type, area…" value={search}
              onChange={(e) => setSearch(e.target.value)} style={S.searchInput} />
          </div>
          <div style={S.chips}>
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} className="chip"
                style={typeFilter === t ? S.chipOn : S.chip}>{t}</button>
            ))}
          </div>
        </div>

        <div style={S.controls2}>
          <label style={S.budgetWrap}>
            <span style={{ fontSize: 12.5, color: "var(--muted)", whiteSpace: "nowrap" }}>
              budget {budget >= 1500000 ? "(any 💕)" : `${fmtKRW(budget)} · ≈C$${toCAD(budget)}`}
            </span>
            <input type="range" min={200000} max={1500000} step={50000} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ accentColor: "var(--accent)", flex: 1, minWidth: 120 }} />
          </label>
          <div style={S.sortWrap}>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>sort</span>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={S.select}>
              <option value="shortlist">faves first</option>
              <option value="price">price ↑</option>
              <option value="rating">rating ↓</option>
              <option value="name">name a–z</option>
            </select>
          </div>
          <button onClick={() => setShowAdd((v) => !v)} style={S.addBtn} className="addbtn">
            <Plus size={16} /> add a place
          </button>
        </div>

        {showAdd && <AddForm onAdd={(l) => { setCustom((c) => [...c, l]); setShowAdd(false); }} onClose={() => setShowAdd(false)} />}

        {/* ---------- LISTINGS ---------- */}
        <div style={S.grid}>
          {view.map((l, i) => (
            <Card key={l.id} l={l} index={i}
              krwStr={krwStr(l)} cadStr={cadStr(l)}
              expanded={expanded === l.id} onToggle={() => setExpanded(expanded === l.id ? null : l.id)}
              editing={editing === l.id} onEdit={() => setEditing(editing === l.id ? null : l.id)}
              patch={(f) => patch(l, f)} onDelete={() => removeCustom(l.id)} />
          ))}
          {view.length === 0 && (
            <div style={S.empty}>no places match those filters, love — try loosening the budget 🌸</div>
          )}
        </div>

        {/* ---------- TIPS ---------- */}
        <section style={S.tips}>
          <button onClick={() => setShowTips((v) => !v)} style={S.tipsHead} className="tipshead">
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Info size={16} style={{ color: "var(--accent)" }} /> before you move in, love 💌
            </span>
            <ChevronDown size={16} style={{ transform: showTips ? "rotate(180deg)" : "none", transition: ".2s" }} />
          </button>
          {showTips && (
            <ul style={S.tipsList}>
              {TIPS.map((t) => (
                <li key={t.id} style={S.tipItem}>
                  <button onClick={() => setChecks((c) => ({ ...c, [t.id]: !c[t.id] }))}
                    style={{ ...S.checkbox, ...(checks[t.id] ? S.checkboxOn : {}) }} aria-label="toggle">
                    {checks[t.id] && <Check size={13} strokeWidth={3} />}
                  </button>
                  <span style={{ color: checks[t.id] ? "var(--muted)" : "var(--ink)", textDecoration: checks[t.id] ? "line-through" : "none" }}>
                    {t.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------- FOOTER ---------- */}
        <footer style={S.footer}>
          <span style={{ fontFamily: "var(--script)", fontSize: 19, color: "var(--accent)" }}>
            made with love, just for you ♡
          </span>
          <button onClick={async () => {
            if (!confirm("Reset everything — faves, notes, prices you edited, and places you added?")) return;
            setOverrides({}); setCustom([]); setChecks({}); setRate(920);
            try { await store.delete(STORE_KEY); } catch (e) {}
          }} style={S.resetBtn} className="reset"><RotateCcw size={13} /> reset</button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Stat({ n, label, accent, booked, small, heart }) {
  return (
    <div style={S.stat}>
      <div style={{
        fontFamily: "var(--serif)", fontWeight: 700, fontSize: small ? 22 : 28, lineHeight: 1,
        display: "flex", alignItems: "center", gap: 5,
        color: accent ? "var(--accent)" : booked ? "#d6447f" : "var(--ink)",
      }}>
        {n}{heart && <Heart size={15} fill="var(--accent)" style={{ color: "var(--accent)" }} />}
      </div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

function Card({ l, index, krwStr, cadStr, expanded, onToggle, editing, onEdit, patch, onDelete }) {
  const Icon = TYPE_ICON[l.type] || Building2;
  const pt = PRICE_TAG[l.priceStatus] || PRICE_TAG.varies;
  const status = l.status || "none";

  return (
    <article style={{ ...S.card, ...(l.fav ? S.cardFav : {}), animationDelay: `${Math.min(index, 8) * 60}ms` }} className="card">
      {l.fav && <div style={S.ribbon}>Esther loves this ♡</div>}
      <div style={S.cardTop}>
        <div style={S.typeBadge}><Icon size={13} /> {l.type}</div>
        <button onClick={() => patch({ fav: !l.fav })} style={S.favBtn} aria-label="love it"
          className={l.fav ? "favbtn pop" : "favbtn"}>
          <Heart size={20} fill={l.fav ? "var(--accent)" : "none"} style={{ color: l.fav ? "var(--accent)" : "#d8b3c5" }} />
        </button>
      </div>

      <h3 style={S.cardName}>{l.name}</h3>
      <div style={S.metaRow}>
        <span style={S.meta}><MapPin size={13} /> {l.distance}</span>
        {l.rating && <span style={S.meta}><Star size={13} fill="#e8a33d" style={{ color: "#e8a33d" }} />{l.rating}{l.reviews ? ` · ${l.reviews}` : ""}</span>}
      </div>

      {!editing ? (
        <div style={S.priceBlock}>
          <div>
            <div style={S.priceKRW}>{krwStr}</div>
            <div style={S.priceCAD}>{cadStr}{l.priceMin != null ? " /mo" : ""}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...S.priceTag, color: pt.c, borderColor: pt.c, background: pt.c + "1a" }}>{pt.label}</span>
            <button onClick={onEdit} style={S.iconBtn} className="iconbtn" aria-label="edit price"><Pencil size={14} /></button>
          </div>
        </div>
      ) : (
        <PriceEditor l={l} onSave={(f) => { patch(f); onEdit(); }} onCancel={onEdit} />
      )}

      {l.priceNote && <p style={S.note}>{l.priceNote}</p>}

      {l.tags?.length > 0 && (
        <div style={S.tagWrap}>
          {l.tags.map((t, i) => <span key={i} style={S.tag}>{t.includes("WiFi") ? <Wifi size={10} /> : null}{t}</span>)}
        </div>
      )}

      <div style={S.statusRow}>
        {Object.entries(STATUS_META).map(([k, m]) => (
          <button key={k} onClick={() => patch({ status: k })}
            style={{ ...S.statusChip, ...(status === k ? { background: m.bg, color: m.c, borderColor: m.c } : {}) }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={S.linkWrap}>
        {l.phone && (
          <a href={`tel:${l.phone.replace(/\s/g, "")}`} style={S.linkBtn} className="linkbtn">
            <Phone size={13} /> {l.phone}
          </a>
        )}
        {l.links?.map((lk, i) => (
          <a key={i} href={lk.url} target="_blank" rel="noopener noreferrer" style={S.linkBtn} className="linkbtn">
            <ExternalLink size={13} /> {lk.label}
          </a>
        ))}
      </div>

      <button onClick={onToggle} style={S.noteToggle} className="notetoggle">
        {l.notes ? "your notes ✎" : "+ add a note"} <ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: ".2s" }} />
      </button>
      {expanded && (
        <textarea value={l.notes || ""} onChange={(e) => patch({ notes: e.target.value })}
          placeholder="got a quote? asked about Sept? jot it here, love…" style={S.textarea} rows={3} />
      )}

      {!l.seed && (
        <button onClick={onDelete} style={S.deleteBtn} className="delete"><Trash2 size={12} /> remove</button>
      )}
    </article>
  );
}

function PriceEditor({ l, onSave, onCancel }) {
  const [min, setMin] = useState(l.priceMin ?? "");
  const [max, setMax] = useState(l.priceMax ?? "");
  const [confirmed, setConfirmed] = useState(l.priceStatus === "confirmed");
  return (
    <div style={S.editor}>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="number" value={min} onChange={(e) => setMin(e.target.value)} placeholder="min ₩" style={S.editInput} />
        <input type="number" value={max} onChange={(e) => setMax(e.target.value)} placeholder="max ₩ (optional)" style={S.editInput} />
      </div>
      <label style={S.confirmRow}>
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ accentColor: "#5aa17e" }} />
        we confirmed this rate ♡
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="addbtn" style={S.saveBtn} onClick={() => {
          const mn = min === "" ? null : Number(min);
          const mx = max === "" ? mn : Number(max);
          onSave({ priceMin: mn, priceMax: mx, priceStatus: confirmed ? "confirmed" : (mn == null ? "varies" : "estimate") });
        }}><Check size={14} /> save</button>
        <button onClick={onCancel} style={S.cancelBtn}><X size={14} /> cancel</button>
      </div>
    </div>
  );
}

function AddForm({ onAdd, onClose }) {
  const [f, setF] = useState({ name: "", type: "Share house", distance: "", priceMin: "", priceMax: "", phone: "", url: "", linkLabel: "", notes: "" });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const submit = () => {
    if (!f.name.trim()) return;
    const mn = f.priceMin === "" ? null : Number(f.priceMin);
    const mx = f.priceMax === "" ? mn : Number(f.priceMax);
    let url = f.url.trim();
    if (url && !/^https?:\/\//.test(url)) url = "https://" + url;
    onAdd({
      id: "custom-" + Date.now(),
      name: f.name.trim(), type: f.type, distance: f.distance.trim() || "added by you 🩷",
      priceMin: mn, priceMax: mx, priceStatus: mn == null ? "varies" : "estimate",
      priceNote: "", rating: null, reviews: null, tags: ["added by you"],
      phone: f.phone.trim() || null,
      links: url ? [{ label: f.linkLabel.trim() || "listing", url }] : [],
      notes: f.notes.trim(),
    });
  };
  return (
    <div style={S.addForm}>
      <div style={S.addFormHead}>
        <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 19, color: "var(--ink)" }}>add a place you found 🌷</span>
        <button onClick={onClose} style={S.iconBtn}><X size={16} /></button>
      </div>
      <div style={S.addGrid}>
        <input placeholder="name *" value={f.name} onChange={(e) => set("name", e.target.value)} style={S.fInput} />
        <select value={f.type} onChange={(e) => set("type", e.target.value)} style={S.fInput}>
          {["Share house", "Goshiwon", "Student housing", "Co-living", "Other"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <input placeholder="distance / area" value={f.distance} onChange={(e) => set("distance", e.target.value)} style={S.fInput} />
        <input placeholder="phone" value={f.phone} onChange={(e) => set("phone", e.target.value)} style={S.fInput} />
        <input type="number" placeholder="price min ₩" value={f.priceMin} onChange={(e) => set("priceMin", e.target.value)} style={S.fInput} />
        <input type="number" placeholder="price max ₩ (optional)" value={f.priceMax} onChange={(e) => set("priceMax", e.target.value)} style={S.fInput} />
        <input placeholder="link url" value={f.url} onChange={(e) => set("url", e.target.value)} style={S.fInput} />
        <input placeholder="link label" value={f.linkLabel} onChange={(e) => set("linkLabel", e.target.value)} style={S.fInput} />
      </div>
      <textarea placeholder="notes…" value={f.notes} onChange={(e) => set("notes", e.target.value)} style={{ ...S.textarea, marginTop: 10 }} rows={2} />
      <button onClick={submit} style={{ ...S.addBtn, marginTop: 12 }} className="addbtn"><Plus size={16} /> add to list</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Caveat:wght@500;700&family=Quicksand:wght@400;500;600;700&display=swap');
      :root{
        --paper:#FFF1F6; --card:#FFFBFD; --ink:#5B2A45; --muted:#b48aa0;
        --accent:#EC5E9A; --accent-soft:#FBD3E4; --line:rgba(236,94,154,.16);
        --serif:'Playfair Display',Georgia,serif; --script:'Caveat',cursive; --sans:'Quicksand',sans-serif;
      }
      *{box-sizing:border-box;}
      .script{font-family:var(--script);font-weight:700;color:var(--accent);font-size:1.18em;}
      .chip:hover{border-color:var(--accent);color:var(--accent);}
      .card{transition:transform .2s ease, box-shadow .2s ease;animation:rise .5s ease both;}
      .card:hover{transform:translateY(-4px);box-shadow:0 18px 40px -20px rgba(236,94,154,.5);}
      .favbtn{transition:transform .15s ease;}
      .favbtn:hover{transform:scale(1.18);}
      .pop{animation:pop .35s ease;}
      .iconbtn:hover{transform:scale(1.15);}
      .linkbtn:hover{background:var(--accent);color:#fff;border-color:var(--accent);}
      .addbtn:hover{filter:brightness(1.05);box-shadow:0 8px 20px -8px var(--accent);}
      .notetoggle:hover,.tipshead:hover,.reset:hover,.delete:hover{color:var(--accent);}
      .beat{animation:beat 1.1s ease-in-out infinite;}
      .float1{animation:floaty 5s ease-in-out infinite;}
      .float2{animation:floaty 6.5s ease-in-out infinite .8s;}
      .float3{animation:floaty 5.8s ease-in-out infinite .4s;}
      input::placeholder,textarea::placeholder{color:#dcaec3;}
      input:focus,textarea:focus,select:focus{outline:2px solid var(--accent);outline-offset:1px;}
      input[type=range]{height:5px;}
      @keyframes rise{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
      @keyframes pop{0%{transform:scale(1);}40%{transform:scale(1.4);}70%{transform:scale(.9);}100%{transform:scale(1);}}
      @keyframes beat{0%,100%{transform:scale(1);}25%{transform:scale(1.18);}50%{transform:scale(1);}}
      @keyframes floaty{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-14px) rotate(8deg);}}
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
const S = {
  shell: {
    fontFamily: "var(--sans)", background: "var(--paper)", minHeight: "100%",
    backgroundImage:
      "radial-gradient(circle at 0% 0%, rgba(236,94,154,.14), transparent 42%), radial-gradient(circle at 100% 8%, rgba(180,138,199,.12), transparent 40%), radial-gradient(circle at 50% 120%, rgba(255,196,222,.3), transparent 50%)",
    color: "var(--ink)", padding: "0 0 44px",
  },
  wrap: { maxWidth: 920, margin: "0 auto", padding: "0 18px" },
  header: { position: "relative", paddingTop: 44, paddingBottom: 22, borderBottom: "1.5px dashed var(--line)", overflow: "hidden" },
  floatHeart: { position: "absolute", top: 30, right: 18, fontSize: 30, color: "var(--accent-soft)" },
  floatHeart2: { position: "absolute", top: 96, right: 70, fontSize: 20, color: "#f6c1d8" },
  floatHeart3: { position: "absolute", top: 56, right: 130, fontSize: 22, color: "#e7c6ef" },
  kicker: { fontFamily: "var(--sans)", fontWeight: 600, fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 },
  h1: { fontFamily: "var(--serif)", fontWeight: 700, fontSize: 46, lineHeight: 1.04, margin: "0 0 14px", letterSpacing: "-.01em" },
  sub: { fontSize: 15, color: "#9a6f86", maxWidth: 540, lineHeight: 1.55, margin: 0 },
  noteCard: { position: "relative", marginTop: 20, maxWidth: 500, background: "linear-gradient(135deg, #FFFFFF, #FFF4F9)", border: "1.5px solid var(--line)", borderRadius: "18px 18px 18px 4px", padding: "16px 20px", boxShadow: "0 10px 26px -18px rgba(236,94,154,.5)" },
  noteText: { fontFamily: "var(--script)", fontWeight: 500, fontSize: 23, lineHeight: 1.3, color: "var(--ink)", margin: 0 },
  noteSign: { fontFamily: "var(--script)", fontWeight: 700, fontSize: 22, color: "var(--accent)", margin: "8px 0 0", textAlign: "right" },
  statRow: { display: "flex", gap: 26, marginTop: 26, flexWrap: "wrap" },
  stat: { background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 18, padding: "12px 18px", boxShadow: "0 8px 22px -16px rgba(236,94,154,.5)" },
  statLabel: { fontSize: 11, color: "var(--muted)", letterSpacing: ".05em", textTransform: "uppercase", marginTop: 5, fontWeight: 600 },
  rateBox: { marginTop: 22, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 14, padding: "9px 14px", width: "fit-content" },
  rateInput: { width: 64, fontWeight: 600, fontSize: 13, border: "1.5px solid var(--line)", borderRadius: 8, padding: "3px 7px", background: "#fff", color: "var(--ink)", fontFamily: "var(--sans)" },

  controls: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 26 },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 999, padding: "10px 16px", flex: "1 1 220px", minWidth: 180 },
  searchInput: { border: "none", background: "transparent", fontSize: 14, color: "var(--ink)", width: "100%", fontFamily: "var(--sans)", fontWeight: 500 },
  chips: { display: "flex", gap: 6, flexWrap: "wrap" },
  chip: { fontSize: 12.5, fontWeight: 600, padding: "8px 14px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--sans)" },
  chipOn: { fontSize: 12.5, fontWeight: 700, padding: "8px 14px", borderRadius: 999, border: "1.5px solid var(--accent)", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--sans)", boxShadow: "0 6px 16px -8px var(--accent)" },

  controls2: { display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginTop: 14 },
  budgetWrap: { display: "flex", alignItems: "center", gap: 10, flex: "1 1 260px", minWidth: 220 },
  sortWrap: { display: "flex", alignItems: "center", gap: 8 },
  select: { fontSize: 13, fontWeight: 600, padding: "8px 12px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--ink)", fontFamily: "var(--sans)", cursor: "pointer" },
  addBtn: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700, padding: "10px 18px", borderRadius: 999, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--sans)", transition: ".18s", boxShadow: "0 6px 16px -8px var(--accent)" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18, marginTop: 24 },
  empty: { gridColumn: "1/-1", textAlign: "center", color: "var(--muted)", padding: "46px 0", fontSize: 15, fontFamily: "var(--script)", fontWeight: 700, fontSize: 22 },

  card: { position: "relative", background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", boxShadow: "0 10px 26px -20px rgba(236,94,154,.5)" },
  cardFav: { borderColor: "var(--accent)", boxShadow: "0 0 0 2px var(--accent-soft), 0 14px 30px -18px rgba(236,94,154,.6)" },
  ribbon: { position: "absolute", top: -11, left: 18, background: "var(--accent)", color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: ".03em", padding: "4px 11px", borderRadius: 999, boxShadow: "0 6px 14px -6px var(--accent)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  typeBadge: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-soft)", padding: "4px 9px", borderRadius: 999 },
  favBtn: { background: "none", border: "none", cursor: "pointer", padding: 0 },
  cardName: { fontFamily: "var(--serif)", fontWeight: 700, fontSize: 22, lineHeight: 1.12, margin: "12px 0 8px", color: "var(--ink)" },
  metaRow: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 },
  meta: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "var(--muted)", fontWeight: 500 },

  priceBlock: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "11px 14px", background: "linear-gradient(135deg, #FFF0F6, #FCE7F1)", borderRadius: 14 },
  priceKRW: { fontWeight: 700, fontSize: 16.5, color: "var(--ink)" },
  priceCAD: { fontSize: 12.5, color: "var(--muted)", marginTop: 2, fontWeight: 500 },
  priceTag: { fontSize: 10, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", border: "1.5px solid", borderRadius: 999, padding: "3px 8px" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: "var(--accent)", padding: 2, transition: ".15s" },

  note: { fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: "10px 2px 0", fontWeight: 500 },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 },
  tag: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#9a5fb0", background: "rgba(180,138,199,.14)", borderRadius: 999, padding: "4px 10px" },

  statusRow: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 14 },
  statusChip: { fontSize: 11, fontWeight: 600, padding: "6px 10px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--sans)" },

  linkWrap: { display: "flex", flexDirection: "column", gap: 7, marginTop: 14 },
  linkBtn: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "var(--ink)", textDecoration: "none", border: "1.5px solid var(--line)", borderRadius: 12, padding: "8px 12px", transition: ".15s", background: "#fff" },

  noteToggle: { display: "flex", alignItems: "center", gap: 5, justifyContent: "center", background: "none", border: "none", color: "var(--muted)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginTop: 14, fontFamily: "var(--sans)", transition: ".15s" },
  textarea: { width: "100%", marginTop: 8, border: "1.5px solid var(--line)", borderRadius: 14, padding: 11, fontSize: 13, fontFamily: "var(--sans)", fontWeight: 500, color: "var(--ink)", background: "#fff", resize: "vertical" },
  deleteBtn: { display: "inline-flex", alignItems: "center", gap: 5, alignSelf: "flex-start", background: "none", border: "none", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 12, fontFamily: "var(--sans)", transition: ".15s" },

  editor: { background: "linear-gradient(135deg, #FFF0F6, #FCE7F1)", borderRadius: 14, padding: 13, display: "flex", flexDirection: "column", gap: 10 },
  editInput: { flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, border: "1.5px solid var(--line)", borderRadius: 10, padding: "8px 10px", background: "#fff", color: "var(--ink)", fontFamily: "var(--sans)" },
  confirmRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: "var(--muted)" },
  saveBtn: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, padding: "8px 15px", borderRadius: 999, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--sans)", transition: ".15s" },
  cancelBtn: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 999, border: "1.5px solid var(--line)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--sans)" },

  addForm: { background: "var(--card)", border: "1.5px solid var(--accent)", borderRadius: 22, padding: 20, marginTop: 18, boxShadow: "0 14px 34px -22px rgba(236,94,154,.6)" },
  addFormHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  addGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  fInput: { fontSize: 13, fontWeight: 500, fontFamily: "var(--sans)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "10px 12px", background: "#fff", color: "var(--ink)", minWidth: 0 },

  tips: { marginTop: 30, background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 22, padding: "4px 20px", boxShadow: "0 10px 26px -22px rgba(236,94,154,.5)" },
  tipsHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "16px 0", fontSize: 15, fontWeight: 700, color: "var(--ink)", cursor: "pointer", fontFamily: "var(--sans)", transition: ".15s" },
  tipsList: { listStyle: "none", padding: "0 0 16px", margin: 0, display: "flex", flexDirection: "column", gap: 12 },
  tipItem: { display: "flex", gap: 11, alignItems: "flex-start", fontSize: 13.5, fontWeight: 500, lineHeight: 1.5 },
  checkbox: { flexShrink: 0, width: 20, height: 20, borderRadius: 7, border: "1.5px solid var(--line)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginTop: 1 },
  checkboxOn: { background: "var(--accent)", borderColor: "var(--accent)" },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 28, paddingTop: 20, borderTop: "1.5px dashed var(--line)", fontSize: 12, color: "var(--muted)" },
  resetBtn: { display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid var(--line)", borderRadius: 999, padding: "7px 14px", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", transition: ".15s" },
};
