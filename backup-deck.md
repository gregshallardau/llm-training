# LLM Series — Backup Deck

*Fallback if the interactive deck can't run. The spine of every module: the hook, the core question, and the one thing to land. Present from this on any device.*

---

## Module 00: Think of It as a Brain
**🧠 The brilliant new colleague on their permanent first day:** vast knowledge, zero memory of you, desperate to help.

"The AI is built on human knowledge, so it works a lot like a brain — it reads in chunks, focuses on what matters, builds sentences one word at a time, and makes stuff up when it doesn't know. The biggest difference? It has amnesia. Every conversation is day one. Your job is to write the onboarding document that makes day one productive."…

---

## Module 01: What is an LLM?
**🧠 Predictive text / autocomplete:** your phone's next-word guess — but it read the whole internet.

*Core question:* "What am I actually talking to?"

**In one line:** An LLM is a program that predicts the most likely next word, over and over, until it's written a full response.

Imagine you had a friend who had read every book, every website, every email, every document ever written in English. You start a sentence, and they finish it — not by copying something they read, but by having absorbed the *patterns* of how language works.…

---

## Module 01b: How an LLM Is Trained
**🧠 Raising and schooling a person:** it *reads the whole library* (pretraining), does *an apprenticeship* (fine-tuning), then *learns manners from feedback* (RLHF). Three stages, same as bringing up a bright kid.

*Core question:* "Where does it get its knowledge?"

**In one line:** An LLM is built in three stages: first it reads a vast chunk of the internet and drills one skill — *predict the next word* (**pretraining**); then it's shown examples of following instructions (**fine-tuning**); then it's shaped by human thumbs-up / thumbs-down until it's helpful and safe (**RLHF**). By the end, everything it "knows" is frozen into billions of numbers called **weights** — and the

Imagine locking a brilliant, fast reader in the world's biggest library and giving them one game, played a trillion times: *cover the next word and guess it.*…

---

## Module 02: Tokenisation
**🧠 Arcade tokens:** the machine only runs on tokens; text is chopped into little coins to feed it.

*Core question:* "How does it read my words?"

**In one line:** Before an LLM can do anything with your text, it chops it into small pieces called **tokens** — roughly ¾ of a word each — and converts each piece into a number. The model never sees words. It sees numbers.

You type: "The client's property insurance policy expires on June 30, 2026."…

---

## Module 03: The Attention Mechanism
**🧠 A DJ's mixing desk:** sliders deciding how *loud* each word is in the mix.

*Core question:* "How does it decide what matters?"

**In one line:** The attention mechanism lets every word in your prompt "look at" every other word to figure out which ones are relevant to each other — so when the model is writing about "the client's liability exposure," it knows to pay attention to the claims history you mentioned three paragraphs ago.

Imagine you're reading a long client file. Your eyes don't read every word with equal focus. When you see "claims history," your brain automatically jumps back to the claims table you saw earlier. When you see "the client," your brain links it to the name at the top of the document.…

---

## Module 04: Context Windows
**🧠 Dory (Finding Nemo):** limited working memory — overflow the fishbowl and the early stuff is forgotten.

*Core question:* "How much can it hold in its head?"

**In one line:** The context window is the model's working memory — the total amount of text it can "see" at once. Everything beyond that limit doesn't exist to the model.

Imagine you're writing a report, but you can only see one page of notes at a time. If all the information you need fits on that page, you'll write a great report. If the information is spread across 50 pages and you can only see one, you'll miss things.…

---

## Module 04b: The Plumbing
**🧠 Mario's warp pipes:** the pipes under the floor, moving data from place to place.

*Core question:* "Why can't AI just read my files?"

**In one line:** AI is only as good as the data you feed it — and most company data lives in formats that AI reads poorly, if at all.

AI reads plain text the way you read a clean printed page — quickly, accurately, no friction.…

---

## Module 05: How Generation Works
**🧠 A jazz improviser:** making up the next note one at a time, guided by what came before — never seeing the ending.

*Core question:* "How does it write its answers?"

