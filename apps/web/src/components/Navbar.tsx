import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

const navItems = [
  { label: 'Collections' },
  { label: 'Studio', hasDropdown: true },
  { label: 'Craft' },
  { label: 'Projects', hasDropdown: true },
]

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
      <div className="flex-1 hidden md:block" />
      <ul className="hidden md:flex items-center gap-8 text-charcoal font-normal text-sm">
        {navItems.map((item) => (
          <li
            key={item.label}
            className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group"
          >
            {item.label}
            {item.hasDropdown ? (
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            ) : null}
          </li>
        ))}
      </ul>
      <div className="md:hidden">
        <span className="font-display tracking-[-0.02em] text-2xl text-warmGrey">Maple</span>
      </div>
      <div className="flex-1 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center bg-maple-500 text-ivory rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-maple-600 transition-colors group shadow-[0_14px_34px_rgba(116,26,20,0.2)]"
        >
          <div className="bg-ivory/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-ivory" />
          </div>
          <span className="text-xs md:text-sm font-normal">Book Studio Visit</span>
        </motion.button>
      </div>
    </nav>
  )
}
