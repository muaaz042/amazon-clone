import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const input = await readStdin();
let event;

try {
  event = JSON.parse(input || "{}");
} catch (error) {
  process.stderr.write(`Invalid hook JSON: ${error.message}\n`);
  process.exit(1);
}

const cwd = event.cwd || process.cwd();
const sessionId = event.session_id || "unknown-session";
const shortSessionId = sessionId.slice(0, 13);
const model = event.model || "unknown-model";
const project = path.basename(cwd);
const logsDir = path.join(cwd, ".agent-logs");
const stateDir = path.join(cwd, ".codex", "capture-state");

fs.mkdirSync(stateDir, { recursive: true });

const statePath = path.join(stateDir, `${sessionId}.json`);
const state = readState(statePath);

if (!state.session_id) {
  state.session_id = sessionId;
  state.model = model;
  state.tool = "codex-cli";
  state.project = project;
  state.author = "unknown";
  state.exchanges = [];
}

if (!state.log_file) {
  const start = event.timestamp || new Date().toISOString();
  state.first_prompt_time = start;
  state.log_file = `${formatFileTimestamp(start)}_${sessionId}.md`;
}

if (event.hook_event_name === "UserPromptSubmit") {
  state.exchanges.push({
    prompt_timestamp: new Date().toISOString(),
    prompt_model: model,
    prompt: event.prompt || "",
    response_timestamp: null,
    response_model: model,
    response: null
  });
}

if (event.hook_event_name === "Stop") {
  const last = [...state.exchanges].reverse().find((entry) => entry.response === null);
  if (last) {
    last.response_timestamp = new Date().toISOString();
    last.response_model = model;
    last.response = event.last_assistant_message || "";
  }
}

writeLog(logsDir, state, shortSessionId);
fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");

if (event.hook_event_name === "Stop") {
  process.stdout.write(JSON.stringify({ continue: true }));
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function readState(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeLog(dir, state, shortId) {
  fs.mkdirSync(dir, { recursive: true });
  const logPath = path.join(dir, state.log_file);
  const exchanges = state.exchanges;
  const firstPrompt = exchanges[0]?.prompt_timestamp || new Date().toISOString();
  const lastPrompt = exchanges.at(-1)?.prompt_timestamp || firstPrompt;
  const lines = [
    "---",
    `session_id: ${state.session_id}`,
    `date: ${firstPrompt.slice(0, 10)}`,
    `author: ${state.author}`,
    `model: ${state.model}`,
    `tool: ${state.tool}`,
    `project: ${state.project}`,
    `total_exchanges: ${exchanges.length}`,
    `first_prompt_time: ${firstPrompt}`,
    `last_prompt_time: ${lastPrompt}`,
    "---",
    "",
    `# Session Log - ${firstPrompt.slice(0, 10)}`,
    "",
    `Session: \`${shortId}\` | Project: \`${state.project}\` | Author: \`${state.author}\``,
    "",
    "---",
    ""
  ];

  exchanges.forEach((entry, index) => {
    const num = index + 1;
    lines.push(
      `[LOG_ENTRY type=PROMPT num=${num} session=${shortId}]`,
      `timestamp: ${entry.prompt_timestamp}`,
      `model: ${entry.prompt_model}`,
      "",
      entry.prompt,
      "",
      ""
    );

    if (entry.response !== null) {
      lines.push(
        `[LOG_ENTRY type=RESPONSE num=${num} session=${shortId}]`,
        `timestamp: ${entry.response_timestamp}`,
        `model: ${entry.response_model}`,
        "",
        entry.response,
        "",
        ""
      );
    }
  });

  fs.writeFileSync(logPath, lines.join("\n"), "utf8");
}

function formatFileTimestamp(timestamp) {
  return new Date(timestamp).toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "-").replace("T", "_").replace("Z", "");
}
