window.__DECK__ = {
  "title": "Working with AI",
  "ratio": "16:9",
  "theme": "corporate-navy",
  "slides": [
    {
      "layout": "title",
      "eyebrow": "A practical guide",
      "heading": "Working with AI",
      "subhead": "What it is, why it behaves the way it does, and how to get real work out of it.",
      "notes": "This isn't a tech talk. By the end you'll have a working mental model and a\nhandful of habits you can use tomorrow. One promise: it drafts, you decide.\n"
    },
    {
      "layout": "statement",
      "text": "Think of it as a <span class=\"accent\">brilliant new colleague</span> on their permanent first day.",
      "notes": "Vast knowledge, desperate to help — and zero memory of you. Every conversation\nis day one. Your job is to write the onboarding note that makes day one productive.\nHold this picture; everything else hangs off it.\n"
    },
    {
      "layout": "content",
      "heading": "The one mental model",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Knows a lot",
              "body": "Read a huge slice of everything ever written. Broad, fluent, fast."
            },
            {
              "title": "Remembers nothing",
              "body": "No memory of you between chats. Each conversation starts from zero."
            },
            {
              "title": "Eager to help",
              "body": "It will always answer — even when it shouldn't. Confidence ≠ correctness."
            }
          ]
        }
      ],
      "notes": "Three traits explain almost every quirk you'll hit. The amnesia is the big one —\nit's why context (what you tell it up front) matters more than clever wording.\n"
    },
    {
      "layout": "section",
      "kicker": "Part one",
      "heading": "What you're actually talking to",
      "subhead": "No maths. Just enough of the machine to use it well."
    },
    {
      "layout": "split",
      "mediaSide": "right",
      "text": {
        "heading": "It predicts the next word",
        "body": "An LLM is a program that guesses the most likely next word, over and over, until it has written a full response. It isn't looking anything up — it has absorbed the patterns of how language works and is completing your sentence.\n"
      },
      "media": {
        "component": "chart",
        "type": "bar",
        "title": "“The client's policy expires on…”",
        "sub": "Illustrative — likelihood of the next word.",
        "labels": [
          "June",
          "the",
          "renewal",
          "30th",
          "Friday"
        ],
        "data": [
          58,
          21,
          11,
          7,
          3
        ],
        "seriesLabel": "Likelihood"
      },
      "notes": "Demystify it: no database lookup, no reasoning engine in the human sense — a\nvery good next-word guess, repeated. Everything good and bad follows from that.\n"
    },
    {
      "layout": "content",
      "heading": "How it's built — three stages, then frozen",
      "blocks": [
        {
          "type": "flow",
          "steps": [
            {
              "title": "1 · Pretraining",
              "body": "Reads a vast slice of the internet, drilling one game a trillion times: guess the next word."
            },
            {
              "title": "2 · Fine-tuning",
              "body": "Shown good examples of following instructions, so it answers rather than rambles."
            },
            {
              "title": "3 · Feedback (RLHF)",
              "body": "Shaped by human thumbs-up / thumbs-down until it's helpful and safe."
            }
          ]
        },
        {
          "type": "callout",
          "title": "Then the knowledge freezes",
          "body": "Everything it learned is locked into billions of numbers called weights. It knows nothing about your company, or anything after its training cut-off — unless you tell it.\n"
        }
      ],
      "notes": "The \"frozen\" point sets up two later ideas: hallucination (it fills gaps) and\nRAG (how we feed it fresh, private knowledge).\n"
    },
    {
      "layout": "content",
      "heading": "How it reads, and how it writes",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "It reads in tokens",
              "body": "Your text is chopped into little pieces — roughly ¾ of a word each — and turned into numbers. It never sees words."
            },
            {
              "title": "It weighs what matters",
              "body": "Attention lets every word look at every other word, so “the client” links to the name three paragraphs up."
            },
            {
              "title": "It writes one token at a time",
              "body": "Like a jazz musician playing the next note — guided by everything so far, never seeing the ending."
            }
          ]
        }
      ],
      "notes": "Keep this light. The takeaway: it works left-to-right, in pieces, weighing\nrelevance as it goes. That's why clear, well-ordered prompts help so much.\n"
    },
    {
      "layout": "section",
      "kicker": "Part two",
      "heading": "Where it breaks",
      "subhead": "Two limits that explain most of the frustration."
    },
    {
      "layout": "split",
      "mediaSide": "left",
      "text": {
        "heading": "It has a working memory — and a limit",
        "body": "The context window is everything the model can see at once: your prompt, the documents you pasted, and the conversation so far. Go past the limit and the earliest things simply stop existing for it. Long chats drift for a reason.\n"
      },
      "media": {
        "component": "donut",
        "title": "What fills the window",
        "sub": "Illustrative.",
        "segments": [
          {
            "label": "Your documents",
            "value": 55
          },
          {
            "label": "Conversation so far",
            "value": 30
          },
          {
            "label": "Your question",
            "value": 15
          }
        ]
      },
      "notes": "Practical tip: start a fresh chat for a new task; don't let a 40-message thread\ncarry stale context. Paste what matters, not everything.\n"
    },
    {
      "layout": "content",
      "heading": "Why it makes things up",
      "blocks": [
        {
          "type": "callout",
          "title": "It knows what's likely, not what's true",
          "body": "When it lacks the facts, it doesn't stop — it generates the most plausible-sounding completion. Plausible is not the same as correct. This is called a hallucination, and a confident tone is no guarantee of accuracy.\n"
        },
        {
          "type": "list",
          "items": [
            "Most likely when: facts are niche, recent, or specific (names, numbers, citations).",
            "Defend yourself: ask for sources, give it the facts, and verify anything that matters.",
            "The rule of thumb: it drafts, you decide."
          ]
        }
      ],
      "notes": "This is the single most important safety point. Don't outsource judgement —\noutsource the first draft. Verify names, numbers, quotes, and law.\n"
    },
    {
      "layout": "section",
      "kicker": "Part three",
      "heading": "Working with it well",
      "subhead": "The habits that separate a toy from a tool."
    },
    {
      "layout": "statement",
      "text": "A good prompt <span class=\"accent\">reduces ambiguity</span>. The less it has to guess, the better the output.",
      "notes": "Everything in this section is a variation on this one idea. You're not casting\nspells — you're briefing a capable colleague who can't read your mind.\n"
    },
    {
      "layout": "content",
      "heading": "The biggest unlock — a base layer",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Write it once",
              "body": "A short note: who you are, your role, your team, your clients, and how you like to work."
            },
            {
              "title": "Paste it up front",
              "body": "Start important chats with it. Now the model “knows” you instead of guessing."
            },
            {
              "title": "Everything gets better",
              "body": "Every later prompt can be short — the context is already there. This fixes the amnesia."
            }
          ]
        }
      ],
      "notes": "If people take one action away, it's this. A base layer turns generic answers\ninto ones that sound like they came from inside your team. We'll build one live.\n"
    },
    {
      "layout": "compare",
      "heading": "The same question, three ways",
      "left": {
        "title": "Raw / dump",
        "items": [
          "Raw: “Write an email chasing a client.” → generic, could be anyone.",
          "Dump: paste five documents with no steer → messy, buries the point.",
          "The model fills the gaps with averages."
        ]
      },
      "right": {
        "title": "Distilled",
        "items": [
          "“Here's the situation, here's what matters, here's what I need.”",
          "Give it a recipe, not just ingredients.",
          "Professional, on-voice, usable first time."
        ]
      },
      "notes": "Distilled beats a document dump. Curating what you feed it is the skill —\nrelevance in, relevance out.\n"
    },
    {
      "layout": "content",
      "heading": "The prompt blueprint — six questions, 30 seconds",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Role",
              "body": "Who should it be? “You're a senior claims handler…”"
            },
            {
              "title": "Task",
              "body": "What exactly do you want done?"
            },
            {
              "title": "Context",
              "body": "What does it need to know? (Your base layer + this situation.)"
            },
            {
              "title": "Format",
              "body": "Email? Table? Bullet points? How long?"
            },
            {
              "title": "Tone",
              "body": "Formal, plain, warm? For which audience?"
            },
            {
              "title": "Guardrails",
              "body": "What to avoid, check, or leave to you."
            }
          ]
        }
      ],
      "notes": "Not a template to fill in — a thinking habit. Run it in your head before typing\nanything important. Templates go stale; thinking adapts.\n"
    },
    {
      "layout": "content",
      "heading": "A few power-user moves",
      "blocks": [
        {
          "type": "list",
          "items": [
            "Ask it to show its working — “think step by step” improves reasoning on hard tasks.",
            "Give an example of a good answer; it matches the pattern.",
            "Ask for options, then decide — “give me three approaches and the trade-offs.”",
            "Iterate out loud — “that's close; make it shorter and drop the jargon.”"
          ]
        }
      ],
      "notes": "Most advanced technique is just telling it HOW to think, not only WHAT to\nproduce. Treat it as a conversation, not a slot machine.\n"
    },
    {
      "layout": "section",
      "kicker": "Part four",
      "heading": "In the real world",
      "subhead": "Where the model gets its hands on your actual work."
    },
    {
      "layout": "visual",
      "component": "sankey",
      "props": {
        "title": "What actually reaches the model",
        "sub": "Everything the answer is built from must fit the context window.",
        "nodes": [
          "Your prompt",
          "Base layer",
          "App context",
          "Retrieved docs",
          "Context window",
          "Answer"
        ],
        "links": [
          {
            "source": "Your prompt",
            "target": "Context window",
            "value": 20
          },
          {
            "source": "Base layer",
            "target": "Context window",
            "value": 25
          },
          {
            "source": "App context",
            "target": "Context window",
            "value": 25
          },
          {
            "source": "Retrieved docs",
            "target": "Context window",
            "value": 30
          },
          {
            "source": "Context window",
            "target": "Answer",
            "value": 100
          }
        ]
      },
      "notes": "This ties the whole deck together: the answer is only ever as good as what\nreaches the window. Base layer, the app you're in, and retrieval all feed it.\n"
    },
    {
      "layout": "compare",
      "heading": "Copilot in your apps vs the standalone chat",
      "left": {
        "title": "Standalone chat",
        "items": [
          "A stranger — knows nothing about the work in front of you.",
          "You explain everything from scratch every time."
        ]
      },
      "right": {
        "title": "Copilot inside Excel / Word / Outlook",
        "items": [
          "Already sees your spreadsheet, document, or email thread.",
          "That built-in context is a base layer you got for free."
        ]
      },
      "notes": "Why in-app Copilot often feels smarter: it starts with context. Use the tool\nthat already sits closest to your data.\n"
    },
    {
      "layout": "content",
      "heading": "Not all AI is the same — pick the right club",
      "blocks": [
        {
          "type": "table",
          "columns": [
            "If you need…",
            "Reach for",
            "Why"
          ],
          "rows": [
            [
              "A fast, cheap everyday answer",
              "A smaller / faster model",
              "Quick drafts, summaries, reformatting"
            ],
            [
              "Careful reasoning on something hard",
              "A frontier “thinking” model",
              "Analysis, tricky logic, high stakes"
            ],
            [
              "Work grounded in your files",
              "Copilot / a RAG tool",
              "It retrieves your data before answering"
            ],
            [
              "Action, not just words",
              "An agent",
              "It carries out multi-step tasks"
            ]
          ]
        }
      ],
      "notes": "Golf bag, not one club. Matching the model to the job is a genuine skill and\nsaves both money and rework.\n"
    },
    {
      "layout": "content",
      "heading": "Two ways it reaches beyond its training",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "RAG — the open-book exam",
              "body": "It retrieves relevant company documents first, then answers using them as context. This is how it “knows” your data."
            },
            {
              "title": "Agents — a brain with hands",
              "body": "It doesn't just reply; it takes an action, checks the result, and loops until the task is done — then reports back."
            }
          ]
        },
        {
          "type": "callout",
          "title": "The catch",
          "body": "Both are only as good as the data they can reach. Most company knowledge lives in formats AI reads poorly — clean, well-structured sources win.\n"
        }
      ],
      "notes": "RAG fixes the \"frozen knowledge\" problem from Part 1. Agents are where this is\nheading — supervised autonomy, with a human checking the dates.\n"
    },
    {
      "layout": "section",
      "kicker": "Part five",
      "heading": "Guardrails & where this is going",
      "subhead": "Use it responsibly; bet on the trajectory."
    },
    {
      "layout": "content",
      "heading": "Treat the prompt box like a public notice board",
      "blocks": [
        {
          "type": "callout",
          "title": "Assume anything you type could be stored, logged, or seen",
          "body": "A prompt creates a record that didn't exist before. In a breach, audit, or legal request, it may be discoverable — even if the tool promises privacy.\n"
        },
        {
          "type": "list",
          "items": [
            "Don't paste: client identifiers, personal data, credentials, anything under NDA.",
            "Do: anonymise, summarise, or use the approved enterprise tool for sensitive work.",
            "When in doubt, leave it out — or ask first."
          ]
        }
      ],
      "notes": "Keep this concrete and local — reference your own approved tools and data\npolicy here. Careless talk costs cases.\n"
    },
    {
      "layout": "split",
      "mediaSide": "right",
      "text": {
        "heading": "This is real, and it's accelerating",
        "body": "Not “robots replace everyone” — more like digital photography. The darkroom jobs faded; the people who understood the craft thrived and moved faster. The ones who learn to work with AI will outrun the ones waiting to see what happens.\n"
      },
      "media": {
        "component": "chart",
        "type": "line",
        "title": "Capability over time",
        "sub": "Illustrative — the trajectory, not a forecast.",
        "labels": [
          "2019",
          "2021",
          "2023",
          "2025",
          "2027"
        ],
        "data": [
          8,
          20,
          45,
          72,
          92
        ],
        "seriesLabel": "Capability"
      },
      "notes": "Aim for calm confidence, not hype or fear. The message: skill up now; the\nadvantage compounds.\n"
    },
    {
      "layout": "content",
      "heading": "Make it stick",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Build your base layer",
              "body": "15 minutes today. Reuse it everywhere. This is the highest-leverage thing you'll do."
            },
            {
              "title": "Pick two tasks",
              "body": "The ones that eat your week. Use AI for the first draft, automatically, starting tomorrow."
            },
            {
              "title": "Always verify",
              "body": "Names, numbers, quotes, law. It drafts; you're still the one who signs it off."
            }
          ]
        }
      ],
      "notes": "Don't try to use it for everything. Win two recurring tasks first; the habit\nspreads on its own once people see the time back.\n"
    },
    {
      "layout": "quote",
      "text": "It drafts. <span class=\"accent\">You decide.</span>",
      "cite": "The one rule that contains all the others.",
      "notes": "Land the plane here. If they remember one line, make it this. Second rule for\nthe road — before every task, ask: what KIND of problem is this?\n"
    }
  ]
};
