import { TopNav } from "@/components/global/TopNav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SiGraphql,
  SiNextdotjs,
  SiPlanetscale,
  SiPrisma,
  SiReact,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";

export default async function Page() {
  return (
    <>
      <TopNav />
      <main className="prose mx-auto mt-6 flex max-w-full flex-col items-center gap-2 dark:prose-invert">
        <div className="max-w-2xl">
          <h1>About</h1>
          <h2>Why?</h2>
          <p>
            This app was built as a replacement to other todo list apps, which
            didn&apos;t provide all the functionality I needed or depended on a
            monthly subscription. Building it has been a great learning
            experience, and I hope others can learn from it as well!
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <h2>Tech Stack</h2>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Technology</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frontend Framework</td>
                <td>
                  <SiReact className="mr-2 inline h-4 w-4 fill-[#61DAFB]" />
                  <Link href="https://react.dev/">React</Link>
                </td>
              </tr>
              <tr>
                <td>API</td>
                <td>
                  <SiGraphql className="mr-2 inline h-4 w-4 fill-[#E10098]" />
                  <Link href="https://the-guild.dev/graphql/yoga-server">
                    GraphQL Yoga
                  </Link>
                </td>
              </tr>
              <tr>
                <td>API Client</td>
                <td>
                  <SiGraphql className="mr-2 inline h-4 w-4 fill-[#E10098]" />
                  <Link href="https://formidable.com/open-source/urql/">
                    urql
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Styling</td>
                <td>
                  <SiTailwindcss className="mr-2 inline h-4 w-4 fill-[#06B6D4]" />
                  <Link href="https://tailwindcss.com/">TailwindCSS</Link>
                </td>
              </tr>
              <tr>
                <td>UI Primitives</td>
                <td>
                  <ShadCNIcon className="mr-2 inline h-4 w-4 fill-black dark:fill-white" />
                  <Link href="https://ui.shadcn.com/">shadcn/ui</Link>
                </td>
              </tr>
              <tr>
                <td>
                  <abbr title="Object-Relational Mapper">ORM</abbr>
                </td>
                <td>
                  <SiPrisma className="mr-2 inline h-4 w-4 fill-[#2D3748] dark:fill-white" />
                  <Link href="https://www.prisma.io/">Prisma</Link>
                </td>
              </tr>
              <tr>
                <td>Full-Stack Framework</td>
                <td>
                  <Link href="https://nextjs.org/">
                    <SiNextdotjs className="mr-2 inline h-4 w-4 fill-black dark:fill-white" />
                    Next.js 13
                  </Link>{" "}
                  <code>app</code> directory
                </td>
              </tr>
              <tr>
                <td>Hosting</td>
                <td>
                  <SiVercel className="mr-2 inline h-4 w-4 fill-black dark:fill-white" />
                  <Link href="https://vercel.com/">Vercel</Link>
                </td>
              </tr>
              <tr>
                <td>Database</td>
                <td>
                  <SiPlanetscale className="mr-2 inline h-4 w-4 fill-black dark:fill-white" />
                  <Link href="https://planetscale.com/">Planetscale</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Extra padding at the bottom of the page*/}
        <div className="mb-52" />
      </main>
    </>
  );
}

const ShadCNIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cn("h-6 w-6", className)}
    viewBox="0 0 256 256"
  >
    <path fill="none" d="M0 0H256V256H0z"></path>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      d="M208 128L128 208"
    ></path>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      d="M192 40L40 192"
    ></path>
  </svg>
);
