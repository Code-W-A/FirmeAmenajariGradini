import PortableContent from "@/components/sanity/PortableContent";
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "h2",
  "h3",
  "blockquote",
];

const ALLOWED_ATTR = ["href", "title", "target", "rel"];

function enforceLinkRel(html) {
  return html
    .replace(/<a\b(?![^>]*\brel=)/gi, '<a rel="nofollow noopener noreferrer"')
    .replace(/<a\b(?![^>]*\btarget=)/gi, '<a target="_blank"');
}

function sanitizeHtml(value) {
  if (typeof value !== "string" || !value.trim()) return "";

  const sanitized = DOMPurify.sanitize(value, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["style"],
  });

  return enforceLinkRel(sanitized);
}

const DescriptionsText = ({ firma }) => {
  const firstHtml = sanitizeHtml(firma?.articleContentFirst);
  const secondHtml = sanitizeHtml(firma?.articleContentSecond);

  return (
    <>
      {Array.isArray(firma?.articleContentFirst) ? (
        <PortableContent value={firma.articleContentFirst} />
      ) : (
        firstHtml && <div dangerouslySetInnerHTML={{ __html: firstHtml }} />
      )}
      {secondHtml && <div dangerouslySetInnerHTML={{ __html: secondHtml }} />}
    </>
  );
};

export default DescriptionsText;
