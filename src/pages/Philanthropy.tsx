import { publicUrl } from "@/lib/urls";
import { PageHero } from "@/components/site";
import { sections } from "@/lib/content";
export default function Philanthropy() {
  const source=sections("/philanthropy");
  const paragraphs=source.flatMap(section=>section.blocks).filter(block=>block.type==="paragraph");
  return <>
    <PageHero eyebrow="Philanthropy" title={source[0].title} description={paragraphs[0]?.text} image={publicUrl("/assets/heart-in-hand.png")}  />
    <section className="section-space"><div className="container">{[{title:"Children's Education",image:"children-education.png",text:paragraphs[1]?.text},{title:"Elderly Care",image:"elderly-care.png",text:paragraphs[2]?.text}].map((item,i)=><div className={`giving-row ${i ? "giving-row-reverse" : ""}`} key={item.title}><div className="giving-photo"><img src={publicUrl("/assets/"+item.image)} alt="" loading="lazy" /></div><div className="giving-copy"><h2>{item.title}</h2><p>{item.text}</p></div></div>)}</div></section>
  </>;
}
