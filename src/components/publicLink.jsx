import style from "./publicLink.module.css";

export default function PublicLink({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={style.publicLinkContainer}
    >
      <div>{link.title}</div>
    </a>
  );
}
