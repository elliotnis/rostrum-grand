import { publicUrl } from "@/lib/urls";
import { ArrowUpRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Blocks, PageHero } from "@/components/site";
import { sections, paragraphs, site } from "@/lib/content";
const pillarImages = ["performance.png","team-strength.png","organisational-culture.png","leadership-quality.png","financials.png","third-party.png","it-infrastructure.png","risk-compliance.png"];
const designImages = ["Fund-Domicile.png","Investor-Objective.png","Regulatory-landscape.png","Fund-eco-system.png","Fee-structuring.png","Risk-Management.png","Client-reporting.png","Risk-&-compliance.png"];
export default function Lab() {
  const lab=sections("/rg-lab");
  const analyse=lab.find(s=>s.id==="analyse")!;
  const diligence=lab.find(s=>s.id==="due-diligence")!;
  const design=lab.find(s=>s.id==="design")!;
  const distribution=lab.find(s=>s.id==="distribute")!;
  return <>
    <PageHero eyebrow="RG Lab" title={lab[0].title} description={paragraphs(lab[0])[0]} image={publicUrl("/assets/architecture.jpg")}  />
    <div className="container"><nav className="lab-jump-nav" aria-label="RG Lab sections">{[{id:"analyse",name:"Analyse"},{id:"due-diligence",name:"D3M"},{id:"design",name:"Design"},{id:"distribute",name:"Distribute"}].map(step=><a href={"#"+step.id} key={step.id}>{step.name}<ArrowUpRight size={17} aria-hidden="true" /></a>)}</nav></div>
    <section className="section-space lab-content" id="analyse"><div className="container"><div className="original-split"><div><h5 className="eyebrow">Analyse</h5><h2>{analyse.title}</h2><Blocks blocks={analyse.blocks.filter(b=>b.type!=="heading")} /></div><img className="brand-art" src={publicUrl("/assets/alpha_1.png")}  alt="" loading="lazy" /></div><div className="alpha-criteria"><h2>{lab[2].title}</h2><p>{paragraphs(lab[2])[0]}</p><Accordion type="multiple" className="alpha-accordion">{site.criteria.map((criterion,i)=><AccordionItem key={criterion.title} value={"criterion-"+i}><AccordionTrigger className="editorial-accordion-trigger"><span><img src={publicUrl("/assets/"+["skill.png","inaccessible-risk.png","alternative-beta.png","inefficient-markets.png","institutional-asset.png"][i])} alt="" width="46" height="46" loading="lazy" />{criterion.title}</span></AccordionTrigger><AccordionContent><div className="prose">{criterion.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</div></AccordionContent></AccordionItem>)}</Accordion></div></div></section>
    <section className="section-space section-surface lab-content" id="due-diligence"><div className="container"><div className="original-split"><div><h2>{diligence.title}</h2><Blocks blocks={diligence.blocks.slice(1,3)} /></div><img className="brand-art" src={publicUrl("/assets/due-diligence-image1.png")}  alt="" loading="lazy" /></div><div className="lab-pillar-grid">{diligence.blocks.slice(3).map((block,i)=><div key={block.text}><img src={publicUrl("/assets/"+pillarImages[i])} alt="" width="54" height="54" loading="lazy" /><h3>{block.text}</h3></div>)}</div></div></section>
    <section className="section-space lab-content" id="design"><div className="container"><div className="original-split"><img className="brand-art" src={publicUrl("/assets/design-image.png")}  alt="" loading="lazy" /><div><h2>{design.title}</h2><Blocks blocks={design.blocks.slice(1,3)} /></div></div><div className="lab-pillar-grid">{design.blocks.slice(3).map((block,i)=><div key={block.text}><img src={publicUrl("/assets/"+designImages[i])} alt="" width="54" height="54" loading="lazy" /><h3>{block.text}</h3></div>)}</div></div></section>
    <section className="section-space section-surface lab-content" id="distribute"><div className="container distribution-layout"><div><h2>{distribution.title}</h2><Blocks blocks={distribution.blocks.slice(1)} /></div><img className="brand-art" src={publicUrl("/assets/globe.png")}  alt="" loading="lazy" /></div></section>
  </>;
}
