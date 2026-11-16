import { Fragment, useEffect, useState, type CSSProperties } from "react";
import SimpleParallax from "simple-parallax-js";
import "./mandao.css";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/* Datos                                                               */
/* ------------------------------------------------------------------ */

const dinero = (n: number) => `$${n} DOP`;

const SECCIONES = [
  { id: "nosotros", nombre: "Nosotros" },
  { id: "catalogo", nombre: "Qué vendemos" },
  { id: "beneficios", nombre: "Beneficios" },
  { id: "entrega", nombre: "Entrega" },
];

const HECHOS = [
  { titulo: "Catálogo propio", texto: "Cada colmado sube lo que vende y cambia sus precios cuando quiere." },
  { titulo: "Total sin sorpresas", texto: "Productos, delivery y total en pesos, antes de confirmar." },
  { titulo: "Entrega cerca", texto: "El pedido sale del colmado más próximo a tu casa." },
];

// "tinte" es una variable de color definida en mandao.css
const CATEGORIAS = [
  {
    nombre: "Frescos", emoji: "🥑", tinte: "--tint-mint",
    descripcion: "Frutas, vegetales y viandas que llegan al colmado cada mañana.",
    productos: [
      { nombre: "Aguacate", medida: "1 unidad", precio: 35 },
      { nombre: "Plátano verde", medida: "6 unidades", precio: 90 },
      { nombre: "Tomate de ensalada", medida: "1 libra", precio: 45 },
    ],
  },
  {
    nombre: "Despensa", emoji: "🍚", tinte: "--tint-sun",
    descripcion: "Arroz, habichuelas, aceite y todo lo que se usa en la cocina de diario.",
    productos: [
      { nombre: "Arroz selecto", medida: "5 libras", precio: 210 },
      { nombre: "Habichuelas rojas", medida: "1 libra", precio: 75 },
      { nombre: "Aceite vegetal", medida: "1 litro", precio: 190 },
    ],
  },
  {
    nombre: "Bebidas", emoji: "🧃", tinte: "--tint-blue",
    descripcion: "Agua, jugos, refrescos y café para la casa o para llevar a la reunión.",
    productos: [
      { nombre: "Agua en garrafón", medida: "5 galones", precio: 120 },
      { nombre: "Jugo de naranja", medida: "1 litro", precio: 140 },
      { nombre: "Café molido", medida: "1 libra", precio: 185 },
    ],
  },
  {
    nombre: "Hogar", emoji: "🧼", tinte: "--tint-coral",
    descripcion: "Limpieza y básicos para que no se acabe nada a mitad de semana.",
    productos: [
      { nombre: "Detergente líquido", medida: "1 litro", precio: 160 },
      { nombre: "Papel higiénico", medida: "paquete de 4", precio: 130 },
      { nombre: "Fundas de basura", medida: "25 unidades", precio: 95 },
    ],
  },
  {
    nombre: "Cuidado personal", emoji: "🧴", tinte: "--tint-violet",
    descripcion: "Jabón, champú, pasta dental y lo que usas todos los días.",
    productos: [
      { nombre: "Jabón de baño", medida: "3 unidades", precio: 45 },
      { nombre: "Champú", medida: "400 ml", precio: 230 },
      { nombre: "Pasta dental", medida: "100 ml", precio: 95 },
    ],
  },
];

const BENEFICIOS = [
  { titulo: "Pedidos en minutos", emoji: "⏱️", tinte: "--tint-sun", texto: "Agrega productos, revisa el carrito y confirma. Sin llamadas, sin audios largos y sin que se te olvide nada." },
  { titulo: "Total claro desde el inicio", emoji: "🧾", tinte: "--tint-blue", texto: "Ves la suma de tus productos, el delivery y el total en pesos antes de confirmar el pedido." },
  { titulo: "Precios del colmado", emoji: "🏷️", tinte: "--tint-mint", texto: "Pagas lo mismo que en el mostrador. Cada colmado actualiza su catálogo cuando cambia un precio." },
  { titulo: "Repite tu compra", emoji: "🔁", tinte: "--tint-coral", texto: "Gestiona tus pedidos anteriores y vuelve a pedir lo mismo con un toque cuando se acabe." },
];

