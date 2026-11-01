import { Link } from "react-router-dom";
import { PageHero, Blocks, TextLink } from "@/components/site";
import { sections, site } from "@/lib/content";
export function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal information" title="Terms & conditions" />
      <section className="section-space">
        <div className="container legal-page">
          <Blocks
            blocks={sections("/terms-conditions")
              .flatMap((s) => s.blocks)
              .filter((b) => b.text !== "Terms & conditions")}
          />
          <div className="legal-enquiries">
            <h3>Further information</h3>
            <p>
              For questions about these terms, please contact{" "}
              <a href={"mailto:" + site.email}>{site.email}</a>.
            </p>
            <TextLink to="/contact-us">Contact Rostrum Grand</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
export function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal information" title="Privacy Policy" />
      <section className="section-space">
        <div className="container legal-page">
          <h2>Privacy enquiries</h2>
          <p>
            For information about how Rostrum Grand handles personal
            information, please contact{" "}
            <a href={"mailto:" + site.email}>{site.email}</a>.
          </p>
          <p>
            The existing website’s privacy policy page does not contain
            published policy text.{" "}
            <a
              href="https://rostrumgrand.com/privacy-policy/"
              target="_blank"
              rel="noreferrer"
            >
              View the original page.
            </a>
          </p>
          <TextLink to="/contact-us">Contact Rostrum Grand</TextLink>
        </div>
      </section>
    </>
  );
}
export function NotFound() {
  return (
    <section className="container section-space empty-state">
      <span className="eyebrow">404</span>
      <h1>
        Page <em>not found.</em>
      </h1>
      <p>The page you’re looking for could not be found.</p>
      <Link className="text-link" to="/">
        Return to our homepage
      </Link>
    </section>
  );
}
