import Link from 'next/link'
import DesktopLayout from '../components/layout/DesktopLayout'

const IndexPage = () => (
  <DesktopLayout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </DesktopLayout>
)

export default IndexPage
