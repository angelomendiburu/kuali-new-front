import { LoginForm } from "@/components/loginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-0">
      <div className="w-full max-w-[1000px] p-4">
        <LoginForm />
      </div>
    </div>
  )
}