**In one line:** The model writes one token at a time, each time asking "given everything I've seen so far (your prompt + what I've written so far), what's the most likely next word?" — and then it picks one and repeats.

When Copilot writes a response, it's not pulling a pre-written answer from a database. It's building the response one word at a time, like this:…

---

## Module 06: Hallucinations & Limitations
**🧠 Ron Burgundy (Anchorman):** reads *anything* on the autocue with total confidence — fluently, cheerfully wrong.

*Core question:* "Why does it make stuff up?"

**In one line:** The model doesn't know what's true — it knows what's *likely*. When it doesn't have enough information, it generates the most plausible-sounding completion, and plausible-sounding is not the same as correct.

Remember from Module 01: the model predicts the next word based on patterns. It has never verified a fact, checked a database, or confirmed anything with anyone. It's pattern-matching on language.…

---

## Module 07: Prompt Fundamentals
**🧠 The Genie / three wishes:** you get what you *literally* ask for — word it carefully, mind the monkey's paw.

*Core question:* "What makes a good prompt?"

**In one line:** A good prompt reduces ambiguity. The less the model has to guess, the better the output.

Think about how you'd give instructions to a brilliant new person on their first day.…

---

## Module 08: The Base Layer — Teaching the AI Who You Are
**🧠 The new-starter induction handbook:** the standing rules you hand your colleague on day one, before any task.

*Core question:* "How do I stop starting from scratch every time?"

**In one line:** Write a document about yourself — who you are, what you do, who your team is, who your clients are, and how you work — and give it to the AI at the start of every conversation. That one document transforms everything.

"You write a cheat sheet about yourself and paste it at the top of every conversation. The AI now 'knows' you — your role, your team, your clients, your standards. Every prompt after that is a simple task, and the AI fills in the context from the cheat sheet."…

---

## Module 09: The Three Context Levels
**🧠 Shrek's onion:** 'ogres have layers' — and so does context; it stacks in levels.

*Core question:* "What's the difference between raw, dump, and distilled?"

**In one line:** The same question produces dramatically different results depending on how much — and how well — you tell the model about your situation. Raw gets you generic. Document dump gets you messy. Distilled gets you professional.

"You didn't just give it ingredients — you gave it a recipe. 'Here's the situation, here's what matters, here's what I need.' The AI just follows the recipe."…

---

## Module 10: The Prompt Blueprint
**🧠 A pilot's pre-flight checklist:** the same questions, run every single time before takeoff.

*Core question:* "How do I think about prompts — not templates, but thinking?"

**In one line:** The Prompt Blueprint isn't a template to fill in — it's a thinking habit. Six questions you run through in your head before typing anything important. It takes 30 seconds and becomes automatic.

"Templates give you a form to fill in. The Blueprint gives you a way to think. Forms get stale. Thinking adapts to any situation. Learn the six questions, and you'll never need a template — you'll just naturally write good prompts."…

---

## Module 11: Advanced Prompting Techniques
**🧠 The black belt:** you've drilled the basics — now the advanced forms.

*Core question:* "What are the power-user tricks?"

**In one line:** Beyond the basics, there are specific techniques that unlock dramatically better reasoning, consistency, and output quality — and most of them are just ways of telling the model HOW to think, not just WHAT to produce.

Instead of asking for the answer, ask the model to show its working. Just like at school — "show your steps."…

---

## Module 12: The Base Layer Workshop
**🧠 The frame of a house:** nothing else stands without it; you build it first.

*Core question:* "Let's build one — right now."

**In one line:** Stop reading about it. Open a blank document. We're building your base layer in the next 15 minutes.

"You wrote a cheat sheet about yourself. Now the AI knows you. Every conversation starts from a good place instead of from zero."…

---

## Module 13: Privacy, Ethics & What Not To Share
**🧠 The wartime 'careless talk costs lives' poster:** mind what you feed it — not everything stays private.

*Core question:* "What should I never put in a prompt?"

**In one line:** Anything you type into an AI tool may be stored, logged, or used for training. Treat the prompt box like a public notice board — don't put anything on it you wouldn't want seen.

