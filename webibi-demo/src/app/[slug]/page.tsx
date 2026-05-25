import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function GeneratedSitePage({ params }: PageProps) {
  const { slug } = params;

  // We are currently mocking the backend for the local development.
  // When a user asks for /vivience-events, we will show the pre-built template from demo-template/dist
  // which we copied into public/demo.
  
  if (!slug) {
    notFound();
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      zIndex: 999999
    }}>
      <iframe 
        src={`/api/demos/${slug}/html`} 
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title={`${slug} Demo Website`}
      />
    </div>
  );
}
