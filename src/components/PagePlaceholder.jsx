import "./PagePlaceholder.css";

/**
 * Temporary page body used until each page is built in a later phase.
 * `icon` is a Lucide component, `children` renders below the description.
 */
export default function PagePlaceholder({ icon: Icon, title, description, children }) {
  return (
    <section className="page container" aria-labelledby="page-title">
      <div className="placeholder">
        {Icon && <Icon className="placeholder__icon" aria-hidden="true" />}
        <h1 id="page-title">{title}</h1>
        <p className="placeholder__lead">{description}</p>
        {children}
        <p className="placeholder__note">
          This page is a placeholder. It will be built in a later phase.
        </p>
      </div>
    </section>
  );
}
