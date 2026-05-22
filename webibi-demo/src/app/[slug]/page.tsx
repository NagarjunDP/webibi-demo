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
    <div className="w-screen h-screen overflow-hidden m-0 p-0 fixed inset-0">
      <iframe 
        src={`/demos/${slug}.html`} 
        className="w-full h-full border-0"
        title={`${slug} Demo Website`}
      />
    </div>
  );
}
