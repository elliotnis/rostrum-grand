import { publicUrl } from "@/lib/urls";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Layers3, Network, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/site";
import { ConnectionDiagram, InvestmentIllustration } from "@/components/investment-visuals";
import { site, sections, paragraphs, strategies, getPosts, dateLabel, type Post } from "@/lib/content";

const categoryOrder = ["asset-based-finance", "fixed-income-credit", "regional-thematic", "private-equity", "quantitative", "real-assets"];
export function StrategyGrid({ compact = false }: { compact?: boolean }) {
  const overview = sections("/investment-universe")[1].blocks;
  return <div className={`strategy-grid ${compact ? "strategy-grid-compact" : ""}`}>
    {categoryOrder.map((slug, i) => {
      const strategy = strategies.find(s => s.slug === slug)!;
      return <Link className="strategy-card" key={slug} to={"/investment-universe/" + slug}>
        <InvestmentIllustration category={slug} />
        <h3>{overview[i * 2].text}</h3>
        {!compact && <p>{overview[i * 2 + 1].text}</p>}
        <span className="strategy-card-bottom">Read more <ArrowUpRight size={18} aria-hidden="true" /></span>
        <span className="sr-only"> about {strategy.name}</span>
      </Link>;
    })}
  </div>;
}
export function InsightCards({ posts }: { posts: Post[] }) {
  return <div className="insight-grid">{posts.map((post, i) => <Link className="insight-card" key={post.id} to={"/rg-corner/" + post.slug}>
    <div className="insight-image"><img src={publicUrl("/assets/" + ["architecture-detail.jpg", "hong-kong.jpg", "architecture.jpg"][i % 3])} alt="" loading="lazy" /><span>{post.category}</span><ArrowUpRight className="insight-image-arrow" size={22} aria-hidden="true" /></div>
    <div className="insight-info"><time dateTime={post.date}>{dateLabel(post.date)}</time><h3>{post.title}</h3><span className="insight-read">Read more <ArrowRight size={18} aria-hidden="true" /></span></div>
  </Link>)}</div>;
}
export default function Home() {
  const home = sections("/");
  const processCopy = paragraphs(home[1]).slice(2);
  const steps = [{ id: "analyse", name: "Analyse", icon: Search }, { id: "due-diligence", name: "Due diligence", icon: ShieldCheck }, { id: "design", name: "Design", icon: Layers3 }, { id: "distribute", name: "Distribute", icon: Network }];
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    let live = true;
    getPosts().then(items => { if (live) setPosts(items.slice(0, 3)); }).catch(() => {});
    return () => { live = false; };
  }, []);
  return <>
    <section className="home-hero"><div className="hero-photo"><img src={publicUrl("/assets/architecture.jpg")}  alt="Looking up between city office buildings" fetchPriority="high" /><div className="hero-photo-tint" /><div className="perspective-frame"><span /><span /><span /><span /></div></div><div className="container hero-container"><div className="hero-copy">
      <h1>{site.homeHero.title.replace(/ Alternatives$/, "")} <span className="hero-title-accent">Alternatives</span></h1><p>{site.homeHero.subtitle}</p>
      <div className="hero-actions"><Button asChild className="btn-gold"><Link to="/contact-us">Partner with us <ArrowUpRight size={18} /></Link></Button><Link className="hero-partner" to="/investment-universe">Our Investment Universe <ArrowUpRight size={18} /></Link></div>
    </div><div className="hero-bottom"><a href="#perspective"><span className="hero-scroll"><ArrowDown size={16} aria-hidden="true" /></span>About RG Lab</a><span>ROSTRUM GRAND</span></div></div></section>
    <section className="home-intro section-space" id="perspective"><div className="container original-split"><div className="intro-visual"><img src={publicUrl("/assets/architecture-detail.jpg")}  alt="" loading="lazy" /></div><div><h2>{home[0].title}</h2><p>{paragraphs(home[0])[0]}</p><TextLink to="/rg-lab">About RG Lab</TextLink></div></div></section>
    <section className="lab-section section-space" id="how-we-work"><div className="container"><div className="section-heading process-section-heading"><div className="process-section-copy"><h2>{home[1].title}</h2><p>{paragraphs(home[1])[0]}</p></div><TextLink to="/about-us" light>About us</TextLink></div><div className="home-process-grid">{steps.map((step, i) => <Link className="home-process-card" key={step.id} to={"/rg-lab#" + step.id}><div className="process-card-top"><step.icon size={30} strokeWidth={1.25} aria-hidden="true" /><span>0{i + 1}</span></div><h3>{step.name}</h3><p>{processCopy[i]}</p><ArrowUpRight className="card-arrow" size={21} aria-hidden="true" /></Link>)}</div></div></section>
    <section className="create-section connection-section section-space" id="create-curate-connect"><div className="container connection-layout"><div className="connection-copy"><h2>{home[2].title}</h2><p>{paragraphs(home[2])[0]}</p></div><ConnectionDiagram /></div></section>
    <section className="universe-section section-space" id="investments"><div className="container"><div className="section-heading"><h2>The power of scale{" "}<span className="heading-subtitle">The beauty of detail</span></h2><div className="section-heading-aside"><p>{paragraphs(home[3])[0]}</p><TextLink to="/investment-universe">Investment Universe</TextLink></div></div><StrategyGrid compact /></div></section>
    {/* The original partners section is hidden and contains no partner names or logos. */}
    <section hidden><h2>{home[4].title}</h2></section>
    {posts.length > 0 && <section className="insights-section section-space"><div className="container"><div className="section-heading"><h2>{home[5].title}</h2><TextLink to="/rg-corner">RG Corner</TextLink></div><InsightCards posts={posts} /></div></section>}
  </>;
}
