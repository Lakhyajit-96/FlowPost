import { SignIn } from "@clerk/nextjs"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10" suppressHydrationWarning>
      <div className="flex w-full max-w-sm flex-col gap-6" suppressHydrationWarning>
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
            <Logo size={24} />
          </div>
          FlowPost
        </Link>
        <div suppressHydrationWarning>
          <SignIn 
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none border bg-card",
                headerTitle: "text-xl font-semibold",
                headerSubtitle: "text-sm text-muted-foreground",
                socialButtonsBlockButton: "border hover:bg-muted",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/90",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
