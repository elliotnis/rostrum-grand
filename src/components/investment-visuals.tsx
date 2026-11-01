import { ArrowRight, ArrowDown, Building2, SearchCheck, Users } from "lucide-react";

// Illustrations describe investment categories; they do not depict returns or holdings.
export function InvestmentIllustration({ category }: { category: string }) {
  return (
    <div className={`investment-illustration illustration-${category}`} aria-hidden="true">
      <svg viewBox="0 0 320 156" fill="none">
        <path className="illustration-grid" d="M0 39H320M0 78H320M0 117H320M64 0V156M128 0V156M192 0V156M256 0V156" />
        {category === "asset-based-finance" && (
          <>
            <path className="illustration-wash" d="M57 75 111 44 165 75V125H57Z" />
            <path d="m48 76 63-37 63 37M57 72v53h108V72M83 125V89h55v36M100 89v36M120 89v36" />
            <rect className="illustration-paper" x="198" y="33" width="67" height="92" rx="3" />
            <path d="M213 53h36M213 65h28M213 78h36M213 109h17" />
            <circle className="illustration-accent" cx="252" cy="108" r="17" />
            <path d="m245 108 5 5 9-11M169 56h15m-5-5 5 5-5 5M183 109h-12m5-5-5 5 5 5" />
          </>
        )}
        {category === "fixed-income-credit" && (
          <>
            <rect className="illustration-wash" x="66" y="27" width="102" height="88" rx="4" transform="rotate(-8 66 27)" />
            <rect className="illustration-paper" x="90" y="35" width="102" height="88" rx="4" />
            <path d="M106 55h39M106 67h67M106 79h50M106 104h24" />
            <circle className="illustration-accent" cx="182" cy="104" r="24" />
            <path d="M175 98h14M175 105h14M179 94v18M185 94v18M226 51v45m-5-5 5 5 5-5" />
            <circle className="illustration-paper" cx="226" cy="41" r="10" />
            <circle className="illustration-paper" cx="226" cy="115" r="10" />
            <path d="M240 41h20M240 115h20" />
          </>
        )}
        {category === "private-equity" && (
          <>
            <path d="M160 48v20M83 89V68h154v21M160 68v21" />
            <circle className="illustration-accent" cx="160" cy="31" r="18" />
            <path d="m152 31 6 6 10-12" />
            {[53,130,207].map((x) => (
              <g key={x}>
                <rect className="illustration-paper" x={x} y="89" width="60" height="47" rx="3" />
                <path d={`M${x+12} 102h10m8 0h10M${x+12} 113h10m8 0h10M${x+25} 136v-12h10v12`} />
              </g>
            ))}
          </>
        )}
        {category === "quantitative" && (
          <>
            <rect className="illustration-paper" x="54" y="24" width="212" height="110" rx="5" />
            <path d="M54 46h212M68 35h2m8 0h2m8 0h2" />
            {[0,1,2].map(row => [0,1,2,3,4,5].map(col => (
              <circle key={`${row}-${col}`} className={(row+col)%3===0 ? "illustration-accent" : "illustration-dot"} cx={80+col*32} cy={65+row*25} r="5" />
            )))}
            <path className="illustration-signal" d="m80 115 32-25 32 25 32-50 32 25 32-25" />
          </>
        )}
        {category === "real-assets" && (
          <>
            <path className="illustration-wash" d="M57 124V53l48-20v91Z" />
            <path d="M46 125h228M57 124V53l48-20v91M68 61v8m15-14v8M68 81v8m15-14v8M68 101v8m15-14v8M115 124V71h44v53M128 84h17m-17 13h17m-17 13h17" />
            <path d="M173 124V99h90v25M176 100l39-25 45 25M215 75v49M185 124v-16m14 16v-25m34 25V99m14 25v-16" />
            <circle className="illustration-accent" cx="232" cy="45" r="19" />
            <path d="M232 26v38m-19-19h38" />
          </>
        )}
        {category === "regional-thematic" && (
          <>
            <circle className="illustration-wash" cx="160" cy="79" r="57" />
            <circle cx="160" cy="79" r="57" />
            <ellipse cx="160" cy="79" rx="26" ry="57" />
            <path d="M103 79h114M114 45h92M114 113h92" />
            <path className="illustration-signal" d="m112 98 38-47 47 37 48-49" />
            {[[112,98],[150,51],[197,88],[245,39]].map(([x,y]) => <circle key={x} className="illustration-accent" cx={x} cy={y} r="7" />)}
          </>
        )}
      </svg>
    </div>
  );
}

export function ConnectionDiagram() {
  return (
    <figure className="connection-diagram" aria-labelledby="connection-title">
      <figcaption id="connection-title">How Rostrum Grand connects the two sides</figcaption>
      <div className="connection-flow">
        <div className="connection-party">
          <Building2 size={33} strokeWidth={1.2} aria-hidden="true" />
          <strong>Fund managers</strong>
          <span>Investment strategies</span>
        </div>
        <ArrowRight className="connection-arrow" size={23} aria-hidden="true" />
        <div className="connection-rg">
          <span className="connection-rg-mark">RG</span>
          <strong>Rostrum Grand</strong>
          <span>Create · Curate · Connect</span>
        </div>
        <ArrowRight className="connection-arrow" size={23} aria-hidden="true" />
        <div className="connection-party">
          <Users size={33} strokeWidth={1.2} aria-hidden="true" />
          <strong>Investors</strong>
          <span>Institutions & professional investors</span>
        </div>
      </div>
      <div className="connection-distribution">
        <ArrowDown size={18} aria-hidden="true" />
        <span>Working with banks, asset managers and other financial intermediaries.</span>
      </div>
    </figure>
  );
}

const reviewAreas: Record<string, { title: string; items: string[]; outcome: string }> = {
  analyse: {title:"Build a shortlist",items:["Markets & investment themes","Investment strategies","Fund managers"],outcome:"Strategies to investigate"},
  diligence: {title:"Review the manager",items:["Performance & consistency","Liquidity & risk","Process & controls"],outcome:"A detailed manager assessment"},
  design: {title:"Work through the structure",items:["Investor objectives","Fund domicile & regulation","Service providers & costs"],outcome:"An investment product"},
  distribute: {title:"Connect with investors",items:["Financial institutions","Regional intermediaries","Institutional & private capital"],outcome:"Distribution across regions"},
};
export function ProcessIllustration({ step }: { step: string }) {
  const area = reviewAreas[step];
  return (
    <figure className="process-illustration">
      <figcaption><SearchCheck size={19} aria-hidden="true" />{area.title}</figcaption>
      <div className="process-inputs">
        {area.items.map((item,i) => <div key={item}><span>0{i+1}</span>{item}<span className="process-input-dot" /></div>)}
      </div>
      <div className="process-outcome"><ArrowDown size={18} aria-hidden="true" /><span>{area.outcome}</span></div>
    </figure>
  );
}
