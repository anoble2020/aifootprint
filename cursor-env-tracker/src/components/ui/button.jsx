import React from 'react'

export function Button({ className = '', size = 'md', variant = 'primary', asChild = false, children, ...props }) {
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    ghost: 'bg-transparent hover:bg-muted',
  }
  const classes = `inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${classes} ${children.props.className || ''}`.trim(),
      ...props,
    })
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
