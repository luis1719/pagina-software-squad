const revelarElementos = document.querySelectorAll(".revelar");
const enlacesSeccion = document.querySelectorAll(".nav-secciones a");
const encabezado = document.querySelector(".encabezado");
const botonMenu = document.querySelector(".boton-menu");
const menuPrincipal = document.querySelector(".menu");
const enlacesMenu = document.querySelectorAll(".menu a");
const tarjetaUniversidad = document.querySelector(".hero-panel");
const botonesCorreo = document.querySelectorAll("[data-copy-email]");
const botonArriba = document.querySelector(".volver-arriba");
const toast = document.querySelector(".toast");

const mostrarToast = (mensaje) => {
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("visible");
  window.clearTimeout(mostrarToast.temporizador);
  mostrarToast.temporizador = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 1900);
};

const observadorRevelar = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      observadorRevelar.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12 });

revelarElementos.forEach((elemento) => observadorRevelar.observe(elemento));

const cerrarMenu = () => {
  if (!encabezado || !botonMenu) return;
  encabezado.classList.remove("menu-visible");
  document.body.classList.remove("menu-abierto");
  botonMenu.setAttribute("aria-expanded", "false");
  botonMenu.setAttribute("aria-label", "Abrir menú");
};

const abrirMenu = () => {
  if (!encabezado || !botonMenu) return;
  encabezado.classList.add("menu-visible");
  document.body.classList.add("menu-abierto");
  botonMenu.setAttribute("aria-expanded", "true");
  botonMenu.setAttribute("aria-label", "Cerrar menú");
};

botonMenu?.addEventListener("click", () => {
  const estaAbierto = botonMenu.getAttribute("aria-expanded") === "true";
  estaAbierto ? cerrarMenu() : abrirMenu();
});

enlacesMenu.forEach((enlace) => {
  enlace.addEventListener("click", () => cerrarMenu());
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") cerrarMenu();
});

document.addEventListener("click", (evento) => {
  if (!encabezado?.classList.contains("menu-visible")) return;
  if (!encabezado.contains(evento.target)) cerrarMenu();
});

tarjetaUniversidad?.addEventListener("pointermove", (evento) => {
  const rect = tarjetaUniversidad.getBoundingClientRect();
  const x = evento.clientX - rect.left;
  const y = evento.clientY - rect.top;
  tarjetaUniversidad.style.setProperty("--brillo-x", `${x}px`);
  tarjetaUniversidad.style.setProperty("--brillo-y", `${y}px`);
});

tarjetaUniversidad?.addEventListener("keydown", (evento) => {
  if (evento.key !== " ") return;
  evento.preventDefault();
  tarjetaUniversidad.click();
});

const observarMenuPrincipal = () => {
  const enlacesInternos = Array.from(enlacesMenu).filter((enlace) => {
    const href = enlace.getAttribute("href") || "";
    return href.startsWith("#");
  });

  const secciones = enlacesInternos
    .map((enlace) => document.querySelector(enlace.getAttribute("href")))
    .filter(Boolean);

  if (!secciones.length) return;

  const observadorMenu = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      enlacesInternos.forEach((enlace) => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${entrada.target.id}`);
      });
    });
  }, { rootMargin: "-38% 0px -52% 0px", threshold: 0.01 });

  secciones.forEach((seccion) => observadorMenu.observe(seccion));
};

observarMenuPrincipal();

if (enlacesSeccion.length) {
  const ids = Array.from(enlacesSeccion)
    .map((enlace) => document.querySelector(enlace.getAttribute("href")))
    .filter(Boolean);

  const observadorSecciones = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      enlacesSeccion.forEach((enlace) => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${entrada.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

  ids.forEach((seccion) => observadorSecciones.observe(seccion));
}

botonesCorreo.forEach((boton) => {
  boton.addEventListener("click", async () => {
    const correo = boton.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(correo);
      mostrarToast("Correo copiado");
    } catch {
      mostrarToast(correo);
    }
  });
});

if (botonArriba) {
  window.addEventListener("scroll", () => {
    botonArriba.classList.toggle("visible", window.scrollY > 520);
    encabezado?.classList.toggle("compacto", window.scrollY > 80);
  }, { passive: true });

  botonArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
