import Link from 'next/link'
import DesktopLayout from '../components/layout/DesktopLayout'

const AboutPage = () => (
  <DesktopLayout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </DesktopLayout>
)

export default AboutPage
