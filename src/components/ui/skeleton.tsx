import * as React from "react"
import {
  Skeleton as SkulletSkeleton,
  SkeletonBox,
  SkeletonSuspense as SkulletSkeletonSuspense,
} from "skullet/react"
import { cn } from "@/lib/utils"

type SkeletonProps = Omit<React.ComponentProps<"div">, "aria-hidden">

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      data-slot="skeleton"
      className={cn("overflow-hidden rounded-md", className)}
    >
      <SkeletonBox
        className="block size-full"
        height="100%"
        radius="inherit"
        width="100%"
      />
    </div>
  )
}

const SkeletonReveal = SkulletSkeleton
const SkeletonSuspense = SkulletSkeletonSuspense

export { Skeleton, SkeletonReveal, SkeletonSuspense }
