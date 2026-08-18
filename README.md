# The Subreddit Vibe Check

An analytics dashboard that evaluates the live emotional mood and sentiment of any Reddit community by analyzing its **top 50 hottest posts** in real time.

Built as a submission for the **Full Stack Developer Internship Assignment**.

---

## 🚀 Live Demo & Repository

- **Repository**: [https://github.com/babita-svg/subreddit-vibe-check](https://github.com/babita-svg/subreddit-vibe-check)
- **Author**: SARTHAK

---

## ✨ Features

- **Dynamic Subreddit Input & Normalization**: Accepts raw names (`technology`), subreddit notation (`r/technology`, `/r/technology/`), or full URLs (`https://reddit.com/r/technology`) and normalizes them automatically.
- **Official Reddit HOT Endpoint Ingestion**: Retrieves the top 50 hottest posts via `https://www.reddit.com/r/{subreddit}/hot.json?limit=50`.
- **Client-Side Sentiment Analysis**: Computes exact sentiment valence directly in the browser using the `sentiment` package (AFINN-165 lexicon) with zero external LLM latency or privacy leakage.
- **Dynamic Community Vibe Gauge**: Mathematical categorization of the community's overall vibe (Positive, Neutral, Negative) based on the calculated average score with an interactive spectrum meter.
- **Interactive Recharts Visualizations**:
  - **Sentiment Distribution Donut**: Visual breakdown of positive, neutral, and negative post percentages.
  - **Sentiment by Post Bar Chart**: Score distribution across the top 15 hot posts with interactive tooltips.
  - **Emotional Keywords Impact Chart**: Top valence-bearing words extracted from post titles.
- **Real-Time Filtering, Sorting & Search**:
  - Filter posts by sentiment category (All, Positive, Neutral, Negative).
  - Sort posts by Reddit upvotes, sentiment score, rank, or comment count.
  - Instant in-page text search across post titles and detected sentiment keywords.
- **Dark & Light Mode**: Dark-first SaaS UI design with smooth theme persistence in `localStorage`.
- **Export & Share Capabilities**: Export analyzed datasets to JSON or CSV, or copy formatted Markdown summary reports to the clipboard.
- **Interactive In-App Test Suite**: Embedded unit test runner executing normalization, sentiment classification, and statistics assertions in real time.
- **Robust Error Handling & Error Boundaries**: User-friendly alerts for 404 not found, private subreddits, rate limits, network timeouts, and React error boundaries.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Sentiment Engine** | [`sentiment`](https://www.npmjs.com/package/sentiment) (AFINN-165 Lexicon) |
| **Visualizations** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🔄 How It Works

```
┌─────────────────────────┐
│  User Enters Subreddit  │ (e.g., "r/programming")
└────────────┬────────────┘
             │ 1. Normalize query
             ▼
┌─────────────────────────┐
│    Reddit HOT API       │ GET https://www.reddit.com/r/{sub}/hot.json?limit=50
└────────────┬────────────┘
             │ 2. Ingest up to 50 active posts
             ▼
┌─────────────────────────┐
│  Client-Side Sentiment  │ sentiment.analyze(post.title) via AFINN-165
└────────────┬────────────┘
             │ 3. Score & categorize: Positive (>0), Neutral (=0), Negative (<0)
             ▼
┌─────────────────────────┐
│  Aggregate Statistics   │ Average score, percentages, min/max, keyword frequencies
└────────────┬────────────┘
             │ 4. Determine Overall Vibe (>+0.5 Pos, <-0.5 Neg, else Neutral)
             ▼
┌─────────────────────────┐
│  Interactive Dashboard  │ KPI cards, Donut chart, Bar charts, Filterable post cards
└─────────────────────────┘
```

---

## 📊 Sentiment Methodology & Classification Rules

### 1. Individual Post Scoring
Each post title is tokenized and scored against the AFINN-165 lexicon:
- **Positive Post**: `sentimentScore > 0`
- **Neutral Post**: `sentimentScore === 0`
- **Negative Post**: `sentimentScore < 0`

### 2. Overall Community Vibe Calculation
The community vibe is derived from the **mean sentiment score** ($\bar{S} = \frac{1}{N}\sum_{i=1}^{N} S_i$) across all 50 analyzed posts:
- **Positive Vibe**: $\bar{S} > +0.50$
- **Negative Vibe**: $\bar{S} < -0.50$
- **Neutral Vibe**: $-0.50 \le \bar{S} \le +0.50$

### 3. Transparency & Known Limitations
- **Lexicon vs. Context**: AFINN-165 is a rule-based dictionary. It excels at fast, deterministic, zero-cost evaluation but cannot always detect nuanced sarcasm, irony, gaming slang, or context-specific double negatives.
- **Headline Tone vs. Event Tone**: A news post titled *"Tragic wildfire destroys historic building"* will score negatively due to tragedy/destroy keywords, reflecting the emotional tone of the headline topic rather than the author's personal sentiment.

---

## 📁 Project Directory Structure

```text
src/
├── components/
│   ├── EmptyState.tsx         # Welcome screen with starter suggestion cards
│   ├── ErrorBoundary.tsx      # Application level fallback error boundary
│   ├── ErrorDisplay.tsx       # User-friendly error alert cards with retry action
│   ├── ExportModal.tsx        # JSON/CSV download & Markdown copy modal
│   ├── Header.tsx             # Brand header with theme toggle & modal triggers
│   ├── LoadingSkeleton.tsx    # Pulse skeleton cards during API ingestion
│   ├── MethodologyModal.tsx   # Mathematical methodology documentation modal
│   ├── OverallVibeCard.tsx    # Hero vibe card with spectrum gauge & narrative
│   ├── OverviewStats.tsx      # 5 KPI overview statistics cards
│   ├── PostCard.tsx           # Individual Reddit post card with badges & metrics
│   ├── PostsList.tsx          # Filterable, sortable, searchable 50 posts grid
│   ├── SentimentCharts.tsx    # Recharts Donut distribution & Bar charts
│   ├── SubredditSearch.tsx    # Search form input with quick recommendation chips
│   └── TestRunnerModal.tsx    # Interactive in-app unit test suite runner
├── hooks/
│   ├── useRedditAnalysis.ts   # Core data hook managing fetching, filters & sorting
│   └── useTheme.ts            # Dark/Light mode theme state with localStorage persistence
├── services/
│   └── redditApi.ts           # Reddit HOT API client with normalization & error handling
├── types/
│   └── reddit.ts              # TypeScript interfaces for posts, sentiment & summaries
├── utils/
│   ├── formatters.ts          # Compact numbers (2.4k), relative timestamps & score signs
│   ├── sentiment.ts           # AFINN sentiment engine, statistical aggregation & vibe rules
│   └── sentiment.test.ts      # Unit tests for sentiment analysis & normalization
├── App.tsx                    # Main dashboard application orchestrator
├── main.tsx                   # React 19 entry point
└── index.css                  # Tailwind CSS styling and theme configuration
```

---

## ⚡ Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/babita-svg/subreddit-vibe-check.git
cd subreddit-vibe-check
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

To compile a production build:
```bash
npm run build
```
The optimized static assets will be output to the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🚀 Deployment to Vercel

This project is configured as a standalone Single Page Application (SPA) and is 100% ready for one-click deployment on **Vercel**:

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial implementation of The Subreddit Vibe Check"
   git branch -M main
   git remote add origin https://github.com/<your-username>/subreddit-vibe-check.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `subreddit-vibe-check` repository.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

---

## 🧪 Manual & Automated Testing Checklist

- [x] **Subreddit Normalization**: `r/technology`, `/r/technology/`, `technology`, `https://reddit.com/r/technology` all normalize to `technology`.
- [x] **Hot Posts Fetching**: Fetches up to 50 active posts from Reddit's `/hot.json` feed.
- [x] **Sentiment Analysis**: Client-side evaluation using AFINN lexicon accurately categorizes positive, neutral, and negative titles.
- [x] **Vibe Determination**: Average score $> +0.5$ triggers Positive, $< -0.5$ triggers Negative, otherwise Neutral.
- [x] **Filter & Sort Controls**: Client-side filtering by sentiment and sorting by Reddit score/sentiment/comments without re-fetching.
- [x] **Error Handling**: Handles non-existent subreddits (404), rate limits (429), and connection drops with clear user feedback and retry actions.
- [x] **Dark / Light Mode**: Theme toggle persists in `localStorage` and adapts all cards, text, borders, and charts.
- [x] **Export Feature**: Downloads structured JSON, CSV, and copies formatted reports to clipboard.
- [x] **Responsive Layout**: Fluid layout across mobile, tablet, laptop, and ultra-wide screens.

---

## 🔮 Future Enhancements

- **Comment Thread Sentiment**: Ingest top 10 comments per post for multi-tiered sentiment weighting.
- **Historical Mood Tracking**: Track sentiment changes over 24h/7d windows using time-series caching.
- **Cross-Subreddit Comparison**: Side-by-side sentiment duel between two communities (e.g., `r/reactjs` vs `r/vuejs`).
- **Hybrid NLP Engine**: Option to toggle between fast client-side AFINN lexicon and LLM-powered context analysis.

---

## 📄 License

MIT License © 2026. Built with precision for the Full Stack Developer Internship Assignment.
