# Capture Test

## Tool and model

- Tool: Codex CLI via the ChatGPT VS Code extension
- Codex CLI version observed: `0.154.0-alpha.6.2`
- Model: `gpt-5.5`
- Planner/executor split: no separate planner model was exposed; the configured Codex model is `gpt-5.5` for the agent turn.

## Mechanism

Codex hooks are enabled in this install (`codex features list` showed `hooks stable true`). I configured repo-local lifecycle hooks in `.codex/hooks.json`:

- `UserPromptSubmit` runs `.codex/hooks/capture-turn.mjs` and captures the raw prompt.
- `Stop` runs `.codex/hooks/capture-turn.mjs` and captures `last_assistant_message`.

The hook writes session logs to `.agent-logs/` in the required Markdown format. Hook state used to update the current session log is kept in `.codex/capture-state/`.

For canary verification, I ran Codex with `--dangerously-bypass-hook-trust` because non-managed repo hooks otherwise require interactive trust review before running.

## Canary log paths

- First passing canary: `.agent-logs/2026-09-16_05-59-06_01a0a8cc-189d-7212-b7aa-582e8df77e95.md`
- Second passing canary: `.agent-logs/2026-09-16_05-59-25_01a0a8cc-667f-72d1-8b6e-cd1f5cbb5b11.md`

## First passing canary entry

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0a8cc]
timestamp: 2026-09-16T05:59:06.383Z
model: gpt-5.5

CAPTURE TEST — 8x assignment, Muaaz


[LOG_ENTRY type=RESPONSE num=1 session=01a0a8cc]
timestamp: 2026-09-16T05:59:11.777Z
model: gpt-5.5

capture acknowledged
```

## Second passing canary entry

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0a8cc]
timestamp: 2026-09-16T05:59:25.842Z
model: gpt-5.5

CAPTURE TEST — 8x assignment, Muaaz second session


[LOG_ENTRY type=RESPONSE num=1 session=01a0a8cc]
timestamp: 2026-09-16T05:59:29.614Z
model: gpt-5.5

capture acknowledged
```

## What I tried first that did not work

- I first checked official OpenAI/Codex documentation and local CLI/config/session files before claiming hook support.
- I made a local smoke test and initially put hook state under `.agent-logs/.capture-state`; I moved that state to `.codex/capture-state` so `.agent-logs/` contains only submitted log files.
- The first real canary session was interrupted because, before `AGENTS.md` existed, Codex treated `CAPTURE TEST — 8x assignment, Muaaz` as a normal repo task and began inspecting/editing files. That attempt left `.agent-logs/2026-09-16_05-57-05_01a0a8ca-3a0a-7f71-ad2e-11a9f7dc9983.md` with the prompt but no final response. I restored the accidental `app/page.tsx` deletion and added `AGENTS.md` so future `CAPTURE TEST` prompts reply without touching the repo.