When you type something into Copilot or the company GPT, that text goes to a server somewhere. Even if the company promises it's private, you're creating a record that didn't exist before. If there's ever a data breach, a legal discovery request, or an audit — those prompts and responses may be discoverable.…

---

## Module 14: Making It Stick
**🧠 Batman's utility belt:** your personal kit of go-to tools, always on your hip.

*Core question:* "How do I make this part of my daily routine?"

**In one line:** The goal isn't to use AI for everything — it's to use it automatically for the tasks where it saves you the most time, starting tomorrow.

---

## Module 15: Copilot in Context — Excel, Word, Outlook
**🧠 The co-pilot in the cockpit:** autopilot flies, but a human watches the instruments and can grab the yoke.

*Core question:* "Why does Copilot work better inside my apps than in the chat?"

**In one line:** When you use Copilot inside Excel, Word, or Outlook, it already HAS context — your spreadsheet, your document, your email thread. That's a built-in base layer. The standalone Copilot chat has nothing. That's the difference.

"When Copilot is inside Excel, it can already see your spreadsheet. That's like having a colleague who's already read your data. In the standalone chat, it's a stranger — you'd have to explain everything from scratch."…

---

## Module 16: Model Choices — Not All AI Is the Same
**🧠 A golf bag of clubs:** driver for distance, putter for precision — pick the right one for the shot.

*Core question:* "What's the difference between GPT, Claude, Copilot, and all these models?"

**In one line:** Different AI models are like different colleagues — some are fast and cheap, some are deep thinkers, some are specialists. Knowing which one to use for which task is a real skill.

Think of it like cars. A Toyota Corolla and a Tesla and a truck all have engines and wheels, but they're built for different things. The Corolla is reliable and cheap. The Tesla is fast and smooth. The truck carries heavy loads.…

---

## Module 17: RAG & Search — When the AI Needs to Look Things Up
**🧠 The open-book exam:** closed book = memory only; open book = you may bring your notes.

*Core question:* "How does the AI know about MY company's data?"

**In one line:** The model's knowledge is frozen at its training cutoff — it knows nothing about your company, your documents, or anything that happened after training ended. RAG (Retrieval-Augmented Generation) fixes this by retrieving relevant information first, then handing it to the model as context before it answers.

Imagine you've hired a brilliant new analyst. They're smart, great at writing, excellent at summarising — but they've never worked at your company before. They don't know your systems, your clients, your internal processes.…

---

## Module 18: Agents and Automation — When AI Does Things, Not Just Talks
**🧠 R2-D2:** rolls off on its own, *does* the task, comes back — a brain with hands.

*Core question:* "Can AI actually DO things, or does it just write text?"

**In one line:** An AI agent is a model that doesn't just respond — it takes actions, checks the results, and takes more actions, looping until a task is done.

Think of a very capable assistant. When you ask them to "organise the travel for the offsite," they don't come back to you with a list of options and wait for you to make each decision. They book flights, reserve accommodation, send calendar invites, and email the team — then they put a summary on your desk and say "here's what I did, just check the dates." That's an agent. The AI version does the same thing, except the tools it calls are web sea…

---

## Module 19: The Future & Trajectory — Where Is This All Going?
**🧠 The DeLorean (Back to the Future):** where we're going — and how fast the road is changing.

*Core question:* "Is this just hype, or is my job about to change?"

**In one line:** This is real, it is accelerating, and it will change how you work — but not in the "robots replace everyone" way, and the people who thrive will be the ones who learned to work with it rather than wait to see what happens.

Think about what happened to photography when digital cameras arrived. Professional photographers did not disappear — but the job changed completely. The darkroom technicians whose whole job was developing film largely did disappear. The photographers who could compose a great shot, understand light, build a relationship with a subject — they are still in high demand.…

---

## Practical Copilot Lab
**🧠 Your sat-nav:** it holds the whole route and gives you one turn at a time — it directs, you drive.

---

## Thinking Like a Power User

---

## The two rules to close on
**It drafts. You decide.** · Ask *what KIND of problem is this?*