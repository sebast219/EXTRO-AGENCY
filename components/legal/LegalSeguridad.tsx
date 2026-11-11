 
// Generated from a Claude Design file. Static markup only.
export default function LegalSeguridad() {
  return (
    <article className="lg-doc">
      <div className="lg-kicker">
        {"Documento 03"}
      </div>
      <h2 className="lg-h2">
        {"Seguridad"}
      </h2>
      <p className="lg-p" style={{ marginTop: "12px" }}>
        {"Cómo protegemos el software y los datos de nuestros clientes, y de qué responde cada parte."}
      </p>
      <h3 className="lg-h3" id="s1">
        {"1. Cómo trabajamos"}
      </h3>
      <div className="lg-cards">
        <div className="lg-card">
          <b>
            {"El código es tuyo"}
          </b>
          <span>
            {"El código, la base de datos y la infraestructura quedan a nombre del cliente desde el primer día, en repositorios y cuentas privadas."}
          </span>
        </div>
        <div className="lg-card">
          <b>
            {"Acceso mínimo"}
          </b>
          <span>
            {"Cada persona tiene solo los accesos que necesita, con verificación en dos pasos donde la plataforma lo permite."}
          </span>
        </div>
        <div className="lg-card">
          <b>
            {"Secretos protegidos"}
          </b>
          <span>
            {"Contraseñas y llaves de API van en variables de entorno o gestores de secretos, nunca dentro del código."}
          </span>
        </div>
        <div className="lg-card">
          <b>
            {"Cifrado"}
          </b>
          <span>
            {"Todo el tráfico va por HTTPS. Los datos se cifran en reposo cuando el proveedor de nube lo ofrece."}
          </span>
        </div>
        <div className="lg-card">
          <b>
            {"Copias de seguridad"}
          </b>
          <span>
            {"Configuramos copias automáticas de la base de datos y probamos que se puedan restaurar."}
          </span>
        </div>
        <div className="lg-card">
          <b>
            {"Código revisado"}
          </b>
          <span>
            {"Revisamos el código antes de cada entrega y mantenemos las dependencias actualizadas."}
          </span>
        </div>
      </div>
      <h3 className="lg-h3" id="s2">
        {"2. Responsabilidad compartida"}
      </h3>
      <p className="lg-p">
        {"La seguridad de un sistema depende de varias partes. Así se reparte:"}
      </p>
      <div className="lg-table" role="table" aria-label="Responsabilidad compartida">
        <div className="lg-tr lg-th" role="row">
          <span role="columnheader">
            {"EXTRO"}
          </span>
          <span role="columnheader">
            {"El cliente"}
          </span>
          <span role="columnheader">
            {"El proveedor de nube"}
          </span>
        </div>
        <div className="lg-tr" role="row">
          <span role="cell">
            <i>
              {"El código que escribimos y sus buenas prácticas."}
            </i>
            <i>
              {"Configuración inicial segura de servidores y bases de datos."}
            </i>
            <i>
              {"Corregir fallas del software durante la garantía pactada."}
            </i>
            <i>
              {"Actualizaciones y monitoreo, si hay contrato de soporte."}
            </i>
          </span>
          <span role="cell">
            <i>
              {"Mantener a su nombre las cuentas de nube, dominio y servicios, y pagarlas."}
            </i>
            <i>
              {"Gestionar los usuarios y contraseñas de su equipo."}
            </i>
            <i>
              {"El contenido y los datos que carga al sistema."}
            </i>
            <i>
              {"Cumplir la Ley 1581 frente a los datos de sus propios usuarios."}
            </i>
          </span>
          <span role="cell">
            <i>
              {"Seguridad física de los centros de datos."}
            </i>
            <i>
              {"Disponibilidad y seguridad de la plataforma."}
            </i>
            <i>
              {"Red y hardware."}
            </i>
          </span>
        </div>
      </div>
      <h3 className="lg-h3" id="s3">
        {"3. Al terminar un proyecto"}
      </h3>
      <p className="lg-p">
        {"Entregamos todos los accesos y la documentación, y retiramos nuestros accesos cuando el cliente lo pida o termine el soporte."}
      </p>
      <h3 className="lg-h3" id="s4">
        {"4. Reportar una vulnerabilidad"}
      </h3>
      <p className="lg-p">
        {"Si encuentras un problema de seguridad en este sitio o en un sistema que hicimos, escríbenos a "}
        <a href="mailto:consultas@extro.com.co">
          {"consultas@extro.com.co"}
        </a>
        {" con el detalle. Te respondemos lo antes posible y te pedimos no divulgarlo hasta que esté corregido."}
      </p>
    </article>
  )
}