const CARRITO = [
  { nombre: "Aguacate", medida: "2 unidades", precio: 70, emoji: "🥑" },
  { nombre: "Plátano verde", medida: "6 unidades", precio: 90, emoji: "🍌" },
  { nombre: "Café molido", medida: "1 libra", precio: 185, emoji: "☕" },
];
const DELIVERY = 60;

/* ------------------------------------------------------------------ */
/* Ayudas                                                              */
/* ------------------------------------------------------------------ */

// Permite usar variables CSS (como --d) en style
const vars = (v: Record<string, string | number>) => v as CSSProperties;

const reducirMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hace aparecer con animación (.rv / .in) lo que tenga data-reveal al hacer scroll
function useReveal() {
  useEffect(() => {
    if (reducirMovimiento() || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.style.setProperty("--rd", `${el.dataset.delay ?? 0}ms`);
        el.classList.add("rv");
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);
}

// Titular que sube palabra por palabra
function Palabras({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(" ").map((p, i) => (
        <Fragment key={i}>
          <span className="word">
            <span className="word-i" style={vars({ "--i": i })}>
              {p}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

// SimpleParallax solo funciona con <img>, así que los SVG se pasan como imagen
const svgSrc = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const NS = 'xmlns="http://www.w3.org/2000/svg"';

const NUBE = "M18 44a14 14 0 0 1 2-28 20 20 0 0 1 38-4 16 16 0 0 1 28 8 12 12 0 0 1 4 24z";
const nube = (o: number) => svgSrc(`<svg ${NS} viewBox="-10 -10 140 70"><path d="${NUBE}" fill="#fff" opacity="${o}"/></svg>`);

const SOL = svgSrc(
  `<svg ${NS} viewBox="-50 -50 300 300"><circle cx="100" cy="100" r="96" fill="#FFC53D" opacity=".16"/><circle cx="100" cy="100" r="70" fill="#FFC53D" opacity=".3"/><circle cx="100" cy="100" r="46" fill="#FFC53D"/></svg>`
);

const ola = (d: string, o: number) =>
  svgSrc(`<svg ${NS} viewBox="0 0 1200 220" preserveAspectRatio="none"><path d="${d}" fill="#fff" opacity="${o}"/></svg>`);
const OLA_LEJOS = ola("M0 90C200 20 380 150 600 80S1000 10 1200 80V220H0Z", 0.1);
const OLA_CERCA = ola("M0 130C220 70 420 190 640 120S1020 70 1200 130V220H0Z", 0.14);

const TIENDA = svgSrc(
  `<svg ${NS} viewBox="0 0 360 260"><rect x="30" y="70" width="300" height="190" rx="12" fill="#14296F"/>` +
    Array.from({ length: 8 })
      .map((_, i) => `<path d="M${30 + i * 37.5} 36 h37.5 v38 a18.75 18.75 0 0 1 -37.5 0 z" fill="${i % 2 ? "#FFC53D" : "#FF6B57"}"/>`)
      .join("") +
    `<rect x="52" y="112" width="104" height="86" rx="8" fill="#FFC53D"/><rect x="62" y="122" width="38" height="66" rx="4" fill="#FFE29A"/><rect x="108" y="122" width="38" height="66" rx="4" fill="#FFE29A"/>` +
    `<rect x="196" y="108" width="100" height="152" rx="8" fill="#0E1D55"/><rect x="206" y="118" width="80" height="60" rx="6" fill="#2457FF"/>` +
    `<rect x="214" y="130" width="64" height="10" rx="5" fill="#fff" opacity=".85"/><rect x="214" y="148" width="40" height="10" rx="5" fill="#fff" opacity=".5"/>` +
    `<rect y="252" width="360" height="8" fill="#0E1D55"/></svg>`
);

/* ------------------------------------------------------------------ */
/* Componentes                                                         */
/* ------------------------------------------------------------------ */

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="11" style={{ fill: "var(--brand)" }} />
        <path d="M9 26V14.5L18 22l9-7.5V26" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="27" cy="9.5" r="3.2" style={{ fill: "var(--sun)" }} />
      </svg>
      <span className="font-display text-[1.35rem] font-extrabold tracking-tight">Mandao</span>
    </span>
  );
}

function Header() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-3 z-40" style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
      <div className="relative flex justify-center">
        <div className="glass glass-strong flex w-full items-center justify-between gap-2 rounded-full py-2 pl-5 pr-2 md:w-fit md:justify-center md:gap-3 md:pr-2.5">
          <a href="#inicio" aria-label="Mandao, ir al inicio" className="text-ink">
            <Logo />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {SECCIONES.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="nav-link rounded-full px-4 py-2 text-[0.95rem] font-medium">
                {s.nombre}
              </a>
            ))}
          </nav>

          <Link to={'/login'} className="btn btn-primary hidden !py-2.5 md:inline-flex">
            Hacer un pedido
          </Link>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-ink md:hidden"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? "✕" : "☰"}
          </button>
        </div>

        {abierto && (
          <nav className="glass glass-strong menu-in absolute left-0 right-0 top-[calc(100%+8px)] rounded-3xl p-3 text-center md:hidden" aria-label="Menú móvil">
            {SECCIONES.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setAbierto(false)} className="block rounded-2xl px-4 py-3 font-medium text-ink hover:bg-brand-soft">
                {s.nombre}
              </a>
            ))}
            <a href="#entrega" onClick={() => setAbierto(false)} className="btn btn-primary mt-2 w-full">
              Hacer un pedido
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

// El teléfono de ejemplo: entra desde abajo, flota y sus filas aparecen una a una
function Telefono() {
  const subtotal = CARRITO.reduce((suma, p) => suma + p.precio, 0);

  return (
    <div className="phone-enter" style={vars({ "--d": "650ms" })}>
      <div className="float">
        <div
          className="mx-auto w-72 rounded-[2.4rem] border-6 bg-surface p-4 text-left text-ink bg-orange-400"
          style={{ borderColor: "#0B1330", boxShadow: "0 40px 80px -24px rgba(5,12,50,.65)" }}
        >
          <p className="font-display text-lg font-bold">Detalles del pedido</p>

          <ul className="mt-3 space-y-2.5">
            {CARRITO.map((p, i) => (
              <li key={p.nombre} className="row-in flex items-center gap-3" style={vars({ "--d": `${1150 + i * 220}ms` })}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-xl">{p.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{p.nombre}</span>
                  <span className="block text-xs text-muted">{p.medida}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums">{dinero(p.precio)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-1 rounded-2xl bg-brand-soft p-3.5 text-sm">
            <p className="flex justify-between text-muted">
              <span>Productos</span> <span className="tabular-nums">{dinero(subtotal)}</span>
            </p>
            <p className="flex justify-between text-muted">
              <span>Delivery</span> <span className="tabular-nums">{dinero(DELIVERY)}</span>
            </p>
            <p className="flex justify-between border-t border-line pt-2 font-bold">
              <span>Total</span> <span className="tabular-nums">{dinero(subtotal + DELIVERY)}</span>
            </p>
          </div>

          <button type="button" className="btn btn-primary mt-3 w-full">
            Realizar pedido
          </button>
        </div>
      </div>
    </div>
  );
}

// Una capa decorativa con parallax
function Capa({ src, className, img = "", ...parallax }: { src: string; className: string; img?: string; scale: number; orientation?: "up" | "down" | "left" | "right"; delay?: number }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <SimpleParallax {...parallax}>
        <img src={src} alt="" className={img} />
      </SimpleParallax>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero-bg relative mt-4 overflow-hidden rounded-[2rem] text-white md:rounded-[2.75rem]">
      {/* Capas con efecto parallax */}
      <Capa src={SOL} className="right-[7%] top-8 h-28 w-28 sm:h-44 sm:w-44" img="h-28 w-28 sm:h-44 sm:w-44" scale={1.25} orientation="down" delay={0.4} />
      <Capa src={nube(0.22)} className="drift left-[8%] top-24 hidden w-28 md:block" img="w-28" scale={1.2} orientation="right" delay={0.4} />
      <Capa src={nube(0.16)} className="drift-b right-[22%] top-[44%] hidden w-24 md:block" img="w-24" scale={1.2} orientation="left" delay={0.4} />
      <Capa src={OLA_LEJOS} className="bottom-0 left-0 w-full" img="h-[240px] w-full object-fill" scale={1.15} orientation="down" />
      <Capa src={OLA_CERCA} className="bottom-0 left-0 w-full" img="h-[210px] w-full object-fill" scale={1.1} orientation="down" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center" aria-hidden="true">
        <div className="w-[560px] max-w-none shrink-0">
          <SimpleParallax scale={1.06} orientation="down">
            <img src={TIENDA} alt="" className="h-auto w-[560px] max-w-none" />
          </SimpleParallax>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-16 text-center md:px-12 md:pt-24">
        <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6.4vw,4.8rem)] font-extrabold leading-[1.03] tracking-tight [text-wrap:balance]">
          <Palabras texto="Tu colmado de siempre, ahora a un toque." />
        </h1>
        <p className="rise-in mt-6 max-w-[50ch] text-[1.1rem] leading-relaxed text-white/90" style={vars({ "--d": "650ms" })}>
          Arma tu pedido con lo que vende el colmado de tu barrio y recíbelo en la puerta de tu casa, con el delivery calculado antes de pagar.
        </p>
        <div className="rise-in mt-8 flex flex-wrap justify-center gap-3" style={vars({ "--d": "800ms" })}>
          <a href="#entrega" className="btn btn-sun">Hacer un pedido</a>
          <a href="#catalogo" className="btn btn-outline-light">Ver qué vendemos</a>
        </div>
        <p className="rise-in mt-5 text-sm text-white/80" style={vars({ "--d": "900ms" })}>
          Paga en efectivo, con tarjeta o por transferencia.
        </p>

        <div className="mb-[-170px] mt-14">
          <Telefono />
        </div>
      </div>
    </section>
  );
}

const h2 = "font-display text-[clamp(2rem,4.4vw,3.3rem)] font-bold leading-[1.05] tracking-tight [text-wrap:balance]";

function Nosotros() {
  return (
    <section id="nosotros" className="py-20 text-center md:py-28">
      <div data-reveal>
        <h2 className={`${h2} mx-auto max-w-3xl`}>Somos el colmado del barrio con un celular de por medio.</h2>
        <p className="mx-auto mt-6 max-w-[60ch] text-[1.1rem] leading-relaxed text-muted">
          Mandao nació para que pedir un mandado sea tan fácil como llamar al colmado, sin esperar en la línea. Tú eliges lo que necesitas, ves cuánto vas a pagar y sigues tu pedido hasta que llega. El colmado sigue siendo del barrio. Tú solo ahorras el viaje.
        </p>
      </div>

      <dl className="mx-auto mt-12 grid max-w-4xl gap-8 border-t border-line pt-10 sm:grid-cols-3">
        {HECHOS.map((h, i) => (
          <div key={h.titulo} data-reveal data-delay={i * 120}>
            <dt className="font-display text-xl font-bold">{h.titulo}</dt>
            <dd className="mx-auto mt-2 max-w-[28ch] text-muted">{h.texto}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Catalogo() {
  const [actual, setActual] = useState(0);
  const [dir, setDir] = useState(1); // 1 = entra desde la derecha, -1 = desde la izquierda
  const c = CATEGORIAS[actual];

  const ir = (k: number) => {
    const n = (k + CATEGORIAS.length) % CATEGORIAS.length;
    setDir(n > actual ? 1 : -1);
    setActual(n);
  };

  const flecha = (d: number) => (
    <button
      type="button"
      onClick={() => ir(actual + d)}
      aria-label={d < 0 ? "Categoría anterior" : "Categoría siguiente"}
      className="arrow-btn grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-soft"
    >
      {d < 0 ? "←" : "→"}
    </button>
  );

  return (
    <section id="catalogo" className="py-6 md:py-10">
      <div data-reveal>
        <div className="tint-shift rounded-[2rem] p-5 text-center md:rounded-[2.75rem] md:p-12" style={{ background: `var(${c.tinte})` }}>
          <div className="flex items-center justify-between gap-4">
            {flecha(-1)}
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight">¿Qué vendemos?</h2>
            {flecha(1)}
          </div>

          {/* key = al cambiar de categoría se vuelve a animar */}
          <div key={c.nombre} className={`mt-8 md:mt-10 ${dir > 0 ? "slide-r" : "slide-l"}`} role="tabpanel">
            <div className="art-pop mx-auto grid h-40 w-40 place-items-center rounded-[2rem] bg-surface text-8xl shadow-soft">{c.emoji}</div>
            <h3 className="mt-8 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-none tracking-tight">{c.nombre}</h3>
            <p className="mx-auto mt-4 max-w-[44ch] text-[1.05rem] text-muted">{c.descripcion}</p>

            <ul className="mx-auto mt-6 max-w-md text-left">
              {c.productos.map((p, k) => (
                <li key={p.nombre} className="rise-in flex items-baseline justify-between gap-4 border-b border-line py-3" style={vars({ "--d": `${180 + k * 90}ms` })}>
                  <span>
                    <span className="font-semibold">{p.nombre}</span>
                    <span className="ml-2 text-sm text-muted">{p.medida}</span>
                  </span>
                  <span className="font-semibold tabular-nums">{dinero(p.precio)}</span>
                </li>
              ))}
            </ul>

            <a href="#entrega" className="btn btn-primary mt-7">
              Pedir {c.nombre.toLowerCase()}
            </a>
          </div>

          {/* Pestañas */}
          <div role="tablist" aria-label="Categorías" className="mt-10 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:overflow-visible">
            {CATEGORIAS.map((t, k) => (
              <button
                key={t.nombre}
                role="tab"
                type="button"
                aria-selected={k === actual}
                onClick={() => ir(k)}
                className={`chip shrink-0 rounded-full px-5 py-2.5 font-semibold ${k === actual ? "bg-brand text-on-brand" : "bg-surface text-ink hover:bg-brand-soft"}`}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Beneficios() {
  return (
    <section id="beneficios" className="py-20 text-center md:py-28">
      <div data-reveal className="mx-auto max-w-2xl">
        <h2 className={h2}>Lo que ganas al pedir con Mandao</h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[1.05rem] text-muted">Menos vueltas, menos espera y cuentas claras en cada pedido.</p>
      </div>

      {/* Dos columnas, la segunda más abajo */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {[[0, 2], [1, 3]].map((col, c) => (
          <div key={c} className={`flex flex-col gap-5 ${c ? "sm:pt-20" : ""}`}>
            {col.map((i, k) => {
              const b = BENEFICIOS[i];
              return (
                <div key={b.titulo} data-reveal data-delay={(c + k * 2) * 90}>
                  <article className="lift rounded-[2rem] p-7 text-center md:p-9" style={{ background: `var(${b.tinte})` }}>
                    <span className="wiggle mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-2xl">{b.emoji}</span>
                    <h3 className="mt-6 font-display text-[1.6rem] font-bold leading-tight tracking-tight">{b.titulo}</h3>
                    <p className="mx-auto mt-3 max-w-[38ch] text-muted">{b.texto}</p>
                  </article>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function Entrega() {
  return (
    <section id="entrega" className="py-20 text-center md:py-28">
      <div data-reveal>
        <h2 className={h2}>Área de entrega</h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[1.05rem] text-muted">Llevamos tu pedido a todo Santo Domingo y sus alrededores.</p>
      </div>

      <div data-reveal data-delay={120} className="mx-auto mt-10 max-w-4xl">
        <div className="map-frame aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft md:aspect-[16/9] md:rounded-[2.5rem]">
          <iframe
            title="Mapa de Santo Domingo"
            src="https://www.google.com/maps?q=Santo+Domingo,+Dominican+Republic&z=12&output=embed"
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>
        <a href="https://www.google.com/maps/place/Santo+Domingo,+Dominican+Republic" target="_blank" rel="noreferrer" className="btn btn-primary mt-6">
          Abrir en Google Maps
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-10 py-14 text-center text-sm" style={{ background: "var(--footer)", color: "#C5CCEC" }}>
      <div data-reveal className="wrap flex flex-col items-center">
        <Logo className="text-white" />
        <p className="mt-3">El colmado de tu barrio, en tu celular.</p>
        <p className="mt-8">© 2026 Mandao. Hecho por gente del barrio.</p>
        <p className="mx-auto mt-2 max-w-xl text-xs">
          Todos los precios se muestran en pesos dominicanos (DOP). Los productos y precios de cada colmado pueden cambiar sin previo aviso.
        </p>
        <p className="mt-4 text-xs opacity-80">
          Iconos por{" "}
          <a
            href="https://fontawesome.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Font Awesome
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function Mandao() {
  useReveal();

  return (
    <div className="mandao">
      <div className="wrap">
        <Header />
        <main>
          <Hero />
          <Nosotros />
          <Catalogo />
          <Beneficios />
          <Entrega />
        </main>
      </div>
      <Footer />
    </div>
  );
}