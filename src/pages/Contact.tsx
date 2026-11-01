import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
type Enquiry = {
  first: string;
  last: string;
  email: string;
  phone: string;
  message: string;
};
export default function Contact() {
  const [fields, setFields] = useState<Enquiry>({
    first: "",
    last: "",
    email: "",
    phone: "",
    message: "",
  });
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const update = (key: keyof Enquiry, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));
  const body = `Name: ${fields.first} ${fields.last}\nEmail: ${fields.email}\nPhone: ${fields.phone}\n\n${fields.message}`;
  const mailto =
    "mailto:ir@rostrumgrand.com?subject=" +
    encodeURIComponent(
      "Website enquiry - " + fields.first + " " + fields.last,
    ) +
    "&body=" +
    encodeURIComponent(body);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true);
  };
  return (
    <>
      <section className="contact-page">
        <div className="container contact-layout">
          <div className="contact-intro">
            <h1>Reach us</h1>
            <div className="contact-details">
              <div>
                <MapPin size={19} />
                <div>
                  <h2>Rostrum Grand Limited</h2>
                  <p>
                    Unit 1601–02, Universal Trade Centre
                    <br />3 Arbuthnot Road, Central, Hong Kong
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Universal+Trade+Centre+3+Arbuthnot+Road+Hong+Kong"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get directions
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              <a href="tel:+85235609870">
                <Phone size={18} />
                <span>+852 3560 9870</span>
                <ArrowUpRight size={15} />
              </a>
              <a href="mailto:ir@rostrumgrand.com">
                <Mail size={18} />
                <span>ir@rostrumgrand.com</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="contact-form-panel">
            <h2>Contact us</h2>
            <form onSubmit={submit}>
              <div className="form-row">
                <div>
                  <Label htmlFor="first-name">
                    First name <span>*</span>
                  </Label>
                  <Input
                    id="first-name"
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    required
                    value={fields.first}
                    onChange={(e) => update("first", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="last-name">
                    Last name <span>*</span>
                  </Label>
                  <Input
                    id="last-name"
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    required
                    value={fields.last}
                    onChange={(e) => update("last", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">
                  Phone number <span>*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone"
                  required
                  value={fields.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">
                  Email address <span>*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                  value={fields.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Your message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help?"
                  rows={4}
                  value={fields.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </div>
              <div className="form-bottom">
                <span>Your message will open in your email app.</span>
                <Button className="btn-navy" type="submit">
                  Send message
                  <ArrowUpRight size={17} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="enquiry-dialog">
          <DialogTitle>Your message is ready.</DialogTitle>
          <DialogDescription>
            Open your email app to review and send your enquiry to
            ir@rostrumgrand.com.
          </DialogDescription>
          <div className="enquiry-preview">
            <span>To: ir@rostrumgrand.com</span>
            <p>{body}</p>
          </div>
          <div className="dialog-actions">
            <Button asChild className="btn-navy">
              <a href={mailto}>
                Open email app
                <ExternalLink size={16} />
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(body);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span aria-live="polite">
                {copied ? "Copied" : "Copy message"}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
