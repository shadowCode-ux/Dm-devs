import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * PasswordInput — a text input that toggles between masked and visible text
 * via an eye icon. Forwards ref so it works with react-hook-form's register().
 */
const PasswordInput = forwardRef(function PasswordInput(
  { className = '', ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={`w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
})

export default PasswordInput
