# Agendamiento automático: Google Calendar + Meet

Cómo conectar el calendario del sitio con Google para que, al reservar, se cree
el evento con sala de Meet y salga el correo de confirmación al cliente.

---

## Qué resuelve esta integración

Dos cosas a la vez, con una sola credencial:

1. **Disponibilidad real.** `freebusy` devuelve los intervalos ocupados del
   calendario, así que el sitio no ofrece huecos que ya tienes tomados. Esto es
   lo que evita el doble booking sin montar una base de datos aparte.
2. **Sala de Meet automática.** El evento se crea con `conferenceData`, y el
   enlace resultante va en el cuerpo del correo de confirmación.

Sin credenciales el sitio no se rompe: la reserva sigue aceptándose, los correos
salen y el enlace simplemente no aparece. Queda registrado en el log.

---

## Por qué hace falta delegación de dominio

Una service account por sí sola **no puede crear salas de Meet**. Google exige
un usuario real como organizador de la conferencia. La delegación de todo el
dominio es lo que permite que la service account actúe *en nombre de* un usuario
de tu Workspace.

Compartir el calendario directamente con la service account (que es el atajo
habitual) alcanza para crear eventos, pero **no genera el enlace de Meet**. Si
solo ves eventos sin sala, es casi seguro esto.

Si no tienes Workspace, usa el Modo B (OAuth con una cuenta de Gmail normal).

---

## Modo A · Workspace

Necesitas ser **superadministrador** del dominio.

### 1. Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com) → crea o elige un proyecto.
2. *APIs y servicios → Biblioteca* → **Google Calendar API** → **Habilitar**.
3. *IAM y administración → Cuentas de servicio* → **Crear cuenta de servicio**.
   No le asignes ningún rol de IAM: los permisos vienen de la delegación, no de
   IAM. Salta los pasos 2 y 3 del asistente.
4. Entra a la cuenta → pestaña **Claves** → *Agregar clave → Crear clave nueva →
   JSON*. Guarda el archivo; no se puede volver a descargar.
5. Pestaña **Detalles** → copia el **ID único** (~21 dígitos). Es el `client_id`
   dentro del JSON.

### 2. Admin Console

[admin.google.com](https://admin.google.com) → *Seguridad → Control de datos y
acceso → Controles de API* → **Gestionar delegación de todo el dominio** →
**Añadir nueva**.

| Campo | Valor |
|---|---|
| ID de cliente | El número de 21 dígitos del paso 1.5 |
| Ámbitos de OAuth | `https://www.googleapis.com/auth/calendar.events,https://www.googleapis.com/auth/calendar.readonly` |

Los ámbitos deben coincidir **carácter por carácter** con los que declara
`lib/google/calendar.ts`. Si sobra o falta uno, Google responde
`unauthorized_client` sin decir cuál.

### 3. Variables de entorno

```bash
GOOGLE_CALENDAR_ID=primary
GOOGLE_SERVICE_ACCOUNT_EMAIL=extro-booking@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
GOOGLE_IMPERSONATE_EMAIL=hola@extro.com.co
BOOKING_TIMEZONE=America/Bogota
```

- `GOOGLE_PRIVATE_KEY` entre comillas dobles y con los `\n` literales tal como
  vienen en el JSON. El código los convierte en saltos reales.
- `GOOGLE_IMPERSONATE_EMAIL` es un usuario **real** de tu Workspace, nunca la
  service account.
- `GOOGLE_CALENDAR_ID=primary` usa el calendario principal de ese usuario. Para
  un calendario aparte, copia su ID desde *Configuración del calendario →
  Integrar calendario → ID del calendario*.

---

## Modo B · Cuenta de Gmail normal

Sin Workspace no hay delegación posible, así que se usa OAuth2 con un refresh
token de tu propia cuenta.

1. Cloud Console → *APIs y servicios → Pantalla de consentimiento de OAuth* →
   tipo **Externo**. Añádete como usuario de prueba.
2. *Credenciales → Crear credenciales → ID de cliente de OAuth* → tipo
   **Aplicación de escritorio**. Guarda `client_id` y `client_secret`.
3. Obtén el refresh token una sola vez con
   [OAuth Playground](https://developers.google.com/oauthplayground):
   engranaje → *Use your own OAuth credentials* → pega id y secret → ámbito
   `https://www.googleapis.com/auth/calendar` → autoriza → *Exchange
   authorization code for tokens*.

```bash
GOOGLE_CALENDAR_ID=primary
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REFRESH_TOKEN=...
```

En modo externo sin verificar, el refresh token **caduca a los 7 días**. Para
producción hay que publicar la app en la pantalla de consentimiento, o usar
Workspace.

---

## Verificación

Con las variables puestas, agenda una reunión de prueba. El log dice
exactamente qué falla:

| Evento en el log | Significado |
|---|---|
| `booking.confirmed` con `hasMeet: true` | Todo correcto |
| `google.no_impersonation` | Falta `GOOGLE_IMPERSONATE_EMAIL` |
| `google.meet_link_missing` | Evento creado, pero sin sala: la delegación no está activa, o el usuario suplantado no tiene Meet habilitado |
| `google.event_insert_failed` | Credenciales o ámbitos mal configurados |
| `google.freebusy_failed` | No se pudo leer la ocupación; el calendario se muestra sin bloqueos reales |

La delegación tarda de minutos a 24 h en propagarse. Un `unauthorized_client`
recién configurado casi siempre es propagación, no un error de credenciales.

---

## Qué pasa cuando algo falla

El diseño es deliberado: **una caída de Google nunca hace perder un lead**.

- `freebusy` falla → el calendario se muestra sin bloqueos reales. Si el hueco
  resulta estar ocupado, el servidor devuelve 409 al confirmar y el cliente
  elige otro.
- La creación del evento falla → la reserva **no se aborta**. Los correos salen
  sin enlace de Meet y el fallo queda registrado. Una reunión sin enlace
  automático es mejor que un cliente perdido.
- Los dos correos y el evento fallan a la vez → ahí sí se devuelve error al
  usuario, porque no quedaría ningún rastro de la reserva.

Ver `app/api/booking/route.ts`.
