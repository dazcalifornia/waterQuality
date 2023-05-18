import Link from "next/link"
export default function Home() {
  return (
    <>
      <header>
        <h2>under construction</h2>
      </header>
        <main>
          <p>
            under construction
          </p>
        </main>
        <p>© 2021 - 2022</p>

      <footer>
        <nav>
          <ul>
            <li>
              <Link href="/about">
                <i className="fas fa-info-circle"></i>
                <p>About</p>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <i className="fas fa-envelope"></i>
                <p>Contact</p>
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  )
}
