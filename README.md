# The Subreddit Vibe Check

A React dashboard that retrieves a subreddit's hot posts and analyzes their titles using client-side sentiment analysis.

[![Live Demo](https://img.shields.io/badge/demo-online-emerald.svg)](https://subreddit-vibe-check-phi.vercel.app/)
[![Repository](https://img.shields.io/badge/github-babita--svg%2Fsubreddit--vibe--check-blue.svg)](https://github.com/babita-svg/subreddit-vibe-check)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Application**: [https://subreddit-vibe-check-phi.vercel.app/](https://subreddit-vibe-check-phi.vercel.app/)  
**Source Code**: [https://github.com/babita-svg/subreddit-vibe-check](https://github.com/babita-svg/subreddit-vibe-check)  
**Author**: SARTHAK

---

## Preview

![The Subreddit Vibe Check dashboard](docs/images/dashboard.png)

> *Note: If building locally, you can place a screenshot of the dashboard at `docs/images/dashboard.png`.*

---

## Overview

The application allows a user to enter a subreddit and retrieve its current hot posts. The returned post titles are analyzed in the browser using the `sentiment` package, and the results are summarized through counts, percentages, charts, and a filterable post list.

The project demonstrates client-side data ingestion, rule-based text evaluation, data visualization with Recharts, responsive UI architecture, and robust error handling for external API constraints.

---

## Features

- **Subreddit Search & Normalization**: Accepts raw names (`technology`), `r/` notation (`r/technology`, `/r/technology/`), or full URLs (`https://reddit.com/r/technology`) and normalizes the input.
- **Top 50 Hot Posts Retrieval**: Queries Reddit's official public JSON endpoint for the 50 most active posts in the specified subreddit.
- **Client-Side Sentiment Analysis**: Computes integer valence scores and comparative sentiment in the browser using the AFINN-165 lexicon.
- **Post-Level Classification**: Categorizes each post title as Positive (`score > 0`), Neutral (`score === 0`), or Negative (`score < 0`).
- **Community Vibe Summary**: Determines overall subreddit mood based on average sentiment score thresholds.
- **Interactive Visualizations**:
  - **Sentiment Distribution**: Donut chart showing the breakdown of positive, neutral, and negative posts.
  - **Score Distribution by Post**: Bar chart displaying sentiment scores across top posts.
  - **Keyword Impact**: Frequency and impact of detected sentiment keywords.
- **Post Filtering & Sorting**: Filter by sentiment category and sort by Reddit upvotes, sentiment score, comment count, or Reddit rank.
- **Live Search**: Instant keyword search filtering post titles and sentiment tokens.
- **Export Capabilities**: Download the analyzed dataset in JSON or CSV format, or copy a formatted text summary to the clipboard.
- **Theme Support**: Dark and light mode with persistent user preference in `localStorage`.
- **In-App Test Suite**: Embedded test runner verifying input normalization, sentiment scoring rules, and statistics calculation.
- **Error Handling**: Explicit handling and messaging for non-existent subreddits (404), private communities (403), rate limits (429), and network errors.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | User interface components and state management |
| **TypeScript** | Static typing and interfaces |
| **Vite** | Build tool and local development server |
| **Tailwind CSS v4** | Styling and responsive design system |
| **Reddit JSON API** | Public data source for subreddit hot posts |
| **sentiment** | Client-side lexicon-based sentiment analysis (AFINN-165) |
| **Recharts** | Data visualization (donut and bar charts) |
| **Lucide React** | Interface icons |
| **Vercel** | Production hosting and deployment |

---

## How It Works

```text
┌─────────────────────────┐
│   User Enters Subreddit │  (e.g., "technology" or "r/technology")
└────────────┬────────────┘
             │ 1. Normalize input string
             ▼
┌─────────────────────────┐
│     Reddit JSON API     │  GET https://www.reddit.com/r/{sub}/hot.json?limit=50&raw_json=1
└────────────┬────────────┘
             │ 2. Ingest up to 50 active posts
             ▼
┌─────────────────────────┐
│  Client Sentiment Engine│  analyze(post.title) via AFINN-165 wordlist
└────────────┬────────────┘
             │ 3. Score each post: Positive (>0), Neutral (=0), Negative (<0)
             ▼
┌─────────────────────────┐
│   Aggregate Analytics   │  Calculate average score, percentages, and keyword impacts
└────────────┬────────────┘
             │ 4. Classify overall vibe: Positive (>0.5), Negative (<-0.5), Neutral (else)
             ▼
┌─────────────────────────┐
│  Interactive Dashboard  │  Render KPI cards, charts, filters, and post list
└─────────────────────────┘
```

1. **Input Normalization**: Removes `r/`, leading/trailing slashes, and URL artifacts from the user input.
2. **Data Fetching**: Sends an asynchronous request to Reddit's `/hot.json` endpoint requesting 50 items.
3. **Data Mapping**: Normalizes raw JSON response into structured `RedditPost` objects.
4. **Sentiment Scoring**: Runs each post title through the `sentiment` library to derive raw score, comparative score, and tokenized keyword lists.
5. **Statistical Aggregation**: Computes overall averages, distributions, min/max scores, and top emotional keywords.
6. **UI Presentation**: Displays the community vibe score, interactive charts, and a filterable, sortable list of posts.

---

## Reddit API

The application queries Reddit's public JSON endpoint:

```text
https://www.reddit.com/r/{subreddit}/hot.json?limit=50&raw_json=1
```

### Request Parameters

- `limit=50`: Requests the top 50 hot posts.
- `raw_json=1`: Prevents HTML entity escaping in returned URLs and titles.

### Error Handling

| Status Code / Error | Cause | User Feedback |
| :--- | :--- | :--- |
| **404 Not Found** | Subreddit does not exist or was misspelled | *"We couldn't find that subreddit. Check the name and try again."* |
| **403 Forbidden** | Subreddit is private, banned, or quarantined | *"This subreddit is unavailable or restricted."* |
| **429 Rate Limited** | Reddit API request threshold exceeded | *"Reddit is temporarily rate-limiting requests. Please try again shortly."* |
| **Empty Response** | Subreddit has no active hot posts | *"This subreddit returned no hot posts."* |
| **Network Error** | Connection failure or CORS block | *"Unable to connect to Reddit. Please check your connection and try again."* |

---

## Sentiment Methodology & Classification Rules

### 1. Individual Post Scoring

Each post title is tokenized and scored using the **AFINN-165** wordlist:

- **Positive**: `score > 0`
- **Neutral**: `score === 0`
- **Negative**: `score < 0`

### 2. Community Vibe Thresholds

The community's overall vibe is derived from the mean score across all analyzed posts ($\bar{S} = \frac{1}{N}\sum_{i=1}^{N} S_i$):

- **Positive Vibe**: $\bar{S} > +0.50$
- **Negative Vibe**: $\bar{S} < -0.50$
- **Neutral Vibe**: $-0.50 \le \bar{S} \le +0.50$

### 3. Known Limitations

- **Lexicon vs. Context**: AFINN-165 is a rule-based dictionary. It evaluates individual words with predefined weights and does not understand sarcasm, irony, gaming terminology, or complex negations.
- **Title-Only Scope**: Analysis is performed strictly on post titles, not the full text body or comment sections.
- **Topic Tone vs. Author Sentiment**: A factual news headline (e.g., *"Earthquake damages historic bridge"*) receives a negative score due to vocabulary, reflecting the headline topic rather than the author's personal sentiment.

---

## Project Structure

```text
src/
├── components/
│   ├── EmptyState.tsx         # Initial state with suggested subreddits
│   ├── ErrorBoundary.tsx      # React error boundary for unexpected errors
│   ├── ErrorDisplay.tsx       # User-friendly API error state with retry
│   ├── ExportModal.tsx        # JSON/CSV download and clipboard copy modal
│   ├── Header.tsx             # App header with theme toggle and links
│   ├── LoadingSkeleton.tsx    # Skeleton loader during data fetching
│   ├── MethodologyModal.tsx   # Documentation modal on scoring rules
│   ├── OverallVibeCard.tsx    # Vibe summary card with spectrum gauge
│   ├── OverviewStats.tsx      # Overview KPI metric cards
│   ├── PostCard.tsx           # Individual Reddit post card
│   ├── PostsList.tsx          # Filterable, sortable post list
│   ├── SentimentCharts.tsx    # Donut and bar charts using Recharts
│   ├── SubredditSearch.tsx    # Subreddit input field and quick links
│   └── TestRunnerModal.tsx    # In-browser test runner modal
├── hooks/
│   ├── useRedditAnalysis.ts   # Core hook managing data fetching and filtering
│   └── useTheme.ts            # Theme management hook with localStorage persistence
├── services/
│   └── redditApi.ts           # Reddit API client and response parser
├── types/
│   └── reddit.ts              # TypeScript type definitions
├── utils/
│   ├── formatters.ts          # Number, date, and sentiment score formatters
│   ├── sentiment.ts           # Sentiment scoring, normalization, and statistics
│   └── sentiment.test.ts      # Unit tests for sentiment logic
├── App.tsx                    # Main application component
├── main.tsx                   # React entry point
└── index.css                  # Global styles and Tailwind imports
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/babita-svg/subreddit-vibe-check.git
   cd subreddit-vibe-check
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Production Build

To compile the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To check TypeScript types:

```bash
npm run lint
```

---

## Testing

The project includes an in-app unit test suite verifying:

1. **Subreddit Normalization**: Correctly parses `technology`, `r/technology`, `/r/technology/`, and full Reddit URLs.
2. **Sentiment Scoring**: Correctly assigns Positive, Neutral, and Negative labels to test phrases.
3. **Vibe Classification**: Correctly evaluates overall vibe thresholds ($>0.5$, $<-0.5$, and neutral ranges).
4. **Statistical Calculations**: Validates percentage sums and average score arithmetic.

To run tests in the browser, click the **Unit Tests** button in the header bar.

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
