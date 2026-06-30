export const metadata = { title: "Privacidad · Knitk" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--foreground)]">
      <h1 className="text-3xl font-extrabold">Política de privacidad</h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">
        Última actualización: junio de 2026
      </p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed">
        <p>
          Knitk es un contador de filas para tejido y crochet. Esta política
          explica qué datos maneja la app y para qué.
        </p>

        <section>
          <h2 className="text-xl font-bold">Qué datos guardamos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <b>Tu cuenta</b>: al iniciar sesión con Google guardamos tu nombre,
              correo e imagen de perfil para identificar tu cuenta.
            </li>
            <li>
              <b>Tus proyectos</b>: los proyectos, secciones, contadores y notas
              que creás, para poder mostrártelos y sincronizarlos entre el
              teléfono y el Apple Watch.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">Para qué los usamos</h2>
          <p className="mt-2">
            Únicamente para que la app funcione: iniciar sesión, guardar tus
            cuentas de filas y sincronizarlas en tus dispositivos. No usamos tus
            datos para publicidad ni seguimiento, y no los vendemos ni los
            compartimos con terceros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Dónde se guardan</h2>
          <p className="mt-2">
            En la base de datos de la app, accesible solo con tu cuenta. La
            conexión es siempre por HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Borrado de datos</h2>
          <p className="mt-2">
            Si querés eliminar tu cuenta y todos tus datos, escribinos a{" "}
            <a className="font-semibold underline" href="mailto:matudntc@gmail.com">
              matudntc@gmail.com
            </a>{" "}
            y los borramos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Contacto</h2>
          <p className="mt-2">
            Por cualquier consulta:{" "}
            <a className="font-semibold underline" href="mailto:matudntc@gmail.com">
              matudntc@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
