import { buttonVariants } from "@/components/ui/button"

function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        <h1 className="text-xl font-bold">
          TuProyecto
        </h1>

        <nav className="flex items-center gap-6">
          <a href="/">Home</a>
          <a href="/">Latest</a>
          <a href="/">Popular</a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </a>
          <a
            href="/register"
            className={buttonVariants({ variant: "default" })}>
            Register
          </a>
        </div>

      </div>
    </header>
  )
}

export default Header