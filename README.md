
# Fokus ⏱️

Aplicação web de produtividade inspirada na técnica **Pomodoro**, desenvolvida em JavaScript puro, com foco em **organização de código, modularidade e boas práticas**.

O projeto permite alternar entre ciclos de foco e descanso, tocar música ambiente, gerenciar tarefas com persistência em `localStorage` e concluir automaticamente a tarefa ativa ao final de um ciclo de foco.

---

## ✨ Funcionalidades

### ⏲️ Timer Pomodoro
- Modos:
  - **Foco** (25 min)
  - **Descanso curto** (5 min)
  - **Descanso longo** (15 min)
- Contagem regressiva com controle de iniciar / pausar
- Efeitos sonoros:
  - Play
  - Pause
  - Finalização do tempo

### 🎵 Música de foco
- Música ambiente em loop
- Controle por toggle
- Tratamento de autoplay bloqueado pelo navegador

### 📝 Gerenciamento de tarefas (CRUD)
- Criar tarefas
- Editar tarefas
- Selecionar tarefa ativa
- Marcar tarefas como concluídas
- Remover tarefas concluídas
- Remover todas as tarefas
- Persistência via `localStorage`

### 🔗 Integração Timer ↔ Tarefas
- Ao finalizar um **ciclo de foco**, a tarefa ativa é automaticamente marcada como concluída
- Comunicação desacoplada via **Custom Events** (`FocoFinalizado`)

---

## 🧠 Arquitetura

O projeto foi estruturado de forma modular, separando responsabilidades e evitando acoplamento excessivo.

```
src/js/
├── main.js                 # Ponto de entrada da aplicação
└── ui/
    ├── audio.js            # Música de foco
    ├── sound-effects.js    # Efeitos sonoros
    ├── timer.js            # Lógica do timer
    ├── context.js          # Alternância de contexto (foco / descanso)
    ├── dom.js              # Selectors e helpers de DOM
    └── tasks/
        ├── controller.js   # Regras e eventos das tarefas
        ├── render.js       # Renderização da lista de tarefas
        └── store.js        # Estado e persistência (localStorage)
```

### Padrões utilizados
- **Module Pattern (ESM)**
- **Event-driven architecture** (Custom Events)
- **Event Delegation**
- **Single Source of Truth**
- **Separação de responsabilidades**

---

## 📡 Custom Events

O projeto utiliza eventos customizados para comunicação entre módulos desacoplados.

Exemplo:
- O `timer` dispara o evento `FocoFinalizado`
- O módulo de tarefas escuta esse evento e conclui a tarefa ativa

Isso evita dependências diretas entre módulos e facilita a manutenção.

---

## 🚀 Como executar

1. Clone o repositório
2. Abra o projeto com um servidor local (ex: Live Server)
3. Acesse `index.html`

> ⚠️ O projeto utiliza ES Modules (`type="module"`), portanto não funciona abrindo o HTML diretamente no navegador.

---

## 📦 Tecnologias

- HTML5
- CSS3
- JavaScript (ES Modules)
- Web Audio API
- LocalStorage API

---

## 📚 Observações

Este projeto foi desenvolvido com fins educacionais, inspirado em aulas da **Alura**, mas evoluído com uma estrutura mais próxima de aplicações profissionais.

---

## 📄 Licença

Projeto fictício, sem fins comerciais.  
Imagens geradas por IA no Adobe Firefly.
