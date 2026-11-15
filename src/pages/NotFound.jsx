import { Link } from "react-router-dom";
import PagePlaceholder from "../components/PagePlaceholder";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <PagePlaceholder
      title="Page not found"
      description="This address does not match any page in the archive."
    >
      <div className="placeholder__actions">
        <Link to="/" className="button button--primary">
          Back to home
        </Link>
      </div>
    </PagePlaceholder>
  );
}
