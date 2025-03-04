"use client"
import { createContext, useContext } from "react"

const ChartContext = createContext({})

function ChartContainer({ config, children, className, ...props }) {
  const colors = {}

  for (const [key, value] of Object.entries(config)) {
    colors[`--color-${key}`] = value.color
  }

  return (
    <ChartContext.Provider value={config}>
      <div
        className={className}
        style={{
          ...colors,
          width: "100%",
          height: "100%",
        }}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  formatter,
  labelFormatter,
  hideLabel = false,
  formatValue = (value) => value,
  ...props
}) {
  const config = useContext(ChartContext)

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm" {...props}>
      {!hideLabel && (
        <p className="text-xs font-medium text-foreground">{labelFormatter ? labelFormatter(label) : label}</p>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, index) => {
          const dataKey = item.dataKey
          const configItem = config[dataKey]
          return (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div
                  className="h-1 w-1 rounded-full"
                  style={{
                    background: configItem?.color || item.color || item.fill || "#888",
                  }}
                />
                <span className="text-xs font-medium text-muted-foreground">{configItem?.label || dataKey}</span>
              </div>
              <span className="text-xs font-medium text-foreground">
                {formatter ? formatter(item.value, item.name, item, index) : formatValue(item.value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }

