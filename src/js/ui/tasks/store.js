const STORAGE_KEY = "fokus:tarefas";
const ACTIVE_KEY = "fokus:tarefaAtivaId";

function createId()
{
    const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    console.log("🚀 ~ createId ~ value:", value);
    return value;
}

export function loadState()
{
    let tasks = [];
    try
    {
        tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch (error)
    {
        tasks = [];
        console.log("🚀 ~ loadState ~ error:", error);
    }

    const activeTaskId = localStorage.getItem(ACTIVE_KEY);
    return { tasks, activeTaskId };
}

export function saveState({ tasks, activeTaskId })
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    if (activeTaskId) localStorage.setItem(ACTIVE_KEY, activeTaskId);
    else localStorage.removeItem(ACTIVE_KEY);
}

export function createTask(description)
{
    const now = Date.now();
    return {
        id: createId(),
        description,
        completed: false,
        createdAt: now,
        updatedAt: now,
    };
}