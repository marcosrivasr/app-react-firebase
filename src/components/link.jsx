export default function Link({ title, url }) {
  return (
    <div className="link">
      <div>{title}</div>
      <div>{url}</div>
    </div>
  );
}
