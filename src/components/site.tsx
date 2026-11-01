import { publicUrl } from "@/lib/urls";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Menu } from "lucide-react";
import { preferredScrollBehavior } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { site, strategies, type Block } from "@/lib/content";

const mainLinks = [
  { to: "/", label: "Home" }, { to: "/rg-lab", label: "RG Lab" },
  { to: "/investment-universe", label: "Investment Universe" },
  { to: "/about-us", label: "About Us" }, { to: "/philanthropy", label: "Philanthropy" },
  { to: "/rg-corner", label: "RG Corner" }, { to: "/contact-us", label: "Contact Us" },
];
export function Brand({ light = false }: { light?: boolean }) {
  return <Link className={`brand ${light ? "brand-light" : ""}`} to="/" aria-label="Rostrum Grand home"><img src={publicUrl("/assets/RG_LogoFInal.png")} alt="Rostrum Grand" width="230" height="61" /></Link>;
}
export function Header() {
  const location = useLocation();
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header"><div className="container header-inner"><Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {mainLinks.slice(0,2).map(link => <NavLink end={link.to === "/"} className="nav-link" key={link.to} to={link.to}>{link.label}</NavLink>)}
        <NavigationMenu viewport={false}><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger className={`nav-link ${location.pathname.startsWith("/investment-universe") ? "nav-active" : ""}`}>Investment Universe</NavigationMenuTrigger><NavigationMenuContent className="investment-dropdown"><div className="dropdown-intro"><Link to="/investment-universe">Investment Universe <ArrowUpRight size={19} /></Link></div><div className="dropdown-links">{strategies.map(s => <NavigationMenuLink asChild key={s.slug}><Link to={"/investment-universe/"+s.slug}>{s.name}<ArrowUpRight size={16} /></Link></NavigationMenuLink>)}</div></NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu>
        {mainLinks.slice(3,6).map(link => <NavLink className="nav-link" key={link.to} to={link.to}>{link.label}</NavLink>)}
      </nav>
      <Button asChild className="contact-button btn-gold"><Link to="/contact-us">Contact Us</Link></Button>
      <Sheet><SheetTrigger asChild><Button className="mobile-menu-button" variant="ghost" size="icon" aria-label="Open navigation"><Menu /></Button></SheetTrigger><SheetContent className="mobile-sheet"><SheetTitle><Brand /></SheetTitle><SheetDescription>Rostrum Grand</SheetDescription><nav aria-label="Mobile navigation">{mainLinks.map(link => <div key={link.to}><SheetClose asChild><Link to={link.to}>{link.label}</Link></SheetClose>{link.to === "/investment-universe" && <div className="mobile-strategies">{strategies.map(s => <SheetClose asChild key={s.slug}><Link to={"/investment-universe/"+s.slug}>{s.name}<ArrowUpRight size={16} /></Link></SheetClose>)}</div>}</div>)}</nav></SheetContent></Sheet>
    </div></header>
  </>;
}
export function Footer({ onDisclaimer }: { onDisclaimer: () => void }) {
  return <footer className="site-footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Brand /><a className="social-link" href="https://www.linkedin.com/company/rostrum-grand/" target="_blank" rel="noreferrer" aria-label="Rostrum Grand on LinkedIn">in</a></div><nav className="footer-links" aria-label="Footer navigation">{[mainLinks[0],mainLinks[1],mainLinks[2],mainLinks[4],mainLinks[3],mainLinks[6]].map(link => <Link key={link.to} to={link.to}>{link.label}</Link>)}</nav><div className="footer-contact"><a href="mailto:ir@rostrumgrand.com">ir@rostrumgrand.com</a><a href="tel:+85235609870">+852 3560 9870</a><p>Rostrum Grand Limited<br />Unit 1601-02, Universal Trade Centre<br />3 Arbuthnot Road, Central, Hong Kong</p></div></div><div className="footer-bottom"><span>© Copyright Rostrum Grand {new Date().getFullYear()}</span><div><Link to="/terms-conditions">Terms & conditions</Link><Link to="/privacy-policy">Privacy Policy</Link><button onClick={onDisclaimer}>Disclaimer</button></div></div></div></footer>;
}
export function Disclaimer({open,onOpenChange}:{open:boolean;onOpenChange:(open:boolean)=>void}) {
  const [declined,setDeclined] = useState(false);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="disclaimer-dialog"><DialogTitle>{site.disclaimer.title}</DialogTitle><DialogDescription asChild><div className="legal-copy">{site.disclaimer.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div></DialogDescription>{declined && <p className="notice-text" role="status">This content is intended for professional investors. Please contact our team if you need further information.</p>}<div className="dialog-actions"><Button className="btn-gold" onClick={()=>onOpenChange(false)}>Accept <ArrowRight size={17} /></Button><Button className="btn-outline" variant="outline" onClick={()=>setDeclined(true)}>Decline</Button></div></DialogContent></Dialog>;
}
export function TextLink({to,children,light=false}:{to:string;children:React.ReactNode;light?:boolean}) {
  return <Link className={`text-link ${light ? "text-link-light" : ""}`} to={to}>{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}
export function Eyebrow({children}:{children:React.ReactNode}) { return <div className="eyebrow">{children}</div>; }
export function PageHero({eyebrow,title,accent,description,image,children}:{eyebrow?:string;title:string;accent?:string;description?:string;image?:string;children?:React.ReactNode}) {
  return <section className={`page-hero ${image ? "page-hero-image" : ""}`}><div className="container"><div className="page-hero-copy">{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h1>{title}{accent && <> <span className="heading-subtitle">{accent}</span></>}</h1>{description && <p>{description}</p>}{children}</div>{image && <div className={`page-hero-photo ${image.endsWith(".jpg") ? "photo-editorial" : ""}`}><img src={image} alt="" fetchPriority="high" /></div>}</div></section>;
}
export function Blocks({blocks,skipFirst=false}:{blocks:Block[];skipFirst?:boolean}) {
  return <div className="prose">{blocks.filter((_,i)=>!(skipFirst && i===0)).map((block,i)=>block.type === "heading" ? <h3 key={i}>{block.text}</h3> : block.type === "item" ? <div className="prose-item" key={i}><span aria-hidden="true" /><p>{block.text}</p></div> : <p key={i}>{block.text}</p>)}</div>;
}
export function ScrollManager() {
  const {pathname,hash}=useLocation();
  useEffect(()=>{
    const titles:Record<string,string>={"/":site.homeHero.title,"/rg-lab":"RG Lab","/investment-universe":"Investment Universe","/about-us":"About Us","/philanthropy":"Philanthropy","/rg-corner":"RG Corner","/contact-us":"Contact Us","/terms-conditions":"Terms & conditions","/privacy-policy":"Privacy Policy"};
    const path = pathname.replace(/\/+$/, "") || "/";
    document.title=(titles[path] ?? strategies.find(strategy => path === "/investment-universe/" + strategy.slug)?.name ?? "Rostrum Grand") + " | Rostrum Grand";
    if(hash){const timer=setTimeout(()=>document.getElementById(hash.slice(1))?.scrollIntoView({behavior:preferredScrollBehavior()}),80);return ()=>clearTimeout(timer);}
    window.scrollTo({top:0,behavior:"instant"});
  },[pathname,hash]);
  return null;
}
