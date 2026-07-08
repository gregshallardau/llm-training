window.__DECK__ = {
  "title": "DeckKit — Framework Demo",
  "ratio": "16:9",
  "theme": "editorial",
  "slides": [
    {
      "layout": "title",
      "eyebrow": "DeckKit",
      "heading": "A presentation framework that just fits",
      "subhead": "Declarative decks · a guaranteed frame · themeable · offline.",
      "notes": "This whole deck is generated from a YAML config through the framework."
    },
    {
      "layout": "image",
      "src": "assets/hero.svg",
      "fit": "cover",
      "focal": "center 40%",
      "scrim": "bottom",
      "eyebrow": "Layout · image",
      "heading": "One picture can carry the slide",
      "body": "Full-bleed media with a legible scrim — declared, not hand-styled.",
      "notes": "The image layout is full-bleed; the scrim keeps overlaid text readable."
    },
    {
      "layout": "split",
      "mediaSide": "right",
      "text": {
        "heading": "Text and media, balanced",
        "body": "The split layout pairs a column of prose with any registered visual — an image here, a chart elsewhere. Both stay inside the frame."
      },
      "media": {
        "component": "image",
        "src": "assets/hero.svg",
        "fit": "cover",
        "focal": "center",
        "alt": "Abstract network"
      },
      "notes": "Split layout with an image component in the media cell."
    },
    {
      "layout": "content",
      "heading": "Built from components",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Layouts",
              "body": "A fixed vocabulary you choose from."
            },
            {
              "title": "Blocks",
              "body": "Cards",
              "tables": null,
              "callouts": null,
              "flows.": null
            },
            {
              "title": "Visuals",
              "body": "Native SVG charts and media."
            },
            {
              "title": "Themes",
              "body": "DTCG tokens — one swap to reskin."
            }
          ]
        }
      ],
      "notes": "Every slide is assembled from registered components."
    },
    {
      "layout": "compare",
      "heading": "Why a framework, not a template",
      "left": {
        "title": "Hand-built slides",
        "items": [
          "Bespoke CSS per slide",
          "Overflow surprises",
          "Reskin means rework",
          "One-off"
        ]
      },
      "right": {
        "title": "DeckKit",
        "items": [
          "Declare intent",
          "Guaranteed fit",
          "Reskin is a token swap",
          "Reusable"
        ]
      },
      "notes": "Separation of content, layout, theme and behaviour is the whole point."
    },
    {
      "layout": "visual",
      "component": "chart",
      "props": {
        "type": "bar",
        "title": "Guaranteed to fit, at any density",
        "sub": "Illustrative — content scales to the frame, never overflows.",
        "labels": [
          "Q1",
          "Q2",
          "Q3",
          "Q4",
          "Q5"
        ],
        "data": [
          12,
          28,
          41,
          64,
          92
        ],
        "seriesLabel": "Adoption"
      },
      "notes": "A native SVG chart, themed from tokens; it re-themes on toggle."
    },
    {
      "layout": "content",
      "heading": "One idea, three depths",
      "depths": {
        "simple": {
          "blocks": [
            {
              "type": "callout",
              "title": "Simple",
              "body": "Pick the audience level once and the whole deck follows."
            }
          ]
        },
        "detailed": {
          "blocks": [
            {
              "type": "callout",
              "title": "Detailed",
              "body": "Each slide can carry the same idea at simple, detailed or expert depth — switch live with 1 / 2 / 3."
            }
          ]
        },
        "expert": {
          "blocks": [
            {
              "type": "callout",
              "title": "Expert",
              "body": "Layered content is an accessible tablist (role=tab, aria-selected), global or per-slide, persisted across the session."
            }
          ]
        }
      },
      "notes": "Press 1 / 2 / 3 to change depth for the whole deck."
    },
    {
      "layout": "section",
      "kicker": "Part two",
      "heading": "The extended vocabulary",
      "subhead": "More layouts, blocks and visuals — all token-driven, all fit-guaranteed.",
      "notes": "A section divider layout."
    },
    {
      "layout": "content",
      "heading": "Numbers that land",
      "blocks": [
        {
          "type": "stats",
          "items": [
            {
              "value": "13+",
              "label": "Layouts & blocks"
            },
            {
              "value": "2",
              "label": "Brand themes"
            },
            {
              "value": "0",
              "label": "Overflowing slides"
            },
            {
              "value": "100%",
              "label": "Offline"
            }
          ]
        }
      ],
      "notes": "The stats block — big KPI numbers."
    },
    {
      "layout": "grid",
      "heading": "Grid of anything",
      "columns": 2,
      "blocks": [
        {
          "type": "callout",
          "title": "Compose freely",
          "body": "The grid layout arranges any blocks N-up."
        },
        {
          "type": "list",
          "items": [
            "Token-driven",
            "Accessible",
            "Fits the frame",
            "Reusable"
          ]
        }
      ],
      "notes": "Grid layout with a callout and a styled list."
    },
    {
      "layout": "content",
      "heading": "Code, highlighted",
      "blocks": [
        {
          "type": "code",
          "lang": "yaml",
          "code": "- layout: visual\n  component: donut\n  props:\n    segments:\n      - { label: Framework, value: 55 }\n      - { label: Content, value: 30 }\n"
        }
      ],
      "notes": "The code block, syntax-highlighted and theme-aware."
    },
    {
      "layout": "visual",
      "component": "donut",
      "props": {
        "title": "Where the effort goes",
        "sub": "Illustrative split.",
        "segments": [
          {
            "label": "Framework",
            "value": 55
          },
          {
            "label": "Content",
            "value": 30
          },
          {
            "label": "Theming",
            "value": 15
          }
        ]
      },
      "notes": "A native SVG donut, themed from tokens."
    },
    {
      "layout": "content",
      "heading": "How it came together",
      "blocks": [
        {
          "type": "timeline",
          "items": [
            {
              "title": "Principles",
              "body": "What it must do."
            },
            {
              "title": "Research",
              "body": "Adopt vs build",
              "unbiased.": null
            },
            {
              "title": "Design",
              "body": "Architecture + a proven fit layer."
            },
            {
              "title": "Build",
              "body": "This deck."
            }
          ]
        }
      ],
      "notes": "The timeline block."
    },
    {
      "layout": "statement",
      "text": "Click <span class=\"accent\">✦</span> to reskin the whole deck — same content, different brand.",
      "notes": "Statement layout. The ✦ control (top-left) switches brand theme (editorial ↔ corporate-navy)."
    },
    {
      "layout": "quote",
      "text": "Reliable like PowerPoint. <span class=\"accent\">Programmable</span> like the web.",
      "cite": "The point of the whole thing.",
      "notes": "Close."
    }
  ]
};
