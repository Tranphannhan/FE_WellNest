import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Slot } from "@radix-ui/react-slot" // ✅ Dùng Slot để hỗ trợ asChild
import { cn } from "@/lib/utils"

const Breadcrumb = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav className="w-full" {...props}>
      {children}
    </nav>
  )
}

const BreadcrumbList = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => {
  return (
    <ol className={cn("flex items-center gap-1", className)} {...props}>
      {children}
    </ol>
  )
}

const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="inline-flex items-center gap-1">{children}</li>
}

// ✅ Hỗ trợ asChild = true để dùng với <Link>
interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        ref={ref}
        className={cn("text-sm font-medium text-muted-foreground hover:text-primary", className)}
        {...props}
      />
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      role="link"
      aria-disabled="true"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

const BreadcrumbSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<SVGSVGElement>) => {
  return <ChevronRight className={cn("h-4 w-4 text-muted-foreground", className)} {...props} />
}

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("text-muted-foreground", className)} {...props}>
      ...
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
