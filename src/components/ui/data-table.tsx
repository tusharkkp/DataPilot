import * as React from "react"
import { cn } from "@/lib/utils"

interface DataTableProps {
  data: any[]
  className?: string
}

export function DataTable({ data, className }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data to display
      </div>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <div className="glass-morphic rounded-xl border border-polaris-purple/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-polaris-purple/20 bg-polaris-purple/10">
              {columns.map((column) => (
                <th
                  key={column}
                  className="h-12 px-4 text-left align-middle font-medium text-polaris-purple"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-polaris-purple/10 hover:bg-polaris-purple/5 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column} className="p-4 align-middle text-foreground">
                    {row[column] !== null && row[column] !== undefined
                      ? String(row[column])
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
