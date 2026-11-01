import { publicUrl } from "@/lib/urls";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Blocks, PageHero, Eyebrow } from "@/components/site";
import { sections, strategies, type Block } from "@/lib/content";
import { StrategyGrid } from "./Home";
export function Universe() {
  const intro = sections("/investment-universe")[0];
  return <>
    <PageHero eyebrow="Investment Universe" title="The power of scale" accent="The beauty of detail" description={intro.blocks.find(block => block.type === "paragraph")?.text} />
    <section className="section-space"><div className="container"><StrategyGrid /></div></section>
  </>;
}
function groupBlocks(blocks: Block[]) {
  const groups: { title: string; blocks: Block[] }[] = [];
  for (const b of blocks) {
    if (b.type === "heading") {
      groups.push({ title: b.text, blocks: [] });
    } else {
      if (!groups.length) groups.push({ title: "", blocks: [] });
      groups[groups.length - 1].blocks.push(b);
    }
  }
  return groups.filter((g) => g.blocks.length);
}
export function StrategyDetail() {
  const { slug } = useParams();
  const strategy = strategies.find((s) => s.slug === slug);
  if (!strategy)
    return (
      <section className="container section-space">
        <h1>Strategy not found</h1>
        <Link to="/investment-universe">Explore our Investment Universe</Link>
      </section>
    );
  const content = sections("/investment-universe/" + slug);
  const first = content[0];
  const rest = content.slice(1);
  return (
    <>
      <PageHero
        eyebrow="Investment Universe"
        title={first?.title ?? strategy.name}
        image={publicUrl("/assets/" + strategy.image)}
      >
        <Link className="back-link" to="/investment-universe">
          <ArrowLeft size={15} />
          All investment categories
        </Link>
      </PageHero>
      <section className="section-space">
        <div className="container strategy-detail-layout">
          <aside className="strategy-sidebar">
            <Eyebrow>Investment Universe</Eyebrow>
            {strategies.map((s) => (
              <Link
                key={s.slug}
                className={s.slug === slug ? "selected" : ""}
                to={"/investment-universe/" + s.slug}
              >
                {s.name}
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </aside>
          <div className="strategy-body">
            {first && <Blocks blocks={first.blocks} skipFirst />}
            {rest.map((s, i) => {
              const groups = groupBlocks(s.blocks.filter((block, index) => !(index === 0 && block.type === "heading" && block.text === s.title)));
              return (
                <div className="strategy-section" key={i}>
                  <h2>{s.title}</h2>
                  <Accordion
                    type="multiple"
                    defaultValue={groups.map((_, j) => "group-" + i + "-" + j)}
                  >
                    {groups.map((g, j) => g.title ? (
                      <AccordionItem value={"group-" + i + "-" + j} key={j}>
                        <AccordionTrigger className="editorial-accordion-trigger">
                          <span>
                            {g.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Blocks blocks={g.blocks} />
                        </AccordionContent>
                      </AccordionItem>
                    ) : <Blocks key={j} blocks={g.blocks} />)}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
