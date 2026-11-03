import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Reveal from "@/components/Reveal";

// This page is a WORKING STARTER that exercises the whole motion layer so the
// stack builds green before you touch it. Replace the placeholder copy, sections
// and signature visual with the user's product content in the reference's style.
// Reach into references/patterns.md for sticky tours, horizontal scroll, etc.

export default function Page() {
  return (
    <SmoothScroll>
      <ScrollProgress />

      <section className="section hero">
        <div className="blob" style={{ top: "-10vw", right: "-8vw" }} data-speed="80" />
        <div className="inner" style={{ position: "relative", zIndex: 1 }}>
          <p className="eyebrow">Replace · eyebrow</p>
          <Reveal
            as="h1"
            text="A headline that borrows the reference"
            accent={["borrows"]}
          />
          <p className="lead rise" style={{ marginTop: "1.5rem" }}>
            Replace this with the product&rsquo;s real value proposition, written in
            the reference site&rsquo;s tone.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="inner">
          <Reveal className="h2" text="A section that reveals on scroll" />
          <div
            className="rise"
            style={{
              marginTop: "2.5rem",
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {["One", "Two", "Three"].map((n) => (
              <div
                key={n}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  padding: "28px",
                  boxShadow: "var(--shadow)",
                }}
              >
                <h3 className="h2" style={{ fontSize: "1.3rem" }}>
                  {n}
                </h3>
                <p className="lead" style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
                  Replace with a real feature. Cards rise in via the `.rise` class.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ textAlign: "center" }}>
        <div className="inner">
          <Reveal className="h2" text="Closing call to action" accent={["action"]} />
        </div>
      </section>
    </SmoothScroll>
  );
}
