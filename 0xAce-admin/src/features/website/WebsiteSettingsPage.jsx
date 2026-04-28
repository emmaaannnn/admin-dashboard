import "./WebsiteSettingsPage.css";

const websiteSections = [
  {
    title: "Home page",
    description: "Control featured drops, launch windows, and homepage copy.",
  },
  {
    title: "Operator manual",
    description: "Manage manual entries, QR flows, and product-linked reference content.",
  },
  {
    title: "Support content",
    description: "Manage policies, support text, and public information pages.",
  },
];

function WebsiteSettingsPage() {
  return (
    <div className="page-stack website-page">
      <section className="page-header-card">
        <p className="section-kicker">Website Settings</p>
        <h2>Storefront workspace</h2>
        <p className="page-copy">
          Website-facing controls are grouped separately so content management stays distinct from order and inventory operations.
        </p>
      </section>

      <section className="menu-grid" aria-label="Website sections">
        {websiteSections.map((section) => (
          <article key={section.title} className="menu-card menu-card--static">
            <span className="menu-card-label">{section.title}</span>
            <p>{section.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default WebsiteSettingsPage;