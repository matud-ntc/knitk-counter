export const metadata = { title: "Soporte · Knitk" };

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--foreground)]">
      <h1 className="text-3xl font-extrabold">Soporte</h1>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed">
        <p>
          Knitk es un contador de filas para tejido y crochet, para iPhone y
          Apple Watch.
        </p>

        <section>
          <h2 className="text-xl font-bold">¿Necesitás ayuda?</h2>
          <p className="mt-2">
            Escribinos y te respondemos:{" "}
            <a className="font-semibold underline" href="mailto:matudntc@gmail.com">
              matudntc@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Emparejar el Apple Watch</h2>
          <p className="mt-2">
            En la app, abrí <b>Ajustes</b> y tocá <b>Generar código para el
            Watch</b>. En el reloj, abrí Knitk, elegí <b>Conectar</b> y escribí
            ese código de 6 dígitos. Listo: lo que contás en el reloj se
            sincroniza con tu cuenta.
          </p>
        </section>
      </div>
    </main>
  );
}
