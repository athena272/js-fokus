import { SELECTORS, qs } from "../dom.js";
import { createTask, loadState, saveState } from "./store.js";
import { renderTaskList } from "./render.js";

export function setupTasks()
{
    const listEl = document.querySelector(SELECTORS.taskList);
    if (!listEl) return;

    const addBtn = qs(SELECTORS.addTaskButton);
    const formEl = qs(SELECTORS.taskForm);
    const textareaEl = qs(SELECTORS.taskTextarea);
    const activeDescEl = qs(SELECTORS.activeTaskDescription);

    const removeDoneBtn = qs(SELECTORS.removeDoneButton);
    const removeAllBtn = qs(SELECTORS.removeAllButton);
    const cancelBtn = qs(SELECTORS.formCancelButton);
    const deleteBtn = qs(SELECTORS.formDeleteButton);

    let { tasks, activeTaskId } = loadState();
    let editingTaskId = null;

    function setActive(id)
    {
        activeTaskId = id ?? null;

        const active = tasks.find(t => t.id === activeTaskId && !t.completed);
        activeDescEl.textContent = active ? active.description : "";
    }

    function openForm({ task } = {})
    {
        formEl.classList.remove("hidden");
        formEl.setAttribute("aria-hidden", "false");

        editingTaskId = task?.id ?? null;
        textareaEl.value = task?.description ?? "";
        textareaEl.focus();
    }

    function closeForm()
    {
        formEl.classList.add("hidden");
        formEl.setAttribute("aria-hidden", "true");
        textareaEl.value = "";
        editingTaskId = null;
    }

    function commit()
    {
        // se a ativa sumiu ou foi concluída, limpa
        if (activeTaskId && !tasks.some(t => t.id === activeTaskId && !t.completed))
        {
            setActive(null);
        }

        renderTaskList(listEl, tasks, activeTaskId);
        saveState({ tasks, activeTaskId });
    }

    // --- eventos

    addBtn.addEventListener("click", () => openForm());

    cancelBtn.addEventListener("click", closeForm);

    deleteBtn.addEventListener("click", () =>
    {
        if (!editingTaskId) return closeForm();

        tasks = tasks.filter(t => t.id !== editingTaskId);
        if (activeTaskId === editingTaskId) setActive(null);

        closeForm();
        commit();
    });

    formEl.addEventListener("submit", (e) =>
    {
        e.preventDefault();
        const description = textareaEl.value.trim();
        if (!description) return;

        if (editingTaskId)
        {
            tasks = tasks.map(t =>
                t.id === editingTaskId ? { ...t, description, updatedAt: Date.now() } : t
            );
            if (activeTaskId === editingTaskId) setActive(activeTaskId);
        } else
        {
            const task = createTask(description);
            tasks.push(task);
            setActive(task.id);
        }

        closeForm();
        commit();
    });

    listEl.addEventListener("click", (e) =>
    {
        const li = e.target.closest(".app__section-task-list-item");
        if (!li) return;

        const taskId = li.dataset.taskId;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const action = e.target.closest("[data-action]")?.dataset.action;

        if (action === "edit")
        {
            if (task.completed) return;
            setActive(task.id);
            openForm({ task });
            commit(); // atualiza disabled do edit
            return;
        }

        if (action === "toggle-complete")
        {
            tasks = tasks.map(t =>
                t.id === task.id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
            );
            commit();
            return;
        }

        // clique “normal”: ativa a tarefa (se não concluída)
        if (!task.completed)
        {
            setActive(task.id);
            commit();
        }
    });

    removeDoneBtn.addEventListener("click", () =>
    {
        tasks = tasks.filter(t => !t.completed);
        closeForm();
        commit();
    });

    removeAllBtn.addEventListener("click", () =>
    {
        tasks = [];
        setActive(null);
        closeForm();
        commit();
    });

    document.addEventListener('FocoFinalizado', () =>
    {
        if (!activeTaskId) return;

        tasks = tasks.map(task =>
        {
            task.id === activeTaskId ? { ...task, completed: true, updatedAt: Date.now() } : task;
        });
    });

    // init
    setActive(activeTaskId);
    commit();
}
