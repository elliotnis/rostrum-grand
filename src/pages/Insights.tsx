import { publicUrl, articleHtmlWithBase } from "@/lib/urls";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eyebrow, PageHero, TextLink } from "@/components/site";
import { getPosts, dateLabel, type Post, type Article } from "@/lib/content";
const categories = [
  { id: "all", name: "All articles" },
  { id: "insights", name: "Insights" },
  { id: "media-news", name: "Media & News" },
  { id: "uncategorized", name: "Uncategorized" },
];
export default function Insights() {
  const [params, setParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [shown, setShown] = useState(12);
  const query = params.get("q") ?? "";
  const month = params.get("month") ?? "";
  const cat = params.get("cat") ?? "all";
  const sort = params.get("sort") ?? "newest";
  const load = () => {
    setLoading(true);
    setError("");
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
    setShown(12);
  };
  const months = useMemo(
    () => [...new Set(posts.map((p) => p.date.slice(0, 7)))].sort().reverse(),
    [posts],
  );
  const filtered = useMemo(
    () =>
      posts
        .filter(
          (p) =>
            (cat === "all" ||
              (p.categories ?? [p.category]).includes(
                categories.find((c) => c.id === cat)?.name ?? "",
              )) &&
            (!month || p.date.startsWith(month)) &&
            (!query ||
              (p.title + " " + p.excerpt)
                .toLowerCase()
                .includes(query.toLowerCase())),
        )
        .sort((a, b) =>
          sort === "oldest"
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date),
        ),
    [posts, cat, month, query, sort],
  );
  return (
    <>
      <PageHero
        title="RG Corner"
      />
      <section className="archive-section section-space">
        <div className="container">
          <div className="archive-controls">
            <Tabs value={cat} onValueChange={(v) => update("cat", v)}>
              <TabsList className="archive-tabs">
                {categories.map((c) => (
                  <TabsTrigger value={c.id} key={c.id}>
                    {c.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="archive-search">
              <Search size={17} />
              <Input
                aria-label="Search articles"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => update("q", e.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  onClick={() => update("q", "")}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
          <div className="archive-toolbar">
            <span aria-live="polite">
              {loading
                ? "Loading articles…"
                : `${filtered.length} article${filtered.length !== 1 ? "s" : ""}`}
            </span>
            <div>
              <label>
                <span className="sr-only">Filter by month</span>
                <select
                  value={month}
                  onChange={(e) => update("month", e.target.value)}
                >
                  <option value="">All dates</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {new Date(m + "-01T12:00:00").toLocaleDateString(
                        "en-GB",
                        { month: "long", year: "numeric" },
                      )}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Sort articles</span>
                <select
                  value={sort}
                  onChange={(e) => update("sort", e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
            </div>
          </div>
          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="animate-spin" />
              Loading the research archive…
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>We couldn’t load the archive.</h2>
              <p>{error}</p>
              <Button className="btn-navy" onClick={load}>
                Try again
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Search size={35} strokeWidth={1} />
              <h2>No articles found.</h2>
              <p>Try another search or explore the full archive.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setParams({});
                  setShown(12);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="archive-grid">
                {filtered.slice(0, shown).map((p, i) => (
                  <Link
                    className={`archive-card ${i === 0 && cat === "all" && !query ? "archive-card-featured" : ""}`}
                    key={p.id}
                    to={"/rg-corner/" + p.slug}
                  >
                    <div className="archive-card-meta">
                      <span className="category-tag">{p.category}</span>
                      <time dateTime={p.date}>{dateLabel(p.date)}</time>
                    </div>
                    <h2>{p.title}</h2>
                    <p>
                      {p.excerpt.replace(/\s*\[?…\]?\s*$/, "").slice(0, 180)}
                      {p.excerpt.length > 180 ? "…" : ""}
                    </p>
                    <div className="archive-card-footer">
                      <span>Read article</span>
                      <ArrowUpRight size={20} />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="archive-pagination">
                <p>
                  Showing {Math.min(shown, filtered.length)} of{" "}
                  {filtered.length} articles
                </p>
                {shown < filtered.length && (
                  <Button
                    variant="outline"
                    className="load-more"
                    onClick={() => setShown((s) => s + 12)}
                  >
                    Load more articles
                    <ArrowRight className="rotate-90" size={16} />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
export function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<Post[]>([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let live = true;
    setArticle(null);
    setError("");
    if (!slug) return;
    fetch(publicUrl("/content/articles/" + encodeURIComponent(slug) + ".json"))
      .then((r) => {
        if (!r.ok) throw new Error("This article could not be found.");
        return r.json();
      })
      .then((a: Article) => {
        if (live) {
          setArticle({ ...a, html: articleHtmlWithBase(a.html) });
          document.title = a.title + " | Rostrum Grand";
        }
      })
      .catch(() => {
        if (live)
          setError(
            "This article could not be found. Browse the research archive.",
          );
      });
    getPosts()
      .then((p) => {
        if (live) setRelated(p.filter((x) => x.slug !== slug).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [slug]);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  if (error)
    return (
      <section className="container section-space empty-state">
        <h1>Perspective unavailable</h1>
        <p>{error}</p>
        <TextLink to="/rg-corner">Return to RG Corner</TextLink>
      </section>
    );
  if (!article)
    return (
      <div className="loading-state container section-space">
        <LoaderCircle className="animate-spin" />
        Loading article…
      </div>
    );
  return (
    <>
      <section className="article-header">
        <div className="container">
          <Link className="back-link" to="/rg-corner">
            <ArrowLeft size={16} />
            Back to RG Corner
          </Link>
          <div className="article-meta">
            <Eyebrow>{article.category}</Eyebrow>
            <time dateTime={article.date}>{dateLabel(article.date)}</time>
          </div>
          <h1>{article.title}</h1>
          <div className="article-byline">
            <span>Rostrum Grand articles</span>
            <Button
              variant="ghost"
              onClick={copyLink}
              aria-label="Copy article link"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span aria-live="polite">
                {copied ? "Link copied" : "Copy link"}
              </span>
            </Button>
          </div>
        </div>
      </section>
      <section className="article-content-section">
        <div className="container article-layout">
          <aside className="article-aside">
            <span className="eyebrow">
              Investment
              <br />
              research.
            </span>
            <p>Read about the six investment categories we research.</p>
            <TextLink to="/investment-universe">Explore investments</TextLink>
            <a
              className="source-link"
              href={article.source}
              target="_blank"
              rel="noreferrer"
            >
              Original publication
              <ArrowUpRight size={14} />
            </a>
          </aside>
          <article
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>
      </section>
      <section className="related-section section-space">
        <div className="container">
          <div className="section-heading">
            <h2>
              Related articles
            </h2>
            <TextLink to="/rg-corner">All articles</TextLink>
          </div>
          <div className="related-grid">
            {related.map((p) => (
              <Link to={"/rg-corner/" + p.slug} key={p.id}>
                <time>{dateLabel(p.date)}</time>
                <h3>{p.title}</h3>
                <ArrowUpRight size={21} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
