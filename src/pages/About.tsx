import { publicUrl } from "@/lib/urls";
import { ArrowUpRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Blocks, PageHero } from "@/components/site";
import { sections, site, paragraphs } from "@/lib/content";
const roles: Record<string, string> = {
  "Patricia Pyttlik":"Market Development", "Mohit Saxena":"Strategic Initiatives", "Charkrit Rukruang":"South East Asia",
  "Sreejesh Rajan":"Co-Founder & Managing Partner", "Dinesh Kangya":"Head of Product", "Sankalp Gupta":"Co-Founder & Managing Partner",
  "Blake Shefford":"Chief Investment Officer", "Iris Lau":"Chief Operating Officer",
};
export default function About() {
  const about=sections("/about-us");
  const values=about[2].blocks.slice(1);
  return <>
    <PageHero eyebrow="About Us" title={about[0].title} description={paragraphs(about[0])[0]} image={publicUrl("/assets/architecture-detail.jpg")}  />
    <section className="section-space"><div className="container vision-layout"><h2>{about[1].title}</h2><div className="vision-list">{about[1].blocks.filter(b=>b.type==="item").map((block,i)=><div key={block.text}><span>0{i+1}</span><h3>{block.text}</h3><ArrowUpRight size={20} aria-hidden="true" /></div>)}</div></div></section>
    <section className="section-space section-surface"><div className="container"><div className="section-heading centered"><h2>{about[2].title}</h2></div><div className="values-grid">{values.filter(b=>b.type==="heading").map((value,i)=><article key={value.text}><img src={publicUrl("/assets/our-values-"+(i+1)+".png")} alt="" width="64" height="64" loading="lazy" /><h3>{value.text}</h3><p>{values[values.indexOf(value)+1]?.text}</p></article>)}</div></div></section>
    {[3,4].map((index)=><section className="section-space" key={index}><div className={`container original-split ${index===4?"split-reverse":""}`}><div><h2>{about[index].title}</h2><Blocks blocks={about[index].blocks} skipFirst /></div><img className="brand-art" src={publicUrl("/assets/"+(index===3?"opportunities.png":"position.png"))} alt="" loading="lazy" /></div></section>)}
    <section className="section-space section-surface"><div className="container distribution-layout"><div><h2>{about[5].title}</h2><p>{paragraphs(about[5])[0]}</p></div><img className="brand-art" src={publicUrl("/assets/globe.png")}  alt="" loading="lazy" /></div></section>
    <section className="section-space team-section" id="team"><div className="container"><div className="section-heading centered"><h2>{about[6].title}</h2><p>{paragraphs(about[6])[0]}</p></div><div className="team-grid">{site.team.map(member=><Dialog key={member.name}><DialogTrigger asChild><button className="team-card" aria-label={"View profile: "+member.name}><div className="team-photo"><img src={publicUrl(member.image)} alt={member.name} loading="lazy" /><span><Plus size={19} /></span></div><div className="team-card-info"><h3>{member.name}</h3><p>{roles[member.name]}</p><ArrowUpRight size={18} aria-hidden="true" /></div></button></DialogTrigger><DialogContent className="team-dialog"><div className="team-dialog-photo"><img src={publicUrl(member.image)} alt={member.name} /></div><div className="team-dialog-copy"><DialogTitle>{member.name}</DialogTitle><span className="team-dialog-role">{roles[member.name]}</span><DialogDescription>{member.bio}</DialogDescription></div></DialogContent></Dialog>)}</div></div></section>
  </>;
}
