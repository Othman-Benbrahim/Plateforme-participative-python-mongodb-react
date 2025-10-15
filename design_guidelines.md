{
  "brand": {
    "name": "Idées Ensemble",
    "tone": ["collaboratif", "confiant", "moderne", "civique"],
    "voice_examples_fr": {
      "cta_propose": "Proposer une idée",
      "cta_vote": "Voter",
      "stats_title": "La communauté en chiffres",
      "comments": "Commentaires",
      "filters": "Filtres",
      "sort_by": "Trier par",
      "tags": "Tags"
    }
  },
  "app_type": "Plateforme participative d'idées (soumission, votes, commentaires, statistiques)",
  "audience": ["citoyens", "collègues", "associations", "collectivités locales"],
  "success_actions": ["soumettre une idée", "voter (up/down)", "commenter", "filtrer/chercher", "consulter les statistiques"],

  "color_system": {
    "style": "clair, doux, contrasté, sans violet",
    "tokens_hex": {
      "background": "#F8FAFC",
      "foreground": "#0F172A",
      "card": "#FFFFFF",
      "muted": "#EEF2F6",
      "border": "#E5E7EB",
      "ring": "#2A7FD4",

      "primary": "#2A7FD4",          
      "primary-foreground": "#FFFFFF",
      "secondary": "#E6F6F2",        
      "secondary-foreground": "#0F172A",
      "accent": "#FDF2E9",           
      "accent-foreground": "#7A4A23",

      "success": "#2F9E82",
      "warning": "#F7B23B",
      "destructive": "#E24D4D",

      "vote-up": "#2F9E82",
      "vote-down": "#E24D4D",
      "tag-blue": "#DCEBFF",
      "tag-green": "#DDF7EF",
      "tag-orange": "#FFF0E1",
      "tag-gray": "#F1F5F9"
    },
    "gradients": {
      "hero_breeze": ["#EAF3FF", "#E6F6F2", "#FFF5E9"],
      "usage": "Uniquement fond de section (héros/accents). Jamais sur zones de lecture. Max 20% viewport. Si >20% ou lisibilité impactée => repasser en couleur unie."
    },
    "tailwind_css_vars_snippet": 
      ":root{--background:0 0% 98%;--foreground:222 47% 11%;--card:0 0% 100%;--muted:210 25% 96%;--border:214 32% 91%;--ring:213 66% 50%;--primary:213 66% 50%;--primary-foreground:0 0% 100%;--secondary:162 52% 92%;--secondary-foreground:222 47% 11%;--accent:28 89% 94%;--accent-foreground:26 55% 31%;--success:158 55% 40%;--warning:39 93% 60%;--destructive:0 74% 60%;--vote-up:158 55% 40%;--vote-down:0 74% 60%;--radius:0.625rem;}"
  },

  "typography": {
    "fonts": {
      "heading": "Space Grotesk",
      "body": "Karla"
    },
    "google_fonts_import": "<link href=\"https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap\" rel=\"stylesheet\">",
    "usage": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold",
      "h2": "text-base md:text-lg font-semibold text-slate-800",
      "body": "text-sm md:text-base text-slate-700 leading-7",
      "small": "text-xs text-slate-500"
    },
    "letter_spacing": {"tight": "-0.01em", "normal": "0"}
  },

  "layout_grid": {
    "container": "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8",
    "grid": {
      "mobile": "single column w/ stacked cards",
      "md": "8-col grid (gap-6)",
      "lg": "12-col grid (gap-8)"
    },
    "cards": {
      "radius": "rounded-lg",
      "shadow": "shadow-[0_1px_0_rgba(16,24,40,0.05),0_6px_20px_-6px_rgba(16,24,40,0.12)]",
      "padding": "p-4 md:p-6 lg:p-8"
    },
    "sections_spacing": "py-10 md:py-14 lg:py-20",
    "nav_height": 64
  },

  "navigation": {
    "header": "Top bar clair collant avec ombre subtile et séparateur",
    "components": ["navigation-menu", "dropdown-menu", "sheet (mobile)", "command (recherche rapide)"]
  },

  "pages": {
    "home": {
      "layout": "Héros split (gauche: titre/CTA, droite: compteur/statistiques). Bento grid de 4-6 cartes: idées en vedette, catégories, appels à participer.",
      "hero_style": "background: linéaire doux (hero_breeze) + légère texture grain; texte sombre sur fond clair.",
      "primary_cta": "Proposer une idée",
      "secondary_cta": "Parcourir les idées"
    },
    "ideas_list": {
      "layout": "Filtres au-dessus sur mobile, en colonne latérale sur ≥md; grille de cartes 1/2/3 colonnes.",
      "controls": ["search (command)", "tags (select/badge)", "tri (select)", "pagination"],
      "card": "Titre, description courte, tags, compteur votes, boutons up/down, compteur commentaires"
    },
    "idea_detail": {
      "layout": "Colonne principale (contenu + vote sticky sur md+), colonne latérale pour tags et auteur.",
      "comments": "fil de commentaires hiérarchiques avec tri et éditeur léger"
    },
    "new_idea_form": {
      "fields": ["titre", "description", "tags (sélection multiple)", "pièce jointe (optionnel)"],
      "validation": "titre min 6, description min 40",
      "success_feedback": "toast sonner + redirection"
    },
    "auth": {
      "forms": ["connexion", "inscription"],
      "layout": "Carte centrée verticale avec illustration discrète, pas de gradient lourd"
    }
  },

  "component_path": {
    "Button": "./components/ui/button",
    "Card": "./components/ui/card",
    "Badge": "./components/ui/badge",
    "Tabs": "./components/ui/tabs",
    "Select": "./components/ui/select",
    "Input": "./components/ui/input",
    "Textarea": "./components/ui/textarea",
    "Dialog": "./components/ui/dialog",
    "AlertDialog": "./components/ui/alert-dialog",
    "Tooltip": "./components/ui/tooltip",
    "Pagination": "./components/ui/pagination",
    "Sheet": "./components/ui/sheet",
    "NavigationMenu": "./components/ui/navigation-menu",
    "Command": "./components/ui/command",
    "Separator": "./components/ui/separator",
    "ScrollArea": "./components/ui/scroll-area",
    "Skeleton": "./components/ui/skeleton",
    "Toaster": "./components/ui/sonner"
  },

  "components_spec": {
    "buttons": {
      "shape": "Professionnel / Corporate (rayon 8px)",
      "sizes": {"sm": "h-9 px-3 text-sm", "md": "h-10 px-4 text-sm", "lg": "h-12 px-5 text-base"},
      "primary": "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[color-mix(in_hsl, hsl(var(--primary)) 85%, white)] focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
      "secondary": "bg-[hsl(var(--secondary))] text-slate-800 hover:bg-slate-100",
      "ghost": "bg-transparent text-slate-700 hover:bg-slate-100",
      "vote_up": "bg-[hsl(var(--vote-up))] text-white hover:brightness-110",
      "vote_down": "bg-[hsl(var(--vote-down))] text-white hover:brightness-110",
      "micro": "transition-colors duration-200 ease-out motion-reduce:transition-none"
    },
    "idea_card": {
      "layout": "Card > Header (titre + tags) + Content (extrait) + Footer (vote + commentaires)",
      "states": ["hover: anneau léger", "selected: ombre accrue"],
      "testids": [
        "idea-card",
        "idea-card-title",
        "idea-card-tags",
        "idea-card-vote-count",
        "idea-card-upvote-button",
        "idea-card-downvote-button",
        "idea-card-comment-count"
      ]
    },
    "filters_bar": {
      "composition": ["Input (recherche)", "Select (trier par)", "Badge/Checkbox (tags)", "Tabs (catégories)"]
    },
    "comment_item": {
      "states": ["auteur", "modérateur", "propriétaire"],
      "testids": ["comment-item", "comment-like-button", "comment-reply-button"]
    },
    "stats_widgets": {
      "types": ["mini-card KPI", "bar chart", "area chart"],
      "palette": ["--chart-1", "--chart-2", "--chart-3"]
    }
  },

  "micro_interactions": {
    "rules": [
      "Pas de transition: all",
      "Utiliser transition-colors/opacity/box-shadow uniquement",
      "Boutons: scale-98 au clic (whileTap)",
      "Cards: légère translation Y sur hover"
    ],
    "parallax_hero": "Utiliser background-position et transform pour image décorative (ou Framer Motion) – amplitude < 16px"
  },

  "charts": {
    "library": "Recharts",
    "install": "npm i recharts",
    "mini_example_jsx": "import { Card, CardContent, CardHeader } from './components/ui/card';\nimport { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';\nexport function StatsBar({ data }) {\n  return (\n    <Card data-testid=\"stats-bar-card\">\n      <CardHeader className=\"pb-2\">Participation (7 derniers jours)</CardHeader>\n      <CardContent className=\"h-48\">\n        <ResponsiveContainer width=\"100%\" height=\"100%\">\n          <BarChart data={data}>\n            <XAxis dataKey=\"name\" tickLine={false} />\n            <Tooltip cursor={{fill:'#EEF2F6'}} />\n            <Bar dataKey=\"votes\" fill=\"hsl(var(--chart-2))\" radius={[6,6,0,0]} />\n          </BarChart>\n        </ResponsiveContainer>\n      </CardContent>\n    </Card>\n  );\n}"
  },

  "images_urls": [
    {
      "category": "hero",
      "description": "Atelier d'idéation avec post-it (diversité)",
      "url": "https://images.unsplash.com/photo-1623652554515-91c833e3080e?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "section_community",
      "description": "Tableau blanc avec idées classées",
      "url": "https://images.unsplash.com/photo-1676276383599-478e31770aac?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "empty_state",
      "description": "Atelier collaboratif en salle lumineuse",
      "url": "https://images.pexels.com/photos/7793174/pexels-photo-7793174.jpeg"
    }
  ],

  "textures": {
    "noise_css": ".noise-overlay{position:absolute;inset:0;pointer-events:none;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'.8\\' numOctaves=\\'2\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'.025\\' /></svg>');}",
    "apply": "Placer dans le héros ou bandes décoratives, pas sur cartes/contenu"
  },

  "i18n_fr": {
    "filters": {"search": "Rechercher des idées", "sort": "Trier par", "tags": "Tags"},
    "sort_options": ["Plus votées", "Récentes", "Actives"],
    "actions": {"propose": "Proposer une idée", "vote": "Voter", "comment": "Commenter"}
  },

  "accessibility": {
    "contrast": "Respect WCAG AA pour texte et contrôles",
    "focus": "Anneau visible: focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
    "hit_areas": ">=44x44px pour boutons de vote",
    "reduced_motion": "Respect prefers-reduced-motion (désactiver animations non essentielles)"
  },

  "testing": {
    "data_testid_rule": "kebab-case décrivant le rôle fonctionnel (pas l'apparence)",
    "examples": [
      "data-testid=\"header-propose-idea-button\"",
      "data-testid=\"ideas-filter-search-input\"",
      "data-testid=\"ideas-sort-select\"",
      "data-testid=\"idea-card-upvote-button\"",
      "data-testid=\"idea-detail-comment-submit-button\"",
      "data-testid=\"stats-bar-card\""
    ]
  },

  "libraries": {
    "install": [
      "npm i framer-motion",
      "npm i recharts",
      "npm i lucide-react",
      "npm i lottie-react"
    ],
    "usage_notes": [
      "Framer Motion pour hover/click (pas de transition: all)",
      "Recharts pour statistiques (bar/area/pie)",
      "Lucide pour icônes d'actions (flèches vote, commentaires)",
      "Lottie pour états vides/succès avec fallback image"
    ]
  },

  "example_components_js": {
    "IdeaCard": "import { Card, CardHeader, CardContent } from './components/ui/card';\nimport { Button } from './components/ui/button';\nimport { Badge } from './components/ui/badge';\nimport { MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';\nimport { toast } from './components/ui/sonner';\n\nexport function IdeaCard({ idea, onVote }) {\n  const handleVote = (dir) => {\n    onVote?.(idea.id, dir);\n    toast(dir === 'up' ? 'Vote enregistré' : 'Vote retiré');\n  };\n  return (\n    <Card className=\"group hover:shadow-lg transition-shadow duration-200\" data-testid=\"idea-card\">\n      <CardHeader className=\"pb-2\">\n        <h3 className=\"font-semibold text-slate-900\" data-testid=\"idea-card-title\">{idea.title}</h3>\n        <div className=\"flex flex-wrap gap-2 mt-2\" data-testid=\"idea-card-tags\">\n          {idea.tags.map((t) => (\n            <Badge key={t} variant=\"secondary\">{t}</Badge>\n          ))}\n        </div>\n      </CardHeader>\n      <CardContent>\n        <p className=\"text-slate-700 text-sm line-clamp-3\">{idea.excerpt}</p>\n        <div className=\"mt-4 flex items-center justify-between\">\n          <div className=\"flex items-center gap-2\">\n            <Button size=\"sm\" className=\"bg-[hsl(var(--vote-up))] text-white hover:brightness-110\" aria-label=\"Upvote\" data-testid=\"idea-card-upvote-button\" onClick={() => handleVote('up')}>\n              <ArrowUp className=\"h-4 w-4\" />\n            </Button>\n            <Button size=\"sm\" className=\"bg-[hsl(var(--vote-down))] text-white hover:brightness-110\" aria-label=\"Downvote\" data-testid=\"idea-card-downvote-button\" onClick={() => handleVote('down')}>\n              <ArrowDown className=\"h-4 w-4\" />\n            </Button>\n            <span className=\"text-sm font-medium\" data-testid=\"idea-card-vote-count\">{idea.votes}</span>\n          </div>\n          <div className=\"text-slate-500 flex items-center gap-1\">\n            <MessageSquare className=\"h-4 w-4\" />\n            <span data-testid=\"idea-card-comment-count\">{idea.commentsCount}</span>\n          </div>\n        </div>\n      </CardContent>\n    </Card>\n  );\n}",

    "FiltersBar": "import { Input } from './components/ui/input';\nimport { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './components/ui/select';\nimport { Separator } from './components/ui/separator';\n\nexport function FiltersBar({ q, onQ, sort, onSort }) {\n  return (\n    <div className=\"flex flex-col md:flex-row gap-3 md:items-center\">\n      <Input value={q} onChange={(e)=>onQ(e.target.value)} placeholder=\"Rechercher des idées\" data-testid=\"ideas-filter-search-input\" className=\"md:w-80\" />\n      <Separator className=\"md:hidden\" />\n      <Select value={sort} onValueChange={onSort}>\n        <SelectTrigger data-testid=\"ideas-sort-select\" className=\"w-56\">\n          <SelectValue placeholder=\"Trier par\" />\n        </SelectTrigger>\n        <SelectContent>\n          <SelectItem value=\"top\">Plus votées</SelectItem>\n          <SelectItem value=\"recent\">Récentes</SelectItem>\n          <SelectItem value=\"active\">Actives</SelectItem>\n        </SelectContent>\n      </Select>\n    </div>\n  );\n}"
  },

  "layouts_scaffolds": {
    "Header": "Header sticky avec NavigationMenu. Bouton primaire 'Proposer une idée' à droite (data-testid=header-propose-idea-button). Mobile: Sheet pour menu.",
    "Hero": "Section relative overflow-hidden bg-[radial-gradient(1200px_500px_at_10%_-10%,_#EAF3FF,_transparent),linear-gradient(to_right,_#EAF3FF,_#E6F6F2_60%,_#FFF5E9)]/contain before:content-[''] before:noise-overlay. Texte sombre, CTA primaire + ghost.",
    "IdeasGrid": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    "Detail": "md:grid md:grid-cols-12 gap-8; contenu col-span-8/9; aside col-span-4/3 sticky top-24"
  },

  "motion": {
    "entrance": "opacity-0 translate-y-3 -> opacity-100 translate-y-0 sur 300ms  avec delay-stagger",
    "hover": "cards: translate-y-[-2px] shadow-md; boutons: brightness + légère scale-98 au clic",
    "focus": "anneau 2px couleur --ring",
    "scroll": "parallax léger dans héros (transform translateY basé sur scroll)"
  },

  "data_display": {
    "kpi_cards": "4 mini-cards (Participants, Propositions, Votes, Commentaires). Police Space Grotesk 700 pour le chiffre, Karla pour l'étiquette.",
    "empty_states": "Illus Lottie (ou image), message FR clair, CTA pour créer ou modifier filtre"
  },

  "forms": {
    "rules": ["labels visibles (Label)", "placeholders non essentiels", "validation inline avec message clair"],
    "components": ["Input", "Textarea", "Select", "Dialog (confirmer suppression)"]
  },

  "images_guidance": {
    "hero": "utiliser image_urls.hero en arrière-plan soft + masque blanc 70% si texte long",
    "content_blocks": "utiliser images illustratives seulement en sections de preuve/social"
  },

  "instructions_to_main_agent": [
    "1) Ajouter la balise Google Fonts fournie dans index.html.",
    "2) Mettre à jour :root dans src/index.css avec les tokens fournis (sans casser la classe .dark).",
    "3) Construire Header, Hero, KPI Stats, puis IdeasGrid avec IdeaCard (exemple fourni).",
    "4) Implémenter FiltersBar au-dessus de la grille et Pagination en bas (data-testid obligatoires).",
    "5) Page Détail: vote sticky + fil de commentaires (comment-item).",
    "6) Formulaire Nouvelle idée: Input, Textarea, Select(tags) + toast success.",
    "7) Intégrer Recharts pour StatsBar sur Home.",
    "8) Respecter règles de gradient (max 20% viewport) et d’accessibilité.",
    "9) Tous les éléments interactifs ou informatifs clés doivent inclure data-testid (kebab-case)."
  ]
}


<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
