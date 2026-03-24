import type { ComponentProps } from 'react'

type SvgProps = ComponentProps<'svg'>

type IconProps = Omit<SvgProps, 'viewBox' | 'xmlns'>

export const IconArrowUp = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
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
    width="20"
    height="20"
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
    width="18"
    height="18"
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
    width="18"
    height="18"
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

/** Trash / bin — builder remove actions */
export const IconTrashSmall = (props: IconProps) => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.75 2.5a.75.75 0 01.75-.75h1a.75.75 0 01.75.75V3h3.25a.75.75 0 010 1.5h-.45l-.58 7.62A1.75 1.75 0 019.67 14H6.33a1.75 1.75 0 01-1.75-1.88L4 4.5H3.5a.75.75 0 010-1.5H6.75V2.5zm.75 1.5h1V3.25h-1V4zm-2.4 1.5l.52 7h5.26l.52-7H5.1zM7 7.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75z"
      fill="currentColor"
    />
  </svg>
)

