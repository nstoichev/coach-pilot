import type { ComponentProps } from 'react'

type SvgProps = ComponentProps<'svg'>

type IconProps = Omit<SvgProps, 'viewBox' | 'xmlns'>

export const IconArrowUp = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3L3.5 7.5L4.56 8.56L7.25 5.87V13H8.75V5.87L11.44 8.56L12.5 7.5L8 3Z"
      fill="currentColor"
    />
  </svg>
)

export const IconArrowDown = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 13L12.5 8.5L11.44 7.44L8.75 10.13V3H7.25V10.13L4.56 7.44L3.5 8.5L8 13Z"
      fill="currentColor"
    />
  </svg>
)

export const IconArrowUpSmall = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3L3.75 7.25L4.78 8.28L7.25 5.81V13H8.75V5.81L11.22 8.28L12.25 7.25L8 3Z"
      fill="currentColor"
    />
  </svg>
)

export const IconArrowDownSmall = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 13L12.25 8.75L11.22 7.72L8.75 10.19V3H7.25V10.19L4.78 7.72L3.75 8.75L8 13Z"
      fill="currentColor"
    />
  </svg>
)

export const IconXSmall = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.22 4.22L7.0 7.0L9.78 4.22L11.0 5.44L8.21 8.23L11.0 11.01L9.78 12.23L7.0 9.45L4.22 12.23L3.0 11.01L5.79 8.23L3.0 5.44L4.22 4.22Z"
      fill="currentColor"
    />
  </svg>
)

