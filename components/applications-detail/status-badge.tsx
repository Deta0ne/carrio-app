import { cn } from "@/lib/utils"

type StatusType = "pending" | "interview" | "offer" | "rejected"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          color: "bg-yellow-500 text-white",
          emoji: "🟡",
        }
      case "interview":
        return {
          label: "Interview",
          color: "bg-blue-500 text-white",
          emoji: "🔵",
        }
      case "offer":
        return {
          label: "Offer",
          color: "bg-green-500 text-white",
          emoji: "🟢",
        }
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-red-500 text-white",
          emoji: "🔴",
        }
      default:
        return {
          label: status,
          color: "bg-gray-500 text-white",
          emoji: "⚪",
        }
    }
  }

  const { label, color, emoji } = getStatusConfig(status)

  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium", color)}>
      <span>{emoji}</span>
      {label}
    </div>
  )
}

