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
          <button>Login</button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            Register
          </button>
        </div>

      </div>
    </header>
  )
}

export default Header