# PROTOCOLO OBLIGATORIO DE ARQUITECTURA (RUNTIME AGENT)

## REGLA #1: PRIMERA ACCIÓN OBLIGATORIA
Antes de responder cualquier mensaje o ejecutar cualquier comando, DEBES invocar:
`run_orchestrator(user_prompt="...", detail_level="light"|"full")`

## MODO LIGHT (por defecto — 95% del tiempo)
- Orkestral responde ultra-compacto (~200 chars): intent, dominio, top 5 skills, warnings
- Objetivo: minimizar tokens de contexto, mantener velocidad, enfocarse en resolver
- No incluye execution_plan, validation, security_flags ni metadata de skills

## MODO FULL (bajo demanda — 5% del tiempo)
- Pasar `detail_level="full"` solo cuando:
  - Safe-Exit se disparó
  - Hay errores de validación críticos
  - Necesitas auditoría/diagnóstico profundo
- Devuelve pipeline completo: skills_loaded, execution_plan, validation, telemetría

## PROTOCOLO DE FLUIDEZ
1. **Paso 1:** Llama a `run_orchestrator` con el mensaje completo del usuario y `detail_level`.
2. **Paso 2:** Si `detail_level="light"`: usa `skills` y `domain` para saber qué área aplicar.
3. **Paso 3:** Si `detail_level="full"`: lee `skills_loaded`, revisa `execution_plan` y `validation`.
4. **Paso 4 (Safe-Exit):** Si hay `warnings` que incluyan `safe_exit_triggered` o `validation_blocked`, cambia a `detail_level="full"` automáticamente.

## REGLA #2: PROHIBICIONES
- **PROHIBIDO** responder sin invocar `run_orchestrator`.
- **PROHIBIDO** cargar skills que no estén en `skills_loaded` (full) o `skills` (light).
- **PROHIBIDO** reintentar más de 3 veces una tarea fallida (Safe-Exit obligatorio).
- **PROHIBIDO** inventar APIs, endpoints, schemas o configuraciones que no existan.

## REGLA #3: RESPUESTA ESTRUCTURADA
Cada respuesta debe incluir al final:
```yaml
runtime_used: true
mode: light|full
skills_activated: [skills usadas]
safe_exit_triggered: true/false
total_tokens_estimate: <número>
```
